const LAIZI_SEATMAP_SIZE = { width: 1108, height: 1108 };
const LAIZI_SEATMAP_TEMPLATE_ZONES = [
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

function createTemplateZones(templateZones, sourceSize, targetSize = sourceSize) {
  const scaleX = targetSize.width / sourceSize.width;
  const scaleY = targetSize.height / sourceSize.height;
  return templateZones.map((zone) => ({
    id: String(zone.id).toLowerCase().replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-").replace(/^-+|-+$/g, ""),
    label: zone.label,
    aliases: [zone.label, zone.id],
    polygon: zone.points.map(([x, y]) => [Math.round(x * scaleX), Math.round(y * scaleY)]),
    source: "template",
  }));
}

function createLaiziTemplateZones(targetSize = LAIZI_SEATMAP_SIZE) {
  return createTemplateZones(LAIZI_SEATMAP_TEMPLATE_ZONES, LAIZI_SEATMAP_SIZE, targetSize);
}

const events = [
  {
    id: "tws-macau",
    name: "TWS 澳门",
    location: "澳门 · 伦敦人综艺馆",
    dates: "2026.09.19 / 09.20",
    dateOptions: [
      { id: "20260919", label: "9月19日", aliases: ["9.19", "9月19日", "20260919", "Sep 19"] },
      { id: "20260920", label: "9月20日", aliases: ["9.20", "9月20日", "20260920", "Sep 20"] },
    ],
    venue: "The Londoner Arena",
    seatmapTitle: "TWS 澳门官方座位图",
    seatmapImage: "assets/tws-seatmap.jpg",
    seatmapSize: { width: 1320, height: 922 },
    zones: [
      { id: "fe", label: "FE", aliases: ["FE"], polygon: [[368, 712], [555, 712], [622, 651], [527, 529], [448, 559], [394, 618], [370, 675]] },
      { id: "fw", label: "FW", aliases: ["FW"], polygon: [[700, 529], [813, 566], [909, 642], [958, 707], [747, 707], [702, 651], [717, 618], [681, 584]] },
      { id: "203", label: "203", aliases: ["203"], polygon: [[231, 566], [278, 521], [395, 568], [335, 616], [286, 648], [232, 622]] },
      { id: "204", label: "204", aliases: ["204"], polygon: [[307, 476], [376, 425], [445, 397], [488, 509], [377, 590], [331, 540]] },
      { id: "205", label: "205", aliases: ["205"], polygon: [[453, 393], [577, 366], [589, 499], [496, 514]] },
      { id: "206", label: "206", aliases: ["206"], polygon: [[608, 361], [743, 361], [709, 487], [609, 487]] },
      { id: "207", label: "207", aliases: ["207"], polygon: [[751, 390], [879, 424], [817, 542], [724, 491]] },
      { id: "208", label: "208", aliases: ["208"], polygon: [[881, 427], [1009, 500], [924, 588], [817, 542]] },
      { id: "209", label: "209", aliases: ["209"], polygon: [[1012, 505], [1086, 553], [1087, 607], [985, 648], [924, 588]] },
      { id: "302", label: "302", aliases: ["302"], polygon: [[229, 318], [298, 283], [365, 395], [274, 480], [230, 440]] },
      { id: "303", label: "303", aliases: ["303"], polygon: [[310, 265], [435, 214], [493, 329], [413, 367], [368, 391]] },
      { id: "304", label: "304", aliases: ["304"], polygon: [[446, 210], [505, 198], [530, 310], [470, 323]] },
      { id: "305", label: "305", aliases: ["305"], polygon: [[526, 198], [651, 198], [651, 313], [619, 313], [619, 327], [542, 327]] },
      { id: "306", label: "306", aliases: ["306"], polygon: [[666, 198], [793, 198], [776, 327], [699, 327], [699, 313], [666, 313]] },
      { id: "307", label: "307", aliases: ["307"], polygon: [[813, 212], [870, 225], [844, 337], [781, 326]] },
      { id: "308", label: "308", aliases: ["308"], polygon: [[884, 226], [1005, 280], [955, 394], [890, 360], [833, 330]] },
      { id: "309", label: "309", aliases: ["309"], polygon: [[1015, 285], [1094, 326], [1093, 439], [1052, 480], [958, 397]] },
    ],
    tables: [
      {
        id: "tws-source-1",
        title: "票源 1",
        originalImage: "assets/tws-source-1.jpg",
        columns: ["序号", "日期", "票价", "区域", "行", "座位", "张数", "售价"],
        rows: [
          ["1", "9.19", "1942", "FW", "/", "26X", "单张", "5800"],
          ["2", "9.19", "1942", "FE", "/", "37X", "单张", "5000"],
          ["3", "9.19", "1942", "FE", "/", "37X", "单张", "5000"],
          ["4", "9.19", "1942", "FE", "/", "41X", "单张", "4500"],
          ["8", "9.19", "1888", "207", "F", "X", "单张", "6800"],
          ["12", "9.19", "1888-RV", "209", "K", "X", "单张（视阻）", "3000"],
          ["13", "9.20", "1942", "FE", "/", "22X", "单张", "6200"],
          ["14", "9.20", "1942", "FW", "/", "27X", "单张", "5800"],
          ["15", "9.20", "1942", "FE", "/", "31X", "单张", "5400"],
        ],
      },
      {
        id: "tws-source-2",
        title: "票源 2",
        originalImage: "assets/tws-source-2.jpg",
        columns: ["日期", "票价", "区域", "行数", "连坐数量", "售价"],
        rows: [
          ["9月19日", "1888", "208", "C", "3", "5800"],
          ["9月19日", "1888", "208", "F", "3", "5200"],
          ["9月19日", "1888", "204（视阻）", "C", "1", "3900"],
          ["9月19日", "1888", "204（视阻）", "D", "3", "3800"],
          ["9月19日", "1888", "204", "H", "4", "4800"],
          ["9月19日", "1888", "204", "J", "3", "4700"],
          ["9月19日", "1888", "204", "O", "2", "4400"],
          ["9月19日", "1888", "203/209（视阻）", "B", "2", "3400"],
          ["9月19日", "1888", "203/209（视阻）", "E", "3", "3200"],
          ["9月19日", "1388", "306", "P", "2", "3700"],
          ["9月20日", "1888", "208", "D", "3", "5400"],
          ["9月20日", "1888", "208", "F", "4", "5000"],
          ["9月20日", "1888", "208", "K", "4", "4600"],
          ["9月20日", "1888", "204", "F", "3", "5000"],
          ["9月20日", "1888", "204", "H", "3", "4800"],
          ["9月20日", "1888", "204", "J", "3", "4700"],
          ["9月20日", "1888", "203/209（视阻）", "B", "3", "3400"],
          ["9月20日", "1388", "306", "J", "2", "3800"],
        ],
      },
      {
        id: "tws-source-3",
        title: "票源 3",
        originalImage: "assets/tws-source-3.jpg",
        columns: ["序号", "演出日期", "票面", "区域", "排数", "座位号", "备注", "售价"],
        rows: [
          ["twsmo-1", "20260919", "1888", "204", "E", "1X", "四连可拆", "4600"],
          ["twsmo-2", "20260919", "1888", "204", "E", "1X", "四连可拆", "4600"],
          ["twsmo-3", "20260919", "1888", "204", "E", "1X", "四连可拆", "4600"],
          ["twsmo-4", "20260919", "1888", "204", "E", "1X", "四连可拆", "4600"],
          ["twsmo-12", "20260919", "1942", "FW", "GA", "32X", "", "5300"],
          ["twsmo-16", "20260920", "1888", "208", "E", "1X", "两连可拆", "4600"],
          ["twsmo-17", "20260920", "1888", "208", "E", "2X", "两连可拆", "4600"],
          ["twsmo-18", "20260920", "1888", "208", "K", "1X", "三连可拆", "4500"],
          ["twsmo-19", "20260920", "1888", "208", "K", "1X", "三连可拆", "4500"],
          ["twsmo-20", "20260920", "1888", "208", "K", "1X", "三连可拆", "4500"],
          ["twsmo-21", "20260920", "888", "302", "H", "2X", "", "2200"],
          ["twsmo-24", "20260920", "1942", "FE", "GA", "34X", "", "5100"],
          ["twsmo-25", "20260920", "1942", "FE", "GA", "46X", "", "4500"],
          ["twsmo-27", "20260920", "1942", "FW", "GA", "25X", "", "5800"],
          ["twsmo-28", "20260920", "1942", "FW", "GA", "37X", "", "4800"],
        ],
      },
      {
        id: "tws-source-4",
        title: "票源 4",
        originalImage: "assets/tws-source-4.jpg",
        columns: ["序号", "日期", "票价", "区域", "号数", "备注", "售价"],
        rows: [
          ["3", "9.19", "VIP-1942", "FE", "36x", "", "4300"],
          ["4", "9.19", "VIP-1942", "FE", "37x", "", "4100"],
          ["8", "9.19", "VIP-1942", "FW", "22x", "", "4700"],
          ["9", "9.19", "VIP-1942", "FW", "32x", "", "4300"],
          ["10", "9.19", "VIP-1942", "FW", "35x", "", "4300"],
          ["14", "9.20", "VIP-1942", "FE", "34x", "", "4400"],
          ["15", "9.20", "VIP-1942", "FE", "36x", "", "4300"],
          ["18_1", "9.20", "VIP-1942", "FE", "44x", "2连", "4100"],
          ["19", "9.20", "VIP-1942", "FW", "4x", "", "10500"],
          ["21", "9.20", "VIP-1942", "FW", "27x", "", "4800"],
          ["22", "9.20", "VIP-1942", "FW", "33x", "", "4500"],
          ["23", "9.20", "VIP-1942", "FW", "34x", "", "4500"],
          ["24", "9.20", "VIP-1942", "FW", "37x", "", "4400"],
          ["26", "9.20", "VIP-1942", "FW", "43x", "", "4100"],
        ],
      },
      {
        id: "tws-source-5",
        title: "票源 5",
        originalImage: "assets/tws-source-5.jpg",
        columns: ["日期", "票面", "区域", "排", "连坐数量", "备注", "单价"],
        rows: [
          ["9月19日", "1888", "204", "C", "隔1连", "自取", "5600"],
          ["9月19日", "1888", "204", "G", "1", "自取", "4600"],
          ["9月19日", "1888", "204", "N", "四连（余3）", "", "4200"],
          ["9月19日", "1888", "205", "H", "3", "", "5000"],
          ["9月19日", "1888", "207", "F", "2", "自取", "5600"],
          ["9月19日", "1888", "208", "B", "2", "自取", "6500"],
          ["9月19日", "1888", "208", "H", "1", "自取", "4500"],
          ["9月19日", "1888", "208", "K", "三连（余2）", "", "4300"],
          ["9月19日", "1942", "FE", "375内", "2+1", "自取", "4300"],
          ["9月19日", "1942", "FE", "405内", "1", "自取", "4200"],
          ["9月19日", "1942", "FW", "225内", "1", "自取", "4600"],
          ["9月19日", "1888RV", "208", "B", "3", "", "4800"],
          ["9月20日", "1888", "204", "D", "1", "自取", "4500"],
          ["9月20日", "1888", "204", "F", "3", "", "4400"],
          ["9月20日", "1888", "206", "A", "1", "自取", "15800"],
          ["9月20日", "1888", "206", "G", "1", "自取", "9800"],
          ["9月20日", "1888", "207", "A", "1", "自取", "8600"],
          ["9月20日", "1888", "208", "A", "1+1", "自取", "7200"],
          ["9月20日", "1888", "208", "C", "2+1", "自取", "5400"],
          ["9月20日", "1942", "FE", "350内", "1", "自取", "4300"],
          ["9月20日", "1942", "FW", "350内", "2+1", "自取", "4300"],
          ["9月20日", "1888RV", "203", "G", "3", "", "2900"],
          ["9月20日", "1888RV", "204", "G", "2", "", "3800"],
          ["9月20日", "1888RV", "208", "D", "隔一连", "", "4200"],
          ["9月20日", "1888RV", "209", "H", "3", "", "2800"],
        ],
      },
    ],
  },
  {
    id: "laizi",
    name: "拉椅子",
    location: "韩国仁川 · INSPIRE Arena",
    dates: "9.12 / 9.13",
    dateOptions: [
      { id: "laizi-0912", label: "9月12日", aliases: ["9.12", "9月12日", "0912"] },
      { id: "laizi-0913", label: "9月13日", aliases: ["9.13", "9月13日", "0913"] },
    ],
    venue: "INSPIRE Arena",
    seatmapTitle: "拉椅子官方座位图",
    seatmapImage: "assets/laizi-seatmap.jpg",
    seatmapFileName: "laizi-seatmap.jpg",
    seatmapSize: { width: 1108, height: 1108 },
    zones: createLaiziTemplateZones(),
    tables: [],
  },
  {
    id: "bigbang-goyang",
    name: "BigBang 高阳",
    location: "韩国高阳 · KINTEX",
    dates: "2026.10.03 / 10.04",
    dateOptions: [
      { id: "20261003", label: "10月3日", aliases: ["10.3", "10月3日", "20261003", "Oct 3", "2026-10-03"] },
      { id: "20261004", label: "10月4日", aliases: ["10.4", "10月4日", "20261004", "Oct 4", "2026-10-04"] },
    ],
    venue: "KINTEX",
    seatmapTitle: "BigBang 高阳官方座位图",
    seatmapImage: "assets/seatmap-bigbang-goyang.svg",
    seatmapSize: { width: 1200, height: 520 },
    zones: [
      { id: "f1", label: "Floor F1", aliases: ["Floor F1", "F1"], polygon: [[210, 152], [420, 152], [420, 298], [210, 298]] },
      { id: "vip-standing", label: "VIP Standing", aliases: ["VIP Standing", "VIP"], polygon: [[494, 152], [704, 152], [704, 298], [494, 298]] },
      { id: "f3", label: "Floor F3", aliases: ["Floor F3", "F3"], polygon: [[778, 152], [988, 152], [988, 298], [778, 298]] },
      { id: "112", label: "R区 112", aliases: ["R区112", "R区 112", "112"], polygon: [[108, 344], [322, 344], [322, 444], [108, 444]] },
      { id: "214", label: "2층 214", aliases: ["2층214", "2층 214", "214"], polygon: [[386, 344], [600, 344], [600, 444], [386, 444]] },
      { id: "318", label: "3층 318", aliases: ["3층318", "3층 318", "318"], polygon: [[664, 344], [878, 344], [878, 444], [664, 444]] },
      { id: "316", label: "316", aliases: ["316"], polygon: [[942, 344], [1092, 344], [1092, 444], [942, 444]] },
    ],
    tables: [
      {
        id: "bigbang-source-d",
        title: "票源 D",
        originalImage: "assets/original-bigbang-d.svg",
        columns: ["日期", "区域", "座位", "票价", "数量", "备注"],
        rows: [
          ["2026-10-03", "Floor F1", "A列 7-8", "KRW 420,000", "2", "连座"],
          ["2026-10-03", "2층 214", "5열 11", "KRW 260,000", "1", "正面视野"],
          ["2026-10-04", "VIP Standing", "入场号 088", "KRW 580,000", "1", "早号"],
        ],
      },
      {
        id: "bigbang-source-e",
        title: "票源 E",
        originalImage: "assets/original-bigbang-e.svg",
        columns: ["Show Day", "Block", "Seat No.", "Ask", "Count", "Notes"],
        rows: [
          ["Oct 3", "R区 112", "Row 6 Seat 1-2", "3300 CNY", "2", "aisle pair"],
          ["Oct 4", "Floor F3", "B列 20", "2600 CNY", "1", "extended stage"],
          ["Oct 4", "3층 318", "9열 6-9", "1500 CNY", "4", "can split"],
        ],
      },
    ],
  },
];

let currentEvent = events[0];
let searchTerm = "";
let selectedDateId = null;
let sortMode = "recommended";
let selectedZone = null;
let hoveredZone = null;
let seatmapPixelSampler = null;

const customerView = document.querySelector("#customerView");
const adminView = document.querySelector("#adminView");
const modeButtons = document.querySelectorAll("[data-mode]");
const modeShortcuts = document.querySelectorAll("[data-mode-shortcut]");
const eventList = document.querySelector("#eventList");
const eventTitle = document.querySelector("#eventTitle");
const eventLocation = document.querySelector("#eventLocation");
const eventDatePill = document.querySelector("#eventDatePill");
const seatmapTitle = document.querySelector("#seatmapTitle");
const dateFilter = document.querySelector("#dateFilter");
const sortFilter = document.querySelector("#sortFilter");
const seatmapFrame = document.querySelector("#seatmapFrame");
const zoneDrawer = document.querySelector("#zoneDrawer");
const searchInput = document.querySelector("#searchInput");
const clearButton = document.querySelector("#clearButton");
const resultCount = document.querySelector("#resultCount");
const results = document.querySelector("#results");
const imageModal = document.querySelector("#imageModal");
const modalTitle = document.querySelector("#modalTitle");
const modalImage = document.querySelector("#modalImage");
const modalPdf = document.querySelector("#modalPdf");
const toast = document.querySelector("#toast");
const runtimeBanner = document.querySelector("#runtimeBanner");
const adminWorkflowTabs = document.querySelector("#adminWorkflowTabs");
const adminEventList = document.querySelector("#adminEventList");
const adminEventTitle = document.querySelector("#adminEventTitle");
const adminPackageName = document.querySelector("#adminPackageName");
const adminSeatmapName = document.querySelector("#adminSeatmapName");
const adminTableCount = document.querySelector("#adminTableCount");
const adminZoneCount = document.querySelector("#adminZoneCount");
const adminChecklist = document.querySelector("#adminChecklist");
const copyEnvTemplateButton = document.querySelector("#copyEnvTemplateButton");
const aiProviderInput = document.querySelector("#aiProviderInput");
const aiKeyNameInput = document.querySelector("#aiKeyNameInput");
const aiModelInput = document.querySelector("#aiModelInput");
const envTemplate = document.querySelector("#envTemplate");
const aiConfigStatus = document.querySelector("#aiConfigStatus");
const uploadTargetEvent = document.querySelector("#uploadTargetEvent");
const seatmapUploadInput = document.querySelector("#seatmapUploadInput");
const selectedSeatmapName = document.querySelector("#selectedSeatmapName");
const adminSeatmapPreview = document.querySelector("#adminSeatmapPreview");
const seatmapMarkerStage = document.querySelector("#seatmapMarkerStage");
const seatmapMarkerLayer = document.querySelector("#seatmapMarkerLayer");
const applySeatmapButton = document.querySelector("#applySeatmapButton");
const seatmapStatus = document.querySelector("#seatmapStatus");
const scanSeatmapButton = document.querySelector("#scanSeatmapButton");
const fallbackScanButton = document.querySelector("#fallbackScanButton");
const saveScannedZonesButton = document.querySelector("#saveScannedZonesButton");
const testSeatmapButton = document.querySelector("#testSeatmapButton");
const saveSeatmapTemplateButton = document.querySelector("#saveSeatmapTemplateButton");
const applyMatchedTemplateButton = document.querySelector("#applyMatchedTemplateButton");
const toggleTemplateLibraryButton = document.querySelector("#toggleTemplateLibraryButton");
const templateLibrarySummary = document.querySelector("#templateLibrarySummary");
const seatmapTemplateList = document.querySelector("#seatmapTemplateList");
const zoneNameInput = document.querySelector("#zoneNameInput");
const zoneMarkingStatus = document.querySelector("#zoneMarkingStatus");
const recognizedZonesList = document.querySelector("#recognizedZonesList");
const unrecognizedZonesList = document.querySelector("#unrecognizedZonesList");
const confirmAllButton = document.querySelector("#confirmAllButton");
const clearPendingButton = document.querySelector("#clearPendingButton");
const toggleNewEventForm = document.querySelector("#toggleNewEventForm");
const newEventForm = document.querySelector("#newEventForm");
const newEventName = document.querySelector("#newEventName");
const newEventLocation = document.querySelector("#newEventLocation");
const newEventDates = document.querySelector("#newEventDates");
const createEventButton = document.querySelector("#createEventButton");
const cancelNewEventButton = document.querySelector("#cancelNewEventButton");
const newEventStatus = document.querySelector("#newEventStatus");
const ticketUploadForm = document.querySelector("#ticketUploadForm");
const sourceFileInput = document.querySelector("#sourceFileInput");
const selectedSourceName = document.querySelector("#selectedSourceName");
const uploadTableTitle = document.querySelector("#uploadTableTitle");
const pdfDetectionStatus = document.querySelector("#pdfDetectionStatus");
const uploadTableText = document.querySelector("#uploadTableText");
const uploadStatus = document.querySelector("#uploadStatus");
const uploadRecords = document.querySelector("#uploadRecords");
const publishUploadButton = document.querySelector("#publishUploadButton");
const reviewTitle = document.querySelector("#reviewTitle");
const reviewLayout = document.querySelector("#reviewLayout");
const confirmReviewButton = document.querySelector("#confirmReviewButton");
const publishedTables = document.querySelector("#publishedTables");

let uploadedSource = null;
let pendingSeatmap = null;
const uploadedTables = [];
const pendingTables = [];
let selectedPendingTableId = null;
const STORAGE_KEY = "ticket-admin-state-v1";
let markingZones = [];
let markingIndex = 0;
let isMarkingZones = false;
let scannedRegions = [];
let aiStatus = null;
let activeTicketOcrJobId = null;
let activeTicketOcrPollTimer = null;
let seatmapTemplates = [];
let templateLibraryOpen = false;
let seatmapUploadRunId = 0;
const aiProviderTemplates = {
  aliyun: {
    provider: "阿里云百炼 / qwen3-vl-plus",
    keyName: "DASHSCOPE_API_KEY",
    model: "qwen3-vl-plus",
    env: ["AI_PROVIDER=aliyun", "DASHSCOPE_API_KEY=填你的阿里云百炼Key", "ALIYUN_VISION_MODEL=qwen3-vl-plus"],
    status: "统一扫描会优先匹配模板，再调用阿里云百炼识别，失败时自动转本地兜底扫描。",
  },
  volcengine: {
    provider: "火山方舟 / 豆包视觉",
    keyName: "ARK_API_KEY",
    model: "doubao-vision-pro",
    env: ["AI_PROVIDER=volcengine", "ARK_API_KEY=填你的火山方舟Key", "ARK_VISION_MODEL=doubao-vision-pro"],
    status: "备用国内方案。后续接入后也会进入统一扫描链路：模板、AI、本地兜底。",
  },
  openai: {
    provider: "OpenAI / gpt-5.4",
    keyName: "OPENAI_API_KEY",
    model: "gpt-5.4",
    env: ["AI_PROVIDER=openai", "OPENAI_API_KEY=填你的OpenAI Key", "OPENAI_VISION_MODEL=gpt-5.4"],
    status: "回退方案。如果 OpenAI 账号恢复额度，可以切回，但页面仍使用同一个“扫描热区”入口。",
  },
};

function normalize(value) {
  return String(value).toLowerCase().replace(/[\\s/（）()·.-]+/g, "");
}

function rowMatches(row, term) {
  if (!term) return true;
  const normalizedTerm = normalize(term);
  return row.some((cell) => normalize(cell).includes(normalizedTerm));
}

function splitTableLine(line) {
  if (line.includes("\t")) return line.split("\t");
  if (line.includes(",")) return line.split(",");
  return line.trim().split(/\s{2,}/);
}

function parseTableText(text) {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  if (lines.length < 2) return null;
  const columns = splitTableLine(lines[0]).map((cell) => cell.trim()).filter(Boolean);
  const rows = lines
    .slice(1)
    .map((line) => splitTableLine(line).map((cell) => cell.trim()))
    .filter((row) => row.some(Boolean));
  if (!columns.length || !rows.length) return null;
  return { columns, rows };
}

function splitRecognizedTables(text) {
  const blocks = text
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);
  const parsedBlocks = blocks.map(parseTableText).filter(Boolean);
  return parsedBlocks.length ? parsedBlocks : [];
}

