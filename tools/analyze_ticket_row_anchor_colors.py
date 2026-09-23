#!/usr/bin/env python3
import argparse
import json
import re
import sys
import tempfile
import time
from pathlib import Path
from functools import lru_cache

import cv2


ROOT = Path(__file__).resolve().parents[1]
if str(ROOT / "tools") not in sys.path:
    sys.path.insert(0, str(ROOT / "tools"))

from detect_ticket_row_colors import classify_pixels  # noqa: E402


STOP_WORDS = {
    "序号",
    "编号",
    "日期",
    "区域",
    "排数",
    "排",
    "座位",
    "座位号",
    "号数",
    "范围",
    "价格",
    "售价",
    "备注",
    "配送",
    "转寄",
    "过户",
    "内场",
    "外场",
    "floor",
}


def normalize_text(value):
    return (
        str(value or "")
        .lower()
        .replace("￥", "")
        .replace("¥", "")
        .replace("₩", "")
        .replace(",", "")
        .replace("，", "")
        .replace("元", "")
        .replace("원", "")
        .replace("号", "")
        .replace("区", "")
        .replace("열", "")
        .replace("구역", "")
        .replace("구", "")
        .replace("月", ".")
        .replace("日", "")
        .replace("－", "-")
        .replace("—", "-")
        .replace("–", "-")
        .replace("～", "-")
        .replace("~", "-")
    )


def compact_text(value):
    return re.sub(r"[\s/／|\\()\[\]{}:：;；._-]+", "", normalize_text(value))


def token_variants(token):
    base = compact_text(token)
    if not base:
        return []
    variants = {base}
    m = re.fullmatch(r"(\d{1,2})[.](\d{1,2})", normalize_text(token).strip())
    if m:
        month = str(int(m.group(1)))
        day = str(int(m.group(2)))
        variants.add(f"{month}{day}")
        variants.add(f"{month.zfill(2)}{day.zfill(2)}")
    return [v for v in variants if v]


def extract_tokens_from_cell(value):
    raw = str(value or "").strip()
    if not raw or re.fullmatch(r"[xX/／\\\-\s]+", raw):
        return []
    normalized = normalize_text(raw).strip()
    if normalized in STOP_WORDS:
        return []
    tokens = []
    if re.search(r"sold|已售|售出|售罄|售完|下架|매진|판매완료", raw, re.I):
        tokens.append({"raw": raw, "kind": "sold", "weight": 3.0, "variants": ["sold"]})
        return tokens
    compact_raw = compact_text(raw)
    if len(compact_raw) >= 4 and re.search(r"[a-z]", compact_raw) and re.search(r"\d", compact_raw):
        tokens.append({"raw": raw, "kind": "phrase", "weight": 2.4, "variants": [compact_raw]})
    price_match = re.search(r"[￥¥₩$]\s*\d{1,3}(?:[,.，]\d{3})+|[￥¥₩$]\s*\d{3,6}|\b\d{1,3}[,.，]\d{3}\b", raw)
    if price_match:
        price = re.sub(r"\D", "", price_match.group(0))
        if price and int(price) >= 100:
            tokens.append({"raw": price, "kind": "number", "weight": 2.4, "variants": [price]})
    for match in re.finditer(r"20\d{2}[./-]?\d{1,2}[./-]?\d{1,2}|\d{1,2}[./-]\d{1,2}|\d{1,6}|[a-z]{1,4}\d{0,4}|\d{0,4}[a-z]{1,4}", normalized, re.I):
        token = match.group(0).strip()
        if not token or token in STOP_WORDS:
            continue
        compact = compact_text(token)
        if not compact:
            continue
        if any(compact in existing.get("variants", []) for existing in tokens):
            continue
        if compact.isdigit() and int(compact) < 10:
            # A single row number like 2 or 3 is too ambiguous unless paired
            # with stronger area/price/date tokens.
            kind = "small_number"
            weight = 0.6
        elif compact.isdigit() and int(compact) >= 100:
            kind = "number"
            weight = 2.3 if int(compact) >= 1000 else 1.6
        elif re.search(r"\d", compact) and re.search(r"[a-z]", compact):
            kind = "area"
            weight = 1.8
        elif re.fullmatch(r"[a-z]{1,3}", compact):
            kind = "letter"
            weight = 1.0 if len(compact) == 1 else 1.3
        else:
            kind = "text"
            weight = 1.0
        tokens.append({"raw": token, "kind": kind, "weight": weight, "variants": token_variants(token)})
    unique = []
    seen = set()
    for token in tokens:
        key = tuple(token["variants"])
        if not key or key in seen:
            continue
        seen.add(key)
        unique.append(token)
    return unique


