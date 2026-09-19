#!/usr/bin/env python3
import argparse
import json
import sys
import tempfile
import time
from html.parser import HTMLParser
from pathlib import Path

import cv2


ROOT = Path(__file__).resolve().parents[1]
if str(ROOT / "tools") not in sys.path:
    sys.path.insert(0, str(ROOT / "tools"))

from detect_ticket_row_colors import classify_pixels  # noqa: E402


class TableHtmlParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.rows = []
        self.current_row = None
        self.current_cell = None

    def handle_starttag(self, tag, attrs):
        if tag == "tr":
            self.current_row = []
        elif tag in ("td", "th") and self.current_row is not None:
            attr_map = dict(attrs)
            self.current_cell = {
                "text": "",
                "rowspan": int(attr_map.get("rowspan") or 1),
                "colspan": int(attr_map.get("colspan") or 1),
            }

    def handle_data(self, data):
        if self.current_cell is not None:
            self.current_cell["text"] += data

    def handle_endtag(self, tag):
        if tag in ("td", "th") and self.current_cell is not None and self.current_row is not None:
            self.current_cell["text"] = " ".join(self.current_cell["text"].split())
            self.current_row.append(self.current_cell)
            self.current_cell = None
        elif tag == "tr" and self.current_row is not None:
            self.rows.append(self.current_row)
            self.current_row = None


def parse_html_rows(html):
    parser = TableHtmlParser()
    parser.feed(html or "")
    return parser.rows


def bbox_points_to_rect(points, offset_x=0, offset_y=0):
    xs = [float(points[i]) + offset_x for i in range(0, len(points), 2)]
    ys = [float(points[i]) + offset_y for i in range(1, len(points), 2)]
    return {
        "x1": int(round(min(xs))),
        "y1": int(round(min(ys))),
        "x2": int(round(max(xs))),
        "y2": int(round(max(ys))),
    }


def clamp_rect(rect, width, height, shrink_y_ratio=0.22, shrink_x_px=3):
    x1 = max(0, min(width - 1, int(rect["x1"]) + shrink_x_px))
    x2 = max(0, min(width, int(rect["x2"]) - shrink_x_px))
    y1 = max(0, min(height - 1, int(rect["y1"])))
    y2 = max(0, min(height, int(rect["y2"])))
    if x2 <= x1:
        x1 = max(0, min(width - 1, int(rect["x1"])))
        x2 = max(0, min(width, int(rect["x2"])))
    if y2 <= y1:
        return None
    shrink = int(round((y2 - y1) * shrink_y_ratio))
    sy1 = min(y2 - 1, y1 + shrink)
    sy2 = max(sy1 + 1, y2 - shrink)
    return {"x1": x1, "y1": sy1, "x2": x2, "y2": sy2}


def union_rects(rects):
    valid = [r for r in rects if r]
    if not valid:
        return None
    return {
        "x1": min(r["x1"] for r in valid),
        "y1": min(r["y1"] for r in valid),
        "x2": max(r["x2"] for r in valid),
        "y2": max(r["y2"] for r in valid),
    }


def text_region_to_rect(region):
    if not region:
        return None
    xs = [float(point[0]) for point in region if len(point) >= 2]
    ys = [float(point[1]) for point in region if len(point) >= 2]
    if not xs or not ys:
        return None
    return {
        "x1": int(round(min(xs))),
        "y1": int(round(min(ys))),
        "x2": int(round(max(xs))),
        "y2": int(round(max(ys))),
    }


def classify_rect(image, rect):
    height, width = image.shape[:2]
    sample = clamp_rect(rect, width, height)
    if not sample:
        return {"label": "", "confidence": 0, "sampleBox": None}
    crop = image[sample["y1"]:sample["y2"], sample["x1"]:sample["x2"]]
    result = classify_pixels(crop)
    return {
        "label": result.get("label", ""),
        "confidence": result.get("confidence", 0),
        "coloredRatio": result.get("coloredRatio", 0),
        "whiteRatio": result.get("whiteRatio", 0),
        "coverageRatio": result.get("coverageRatio", 0),
        "strong": bool(result.get("strong")),
        "reason": result.get("reason", ""),
        "sampleBox": sample,
    }


