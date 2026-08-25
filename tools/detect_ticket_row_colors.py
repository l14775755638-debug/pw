#!/usr/bin/env python3
import argparse
import json
import sys

import cv2
import numpy as np


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

COLOR_KEYS = ["red", "orange", "yellow", "green", "cyan", "blue", "purple", "pink"]


def merge_runs(values, gap=4):
    runs = []
    for value in values:
        if not runs or value - runs[-1][1] > gap:
            runs.append([int(value), int(value)])
        else:
            runs[-1][1] = int(value)
    return runs


def build_color_masks(region):
    if region.size == 0:
        return {}, np.zeros((0, 0), dtype=bool), 0
    hsv = cv2.cvtColor(region, cv2.COLOR_BGR2HSV)
    h = hsv[:, :, 0].astype(np.int16)
    s = hsv[:, :, 1].astype(np.int16)
    v = hsv[:, :, 2].astype(np.int16)

    valid = v > 55
    # Drop black text/grid pixels. They carry row borders/text, not background.
    non_ink = valid & ~((v < 100) & (s < 80))
    total = int(np.count_nonzero(non_ink))
    masks = {
        "white": non_ink & (s < 38) & (v > 178),
        "gray": non_ink & (s < 45) & (v <= 178) & (v > 80),
        "black": valid & (v <= 55),
        "red": non_ink & (s > 65) & (v > 90) & ((h <= 8) | (h >= 170)),
        "orange": non_ink & (s > 55) & (v > 95) & (h > 8) & (h < 24),
        "yellow": non_ink & (s > 45) & (v > 100) & (h >= 24) & (h < 40),
        "green": non_ink & (s > 45) & (v > 80) & (h >= 40) & (h < 88),
        "cyan": non_ink & (s > 45) & (v > 80) & (h >= 88) & (h < 104),
        "blue": non_ink & (s > 45) & (v > 70) & (h >= 104) & (h < 130),
        "purple": non_ink & (s > 45) & (v > 70) & (h >= 130) & (h < 153),
        "pink": non_ink & (s > 45) & (v > 90) & (h >= 153) & (h < 170),
    }
    return masks, non_ink, total


def count_masks(masks):
    return {name: int(np.count_nonzero(mask)) for name, mask in masks.items()}


