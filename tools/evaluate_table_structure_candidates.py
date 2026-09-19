#!/usr/bin/env python3
import argparse
import csv
import json
import subprocess
import sys
from pathlib import Path


DEFAULT_PDF = Path("/Users/macbook/Downloads/%E5%9C%B0%E7%A7%9F%E5%8D%81%E5%91%A8%E5%B9%B4%E5%90%88%E9%9B%8608-191132.pdf")
DEFAULT_IMAGE_DIR = Path("tmp/pdfs/pdf-regression")
DEFAULT_DECISION_REPORT = DEFAULT_IMAGE_DIR / "full-50-row-decision-current-v8.json"
DEFAULT_OUT_DIR = Path("tmp/table-structure-eval")
BUNDLED_PYTHON = Path("/Users/macbook/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3")


def run_json(command):
    try:
        result = subprocess.run(command, check=False, capture_output=True, text=True)
    except Exception as error:
        return {"error": str(error), "reliable": False, "rows": []}
    raw = (result.stdout or "").strip()
    if not raw:
        return {"error": (result.stderr or "empty output").strip(), "reliable": False, "rows": []}
    try:
        return json.loads(raw)
    except Exception as error:
        return {"error": f"{error}: {raw[:500]}", "reliable": False, "rows": []}


def load_expected_rows(path):
    with path.open(encoding="utf-8") as handle:
        data = json.load(handle)
    pages = {}
    for page in data.get("pages", []):
        page_number = int(page.get("page") or 0)
        if not page_number:
            continue
        pages[page_number] = {
            "rowCount": int(page.get("rowCount") or 0),
            "publish": int(page.get("publish") or 0),
            "sold": int(page.get("sold") or 0),
            "color": int(page.get("color") or 0),
            "missingPrice": int(page.get("missingPrice") or 0),
            "currentMode": page.get("mode") or "",
            "currentReliable": bool(page.get("reliable")),
        }
    return pages


def summarize_labels(rows):
    counts = {}
    for row in rows or []:
        label = row.get("label") or row.get("rawLabel") or ""
        if not label:
            label = "未识别"
        counts[label] = counts.get(label, 0) + 1
    return counts


def label_summary_text(counts):
    if not counts:
        return ""
    return ", ".join(f"{key}:{value}" for key, value in sorted(counts.items()))


def evaluate_page(page_number, expected, image_dir, pdf_path):
    image_path = image_dir / f"page-{page_number:02d}.jpg"
    row_count = expected["rowCount"]
    opencv = run_json([
        "python3",
        "tools/detect_ticket_row_colors.py",
        str(image_path),
        "--expected-rows",
        str(row_count),
    ])
    pdf_vector = run_json([
        str(BUNDLED_PYTHON),
        "tools/detect_pdf_row_colors.py",
        str(pdf_path),
        "--page",
        str(page_number),
        "--expected-rows",
        str(row_count),
    ])
    candidates = {
        "opencv_image": opencv,
        "pdf_vector": pdf_vector,
    }
    rows = []
    for name, result in candidates.items():
        detected = int(result.get("detectedRows") or len(result.get("rows") or []))
        reliable = bool(result.get("reliable"))
        exact = bool(result.get("exactRowAligned"))
        labels = summarize_labels(result.get("rows") or [])
        issue_parts = []
        if detected != row_count:
            issue_parts.append(f"row_count {detected}/{row_count}")
        if not reliable:
            issue_parts.append("not_reliable")
        if result.get("error"):
            issue_parts.append(str(result.get("error"))[:160])
        issue_parts.extend(result.get("unreliableReasons") or [])
        issue_parts.extend(result.get("warningReasons") or [])
        rows.append({
            "page": page_number,
            "candidate": name,
            "expectedRows": row_count,
            "detectedRows": detected,
            "reliable": reliable,
            "exact": exact,
            "selectionMode": result.get("selectionMode") or "",
            "labels": label_summary_text(labels),
            "issues": "; ".join(dict.fromkeys(issue_parts)),
            "currentMode": expected["currentMode"],
            "currentReliable": expected["currentReliable"],
            "currentPublish": expected["publish"],
            "currentSold": expected["sold"],
            "currentColorSkips": expected["color"],
            "currentMissingPrice": expected["missingPrice"],
        })
    return rows


def write_markdown(rows, path):
    total = {}
    for row in rows:
        bucket = total.setdefault(row["candidate"], {"pages": 0, "reliable": 0, "exact": 0, "row_match": 0})
        bucket["pages"] += 1
        bucket["reliable"] += 1 if row["reliable"] else 0
        bucket["exact"] += 1 if row["exact"] else 0
        bucket["row_match"] += 1 if row["expectedRows"] == row["detectedRows"] else 0

    lines = ["# Table Structure Candidate Evaluation", ""]
    lines.append("## Summary")
    for candidate, stats in sorted(total.items()):
        pages = max(1, stats["pages"])
        lines.append(
            f"- {candidate}: pages={stats['pages']}, row_count_match={stats['row_match']}/{pages}, "
            f"exact={stats['exact']}/{pages}, reliable={stats['reliable']}/{pages}"
        )
    lines.extend(["", "## Page Details", ""])
    lines.append("| page | candidate | rows | reliable | mode | labels | issues |")
    lines.append("| --- | --- | --- | --- | --- | --- | --- |")
    for row in rows:
        issue = row["issues"].replace("|", "/")
        labels = row["labels"].replace("|", "/")
        lines.append(
            f"| {row['page']} | {row['candidate']} | {row['detectedRows']}/{row['expectedRows']} | "
            f"{row['reliable']} | {row['selectionMode']} | {labels} | {issue} |"
        )
    path.write_text("\n".join(lines) + "\n", encoding="utf-8")


def parse_pages(value, available_pages):
    if not value:
        return sorted(available_pages)
    pages = []
    for part in value.split(","):
        part = part.strip()
        if not part:
            continue
        if "-" in part:
            left, right = part.split("-", 1)
            pages.extend(range(int(left), int(right) + 1))
        else:
            pages.append(int(part))
    return [page for page in pages if page in available_pages]


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--pdf", default=str(DEFAULT_PDF))
    parser.add_argument("--image-dir", default=str(DEFAULT_IMAGE_DIR))
    parser.add_argument("--decision-report", default=str(DEFAULT_DECISION_REPORT))
    parser.add_argument("--pages", default="")
    parser.add_argument("--out-dir", default=str(DEFAULT_OUT_DIR))
    args = parser.parse_args()

    pdf_path = Path(args.pdf)
    image_dir = Path(args.image_dir)
    expected_by_page = load_expected_rows(Path(args.decision_report))
    pages = parse_pages(args.pages, expected_by_page.keys())
    if not pages:
        print("No pages to evaluate.", file=sys.stderr)
        return 2

    out_dir = Path(args.out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)
    all_rows = []
    for page in pages:
        all_rows.extend(evaluate_page(page, expected_by_page[page], image_dir, pdf_path))

    json_path = out_dir / "candidate-evaluation.json"
    csv_path = out_dir / "candidate-evaluation.csv"
    md_path = out_dir / "candidate-evaluation.md"
    json_path.write_text(json.dumps(all_rows, ensure_ascii=False, indent=2), encoding="utf-8")
    with csv_path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=list(all_rows[0].keys()))
        writer.writeheader()
        writer.writerows(all_rows)
    write_markdown(all_rows, md_path)
    print(json.dumps({"pages": pages, "rows": len(all_rows), "json": str(json_path), "csv": str(csv_path), "markdown": str(md_path)}, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
