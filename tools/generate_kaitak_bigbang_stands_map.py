from collections import deque
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


SRC = Path(
    "/var/folders/2m/888pzpdx3k348stskf5jft2h0000gn/T/com.apple.Notes/HardLinkURLTemp/91625B3D-F258-4B87-AAA5-C378C66A9C99/1789580408/啟德主場館會座位表.jpeg"
)
OUT_DIR = Path("/Users/macbook/Documents/pw/output/images")
DESKTOP = Path("/Users/macbook/Desktop")
OUT_DIR.mkdir(parents=True, exist_ok=True)

img = Image.open(SRC).convert("RGB")
base_img = img.copy()
pix = img.load()
base_pix = base_img.load()
W, H = img.size

COLORS = {
    "vip3": (19, 179, 146),      # HKD 2,399
    "2099": (125, 210, 222),     # HKD 2,099
    "2099_rv": (195, 241, 243),  # HKD 2,099 RV
    "1899": (184, 137, 200),     # HKD 1,899
    "1699_rv": (224, 45, 66),    # HKD 1,699 RV
    "1299": (198, 29, 124),      # HKD 1,299
    "899": (240, 213, 236),      # HKD 899
    "699_rv": (20, 109, 173),    # HKD 699 RV
}


def seat_mask(x, y):
    if not (80 <= x <= 3070 and 760 <= y <= 3825):
        return False
    r, g, b = base_pix[x, y]
    # Original Kai Tak blocks are pale blue/green. This excludes text, white card,
    # the dark stage, and the blue page background while preserving the exact blocks.
    return 158 < r < 238 and 180 < g < 248 and 178 < b < 248 and not (r > 232 and g > 246 and b > 246)


def find_components():
    visited = set()
    components = []
    for y in range(760, 3826):
        for x in range(80, 3071):
            if (x, y) in visited or not seat_mask(x, y):
                continue
            q = deque([(x, y)])
            visited.add((x, y))
            pts = []
            sx = sy = 0
            minx = maxx = x
            miny = maxy = y
            while q:
                px, py = q.popleft()
                pts.append((px, py))
                sx += px
                sy += py
                minx = min(minx, px)
                maxx = max(maxx, px)
                miny = min(miny, py)
                maxy = max(maxy, py)
                for nx, ny in ((px + 1, py), (px - 1, py), (px, py + 1), (px, py - 1)):
                    if (nx, ny) in visited or not (80 <= nx <= 3070 and 760 <= ny <= 3825):
                        continue
                    if seat_mask(nx, ny):
                        visited.add((nx, ny))
                        q.append((nx, ny))
            if len(pts) >= 8000:
                components.append(
                    {
                        "points": pts,
                        "bbox": (minx, miny, maxx, maxy),
                        "centroid": (sx / len(pts), sy / len(pts)),
                        "area": len(pts),
                    }
                )
    return components


components = find_components()


def nearest_component(cx, cy):
    best = None
    best_score = 10**18
    for comp in components:
        x1, y1, x2, y2 = comp["bbox"]
        ccx, ccy = comp["centroid"]
        contains = x1 <= cx <= x2 and y1 <= cy <= y2
        score = (ccx - cx) ** 2 + (ccy - cy) ** 2
        if contains:
            score -= 10**9
        if score < best_score:
            best = comp
            best_score = score
    return best


painted = {}
hatched = []


def paint(label, cx, cy, color_key, alpha=0.90, hatch=False):
    comp = nearest_component(cx, cy)
    if not comp:
        raise RuntimeError(f"Missing component for {label}")
    comp_id = tuple(round(v) for v in comp["bbox"])
    if comp_id in painted and painted[comp_id] != color_key:
        raise RuntimeError(f"Component collision: {label} wants {color_key}, already {painted[comp_id]} at {comp_id}")
    painted[comp_id] = color_key
    cr, cg, cb = COLORS[color_key]
    for x, y in comp["points"]:
        r, g, b = pix[x, y]
        pix[x, y] = (
            int(r * (1 - alpha) + cr * alpha),
            int(g * (1 - alpha) + cg * alpha),
            int(b * (1 - alpha) + cb * alpha),
        )
    if hatch:
        hatched.append(comp)


