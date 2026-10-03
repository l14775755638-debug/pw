#!/usr/bin/env python3
import argparse
import json
import os
import shutil
import subprocess
import sys
import tempfile
import time
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
TOOLS = ROOT / "tools"
if str(TOOLS) not in sys.path:
    sys.path.insert(0, str(TOOLS))

from analyze_ticket_row_anchor_colors import create_paddle_ocr, group_ocr_rows, run_paddle_ocr  # noqa: E402
from detect_ticket_row_colors import analyze as analyze_row_colors  # noqa: E402
from detect_ticket_row_colors import analyze_ocr_rows as analyze_ocr_row_colors  # noqa: E402


def get_default_render_dpi():
    return int(os.environ.get("TICKET_LOCAL_RENDER_DPI") or 150)


def render_pdf_page(pdf_path, page, pdftoppm, dpi=None):
    output_prefix = Path(tempfile.mkdtemp(prefix="ticket-local-page-")) / "page"
    temp_dir = output_prefix.parent
    command = [
        pdftoppm,
        "-jpeg",
        "-r",
        str(int(dpi or get_default_render_dpi())),
        "-f",
        str(page),
        "-l",
        str(page),
        str(pdf_path),
        str(output_prefix),
    ]
    try:
        subprocess.run(
            command,
            check=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            timeout=int(os.environ.get("TICKET_LOCAL_RENDER_TIMEOUT") or 180),
        )
        files = sorted(temp_dir.glob("page-*.jpg"))
        if not files:
            raise RuntimeError(f"PDF page {page} did not render an image")
        return files[0], temp_dir
    except subprocess.CalledProcessError as error:
        detail = (error.stderr or error.stdout or str(error)).strip()
        raise RuntimeError(f"PDF page {page} render failed: {detail}") from error


def row_to_line(row):
    words = sorted(row.get("words") or [], key=lambda item: int((item.get("bbox") or {}).get("x1") or 0))
    unique_words = []
    for word in words:
        text = str(word.get("text") or "").strip()
        bbox = word.get("bbox") or {}
        center_x = (float(bbox.get("x1") or 0) + float(bbox.get("x2") or 0)) / 2
        if any(item["text"] == text and abs(item["center_x"] - center_x) <= 32 for item in unique_words):
            continue
        unique_words.append({"text": text, "center_x": center_x})
    cells = [item["text"] for item in unique_words]
    cells = [cell for cell in cells if cell]
    return "\t".join(cells)


def offset_ocr_item(item, y_offset):
    points, payload = item
    shifted = []
    for point in points or []:
        if not isinstance(point, (list, tuple)) or len(point) < 2:
            shifted.append(point)
            continue
        shifted.append([float(point[0]), float(point[1]) + float(y_offset)])
    return shifted, payload


def rect_key_from_ocr_item(item):
    points, payload = item
    text = str(payload[0] if isinstance(payload, (list, tuple)) and payload else "").strip()
    xs = [float(point[0]) for point in points or [] if isinstance(point, (list, tuple)) and len(point) >= 2]
    ys = [float(point[1]) for point in points or [] if isinstance(point, (list, tuple)) and len(point) >= 2]
    if not text or not xs or not ys:
        return None
    return (text, round(min(xs) / 24), round(min(ys) / 24), round(max(xs) / 24), round(max(ys) / 24))


def dedupe_ocr_items(items):
    seen = set()
    output = []
    for item in items:
        key = rect_key_from_ocr_item(item)
        if key and key in seen:
            continue
        if key:
            seen.add(key)
        output.append(item)
    return output


def should_use_chunked_highres_ocr(image_path):
    try:
        import cv2

        image = cv2.imread(str(image_path))
        if image is None:
            return False
        height, width = image.shape[:2]
        ratio = height / max(1, width)
        threshold = float(os.environ.get("TICKET_TALL_PAGE_RATIO") or 2.45)
        return ratio >= threshold and height >= int(os.environ.get("TICKET_TALL_PAGE_MIN_HEIGHT") or 2400)
    except Exception:
        return False