async function detectPdfPageCount(file) {
  if (!file || !(file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf"))) return 1;
  const text = await file.text();
  const pageMatches = text.match(/\/Type\s*\/Page\b/g);
  return Math.max(1, pageMatches?.length || 1);
}

function stopTicketOcrPolling() {
  if (activeTicketOcrPollTimer) {
    clearTimeout(activeTicketOcrPollTimer);
    activeTicketOcrPollTimer = null;
  }
  activeTicketOcrJobId = null;
}

async function pollTicketOcrJob(jobId) {
  const response = await fetch(`/api/tables/recognize/job?id=${encodeURIComponent(jobId)}`);
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || result.error || "批量识别任务查询失败。");
  const total = result.pagesQueued || result.totalPages || 0;
  const processed = result.pagesProcessed || 0;
  const success = result.pagesSucceeded || 0;
  const failed = result.pagesFailed || 0;
  const progressText = total ? `${processed}/${total}` : `${processed}`;
  pdfDetectionStatus.textContent = result.message || `正在批量识别 ${progressText} 页。`;
  setUploadStatus(`批量识别进度：${progressText} 页，已读到 ${success} 页内容${failed ? `，失败 ${failed} 页` : ""}。`, "loading");

  if (result.status === "done") {
    stopTicketOcrPolling();
    uploadTableText.value = result.text || "";
    pdfDetectionStatus.textContent = `${result.message} 已自动填入下方表格内容；请检查后生成待确认表。`;
    setUploadStatus("批量 PDF 表格已识别，请检查内容后生成待确认表。", "success");
    showToast("批量识别完成。", "success");
    return;
  }

  if (result.status === "error") {
    stopTicketOcrPolling();
    throw new Error(result.message || "批量识别没有读到可用表格内容。");
  }

  activeTicketOcrPollTimer = setTimeout(() => {
    pollTicketOcrJob(jobId).catch((error) => {
      stopTicketOcrPolling();
      pdfDetectionStatus.textContent = error.message || "批量识别失败，请重试。";
      setUploadStatus("批量识别失败，请重试或手动粘贴 OCR 文本。", "error");
      showToast("批量识别失败。", "error");
    });
  }, 1200);
}

async function recognizeTicketSource(file, detectedTables) {
  const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
  if (!isPdf) return;
  stopTicketOcrPolling();
  const dataUrl = await readFileAsDataUrl(file);
  const maxPages = Math.min(Math.max(detectedTables || 1, 1), 100);
  setUploadStatus(`正在创建批量识别任务，预计处理 ${maxPages} 页...`, "loading");
  pdfDetectionStatus.textContent = `PDF 约 ${detectedTables} 页，正在创建批量 OCR 任务。`;
  const response = await fetch("/api/tables/recognize/start", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ file: dataUrl, fileName: file.name, detectedPages: detectedTables, maxPages }),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || result.error || "PDF 批量识别任务创建失败。");
  activeTicketOcrJobId = result.id;
  pdfDetectionStatus.textContent = result.message || "批量识别任务已开始。";
  setUploadStatus("批量识别任务已开始，可以先等进度跑完。", "loading");
  showToast("批量识别已开始。", "success");
  await pollTicketOcrJob(result.id);
}

function slugify(value) {
  return (
    normalize(value)
      .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
      .replace(/^-+|-+$/g, "") || `event-${Date.now()}`
  );
}

function isLaiziSeatmapCandidate(fileName = "") {
  const text = [
    currentEvent?.id,
    currentEvent?.name,
    currentEvent?.seatmapTitle,
    currentEvent?.seatmapFileName,
    currentEvent?.seatmapImage,
    fileName,
  ]
    .filter(Boolean)
    .join(" ");
  return /拉椅子|赖子|laizi/i.test(text);
}

function getScannedRegionsFromTemplate(zones) {
  return zones.map((zone) => {
    const bounds = getPolygonBounds(zone.polygon);
    return {
      x: bounds.minX,
      y: bounds.minY,
      width: bounds.maxX - bounds.minX,
      height: bounds.maxY - bounds.minY,
      polygon: zone.polygon,
      label: zone.label,
      missingIndex: null,
      source: "template",
    };
  });
}

function applyLaiziTemplateToScan(source = "拉椅子标准模板") {
  scannedRegions = getScannedRegionsFromTemplate(createLaiziTemplateZones(currentEvent.seatmapSize));
  recognizedZonesList.textContent = scannedRegions.map((region) => region.label).join(", ");
  unrecognizedZonesList.textContent = "无";
  zoneMarkingStatus.textContent = `${source}已套用：${scannedRegions.length} 个真实多边形热区已生成，可直接保存热区并前台测试。`;
  renderSeatmapMarkers();
}

function normalizeTemplateName(value) {
  return normalize(String(value || "").replace(/\.[a-z0-9]+$/i, ""));
}

function cloneZones(zones) {
  return zones.map((zone) => ({
    id: zone.id,
    label: zone.label,
    aliases: Array.isArray(zone.aliases) ? [...zone.aliases] : [zone.label],
    polygon: zone.polygon.map(([x, y]) => [x, y]),
    source: zone.source || "template",
  }));
}

function getBuiltInSeatmapTemplates() {
  return [
    {
      id: "builtin-laizi",
      name: "拉椅子标准模板",
      fileName: "laizi-seatmap.jpg",
      eventName: "拉椅子",
      seatmapImage: "assets/laizi-seatmap.jpg",
      seatmapFileName: "laizi-seatmap.jpg",
      size: LAIZI_SEATMAP_SIZE,
      zones: createLaiziTemplateZones(),
      fingerprint: "builtin-laizi",
      keywords: ["拉椅子", "赖子", "laizi"],
      builtIn: true,
      createdAt: 0,
    },
  ];
}

function getAllSeatmapTemplates() {
  return [...getBuiltInSeatmapTemplates(), ...seatmapTemplates];
}

function getTemplateZonesForSize(template, targetSize = template.size) {
  return createTemplateZones(
    template.zones.map((zone) => ({ id: zone.id, label: zone.label, points: zone.polygon })),
    template.size,
    targetSize,
  );
}

function getHexDistance(a, b) {
  if (!a || !b || a.length !== b.length) return Infinity;
  let distance = 0;
  for (let index = 0; index < a.length; index += 1) {
    const value = Number.parseInt(a[index], 16) ^ Number.parseInt(b[index], 16);
    distance += value.toString(2).replace(/0/g, "").length;
  }
  return distance;
}

function getTemplateMatchScore(template, source) {
  const templateName = normalizeTemplateName(`${template.name} ${template.fileName} ${template.eventName || ""}`);
  const sourceName = normalizeTemplateName(`${source.fileName || ""} ${currentEvent?.name || ""} ${currentEvent?.seatmapTitle || ""}`);
  const size = source.size || currentEvent.seatmapSize;
  const templateRatio = template.size.width / template.size.height;
  const sourceRatio = size.width / size.height;
  const ratioPenalty = Math.abs(templateRatio - sourceRatio) * 100;
  const keywordHit = (template.keywords || []).some((keyword) => sourceName.includes(normalizeTemplateName(keyword)));
  const nameHit = sourceName && templateName && (sourceName.includes(templateName) || templateName.includes(sourceName));
  const fingerprintDistance = template.builtIn ? Infinity : getHexDistance(template.fingerprint, source.fingerprint);
  if (fingerprintDistance <= 8) return { template, score: fingerprintDistance + ratioPenalty, reason: "图片指纹匹配" };
  if (keywordHit || nameHit) return { template, score: 20 + ratioPenalty + (template.builtIn ? -8 : 0), reason: "名称匹配" };
  return null;
}

function findBestSeatmapTemplate(source = {}) {
  const matches = getAllSeatmapTemplates()
    .map((template) => getTemplateMatchScore(template, source))
    .filter(Boolean)
    .sort((a, b) => a.score - b.score);
  return matches[0] || null;
}

