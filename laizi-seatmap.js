const zones = [
  { id: "311", label: "311", points: [[229, 279], [278, 225], [400, 225], [400, 309], [365, 309], [365, 323], [309, 323], [267, 323]] },
  { id: "312", label: "312", points: [[402, 225], [503, 225], [503, 309], [475, 309], [475, 376], [402, 376]] },
  { id: "313", label: "313", points: [[506, 225], [604, 225], [604, 376], [506, 376]] },
  { id: "314", label: "314", points: [[607, 225], [701, 225], [701, 376], [631, 376], [631, 309], [607, 309]] },
  { id: "315", label: "315", points: [[704, 225], [823, 225], [881, 282], [839, 323], [797, 323], [797, 309], [704, 309]] },
  { id: "310", label: "310", points: [[177, 353], [229, 299], [286, 353], [196, 443], [160, 407]] },
  { id: "316", label: "316", points: [[878, 280], [945, 352], [911, 386], [849, 443], [791, 352], [839, 309]] },
  { id: "309", label: "309", points: [[106, 400], [176, 352], [194, 443], [191, 523], [106, 523]] },
  { id: "317", label: "317", points: [[913, 390], [943, 353], [999, 398], [999, 523], [913, 523]] },
  { id: "308", label: "308", points: [[106, 558], [191, 558], [191, 675], [106, 675]] },
  { id: "318", label: "318", points: [[914, 558], [1000, 558], [1000, 675], [914, 675]] },
  { id: "319", label: "319", points: [[914, 708], [999, 708], [999, 832], [953, 880], [913, 796]] },
  { id: "320", label: "320", points: [[839, 818], [887, 771], [953, 880], [880, 952]] },

  { id: "211", label: "211", points: [[318, 309], [400, 309], [400, 377], [337, 377]] },
  { id: "212", label: "212", points: [[402, 309], [503, 309], [503, 377], [402, 377]] },
  { id: "213", label: "213", points: [[506, 309], [604, 309], [604, 377], [506, 377]] },
  { id: "214", label: "214", points: [[607, 309], [701, 309], [701, 377], [607, 377]] },
  { id: "215", label: "215", points: [[704, 309], [789, 309], [768, 377], [704, 377]] },
  { id: "210", label: "210", points: [[195, 444], [315, 316], [337, 377], [292, 491]] },
  { id: "216", label: "216", points: [[790, 317], [910, 443], [813, 491], [749, 378]] },
  { id: "209", label: "209", points: [[191, 441], [293, 493], [255, 556], [191, 556]] },
  { id: "217", label: "217", points: [[814, 492], [913, 442], [913, 556], [848, 556]] },
  { id: "208", label: "208", points: [[191, 558], [255, 558], [255, 675], [191, 675]] },
  { id: "218", label: "218", points: [[848, 558], [913, 558], [913, 675], [848, 675]] },
  { id: "207", label: "207", points: [[191, 675], [255, 675], [255, 795], [191, 831]] },
  { id: "219", label: "219", points: [[848, 675], [913, 675], [913, 796], [848, 830]] },
  { id: "206", label: "206", points: [[191, 831], [255, 797], [316, 856], [292, 917], [255, 917]] },
  { id: "220", label: "220", points: [[788, 857], [848, 797], [912, 832], [849, 917], [813, 917]] },
  { id: "205", label: "205", points: [[316, 856], [399, 856], [399, 917], [292, 917]] },
  { id: "204", label: "204", points: [[402, 856], [503, 856], [503, 917], [402, 917]] },
  { id: "203", label: "203", points: [[506, 856], [604, 856], [604, 917], [506, 917]] },
  { id: "202", label: "202", points: [[607, 856], [701, 856], [701, 917], [607, 917]] },
  { id: "201", label: "201", points: [[704, 856], [787, 856], [813, 917], [704, 917]] },

  { id: "111", label: "111", points: [[337, 377], [400, 377], [400, 476], [355, 476]] },
  { id: "112", label: "112", points: [[402, 377], [503, 377], [503, 476], [402, 476]] },
  { id: "113", label: "113", points: [[506, 377], [604, 377], [604, 476], [506, 476]] },
  { id: "114", label: "114", points: [[607, 377], [701, 377], [701, 476], [607, 476]] },
  { id: "115", label: "115", points: [[704, 377], [749, 377], [722, 476], [704, 476]] },
  { id: "110", label: "110", points: [[192, 443], [337, 377], [379, 480], [356, 526], [292, 491]] },
  { id: "105", label: "105", points: [[362, 758], [400, 758], [400, 856], [316, 856]] },
  { id: "104", label: "104", points: [[402, 758], [503, 758], [503, 856], [402, 856]] },
  { id: "103", label: "103", points: [[506, 758], [604, 758], [604, 856], [506, 856]] },
  { id: "102", label: "102", points: [[607, 758], [701, 758], [701, 856], [607, 856]] },
  { id: "101", label: "101", points: [[704, 758], [749, 758], [787, 856], [704, 856]] },

  { id: "B1", label: "B1", points: [[355, 510], [410, 510], [410, 578], [373, 578]] },
  { id: "R1", label: "R1", points: [[421, 510], [503, 510], [503, 578], [421, 578]] },
  { id: "I1", label: "I1", points: [[520, 510], [604, 510], [604, 542], [520, 542]] },
  { id: "Z1", label: "Z1", points: [[635, 510], [699, 510], [699, 578], [635, 578]] },
  { id: "E1", label: "E1", points: [[710, 510], [755, 510], [742, 578], [710, 578]] },
  { id: "B2", label: "B2", points: [[373, 662], [410, 662], [410, 729], [355, 729]] },
  { id: "R2", label: "R2", points: [[421, 662], [503, 662], [503, 729], [421, 729]] },
  { id: "I2", label: "I2", points: [[520, 695], [604, 695], [604, 727], [520, 727]] },
  { id: "Z2", label: "Z2", points: [[635, 662], [699, 662], [699, 729], [635, 729]] },
  { id: "E2", label: "E2", points: [[710, 662], [742, 662], [755, 729], [710, 729]] },

  { id: "WC-L1", label: "轮椅席 左上", points: [[196, 424], [309, 313], [319, 322], [207, 435]] },
  { id: "WC-L2", label: "轮椅席 左下", points: [[195, 797], [207, 786], [319, 899], [309, 909]] },
  { id: "WC-R1", label: "轮椅席 右上", points: [[789, 322], [799, 313], [912, 426], [902, 436]] },
  { id: "WC-R2", label: "轮椅席 右下", points: [[789, 898], [900, 786], [913, 797], [799, 910]] },
];