def ocr_tall_image_in_chunks(image_path):
    import cv2

    started = time.time()
    engine = create_paddle_ocr()
    init_seconds = time.time() - started
    image = cv2.imread(str(image_path))
    if image is None:
        raise RuntimeError(f"cannot read image: {image_path}")
    height, width = image.shape[:2]
    chunk_height = int(os.environ.get("TICKET_OCR_CHUNK_HEIGHT") or 2000)
    overlap = int(os.environ.get("TICKET_OCR_CHUNK_OVERLAP") or 160)
    step = max(300, chunk_height - overlap)
    temp_dir = Path(tempfile.mkdtemp(prefix="ticket-local-ocr-chunks-"))
    items = []
    infer_started = time.time()
    try:
        y = 0
        while y < height:
            y2 = min(height, y + chunk_height)
            chunk = image[y:y2, 0:width]
            chunk_path = temp_dir / f"chunk-{y:05d}.jpg"
            cv2.imwrite(str(chunk_path), chunk)
            chunk_items = run_paddle_ocr(engine, chunk_path)
            items.extend(offset_ocr_item(item, y) for item in chunk_items)
            if y2 >= height:
                break
            y += step
    finally:
        shutil.rmtree(temp_dir, ignore_errors=True)
    infer_seconds = time.time() - infer_started
    rows = group_ocr_rows(dedupe_ocr_items(items))
    lines = [row_to_line(row) for row in rows]
    lines = [line for line in lines if line]
    return {
        "text": "\n".join(lines),
        "recognizedRows": len(lines),
        "ocrRows": [
            {
                "index": index,
                "text": line,
                "bbox": rows[index].get("bbox") if index < len(rows) else None,
            }
            for index, line in enumerate(lines)
        ],
        "initSeconds": round(init_seconds, 3),
        "inferSeconds": round(infer_seconds, 3),
        "ocrMode": "chunked_highres",
    }


def ocr_image(image_path):
    started = time.time()
    engine = create_paddle_ocr()
    init_seconds = time.time() - started
    infer_started = time.time()
    items = run_paddle_ocr(engine, image_path)
    infer_seconds = time.time() - infer_started
    rows = group_ocr_rows(items)
    lines = [row_to_line(row) for row in rows]
    lines = [line for line in lines if line]
    return {
        "text": "\n".join(lines),
        "recognizedRows": len(lines),
        "ocrRows": [
            {
                "index": index,
                "text": line,
                "bbox": rows[index].get("bbox") if index < len(rows) else None,
            }
            for index, line in enumerate(lines)
        ],
        "initSeconds": round(init_seconds, 3),
        "inferSeconds": round(infer_seconds, 3),
        "ocrMode": "single_image",
    }


def looks_like_table_header(text):
    normalized = str(text or "").replace(" ", "")
    header_hits = sum(1 for token in ("序号", "编号", "日期", "票面", "区域", "楼层", "层数", "排", "座位", "备注", "售价", "价格") if token in normalized)
    return header_hits >= 3


def has_ascii_letter_and_digit(value):
    text = str(value or "")
    return any(("a" <= ch.lower() <= "z") for ch in text) and any(ch.isdigit() for ch in text)


def looks_like_ticket_data_line(text):
    raw = str(text or "").strip()
    if not raw or looks_like_table_header(raw):
        return False
    cells = [cell.strip() for cell in raw.split("\t") if cell.strip()]
    if len(cells) < 2:
        return False
    joined = " ".join(cells)
    has_price_or_sold_mask = any(cell in {"****", "大大大大", "*****"} for cell in cells) or any(
        any(ch.isdigit() for ch in cell) and 3 <= sum(1 for ch in cell if ch.isdigit()) <= 6 for cell in cells
    )
    has_ticket_shape = any(has_ascii_letter_and_digit(cell) for cell in cells) or any("排" in cell or "区" in cell or "层" in cell for cell in cells)
    has_date = "月" in joined or "/" in joined or "." in joined
    compact_ticket_shape = bool(
        has_ticket_shape
        and len(cells) >= 2
        and (
            any("区" in cell or "排" in cell or "层" in cell for cell in cells)
            or any(has_ascii_letter_and_digit(cell) for cell in cells)
        )
    )
    if compact_ticket_shape:
        return True
    return bool(has_price_or_sold_mask and (has_ticket_shape or has_date or len(cells) >= 4))


