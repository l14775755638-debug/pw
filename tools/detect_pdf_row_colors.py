#!/usr/bin/env python3
import argparse
import json
import math
import sys

import pdfplumber


COLOR_NAMES = {
    "white": "白底",
    "gray": "灰底",
    "red": "红底",
    "orange": "橙底",
    "yellow": "黄底",
    "green": "绿底",
    "cyan": "青底",
    "blue": "蓝底",
    "purple": "紫底",
    "pink": "粉底",
    "black": "黑底",
}


def clamp(value, low=0.0, high=1.0):
    return max(low, min(high, float(value)))


def normalize_color(value):
    if value is None:
        return None
    if isinstance(value, (int, float)):
        gray = clamp(value)
        return (gray, gray, gray)
    if isinstance(value, (list, tuple)):
        if len(value) >= 3:
            return tuple(clamp(part) for part in value[:3])
        if len(value) == 1:
            gray = clamp(value[0])
            return (gray, gray, gray)
    return None


def rgb_to_label(rgb):
    if not rgb:
        return ""
    r, g, b = rgb
    mx = max(rgb)
    mn = min(rgb)
    delta = mx - mn
    if mx < 0.18:
        return "黑底"
    if delta < 0.08:
        if mx > 0.86:
            return "白底"
        return "灰底"
    if mx == r:
        hue = ((g - b) / delta) % 6
    elif mx == g:
        hue = ((b - r) / delta) + 2
    else:
        hue = ((r - g) / delta) + 4
    hue *= 60
    sat = 0 if mx == 0 else delta / mx
    if sat < 0.16 and mx > 0.82:
        return "白底"
    if sat < 0.16:
        return "灰底"
    if hue < 10 or hue >= 345:
        return "红底"
    if hue < 35:
        return "橙底"
    if hue < 65:
        return "黄底"
    if hue < 155:
        return "绿底"
    if hue < 195:
        return "青底"
    if hue < 255:
        return "蓝底"
    if hue < 290:
        return "紫底"
    if hue < 345:
        return "粉底"
    return ""


def color_confidence(rgb, label):
    if not rgb or not label:
        return 0
    r, g, b = rgb
    mx = max(rgb)
    mn = min(rgb)
    delta = mx - mn
    if label == "白底":
        return round(clamp((mx - 0.78) / 0.18) * clamp(1 - delta * 4), 3)
    if label in ("灰底", "黑底"):
        return round(clamp(1 - delta * 4), 3)
    return round(clamp(delta / max(mx, 0.01)), 3)


def rect_color(rect):
    return normalize_color(rect.get("non_stroking_color")) or normalize_color(rect.get("stroking_color"))


def is_background_rect(rect, page):
    width = float(rect.get("width") or 0)
    height = float(rect.get("height") or 0)
    if width < max(30, page.width * 0.08):
        return False
    if height < 4 or height > page.height * 0.25:
        return False
    return rect_color(rect) is not None


def group_char_rows(chars):
    rows = []
    for char in sorted(chars, key=lambda item: (float(item.get("top") or 0), float(item.get("x0") or 0))):
        top = float(char.get("top") or 0)
        bottom = float(char.get("bottom") or top)
        center = (top + bottom) / 2
        placed = False
        for row in rows:
            if abs(center - row["center"]) <= max(3, row["height"] * 0.75):
                row["chars"].append(char)
                row["top"] = min(row["top"], top)
                row["bottom"] = max(row["bottom"], bottom)
                row["height"] = max(row["height"], row["bottom"] - row["top"])
                row["center"] = (row["top"] + row["bottom"]) / 2
                placed = True
                break
        if not placed:
            rows.append({"top": top, "bottom": bottom, "center": center, "height": max(1, bottom - top), "chars": [char]})
    return rows


def row_text(row):
    chars = sorted(row["chars"], key=lambda item: float(item.get("x0") or 0))
    return "".join(str(char.get("text") or "") for char in chars).strip()


def select_data_rows(char_rows, expected_rows):
    rows = [row for row in char_rows if row_text(row)]
    if not expected_rows or len(rows) <= expected_rows:
        return rows
    data_like = []
    for row in rows:
        text = row_text(row)
        if any(ch.isdigit() for ch in text) or "sold" in text.lower() or "已售" in text:
            data_like.append(row)
    if len(data_like) >= expected_rows:
        return data_like[-expected_rows:]
    return rows[-expected_rows:]