def is_sequence_column(value):
    return bool(re.search(r"序号|编号|no\.?|id", str(value or ""), re.I))


def is_identifier_column(value):
    return bool(re.search(r"编号|票号|单号|id|no\.?", str(value or ""), re.I))


def extract_row_tokens(row, columns=None):
    values = row if isinstance(row, list) else list(row.values()) if isinstance(row, dict) else [row]
    tokens = []
    start_index = 0
    if values and columns and (is_sequence_column(columns[0]) or is_identifier_column(columns[0])):
        first_value = str(values[0] or "").strip()
        compact_identifier = compact_text(first_value)
        if compact_identifier and re.search(r"[a-z]", compact_identifier) and re.search(r"\d", compact_identifier):
            tokens.append({"raw": first_value, "kind": "identifier", "weight": 4.2, "variants": [compact_identifier]})
            start_index = 1
        elif is_sequence_column(columns[0]) and re.fullmatch(r"\d{1,4}", first_value):
            tokens.append({"raw": first_value, "kind": "sequence", "weight": 2.1, "variants": [first_value]})
            start_index = 1
    for cell in values[start_index:]:
        tokens.extend(extract_tokens_from_cell(cell))
    unique = []
    seen = set()
    for token in tokens:
        key = tuple(token.get("variants") or [])
        if key in seen:
            continue
        seen.add(key)
        unique.append(token)
    priority = {
        "sequence": 0,
        "identifier": 0,
        "sold": 1,
        "number": 2,
        "phrase": 3,
        "area": 4,
        "text": 5,
        "letter": 6,
        "small_number": 7,
    }
    unique.sort(key=lambda token: (priority.get(token.get("kind"), 9), -float(token.get("weight") or 1), str(token.get("raw") or "")))
    return unique[:12]


def rect_from_points(points):
    xs = [float(p[0]) for p in points if len(p) >= 2]
    ys = [float(p[1]) for p in points if len(p) >= 2]
    if not xs or not ys:
        return None
    return {"x1": int(min(xs)), "y1": int(min(ys)), "x2": int(max(xs)), "y2": int(max(ys))}


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