def get_ticket_data_ocr_rows(ocr_rows):
    rows = [row for row in (ocr_rows or []) if str(row.get("text") or "").strip()]
    if not rows:
        return []
    header_index = -1
    for index, row in enumerate(rows):
        if looks_like_table_header(row.get("text")):
            header_index = index
            break
    if header_index >= 0:
        return rows[header_index + 1 :]

    data_rows = [row for row in rows if looks_like_ticket_data_line(row.get("text"))]
    if data_rows:
        return data_rows
    return rows


def manual_only_color_analysis(image_path, expected_rows, ocr_rows=None):
    data_rows = get_ticket_data_ocr_rows(ocr_rows)
    if data_rows:
        analysis = analyze_ocr_row_colors(str(image_path), data_rows)
    else:
        analysis = analyze_row_colors(str(image_path), expected_rows)
    reasons = list(analysis.get("unreliableReasons") or [])
    if "manual_review_only" not in reasons:
        reasons.append("manual_review_only")
    analysis.update(
        {
            "source": "opencv",
            "reliable": False,
            "exactRowAligned": False,
            "autoApplyAllowed": False,
            "manualReviewOnly": True,
            "unreliableReasons": reasons,
        }
    )
    return analysis


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("pdf")
    parser.add_argument("--page", type=int, required=True)
    parser.add_argument("--task-id", default="")
    parser.add_argument("--pdftoppm", default=os.environ.get("PDFTOPPM_PATH") or "pdftoppm")
    args = parser.parse_args()

    pdf_path = Path(args.pdf)
    if not pdf_path.exists():
        print(
            json.dumps(
                {
                    "source": "local_pdf_page",
                    "page": args.page,
                    "error": f"PDF not found: {pdf_path}",
                    "text": "",
                    "recognizedRows": 0,
                },
                ensure_ascii=False,
            )
        )
        return 2

    temp_dir = None
    try:
        image_path, temp_dir = render_pdf_page(pdf_path, max(1, args.page), args.pdftoppm)
        if should_use_chunked_highres_ocr(image_path):
            shutil.rmtree(temp_dir, ignore_errors=True)
            highres_dpi = int(os.environ.get("TICKET_TALL_PAGE_RENDER_DPI") or 300)
            image_path, temp_dir = render_pdf_page(pdf_path, max(1, args.page), args.pdftoppm, dpi=highres_dpi)
            ocr_result = ocr_tall_image_in_chunks(image_path)
        else:
            ocr_result = ocr_image(image_path)
        data_ocr_rows = get_ticket_data_ocr_rows(ocr_result.get("ocrRows"))
        color_analysis = manual_only_color_analysis(image_path, len(data_ocr_rows), ocr_result.get("ocrRows"))
        payload = {
            "source": "local_pdf_page",
            "taskId": args.task_id,
            "page": max(1, args.page),
            "text": ocr_result["text"],
            "recognizedRows": ocr_result["recognizedRows"],
            "ocrRows": ocr_result["ocrRows"],
            "rowColorAnalysis": color_analysis,
            "initSeconds": ocr_result["initSeconds"],
            "inferSeconds": ocr_result["inferSeconds"],
            "ocrMode": ocr_result.get("ocrMode") or "single_image",
        }
        print(json.dumps(payload, ensure_ascii=False))
        return 0
    except Exception as error:
        print(
            json.dumps(
                {
                    "source": "local_pdf_page",
                    "taskId": args.task_id,
                    "page": max(1, args.page),
                    "error": str(error),
                    "text": "",
                    "recognizedRows": 0,
                },
                ensure_ascii=False,
            )
        )
        return 1
    finally:
        if temp_dir:
            for item in sorted(Path(temp_dir).glob("*"), reverse=True):
                try:
                    item.unlink()
                except Exception:
                    pass
            try:
                Path(temp_dir).rmdir()
            except Exception:
                pass


if __name__ == "__main__":
    sys.exit(main())