function getTemplateSeatmapImage(template) {
  return template.seatmapImage || template.image || "";
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function applySeatmapTemplate(template, reason = "模板") {
  const templateImage = getTemplateSeatmapImage(template);
  if (templateImage) {
    currentEvent.seatmapImage = templateImage;
    currentEvent.seatmapFileName = template.seatmapFileName || template.fileName || `${template.name}.jpg`;
    currentEvent.seatmapSize = { ...template.size };
    currentEvent.seatmapFingerprint = template.fingerprint || "";
    currentEvent.seatmapTitle = `${currentEvent.name} 官方座位图`;
  }
  currentEvent.zones = getTemplateZonesForSize(template, currentEvent.seatmapSize);
  currentEvent.seatmapTemplateId = template.id;
  selectedDateId = null;
  selectedZone = null;
  hoveredZone = null;
  const imageText = templateImage ? "座位图和热区" : "热区";
  zoneMarkingStatus.textContent = `${reason}已套用：${template.name}，已带入${imageText}，共 ${currentEvent.zones.length} 个精准热区。`;
  seatmapStatus.textContent = `已套用模板：${template.name}。当前演出已拥有座位图，客人前台可以直接查看/点击，票源表格后面再上传。`;
  saveAppState();
  renderAdminEvent();
  render();
  showToast(`已套用完整模板：${template.name}`, "success");
}

async function saveCurrentSeatmapAsTemplate(auto = false) {
  if (!currentEvent.zones.length) {
    showToast("当前还没有可保存的热区。", "error");
    return null;
  }
  let fingerprint = currentEvent.seatmapFingerprint || "";
  if (!fingerprint) {
    fingerprint = await getImageFingerprint(currentEvent.seatmapImage, currentEvent.seatmapSize);
    currentEvent.seatmapFingerprint = fingerprint;
  }
  const name = `${currentEvent.name} · ${getSeatmapFileName(currentEvent)}`;
  const template = {
    id: `tpl-${slugify(currentEvent.id || currentEvent.name)}-${Date.now()}`,
    name,
    eventName: currentEvent.name,
    fileName: getSeatmapFileName(currentEvent),
    seatmapImage: currentEvent.seatmapImage,
    seatmapFileName: getSeatmapFileName(currentEvent),
    size: { ...currentEvent.seatmapSize },
    zones: cloneZones(currentEvent.zones),
    fingerprint,
    builtIn: false,
    createdAt: Date.now(),
  };
  const sameIndex = seatmapTemplates.findIndex(
    (item) =>
      (fingerprint && item.fingerprint === fingerprint) ||
      (normalizeTemplateName(item.fileName) === normalizeTemplateName(template.fileName) && normalizeTemplateName(item.eventName) === normalizeTemplateName(template.eventName)),
  );
  if (sameIndex >= 0) {
    template.id = seatmapTemplates[sameIndex].id;
    seatmapTemplates[sameIndex] = template;
  } else {
    seatmapTemplates.unshift(template);
  }
  currentEvent.seatmapTemplateId = template.id;
  if (!saveAppState()) return null;
  renderSeatmapTemplates();
  renderAdminChecklist();
  if (!auto) showToast("已保存整套座位图模板。", "success");
  return template;
}

function renderSeatmapTemplates() {
  if (!templateLibrarySummary || !seatmapTemplateList) return;
  const templates = getAllSeatmapTemplates();
  const userTemplateCount = seatmapTemplates.length;
  templateLibrarySummary.textContent = templates.length
    ? `已有 ${templates.length} 个模板（自建 ${userTemplateCount} 个），模板会同时带入座位图和精准热区。`
    : "保存座位图和精准热区后，下次同款演出可一键套用。";
  if (toggleTemplateLibraryButton) {
    toggleTemplateLibraryButton.textContent = templateLibraryOpen ? "收起模板大全" : "模板大全";
  }
  seatmapTemplateList.hidden = !templateLibraryOpen;
  seatmapTemplateList.classList.toggle("collapsed", !templateLibraryOpen);
  seatmapTemplateList.innerHTML = templates
    .map(
      (template) => `
        <div class="template-item ${template.id === currentEvent.seatmapTemplateId ? "active" : ""}">
          <span class="template-item-main">
            <b>${escapeHtml(template.name)}</b>
            <small>${getTemplateSeatmapImage(template) ? "含座位图" : "仅热区"} · ${template.size.width}x${template.size.height} · ${template.zones.length} 个热区${template.builtIn ? " · 内置" : ""}</small>
          </span>
          <span class="template-item-actions">
            <button class="small-button ghost" type="button" data-apply-template="${template.id}">套用</button>
            ${
              template.builtIn
                ? `<span class="template-lock">系统模板</span>`
                : `
                  <button class="small-button ghost" type="button" data-edit-template="${template.id}">编辑</button>
                  <button class="small-button ghost danger" type="button" data-delete-template="${template.id}">删除</button>
                `
            }
          </span>
        </div>
      `,
    )
    .join("");
}

function createPlaceholderSeatmap(name) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="720" viewBox="0 0 1200 720">
      <rect width="1200" height="720" fill="#fffdf8"/>
      <rect x="110" y="110" width="980" height="420" rx="8" fill="#e9f0ef" stroke="#146c75" stroke-width="4"/>
      <rect x="360" y="560" width="480" height="90" rx="8" fill="#1d2433"/>
      <text x="600" y="610" text-anchor="middle" font-family="Arial, sans-serif" font-size="34" font-weight="700" fill="#fff">STAGE</text>
      <text x="600" y="320" text-anchor="middle" font-family="Arial, sans-serif" font-size="40" font-weight="700" fill="#0e4d55">${name}</text>
      <text x="600" y="370" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" fill="#687083">请上传官方座位图</text>
    </svg>
  `;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function parseDateOptions(text) {
  const parts = text
    .split(/[\/,，、]/)
    .map((part) => part.trim())
    .filter(Boolean);
  const values = parts.length ? parts : ["待定"];
  return values.map((label, index) => ({
    id: `date-${Date.now()}-${index}`,
    label,
    aliases: [label, label.replace(/\s+/g, "")],
  }));
}

function getImageSize(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve({ width: image.naturalWidth || 1200, height: image.naturalHeight || 720 });
    image.onerror = reject;
    image.src = url;
  });
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function getCanvasFingerprint(canvas) {
  const sampleSize = 8;
  const sampleCanvas = document.createElement("canvas");
  sampleCanvas.width = sampleSize;
  sampleCanvas.height = sampleSize;
  const sampleContext = sampleCanvas.getContext("2d", { willReadFrequently: true });
  sampleContext.drawImage(canvas, 0, 0, sampleSize, sampleSize);
  const { data } = sampleContext.getImageData(0, 0, sampleSize, sampleSize);
  const grays = [];
  for (let index = 0; index < data.length; index += 4) {
    grays.push(data[index] * 0.299 + data[index + 1] * 0.587 + data[index + 2] * 0.114);
  }
  const average = grays.reduce((sum, value) => sum + value, 0) / grays.length;
  let bits = "";
  grays.forEach((value) => {
    bits += value >= average ? "1" : "0";
  });
  let fingerprint = "";
  for (let index = 0; index < bits.length; index += 4) {
    fingerprint += Number.parseInt(bits.slice(index, index + 4), 2).toString(16);
  }
  return fingerprint;
}

function getImageFingerprint(url, size) {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = size?.width || image.naturalWidth || 1200;
        canvas.height = size?.height || image.naturalHeight || 720;
        const context = canvas.getContext("2d", { willReadFrequently: true });
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(getCanvasFingerprint(canvas));
      } catch {
        resolve("");
      }
    };
    image.onerror = () => resolve("");
    image.src = url;
  });
}

function waitForImageLoad(image) {
  if (image?.complete && image.naturalWidth && image.naturalHeight) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const cleanup = () => {
      image.removeEventListener("load", handleLoad);
      image.removeEventListener("error", handleError);
    };
    const handleLoad = () => {
      cleanup();
      resolve();
    };
    const handleError = () => {
      cleanup();
      reject(new Error("座位图加载失败。"));
    };
    image.addEventListener("load", handleLoad);
    image.addEventListener("error", handleError);
  });
}

function compressImageDataUrl(source, maxWidth = 1800) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      const scale = Math.min(1, maxWidth / image.naturalWidth);
      const width = Math.round(image.naturalWidth * scale);
      const height = Math.round(image.naturalHeight * scale);
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext("2d");
      context.drawImage(image, 0, 0, width, height);
      resolve({ url: canvas.toDataURL("image/jpeg", 0.86), size: { width, height }, fingerprint: getCanvasFingerprint(canvas) });
    };
    image.onerror = reject;
    image.src = source;
  });
}

function getImageElementDataUrl(image, maxWidth = 1800) {
  if (!image?.complete || !image.naturalWidth || !image.naturalHeight) {
    throw new Error("座位图还没有加载完成。");
  }
  const scale = Math.min(1, maxWidth / image.naturalWidth);
  const width = Math.max(1, Math.round(image.naturalWidth * scale));
  const height = Math.max(1, Math.round(image.naturalHeight * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  context.drawImage(image, 0, 0, width, height);
  return {
    url: canvas.toDataURL("image/jpeg", 0.88),
    size: { width, height },
  };
}

function hydrateSeatmapTemplatesFromEvents() {
  let changed = false;
  seatmapTemplates = seatmapTemplates.map((template) => {
    if (getTemplateSeatmapImage(template)) return template;
    const sourceEvent = events.find((event) => {
      const sameTemplate = event.seatmapTemplateId && event.seatmapTemplateId === template.id;
      const sameFingerprint = event.seatmapFingerprint && template.fingerprint && event.seatmapFingerprint === template.fingerprint;
      const sameName =
        normalizeTemplateName(event.seatmapFileName) === normalizeTemplateName(template.fileName) &&
        normalizeTemplateName(event.name) === normalizeTemplateName(template.eventName);
      return event.seatmapImage && (sameTemplate || sameFingerprint || sameName);
    });
    if (!sourceEvent) return template;
    changed = true;
    return {
      ...template,
      seatmapImage: sourceEvent.seatmapImage,
      seatmapFileName: sourceEvent.seatmapFileName || template.fileName,
      size: sourceEvent.seatmapSize || template.size,
      fingerprint: sourceEvent.seatmapFingerprint || template.fingerprint,
    };
  });
  return changed;
}

function saveAppState() {
  const serializableEvents = events.map((event) => ({
    id: event.id,
    name: event.name,
    location: event.location,
    dates: event.dates,
    dateOptions: event.dateOptions,
    venue: event.venue,
    seatmapTitle: event.seatmapTitle,
    seatmapImage: event.seatmapImage,
    seatmapFileName: event.seatmapFileName,
    seatmapSize: event.seatmapSize,
    seatmapFingerprint: event.seatmapFingerprint || "",
    seatmapTemplateId: event.seatmapTemplateId || "",
    zones: event.zones,
    tables: event.tables,
  }));
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ events: serializableEvents, currentEventId: currentEvent.id, seatmapTemplates }));
    return true;
  } catch {
    showToast("保存失败：图片可能太大，请换小一点的座位图。", "error");
    return false;
  }
}

function loadAppState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return;
  try {
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed.events) || !parsed.events.length) return;
    seatmapTemplates = Array.isArray(parsed.seatmapTemplates) ? parsed.seatmapTemplates : [];
    events.splice(0, events.length, ...parsed.events);
    currentEvent = events.find((event) => event.id === parsed.currentEventId) || events[0];
    const hydrated = hydrateSeatmapTemplatesFromEvents();
    const removed = events.reduce((count, event) => count + removeOversizedZones(event), 0);
    if (removed || hydrated) saveAppState();
  } catch {
    localStorage.removeItem(STORAGE_KEY);
  }
}

function getSelectedDate() {
  return currentEvent.dateOptions.find((date) => date.id === selectedDateId) || null;
}

function dateMatchesRow(row) {
  const date = getSelectedDate();
  if (!date) return false;
  const searchable = normalize(row.join(" "));
  return date.aliases.some((alias) => searchable.includes(normalize(alias)));
}

function findColumnIndex(columns, names) {
  return columns.findIndex((column) => names.some((name) => normalize(column).includes(normalize(name))));
}

function splitZoneValue(value) {
  return String(value || "")
    .replace(/[（）()]/g, " ")
    .split(/[\/,，、\s]+/)
    .map((item) => item.replace(/视阻|restricted|rv/gi, "").trim())
    .filter(Boolean);
}

function zoneTokenMatches(value, zone) {
  const aliases = zone.aliases.map(normalize);
  return splitZoneValue(value).some((token) => aliases.includes(normalize(token)));
}

function zoneMatchesTicket(ticket, zone) {
  const zoneIndex = findColumnIndex(ticket.table.columns, ["区域", "区", "block", "section", "구역"]);
  if (zoneIndex >= 0) return zoneTokenMatches(ticket.row[zoneIndex], zone);
  return ticket.row.some((cell) => zoneTokenMatches(cell, zone));
}

function zoneMatchesRow(row, zone, table = null) {
  if (table) return zoneMatchesTicket({ table, row, index: -1 }, zone);
  return row.some((cell) => zoneTokenMatches(cell, zone));
}

function prepareTickets(tickets) {
  const filtered = selectedDateId ? tickets.filter((ticket) => dateMatchesRow(ticket.row)) : tickets;
  return sortTickets(filtered);
}

function getZoneTickets(zone) {
  const tickets = currentEvent.tables.flatMap((table) =>
    table.rows
      .map((row, index) => ({ table, row, index }))
      .filter((ticket) => zoneMatchesTicket(ticket, zone)),
  );
  return prepareTickets(tickets);
}

function getSearchTickets(term) {
  if (!term) return [];
  const tickets = currentEvent.tables.flatMap((table) =>
    table.rows
      .map((row, index) => ({ table, row, index }))
      .filter((ticket) => rowMatches(ticket.row, term)),
  );
  return prepareTickets(tickets);
}

function countTicketsForDate(dateId) {
  const previousDateId = selectedDateId;
  selectedDateId = dateId;
  const count = currentEvent.tables.flatMap((table) => table.rows.map((row, index) => ({ table, row, index }))).filter((ticket) => dateMatchesRow(ticket.row)).length;
  selectedDateId = previousDateId;
  return count;
}

function selectFirstDateWithTickets() {
  if (!currentEvent.dateOptions.length) return;
  const matchingDate = currentEvent.dateOptions.find((date) => countTicketsForDate(date.id) > 0);
  selectedDateId = matchingDate?.id || currentEvent.dateOptions[0].id;
}

function countZoneRowsFromTables() {
  return currentEvent.zones.reduce((total, zone) => {
    const zoneRows = currentEvent.tables.flatMap((table) => table.rows.filter((row) => zoneMatchesRow(row, zone, table)));
    return total + zoneRows.length;
  }, 0);
}

function getPublishMatchMessage(scopeText, matchedRows) {
  if (!currentEvent.zones.length) {
    return {
      type: "error",
      toast: "已发布，但还没有座位图热区。",
      text: `${scopeText} 已发布到前台，但当前座位图还没有保存可点击热区。请先“智能识别区域”并“保存热区”，系统才能把表格票源绑定到座位图区块。`,
    };
  }
  if (!matchedRows) {
    return {
      type: "error",
      toast: "已发布，但区号未匹配。",
      text: `${scopeText} 已发布到前台，但暂时没有匹配到座位图区号，请检查表格“区域”列是否和座位图编号一致。`,
    };
  }
  return {
    type: "success",
    toast: "已发布给客户前台。",
    text: `${scopeText} 已发布到前台，并匹配到 ${matchedRows} 条可按区域展示的票源。`,
  };
}

function makeTicketKey(table, rowIndex) {
  return `${table.id}:${rowIndex}`;
}

function findTicketByKey(key) {
  const [tableId, rowIndexText] = key.split(":");
  const table = currentEvent.tables.find((item) => item.id === tableId);
  if (!table) return null;
  const rowIndex = Number(rowIndexText);
  const row = table.rows[rowIndex];
  if (!row) return null;
  return { table, row, index: rowIndex };
}

function extractNumber(value) {
  const match = String(value).match(/\d+/);
  return match ? Number(match[0]) : null;
}

function getColumnValue(ticket, names) {
  const index = ticket.table.columns.findIndex((column) => names.some((name) => normalize(column).includes(normalize(name))));
  return index >= 0 ? ticket.row[index] : "";
}

function getTicketPrice(ticket) {
  const directValue = getColumnValue(ticket, ["售价", "单价", "price", "ask"]);
  const directNumber = extractNumber(directValue);
  if (directNumber) return directNumber;

  const numericValues = ticket.row.map(extractNumber).filter(Boolean);
  return numericValues.length ? numericValues[numericValues.length - 1] : 999999;
}

function getTicketPositionNumber(ticket) {
  const value = getColumnValue(ticket, ["座位", "座位号", "号数", "排", "排数", "行", "行数"]);
  return extractNumber(value) || 999;
}

function getRecommendationScore(ticket) {
  const price = getTicketPrice(ticket);
  const position = getTicketPositionNumber(ticket);
  const remark = ticket.row.join(" ");
  const splitPenalty = /隔|视阻|RV|restricted/i.test(remark) ? 900 : 0;
  const pairBonus = /连|2\+1|三连|四连/.test(remark) ? -180 : 0;
  return price + position * 2 + splitPenalty + pairBonus;
}

function sortTickets(tickets) {
  return [...tickets].sort((a, b) => {
    if (sortMode === "price-asc") return getTicketPrice(a) - getTicketPrice(b);
    if (sortMode === "price-desc") return getTicketPrice(b) - getTicketPrice(a);
    return getRecommendationScore(a) - getRecommendationScore(b);
  });
}

function getSeatmapPoint(event, seatmap) {
  const svg = seatmap.querySelector("#seatmapHotspots");
  if (svg?.createSVGPoint && svg.getScreenCTM()) {
    const svgPoint = svg.createSVGPoint();
    svgPoint.x = event.clientX;
    svgPoint.y = event.clientY;
    const point = svgPoint.matrixTransform(svg.getScreenCTM().inverse());
    const viewBox = svg.viewBox.baseVal;
    if (point.x < viewBox.x || point.y < viewBox.y || point.x > viewBox.x + viewBox.width || point.y > viewBox.y + viewBox.height) return null;
    return { x: point.x, y: point.y };
  }
  const image = seatmap.querySelector(".seatmap-image");
  const imageRect = image?.getBoundingClientRect() || seatmap.getBoundingClientRect();
  const naturalWidth = image?.naturalWidth || currentEvent.seatmapSize.width;
  const naturalHeight = image?.naturalHeight || currentEvent.seatmapSize.height;
  const renderedRatio = imageRect.width / imageRect.height;
  const naturalRatio = naturalWidth / naturalHeight;
  let drawWidth = imageRect.width;
  let drawHeight = imageRect.height;
  let offsetX = 0;
  let offsetY = 0;
  if (renderedRatio > naturalRatio) {
    drawWidth = imageRect.height * naturalRatio;
    offsetX = (imageRect.width - drawWidth) / 2;
  } else if (renderedRatio < naturalRatio) {
    drawHeight = imageRect.width / naturalRatio;
    offsetY = (imageRect.height - drawHeight) / 2;
  }
  const localX = event.clientX - imageRect.left - offsetX;
  const localY = event.clientY - imageRect.top - offsetY;
  if (localX < 0 || localY < 0 || localX > drawWidth || localY > drawHeight) return null;
  const scaleX = naturalWidth / drawWidth;
  const scaleY = naturalHeight / drawHeight;
  const x = localX * scaleX;
  const y = localY * scaleY;
  return {
    x,
    y,
    scaleX,
    scaleY,
  };
}

function createSeatmapPixelSampler(image, seatmapSize) {
  if (!image?.complete || !image.naturalWidth || !image.naturalHeight) return null;
  const canvas = document.createElement("canvas");
  canvas.width = seatmapSize.width;
  canvas.height = seatmapSize.height;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  let imageData;
  try {
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  } catch {
    return null;
  }
  const data = imageData.data;
  const background = getEdgeBackgroundColor(data, canvas.width, canvas.height);
  const componentIds = new Int32Array(canvas.width * canvas.height);
  componentIds.fill(-1);
  const components = [];
  const colorAtIndex = (index) => {
    const offset = index * 4;
    return [data[offset], data[offset + 1], data[offset + 2], data[offset + 3]];
  };
  const isSeatIndex = (index) => {
    const [red, green, blue] = colorAtIndex(index);
    return isAdaptiveSeatPixel(red, green, blue, background);
  };
  const clampX = (x) => Math.max(0, Math.min(canvas.width - 1, Math.round(x)));
  const clampY = (y) => Math.max(0, Math.min(canvas.height - 1, Math.round(y)));
  const findNearestSeatIndex = (point, radius = 7) => {
    const centerX = clampX(point.x);
    const centerY = clampY(point.y);
    let bestIndex = -1;
    let bestDistance = Infinity;
    for (let dy = -radius; dy <= radius; dy += 1) {
      for (let dx = -radius; dx <= radius; dx += 1) {
        const distance = dx * dx + dy * dy;
        if (distance > radius * radius || distance >= bestDistance) continue;
        const x = centerX + dx;
        const y = centerY + dy;
        if (x < 0 || y < 0 || x >= canvas.width || y >= canvas.height) continue;
        const index = y * canvas.width + x;
        if (!isSeatIndex(index)) continue;
        bestIndex = index;
        bestDistance = distance;
      }
    }
    return bestIndex;
  };
  return {
    colorAt(point) {
      const x = clampX(point.x);
      const y = clampY(point.y);
      return colorAtIndex(y * canvas.width + x);
    },
    componentAt(point) {
      const directX = clampX(point.x);
      const directY = clampY(point.y);
      const directStart = directY * canvas.width + directX;
      const start = isSeatIndex(directStart) ? directStart : findNearestSeatIndex(point);
      if (start < 0) return null;
      const startX = start % canvas.width;
      const startY = Math.floor(start / canvas.width);
      const existingId = componentIds[start];
      if (existingId >= 0) return components[existingId] || null;

      const id = components.length;
      const queue = [start];
      componentIds[start] = id;
      let minX = startX;
      let maxX = startX;
      let minY = startY;
      let maxY = startY;
      let sumX = 0;
      let sumY = 0;
      let pixels = 0;

      for (let cursor = 0; cursor < queue.length; cursor += 1) {
        const current = queue[cursor];
        const x = current % canvas.width;
        const y = Math.floor(current / canvas.width);
        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y);
        sumX += x;
        sumY += y;
        pixels += 1;
        const neighbors = [current - 1, current + 1, current - canvas.width, current + canvas.width];
        neighbors.forEach((next) => {
          if (next < 0 || next >= componentIds.length || componentIds[next] >= 0 || !isSeatIndex(next)) return;
          const nextX = next % canvas.width;
          if (Math.abs(nextX - x) > 1) return;
          componentIds[next] = id;
          queue.push(next);
        });
      }

      const component = {
        id,
        bounds: { minX, maxX, minY, maxY },
        center: { x: sumX / pixels, y: sumY / pixels },
        pixels,
        contains(pointToCheck) {
          const x = clampX(pointToCheck.x);
          const y = clampY(pointToCheck.y);
          return componentIds[y * canvas.width + x] === id;
        },
      };
      components[id] = component;
      return component;
    },
  };
}

function rebuildSeatmapPixelSampler() {
  seatmapPixelSampler = null;
  const image = seatmapFrame.querySelector(".seatmap-image");
  if (!image || !currentEvent?.seatmapSize) return;
  const build = () => {
    seatmapPixelSampler = createSeatmapPixelSampler(image, currentEvent.seatmapSize);
  };
  if (image.complete) {
    build();
  } else {
    image.addEventListener("load", build, { once: true });
  }
}

function isLikelySeatPixel(red, green, blue) {
  const yellowSeat = red > 180 && green > 165 && blue < 160 && red >= green * 0.82 && green >= blue * 1.18;
  const paleYellowSeat = red > 205 && green > 200 && blue > 95 && red - blue > 35 && green - blue > 32;
  const wheelchairSeat = red > 145 && green > 140 && blue > 155 && Math.abs(red - green) < 45 && blue - red > 5;
  return yellowSeat || paleYellowSeat || wheelchairSeat;
}

function rgbToHsl(red, green, blue) {
  const r = red / 255;
  const g = green / 255;
  const b = blue / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const lightness = (max + min) / 2;
  if (max === min) return { hue: 0, saturation: 0, lightness };
  const delta = max - min;
  const saturation = lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);
  let hue = 0;
  if (max === r) hue = (g - b) / delta + (g < b ? 6 : 0);
  if (max === g) hue = (b - r) / delta + 2;
  if (max === b) hue = (r - g) / delta + 4;
  return { hue: hue * 60, saturation, lightness };
}

function getColorDistance(a, b) {
  return Math.sqrt((a.red - b.red) ** 2 + (a.green - b.green) ** 2 + (a.blue - b.blue) ** 2);
}

function getMedian(values) {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)] || 0;
}

function getEdgeBackgroundColor(data, width, height) {
  const reds = [];
  const greens = [];
  const blues = [];
  const step = Math.max(2, Math.round(Math.min(width, height) / 80));
  const pushPixel = (x, y) => {
    const offset = (y * width + x) * 4;
    reds.push(data[offset]);
    greens.push(data[offset + 1]);
    blues.push(data[offset + 2]);
  };
  for (let x = 0; x < width; x += step) {
    pushPixel(x, 0);
    pushPixel(x, height - 1);
  }
  for (let y = 0; y < height; y += step) {
    pushPixel(0, y);
    pushPixel(width - 1, y);
  }
  return { red: getMedian(reds), green: getMedian(greens), blue: getMedian(blues) };
}

function isAdaptiveSeatPixel(red, green, blue, background) {
  if (isLikelySeatPixel(red, green, blue)) return true;
  const { hue, saturation, lightness } = rgbToHsl(red, green, blue);
  const distance = getColorDistance({ red, green, blue }, background);
  const channelRange = Math.max(red, green, blue) - Math.min(red, green, blue);
  const darkText = red < 82 && green < 82 && blue < 82;
  const nearWhite = red > 246 && green > 246 && blue > 246;
  const redBackdrop = (hue < 22 || hue > 342) && saturation > 0.34 && red > 135 && green < 150 && blue < 150;
  const grayLine = channelRange < 12 && lightness < 0.38;
  const closeToBackground = distance < 24 && saturation < 0.16;
  const pastelBlock = saturation > 0.08 && lightness > 0.38 && lightness < 0.94 && !redBackdrop;
  const contrastedBlock = distance > 42 && lightness > 0.38 && lightness < 0.96 && !(saturation < 0.04 && distance < 62);
  return !darkText && !nearWhite && !grayLine && !closeToBackground && (pastelBlock || contrastedBlock);
}

function pointInPolygon(point, polygon) {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0];
    const yi = polygon[i][1];
    const xj = polygon[j][0];
    const yj = polygon[j][1];
    const intersect = yi > point.y !== yj > point.y && point.x < ((xj - xi) * (point.y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

function getPolygonBounds(polygon) {
  const xs = polygon.map(([x]) => x);
  const ys = polygon.map(([, y]) => y);
  return {
    minX: Math.min(...xs),
    maxX: Math.max(...xs),
    minY: Math.min(...ys),
    maxY: Math.max(...ys),
  };
}

function getPolygonArea(polygon) {
  let area = 0;
  for (let index = 0; index < polygon.length; index += 1) {
    const [x1, y1] = polygon[index];
    const [x2, y2] = polygon[(index + 1) % polygon.length];
    area += x1 * y2 - x2 * y1;
  }
  return Math.abs(area / 2);
}

function isOversizedPolygon(polygon, seatmapSize = currentEvent.seatmapSize) {
  if (!Array.isArray(polygon) || polygon.length < 3) return true;
  const bounds = getPolygonBounds(polygon);
  const totalArea = seatmapSize.width * seatmapSize.height;
  const area = getPolygonArea(polygon);
  return (
    area > totalArea * 0.18 ||
    (bounds.maxX - bounds.minX) > seatmapSize.width * 0.48 ||
    (bounds.maxY - bounds.minY) > seatmapSize.height * 0.42
  );
}

function removeOversizedZones(event) {
  if (!event?.seatmapSize || !Array.isArray(event.zones)) return 0;
  const before = event.zones.length;
  event.zones = event.zones.filter((zone) => !isOversizedPolygon(zone.polygon, event.seatmapSize));
  return before - event.zones.length;
}

function getPolygonCenter(polygon) {
  const bounds = getPolygonBounds(polygon);
  return {
    x: (bounds.minX + bounds.maxX) / 2,
    y: (bounds.minY + bounds.maxY) / 2,
  };
}

function getDistanceSquared(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return dx * dx + dy * dy;
}

function getZoneAtPoint(point) {
  const candidates = currentEvent.zones
    .filter((zone) => Array.isArray(zone.polygon) && pointInPolygon(point, zone.polygon))
    .map((zone) => ({
      zone,
      area: getPolygonArea(zone.polygon),
      distance: getDistanceSquared(point, getPolygonCenter(zone.polygon)),
    }))
    .sort((a, b) => a.area - b.area || a.distance - b.distance);
  return candidates[0]?.zone || null;
}

function getZoneFromSeatComponent(point) {
  if (!seatmapPixelSampler?.componentAt) return null;
  const component = seatmapPixelSampler.componentAt(point);
  if (!component || component.pixels < 24) return null;

  const componentWidth = component.bounds.maxX - component.bounds.minX + 1;
  const componentHeight = component.bounds.maxY - component.bounds.minY + 1;
  const maxDistance = Math.max(componentWidth, componentHeight) * 0.75 + 16;

  const candidates = currentEvent.zones
    .filter((zone) => Array.isArray(zone.polygon) && zone.polygon.length >= 3)
    .map((zone) => {
      const bounds = getPolygonBounds(zone.polygon);
      const center = getPolygonCenter(zone.polygon);
      const intersection = {
        minX: Math.max(bounds.minX, component.bounds.minX),
        maxX: Math.min(bounds.maxX, component.bounds.maxX),
        minY: Math.max(bounds.minY, component.bounds.minY),
        maxY: Math.min(bounds.maxY, component.bounds.maxY),
      };
      const samplePoints = [
        center,
        ...zone.polygon.map(([x, y]) => ({
          x: center.x + (x - center.x) * 0.55,
          y: center.y + (y - center.y) * 0.55,
        })),
      ];

      if (intersection.maxX >= intersection.minX && intersection.maxY >= intersection.minY) {
        const steps = 6;
        for (let row = 0; row < steps; row += 1) {
          for (let column = 0; column < steps; column += 1) {
            samplePoints.push({
              x: intersection.minX + ((column + 0.5) / steps) * (intersection.maxX - intersection.minX),
              y: intersection.minY + ((row + 0.5) / steps) * (intersection.maxY - intersection.minY),
            });
          }
        }
      }

      let polygonSamples = 0;
      let overlapSamples = 0;
      samplePoints.forEach((sample) => {
        if (!pointInPolygon(sample, zone.polygon)) return;
        polygonSamples += 1;
        if (component.contains(sample)) overlapSamples += 1;
      });

      return {
        zone,
        overlapSamples,
        overlapRatio: polygonSamples ? overlapSamples / polygonSamples : 0,
        componentCenterInside: pointInPolygon(component.center, zone.polygon) ? 1 : 0,
        exactHit: pointInPolygon(point, zone.polygon) ? 1 : 0,
        distanceToClick: Math.sqrt(getDistanceSquared(center, point)),
        distanceToComponent: Math.sqrt(getDistanceSquared(center, component.center)),
        area: getPolygonArea(zone.polygon),
      };
    })
    .filter(
      (candidate) =>
        candidate.exactHit ||
        candidate.componentCenterInside ||
        candidate.overlapRatio >= 0.16 ||
        (candidate.overlapSamples >= 4 && candidate.distanceToComponent <= maxDistance * 0.55),
    )
    .sort(
      (a, b) =>
        b.exactHit - a.exactHit ||
        b.componentCenterInside - a.componentCenterInside ||
        b.overlapRatio - a.overlapRatio ||
        b.overlapSamples - a.overlapSamples ||
        a.area - b.area ||
        a.distanceToComponent - b.distanceToComponent ||
        a.distanceToClick - b.distanceToClick,
    );

  return candidates[0]?.zone || null;
}

function getZoneForPointer(event, seatmap) {
  const point = getSeatmapPoint(event, seatmap);
  if (!point) return null;
  return getZoneAtPoint(point) || getZoneFromSeatComponent(point);
}

function getZoneFromTarget(target) {
  const hotspot = target.closest("[data-zone-id]");
  if (!hotspot) return null;
  return currentEvent.zones.find((zone) => zone.id === hotspot.dataset.zoneId) || null;
}

function getZoneForSeatmapEvent(event, seatmap) {
  const targetZone = getZoneFromTarget(event.target);
  const pointerZone = getZoneForPointer(event, seatmap);
  if (!targetZone || !pointerZone || targetZone.id === pointerZone.id) return targetZone || pointerZone;

  const point = getSeatmapPoint(event, seatmap);
  if (!point) return targetZone;
  const targetHit = pointInPolygon(point, targetZone.polygon);
  const pointerHit = pointInPolygon(point, pointerZone.polygon);
  if (targetHit && pointerHit) {
    return getPolygonArea(targetZone.polygon) <= getPolygonArea(pointerZone.polygon) ? targetZone : pointerZone;
  }
  return targetHit ? targetZone : pointerZone;
}

function getPolygonPoints(polygon) {
  return polygon.map(([x, y]) => `${x},${y}`).join(" ");
}

function updateSeatmapHotspots() {
  const hotspotLayer = document.querySelector("#seatmapHotspots");
  if (!hotspotLayer) return;
  currentEvent.zones.forEach((zone) => {
    const isActive = selectedZone?.id === zone.id;
    const isHover = hoveredZone?.id === zone.id;
    const hotspot = hotspotLayer.querySelector(`[data-zone-id="${zone.id}"]`);
    if (!hotspot) return;
    hotspot.classList.toggle("active", isActive);
    hotspot.classList.toggle("hover", isHover);
  });
}

function selectZone(zone) {
  selectedZone = zone;
  updateSeatmapHotspots();
  renderZoneDrawer();
  zoneDrawer.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function renderSeatmap() {
  const { width, height } = currentEvent.seatmapSize;
  seatmapFrame.innerHTML = `
    <div class="seatmap-stage" style="aspect-ratio: ${width} / ${height};">
      <img
        class="seatmap-image"
        src="${currentEvent.seatmapImage}"
        alt="${currentEvent.name} 官方座位图"
      />
      <svg
        id="seatmapHotspots"
        class="seatmap-hotspots"
        viewBox="0 0 ${width} ${height}"
        aria-label="${currentEvent.name} 可点击座位区域"
      >
        ${currentEvent.zones
          .map(
            (zone) => `
              <polygon
                class="seatmap-hotspot"
                points="${getPolygonPoints(zone.polygon)}"
                data-zone-id="${zone.id}"
                pointer-events="all"
                tabindex="0"
                role="button"
                aria-label="${zone.label}"
              />
            `,
          )
          .join("")}
      </svg>
      ${
        currentEvent.zones.length
          ? ""
          : `<div class="seatmap-empty-hint">这张座位图还没有配置可点击区域，请在后台标注区域后再测试。</div>`
      }
      <div class="seatmap-hover-card hidden" id="seatmapHoverCard"></div>
    </div>
  `;
  rebuildSeatmapPixelSampler();
  updateSeatmapHotspots();
}

function updateSeatmapHoverCard(event, zone) {
  const card = seatmapFrame.querySelector("#seatmapHoverCard");
  if (!card) return;
  card.classList.add("hidden");
  card.innerHTML = "";
}

function groupTicketsByTable(tickets) {
  const grouped = new Map();
  tickets.forEach((ticket) => {
    if (!grouped.has(ticket.table.id)) {
      grouped.set(ticket.table.id, { table: ticket.table, hitRows: new Set() });
    }
    grouped.get(ticket.table.id).hitRows.add(ticket.index);
  });
  return [...grouped.values()];
}

function renderTicketCard(ticket, title, rank) {
  const { table, row, index } = ticket;
  const fields = table.columns
    .map(
      (column, columnIndex) => `
        <div class="ticket-field">
          <span>${column}</span>
          <strong>${row[columnIndex] || ""}</strong>
        </div>
      `,
    )
    .join("");

  const recommendation = sortMode === "recommended" && rank < 3 ? `<span class="recommend-badge">优先推荐</span>` : "";
  const reason = sortMode === "recommended" ? `<span class="ticket-reason">按售价和座位/号数综合排序</span>` : "";

  return `
    <button class="ticket-card" type="button" data-ticket-key="${makeTicketKey(table, index)}">
      <span class="ticket-card-head">
        <span class="ticket-card-title">${title}</span>
        ${recommendation}
      </span>
      <span class="ticket-fields">${fields}</span>
      ${reason}
      <span class="ticket-open">表格来源</span>
    </button>
  `;
}

function renderRecognizedTableCard(group) {
  const { table, hitRows } = group;
  const headers = table.columns.map((column) => `<th>${column}</th>`).join("");
  const rows = table.rows
    .map(
      (row, rowIndex) => `
        <tr class="${hitRows.has(rowIndex) ? "hit-row" : ""}">
          ${table.columns.map((_, columnIndex) => `<td>${row[columnIndex] || ""}</td>`).join("")}
        </tr>
      `,
    )
    .join("");
  return `
    <article class="table-card">
      <div class="table-card-header">
        <div>
          <p class="table-card-title">${table.title}</p>
          <span class="ticket-reason">整张识别表 · 命中 ${hitRows.size} 行</span>
        </div>
        <button class="small-button ghost" type="button" data-table-id="${table.id}">表格来源</button>
      </div>
      <div class="table-scroll">
        <table>
          <thead><tr>${headers}</tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </article>
  `;
}

function renderZoneDrawer() {
  if (!selectedZone) {
    zoneDrawer.className = "zone-drawer";
    zoneDrawer.innerHTML = "";
    return;
  }

  const tickets = getZoneTickets(selectedZone);
  const rawZoneTickets = currentEvent.tables.flatMap((table) =>
    table.rows
      .map((row, index) => ({ table, row, index }))
      .filter((ticket) => zoneMatchesTicket(ticket, selectedZone)),
  );
  const ticketCards = tickets.length
    ? tickets.map((ticket, rank) => renderTicketCard(ticket, `${selectedZone.label} 可售票`, rank)).join("")
    : !currentEvent.tables.length
      ? `<div class="empty-state">座位图热区可点击测试成功。当前还没有上传/发布票源 PDF，所以 ${selectedZone.label} 区暂时是 0 张票。</div>`
    : rawZoneTickets.length
      ? selectedDateId
        ? `<div class="empty-state">这个日期下，这个区域当前没有可展示票源。若刚上传过，请确认表格已发布，且“日期/区域”列和前台一致。</div>`
        : `<div class="empty-state">这个区域已匹配到 ${rawZoneTickets.length} 条票源。选择日期后可按日期过滤。</div>`
    : selectedDateId
      ? `<div class="empty-state">这个日期下，这个区域当前没有可展示票源。若刚上传过，请确认表格已发布，且“日期/区域”列和前台一致。</div>`
      : `<div class="empty-state">已选中 ${selectedZone.label} 区。当前票源表还没有匹配到这个区号，所以暂时 0 张票。</div>`;

  zoneDrawer.className = "zone-drawer open";
  zoneDrawer.innerHTML = `
    <div class="zone-drawer-header">
      <div>
        <p class="zone-drawer-title">${getSelectedDate()?.label || "全部日期"} · ${selectedZone.label} · ${tickets.length} 张票</p>
        <span class="ticket-reason">${currentEvent.tables.length ? `座位图 ${selectedZone.label} 区已绑定表格票源 ${rawZoneTickets.length} 条` : "当前为座位图点击测试模式，票源 PDF 可稍后上传"}</span>
      </div>
      <button class="small-button ghost" type="button" data-close-zone>收起</button>
    </div>
    <div class="zone-ticket-grid">${ticketCards}</div>
  `;
}

function openOriginalTable(table) {
  modalTitle.textContent = `${table.title} · 表格来源`;
  const source = table.originalImage || "";
  const isPdf = table.originalType === "application/pdf" || source.toLowerCase().includes("application/pdf");
  modalImage.classList.toggle("hidden", isPdf);
  modalPdf.classList.toggle("hidden", !isPdf);
  if (isPdf) {
    modalPdf.src = source;
    modalImage.removeAttribute("src");
  } else {
    modalImage.src = source;
    modalImage.alt = `${table.title} 表格来源`;
    modalPdf.removeAttribute("src");
  }
  imageModal.classList.remove("hidden");
  document.body.classList.add("modal-open");
}

function closeOriginalImage() {
  imageModal.classList.add("hidden");
  document.body.classList.remove("modal-open");
  modalImage.removeAttribute("src");
  modalPdf.removeAttribute("src");
}

function renderEventList() {
  eventList.innerHTML = events
    .map(
      (event) => `
        <button class="event-card ${event.id === currentEvent.id ? "active" : ""}" type="button" data-event-id="${event.id}">
          <span class="event-name">${event.name}</span>
          <span class="event-info">
            <span>${event.location}</span>
            <span>${event.dates}</span>
          </span>
        </button>
      `,
    )
    .join("");
}

function renderAdminEventList() {
  adminEventList.innerHTML = events
    .map(
      (event) => `
        <button class="admin-nav-item ${event.id === currentEvent.id ? "active" : ""}" type="button" data-admin-event-id="${event.id}">
          <strong>${event.name}</strong>
          <span>${getSeatmapFileName(event)} · ${event.tables.length} 张票源表</span>
        </button>
      `,
    )
    .join("");
}

function renderDateFilter() {
  dateFilter.innerHTML = currentEvent.dateOptions
    .map(
      (date) => `
        <button class="segment-button ${date.id === selectedDateId ? "active" : ""}" type="button" data-date-id="${date.id}">
          ${date.label}
        </button>
      `,
    )
    .join("");
}

function renderHeader() {
  eventTitle.textContent = currentEvent.name;
  eventLocation.textContent = currentEvent.location;
  eventDatePill.textContent = currentEvent.dates;
  seatmapTitle.textContent = currentEvent.seatmapTitle;
}

function renderResults() {
  if (!selectedDateId) {
    resultCount.textContent = "请先选择日期";
    results.innerHTML = "";
    return;
  }

  const tickets = getSearchTickets(searchTerm);

  if (!searchTerm) {
    resultCount.textContent = `${getSelectedDate().label} · 输入关键词后展示匹配票源`;
    results.innerHTML = "";
    return;
  }

  resultCount.textContent = `${getSelectedDate().label} · 找到 ${tickets.length} 张匹配票`;

  if (!tickets.length) {
    results.innerHTML = `<div class="empty-state">当前演出下没有找到匹配票源。</div>`;
    return;
  }

  results.innerHTML = `
    <div class="zone-drawer open search-results-card">
      <div class="zone-drawer-header">
        <p class="zone-drawer-title">搜索结果 · ${tickets.length} 张票</p>
      </div>
      <div class="zone-ticket-grid">
        ${tickets.map((ticket, rank) => renderTicketCard(ticket, "匹配票源", rank)).join("")}
      </div>
    </div>
  `;
}

function getSeatmapFileName(event) {
  return event.seatmapFileName || event.seatmapImage.split("/").pop();
}

function renderAdminEvent() {
  renderAdminEventList();
  adminEventTitle.textContent = currentEvent.name;
  adminPackageName.textContent = currentEvent.name;
  adminSeatmapName.textContent = getSeatmapFileName(currentEvent);
  adminTableCount.textContent = `${currentEvent.tables.length} 张`;
  adminZoneCount.textContent = `${currentEvent.zones.length} 个`;
  uploadTargetEvent.textContent = currentEvent.name;
  selectedSeatmapName.textContent = `当前使用：${getSeatmapFileName(currentEvent)}`;
  adminSeatmapPreview.src = currentEvent.seatmapImage;
  adminSeatmapPreview.alt = `${currentEvent.name} 座位图预览`;
  renderSeatmapMarkers();
  renderAdminChecklist();
  renderSeatmapTemplates();
}

function renderAdminChecklist() {
  const pendingCount = pendingTables.filter((table) => table.eventId === currentEvent.id).length;
  const items = [
    { done: Boolean(currentEvent.seatmapImage), label: "座位图已配置" },
    { done: currentEvent.zones.length > 0, label: `可点击热区 ${currentEvent.zones.length} 个` },
    { done: currentEvent.tables.length > 0, label: `已发布票源表 ${currentEvent.tables.length} 张` },
    { done: pendingCount === 0, label: pendingCount ? `还有 ${pendingCount} 张待确认` : "没有待确认积压" },
  ];

  adminChecklist.innerHTML = `
    <div class="checklist-heading">
      <strong>上线前检查</strong>
      <span>当前演出资料是否足够给客户查看</span>
    </div>
    <div class="checklist-grid">
      ${items
        .map(
          (item) => `
            <div class="checklist-item ${item.done ? "done" : "todo"}">
              <span>${item.done ? "✓" : "!"}</span>
              <strong>${item.label}</strong>
            </div>
          `,
        )
        .join("")}
    </div>
  `;
}

function setUploadStatus(message, type = "idle") {
  uploadStatus.textContent = message;
  uploadStatus.dataset.status = type;
}

function showToast(message, type = "idle") {
  toast.textContent = message;
  toast.dataset.status = type;
  toast.classList.remove("hidden");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => {
    toast.classList.add("hidden");
  }, 3200);
}

function renderAiProviderTemplate(provider = "aliyun") {
  const template = aiProviderTemplates[provider] || aiProviderTemplates.aliyun;
  document.querySelectorAll("[data-ai-provider]").forEach((button) => {
    button.classList.toggle("active", button.dataset.aiProvider === provider);
  });
  aiProviderInput.value = template.provider;
  aiKeyNameInput.value = template.keyName;
  aiModelInput.value = template.model;
  envTemplate.innerHTML = template.env.map((line) => `<code>${line}</code>`).join("");
  aiConfigStatus.textContent = template.status;
}

function getCurrentEnvTemplateText() {
  return [...envTemplate.querySelectorAll("code")].map((item) => item.textContent).join("\n");
}

function describeRecognitionStatus() {
  if (!aiStatus) return "智能识别状态：正在检查服务...";
  if (!aiStatus.hasKey) return `智能识别状态：当前使用 ${aiStatus.providerName || "AI服务"}，未检测到 ${aiStatus.keyName || "API Key"}，请在 .env 里配置后重启服务。`;
  const proxyText = aiStatus.proxy ? "，已使用本地代理" : "";
  return `智能识别状态：当前使用 ${aiStatus.providerName || "AI服务"}，已检测到 ${aiStatus.keyName || "API Key"}，模型 ${aiStatus.model || "默认模型"}${proxyText}。`;
}

async function refreshAiStatus() {
  try {
    const response = await fetch("/api/status", { cache: "no-store" });
    aiStatus = await response.json();
  } catch {
    aiStatus = { hasKey: false, keyName: "DASHSCOPE_API_KEY", model: "", proxy: "", providerName: "阿里云百炼" };
  }
  zoneMarkingStatus.textContent = describeRecognitionStatus();
}

function renderUploadRecords() {
  const currentPending = pendingTables.filter((table) => table.eventId === currentEvent.id);
  if (!currentPending.length) {
    uploadRecords.innerHTML = `
      <strong>当前演出待确认/本次上传记录</strong>
      <div class="empty-upload-record">还没有发布记录。</div>
    `;
    return;
  }

  uploadRecords.innerHTML = `
    <strong>当前演出待确认/本次上传记录</strong>
    ${currentPending
      .map(
        (table) => `
          <div class="upload-record ${table.id === selectedPendingTableId ? "active" : ""}">
            <span>
              <b>${table.title}</b>
              <small>${table.sourceName} · ${table.rows.length} 条票源 · 待确认</small>
            </span>
            <button class="small-button ghost" type="button" data-review-table="${table.id}">校对</button>
          </div>
        `,
      )
      .join("")}
  `;
}

function getSelectedPendingTable() {
  return pendingTables.find((table) => table.id === selectedPendingTableId) || null;
}

function renderReviewPanel() {
  const table = getSelectedPendingTable();
  if (!table || table.eventId !== currentEvent.id) {
    reviewTitle.textContent = "选择一张待确认表";
    confirmReviewButton.disabled = true;
    reviewLayout.innerHTML = `<div class="empty-state">上传票源文件后，先在上方待确认列表中选择一张表进行校对。</div>`;
    return;
  }

  reviewTitle.textContent = table.title;
  confirmReviewButton.disabled = false;
  const headers = table.columns.map((column) => `<span>${column}</span>`).join("");
  const rows = table.rows
    .map((row) => `<div class="recognized-row">${table.columns.map((_, index) => `<span>${row[index] || ""}</span>`).join("")}</div>`)
    .join("");
  reviewLayout.innerHTML = `
    <button class="source-preview source-preview-button" type="button" data-review-source="${table.id}">
      <span>原始图片/PDF 页面</span>
      <strong>${table.sourceName}</strong>
    </button>
    <div class="recognized-table">
      <div class="recognized-head">${headers}</div>
      ${rows}
    </div>
  `;
}

function renderPublishedTables() {
  const rows = currentEvent.tables
    .map(
      (table) => `
        <div class="admin-table-row">
          <span>${table.title}</span>
          <span>${currentEvent.name}</span>
          <span>${table.sourceName || "样例数据"}</span>
          <span>已发布</span>
          <span>${table.rows.length} 条票源</span>
        </div>
      `,
    )
    .join("");

  publishedTables.innerHTML = `
    <div class="admin-table-head">
      <span>表名</span>
      <span>演出</span>
      <span>来源</span>
      <span>状态</span>
      <span>票源数</span>
    </div>
    ${rows || `<div class="empty-state">当前演出还没有已发布票源。</div>`}
  `;
}

function createUploadedTables(parsedTables) {
  const count = parsedTables.length;
  return Array.from({ length: count }, (_, index) => ({
    id: `uploaded-${Date.now()}-${index}`,
    title: count > 1 ? `${uploadTableTitle.value.trim() || uploadedSource.name} · 第 ${index + 1} 页/表` : uploadTableTitle.value.trim() || uploadedSource.name,
    originalImage: uploadedSource.url,
    originalType: uploadedSource.type,
    sourceName: count > 1 ? `${uploadedSource.name} · 第 ${index + 1} 页/表` : uploadedSource.name,
    sourcePage: index + 1,
    eventId: currentEvent.id,
    columns: parsedTables[index].columns,
    rows: parsedTables[index].rows,
  }));
}

function publishUpload() {
  setUploadStatus("正在检查上传内容...", "loading");
  showToast("正在处理上传...", "loading");
  const parsedTables = splitRecognizedTables(uploadTableText.value);
  if (!uploadedSource) {
    setUploadStatus("请先选择一张图片或 PDF。", "error");
    showToast("上传失败：请先选择文件。", "error");
    return;
  }
  if (!parsedTables.length) {
    setUploadStatus("表格内容至少需要表头和一行票源。", "error");
    showToast("上传失败：表格内容不完整。", "error");
    return;
  }

  const tables = createUploadedTables(parsedTables);
  pendingTables.unshift(...tables);
  selectedPendingTableId = tables[0]?.id || selectedPendingTableId;
  selectedDateId = null;
  selectedZone = null;
  searchTerm = "";
  searchInput.value = "";
  setUploadStatus(`已生成 ${tables.length} 张待确认表。校对确认后才会发布给客户。`, "success");
  showToast(`已生成 ${tables.length} 张待确认表。`, "success");
  renderUploadRecords();
  renderReviewPanel();
  renderPublishedTables();
  renderAdminEvent();
  uploadRecords.scrollIntoView({ behavior: "smooth", block: "start" });
}

function previewUploadedTable(tableId) {
  const table = currentEvent.tables.find((item) => item.id === tableId);
  if (!table) return;
  selectedDateId = null;
  selectedZone = null;
  searchTerm = "";
  searchInput.value = "";
  render();
  setMode("customer");
  searchInput.scrollIntoView({ behavior: "smooth", block: "center" });
}

function confirmSelectedPendingTable() {
  const table = getSelectedPendingTable();
  if (!table) {
    showToast("请先选择一张待确认表。", "error");
    return;
  }
  const index = pendingTables.findIndex((item) => item.id === table.id);
  if (index >= 0) pendingTables.splice(index, 1);
  currentEvent.tables.unshift(table);
  uploadedTables.unshift(table);
  selectFirstDateWithTickets();
  selectedPendingTableId = pendingTables.find((item) => item.eventId === currentEvent.id)?.id || null;
  const matchedRows = countZoneRowsFromTables();
  const matchMessage = getPublishMatchMessage(table.title, matchedRows);
  setUploadStatus(matchMessage.text, matchMessage.type);
  showToast(matchMessage.toast, matchMessage.type);
  saveAppState();
  renderUploadRecords();
  renderReviewPanel();
  renderPublishedTables();
  renderAdminEvent();
  render();
}

function confirmAllPendingTables() {
  const currentPending = pendingTables.filter((table) => table.eventId === currentEvent.id);
  if (!currentPending.length) {
    showToast("当前演出没有待确认表。", "error");
    return;
  }
  currentPending.forEach((table) => {
    const index = pendingTables.findIndex((item) => item.id === table.id);
    if (index >= 0) pendingTables.splice(index, 1);
  });
  currentEvent.tables.unshift(...currentPending);
  uploadedTables.unshift(...currentPending);
  selectFirstDateWithTickets();
  selectedPendingTableId = null;
  const matchedRows = countZoneRowsFromTables();
  const matchMessage = getPublishMatchMessage(`已一键发布 ${currentPending.length} 张表`, matchedRows);
  setUploadStatus(matchMessage.text, matchMessage.type);
  showToast(matchMessage.toast, matchMessage.type);
  saveAppState();
  renderUploadRecords();
  renderReviewPanel();
  renderPublishedTables();
  renderAdminEvent();
  render();
}

function clearCurrentPendingTables() {
  const before = pendingTables.length;
  for (let index = pendingTables.length - 1; index >= 0; index -= 1) {
    if (pendingTables[index].eventId === currentEvent.id) pendingTables.splice(index, 1);
  }
  selectedPendingTableId = null;
  const removed = before - pendingTables.length;
  showToast(removed ? `已清空 ${removed} 张待确认表。` : "当前没有待确认表。", removed ? "success" : "error");
  renderUploadRecords();
  renderReviewPanel();
}

function createQuickZones(labels) {
  const { width, height } = currentEvent.seatmapSize;
  const count = labels.length;
  const columns = Math.ceil(Math.sqrt(count));
  const rows = Math.ceil(count / columns);
  const cellWidth = width / columns;
  const cellHeight = (height * 0.62) / rows;
  const top = height * 0.16;
  return labels.map((label, index) => {
    const column = index % columns;
    const row = Math.floor(index / columns);
    const x1 = column * cellWidth + cellWidth * 0.14;
    const y1 = top + row * cellHeight + cellHeight * 0.14;
    const x2 = (column + 1) * cellWidth - cellWidth * 0.14;
    const y2 = top + (row + 1) * cellHeight - cellHeight * 0.14;
    return {
      id: slugify(label),
      label,
      aliases: [label],
      polygon: [
        [Math.round(x1), Math.round(y1)],
        [Math.round(x2), Math.round(y1)],
        [Math.round(x2), Math.round(y2)],
        [Math.round(x1), Math.round(y2)],
      ],
    };
  });
}

function extractZoneLabelsFromTables() {
  const labels = new Set();
  currentEvent.tables.forEach((table) => {
    const zoneIndex = table.columns.findIndex((column) => ["区域", "区", "block", "section", "구역"].some((name) => normalize(column).includes(normalize(name))));
    if (zoneIndex < 0) return;
    table.rows.forEach((row) => {
      const value = String(row[zoneIndex] || "").trim();
      if (!value) return;
      value
        .split(/[\/,，、\s]+/)
        .map((item) => item.replace(/[（）()视阻rvRV-]/g, "").trim())
        .filter((item) => item && item.length <= 12)
        .forEach((item) => labels.add(item));
    });
  });
  return [...labels];
}

function renderSeatmapMarkers() {
  const zones = currentEvent.zones.map((zone) => ({ ...zone, status: "saved" }));
  const scanned = scannedRegions.map((region) => ({ ...region, label: region.label || `缺失区${region.missingIndex || ""}`, polygon: region.polygon, status: region.label ? "recognized" : "missing" }));
  const allZones = [...zones, ...scanned];
  const { width, height } = currentEvent.seatmapSize;
  const polygons = allZones
    .map(
      (zone) => `
        <polygon
          class="seatmap-region-polygon ${zone.status}"
          points="${getPolygonPoints(zone.polygon)}"
        />
      `,
    )
    .join("");
  const labels = allZones
    .map((zone) => {
      const center = getPolygonCenter(zone.polygon);
      const x = (center.x / width) * 100;
      const y = (center.y / height) * 100;
      const label = zone.status === "missing" ? `缺${zone.missingIndex || "?"}` : zone.label;
      return `
        <span class="seatmap-marker ${zone.status}" style="left:${x}%;top:${y}%;">${label}</span>
      `;
    })
    .join("");
  seatmapMarkerLayer.innerHTML = `
    <svg class="seatmap-region-svg" viewBox="0 0 ${width} ${height}" aria-hidden="true">
      ${polygons}
    </svg>
    ${labels}
  `;
  updateSeatmapPreviewLayerSize();
}

function updateSeatmapPreviewLayerSize() {
  const stage = document.querySelector("#seatmapMarkerStage");
  if (!stage || !seatmapMarkerLayer || !adminSeatmapPreview) return;
  if (!adminSeatmapPreview.complete || !adminSeatmapPreview.naturalWidth || !adminSeatmapPreview.naturalHeight) return;
  const stageRect = stage.getBoundingClientRect();
  const imageRect = adminSeatmapPreview.getBoundingClientRect();
  seatmapMarkerLayer.style.left = `${imageRect.left - stageRect.left}px`;
  seatmapMarkerLayer.style.top = `${imageRect.top - stageRect.top}px`;
  seatmapMarkerLayer.style.width = `${imageRect.width}px`;
  seatmapMarkerLayer.style.height = `${imageRect.height}px`;
}

function isYellowPixel(red, green, blue) {
  return isLikelySeatPixel(red, green, blue) || (red > 145 && green > 110 && blue < 125 && red >= green * 0.78 && green >= blue * 1.25);
}

function getMaskIndex(x, y, width) {
  return y * width + x;
}

function getBoundaryPoints(pixels, minX, maxX, minY, maxY, width, scaleX = 1, scaleY = 1, offsetX = 0, offsetY = 0) {
  const pixelSet = new Set(pixels);
  const boundary = [];
  pixels.forEach((index) => {
    const x = index % width;
    const y = Math.floor(index / width);
    const neighbors = [
      [x - 1, y],
      [x + 1, y],
      [x, y - 1],
      [x, y + 1],
    ];
    if (neighbors.some(([nx, ny]) => nx < minX || nx > maxX || ny < minY || ny > maxY || !pixelSet.has(getMaskIndex(nx, ny, width)))) {
      boundary.push({ x, y });
    }
  });
  if (boundary.length < 6) {
    return [
      [Math.round(offsetX + minX * scaleX), Math.round(offsetY + minY * scaleY)],
      [Math.round(offsetX + maxX * scaleX), Math.round(offsetY + minY * scaleY)],
      [Math.round(offsetX + maxX * scaleX), Math.round(offsetY + maxY * scaleY)],
      [Math.round(offsetX + minX * scaleX), Math.round(offsetY + maxY * scaleY)],
    ];
  }
  const center = boundary.reduce((sum, point) => ({ x: sum.x + point.x / boundary.length, y: sum.y + point.y / boundary.length }), { x: 0, y: 0 });
  const buckets = 18;
  const selected = [];
  for (let bucket = 0; bucket < buckets; bucket += 1) {
    const start = (-Math.PI + (bucket * Math.PI * 2) / buckets);
    const end = -Math.PI + ((bucket + 1) * Math.PI * 2) / buckets;
    const candidates = boundary.filter((point) => {
      const angle = Math.atan2(point.y - center.y, point.x - center.x);
      return bucket === buckets - 1 ? angle >= start && angle <= Math.PI : angle >= start && angle < end;
    });
    if (!candidates.length) continue;
    candidates.sort((a, b) => getDistanceSquared(b, center) - getDistanceSquared(a, center));
    selected.push(candidates[0]);
  }
  const polygon = selected
    .sort((a, b) => Math.atan2(a.y - center.y, a.x - center.x) - Math.atan2(b.y - center.y, b.x - center.x))
    .map((point) => [Math.round(offsetX + point.x * scaleX), Math.round(offsetY + point.y * scaleY)]);
  return polygon.length >= 3 ? polygon : regionToPolygon({ x: offsetX + minX * scaleX, y: offsetY + minY * scaleY, width: (maxX - minX) * scaleX, height: (maxY - minY) * scaleY });
}

function getPixelBounds(pixels, width) {
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  pixels.forEach((index) => {
    const x = index % width;
    const y = Math.floor(index / width);
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
  });
  return { minX, maxX, minY, maxY };
}

function createSeparatedMask(mask, width, height) {
  const separated = new Uint8Array(mask.length);
  for (let y = 1; y < height - 1; y += 1) {
    for (let x = 1; x < width - 1; x += 1) {
      const index = getMaskIndex(x, y, width);
      if (!mask[index]) continue;
      const left = mask[getMaskIndex(x - 1, y, width)];
      const right = mask[getMaskIndex(x + 1, y, width)];
      const up = mask[getMaskIndex(x, y - 1, width)];
      const down = mask[getMaskIndex(x, y + 1, width)];
      const neighborCount = Number(left) + Number(right) + Number(up) + Number(down);
      if (neighborCount >= 3 || (left && right) || (up && down)) separated[index] = 1;
    }
  }
  return separated;
}

function extractRegionsFromMask(mask, width, height, naturalWidth, naturalHeight) {
  const separatedMask = createSeparatedMask(mask, width, height);
  const visited = new Uint8Array(width * height);
  const regions = [];
  const minPixels = Math.max(48, Math.round(width * height * 0.00012));
  const maxPixels = Math.round(width * height * 0.12);
  for (let start = 0; start < separatedMask.length; start += 1) {
    if (!separatedMask[start] || visited[start]) continue;
    const queue = [start];
    visited[start] = 1;
    let minX = width;
    let maxX = 0;
    let minY = height;
    let maxY = 0;
    let pixels = 0;
    const componentPixels = [];
    for (let cursor = 0; cursor < queue.length; cursor += 1) {
      const current = queue[cursor];
      const x = current % width;
      const y = Math.floor(current / width);
      pixels += 1;
      componentPixels.push(current);
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
      const neighbors = [current - 1, current + 1, current - width, current + width];
      neighbors.forEach((next) => {
        if (next < 0 || next >= separatedMask.length || visited[next] || !separatedMask[next]) return;
        const nextX = next % width;
        if (Math.abs(nextX - x) > 1) return;
        visited[next] = 1;
        queue.push(next);
      });
    }
    const boxWidth = maxX - minX + 1;
    const boxHeight = maxY - minY + 1;
    const boxArea = boxWidth * boxHeight;
    const fillRatio = pixels / Math.max(1, boxArea);
    const aspectRatio = Math.max(boxWidth / Math.max(1, boxHeight), boxHeight / Math.max(1, boxWidth));
    if (
      pixels < minPixels ||
      pixels > maxPixels ||
      boxWidth < 10 ||
      boxHeight < 10 ||
      fillRatio < 0.16 ||
      aspectRatio > 9 ||
      boxWidth > width * 0.55 ||
      boxHeight > height * 0.48
    ) {
      continue;
    }
    const sx = naturalWidth / width;
    const sy = naturalHeight / height;
    const polygon = getBoundaryPoints(componentPixels, minX, maxX, minY, maxY, width, sx, sy);
    regions.push({
      x: Math.round(minX * sx),
      y: Math.round(minY * sy),
      width: Math.round(boxWidth * sx),
      height: Math.round(boxHeight * sy),
      polygon,
      pixels,
    });
  }
  return regions.filter((region) => !isOversizedPolygon(region.polygon)).sort((a, b) => a.y - b.y || a.x - b.x);
}

function scanLocalSeatRegionsFromImage() {
  const image = adminSeatmapPreview;
  if (!image.complete || !image.naturalWidth || !image.naturalHeight) throw new Error("座位图还没有加载完成。");
  const naturalWidth = image.naturalWidth || currentEvent.seatmapSize.width;
  const naturalHeight = image.naturalHeight || currentEvent.seatmapSize.height;
  const scale = Math.min(1, 900 / naturalWidth);
  const width = Math.max(1, Math.round(naturalWidth * scale));
  const height = Math.max(1, Math.round(naturalHeight * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  context.drawImage(image, 0, 0, width, height);
  const { data } = context.getImageData(0, 0, width, height);
  const yellowMask = new Uint8Array(width * height);
  const adaptiveMask = new Uint8Array(width * height);
  const background = getEdgeBackgroundColor(data, width, height);
  for (let index = 0; index < width * height; index += 1) {
    const offset = index * 4;
    const red = data[offset];
    const green = data[offset + 1];
    const blue = data[offset + 2];
    if (isYellowPixel(red, green, blue)) yellowMask[index] = 1;
    if (isAdaptiveSeatPixel(red, green, blue, background)) adaptiveMask[index] = 1;
  }
  const yellowRegions = extractRegionsFromMask(yellowMask, width, height, naturalWidth, naturalHeight);
  const adaptiveRegions = extractRegionsFromMask(adaptiveMask, width, height, naturalWidth, naturalHeight);
  return (adaptiveRegions.length > yellowRegions.length ? adaptiveRegions : yellowRegions).slice(0, 140);
}

function scanYellowRegionsFromImage() {
  return scanLocalSeatRegionsFromImage();
}

function regionToPolygon(region) {
  return [
    [region.x, region.y],
    [region.x + region.width, region.y],
    [region.x + region.width, region.y + region.height],
    [region.x, region.y + region.height],
  ];
}

function getRegionBounds(region) {
  const polygon = region.polygon || regionToPolygon(region);
  const xs = polygon.map(([x]) => x);
  const ys = polygon.map(([, y]) => y);
  return {
    x: Math.min(...xs),
    y: Math.min(...ys),
    width: Math.max(...xs) - Math.min(...xs),
    height: Math.max(...ys) - Math.min(...ys),
  };
}

function getRegionCenter(region) {
  return getPolygonCenter(region.polygon || regionToPolygon(region));
}

function getRecognitionAnchor(region) {
  const rawPoint = region.labelPoint || region.label_point || region.textPoint || region.text_point || region.center || region.point;
  if (Array.isArray(rawPoint) && Number.isFinite(Number(rawPoint[0])) && Number.isFinite(Number(rawPoint[1]))) {
    return { x: Number(rawPoint[0]), y: Number(rawPoint[1]) };
  }
  return getRegionCenter(region);
}

function getPointToBoundsDistance(point, bounds) {
  const minX = bounds.x;
  const maxX = bounds.x + bounds.width;
  const minY = bounds.y;
  const maxY = bounds.y + bounds.height;
  const dx = point.x < minX ? minX - point.x : point.x > maxX ? point.x - maxX : 0;
  const dy = point.y < minY ? minY - point.y : point.y > maxY ? point.y - maxY : 0;
  return Math.sqrt(dx * dx + dy * dy);
}

function getBoundsOverlapArea(a, b) {
  const left = Math.max(a.x, b.x);
  const right = Math.min(a.x + a.width, b.x + b.width);
  const top = Math.max(a.y, b.y);
  const bottom = Math.min(a.y + a.height, b.y + b.height);
  return Math.max(0, right - left) * Math.max(0, bottom - top);
}

function getNumberMedian(values) {
  const sorted = values.filter((value) => Number.isFinite(value) && value > 0).sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)] || 0;
}

function getRegionQualityStats(regions) {
  const bounds = regions.map(getRegionBounds);
  const centers = regions.map((region) => getRegionCenter(region));
  return {
    medianArea: getNumberMedian(bounds.map((item) => item.width * item.height)),
    medianWidth: getNumberMedian(bounds.map((item) => item.width)),
    medianHeight: getNumberMedian(bounds.map((item) => item.height)),
    minX: Math.min(...centers.map((point) => point.x)),
    maxX: Math.max(...centers.map((point) => point.x)),
    minY: Math.min(...centers.map((point) => point.y)),
    maxY: Math.max(...centers.map((point) => point.y)),
  };
}

function isDuplicateColorRegion(region, assignedRegions) {
  const bounds = getRegionBounds(region);
  const area = Math.max(1, bounds.width * bounds.height);
  return assignedRegions.some((assigned) => {
    const assignedBounds = getRegionBounds(assigned);
    const assignedArea = Math.max(1, assignedBounds.width * assignedBounds.height);
    const overlap = getBoundsOverlapArea(bounds, assignedBounds);
    return overlap / Math.min(area, assignedArea) > 0.28;
  });
}

function isPlausibleMissingColorRegion(region, assignedRegions, stats) {
  const bounds = getRegionBounds(region);
  const area = bounds.width * bounds.height;
  const seatmapSize = currentEvent.seatmapSize;
  const totalArea = seatmapSize.width * seatmapSize.height;
  const aspectRatio = Math.max(bounds.width / Math.max(1, bounds.height), bounds.height / Math.max(1, bounds.width));
  if (
    bounds.width < 14 ||
    bounds.height < 12 ||
    area < totalArea * 0.00008 ||
    area > totalArea * 0.045 ||
    aspectRatio > 4.8 ||
    isOversizedPolygon(region.polygon) ||
    isDuplicateColorRegion(region, assignedRegions)
  ) {
    return false;
  }
  if (!assignedRegions.length || !stats.medianArea) return true;

  const center = getRegionCenter(region);
  const areaRatio = area / stats.medianArea;
  const widthRatio = bounds.width / Math.max(1, stats.medianWidth);
  const heightRatio = bounds.height / Math.max(1, stats.medianHeight);
  if (areaRatio < 0.22 || areaRatio > 3.4 || widthRatio > 2.8 || heightRatio > 2.8) return false;

  const bandPadX = Math.max(seatmapSize.width * 0.08, stats.medianWidth * 2.8);
  const bandPadY = Math.max(seatmapSize.height * 0.08, stats.medianHeight * 2.8);
  if (center.x < stats.minX - bandPadX || center.x > stats.maxX + bandPadX || center.y < stats.minY - bandPadY || center.y > stats.maxY + bandPadY) return false;

  const nearestDistance = Math.sqrt(Math.min(...assignedRegions.map((assigned) => getDistanceSquared(center, getRegionCenter(assigned)))));
  return nearestDistance <= Math.max(seatmapSize.width, seatmapSize.height) * 0.22;
}

function normalizeRegionLabel(label) {
  return normalize(label).replace(/^区|区$/g, "");
}

function alignRecognizedRegionsToColorRegions(regions) {
  let colorRegions = [];
  try {
    colorRegions = scanLocalSeatRegionsFromImage();
  } catch {
    colorRegions = [];
  }
  if (!colorRegions.length) return null;

  const labeledRegions = regions
    .map((region, index) => ({
      ...region,
      sourceIndex: index,
      label: String(region.label || "").trim(),
      anchor: getRecognitionAnchor(region),
      bounds: getRegionBounds(region),
    }))
    .filter((region) => region.label);

  const usedColorRegions = new Set();
  const usedLabels = new Set();
  const assignments = [];
  const maxImageDistance = Math.max(currentEvent.seatmapSize.width, currentEvent.seatmapSize.height) * 0.16;
  const candidates = [];

  labeledRegions.forEach((recognized) => {
    const labelKey = normalizeRegionLabel(recognized.label);
    if (!labelKey || usedLabels.has(labelKey)) return;
    colorRegions.forEach((colorRegion, colorIndex) => {
      const colorBounds = getRegionBounds(colorRegion);
      const colorCenter = getRegionCenter(colorRegion);
      const insideColor = pointInPolygon(recognized.anchor, colorRegion.polygon);
      const boundsDistance = getPointToBoundsDistance(recognized.anchor, colorBounds);
      const centerDistance = Math.sqrt(getDistanceSquared(recognized.anchor, colorCenter));
      const overlapArea = getBoundsOverlapArea(recognized.bounds, colorBounds);
      const colorArea = Math.max(1, colorBounds.width * colorBounds.height);
      const overlapRatio = overlapArea / colorArea;
      const localLimit = Math.max(48, Math.max(colorBounds.width, colorBounds.height) * 1.45);
      if (!insideColor && !overlapArea && boundsDistance > Math.min(maxImageDistance, localLimit)) return;
      candidates.push({
        recognized,
        colorIndex,
        score: boundsDistance * 3 + centerDistance * 0.55 - overlapRatio * 240 - (insideColor ? 10000 : 0),
      });
    });
  });

  candidates.sort((a, b) => a.score - b.score);
  candidates.forEach((candidate) => {
    const labelKey = normalizeRegionLabel(candidate.recognized.label);
    if (usedLabels.has(labelKey) || usedColorRegions.has(candidate.colorIndex)) return;
    usedLabels.add(labelKey);
    usedColorRegions.add(candidate.colorIndex);
    assignments.push({
      ...colorRegions[candidate.colorIndex],
      label: candidate.recognized.label,
      labelPoint: candidate.recognized.labelPoint || [candidate.recognized.anchor.x, candidate.recognized.anchor.y],
      sourceIndex: candidate.recognized.sourceIndex,
      matchedBy: "color-region",
    });
  });

  if (!assignments.length && labeledRegions.length) return null;

  const stats = assignments.length ? getRegionQualityStats(assignments) : null;
  const missingColorRegions = colorRegions
    .map((region, index) => ({ region, index }))
    .filter((item) => !usedColorRegions.has(item.index))
    .filter((item) => isPlausibleMissingColorRegion(item.region, assignments, stats))
    .map((item) => ({
      ...item.region,
      label: "",
      matchedBy: "color-region",
    }));

  return [...assignments, ...missingColorRegions].sort((a, b) => a.y - b.y || a.x - b.x);
}

function tightenRegionWithSeatColor(region) {
  const image = adminSeatmapPreview;
  if (!image.complete || !image.naturalWidth || !image.naturalHeight) return region;
  const bounds = getRegionBounds(region);
  const naturalWidth = image.naturalWidth;
  const naturalHeight = image.naturalHeight;
  const padX = Math.max(8, bounds.width * 0.16);
  const padY = Math.max(8, bounds.height * 0.16);
  const x1 = Math.max(0, Math.floor(bounds.x - padX));
  const y1 = Math.max(0, Math.floor(bounds.y - padY));
  const x2 = Math.min(naturalWidth, Math.ceil(bounds.x + bounds.width + padX));
  const y2 = Math.min(naturalHeight, Math.ceil(bounds.y + bounds.height + padY));
  const sampleWidth = Math.max(1, x2 - x1);
  const sampleHeight = Math.max(1, y2 - y1);
  const canvas = document.createElement("canvas");
  canvas.width = sampleWidth;
  canvas.height = sampleHeight;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  context.drawImage(image, x1, y1, sampleWidth, sampleHeight, 0, 0, sampleWidth, sampleHeight);
  const { data } = context.getImageData(0, 0, sampleWidth, sampleHeight);
  let minX = sampleWidth;
  let minY = sampleHeight;
  let maxX = 0;
  let maxY = 0;
  let pixels = 0;
  const mask = new Uint8Array(sampleWidth * sampleHeight);
  for (let y = 0; y < sampleHeight; y += 1) {
    for (let x = 0; x < sampleWidth; x += 1) {
      const offset = (y * sampleWidth + x) * 4;
      if (!isYellowPixel(data[offset], data[offset + 1], data[offset + 2])) continue;
      mask[y * sampleWidth + x] = 1;
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
      pixels += 1;
    }
  }
  const minUsefulPixels = Math.max(30, Math.round(sampleWidth * sampleHeight * 0.035));
  if (pixels < minUsefulPixels || maxX <= minX || maxY <= minY) return region;
  const visited = new Uint8Array(sampleWidth * sampleHeight);
  let bestPixels = [];
  let bestScore = Infinity;
  const targetCenter = getPolygonCenter(region.polygon || regionToPolygon(region));
  for (let start = 0; start < mask.length; start += 1) {
    if (!mask[start] || visited[start]) continue;
    const queue = [start];
    const componentPixels = [];
    visited[start] = 1;
    for (let cursor = 0; cursor < queue.length; cursor += 1) {
      const current = queue[cursor];
      componentPixels.push(current);
      const x = current % sampleWidth;
      const y = Math.floor(current / sampleWidth);
      const neighbors = [current - 1, current + 1, current - sampleWidth, current + sampleWidth];
      neighbors.forEach((next) => {
        if (next < 0 || next >= mask.length || visited[next] || !mask[next]) return;
        const nextX = next % sampleWidth;
        const nextY = Math.floor(next / sampleWidth);
        if (Math.abs(nextX - x) + Math.abs(nextY - y) !== 1) return;
        visited[next] = 1;
        queue.push(next);
      });
    }
    const bounds = getPixelBounds(componentPixels, sampleWidth);
    const center = {
      x: x1 + (bounds.minX + bounds.maxX) / 2,
      y: y1 + (bounds.minY + bounds.maxY) / 2,
    };
    const score = getDistanceSquared(center, targetCenter) - componentPixels.length * 0.08;
    if (score < bestScore) {
      bestScore = score;
      bestPixels = componentPixels;
    }
  }
  const bestBounds = bestPixels.length ? getPixelBounds(bestPixels, sampleWidth) : { minX, maxX, minY, maxY };
  const shrink = Math.max(1, Math.round(Math.min(bestBounds.maxX - bestBounds.minX, bestBounds.maxY - bestBounds.minY) * 0.02));
  const tightened = {
    ...region,
    x: x1 + bestBounds.minX + shrink,
    y: y1 + bestBounds.minY + shrink,
    width: Math.max(10, bestBounds.maxX - bestBounds.minX + 1 - shrink * 2),
    height: Math.max(10, bestBounds.maxY - bestBounds.minY + 1 - shrink * 2),
  };
  tightened.polygon = bestPixels.length
    ? getBoundaryPoints(bestPixels, bestBounds.minX, bestBounds.maxX, bestBounds.minY, bestBounds.maxY, sampleWidth, 1, 1, x1, y1)
    : regionToPolygon(tightened);
  return tightened;
}

function insetPolygon(polygon, ratio = 0.06) {
  const xs = polygon.map(([x]) => x);
  const ys = polygon.map(([, y]) => y);
  const centerX = (Math.min(...xs) + Math.max(...xs)) / 2;
  const centerY = (Math.min(...ys) + Math.max(...ys)) / 2;
  return polygon.map(([x, y]) => [Math.round(centerX + (x - centerX) * (1 - ratio)), Math.round(centerY + (y - centerY) * (1 - ratio))]);
}

function tightenScannedRegions() {
  scannedRegions = scannedRegions
    .map((region) => {
      const tightened = tightenRegionWithSeatColor(region);
      return { ...tightened, polygon: insetPolygon(tightened.polygon || regionToPolygon(tightened), 0.025) };
    })
    .filter((region) => !isOversizedPolygon(region.polygon));
}

function applyRecognizedRegions(regions, source = "智能识别") {
  const alignedRegions = alignRecognizedRegionsToColorRegions(regions);
  const sourceRegions = alignedRegions || regions;
  let missingIndex = 0;
  scannedRegions = sourceRegions.map((region) => {
    const xs = region.polygon.map(([x]) => x);
    const ys = region.polygon.map(([, y]) => y);
    const label = String(region.label || "").trim();
    if (!label) missingIndex += 1;
    return {
      x: Math.min(...xs),
      y: Math.min(...ys),
      width: Math.max(...xs) - Math.min(...xs),
      height: Math.max(...ys) - Math.min(...ys),
      polygon: region.polygon,
      label,
      labelPoint: region.labelPoint || region.label_point || null,
      missingIndex: label ? null : missingIndex,
    };
  });
  if (alignedRegions) {
    scannedRegions = scannedRegions.filter((region) => !isOversizedPolygon(region.polygon));
  } else {
    tightenScannedRegions();
  }
  const recognized = scannedRegions.filter((region) => region.label).map((region) => region.label);
  const missing = scannedRegions.filter((region) => !region.label).map((region) => `缺失区${region.missingIndex}`);
  recognizedZonesList.textContent = recognized.length ? recognized.join(", ") : "暂无自动编号";
  unrecognizedZonesList.textContent = missing.length ? missing.join(", ") : "无";
  const alignmentText = alignedRegions ? "已用真实色块轮廓重新贴合编号，" : "";
  zoneMarkingStatus.textContent = missing.length
    ? `${source}完成：${alignmentText}识别到 ${recognized.length} 个编号，还有 ${missing.length} 个色块读不出编号，已用红框标出，请在下方输入编号后保存。`
    : `${source}成功：${alignmentText}识别到 ${recognized.length} 个区域，可直接保存热区。`;
  renderSeatmapMarkers();
}

function scaleRecognizedRegions(regions, fromSize, toSize) {
  if (!fromSize?.width || !fromSize?.height || !toSize?.width || !toSize?.height) return regions;
  const scaleX = toSize.width / fromSize.width;
  const scaleY = toSize.height / fromSize.height;
  if (Math.abs(scaleX - 1) < 0.001 && Math.abs(scaleY - 1) < 0.001) return regions;
  return regions.map((region) => ({
    ...region,
    polygon: region.polygon.map(([x, y]) => [Math.round(x * scaleX), Math.round(y * scaleY)]),
    labelPoint: region.labelPoint ? [Math.round(region.labelPoint[0] * scaleX), Math.round(region.labelPoint[1] * scaleY)] : region.labelPoint,
  }));
}

function findCurrentSeatmapTemplateMatch() {
  return findBestSeatmapTemplate({
    fileName: getSeatmapFileName(currentEvent),
    size: currentEvent.seatmapSize,
    fingerprint: currentEvent.seatmapFingerprint,
  });
}

async function scanSeatmapRegions(options = {}) {
  const source = options.source || "统一扫描";
  scannedRegions = [];
  renderSeatmapMarkers();
  recognizedZonesList.textContent = "正在识别";
  unrecognizedZonesList.textContent = "等待结果";
  const matchedTemplate = findCurrentSeatmapTemplateMatch();
  if (matchedTemplate) {
    applySeatmapTemplate(matchedTemplate.template, `${source} · 模板匹配`);
    return;
  }
  if (isLaiziSeatmapCandidate()) {
    applyLaiziTemplateToScan(`${source} · 拉椅子标准模板`);
    showToast("已套用拉椅子标准热区。", "success");
    return;
  }
  zoneMarkingStatus.textContent = `${source}开始：正在调用 AI 识别；如果网络或模型失败，会自动转本地兜底扫描。`;
  showToast("正在扫描座位图热区...", "loading");
  try {
    await waitForImageLoad(adminSeatmapPreview);
    const recognitionImage = currentEvent.seatmapImage?.startsWith("data:image/")
      ? { url: currentEvent.seatmapImage, size: currentEvent.seatmapSize }
      : getImageElementDataUrl(adminSeatmapPreview);
    const response = await fetch("/api/seatmap/recognize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        image: recognitionImage.url,
        width: recognitionImage.size.width,
        height: recognitionImage.size.height,
      }),
    });
    const result = await response.json();
    if (response.ok && Array.isArray(result.regions) && result.regions.length) {
      const scaledRegions = scaleRecognizedRegions(result.regions, recognitionImage.size, currentEvent.seatmapSize);
      applyRecognizedRegions(scaledRegions, `${source} · AI识别（${result.model || aiStatus?.model || "AI"}）`);
      showToast("扫描完成。", "success");
      return;
    }
    const message = result.message || result.error || "智能识别没有返回区域。";
    if (runLocalFallbackScan(`智能识别失败：${message}`)) return;
    recognizedZonesList.textContent = "无";
    unrecognizedZonesList.textContent = "未生成";
    zoneMarkingStatus.textContent = `${message} 本地兜底扫描也没有找到清晰闭合区域，请换更清晰的座位图或先套用模板。`;
    showToast("智能识别失败，本地扫描也未找到区域。", "error");
  } catch (error) {
    const message = error.message || "智能识别服务不可用";
    if (runLocalFallbackScan(`智能识别失败：${message}`)) return;
    recognizedZonesList.textContent = "无";
    unrecognizedZonesList.textContent = "未生成";
    zoneMarkingStatus.textContent = `${message}。本地兜底扫描也没有找到清晰闭合区域，请检查本地服务/网络，或换更清晰的座位图。`;
    showToast("智能识别失败，本地扫描也未找到区域。", "error");
  }
}

function runLocalFallbackScan(reason = "") {
  if (isLaiziSeatmapCandidate()) {
    applyLaiziTemplateToScan("拉椅子标准模板");
    showToast("已套用拉椅子标准热区。", "success");
    return true;
  }
  zoneMarkingStatus.textContent = `${reason ? `${reason}，` : ""}正在执行本地兜底扫描...`;
  showToast("正在本地兜底扫描...", "loading");
  let regions = [];
  try {
    regions = scanLocalSeatRegionsFromImage();
  } catch (error) {
    zoneMarkingStatus.textContent = `${reason ? `${reason}，` : ""}${error.message || "本地扫描失败"}。请确认座位图已加载完成。`;
    showToast("扫描失败：请确认座位图已加载完成。", "error");
    return false;
  }
  if (!regions.length) {
    scannedRegions = [];
    recognizedZonesList.textContent = "未找到清晰色块";
    unrecognizedZonesList.textContent = "无";
    zoneMarkingStatus.textContent = `${reason ? `${reason}。` : ""}本地扫描没有找到清晰闭合区域：这通常是图片太淡、底图不是分区色块图，或区域线条和背景太接近。`;
    renderSeatmapMarkers();
    return false;
  }
  const labels = extractZoneLabelsFromTables();
  scannedRegions = regions.map((region, index) => ({
    ...region,
    polygon: region.polygon || regionToPolygon(region),
    label: labels[index] || "",
    missingIndex: labels[index] ? null : index - labels.length + 1,
  }));
  const recognized = scannedRegions.filter((region) => region.label).map((region) => region.label);
  const missing = scannedRegions.filter((region) => !region.label).map((region) => `缺失区${region.missingIndex}`);
  recognizedZonesList.textContent = recognized.length ? recognized.join(", ") : "暂无自动编号";
  unrecognizedZonesList.textContent = missing.length ? missing.join(", ") : "无";
  zoneMarkingStatus.textContent = missing.length
    ? `${reason ? `${reason}，` : ""}本地扫描找到 ${regions.length} 个候选区域，但未能读编号，已在图上用红框标出，请在下方输入编号并保存。`
    : `${reason ? `${reason}，` : ""}本地扫描已识别 ${recognized.length} 个区域，可直接保存热区。`;
  renderSeatmapMarkers();
  showToast("本地兜底扫描完成。", "success");
  return true;
}

function runColorFallbackScan() {
  runLocalFallbackScan();
}

function createZoneAroundPoint(label, point) {
  const { width, height } = currentEvent.seatmapSize;
  const radiusX = Math.max(56, width * 0.055);
  const radiusY = Math.max(42, height * 0.06);
  return {
    id: slugify(label),
    label,
    aliases: [label],
    polygon: [
      [Math.round(point.x - radiusX), Math.round(point.y - radiusY)],
      [Math.round(point.x + radiusX), Math.round(point.y - radiusY)],
      [Math.round(point.x + radiusX), Math.round(point.y + radiusY)],
      [Math.round(point.x - radiusX), Math.round(point.y + radiusY)],
    ],
  };
}

function generateQuickZones() {
  const labels = zoneNameInput.value
    .split(/[,，、\s]+/)
    .map((label) => label.trim())
    .filter(Boolean);
  if (!labels.length) {
    seatmapStatus.textContent = "请先输入区域名称，例如：204,205,FE,FW。";
    showToast("请先输入区域名称。", "error");
    return;
  }
  currentEvent.zones = createQuickZones(labels);
  seatmapStatus.textContent = `已生成 ${labels.length} 个可点击区域。前台现在可以点击区域测试。`;
  showToast(`已生成 ${labels.length} 个可点击区域。`, "success");
  saveAppState();
  renderAdminEvent();
  render();
}

function extractZonesForMarking() {
  const labels = extractZoneLabelsFromTables();
  if (!labels.length) {
    zoneMarkingStatus.textContent = "还没有可提取的票源区号，请先发布票源，或手动输入区域名称。";
    showToast("没有提取到区号。", "error");
    return;
  }
  zoneNameInput.value = labels.join(",");
  zoneMarkingStatus.textContent = `已从票源提取 ${labels.length} 个区号，可开始标注。`;
  showToast(`已提取 ${labels.length} 个区号。`, "success");
}

function startZoneMarking() {
  markingZones = zoneNameInput.value
    .split(/[,，、\s]+/)
    .map((label) => label.trim())
    .filter(Boolean);
  if (!markingZones.length) {
    zoneMarkingStatus.textContent = "请先输入或提取区域名称。";
    showToast("请先输入区域名称。", "error");
    return;
  }
  currentEvent.zones = [];
  markingIndex = 0;
  isMarkingZones = true;
  renderSeatmapMarkers();
  zoneMarkingStatus.textContent = `请在座位图上点击 ${markingZones[0]} 的位置。`;
  showToast("开始标注区域。", "success");
}

function getAdminSeatmapPoint(event) {
  const rect = adminSeatmapPreview.getBoundingClientRect();
  return {
    x: ((event.clientX - rect.left) / rect.width) * currentEvent.seatmapSize.width,
    y: ((event.clientY - rect.top) / rect.height) * currentEvent.seatmapSize.height,
  };
}

function markNextZone(event) {
  if (!isMarkingZones) return;
  const label = markingZones[markingIndex];
  currentEvent.zones.push(createZoneAroundPoint(label, getAdminSeatmapPoint(event)));
  markingIndex += 1;
  renderSeatmapMarkers();
  if (markingIndex >= markingZones.length) {
    isMarkingZones = false;
    zoneMarkingStatus.textContent = `已标注 ${markingZones.length} 个 SVG 可点击热区，前台 hover/点击会高亮。`;
    showToast("区域标注完成。", "success");
    saveAppState();
    renderAdminEvent();
    render();
    return;
  }
  zoneMarkingStatus.textContent = `请继续点击 ${markingZones[markingIndex]} 的位置。`;
}

async function saveScannedSeatmapZones() {
  if (!scannedRegions.length) {
    showToast("请先自动扫描座位图区域。", "error");
    return;
  }
  tightenScannedRegions();
  const missingRegions = scannedRegions.filter((region) => !region.label);
  const manualLabels = zoneNameInput.value
    .split(/[,，、\s]+/)
    .map((label) => label.trim())
    .filter(Boolean);
  if (missingRegions.length && manualLabels.length !== missingRegions.length) {
    zoneMarkingStatus.textContent = `还有 ${missingRegions.length} 个未识别区域，请输入 ${missingRegions.length} 个编号，用英文逗号分隔。`;
    showToast("未识别区域编号数量不匹配，已阻止保存。", "error");
    return;
  }
  missingRegions.forEach((region, index) => {
    region.label = manualLabels[index];
  });
  const unresolved = scannedRegions.filter((region) => !region.label);
  if (unresolved.length) {
    showToast("仍有未识别区域未补齐，不能保存。", "error");
    return;
  }
  currentEvent.zones = scannedRegions.map((region) => ({
    id: slugify(region.label),
    label: region.label,
    aliases: [region.label],
    polygon: region.polygon,
  }));
  scannedRegions = [];
  zoneNameInput.value = "";
  recognizedZonesList.textContent = currentEvent.zones.map((zone) => zone.label).join(", ");
  unrecognizedZonesList.textContent = "无";
  selectedDateId = null;
  selectedZone = null;
  hoveredZone = null;
  const template = await saveCurrentSeatmapAsTemplate(true);
  zoneMarkingStatus.textContent = template
    ? `已保存 ${currentEvent.zones.length} 个完全透明的独立 SVG 可点击热区，并已把座位图底图一起存入模板库“${template.name}”。已切到前台测试。`
    : `已保存 ${currentEvent.zones.length} 个完全透明的独立 SVG 可点击热区，已切到前台测试，请直接点击座位图验证。`;
  showToast(template ? "整套座位图模板已保存。" : "座位图热区已保存。", "success");
  saveAppState();
  renderSeatmapMarkers();
  renderAdminEvent();
  render();
  setMode("customer");
  seatmapFrame.scrollIntoView({ behavior: "smooth", block: "center" });
}

function openSeatmapTest() {
  selectedDateId = null;
  selectedZone = null;
  hoveredZone = null;
  searchTerm = "";
  searchInput.value = "";
  render();
  setMode("customer");
  seatmapFrame.scrollIntoView({ behavior: "smooth", block: "center" });
  const message = currentEvent.zones.length
    ? `已进入前台测试：${currentEvent.zones.length} 个热区可直接点击，票源 PDF 可以后面再补。`
    : "已进入前台测试：当前只有座位图，保存热区后才能点击区域。";
  showToast(message, currentEvent.zones.length ? "success" : "idle");
}

function createNewEvent() {
  const name = newEventName.value.trim();
  const location = newEventLocation.value.trim();
  const dates = newEventDates.value.trim();
  if (!name) {
    newEventStatus.textContent = "请先填写演出名称。";
    newEventStatus.dataset.status = "error";
    showToast("创建失败：缺少演出名称。", "error");
    return;
  }

  const idBase = slugify(name);
  const id = events.some((event) => event.id === idBase) ? `${idBase}-${Date.now()}` : idBase;
  const newEvent = {
    id,
    name,
    location: location || "待填写场馆",
    dates: dates || "待定",
    dateOptions: parseDateOptions(dates),
    venue: location || "待填写场馆",
    seatmapTitle: `${name} 官方座位图`,
    seatmapImage: createPlaceholderSeatmap(name),
    seatmapFileName: "待上传座位图",
    seatmapSize: { width: 1200, height: 720 },
    zones: [],
    tables: [],
  };
  events.unshift(newEvent);
  currentEvent = newEvent;
  selectedDateId = null;
  selectedZone = null;
  searchTerm = "";
  searchInput.value = "";
  newEventForm.classList.add("hidden");
  newEventForm.reset();
  newEventStatus.dataset.status = "success";
  newEventStatus.textContent = "演出已创建，可以上传座位图和票源 PDF。";
  showToast(`${name} 已创建。`, "success");
  saveAppState();
  render();
  renderAdminEvent();
  renderUploadRecords();
  renderReviewPanel();
  renderPublishedTables();
}

function render() {
  renderEventList();
  renderDateFilter();
  renderHeader();
  renderSeatmap();
  renderZoneDrawer();
  renderResults();
}

function setMode(mode) {
  const isCustomer = mode === "customer";
  customerView.classList.toggle("hidden", !isCustomer);
  adminView.classList.toggle("hidden", isCustomer);
  modeButtons.forEach((button) => button.classList.toggle("active", button.dataset.mode === mode));
}

function renderRuntimeBanner() {
  runtimeBanner.classList.toggle("hidden", window.location.protocol !== "file:");
}

modeButtons.forEach((button) => {
  button.addEventListener("click", () => setMode(button.dataset.mode));
});

modeShortcuts.forEach((button) => {
  button.addEventListener("click", () => setMode(button.dataset.modeShortcut));
});

adminWorkflowTabs.addEventListener("click", (event) => {
  const button = event.target.closest("[data-admin-jump]");
  if (!button) return;
  adminWorkflowTabs.querySelectorAll(".workflow-tab").forEach((tab) => tab.classList.toggle("active", tab === button));
  document.querySelector(`#${button.dataset.adminJump}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
});