const overlay = document.querySelector("#seatOverlay");
const selectedZone = document.querySelector("#selectedZone");
const zoneButtons = document.querySelector("#zoneButtons");
const zoneCount = document.querySelector("#zoneCount");
const hoverTip = document.querySelector("#hoverTip");
const stage = document.querySelector("#seatmapStage");
const image = stage.querySelector("img");
let activeId = "";
let imageSampler = null;

function toPoints(points) {
  return points.map(([x, y]) => `${x},${y}`).join(" ");
}

function setActive(id) {
  activeId = id;
  const zone = zones.find((item) => item.id === id);
  selectedZone.textContent = zone ? zone.label : "未选择";
  document.querySelectorAll(".seat-zone, .zone-button").forEach((node) => {
    node.classList.toggle("active", node.dataset.zoneId === id);
  });
}

function getCentroid(points) {
  const sum = points.reduce(
    (total, [x, y]) => {
      total.x += x;
      total.y += y;
      return total;
    },
    { x: 0, y: 0 },
  );
  return { x: sum.x / points.length, y: sum.y / points.length };
}

function pointInPolygon(point, polygon) {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];
    const intersects = yi > point.y !== yj > point.y && point.x < ((xj - xi) * (point.y - yi)) / (yj - yi) + xi;
    if (intersects) inside = !inside;
  }
  return inside;
}

function getMapPoint(event) {
  const rect = stage.getBoundingClientRect();
  return {
    x: ((event.clientX - rect.left) / rect.width) * 1108,
    y: ((event.clientY - rect.top) / rect.height) * 1108,
  };
}

function createImageSampler() {
  const canvas = document.createElement("canvas");
  canvas.width = 1108;
  canvas.height = 1108;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  return {
    colorAt(point) {
      const x = Math.max(0, Math.min(1107, Math.round(point.x)));
      const y = Math.max(0, Math.min(1107, Math.round(point.y)));
      return context.getImageData(x, y, 1, 1).data;
    },
  };
}

function isSeatColor([r, g, b]) {
  const yellowSeat = r > 205 && g > 205 && b > 95 && r - b > 40 && g - b > 35;
  const wheelchairSeat = r > 165 && g > 165 && b > 185 && Math.abs(r - g) < 35 && b - r > 8;
  return yellowSeat || wheelchairSeat;
}

function findZoneAtPoint(point) {
  const directHit = zones.find((zone) => pointInPolygon(point, zone.points));
  if (directHit) return directHit;

  if (!imageSampler || !isSeatColor(imageSampler.colorAt(point))) return null;

  return zones
    .map((zone) => {
      const center = zone.center || getCentroid(zone.points);
      zone.center = center;
      return { zone, distance: Math.hypot(point.x - center.x, point.y - center.y) };
    })
    .filter((item) => item.distance < 90)
    .sort((a, b) => a.distance - b.distance)[0]?.zone || null;
}

function showTip(event, label) {
  return;
}

function hideTip() {
  hoverTip.classList.add("hidden");
}

function render() {
  overlay.innerHTML = zones
    .map(
      (zone) => `<polygon class="seat-zone" data-zone-id="${zone.id}" points="${toPoints(zone.points)}" tabindex="0" role="button" aria-label="${zone.label}"></polygon>`,
    )
    .join("");

  zoneButtons.innerHTML = zones
    .map((zone) => `<button class="zone-button" type="button" data-zone-id="${zone.id}">${zone.label}</button>`)
    .join("");

  zoneCount.textContent = `${zones.length} 个`;

  document.querySelectorAll("[data-zone-id]").forEach((node) => {
    const zone = zones.find((item) => item.id === node.dataset.zoneId);
    node.addEventListener("click", () => setActive(zone.id));
    node.addEventListener("mouseenter", (event) => showTip(event, zone.label));
    node.addEventListener("mousemove", (event) => showTip(event, zone.label));
    node.addEventListener("mouseleave", hideTip);
    node.addEventListener("focus", () => setActive(zone.id));
    node.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        setActive(zone.id);
      }
    });
  });

  if (image.complete) {
    imageSampler = createImageSampler();
  } else {
    image.addEventListener("load", () => {
      imageSampler = createImageSampler();
    }, { once: true });
  }

  stage.addEventListener("click", (event) => {
    if (event.target.classList.contains("seat-zone")) return;
    const zone = findZoneAtPoint(getMapPoint(event));
    if (zone) setActive(zone.id);
  });

  stage.addEventListener("mousemove", (event) => {
    if (event.target.classList.contains("seat-zone")) return;
    const zone = findZoneAtPoint(getMapPoint(event));
    if (zone) {
      showTip(event, zone.label);
    } else {
      hideTip();
    }
  });

  stage.addEventListener("mouseleave", hideTip);
}

render();