def group_ocr_rows(ocr_items):
    words = []
    for points, payload in ocr_items:
        text = str(payload[0] if isinstance(payload, (list, tuple)) and payload else "").strip()
        confidence = float(payload[1] if isinstance(payload, (list, tuple)) and len(payload) > 1 else 0)
        rect = rect_from_points(points)
        if not text or not rect:
            continue
        height = max(1, rect["y2"] - rect["y1"])
        words.append({
            "text": text,
            "confidence": confidence,
            "bbox": rect,
            "centerY": (rect["y1"] + rect["y2"]) / 2,
            "height": height,
            "compact": compact_text(text),
        })
    if not words:
        return []
    median_height = sorted(w["height"] for w in words)[len(words) // 2]
    threshold = max(10, median_height * 0.75)
    rows = []
    for word in sorted(words, key=lambda w: (w["centerY"], w["bbox"]["x1"])):
        target = None
        for row in rows:
            if abs(row["centerY"] - word["centerY"]) <= threshold:
                target = row
                break
        if target is None:
            target = {"words": [], "centerY": word["centerY"]}
            rows.append(target)
        target["words"].append(word)
        target["centerY"] = sum(w["centerY"] for w in target["words"]) / len(target["words"])
    output = []
    for index, row in enumerate(rows):
        row_words = sorted(row["words"], key=lambda w: w["bbox"]["x1"])
        rect = union_rects([w["bbox"] for w in row_words])
        output.append({
            "rowIndex": index,
            "text": " | ".join(w["text"] for w in row_words),
            "compact": compact_text(" ".join(w["text"] for w in row_words)),
            "bbox": rect,
            "words": row_words,
        })
    return output


def create_paddle_ocr():
    from paddleocr import PaddleOCR

    for kwargs in (
        {"use_angle_cls": False, "lang": "ch", "show_log": False},
        {"use_angle_cls": False, "lang": "ch"},
        {"use_textline_orientation": False, "lang": "ch"},
        {"lang": "ch"},
    ):
        try:
            return PaddleOCR(**kwargs)
        except TypeError:
            continue
    return PaddleOCR()


def normalize_paddle_result(raw):
    if not raw:
        return []
    if (
        isinstance(raw, list)
        and raw
        and isinstance(raw[0], list)
        and (not raw[0] or (isinstance(raw[0][0], (list, tuple)) and len(raw[0][0]) >= 2))
    ):
        return raw[0]

    items = []
    pages = raw if isinstance(raw, list) else [raw]
    for page in pages:
        data = page
        if hasattr(data, "json"):
            try:
                data = data.json
            except Exception:
                pass
        if hasattr(data, "res"):
            data = data.res
        if not isinstance(data, dict):
            continue
        data = data.get("res") if isinstance(data.get("res"), dict) else data
        texts = data.get("rec_texts") or data.get("texts") or []
        scores = data.get("rec_scores") or data.get("scores") or []
        polys = data.get("rec_polys") or data.get("dt_polys") or data.get("polys") or []
        boxes = data.get("rec_boxes") or data.get("boxes") or []
        for index, text in enumerate(texts):
            points = polys[index] if index < len(polys) else None
            if points is None and index < len(boxes):
                box = boxes[index]
                if isinstance(box, (list, tuple)) and len(box) >= 4:
                    x1, y1, x2, y2 = [float(value) for value in box[:4]]
                    points = [[x1, y1], [x2, y1], [x2, y2], [x1, y2]]
            if points is None:
                continue
            score = scores[index] if index < len(scores) else 0
            items.append((points, (text, score)))
    return items


def run_paddle_ocr(engine, image_path):
    try:
        raw = engine.ocr(str(image_path), cls=False)
    except TypeError:
        raw = engine.ocr(str(image_path))
    if raw:
        return normalize_paddle_result(raw)
    if hasattr(engine, "predict"):
        return normalize_paddle_result(engine.predict(str(image_path)))
    return []


def token_matches_row(token, visual_row):
    row_compact = visual_row.get("compact") or ""
    matched_words = []
    for variant in token.get("variants") or []:
        if not variant:
            continue
        if token.get("kind") == "sequence":
            first_word = (visual_row.get("words") or [{}])[0]
            if (first_word.get("compact") or "") == variant:
                return True, [first_word]
            continue
        if variant in row_compact:
            for word in visual_row.get("words") or []:
                if variant in (word.get("compact") or "") or (word.get("compact") or "") in variant:
                    matched_words.append(word)
            return True, matched_words
    return False, []


def score_ticket_row(tokens, visual_row):
    if not tokens:
        return {"score": 0, "matchedTokens": [], "matchedWordRects": [], "requiredMatched": False}
    total_weight = sum(float(t.get("weight") or 1) for t in tokens)
    matched = []
    rects = []
    kinds = set()
    for token in tokens:
        ok, words = token_matches_row(token, visual_row)
        if ok:
            matched.append(token)
            rects.extend([w.get("bbox") for w in words if w.get("bbox")])
            kinds.add(token.get("kind") or "")
    matched_weight = sum(float(t.get("weight") or 1) for t in matched)
    numeric_matched = any(t.get("kind") in ("number", "area", "sold", "sequence") for t in matched)
    has_price_or_sold = any(t.get("kind") in ("number", "sold") and float(t.get("weight") or 0) >= 2.0 for t in tokens)
    price_or_sold_matched = (not has_price_or_sold) or any(
        t.get("kind") in ("number", "sold") and float(t.get("weight") or 0) >= 2.0 for t in matched
    )
    has_sequence = any(t.get("kind") == "sequence" for t in tokens)
    sequence_matched = (not has_sequence) or any(t.get("kind") == "sequence" for t in matched)
    has_identifier = any(t.get("kind") == "identifier" for t in tokens)
    identifier_matched = (not has_identifier) or any(t.get("kind") == "identifier" for t in matched)
    has_phrase_or_area = any(t.get("kind") in ("phrase", "area") for t in tokens)
    phrase_or_area_matched = (
        identifier_matched
        or (not has_phrase_or_area)
        or any(t.get("kind") in ("phrase", "area") for t in matched)
    )
    required_matched = (
        len(matched) >= min(3, len(tokens))
        and numeric_matched
        and price_or_sold_matched
        and phrase_or_area_matched
        and sequence_matched
        and identifier_matched
    )
    score = matched_weight / max(1.0, total_weight)
    if required_matched:
        score += 0.08
    return {
        "score": round(max(0, min(1, score)), 3),
        "matchedTokens": [t.get("raw") for t in matched],
        "matchedWordRects": rects,
        "requiredMatched": required_matched,
        "identifierMatched": identifier_matched,
        "priceOrSoldMatched": price_or_sold_matched,
    }


def choose_monotonic_row_matches(candidate_lists):
    @lru_cache(maxsize=None)
    def solve(row_index, previous_visual_index):
        if row_index >= len(candidate_lists):
            return 0.0, []
        best_score, best_path = solve(row_index + 1, previous_visual_index)
        best_path = [None] + best_path
        for candidate in candidate_lists[row_index]:
            visual_index = int(candidate["visual"]["rowIndex"])
            if visual_index <= previous_visual_index:
                continue
            next_score, next_path = solve(row_index + 1, visual_index)
            required_bonus = 0.04 if candidate.get("requiredMatched") else 0.0
            total = float(candidate.get("score") or 0) + required_bonus + next_score
            if total > best_score:
                best_score = total
                best_path = [candidate] + next_path
        return best_score, best_path

    return solve(0, -1)[1]


def clamp_sample_box(rect, width, height, pad_x=8):
    if not rect:
        return None
    x1 = max(0, min(width - 1, int(rect["x1"]) - pad_x))
    x2 = max(x1 + 1, min(width, int(rect["x2"]) + pad_x))
    y1 = max(0, min(height - 1, int(rect["y1"])))
    y2 = max(y1 + 1, min(height, int(rect["y2"])))
    center = (y1 + y2) / 2
    band = max(6, min(22, int((y2 - y1) * 0.42)))
    sy1 = max(0, int(round(center - band / 2)))
    sy2 = min(height, max(sy1 + 1, int(round(center + band / 2))))
    return {"x1": x1, "y1": sy1, "x2": x2, "y2": sy2}


def classify_sample(image, rect):
    height, width = image.shape[:2]
    sample = clamp_sample_box(rect, width, height)
    if not sample:
        return {"label": "", "confidence": 0, "sampleBox": None, "reason": "no_sample"}
    crop = image[sample["y1"]:sample["y2"], sample["x1"]:sample["x2"]]
    result = classify_pixels(crop)
    return {
        "label": result.get("label", ""),
        "rawLabel": result.get("rawLabel", result.get("label", "")),
        "confidence": result.get("confidence", 0),
        "coloredRatio": result.get("coloredRatio", 0),
        "whiteRatio": result.get("whiteRatio", 0),
        "coverageRatio": result.get("coverageRatio", 0),
        "strong": bool(result.get("strong")),
        "reason": result.get("reason", ""),
        "sampleBox": sample,
    }


def analyze_image(image_path, rows, columns=None, engine=None):
    image = cv2.imread(str(image_path))
    if image is None:
        raise RuntimeError(f"cannot read image: {image_path}")
    pp_path = Path(image_path)
    resized_path = None
    if image.shape[1] > 1700:
        scale = 1600 / image.shape[1]
        resized = cv2.resize(image, (1600, max(1, int(round(image.shape[0] * scale)))), interpolation=cv2.INTER_AREA)
        temp = tempfile.NamedTemporaryFile(prefix="ticket-anchor-ocr-", suffix=".jpg", delete=False)
        temp.close()
        resized_path = Path(temp.name)
        cv2.imwrite(str(resized_path), resized)
        image = resized
        pp_path = resized_path
    height, width = image.shape[:2]
    init_seconds = 0
    if engine is None:
        start = time.time()
        engine = create_paddle_ocr()
        init_seconds = time.time() - start
    infer_start = time.time()
    try:
        ocr_items = run_paddle_ocr(engine, pp_path)
    finally:
        if resized_path:
            resized_path.unlink(missing_ok=True)
    infer_seconds = time.time() - infer_start
    ocr_rows = group_ocr_rows(ocr_items)
    matches = []
    row_candidate_lists = []
    for index, row in enumerate(rows):
        tokens = extract_row_tokens(row, columns or [])
        candidates = []
        for visual in ocr_rows:
            scored = score_ticket_row(tokens, visual)
            if scored["score"] >= 0.28:
                candidates.append({"visual": visual, **scored})
        candidates.sort(key=lambda c: c["score"], reverse=True)
        row_candidate_lists.append({"tokens": tokens, "candidates": candidates})

    monotonic_matches = choose_monotonic_row_matches([item["candidates"] for item in row_candidate_lists])
    for index, item in enumerate(row_candidate_lists):
        tokens = item["tokens"]
        candidates = item["candidates"]
        best = candidates[0] if candidates else None
        second = candidates[1] if len(candidates) > 1 else None
        assigned = monotonic_matches[index] if index < len(monotonic_matches) else None
        best = assigned or best
        assigned_visual_index = assigned["visual"]["rowIndex"] if assigned else None
        adjacent_support = False
        if assigned:
            previous_assigned = next((m for m in reversed(monotonic_matches[:index]) if m), None)
            next_assigned = next((m for m in monotonic_matches[index + 1:] if m), None)
            if previous_assigned and int(previous_assigned["visual"]["rowIndex"]) < int(assigned_visual_index):
                adjacent_support = True
            if next_assigned and int(next_assigned["visual"]["rowIndex"]) > int(assigned_visual_index):
                adjacent_support = True
        ambiguous = bool(
            assigned
            and second
            and assigned["score"] - second["score"] < 0.12
            and not adjacent_support
        )
        identifier_anchor_matched = bool(
            assigned
            and assigned.get("identifierMatched")
            and len(assigned.get("matchedTokens") or []) >= 3
            and assigned["score"] >= 0.62
        )
        matched = bool(
            assigned
            and ((assigned["score"] >= 0.72 and assigned["requiredMatched"]) or identifier_anchor_matched)
            and not ambiguous
        )
        match_rect = union_rects(best["matchedWordRects"] if best else []) or (best["visual"]["bbox"] if best else None)
        color = classify_sample(image, match_rect) if best else {"label": "", "confidence": 0, "sampleBox": None, "reason": "no_match"}
        label = color.get("label") or ""
        color_strong = bool(color.get("strong")) and bool(label)
        text_match_high = bool(matched and best and best["score"] >= 0.84)
        matches.append({
            "index": index,
            "label": label,
            "rawLabel": color.get("rawLabel") or label,
            "confidence": min(1, best["score"] if best else 0),
            "coloredRatio": color.get("coloredRatio", 0),
            "whiteRatio": color.get("whiteRatio", 0),
            "coverageRatio": color.get("coverageRatio", 0),
            "strong": color_strong,
            "rowTextVerified": matched,
            "rowGeometryVerified": matched,
            "matched": matched,
            "score": best["score"] if best else 0,
            "matchConfidence": "high" if text_match_high else "medium" if matched else "none",
            "reason": "matched_by_text_anchors" if matched else "ambiguous_or_missing_text_anchor",
            "tokens": [t.get("raw") for t in tokens],
            "matchedTokens": best["matchedTokens"] if best else [],
            "identifierMatched": bool(best.get("identifierMatched")) if best else False,
            "priceOrSoldMatched": bool(best.get("priceOrSoldMatched")) if best else False,
            "visualRowIndex": best["visual"]["rowIndex"] if best else None,
            "visualText": best["visual"]["text"] if best else "",
            "matchedText": best["visual"]["text"] if best else "",
            "bbox": match_rect,
            "sampleBox": color.get("sampleBox"),
            "color": color,
            "ambiguous": ambiguous,
            "secondScore": second["score"] if second else 0,
        })
    all_good = bool(rows) and all(m["matched"] and m["matchConfidence"] == "high" for m in matches)
    return {
        "source": "ticket_row_anchor",
        "image": str(image_path),
        "imageWidth": width,
        "imageHeight": height,
        "initSeconds": round(init_seconds, 2),
        "inferSeconds": round(infer_seconds, 2),
        "ocrVisualRowCount": len(ocr_rows),
        "expectedRows": len(rows),
        "matchedRows": sum(1 for m in matches if m["matched"]),
        "reliable": all_good,
        "exactRowAligned": all_good,
        "autoApplyAllowed": all_good,
        "selectionMode": "ocr_text_anchor_center_band",
        "rows": matches,
        "visualRows": [
            {"rowIndex": r["rowIndex"], "text": r["text"], "bbox": r["bbox"]}
            for r in ocr_rows
        ],
    }


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("image", nargs="?")
    parser.add_argument("--rows-json")
    parser.add_argument("--columns-json", default="[]")
    parser.add_argument("--batch-json")
    args = parser.parse_args()
    try:
        if args.batch_json:
            batch = json.loads(args.batch_json)
            if not isinstance(batch, list):
                raise RuntimeError("batch-json must be a list")
            start = time.time()
            engine = create_paddle_ocr()
            init_seconds = time.time() - start
            results = []
            for item in batch:
                page = item.get("page")
                try:
                    analysis = analyze_image(
                        Path(item.get("image") or ""),
                        item.get("rows") if isinstance(item.get("rows"), list) else [],
                        item.get("columns") if isinstance(item.get("columns"), list) else [],
                        engine=engine,
                    )
                    analysis["page"] = page
                    analysis["batchInitSeconds"] = round(init_seconds, 2)
                    results.append(analysis)
                except Exception as error:
                    results.append({
                        "source": "ticket_row_anchor",
                        "page": page,
                        "reliable": False,
                        "exactRowAligned": False,
                        "autoApplyAllowed": False,
                        "rows": [],
                        "error": str(error),
                    })
            output = {
                "source": "ticket_row_anchor_batch",
                "initSeconds": round(init_seconds, 2),
                "count": len(results),
                "results": results,
            }
        else:
            if not args.image or not args.rows_json:
                raise RuntimeError("image and rows-json are required unless batch-json is provided")
            rows = json.loads(args.rows_json)
            columns = json.loads(args.columns_json)
            output = analyze_image(Path(args.image), rows if isinstance(rows, list) else [], columns if isinstance(columns, list) else [])
        print(json.dumps(output, ensure_ascii=False))
    except Exception as error:
        print(json.dumps({"source": "ticket_row_anchor", "error": str(error)}, ensure_ascii=False))
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