def paint_many(items, color_key, hatch=False):
    for label, cx, cy in items:
        paint(label, cx, cy, color_key, hatch=hatch)


def paint_rect(label, box, color_key, alpha=0.90):
    x1, y1, x2, y2 = box
    cr, cg, cb = COLORS[color_key]
    hit = 0
    for y in range(y1, y2 + 1):
        for x in range(x1, x2 + 1):
            if not seat_mask(x, y):
                continue
            r, g, b = pix[x, y]
            pix[x, y] = (
                int(r * (1 - alpha) + cr * alpha),
                int(g * (1 - alpha) + cg * alpha),
                int(b * (1 - alpha) + cb * alpha),
            )
            hit += 1
    if hit < 500:
        raise RuntimeError(f"Region paint too small for {label}: {hit}")


# BIGBANG reference applied to the existing Kai Tak stand blocks only.
# Left straight side.
paint_many([("534", 332, 948)], "899", hatch=True)
paint_many([("left top red RV", 505, 954)], "1699_rv", hatch=True)
paint_many(
    [("533 outer", 322, 1420), ("532 outer", 322, 1642), ("531 outer", 322, 1865),
     ("530 outer", 322, 2091), ("529 outer", 322, 2315), ("528 outer", 322, 2539),
     ("527 outer", 320, 2763)],
    "1299",
)
paint_many(
    [("533 same-zone rows", 499, 1415), ("532 same-zone rows", 499, 1636),
     ("531 same-zone rows", 498, 1861), ("530 same-zone rows", 500, 2091),
     ("529 same-zone rows", 499, 2315), ("528 same-zone rows", 499, 2541),
     ("527 same-zone rows", 496, 2756)],
    "1899",
)
paint_many([("230", 786, 1411), ("102", 2357, 1481)], "2099_rv", hatch=True)
paint_many([("229", 786, 1636), ("228", 786, 1860), ("227", 786, 2086)], "vip3")
paint_many([("226", 786, 2318), ("225", 786, 2534), ("224", 772, 2762), ("223", 766, 2963)], "2099")

# Right straight side.
paint_many([("right top red RV", 2675, 973)], "1699_rv", hatch=True)
paint_many([("507", 2860, 1416)], "899", hatch=True)
paint_many(
    [("508", 2862, 1640), ("509", 2862, 1862), ("510", 2861, 2088),
     ("511", 2861, 2315), ("512", 2860, 2542), ("513", 2861, 2772),
     ("514", 2815, 3013)],
    "1299",
)
paint_many(
    [("507 same-zone rows", 2672, 1381), ("511 same-zone rows", 2685, 2320),
     ("512 same-zone rows", 2685, 2507), ("513 same-zone rows", 2685, 2735)],
    "1899",
)
paint_many([("103", 2360, 1638), ("104", 2359, 1761), ("105", 2410, 1881),
            ("106", 2357, 2010), ("107", 2358, 2121)], "vip3")
paint_many([("108", 2357, 2265), ("109-110", 2357, 2441), ("212", 2414, 2595),
            ("213", 2435, 2760)], "2099")

# Lower bowl, keeping the original Kai Tak sections intact.
paint_many([("526", 442, 2982), ("525", 490, 3211), ("516", 2503, 3332),
            ("515", 2704, 3217)], "899")
paint_many([("524", 753, 3236), ("517", 2314, 3429)], "699_rv", hatch=True)
paint_many([("899 RV lower-left transition", 910, 3317)], "899", hatch=True)
paint_many([("222", 902, 3097), ("221", 1068, 3099), ("215", 2308, 3099),
            ("214", 2442, 2962)], "1699_rv", hatch=True)
paint_many([("220", 1262, 3079), ("219", 1484, 3080), ("218", 1708, 3079),
            ("217", 1932, 3080), ("216", 2134, 3098)], "2099")