def get_spatial_color_stats(masks, non_ink, color_name, bins=14):
    if non_ink.size == 0 or not color_name or color_name not in masks:
        return {"coverageRatio": 0, "validBins": 0, "coloredBins": 0, "whiteBins": 0}
    height, width = non_ink.shape[:2]
    if width < 8 or height < 2:
        return {"coverageRatio": 0, "validBins": 0, "coloredBins": 0, "whiteBins": 0}

    bin_count = max(6, min(bins, width // 14 if width >= 84 else 6))
    valid_bins = 0
    colored_bins = 0
    white_bins = 0
    for index in range(bin_count):
        x1 = int(round(index * width / bin_count))
        x2 = int(round((index + 1) * width / bin_count))
        if x2 <= x1:
            continue
        segment_non_ink = non_ink[:, x1:x2]
        segment_total = int(np.count_nonzero(segment_non_ink))
        if segment_total < max(10, int(segment_non_ink.size * 0.08)):
            continue
        valid_bins += 1
        segment_color_count = int(np.count_nonzero(masks[color_name][:, x1:x2]))
        segment_colored_total = sum(int(np.count_nonzero(masks[key][:, x1:x2])) for key in COLOR_KEYS)
        segment_white_count = int(np.count_nonzero(masks["white"][:, x1:x2]))
        color_ratio = segment_color_count / max(1, segment_total)
        colored_ratio = segment_colored_total / max(1, segment_total)
        white_ratio = segment_white_count / max(1, segment_total)
        if color_ratio >= 0.22 and colored_ratio >= 0.28:
            colored_bins += 1
        elif white_ratio >= 0.36 and colored_ratio <= 0.16:
            white_bins += 1

    return {
        "coverageRatio": round(colored_bins / max(1, valid_bins), 3),
        "validBins": int(valid_bins),
        "coloredBins": int(colored_bins),
        "whiteBins": int(white_bins),
    }


def classify_pixels(region):
    if region.size == 0:
        return {
            "label": "",
            "confidence": 0,
            "coloredRatio": 0,
            "whiteRatio": 0,
            "coverageRatio": 0,
            "strong": False,
            "reason": "empty",
        }
    masks, non_ink, total = build_color_masks(region)
    if total < 50:
        return {
            "label": "",
            "confidence": 0,
            "coloredRatio": 0,
            "whiteRatio": 0,
            "coverageRatio": 0,
            "strong": False,
            "reason": "too_few_pixels",
        }

    counts = {name: int(np.count_nonzero(mask)) for name, mask in masks.items()}
    colored_total = sum(counts[name] for name in counts if name not in ("white", "gray", "black"))
    white_ratio = counts["white"] / total
    gray_ratio = counts["gray"] / total
    neutral_ratio = white_ratio + gray_ratio
    colored_ratio = colored_total / total
    dominant = max(counts, key=counts.get)
    dominant_ratio = counts[dominant] / total

    colored_counts = {name: counts[name] for name in counts if name not in ("white", "gray", "black")}
    colored_name = max(colored_counts, key=colored_counts.get) if colored_counts else dominant
    colored_confidence = colored_counts.get(colored_name, 0) / max(1, colored_total)
    spatial = get_spatial_color_stats(masks, non_ink, colored_name)
    coverage_ratio = spatial["coverageRatio"]

    if colored_ratio < 0.16 and white_ratio >= 0.34:
        return {
            "label": COLOR_NAMES["white"],
            "confidence": round(max(white_ratio, 1 - colored_ratio), 3),
            "coloredRatio": round(colored_ratio, 3),
            "whiteRatio": round(white_ratio, 3),
            "coverageRatio": 0,
            "strong": True,
            "reason": "mostly_white",
        }

    if neutral_ratio >= 0.5 and colored_ratio <= 0.32 and (white_ratio >= 0.22 or spatial["coloredBins"] <= spatial["whiteBins"] + 1):
        label_key = "white" if white_ratio >= 0.26 else "gray"
        return {
            "label": COLOR_NAMES[label_key],
            "confidence": round(max(dominant_ratio, 1 - colored_ratio), 3),
            "coloredRatio": round(colored_ratio, 3),
            "whiteRatio": round(white_ratio, 3),
            "coverageRatio": 0,
            "strong": label_key == "white" and colored_ratio <= 0.3,
            "reason": "neutral",
        }

    strong_color = (
        colored_name in COLOR_KEYS
        and colored_ratio >= 0.5
        and coverage_ratio >= 0.62
        and spatial["coloredBins"] >= max(4, spatial["whiteBins"] + 2)
        and colored_confidence >= 0.52
        and (white_ratio <= 0.18 or colored_ratio >= white_ratio * 2.2)
    )
    if not strong_color:
        # Do not call a row "sold-colored" when only one cell, a side date block,
        # or noisy text has color. Ambiguous rows must be reviewed by source image
        # or treated as normal, never automatically downlisted.
        return {
            "label": "",
            "confidence": round(max(colored_confidence, dominant_ratio), 3),
            "coloredRatio": round(colored_ratio, 3),
            "whiteRatio": round(white_ratio, 3),
            **spatial,
            "strong": False,
            "reason": "weak_or_partial_color",
            "rawLabel": COLOR_NAMES.get(colored_name, ""),
        }
    return {
        "label": COLOR_NAMES.get(colored_name, ""),
        "confidence": round(max(colored_confidence, dominant_ratio), 3),
        "coloredRatio": round(colored_ratio, 3),
        "whiteRatio": round(white_ratio, 3),
        **spatial,
        "strong": True,
        "reason": "full_row_color",
    }


def detect_horizontal_intervals(image):
    height, width = image.shape[:2]
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    gray = cv2.GaussianBlur(gray, (3, 3), 0)
    binary = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_MEAN_C, cv2.THRESH_BINARY_INV, 21, 12)
    kernel_width = max(35, width // 28)
    horizontal_kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (kernel_width, 1))
    horizontal = cv2.morphologyEx(binary, cv2.MORPH_OPEN, horizontal_kernel, iterations=1)
    # Many seller screenshots use white or very pale grid lines on colored rows.
    # Canny catches both dark and light separators, so row detection does not
    # collapse into one giant band on pastel/red/yellow tables.
    edges = cv2.Canny(gray, 45, 135)
    horizontal_edges = cv2.morphologyEx(edges, cv2.MORPH_OPEN, horizontal_kernel, iterations=1)
    horizontal = cv2.bitwise_or(horizontal, horizontal_edges)
    projection = np.count_nonzero(horizontal, axis=1)
    threshold = max(18, int(width * 0.055))
    ys = np.where(projection >= threshold)[0]
    line_runs = merge_runs(ys, gap=5)
    line_centers = [int((start + end) / 2) for start, end in line_runs]

    intervals = []
    for top, bottom in zip(line_centers, line_centers[1:]):
        row_height = bottom - top
        if row_height < 9 or row_height > max(95, int(height * 0.1)):
            continue
        y1 = max(0, top + 2)
        y2 = min(height, bottom - 2)
        if y2 - y1 < 7:
            continue
        band_gray = gray[y1:y2, :]
        dark_density = float(np.count_nonzero(band_gray < 150)) / band_gray.size
        if dark_density < 0.003:
            continue
        dark = band_gray < 130
        col_counts = np.count_nonzero(dark, axis=0)
        xs = np.where(col_counts >= max(2, int((y2 - y1) * 0.45)))[0]
        vertical_runs = [run for run in merge_runs(xs, gap=3) if run[1] - run[0] <= 8]
        intervals.append(
            {
                "y1": y1,
                "y2": y2,
                "height": y2 - y1,
                "darkDensity": round(dark_density, 4),
                "verticalLines": int(len(vertical_runs)),
            }
        )
    return intervals


def group_intervals(intervals):
    if not intervals:
        return []
    heights = [item["height"] for item in intervals]
    median_height = float(np.median(heights)) if heights else 18
    groups = [[intervals[0]]]
    for item in intervals[1:]:
        previous = groups[-1][-1]
        gap = item["y1"] - previous["y2"]
        if gap > max(10, median_height * 1.35):
            groups.append([item])
        else:
            groups[-1].append(item)
    return groups


def choose_data_intervals(intervals, expected_rows):
    if not intervals or expected_rows <= 0:
        return intervals, "all"
    groups = group_intervals(intervals)
    if not groups:
        return intervals[:expected_rows], "fallback"

    drop_first = []
    for group in groups:
        drop_first.extend(group[1:] if len(group) > 1 else group)
    if len(drop_first) == expected_rows:
        return drop_first, "drop_header_exact"

    drop_first_two = []
    for group in groups:
        drop_first_two.extend(group[2:] if len(group) > 2 else group[1:] if len(group) > 1 else group)
    if len(drop_first_two) == expected_rows:
        return drop_first_two, "drop_two_headers_exact"

    candidates = drop_first if len(drop_first) >= expected_rows else intervals
    if len(candidates) <= expected_rows:
        return candidates, "short"

    if expected_rows <= 2 and len(candidates) > expected_rows:
        return candidates[-expected_rows:], "tail_small_table"

    def looks_like_non_data_row(item):
        vertical_lines = int(item.get("verticalLines") or 0)
        dark_density = float(item.get("darkDensity") or 0)
        likely_header = vertical_lines >= 30 and dark_density < 0.35
        likely_separator = vertical_lines <= 8 and dark_density < 0.08
        return likely_header or likely_separator

    filtered_candidates = [item for item in candidates if not looks_like_non_data_row(item)]
    if len(filtered_candidates) >= expected_rows:
        candidates = filtered_candidates

    best = None
    for start in range(0, len(candidates) - expected_rows + 1):
        segment = candidates[start : start + expected_rows]
        heights = np.array([item["height"] for item in segment], dtype=np.float32)
        regularity = float(np.std(heights) / max(1.0, np.mean(heights)))
        density = float(np.mean([item["darkDensity"] for item in segment]))
        score = regularity - density * 0.15
        if best is None or score < best[0]:
            best = (score, segment)
    return (best[1], "segment") if best else (candidates[:expected_rows], "segment")


def find_x_bounds(image, y1, y2):
    height, width = image.shape[:2]
    inner_y1 = min(y2, y1 + max(1, int((y2 - y1) * 0.2)))
    inner_y2 = max(inner_y1 + 1, y2 - max(1, int((y2 - y1) * 0.2)))
    region = image[inner_y1:inner_y2, :]
    hsv = cv2.cvtColor(region, cv2.COLOR_BGR2HSV)
    gray = cv2.cvtColor(region, cv2.COLOR_BGR2GRAY)
    mask = (gray < 215) | (hsv[:, :, 1] > 35)
    col_counts = np.count_nonzero(mask, axis=0)
    xs = np.where(col_counts >= max(1, int(region.shape[0] * 0.08)))[0]
    if xs.size < 10:
        return int(width * 0.04), int(width * 0.96)
    x_runs = merge_runs(xs, gap=12)
    # Use the widest run; it normally corresponds to the table body.
    widest = max(x_runs, key=lambda run: run[1] - run[0])
    x1 = max(0, widest[0] - 4)
    x2 = min(width, widest[1] + 5)
    if x2 - x1 < width * 0.25:
        return int(width * 0.04), int(width * 0.96)
    return x1, x2


def classify_interval(image, interval):
    y1, y2 = interval["y1"], interval["y2"]
    vertical_trim = max(1, int((y2 - y1) * 0.24))
    inner_y1 = min(y2, y1 + vertical_trim)
    inner_y2 = max(inner_y1 + 1, y2 - vertical_trim)
    x1, x2 = find_x_bounds(image, y1, y2)
    horizontal_trim = max(3, int((x2 - x1) * 0.01))
    region = image[inner_y1:inner_y2, min(x2, x1 + horizontal_trim) : max(x1 + 1, x2 - horizontal_trim)]
    classified = classify_pixels(region)
    return {
        **classified,
        "y1": int(y1),
        "y2": int(y2),
        "x1": int(x1),
        "x2": int(x2),
        "height": int(y2 - y1),
        "darkDensity": interval.get("darkDensity", 0),
        "verticalLines": interval.get("verticalLines", 0),
    }


def color_family(row):
    label = row.get("label") or row.get("rawLabel") or ""
    if label == COLOR_NAMES["white"] or label == COLOR_NAMES["gray"]:
        return "neutral"
    if label:
        return label
    return "unknown"


def merge_classified_rows(rows):
    if not rows:
        return []
    heights = [row["height"] for row in rows]
    median_height = float(np.median(heights)) if heights else 18
    max_gap = max(6, int(median_height * 0.55))
    groups = [[rows[0]]]
    for row in rows[1:]:
        previous = groups[-1][-1]
        same_family = color_family(previous) == color_family(row)
        close = row["y1"] - previous["y2"] <= max_gap
        if same_family and close:
            groups[-1].append(row)
        else:
            groups.append([row])

    merged = []
    for group in groups:
        label_counts = {}
        raw_counts = {}
        for row in group:
            if row.get("label"):
                label_counts[row["label"]] = label_counts.get(row["label"], 0) + max(1, row["height"])
            if row.get("rawLabel"):
                raw_counts[row["rawLabel"]] = raw_counts.get(row["rawLabel"], 0) + max(1, row["height"])
        label = max(label_counts, key=label_counts.get) if label_counts else ""
        raw_label = max(raw_counts, key=raw_counts.get) if raw_counts else ""
        total_height = sum(max(1, row["height"]) for row in group)
        weighted = lambda key: sum(float(row.get(key, 0) or 0) * max(1, row["height"]) for row in group) / max(1, total_height)
        merged.append(
            {
                "label": label,
                "rawLabel": raw_label,
                "confidence": round(max(float(row.get("confidence", 0) or 0) for row in group), 3),
                "coloredRatio": round(weighted("coloredRatio"), 3),
                "whiteRatio": round(weighted("whiteRatio"), 3),
                "coverageRatio": round(weighted("coverageRatio"), 3),
                "validBins": int(max(int(row.get("validBins", 0) or 0) for row in group)),
                "coloredBins": int(max(int(row.get("coloredBins", 0) or 0) for row in group)),
                "whiteBins": int(max(int(row.get("whiteBins", 0) or 0) for row in group)),
                "strong": any(row.get("strong") is True for row in group),
                "reason": "merged_same_color" if len(group) > 1 else group[0].get("reason", ""),
                "y1": int(min(row["y1"] for row in group)),
                "y2": int(max(row["y2"] for row in group)),
                "x1": int(min(row["x1"] for row in group)),
                "x2": int(max(row["x2"] for row in group)),
                "height": int(max(row["y2"] for row in group) - min(row["y1"] for row in group)),
                "sourceParts": len(group),
            }
        )
    return merged


def choose_small_table_rows(rows, expected_rows):
    if expected_rows <= 0 or expected_rows > 3 or len(rows) <= expected_rows:
        return None, ""
    source_heights = [max(1, int(row.get("height", 0) or 0)) for row in rows]
    source_median_height = float(np.median(source_heights)) if source_heights else 18
    merged = merge_classified_rows(rows)
    useful = [
        row
        for row in merged
        if color_family(row) != "unknown"
        # This small-table path is only for a single data row split into a few
        # fragments. If a whole colored table block is merged, using it would
        # shift colors onto unrelated OCR rows.
        and int(row.get("sourceParts", 1) or 1) <= 8
        and int(row.get("height", 0) or 0) <= max(80, source_median_height * 7.5)
    ]
    if len(useful) >= expected_rows:
        selected = useful[-expected_rows:]
        families = [color_family(row) for row in selected]
        if len(set(families)) > 1 or len(selected) == expected_rows:
            return selected, "merged_small_table"
    return None, ""


def analyze(image_path, expected_rows=0):
    image = cv2.imread(image_path, cv2.IMREAD_COLOR)
    if image is None:
        raise RuntimeError("image cannot be read")
    intervals = detect_horizontal_intervals(image)
    all_rows = [classify_interval(image, interval) for interval in intervals]
    small_rows, small_mode = choose_small_table_rows(all_rows, expected_rows)
    if small_rows is not None:
        rows = small_rows
        selection_mode = small_mode
    else:
        selected, selection_mode = choose_data_intervals(intervals, expected_rows)
        rows = [classify_interval(image, interval) for interval in selected]
    labels = [row["label"] for row in rows if row.get("label")]
    unique_labels = sorted(set(labels))
    if len(rows) <= 1:
        max_row_gap = 0
        contiguous = True
    else:
        gaps = [rows[index + 1]["y1"] - rows[index]["y2"] for index in range(len(rows) - 1)]
        heights = [row["height"] for row in rows]
        median_height = float(np.median(heights)) if heights else 18
        max_row_gap = int(max(gaps)) if gaps else 0
        contiguous = max_row_gap <= max(10, median_height * 1.65)
    exact_rows = expected_rows <= 0 or len(rows) == expected_rows
    reliable = bool(rows) and exact_rows and (selection_mode != "segment" or contiguous)
    if rows and any(row.get("confidence", 0) < 0.42 for row in rows):
        reliable = False
    return {
        "source": "opencv",
        "expectedRows": int(expected_rows or 0),
        "detectedRows": len(rows),
        "selectionMode": selection_mode,
        "reliable": reliable,
        "contiguous": bool(contiguous),
        "maxRowGap": int(max_row_gap),
        "labels": unique_labels,
        "rows": rows,
    }


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("image")
    parser.add_argument("--expected-rows", type=int, default=0)
    args = parser.parse_args()
    try:
        print(json.dumps(analyze(args.image, args.expected_rows), ensure_ascii=False))
    except Exception as error:
        print(json.dumps({"source": "opencv", "error": str(error), "reliable": False, "rows": []}, ensure_ascii=False))
        return 1


if __name__ == "__main__":
    sys.exit(main())