toggleNewEventForm.addEventListener("click", () => {
  newEventForm.classList.toggle("hidden");
});

cancelNewEventButton.addEventListener("click", () => {
  newEventForm.classList.add("hidden");
  newEventForm.reset();
});

createEventButton.addEventListener("click", createNewEvent);

adminEventList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-admin-event-id]");
  if (!button) return;
  currentEvent = events.find((item) => item.id === button.dataset.adminEventId);
  selectedDateId = null;
  selectedZone = null;
  searchTerm = "";
  searchInput.value = "";
  pendingSeatmap = null;
  render();
  renderAdminEvent();
  renderUploadRecords();
  renderReviewPanel();
  renderPublishedTables();
});

eventList.addEventListener("click", (event) => {
  const card = event.target.closest("[data-event-id]");
  if (!card) return;
  currentEvent = events.find((item) => item.id === card.dataset.eventId);
  searchTerm = "";
  selectedDateId = null;
  selectedZone = null;
  hoveredZone = null;
  searchInput.value = "";
  render();
  renderAdminEvent();
  renderUploadRecords();
  renderReviewPanel();
  renderPublishedTables();
});

dateFilter.addEventListener("click", (event) => {
  const button = event.target.closest("[data-date-id]");
  if (!button) return;
  selectedDateId = button.dataset.dateId;
  selectedZone = null;
  renderDateFilter();
  updateSeatmapHotspots();
  renderZoneDrawer();
  renderResults();
});