paint_many([("523", 869, 3488), ("522", 1125, 3523), ("521", 1373, 3449),
            ("520", 1600, 3523), ("519", 1826, 3522), ("518", 2075, 3522)], "1299")

# Straight inner row only. Do not split the irregular 523/524 corner: it looks
# broken on the Kai Tak base map.
paint_rect("522 inner rows", (1003, 3288, 1255, 3432), "1899")
paint_rect("521 inner rows", (1264, 3290, 1481, 3432), "1899")
paint_rect("520 inner rows", (1489, 3290, 1708, 3432), "1899")
paint_rect("519 inner rows", (1720, 3290, 1934, 3432), "1899")
paint_rect("518 inner rows", (1944, 3290, 2196, 3432), "1899")


out = img.convert("RGBA")
draw = ImageDraw.Draw(out)


def font(size, bold=False):
    paths = [
        "/System/Library/Fonts/PingFang.ttc",
        "/System/Library/Fonts/Supplemental/Arial Bold.ttf" if bold else "/System/Library/Fonts/Supplemental/Arial.ttf",
    ]
    for path in paths:
        try:
            return ImageFont.truetype(path, size=size)
        except OSError:
            pass
    return ImageFont.load_default()


for comp in hatched:
    x1, y1, x2, y2 = comp["bbox"]
    mask = Image.new("L", (W, H), 0)
    mask_pix = mask.load()
    for x, y in comp["points"]:
        mask_pix[x, y] = 255
    line_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    line_draw = ImageDraw.Draw(line_layer)
    for start_x in range(x1 - 120, x2 + 140, 34):
        line_draw.line((start_x, y2 + 50, start_x + (y2 - y1) + 140, y1 - 90), fill=(38, 45, 48, 130), width=3)
    clipped = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    clipped = Image.composite(line_layer, clipped, mask)
    out.alpha_composite(clipped)


legend = [
    ("VIP3", "HKD 2,399", "vip3", False),
    ("2099", "HKD 2,099", "2099", False),
    ("2099 RV", "HKD 2,099", "2099_rv", True),
    ("5xx内排", "HKD 1,899", "1899", False),
    ("5xx外圈", "HKD 1,299", "1299", False),
    ("1699 RV", "HKD 1,699", "1699_rv", True),
    ("899", "HKD 899", "899", False),
    ("899 RV", "HKD 899", "899", True),
    ("699 RV", "HKD 699", "699_rv", True),
]

for i, (name, price, key, hatch) in enumerate(legend):
    x = 210 + (i % 3) * 920
    y = 570 + (i // 3) * 82
    draw.rounded_rectangle((x - 16, y - 12, x + 805, y + 66), radius=14, fill=(238, 250, 252, 232))
    draw.rounded_rectangle((x, y + 9, x + 108, y + 51), radius=8, fill=COLORS[key] + (255,), outline=(255, 255, 255, 255), width=3)
    if hatch:
        swatch_lines = Image.new("RGBA", (108, 42), (0, 0, 0, 0))
        swatch_draw = ImageDraw.Draw(swatch_lines)
        for line_x in range(-36, 130, 18):
            swatch_draw.line((line_x, 44, line_x + 62, -4), fill=(22, 26, 28, 175), width=3)
        out.alpha_composite(swatch_lines, (x, y + 9))
    draw.text((x + 130, y + 31), f"{name}  {price}", anchor="lm", font=font(32, True), fill=(38, 54, 60, 255))


targets = [
    OUT_DIR / "kaitak_bigbang_stands_color_matched.png",
    OUT_DIR / "kaitak_bigbang_stands_color_matched.jpg",
    DESKTOP / "kaitak_bigbang_stands_color_matched.png",
    DESKTOP / "kaitak_bigbang_stands_color_matched.jpg",
]

for target in targets:
    if target.suffix == ".png":
        out.convert("RGB").save(target)
    else:
        out.convert("RGB").save(target, quality=96, subsampling=0)
    print(target)

print(f"components={len(components)} painted={len(painted)}")