def build_ocr_fallback_table(result, image):
    words = []
    for item in result:
        for entry in item.get("res") or []:
            rect = text_region_to_rect(entry.get("text_region"))
            text = " ".join(str(entry.get("text") or "").split())
            if not rect or not text:
                continue
            words.append({
                "text": text,
                "confidence": float(entry.get("confidence") or 0),
                "bbox": rect,
                "centerY": (rect["y1"] + rect["y2"]) / 2,
                "height": max(1, rect["y2"] - rect["y1"]),
            })
    if not words:
        return None, []
    median_height = sorted(word["height"] for word in words)[len(words) // 2]
    threshold = max(10, median_height * 0.8)
    rows = []
    for word in sorted(words, key=lambda item: (item["centerY"], item["bbox"]["x1"])):
        target = None
        for row in rows:
            if abs(row["centerY"] - word["centerY"]) <= threshold:
                target = row
                break
        if not target:
            target = {"words": [], "centerY": word["centerY"]}
            rows.append(target)
        target["words"].append(word)
        target["centerY"] = sum(item["centerY"] for item in target["words"]) / len(target["words"])
    table_rows = []
    row_color_rows = []
    for row_index, row in enumerate(rows):
        row_words = sorted(row["words"], key=lambda item: item["bbox"]["x1"])
        rect = union_rects([word["bbox"] for word in row_words])
        color = classify_rect(image, rect) if rect else {"label": "", "confidence": 0, "sampleBox": None}
        text = " | ".join(word["text"] for word in row_words)
        table_rows.append({
            "rowIndex": row_index,
            "cells": [
                {
                    "rowIndex": row_index,
                    "columnIndex": index,
                    "text": word["text"],
                    "rowspan": 1,
                    "colspan": 1,
                    "bbox": word["bbox"],
                }
                for index, word in enumerate(row_words)
            ],
            "text": text,
            "bbox": rect,
            "color": color,
        })
        row_color_rows.append({
            "index": len(row_color_rows),
            "tableRowIndex": row_index,
            "label": color.get("label", ""),
            "rawLabel": color.get("label", ""),
            "confidence": color.get("confidence", 0),
            "coloredRatio": color.get("coloredRatio", 0),
            "whiteRatio": color.get("whiteRatio", 0),
            "coverageRatio": color.get("coverageRatio", 0),
            "strong": bool(color.get("strong")),
            "reason": color.get("reason", ""),
            "text": text,
            "bbox": rect,
            "sampleBox": color.get("sampleBox"),
        })
    table_rect = union_rects([row.get("bbox") for row in table_rows])
    table = {
        "bbox": table_rect,
        "rowCount": len(table_rows),
        "cellCount": sum(len(row["cells"]) for row in table_rows),
        "cellBBoxCount": 0,
        "ocrBoxCount": len(words),
        "htmlCellCount": 0,
        "cellAlignmentExact": False,
        "fallbackMode": "ocr_text_rows",
        "rows": table_rows,
        "html": "",
    }
    return table, row_color_rows


def build_cells(html_rows, cell_bboxes, table_bbox):
    cells = []
    cursor = 0
    offset_x = int(table_bbox[0] or 0)
    offset_y = int(table_bbox[1] or 0)
    for row_index, row in enumerate(html_rows):
        row_cells = []
        for column_index, html_cell in enumerate(row):
            raw_bbox = cell_bboxes[cursor] if cursor < len(cell_bboxes) else None
            rect = bbox_points_to_rect(raw_bbox, offset_x, offset_y) if raw_bbox else None
            row_cells.append({
                "rowIndex": row_index,
                "columnIndex": column_index,
                "text": html_cell.get("text", ""),
                "rowspan": html_cell.get("rowspan", 1),
                "colspan": html_cell.get("colspan", 1),
                "bbox": rect,
            })
            cursor += 1
        cells.append(row_cells)
    return cells


def analyze_image(image_path):
    from paddleocr import PPStructure

    start = time.time()
    engine = PPStructure(show_log=False, image_orientation=False, lang="ch")
    init_seconds = time.time() - start
    image = cv2.imread(str(image_path))
    if image is None:
        raise RuntimeError(f"cannot read image: {image_path}")
    pp_image_path = Path(image_path)
    resized_path = None
    if image.shape[1] > 1280:
        scale = 1240 / image.shape[1]
        resized = cv2.resize(image, (1240, max(1, int(round(image.shape[0] * scale)))), interpolation=cv2.INTER_AREA)
        resized_file = tempfile.NamedTemporaryFile(prefix="ppstructure-", suffix=".jpg", delete=False)
        resized_file.close()
        resized_path = Path(resized_file.name)
        cv2.imwrite(str(resized_path), resized)
        image = resized
        pp_image_path = resized_path
    height, width = image.shape[:2]
    infer_start = time.time()
    try:
        result = engine(str(pp_image_path), return_ocr_result_in_table=True)
    finally:
        if resized_path:
            resized_path.unlink(missing_ok=True)
    infer_seconds = time.time() - infer_start
    tables = []
    row_color_rows = []
    for item in result:
        if item.get("type") != "table":
            continue
        table_bbox = item.get("bbox") or [0, 0, width, height]
        res = item.get("res") or {}
        html = res.get("html") or ""
        html_rows = parse_html_rows(html)
        cell_bboxes = res.get("cell_bbox") or []
        cells = build_cells(html_rows, cell_bboxes, table_bbox)
        rows = []
        for row_index, row_cells in enumerate(cells):
            rect = union_rects([cell.get("bbox") for cell in row_cells])
            color = classify_rect(image, rect) if rect else {"label": "", "confidence": 0, "sampleBox": None}
            text_cells = [cell.get("text", "") for cell in row_cells]
            row_text = " | ".join(text_cells)
            rows.append({
                "rowIndex": row_index,
                "cells": row_cells,
                "text": row_text,
                "bbox": rect,
                "color": color,
            })
            row_color_rows.append({
                "index": len(row_color_rows),
                "tableRowIndex": row_index,
                "label": color.get("label", ""),
                "rawLabel": color.get("label", ""),
                "confidence": color.get("confidence", 0),
                "coloredRatio": color.get("coloredRatio", 0),
                "whiteRatio": color.get("whiteRatio", 0),
                "coverageRatio": color.get("coverageRatio", 0),
                "strong": bool(color.get("strong")),
                "reason": color.get("reason", ""),
                "text": row_text,
                "bbox": rect,
                "sampleBox": color.get("sampleBox"),
            })
        tables.append({
            "bbox": table_bbox,
            "rowCount": len(rows),
            "cellCount": sum(len(row) for row in cells),
            "cellBBoxCount": len(cell_bboxes),
            "ocrBoxCount": len(res.get("boxes") or []),
            "htmlCellCount": sum(len(row) for row in html_rows),
            "cellAlignmentExact": len(cell_bboxes) == sum(len(row) for row in html_rows),
            "rows": rows,
            "html": html,
        })
    if not tables:
        fallback_table, fallback_color_rows = build_ocr_fallback_table(result, image)
        if fallback_table:
            tables.append(fallback_table)
            row_color_rows.extend(fallback_color_rows)
    return {
        "source": "paddle_ppstructure",
        "image": str(image_path),
        "imageWidth": width,
        "imageHeight": height,
        "initSeconds": round(init_seconds, 2),
        "inferSeconds": round(infer_seconds, 2),
        "tableCount": len(tables),
        "tables": tables,
        "rowColorAnalysis": {
            "source": "paddle_ppstructure",
            "expectedRows": len(row_color_rows),
            "detectedRows": len(row_color_rows),
            "selectionMode": "ppstructure_cell_bbox",
            "reliable": False,
            "exactRowAligned": False,
            "contiguous": True,
            "rows": row_color_rows,
            "unreliableReasons": ["contains_header_or_note_rows", "requires_ticket_text_alignment"],
            "warningReasons": [],
        },
    }


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("image")
    args = parser.parse_args()
    try:
        output = analyze_image(Path(args.image))
        print(json.dumps(output, ensure_ascii=False))
    except Exception as error:
        print(json.dumps({"source": "paddle_ppstructure", "error": str(error)}, ensure_ascii=False))
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