def overlap_ratio(a0, a1, b0, b1):
    overlap = max(0, min(a1, b1) - max(a0, b0))
    return overlap / max(1e-6, min(a1 - a0, b1 - b0))


def classify_row(row, rects, page):
    row_top = row["top"] - 2
    row_bottom = row["bottom"] + 2
    candidates = []
    for rect in rects:
        top = float(rect.get("top") or 0)
        bottom = float(rect.get("bottom") or top)
        if overlap_ratio(row_top, row_bottom, top, bottom) < 0.35:
            continue
        rgb = rect_color(rect)
        label = rgb_to_label(rgb)
        if not label:
            continue
        area = float(rect.get("width") or 0) * float(rect.get("height") or 0)
        candidates.append((area, rgb, label, rect))
    if not candidates:
        return {
            "label": "",
            "rawLabel": "",
            "confidence": 0,
            "coloredRatio": 0,
            "whiteRatio": 0,
            "coverageRatio": 0,
            "strong": False,
            "reason": "no_vector_fill",
        }
    area, rgb, label, rect = max(candidates, key=lambda item: item[0])
    confidence = color_confidence(rgb, label)
    row_width = max(1, page.width)
    coverage = clamp(float(rect.get("width") or 0) / row_width)
    is_white = label == "白底"
    return {
        "label": label,
        "rawLabel": label,
        "confidence": confidence,
        "coloredRatio": 0 if is_white else round(coverage, 3),
        "whiteRatio": round(coverage, 3) if is_white else 0,
        "coverageRatio": round(coverage, 3),
        "coloredBins": 12 if not is_white else 0,
        "whiteBins": 12 if is_white else 0,
        "cellCount": 1,
        "coloredCellCount": 0 if is_white else 1,
        "whiteCellCount": 1 if is_white else 0,
        "strong": coverage >= 0.35 and confidence >= 0.45,
        "reason": "pdf_vector_fill",
    }


def analyze(path, page_number, expected_rows):
    with pdfplumber.open(path) as pdf:
        if page_number < 1 or page_number > len(pdf.pages):
            raise ValueError(f"page out of range: {page_number}/{len(pdf.pages)}")
        page = pdf.pages[page_number - 1]
        rects = [rect for rect in page.rects if is_background_rect(rect, page)]
        char_rows = group_char_rows(page.chars)
        data_rows = select_data_rows(char_rows, expected_rows)
        rows = [classify_row(row, rects, page) for row in data_rows]
        if expected_rows and len(rows) > expected_rows:
            rows = rows[-expected_rows:]
        reliable = bool(expected_rows and len(rows) == expected_rows and any(row.get("label") for row in rows))
        labels = []
        for row in rows:
            label = row.get("label") or row.get("rawLabel") or ""
            if label and label not in labels:
                labels.append(label)
        return {
            "source": "pdf_vector",
            "expectedRows": int(expected_rows or 0),
            "detectedRows": len(rows),
            "selectionMode": "pdf_text_rows" if page.chars else "no_pdf_text",
            "reliable": reliable,
            "contiguous": reliable,
            "maxRowGap": 0,
            "labels": labels,
            "rows": rows,
            "error": "" if page.chars or rects else "PDF 页面没有可读取的文字或矢量色块，可能是扫描图片。",
        }


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("pdf")
    parser.add_argument("--page", type=int, default=1)
    parser.add_argument("--expected-rows", type=int, default=0)
    args = parser.parse_args()
    try:
      result = analyze(args.pdf, args.page, args.expected_rows)
    except Exception as exc:
      result = {
          "source": "pdf_vector",
          "expectedRows": int(args.expected_rows or 0),
          "detectedRows": 0,
          "selectionMode": "",
          "reliable": False,
          "contiguous": False,
          "maxRowGap": 0,
          "labels": [],
          "rows": [],
          "error": str(exc),
      }
    print(json.dumps(result, ensure_ascii=False))


if __name__ == "__main__":
    main()