sortFilter.addEventListener("click", (event) => {
  const button = event.target.closest("[data-sort]");
  if (!button) return;
  sortMode = button.dataset.sort;
  sortFilter.querySelectorAll("[data-sort]").forEach((item) => item.classList.toggle("active", item === button));
  renderZoneDrawer();
  renderResults();
});

seatmapFrame.addEventListener("click", (event) => {
  const seatmap = event.target.closest(".seatmap-stage");
  if (!seatmap) return;
  const zone = getZoneForSeatmapEvent(event, seatmap);
  if (!zone) return;
  selectZone(zone);
});

seatmapFrame.addEventListener("mousemove", (event) => {
  const seatmap = event.target.closest(".seatmap-stage");
  if (!seatmap) return;
  const zone = getZoneForSeatmapEvent(event, seatmap);
  hoveredZone = zone || null;
  seatmap.style.cursor = zone ? "pointer" : "default";
  updateSeatmapHotspots();
  updateSeatmapHoverCard(event, zone);
});

seatmapFrame.addEventListener("mouseleave", () => {
  hoveredZone = null;
  updateSeatmapHotspots();
  const card = seatmapFrame.querySelector("#seatmapHoverCard");
  if (card) card.classList.add("hidden");
});

seatmapFrame.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" && event.key !== " ") return;
  const hotspot = event.target.closest("[data-zone-id]");
  if (!hotspot) return;
  const zone = currentEvent.zones.find((item) => item.id === hotspot.dataset.zoneId);
  if (!zone) return;
  event.preventDefault();
  selectZone(zone);
});

