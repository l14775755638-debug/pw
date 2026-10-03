#!/usr/bin/env python3
import argparse
import json
import os
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


def render_pdf_page(pdf_path, page, pdftoppm):
    output_prefix = Path(tempfile.mkdtemp(prefix="ticket-local-page-")) / "page"
    temp_dir = output_prefix.parent
    command = [
        pdftoppm,
        "-jpeg",
        "-r",
        str(int(os.environ.get("TICKET_LOCAL_RENDER_DPI") or 150)),
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
    cells = [str(word.get("text") or "").strip() for word in words]
    cells = [cell for cell in cells if cell]
    return "\t".join(cells)


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
