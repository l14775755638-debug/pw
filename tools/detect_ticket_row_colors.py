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
    b = region[:, :, 0].astype(np.int16)
    g = region[:, :, 1].astype(np.int16)
    r = region[:, :, 2].astype(np.int16)

    valid = v > 55
    # Drop black text/grid pixels. They carry row borders/text, not background.
    non_ink = valid & ~((v < 100) & (s < 80))
    total = int(np.count_nonzero(non_ink))
    masks = {
        "white": non_ink & (s < 38) & (v > 178),
        "gray": non_ink & (s < 45) & (v <= 178) & (v > 80),
        "black": valid & (v <= 55),
        "red": non_ink
        & (s > 92)
        & (v > 105)
        & ((h <= 6) | (h >= 174))
        & (r > 135)
        & (r > g * 1.22)
        & (r > b * 1.22),
        "orange": non_ink & (s > 72) & (v > 105) & (h > 8) & (h < 23) & (r > b * 1.18),
        "yellow": non_ink & (s > 62) & (v > 112) & (h >= 24) & (h < 39) & (r > b * 1.08) & (g > b * 1.08),
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
        and colored_ratio >= 0.42
        and coverage_ratio >= 0.42
        and spatial["coloredBins"] >= max(3, spatial["whiteBins"] + 2)
        and colored_confidence >= 0.5
        and colored_ratio >= white_ratio + 0.16
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
    raw_gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    gray = cv2.GaussianBlur(raw_gray, (3, 3), 0)
    binary = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_MEAN_C, cv2.THRESH_BINARY_INV, 21, 12)
    edges = cv2.Canny(raw_gray, 30, 110)
    blurred_edges = cv2.Canny(gray, 35, 120)

    # Seller screenshots mix full-width rules, short cell borders, and pale
    # separators on colored rows. A single long kernel misses many small tables,
    # so collect horizontal rules at several scales and then merge their y
    # positions into row boundaries.
    line_centers = []

    def append_projection_lines(mask, min_fraction, max_thickness, gap=2):
        projection = np.count_nonzero(mask, axis=1)
        ys = np.where(projection >= max(24, int(width * min_fraction)))[0]
        for run in merge_runs(ys, gap=gap):
            if run[1] - run[0] > max_thickness:
                continue
            line_centers.append((int(run[0]) + int(run[1])) // 2)

    # Thin white/light grid lines inside colored rows are easy to lose after
    # thresholding. Keep them as possible row boundaries so rows near separators
    # do not inherit the color of the divider above or below.
    append_projection_lines(raw_gray < 82, 0.08, max(8, int(height * 0.012)), gap=2)
    append_projection_lines(raw_gray > 246, 0.08, max(5, int(height * 0.008)), gap=1)
    row_gradient = np.abs(cv2.Sobel(raw_gray, cv2.CV_16S, 0, 1, ksize=3))
    append_projection_lines(row_gradient > 48, 0.10, max(6, int(height * 0.01)), gap=1)

    full_rule_projection = np.count_nonzero(edges, axis=1)
    full_rule_ys = np.where(full_rule_projection >= max(36, int(width * 0.10)))[0]
    for run in merge_runs(full_rule_ys, gap=3):
        if run[1] - run[0] <= max(8, int(height * 0.012)):
            line_centers.append((int(run[0]) + int(run[1])) // 2)

    kernel_widths = sorted(set([32, max(42, width // 32), max(64, width // 20)]))
    for kernel_width in kernel_widths:
        horizontal_kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (kernel_width, 1))
        min_fraction = 0.026 if kernel_width <= 40 else 0.02
        min_pixels = max(4, int(width * min_fraction))
        for source in (binary, edges, blurred_edges):
            horizontal = cv2.morphologyEx(source, cv2.MORPH_OPEN, horizontal_kernel, iterations=1)
            projection = np.count_nonzero(horizontal, axis=1)
            ys = np.where(projection >= min_pixels)[0]
            for run in merge_runs(ys, gap=3):
                if run[1] - run[0] > max(12, int(height * 0.018)):
                    continue
                line_centers.append((int(run[0]) + int(run[1])) // 2)

    if not line_centers:
        return []

    line_runs = merge_runs(sorted(line_centers), gap=5)
    line_runs = [(max(0, run[0] - 1), min(height - 1, run[1] + 1)) for run in line_runs]
    intervals = []
    for upper_run, lower_run in zip(line_runs, line_runs[1:]):
        # Use the content area between two detected horizontal rules, not the
        # centers of the rules. Thick colored separators otherwise bleed into
        # the next real ticket row and make a white row look red/yellow/green.
        content_gap = int(lower_run[0]) - int(upper_run[1]) - 1
        edge_padding = max(1, min(4, int(content_gap * 0.12)))
        y1 = max(0, int(upper_run[1]) + edge_padding)
        y2 = min(height, int(lower_run[0]) - edge_padding)
        row_height = y2 - y1
        if row_height < 9 or row_height > max(95, int(height * 0.1)):
            continue
        if y2 - y1 < 7:
            continue
        band_gray = gray[y1:y2, :]
        dark_density = float(np.count_nonzero(band_gray < 150)) / band_gray.size
        if dark_density < 0.0012:
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

    deduped = []
    for interval in sorted(intervals, key=lambda item: (item["y1"], item["y2"])):
        if deduped and interval["y1"] <= deduped[-1]["y2"] + 2:
            current = deduped[-1]
            current["y1"] = min(current["y1"], interval["y1"])
            current["y2"] = max(current["y2"], interval["y2"])
            current["height"] = current["y2"] - current["y1"]
            current["darkDensity"] = max(current["darkDensity"], interval["darkDensity"])
            current["verticalLines"] = max(current["verticalLines"], interval["verticalLines"])
        else:
            deduped.append(interval)
    return deduped


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

    all_heights = [item["height"] for item in intervals]
    median_height = float(np.median(all_heights)) if all_heights else 18

    def looks_like_non_data_row(item):
        height = int(item.get("height") or 0)
        vertical_lines = int(item.get("verticalLines") or 0)
        dark_density = float(item.get("darkDensity") or 0)
        # Keep full ticket rows even when they are colored. Only remove visual
        # separators or empty bands that have little cell/text structure.
        likely_short_divider = (
            height <= max(7, int(median_height * 0.32))
            and dark_density < 0.055
            and vertical_lines <= 4
        )
        likely_empty_gap = vertical_lines <= 1 and dark_density < 0.012
        return likely_short_divider or likely_empty_gap

    def take_in_visual_order(candidates, mode):
        if len(candidates) <= expected_rows:
            return candidates, mode if mode != "prefix" else "short"
        filtered = [item for item in candidates if not looks_like_non_data_row(item)]
        if len(filtered) >= expected_rows:
            return filtered[:expected_rows], f"{mode}_filtered"
        return candidates[:expected_rows], mode

    def build_body(global_header_count):
        selected = []
        for group_index, group in enumerate(groups):
            body = group
            # Only the first visual table may contribute page-level title/header
            # rows. Later groups often start right after a separator; dropping
            # their first rows caused real tickets near a divider to inherit the
            # divider color or disappear from color alignment.
            if group_index == 0 and len(group) > global_header_count:
                body = group[global_header_count:]
            selected.extend(item for item in body if not looks_like_non_data_row(item))
        return selected

    for header_count in (2, 1, 0):
        candidates = build_body(header_count)
        if len(candidates) == expected_rows:
            return candidates, f"global_header_{header_count}_exact"
        if len(candidates) > expected_rows:
            return take_in_visual_order(candidates, f"global_header_{header_count}")

    candidates = [item for item in intervals if not looks_like_non_data_row(item)]
    if len(candidates) < expected_rows:
        candidates = intervals
    return take_in_visual_order(candidates, "prefix")


def detect_text_row_intervals(image, expected_rows):
    if expected_rows <= 0:
        return [], ""

    height, width = image.shape[:2]
    if height < 80 or width < 120:
        return [], ""

    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
    saturation = hsv[:, :, 1].astype(np.int16)
    value = hsv[:, :, 2].astype(np.int16)
    # A red or green row background can be dark in grayscale and look like one
    # huge text run. Use actual dark ink instead of grayscale darkness so
    # colored backgrounds do not erase their own text rows.
    dark = (value < 90) | ((value < 135) & (saturation < 110))
    usable = np.zeros_like(dark, dtype=bool)
    # The date column often contains one vertically-centered value spanning
    # several ticket rows. Excluding the likely date band prevents that value
    # from being detected as an extra row.
    usable[:, int(width * 0.015) : int(width * 0.145)] = dark[:, int(width * 0.015) : int(width * 0.145)]
    usable[:, int(width * 0.29) : int(width * 0.985)] = dark[:, int(width * 0.29) : int(width * 0.985)]

    projection = np.count_nonzero(usable, axis=1)
    threshold = max(8, int(width * 0.004))
    ys = np.where(projection >= threshold)[0]
    runs = []
    for run in merge_runs(ys, gap=3):
        y1, y2 = int(run[0]), int(run[1]) + 1
        run_height = y2 - y1
        if run_height < 6 or run_height > max(48, int(height * 0.07)):
            continue
        dark_count = int(np.sum(projection[y1:y2]))
        if dark_count < max(35, int(width * 0.018)):
            continue
        runs.append(
            {
                "textY1": y1,
                "textY2": y2,
                "center": int(round((y1 + y2 - 1) / 2)),
                "darkCount": dark_count,
                "peak": int(np.max(projection[y1:y2])),
            }
        )
    if len(runs) < expected_rows:
        return [], ""

    counts = [item["darkCount"] for item in runs]
    median_count = float(np.median(counts)) if counts else 0
    header_bottom = 0
    for item in runs:
        if item["center"] > height * 0.45:
            break
        if median_count and item["darkCount"] >= median_count * 1.45 and item["peak"] >= threshold * 6:
            header_bottom = max(header_bottom, item["textY2"])

    candidates = [
        item
        for item in runs
        if item["textY1"] > header_bottom + 3 and item["center"] > max(header_bottom + 3, height * 0.22)
    ]
    if len(candidates) < expected_rows:
        candidates = [item for item in runs if item["center"] > height * 0.22]
    if len(candidates) < expected_rows:
        return [], ""

    centers = [item["center"] for item in candidates]
    gaps = [centers[index + 1] - centers[index] for index in range(len(centers) - 1)]
    median_gap = float(np.median(gaps)) if gaps else max(18, height * 0.045)
    max_reasonable_gap = max(80, median_gap * 2.7)

    best_start = 0
    best_score = None
    max_start = len(candidates) - expected_rows
    for start in range(max_start + 1):
        window = candidates[start : start + expected_rows]
        window_centers = [item["center"] for item in window]
        window_gaps = [window_centers[index + 1] - window_centers[index] for index in range(len(window_centers) - 1)]
        large_gap_count = sum(1 for gap in window_gaps if gap > max_reasonable_gap)
        regularity = sum(abs(gap - median_gap) for gap in window_gaps)
        # Prefer the earliest plausible data block after the header. The OCR
        # text rows are in visual order, so this maps row 0 to the first real
        # ticket row instead of a later matching-looking fragment.
        score = large_gap_count * 10000 + regularity + start * median_gap * 0.25
        if best_score is None or score < best_score:
            best_score = score
            best_start = start

    selected = candidates[best_start : best_start + expected_rows]
    selected_centers = [item["center"] for item in selected]
    local_gaps = [selected_centers[index + 1] - selected_centers[index] for index in range(len(selected_centers) - 1)]
    local_median_gap = float(np.median(local_gaps)) if local_gaps else median_gap
    if local_median_gap < 14:
        return [], ""

    intervals = []
    previous_boundary = max(header_bottom + 2, int(round(selected[0]["center"] - local_median_gap * 0.48)))
    for index, item in enumerate(selected):
        center = item["center"]
        if index < len(selected) - 1:
            next_center = selected[index + 1]["center"]
            next_boundary = int(round((center + next_center) / 2))
        else:
            next_boundary = int(round(center + local_median_gap * 0.48))
        y1 = max(0, min(height - 1, previous_boundary))
        y2 = max(y1 + 9, min(height, next_boundary))
        band_gray = gray[y1:y2, :]
        dark_density = float(np.count_nonzero(band_gray < 150)) / max(1, band_gray.size)
        dark_band = band_gray < 130
        col_counts = np.count_nonzero(dark_band, axis=0)
        xs = np.where(col_counts >= max(2, int((y2 - y1) * 0.45)))[0]
        vertical_runs = [run for run in merge_runs(xs, gap=3) if run[1] - run[0] <= 8]
        intervals.append(
            {
                "y1": int(y1),
                "y2": int(y2),
                "height": int(y2 - y1),
                "darkDensity": round(dark_density, 4),
                "verticalLines": int(len(vertical_runs)),
                "textCenter": int(center),
                "textY1": int(item["textY1"]),
                "textY2": int(item["textY2"]),
            }
        )
        previous_boundary = next_boundary

    return intervals, "text_projection_exact"


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


def get_row_colored_scores(image, y1, y2, x1, x2):
    height, width = image.shape[:2]
    y1 = max(0, min(height, int(y1)))
    y2 = max(y1, min(height, int(y2)))
    x1 = max(0, min(width, int(x1)))
    x2 = max(x1, min(width, int(x2)))
    if y2 - y1 < 3 or x2 - x1 < 20:
        return np.array([], dtype=float)

    region = image[y1:y2, x1:x2]
    masks, non_ink, _ = build_color_masks(region)
    if not masks:
        return np.array([], dtype=float)
    colored = np.zeros(non_ink.shape, dtype=bool)
    for key in COLOR_KEYS:
        colored |= masks[key]

    scores = []
    min_valid = max(20, int(region.shape[1] * 0.08))
    for row_index in range(region.shape[0]):
        valid_count = int(np.count_nonzero(non_ink[row_index, :]))
        if valid_count < min_valid:
            scores.append(0.0)
        else:
            scores.append(float(np.count_nonzero(colored[row_index, :])) / max(1, valid_count))
    return np.array(scores, dtype=float)


def trim_interval_against_neighbor_color(image, y1, y2, x1, x2):
    row_height = y2 - y1
    if row_height < 16 or x2 - x1 < 80:
        return y1, y2

    scores = get_row_colored_scores(image, y1, y2, x1, x2)
    if scores.size < 8:
        return y1, y2

    center_start = max(0, int(scores.size * 0.35))
    center_end = min(scores.size, max(center_start + 1, int(scores.size * 0.65)))
    center_score = float(np.median(scores[center_start:center_end]))
    # Only strip neighbor bleed from rows whose own center is neutral. A truly
    # colored ticket row should keep its colored edges.
    if center_score >= 0.34:
        return y1, y2

    strong_threshold = 0.45
    min_run = max(2, min(5, int(row_height * 0.12)))
    max_edge_scan = max(min_run + 1, int(row_height * 0.35))
    guard = max(1, min(3, int(row_height * 0.08)))
    next_y1, next_y2 = y1, y2

    bottom_limit = min(scores.size - min_run, max(center_end + max_edge_scan, center_end + 1))
    for offset in range(center_end, bottom_limit + 1):
        if float(np.min(scores[offset : offset + min_run])) >= strong_threshold:
            next_y2 = min(next_y2, y1 + max(center_end + 1, offset - guard))
            break

    top_limit = max(0, center_start - max_edge_scan)
    for offset in range(center_start - min_run, top_limit - 1, -1):
        if float(np.min(scores[offset : offset + min_run])) >= strong_threshold:
            next_y1 = max(next_y1, y1 + min(center_start - 1, offset + min_run + guard))
            break

    if next_y2 - next_y1 >= max(10, int(row_height * 0.45)):
        return int(next_y1), int(next_y2)
    return y1, y2


def detect_vertical_cell_spans(image, y1, y2, x1, x2):
    """Find likely table cells inside one OCR row.

    Color decisions must be made from the inside of each cell, not from a full
    horizontal stripe. Full-stripe sampling is how a divider/header color leaks
    into the nearest ticket row.
    """
    width_total = x2 - x1
    if width_total < 30 or y2 - y1 < 8:
        return [(x1, x2)]

    height, width = image.shape[:2]
    inner_y1 = max(0, min(height, y1 + max(1, int((y2 - y1) * 0.2))))
    inner_y2 = max(inner_y1 + 1, min(height, y2 - max(1, int((y2 - y1) * 0.2))))
    row = image[inner_y1:inner_y2, max(0, x1):min(width, x2)]
    if row.size == 0:
        return [(x1, x2)]

    gray = cv2.cvtColor(row, cv2.COLOR_BGR2GRAY)
    edges = cv2.Canny(gray, 40, 135)
    vertical_kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (1, max(6, row.shape[0] // 2)))
    vertical = cv2.morphologyEx(edges, cv2.MORPH_OPEN, vertical_kernel, iterations=1)
    projection = np.count_nonzero(vertical, axis=0)
    xs = np.where(projection >= max(2, int(row.shape[0] * 0.42)))[0]
    runs = merge_runs(xs, gap=3)
    line_centers = [int(round((run[0] + run[1]) / 2)) + x1 for run in runs]
    boundaries = [x1] + [x for x in line_centers if x1 + 4 < x < x2 - 4] + [x2]
    boundaries = sorted(set(boundaries))

    spans = []
    min_span = max(14, int(width_total * 0.035))
    for left, right in zip(boundaries, boundaries[1:]):
        if right - left >= min_span:
            spans.append((int(left), int(right)))
    if len(spans) >= 3:
        return spans

    # Some screenshots/PDF renders have weak vertical grid lines. Never fall
    # back to full-row sampling for ticket color decisions: a nearby divider
    # can bleed into the stripe and make a normal row look colored. Use a small
    # equal-width cell grid instead so each row is still judged by multiple
    # independent cells.
    fallback_count = 7 if width_total >= 360 else 6 if width_total >= 240 else 4
    step = width_total / fallback_count
    fallback_spans = []
    for idx in range(fallback_count):
        left = int(round(x1 + idx * step))
        right = int(round(x1 + (idx + 1) * step))
        if right - left >= 12:
            fallback_spans.append((left, right))
    return fallback_spans if len(fallback_spans) >= 3 else [(x1, x2)]


def classify_interval_by_cells(image, y1, y2, x1, x2):
    spans = detect_vertical_cell_spans(image, y1, y2, x1, x2)
    cell_results = []
    for left, right in spans:
        cell_width = right - left
        row_height = y2 - y1
        trim_x = max(2, min(12, int(cell_width * 0.12)))
        trim_y = max(1, min(10, int(row_height * 0.34)))
        cell_x1 = min(right - 1, left + trim_x)
        cell_x2 = max(cell_x1 + 1, right - trim_x)
        cell_y1 = min(y2 - 1, y1 + trim_y)
        cell_y2 = max(cell_y1 + 1, y2 - trim_y)
        result = classify_pixels(image[cell_y1:cell_y2, cell_x1:cell_x2])
        if result.get("reason") == "too_few_pixels":
            continue
        result["x1"] = int(left)
        result["x2"] = int(right)
        result["width"] = int(cell_width)
        cell_results.append(result)

    if len(cell_results) < 3:
        return None

    white_cells = 0
    nonwhite_cells = []
    unknown_cells = 0
    for result in cell_results:
        label = result.get("label") or result.get("rawLabel") or ""
        colored_ratio = float(result.get("coloredRatio", 0) or 0)
        white_ratio = float(result.get("whiteRatio", 0) or 0)
        confidence = float(result.get("confidence", 0) or 0)
        coverage_ratio = float(result.get("coverageRatio", 0) or 0)

        if label == COLOR_NAMES["white"] or (white_ratio >= 0.3 and colored_ratio <= max(0.34, white_ratio * 1.2)):
            white_cells += 1
        elif label and label not in (COLOR_NAMES["gray"], COLOR_NAMES["black"]) and colored_ratio >= 0.22 and confidence >= 0.32:
            nonwhite_cells.append(label)
        elif colored_ratio >= 0.26 and coverage_ratio >= 0.2 and colored_ratio >= white_ratio + 0.08:
            raw = result.get("rawLabel") or label or "非白底"
            nonwhite_cells.append(raw)
        else:
            unknown_cells += 1

    valid_cells = max(1, len(cell_results) - unknown_cells)
    nonwhite_count = len(nonwhite_cells)
    dominant_nonwhite = ""
    if nonwhite_cells:
        counts = {}
        for label in nonwhite_cells:
            counts[label] = counts.get(label, 0) + 1
        dominant_nonwhite = max(counts, key=counts.get)

    # A real sold-colored row normally colors most data cells. If only the date
    # cell, sequence cell, or a neighboring divider is colored, keep it neutral.
    color_cell_ratio = nonwhite_count / max(1, len(cell_results))
    white_cell_ratio = white_cells / max(1, len(cell_results))
    if nonwhite_count >= max(2, int(np.ceil(len(cell_results) * 0.42))) and nonwhite_count >= white_cells + 1:
        return {
            "label": dominant_nonwhite,
            "rawLabel": dominant_nonwhite,
            "confidence": round(color_cell_ratio, 3),
            "coloredRatio": round(color_cell_ratio, 3),
            "whiteRatio": round(white_cell_ratio, 3),
            "coverageRatio": round(color_cell_ratio, 3),
            "validBins": int(len(cell_results)),
            "coloredBins": int(nonwhite_count),
            "whiteBins": int(white_cells),
            "cellCount": int(len(cell_results)),
            "coloredCellCount": int(nonwhite_count),
            "whiteCellCount": int(white_cells),
            "strong": True,
            "reason": "cell_majority_color",
        }

    if white_cells >= max(2, int(np.ceil(len(cell_results) * 0.4))):
        return {
            "label": COLOR_NAMES["white"],
            "rawLabel": "",
            "confidence": round(max(white_cell_ratio, 1 - color_cell_ratio), 3),
            "coloredRatio": round(color_cell_ratio, 3),
            "whiteRatio": round(white_cell_ratio, 3),
            "coverageRatio": round(color_cell_ratio, 3),
            "validBins": int(len(cell_results)),
            "coloredBins": int(nonwhite_count),
            "whiteBins": int(white_cells),
            "cellCount": int(len(cell_results)),
            "coloredCellCount": int(nonwhite_count),
            "whiteCellCount": int(white_cells),
            "strong": True,
            "reason": "cell_majority_white",
        }

    return {
        "label": "",
        "rawLabel": dominant_nonwhite,
        "confidence": round(max(color_cell_ratio, white_cell_ratio), 3),
        "coloredRatio": round(color_cell_ratio, 3),
        "whiteRatio": round(white_cell_ratio, 3),
        "coverageRatio": round(color_cell_ratio, 3),
        "validBins": int(len(cell_results)),
        "coloredBins": int(nonwhite_count),
        "whiteBins": int(white_cells),
        "cellCount": int(len(cell_results)),
        "coloredCellCount": int(nonwhite_count),
        "whiteCellCount": int(white_cells),
        "strong": False,
        "reason": "cell_mixed_or_weak",
    }


def classify_interval(image, interval):
    y1, y2 = interval["y1"], interval["y2"]
    x1, x2 = find_x_bounds(image, y1, y2)
    y1, y2 = trim_interval_against_neighbor_color(image, y1, y2, x1, x2)
    # Sample the safest center band of the row. Seller tables often put SOLD
    # rows directly next to normal rows; using row edges can leak yellow/red
    # pixels from neighbors and incorrectly downlist a normal ticket.
    vertical_trim = max(1, int((y2 - y1) * 0.32))
    inner_y1 = min(y2, y1 + vertical_trim)
    inner_y2 = max(inner_y1 + 1, y2 - vertical_trim)
    horizontal_trim = max(3, int((x2 - x1) * 0.01))
    region = image[inner_y1:inner_y2, min(x2, x1 + horizontal_trim) : max(x1 + 1, x2 - horizontal_trim)]
    classified = classify_interval_by_cells(image, y1, y2, x1, x2) or classify_pixels(region)
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
    text_selected, text_selection_mode = detect_text_row_intervals(image, expected_rows)
    if text_selected:
        selected, selection_mode = text_selected, text_selection_mode
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
    # Automatic decisions are allowed only when row count matches and the
    # selected rows are contiguous. Segment/merged-small-table are still safe
    # after divider filtering because they no longer include tiny color bands.
    safe_selection_modes = {
        "all",
        "drop_header_exact",
        "drop_two_headers_exact",
        "prefix_after_two_headers",
        "prefix_after_two_headers_filtered",
        "prefix_filtered",
        "prefix",
        "short",
        "fallback",
        "merged_small_table",
        "global_header_0_exact",
        "global_header_1_exact",
        "global_header_2_exact",
        "global_header_0",
        "global_header_1",
        "global_header_2",
        "global_header_0_filtered",
        "global_header_1_filtered",
        "global_header_2_filtered",
        "text_projection_exact",
        "first_group_drop_0",
        "first_group_drop_1",
        "first_group_drop_2",
        "first_group_drop_0_filtered",
        "first_group_drop_1_filtered",
        "first_group_drop_2_filtered",
    }
    # Prefix selection intentionally follows the OCR row order on long pages;
    # divider gaps inside those rows should not make the result unusable.
    gap_allowed_modes = {
        "prefix_after_two_headers",
        "prefix_after_two_headers_filtered",
        "prefix_filtered",
        "prefix",
        "global_header_0",
        "global_header_1",
        "global_header_2",
        "global_header_0_filtered",
        "global_header_1_filtered",
        "global_header_2_filtered",
        "merged_small_table",
    }
    reliable = bool(rows) and exact_rows and selection_mode in safe_selection_modes and (contiguous or selection_mode in gap_allowed_modes)
    if rows and any(row.get("confidence", 0) < 0.42 for row in rows):
        reliable = False
    for index, row in enumerate(rows):
        row["index"] = index
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