zoneDrawer.addEventListener("click", (event) => {
  const ticketCard = event.target.closest("[data-ticket-key]");
  if (ticketCard) {
    const ticket = findTicketByKey(ticketCard.dataset.ticketKey);
    if (ticket) openOriginalTable(ticket.table);
    return;
  }

  if (!event.target.closest("[data-close-zone]")) return;
  selectedZone = null;
  updateSeatmapHotspots();
  renderZoneDrawer();
});

results.addEventListener("click", (event) => {
  const ticketCard = event.target.closest("[data-ticket-key]");
  if (!ticketCard) return;
  const ticket = findTicketByKey(ticketCard.dataset.ticketKey);
  if (ticket) openOriginalTable(ticket.table);
});

imageModal.addEventListener("click", (event) => {
  if (!event.target.closest("[data-close-modal]")) return;
  closeOriginalImage();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !imageModal.classList.contains("hidden")) {
    closeOriginalImage();
  }
});

searchInput.addEventListener("input", (event) => {
  searchTerm = event.target.value.trim();
  renderResults();
});

clearButton.addEventListener("click", () => {
  searchTerm = "";
  searchInput.value = "";
  searchInput.focus();
  renderResults();
});

adminSeatmapPreview.addEventListener("load", updateSeatmapPreviewLayerSize);
window.addEventListener("resize", updateSeatmapPreviewLayerSize);

