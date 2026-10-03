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


def manual_only_color_analysis(image_path, expected_rows):
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
        color_analysis = manual_only_color_analysis(image_path, 0)
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