async function applyPendingSeatmapToCurrentEvent({ autoScan = false } = {}) {
  if (!pendingSeatmap) {
    seatmapStatus.textContent = "请先选择一张座位图。";
    return false;
  }
  const savedSeatmapName = pendingSeatmap.name;
  const savedSeatmap = pendingSeatmap;
  currentEvent.seatmapImage = savedSeatmap.url;
  currentEvent.seatmapFileName = savedSeatmapName;
  currentEvent.seatmapSize = savedSeatmap.size;
  currentEvent.seatmapFingerprint = savedSeatmap.fingerprint || "";
  currentEvent.seatmapTemplateId = "";
  currentEvent.seatmapTitle = `${currentEvent.name} 官方座位图`;
  currentEvent.zones = [];
  scannedRegions = [];
  isMarkingZones = false;
  markingZones = [];
  markingIndex = 0;
  selectedDateId = null;
  selectedZone = null;
  hoveredZone = null;
  const matchedTemplate = findBestSeatmapTemplate({
    fileName: savedSeatmapName,
    size: currentEvent.seatmapSize,
    fingerprint: currentEvent.seatmapFingerprint,
  });
  pendingSeatmap = null;
  selectedSeatmapName.textContent = `当前使用：${savedSeatmapName}`;
  if (matchedTemplate) {
    applySeatmapTemplate(matchedTemplate.template, autoScan ? "上传自动匹配模板" : "匹配模板");
    return true;
  }
  if (isLaiziSeatmapCandidate(savedSeatmapName)) {
    currentEvent.zones = createLaiziTemplateZones(currentEvent.seatmapSize);
    currentEvent.seatmapTemplateId = "builtin-laizi";
    seatmapStatus.textContent = `座位图已保存，并已自动套用 ${currentEvent.zones.length} 个拉椅子标准热区。可直接点“前台测试座位图”。`;
    if (!saveAppState()) return false;
    showToast(`${currentEvent.name} 座位图已更新。`, "success");
    renderAdminEvent();
    render();
    return true;
  }
  seatmapStatus.textContent = autoScan ? "座位图已上传并保存，正在自动扫描热区..." : "座位图已保存。点击“扫描热区”后会自动组合 AI 和本地兜底识别。";
  if (!saveAppState()) return false;
  renderAdminEvent();
  render();
  if (autoScan) {
    await waitForImageLoad(adminSeatmapPreview);
    await scanSeatmapRegions({ source: "上传自动扫描" });
  } else {
    showToast(`${currentEvent.name} 座位图已更新。`, "success");
  }
  return true;
}

seatmapUploadInput.addEventListener("change", async () => {
  const uploadRunId = (seatmapUploadRunId += 1);
  const file = seatmapUploadInput.files?.[0];
  if (!file) {
    pendingSeatmap = null;
    seatmapStatus.textContent = "座位图保存后，前台当前演出会使用这张图。";
    return;
  }
  if (!file.type.startsWith("image/")) {
    pendingSeatmap = null;
    seatmapStatus.textContent = "座位图请上传 JPG/PNG 图片，PDF 请放到票源文件上传区。";
    showToast("座位图只支持图片文件。", "error");
    return;
  }
  seatmapStatus.textContent = "正在读取座位图...";
  let url = "";
  let size = { width: 1200, height: 720 };
  let fingerprint = "";
  try {
    const rawUrl = await readFileAsDataUrl(file);
    const compressed = await compressImageDataUrl(rawUrl);
    url = compressed.url;
    size = compressed.size;
    fingerprint = compressed.fingerprint || "";
  } catch {
    seatmapStatus.textContent = "座位图读取失败，请换一张图片再试。";
    showToast("座位图读取失败。", "error");
    return;
  }
  pendingSeatmap = {
    name: file.name,
    type: file.type,
    url,
    size,
    fingerprint,
  };
  scannedRegions = [];
  selectedSeatmapName.textContent = `待保存：${file.name}`;
  const match = findBestSeatmapTemplate({ fileName: file.name, size, fingerprint });
  seatmapStatus.textContent = match
    ? `已读取座位图：${size.width} × ${size.height}，找到模板“${match.template.name}”，正在自动套用。`
    : `已读取座位图：${size.width} × ${size.height}，正在自动保存并扫描热区。`;
  adminSeatmapPreview.src = pendingSeatmap.url;
  try {
    await waitForImageLoad(adminSeatmapPreview);
    if (uploadRunId !== seatmapUploadRunId || !pendingSeatmap) return;
    await applyPendingSeatmapToCurrentEvent({ autoScan: true });
  } catch (error) {
    seatmapStatus.textContent = error.message || "座位图加载失败，请换一张图片再试。";
    showToast("座位图加载失败。", "error");
  }
});

applySeatmapButton.addEventListener("click", () => {
  applyPendingSeatmapToCurrentEvent({ autoScan: false });
});

scanSeatmapButton.addEventListener("click", scanSeatmapRegions);
fallbackScanButton.addEventListener("click", runColorFallbackScan);
saveScannedZonesButton.addEventListener("click", saveScannedSeatmapZones);
testSeatmapButton.addEventListener("click", openSeatmapTest);
saveSeatmapTemplateButton.addEventListener("click", () => {
  saveCurrentSeatmapAsTemplate(false);
});
toggleTemplateLibraryButton.addEventListener("click", () => {
  templateLibraryOpen = !templateLibraryOpen;
  renderSeatmapTemplates();
});
applyMatchedTemplateButton.addEventListener("click", () => {
  if (pendingSeatmap) {
    seatmapStatus.textContent = "请先点击“保存座位图”，再套用匹配模板。";
    showToast("请先保存座位图。", "error");
    return;
  }
  const match = findBestSeatmapTemplate({
    fileName: getSeatmapFileName(currentEvent),
    size: currentEvent.seatmapSize,
    fingerprint: currentEvent.seatmapFingerprint,
  });
  if (!match) {
    seatmapStatus.textContent = "模板库里暂时没有匹配这张座位图的模板，请先扫描并保存热区。";
    showToast("没有找到匹配模板。", "error");
    return;
  }
  applySeatmapTemplate(match.template, match.reason);
});
seatmapTemplateList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-apply-template], [data-edit-template], [data-delete-template]");
  if (!button) return;
  const templateId = button.dataset.applyTemplate || button.dataset.editTemplate || button.dataset.deleteTemplate;
  const template = getAllSeatmapTemplates().find((item) => item.id === templateId);
  if (!template) {
    showToast("模板不存在，请刷新后再试。", "error");
    return;
  }
  if (button.dataset.applyTemplate) {
    applySeatmapTemplate(template, "手动模板");
    return;
  }
  if (template.builtIn) {
    showToast("系统内置模板不能编辑或删除。", "error");
    return;
  }
  const templateIndex = seatmapTemplates.findIndex((item) => item.id === template.id);
  if (templateIndex < 0) {
    showToast("没有找到这个自建模板。", "error");
    return;
  }
  if (button.dataset.editTemplate) {
    const nextName = window.prompt("请输入新的模板名称", template.name)?.trim();
    if (!nextName) return;
    seatmapTemplates[templateIndex] = { ...seatmapTemplates[templateIndex], name: nextName, updatedAt: Date.now() };
    saveAppState();
    renderSeatmapTemplates();
    showToast("模板名称已更新。", "success");
    return;
  }
  if (button.dataset.deleteTemplate) {
    seatmapTemplates.splice(templateIndex, 1);
    if (currentEvent.seatmapTemplateId === template.id) currentEvent.seatmapTemplateId = "";
    saveAppState();
    renderSeatmapTemplates();
    renderAdminChecklist();
    showToast("模板已删除。当前演出的座位图不会被清掉。", "success");
  }
});
confirmAllButton.addEventListener("click", confirmAllPendingTables);
clearPendingButton.addEventListener("click", clearCurrentPendingTables);

sourceFileInput.addEventListener("change", async () => {
  const file = sourceFileInput.files?.[0];
  if (!file) {
    stopTicketOcrPolling();
    uploadedSource = null;
    selectedSourceName.textContent = "微信截图通常一张图是一张表；PDF 可能包含多张表，需要先按页/按表拆开。";
    pdfDetectionStatus.textContent = "选择 PDF 后自动识别页数/候选表数量。";
    setUploadStatus("先选择原始图片/PDF，再发布测试。");
    return;
  }
  stopTicketOcrPolling();
  if (uploadedSource?.url) URL.revokeObjectURL(uploadedSource.url);
  uploadedSource = {
    name: file.name,
    type: file.type || (file.name.toLowerCase().endsWith(".pdf") ? "application/pdf" : "image/*"),
    url: URL.createObjectURL(file),
    detectedTables: 1,
  };
  selectedSourceName.textContent = `已选择：${file.name}`;
  setUploadStatus("正在自动检测文件结构...", "loading");
  showToast("正在检测文件结构...", "loading");
  const detectedTables = await detectPdfPageCount(file);
  uploadedSource.detectedTables = detectedTables;
  const isPdf = uploadedSource.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
  if (isPdf) uploadTableText.value = "";
  pdfDetectionStatus.textContent =
    isPdf
      ? `已自动检测：PDF 约 ${detectedTables} 页，准备 OCR 识别票源表。`
      : "已自动检测：图片按 1 张表处理。";
  setUploadStatus("文件已插入并完成检测，请确认识别内容后点击发布。", "idle");
  showToast("文件检测完成。", "success");
  try {
    await recognizeTicketSource(file, detectedTables);
  } catch (error) {
    pdfDetectionStatus.textContent = error.message || "PDF 表格识别失败，请手动粘贴 OCR 文字。";
    setUploadStatus("PDF 表格识别失败，请手动粘贴识别文本。", "error");
    showToast("PDF 表格识别失败。", "error");
  }
});

ticketUploadForm.addEventListener("submit", (event) => {
  event.preventDefault();
  publishUpload();
});

publishUploadButton.addEventListener("click", publishUpload);

document.querySelectorAll("[data-ai-provider]").forEach((button) => {
  button.addEventListener("click", () => renderAiProviderTemplate(button.dataset.aiProvider));
});

copyEnvTemplateButton.addEventListener("click", async () => {
  const text = getCurrentEnvTemplateText();
  try {
    await navigator.clipboard.writeText(text);
    showToast("配置模板已复制。", "success");
  } catch {
    showToast("复制失败，可以手动选中模板。", "error");
  }
});

uploadRecords.addEventListener("click", (event) => {
  const button = event.target.closest("[data-review-table]");
  if (!button) return;
  selectedPendingTableId = button.dataset.reviewTable;
  renderUploadRecords();
  renderReviewPanel();
});

reviewLayout.addEventListener("click", (event) => {
  const button = event.target.closest("[data-review-source]");
  if (!button) return;
  const table = pendingTables.find((item) => item.id === button.dataset.reviewSource);
  if (table) openOriginalTable(table);
});

confirmReviewButton.addEventListener("click", confirmSelectedPendingTable);

window.addEventListener("storage", (event) => {
  if (event.key !== STORAGE_KEY) return;
  loadAppState();
  selectedDateId = null;
  selectedZone = null;
  searchTerm = "";
  searchInput.value = "";
  render();
  renderAdminEvent();
  renderUploadRecords();
  renderReviewPanel();
  renderPublishedTables();
});

loadAppState();
renderRuntimeBanner();
render();
renderAdminEvent();
renderUploadRecords();
renderReviewPanel();
renderPublishedTables();
setMode(new URLSearchParams(window.location.search).get("admin") === "1" ? "admin" : "customer");
renderAiProviderTemplate("aliyun");
refreshAiStatus();
