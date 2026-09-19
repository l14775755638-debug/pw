const REVIEW_FLAGS_VERSION = 35;
const ROW_COLOR_LOGIC_VERSION = 78;
const PUBLISH_DECISION_LOGIC_VERSION = 5;
const ROW_ACTION_GEOMETRY_VERSION = 9;
const COLUMN_NORMALIZATION_VERSION = 4;
const AI_ROW_COLOR_SKIP_CONFIDENCE = 0.78;
const AI_ROW_COLOR_PUBLISH_CONFIDENCE = 0.7;
const MAX_AUTO_ANCHOR_PAGES_DURING_UPLOAD = 30;
const MAX_REVIEW_ROWS_RENDERED = 40;
const MAX_UPLOAD_RECORDS_RENDERED = 36;
const MAX_OPENCV_PREVIEW_ROWS_RENDERED = 160;
const AUTO_REPAIR_ROW_COLORS_ON_REVIEW_OPEN = false;
const DATE_COLUMN_NAMES = ["日期", "演出日期", "门票时间", "票期", "场次日期", "date", "day", "일자"];
const IS_ADMIN_PAGE = new URLSearchParams(window.location.search).get("admin") === "1";
const LAIZI_SEATMAP_SIZE = { width: 1108, height: 1108 };
const ITZY_VENETIAN_SEATMAP_SIZE = { width: 1206, height: 1656 };
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

const ITZY_VENETIAN_TEMPLATE_ZONES = [
  { id: "223", label: "223", points: [[353, 345], [487, 345], [487, 436], [399, 436]] },
  { id: "224", label: "224", points: [[503, 345], [606, 345], [606, 436], [503, 436]] },
  { id: "225", label: "225", points: [[620, 345], [724, 345], [724, 436], [620, 436]] },
  { id: "226", label: "226", points: [[739, 345], [854, 345], [921, 393], [841, 436], [739, 436]] },
  { id: "222", label: "222", points: [[307, 388], [408, 388], [408, 486], [327, 563], [260, 501]] },
  { id: "227", label: "227", points: [[837, 394], [918, 388], [1015, 484], [937, 563], [801, 438]] },
  { id: "221", label: "221", points: [[128, 566], [258, 446], [321, 512], [264, 598], [238, 598], [238, 584]] },
  { id: "228", label: "228", points: [[945, 513], [1027, 476], [1096, 547], [1032, 599], [954, 599], [899, 551]] },
  { id: "220", label: "220", points: [[128, 586], [236, 586], [236, 633], [128, 633]] },
  { id: "229", label: "229", points: [[1000, 584], [1096, 584], [1096, 632], [1000, 632]] },
  { id: "219", label: "219", points: [[128, 647], [236, 647], [236, 759], [128, 759]] },
  { id: "230", label: "230", points: [[989, 647], [1096, 647], [1096, 759], [989, 759]] },
  { id: "218", label: "218", points: [[128, 772], [236, 772], [236, 881], [128, 881]] },
  { id: "231", label: "231", points: [[989, 773], [1096, 773], [1096, 884], [989, 884]] },
  { id: "217", label: "217", points: [[128, 895], [236, 895], [236, 1008], [128, 1008]] },
  { id: "232", label: "232", points: [[989, 897], [1096, 897], [1096, 1008], [989, 1008]] },
  { id: "216", label: "216", points: [[128, 1021], [236, 1021], [236, 1135], [128, 1135]] },
  { id: "201", label: "201", points: [[989, 1022], [1096, 1022], [1096, 1138], [989, 1138]] },
  { id: "215", label: "215", points: [[128, 1147], [236, 1147], [236, 1265], [128, 1265]] },
  { id: "202", label: "202", points: [[989, 1148], [1096, 1148], [1096, 1264], [989, 1264]] },
  { id: "214", label: "214", points: [[128, 1280], [236, 1280], [236, 1371], [128, 1371]] },
  { id: "203", label: "203", points: [[989, 1277], [1096, 1277], [1096, 1370], [989, 1370]] },
  { id: "118", label: "118", points: [[405, 474], [452, 610], [389, 670], [337, 513]] },
  { id: "119", label: "119", points: [[444, 474], [542, 474], [542, 607], [490, 607]] },
  { id: "120", label: "120", points: [[557, 474], [655, 474], [655, 607], [610, 607], [610, 548], [581, 548], [581, 607], [557, 607]] },
  { id: "121", label: "121", points: [[671, 474], [770, 474], [736, 607], [671, 607]] },
  { id: "122", label: "122", points: [[783, 474], [864, 474], [806, 607], [736, 607]] },
  { id: "117", label: "117", points: [[270, 610], [389, 580], [445, 644], [344, 681], [270, 681]] },
  { id: "123", label: "123", points: [[826, 586], [904, 610], [960, 669], [908, 706], [816, 681]] },
  { id: "116", label: "116", points: [[276, 686], [360, 686], [360, 771], [276, 771]] },
  { id: "124", label: "124", points: [[864, 686], [948, 686], [948, 767], [864, 767]] },
  { id: "115", label: "115", points: [[276, 783], [360, 783], [360, 888], [276, 888]] },
  { id: "125", label: "125", points: [[864, 778], [948, 778], [948, 887], [864, 887]] },
  { id: "114", label: "114", points: [[276, 905], [360, 905], [360, 1001], [276, 1001]] },
  { id: "126", label: "126", points: [[864, 897], [948, 897], [948, 1007], [864, 1007]] },
  { id: "113", label: "113", points: [[276, 1015], [360, 1015], [360, 1113], [276, 1113]] },
  { id: "101", label: "101", points: [[864, 1020], [948, 1020], [948, 1098], [864, 1098]] },
  { id: "112", label: "112", points: [[276, 1134], [360, 1134], [360, 1224], [276, 1224]] },
  { id: "102", label: "102", points: [[864, 1118], [948, 1118], [948, 1208], [864, 1208]] },
  { id: "111", label: "111", points: [[276, 1238], [360, 1238], [360, 1320], [326, 1342], [276, 1320]] },
  { id: "103", label: "103", points: [[864, 1227], [948, 1227], [948, 1320], [914, 1341], [864, 1320]] },
  { id: "FS", label: "FS", aliases: ["VIP", "VIP Standing", "Standing"], points: [[410, 711], [477, 638], [759, 638], [824, 711], [824, 944], [410, 944]] },
  { id: "FE", label: "FE", aliases: ["VIP", "VIP Standing", "Standing"], points: [[403, 966], [507, 966], [507, 1177], [403, 1177]] },
  { id: "FW", label: "FW", aliases: ["VIP", "VIP Standing", "Standing"], points: [[729, 966], [833, 966], [833, 1177], [729, 1177]] },
];

function createTemplateZones(templateZones, sourceSize, targetSize = sourceSize) {
  const scaleX = targetSize.width / sourceSize.width;
  const scaleY = targetSize.height / sourceSize.height;
  return templateZones.map((zone) => ({
    id: String(zone.id).toLowerCase().replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-").replace(/^-+|-+$/g, ""),
    label: zone.label,
    aliases: [...new Set([zone.label, zone.id, ...(zone.aliases || [])].map(String))],
    polygon: zone.points.map(([x, y]) => [Math.round(x * scaleX), Math.round(y * scaleY)]),
    source: "template",
  }));
}

function createLaiziTemplateZones(targetSize = LAIZI_SEATMAP_SIZE) {
  return createTemplateZones(
    LAIZI_SEATMAP_TEMPLATE_ZONES.filter((zone) => !String(zone.id).startsWith("WC-")),
    LAIZI_SEATMAP_SIZE,
    targetSize,
  );
}

function createItzyVenetianTemplateZones(targetSize = ITZY_VENETIAN_SEATMAP_SIZE) {
  return createTemplateZones(ITZY_VENETIAN_TEMPLATE_ZONES, ITZY_VENETIAN_SEATMAP_SIZE, targetSize);
}

const WEEKND_GOYANG_SEATMAP_SIZE = { width: 1193, height: 1590 };
const WEEKND_GOYANG_TEMPLATE_ZONES = [{"id":"e12-seat-c-1","label":"E12 · Seat C","aliases":["E12","E12 · Seat C","e12-seat-c-1","Seat C","C"],"tier":"C","points":[[123,229],[145,233],[149,221],[173,221],[176,224],[176,232],[178,232],[178,225],[181,222],[190,221],[195,227],[193,233],[195,243],[200,243],[207,223],[207,215],[128,215],[124,220]]},{"id":"w3-seat-c-2","label":"W3 · Seat C","aliases":["W3","W3 · Seat C","w3-seat-c-2","Seat C","C"],"tier":"C","points":[[1013,216],[1021,247],[1052,242],[1052,240],[1037,239],[1036,219],[1076,219],[1079,237],[1098,233],[1096,221],[1090,214]]},{"id":"standing-b-early-entry-3","label":"Standing B · Early Entry","aliases":["Standing B","Standing B · Early Entry","standing-b-early-entry-3","Early Entry","EE","StandingB"],"tier":"EE","points":[[667,246],[672,250],[849,249],[841,216],[831,210],[705,211]]},{"id":"standing-a-early-entry-4","label":"Standing A · Early Entry","aliases":["Standing A","Standing A · Early Entry","standing-a-early-entry-4","Early Entry","EE","StandingA"],"tier":"EE","points":[[362,246],[365,250],[543,249],[511,213],[501,211],[375,211],[368,217]]},{"id":"e6-seat-b-5","label":"E6 · Seat B","aliases":["E6","E6 · Seat B","e6-seat-b-5","Seat B","B"],"tier":"B","points":[[219,214],[216,223],[223,224],[216,225],[215,228],[221,231],[216,235],[222,239],[210,240],[209,247],[230,251],[233,240],[227,239],[226,231],[233,223],[240,220],[240,215]]},{"id":"w3-seat-b-6","label":"W3 · Seat B","aliases":["W3","W3 · Seat B","w3-seat-b-6","Seat B","B"],"tier":"B","points":[[975,215],[974,220],[981,247],[984,246],[985,251],[988,251],[990,247],[994,247],[996,251],[1007,247],[1008,252],[1011,253],[1004,218]]},{"id":"e6-seat-s-7","label":"E6 · Seat S","aliases":["E6","E6 · Seat S","e6-seat-s-7","Seat S","S"],"tier":"S","points":[[258,215],[248,237],[245,255],[284,264],[301,216]]},{"id":"w1-seat-s-8","label":"W1 · Seat S","aliases":["W1","W1 · Seat S","w1-seat-s-8","Seat S","S"],"tier":"S","points":[[918,216],[934,266],[937,266],[941,260],[959,261],[973,258],[958,215]]},{"id":"e5-seat-s-9","label":"E5 · Seat S","aliases":["E5","E5 · Seat S","e5-seat-s-9","Seat S","S"],"tier":"S","points":[[227,260],[212,256],[206,257],[201,296],[204,300],[216,294],[225,293],[229,267]]},{"id":"w1-seat-s-10","label":"W1 · Seat S","aliases":["W1","W1 · Seat S","w1-seat-s-10","Seat S","S"],"tier":"S","points":[[1007,262],[1000,265],[990,264],[988,267],[994,298],[1009,298],[1018,295],[1015,269]]},{"id":"e5-seat-p-11","label":"E5 · Seat P","aliases":["E5","E5 · Seat P","e5-seat-p-11","Seat P","P"],"tier":"P","points":[[251,265],[245,308],[271,307],[280,318],[286,272]]},{"id":"w1-seat-p-12","label":"W1 · Seat P","aliases":["W1","W1 · Seat P","w1-seat-p-12","Seat P","P"],"tier":"P","points":[[968,263],[962,265],[960,276],[957,278],[939,278],[939,269],[935,268],[940,338],[983,336],[979,276],[975,278],[964,276],[968,272]]},{"id":"e11-seat-a-13","label":"E11 · Seat A","aliases":["E11","E11 · Seat A","e11-seat-a-13","Seat A","A"],"tier":"A","points":[[128,239],[126,295],[120,306],[122,318],[129,318],[127,307],[133,303],[139,319],[124,321],[125,375],[184,377],[195,252],[159,242]]},{"id":"w4-seat-a-14","label":"W4 · Seat A","aliases":["W4","W4 · Seat A","w4-seat-a-14","Seat A","A"],"tier":"A","points":[[1079,246],[1024,256],[1020,261],[1024,270],[1029,376],[1032,378],[1083,377],[1082,321],[1069,319],[1064,322],[1059,306],[1067,309],[1073,304],[1080,309],[1083,304],[1080,300]]},{"id":"w4-seat-c-15","label":"W4 · Seat C","aliases":["W4","W4 · Seat C","w4-seat-c-15","Seat C","C"],"tier":"C","points":[[1082,244],[1081,300],[1085,303],[1097,302],[1101,313],[1097,324],[1083,320],[1084,377],[1136,377],[1130,321],[1113,267],[1101,243]]},{"id":"e11-seat-c-16","label":"E11 · Seat C","aliases":["E11","E11 · Seat C","e11-seat-c-16","Seat C","C"],"tier":"C","points":[[124,237],[116,239],[96,303],[81,370],[85,376],[124,374],[124,324],[108,321],[108,303],[124,300],[127,249]]},{"id":"e5-seat-p-17","label":"E5 · Seat P","aliases":["E5","E5 · Seat P","e5-seat-p-17","Seat P","P"],"tier":"P","points":[[246,310],[243,332],[244,374],[279,375],[280,320],[274,326],[264,328],[249,326],[248,310]]},{"id":"e5-seat-s-18","label":"E5 · Seat S","aliases":["E5","E5 · Seat S","e5-seat-s-18","Seat S","S"],"tier":"S","points":[[207,314],[199,321],[198,374],[220,375],[222,373],[222,337],[211,334],[211,321]]},{"id":"t1-seat-p-19","label":"T1 · Seat P","aliases":["T1","T1 · Seat P","t1-seat-p-19","Seat P","P"],"tier":"P","points":[[940,346],[939,425],[983,425],[983,347]]},{"id":"e4-seat-s-20","label":"E4 · Seat S","aliases":["E4","E4 · Seat S","e4-seat-s-20","Seat S","S"],"tier":"S","points":[[198,385],[198,428],[207,435],[216,435],[222,427],[222,388],[219,384]]},{"id":"w5-seat-c-21","label":"W5 · Seat C","aliases":["W5","W5 · Seat C","w5-seat-c-21","Seat C","C"],"tier":"C","points":[[1085,386],[1085,431],[1101,432],[1104,449],[1098,454],[1085,455],[1086,507],[1115,507],[1120,502],[1120,428],[1124,424],[1138,423],[1138,396],[1129,388]]},{"id":"e4-seat-p-22","label":"E4 · Seat P","aliases":["E4","E4 · Seat P","e4-seat-p-22","Seat P","P"],"tier":"P","points":[[245,384],[244,505],[279,506],[280,448],[273,451],[261,440],[255,445],[260,443],[263,451],[249,451],[247,432],[261,431],[263,436],[267,433],[271,437],[275,431],[280,442],[280,386]]},{"id":"e10-seat-a-23","label":"E10 · Seat A","aliases":["E10","E10 · Seat A","e10-seat-a-23","Seat A","A"],"tier":"A","points":[[124,385],[125,430],[121,435],[126,436],[123,437],[123,447],[128,447],[130,431],[134,435],[134,445],[139,448],[124,451],[126,506],[185,506],[186,386]]},{"id":"w5-seat-a-24","label":"W5 · Seat A","aliases":["W5","W5 · Seat A","w5-seat-a-24","Seat A","A"],"tier":"A","points":[[1030,385],[1030,504],[1084,507],[1085,450],[1080,453],[1075,448],[1066,451],[1062,438],[1064,435],[1085,435],[1084,386]]},{"id":"e10-seat-c-25","label":"E10 · Seat C","aliases":["E10","E10 · Seat C","e10-seat-c-25","Seat C","C"],"tier":"C","points":[[82,385],[77,394],[72,437],[69,505],[125,507],[124,454],[109,453],[106,444],[108,431],[124,430],[123,384]]},{"id":"w0-seat-p-26","label":"W0 · Seat P","aliases":["W0","W0 · Seat P","w0-seat-p-26","Seat P","P"],"tier":"P","points":[[940,434],[940,496],[944,495],[947,500],[950,496],[952,498],[958,496],[959,503],[965,496],[970,499],[976,495],[983,499],[983,435]]},{"id":"e4-seat-s-27","label":"E4 · Seat S","aliases":["E4","E4 · Seat S","e4-seat-s-27","Seat S","S"],"tier":"S","points":[[206,444],[208,449],[202,451],[198,458],[199,504],[203,506],[220,505],[222,456],[215,448]]},{"id":"e3-seat-s-28","label":"E3 · Seat S","aliases":["E3","E3 · Seat S","e3-seat-s-28","Seat S","S"],"tier":"S","points":[[200,517],[199,558],[208,562],[206,563],[208,574],[211,574],[213,561],[222,556],[221,518]]},{"id":"w0-seat-p-29","label":"W0 · Seat P","aliases":["W0","W0 · Seat P","w0-seat-p-29","Seat P","P"],"tier":"P","points":[[968,502],[966,502],[963,516],[956,513],[952,515],[941,513],[941,590],[983,589],[983,514],[972,515],[968,511]]},{"id":"e9-seat-c-30","label":"E9 · Seat C","aliases":["E9","E9 · Seat C","e9-seat-c-30","Seat C","C"],"tier":"C","points":[[69,516],[70,582],[77,633],[80,637],[125,637],[126,585],[125,582],[115,580],[115,561],[125,557],[125,515]]},{"id":"e9-seat-a-31","label":"E9 · Seat A","aliases":["E9","E9 · Seat A","e9-seat-a-31","Seat A","A"],"tier":"A","points":[[126,516],[126,557],[123,562],[130,569],[125,571],[124,579],[127,585],[127,637],[185,637],[186,517]]},{"id":"w6-seat-a-32","label":"W6 · Seat A","aliases":["W6","W6 · Seat A","w6-seat-a-32","Seat A","A"],"tier":"A","points":[[1032,515],[1031,637],[1085,638],[1085,515]]},{"id":"e3-seat-p-33","label":"E3 · Seat P","aliases":["E3","E3 · Seat P","e3-seat-p-33","Seat P","P"],"tier":"P","points":[[245,516],[244,637],[279,638],[280,576],[267,578],[267,575],[271,575],[267,569],[269,563],[261,564],[266,560],[277,559],[280,569],[280,518]]},{"id":"w6-seat-c-34","label":"W6 · Seat C","aliases":["W6","W6 · Seat C","w6-seat-c-34","Seat C","C"],"tier":"C","points":[[1087,515],[1087,638],[1138,638],[1139,607],[1121,601],[1119,517]]},{"id":"standing-b-35","label":"Standing B","aliases":["Standing B","standing-b-35","Standing","STANDING","StandingB"],"tier":"STANDING","points":[[852,255],[659,255],[637,276],[638,384],[658,403],[755,404],[754,458],[658,458],[635,482],[649,701],[614,725],[614,771],[632,773],[632,817],[614,824],[615,971],[751,926],[812,868],[855,790],[866,336]]},{"id":"standing-a-36","label":"Standing A","aliases":["Standing A","standing-a-36","Standing","STANDING","StandingA"],"tier":"STANDING","points":[[360,255],[359,780],[399,856],[465,925],[601,971],[602,820],[582,818],[582,773],[602,771],[602,725],[561,706],[574,482],[551,458],[453,456],[456,404],[552,404],[574,382],[574,277],[551,255]]},{"id":"e3-seat-s-37","label":"E3 · Seat S","aliases":["E3","E3 · Seat S","e3-seat-s-37","Seat S","S"],"tier":"S","points":[[208,578],[198,583],[198,635],[218,637],[223,634],[222,582]]},{"id":"t2-seat-p-38","label":"T2 · Seat P","aliases":["T2","T2 · Seat P","t2-seat-p-38","Seat P","P"],"tier":"P","points":[[941,599],[941,679],[981,679],[982,600]]},{"id":"e2-seat-p-39","label":"E2 · Seat P","aliases":["E2","E2 · Seat P","e2-seat-p-39","Seat P","P"],"tier":"P","points":[[244,646],[246,688],[250,684],[262,684],[264,688],[272,684],[279,687],[279,646]]},{"id":"e2-seat-s-40","label":"E2 · Seat S","aliases":["E2","E2 · Seat S","e2-seat-s-40","Seat S","S"],"tier":"S","points":[[199,646],[198,686],[209,692],[222,689],[222,647]]},{"id":"e8-seat-d-41","label":"E8 · Seat D","aliases":["E8","E8 · Seat D","e8-seat-d-41","Seat D","D"],"tier":"D","points":[[80,645],[80,658],[91,703],[109,758],[112,759],[92,647]]},{"id":"w7-seat-d-42","label":"W7 · Seat D","aliases":["W7","W7 · Seat D","w7-seat-d-42","Seat D","D"],"tier":"D","points":[[1136,648],[1124,648],[1121,652],[1116,695],[1103,759],[1110,748],[1123,711],[1134,670]]},{"id":"w7-seat-c-43","label":"W7 · Seat C","aliases":["W7","W7 · Seat C","w7-seat-c-43","Seat C","C"],"tier":"C","points":[[1118,648],[1088,648],[1088,697],[1103,699],[1105,707],[1096,721],[1088,713],[1079,783],[1094,783]]},{"id":"e8-seat-c-44","label":"E8 · Seat C","aliases":["E8","E8 · Seat C","e8-seat-c-44","Seat C","C"],"tier":"C","points":[[97,645],[120,784],[137,783],[140,781],[135,718],[125,716],[122,710],[123,696],[131,694],[128,648],[126,644]]},{"id":"e8-seat-a-45","label":"E8 · Seat A","aliases":["E8","E8 · Seat A","e8-seat-a-45","Seat A","A"],"tier":"A","points":[[129,645],[131,697],[136,698],[133,702],[140,703],[144,697],[154,699],[152,712],[133,714],[138,733],[141,781],[193,771],[185,646]]},{"id":"w7-seat-a-46","label":"W7 · Seat A","aliases":["W7","W7 · Seat A","w7-seat-a-46","Seat A","A"],"tier":"A","points":[[1033,648],[1023,768],[1078,782],[1086,716],[1067,718],[1063,702],[1077,701],[1083,708],[1083,702],[1091,701],[1087,697],[1087,648]]},{"id":"e2-seat-p-47","label":"E2 · Seat P","aliases":["E2","E2 · Seat P","e2-seat-p-47","Seat P","P"],"tier":"P","points":[[280,701],[277,704],[247,705],[255,758],[285,752],[281,711],[278,704]]},{"id":"w2-seat-p-48","label":"W2 · Seat P","aliases":["W2","W2 · Seat P","w2-seat-p-48","Seat P","P"],"tier":"P","points":[[940,687],[939,720],[930,771],[932,776],[939,771],[940,776],[944,774],[944,778],[949,778],[948,771],[952,775],[963,772],[968,777],[964,778],[962,786],[969,787],[981,729],[983,688]]},{"id":"e2-seat-s-49","label":"E2 · Seat S","aliases":["E2","E2 · Seat S","e2-seat-s-49","Seat S","S"],"tier":"S","points":[[208,708],[200,711],[205,765],[212,767],[229,763],[231,758],[224,712]]},{"id":"w2-seat-s-50","label":"W2 · Seat S","aliases":["W2","W2 · Seat S","w2-seat-s-50","Seat S","S"],"tier":"S","points":[[1019,729],[992,728],[983,776],[968,822],[970,826],[986,827],[996,823],[1015,755]]},{"id":"e1-seat-s-51","label":"E1 · Seat S","aliases":["E1","E1 · Seat S","e1-seat-s-51","Seat S","S"],"tier":"S","points":[[234,772],[210,778],[223,824],[232,819],[244,820],[249,817]]},{"id":"e1-seat-p-52","label":"E1 · Seat P","aliases":["E1","E1 · Seat P","e1-seat-p-52","Seat P","P"],"tier":"P","points":[[249,768],[245,773],[256,809],[278,858],[293,879],[325,860],[327,855],[300,807],[287,761]]},{"id":"w2-seat-p-53","label":"W2 · Seat P","aliases":["W2","W2 · Seat P","w2-seat-p-53","Seat P","P"],"tier":"P","points":[[956,777],[952,777],[949,789],[945,792],[940,785],[935,791],[930,791],[929,784],[926,784],[912,820],[896,847],[903,887],[914,895],[919,893],[956,831],[954,826],[957,825],[968,789],[961,792],[953,790],[958,781]]},{"id":"w8-seat-c-54","label":"W8 · Seat C","aliases":["W8","W8 · Seat C","w8-seat-c-54","Seat C","C"],"tier":"C","points":[[1088,794],[1078,792],[1060,842],[1058,856],[1052,863],[1036,902],[1043,894],[1066,852],[1087,805]]},{"id":"e7-seat-c-55","label":"E7 · Seat C","aliases":["E7","E7 · Seat C","e7-seat-c-55","Seat C","C"],"tier":"C","points":[[125,794],[127,804],[153,855],[181,902],[195,920],[144,790]]},{"id":"e7-seat-a-56","label":"E7 · Seat A","aliases":["E7","E7 · Seat A","e7-seat-a-56","Seat A","A"],"tier":"A","points":[[146,789],[202,932],[250,905],[219,843],[199,780]]},{"id":"w8-seat-a-57","label":"W8 · Seat A","aliases":["W8","W8 · Seat A","w8-seat-a-57","Seat A","A"],"tier":"A","points":[[1076,791],[1020,779],[1003,832],[969,907],[1014,934],[1019,931],[1053,859],[1044,859],[1042,854],[1036,859],[1019,859],[1015,846],[1052,843],[1057,849]]},{"id":"e1-seat-s-58","label":"E1 · Seat S","aliases":["E1","E1 · Seat S","e1-seat-s-58","Seat S","S"],"tier":"S","points":[[230,841],[242,868],[260,897],[282,885],[258,838],[233,838]]},{"id":"w2-seat-s-59","label":"W2 · Seat S","aliases":["W2","W2 · Seat S","w2-seat-s-59","Seat S","S"],"tier":"S","points":[[982,842],[974,845],[964,844],[956,849],[940,880],[915,917],[915,923],[931,936],[935,937],[967,889],[986,850]]},{"id":"n5-seat-r-60","label":"N5 · Seat R","aliases":["N5","N5 · Seat R","n5-seat-r-60","Seat R","R"],"tier":"R","points":[[301,887],[299,892],[333,936],[360,961],[375,970],[397,939],[364,907],[360,908],[362,919],[359,922],[348,921],[349,917],[355,917],[348,913],[348,904],[359,902],[334,869]]},{"id":"n5-seat-s-61","label":"N5 · Seat S","aliases":["N5","N5 · Seat S","n5-seat-s-61","Seat S","S"],"tier":"S","points":[[285,896],[269,906],[268,911],[284,935],[298,949],[302,938],[313,939],[317,937],[317,934],[290,897]]},{"id":"n1-seat-r-62","label":"N1 · Seat R","aliases":["N1","N1 · Seat R","n1-seat-r-62","Seat R","R"],"tier":"R","points":[[879,928],[872,926],[835,927],[819,945],[845,973],[863,959],[883,938],[884,934]]},{"id":"n1-seat-s-63","label":"N1 · Seat S","aliases":["N1","N1 · Seat S","n1-seat-s-63","Seat S","S"],"tier":"S","points":[[907,929],[886,954],[895,958],[903,955],[906,958],[906,966],[911,967],[925,951],[928,943],[914,931]]},{"id":"n5-seat-s-64","label":"N5 · Seat S","aliases":["N5","N5 · Seat S","n5-seat-s-64","Seat S","S"],"tier":"S","points":[[305,957],[311,967],[348,1001],[351,1001],[366,982],[336,954],[320,958],[319,956]]},{"id":"n11-seat-b-65","label":"N11 · Seat B","aliases":["N11","N11 · Seat B","n11-seat-b-65","Seat B","B"],"tier":"B","points":[[212,940],[214,951],[248,997],[277,1027],[302,1048],[311,1051],[341,1014],[341,1009],[299,970],[259,916],[254,914]]},{"id":"n1-seat-s-66","label":"N1 · Seat S","aliases":["N1","N1 · Seat S","n1-seat-s-66","Seat S","S"],"tier":"S","points":[[900,976],[897,973],[878,972],[872,966],[853,982],[853,986],[868,1003],[871,1003],[895,984]]},{"id":"n6-seat-b-67","label":"N6 · Seat B","aliases":["N6","N6 · Seat B","n6-seat-b-67","Seat B","B"],"tier":"B","points":[[967,915],[963,916],[923,969],[877,1011],[912,1055],[961,1010],[1010,945],[1008,940]]},{"id":"n4-seat-r-68","label":"N4 · Seat R","aliases":["N4","N4 · Seat R","n4-seat-r-68","Seat R","R"],"tier":"R","points":[[405,950],[383,980],[426,1011],[482,1037],[496,998],[454,980],[411,951]]},{"id":"n2-seat-r-69","label":"N2 · Seat R","aliases":["N2","N2 · Seat R","n2-seat-r-69","Seat R","R"],"tier":"R","points":[[835,981],[815,957],[807,953],[773,976],[726,997],[737,1034],[754,1030],[797,1010],[835,985]]},{"id":"n4-seat-s-70","label":"N4 · Seat S","aliases":["N4","N4 · Seat S","n4-seat-s-70","Seat S","S"],"tier":"S","points":[[358,1008],[364,1016],[397,1038],[401,1037],[404,1024],[422,1025],[420,1020],[377,990],[373,990]]},{"id":"n2-seat-s-71","label":"N2 · Seat S","aliases":["N2","N2 · Seat S","n2-seat-s-71","Seat S","S"],"tier":"S","points":[[861,1012],[845,993],[841,993],[796,1022],[796,1026],[815,1024],[820,1028],[816,1038],[822,1040],[857,1018]]},{"id":"n3-seat-r-72","label":"N3 · Seat R","aliases":["N3","N3 · Seat R","n3-seat-r-72","Seat R","R"],"tier":"R","points":[[728,1036],[715,1001],[667,1013],[613,1018],[547,1013],[506,1002],[492,1040],[566,1057],[629,1059],[694,1050],[726,1041]]},{"id":"n2-seat-s-73","label":"N2 · Seat S","aliases":["N2","N2 · Seat S","n2-seat-s-73","Seat S","S"],"tier":"S","points":[[809,1044],[788,1042],[785,1030],[779,1030],[744,1045],[743,1049],[749,1069],[753,1071],[807,1049]]},{"id":"n4-seat-s-74","label":"N4 · Seat S","aliases":["N4","N4 · Seat S","n4-seat-s-74","Seat S","S"],"tier":"S","points":[[410,1043],[411,1046],[432,1057],[465,1070],[471,1070],[478,1052],[478,1047],[439,1030],[435,1031],[435,1037],[431,1042],[420,1040]]},{"id":"n3-seat-s-75","label":"N3 · Seat S","aliases":["N3","N3 · Seat S","n3-seat-s-75","Seat S","S"],"tier":"S","points":[[741,1070],[732,1049],[630,1069],[554,1065],[488,1051],[479,1075],[547,1093],[622,1099],[693,1090],[738,1077]]},{"id":"n10-seat-b-76","label":"N10 · Seat B","aliases":["N10","N10 · Seat B","n10-seat-b-76","Seat B","B"],"tier":"B","points":[[349,1020],[320,1055],[318,1062],[380,1106],[447,1135],[465,1083],[400,1052]]},{"id":"n7-seat-b-77","label":"N7 · Seat B","aliases":["N7","N7 · Seat B","n7-seat-b-77","Seat B","B"],"tier":"B","points":[[905,1063],[874,1026],[866,1022],[822,1053],[755,1082],[773,1132],[778,1134],[855,1100],[893,1075]]},{"id":"n9-seat-b-78","label":"N9 · Seat B","aliases":["N9","N9 · Seat B","n9-seat-b-78","Seat B","B"],"tier":"B","points":[[457,1134],[458,1139],[525,1158],[600,1167],[610,1165],[609,1107],[544,1103],[477,1086]]},{"id":"n8-seat-b-79","label":"N8 · Seat B","aliases":["N8","N8 · Seat B","n8-seat-b-79","Seat B","B"],"tier":"B","points":[[745,1088],[678,1104],[621,1107],[620,1165],[692,1160],[762,1140]]}];

function createWeekndGoyangTemplateZones(targetSize = WEEKND_GOYANG_SEATMAP_SIZE) {
  return createTemplateZones(WEEKND_GOYANG_TEMPLATE_ZONES, WEEKND_GOYANG_SEATMAP_SIZE, targetSize);
}

const EXO_ENCORE_SEATMAP_SIZE = { width: 980, height: 854 };
const EXO_ENCORE_TEMPLATE_ZONES = [{"id":"we-general","label":"we · General Seats","aliases":["we","we · General Seats","we-general","General Seats","GENERAL","we区","General"],"tier":"GENERAL","points":[[263,230],[416,231],[433,202],[271,200]]},{"id":"we-vip","label":"we · VIP Seats","aliases":["we","we · VIP Seats","we-vip","VIP Seats","VIP","we区"],"tier":"VIP","points":[[273,193],[431,198],[443,178],[430,168],[286,168]]},{"id":"are-general","label":"are · General Seats","aliases":["are","are · General Seats","are-general","General Seats","GENERAL","are区","General"],"tier":"GENERAL","points":[[709,229],[699,199],[538,203],[555,231]]},{"id":"are-vip","label":"are · VIP Seats","aliases":["are","are · VIP Seats","are-vip","VIP Seats","VIP","are区"],"tier":"VIP","points":[[527,181],[539,198],[697,195],[687,168],[542,168]]},{"id":"one-general","label":"one · General Seats","aliases":["one","one · General Seats","one-general","General Seats","GENERAL","one区","General"],"tier":"GENERAL","points":[[451,413],[449,347],[313,351],[362,414]]},{"id":"one-vip","label":"one · VIP Seats","aliases":["one","one · VIP Seats","one-vip","VIP Seats","VIP","one区"],"tier":"VIP","points":[[297,305],[313,346],[447,343],[417,291],[310,291]]},{"id":"exo-general","label":"EXO · General Seats","aliases":["EXO","EXO · General Seats","exo-general","General Seats","GENERAL","EXO区","General"],"tier":"GENERAL","points":[[520,412],[610,414],[659,350],[574,356],[570,349],[522,347]]},{"id":"exo-vip","label":"EXO · VIP Seats","aliases":["EXO","EXO · VIP Seats","exo-vip","VIP Seats","VIP","EXO区"],"tier":"VIP","points":[[524,342],[655,346],[675,305],[662,291],[560,291]]},{"id":"1-general","label":"1","aliases":["1","1-general","General Seats","GENERAL","1区","General"],"tier":"GENERAL","points":[[793,130],[719,164],[735,214],[815,196]]},{"id":"2-general","label":"2","aliases":["2","2-general","General Seats","GENERAL","2区","General"],"tier":"GENERAL","points":[[819,211],[740,222],[739,273],[822,280]]},{"id":"3-general","label":"3","aliases":["3","3-general","General Seats","GENERAL","3区","General"],"tier":"GENERAL","points":[[740,289],[731,335],[735,341],[797,361],[813,358],[823,313],[821,292]]},{"id":"4-general","label":"4","aliases":["4","4-general","General Seats","GENERAL","4区","General"],"tier":"GENERAL","points":[[727,350],[709,392],[783,431],[806,374]]},{"id":"5-vip","label":"5","aliases":["5","5-vip","VIP Seats","VIP","5区"],"tier":"VIP","points":[[672,445],[640,474],[681,535],[690,538],[730,503],[730,495]]},{"id":"6-vip","label":"6","aliases":["6","6-vip","VIP Seats","VIP","6区"],"tier":"VIP","points":[[631,482],[587,503],[612,573],[619,578],[674,548]]},{"id":"7-vip","label":"7","aliases":["7","7-vip","VIP Seats","VIP","7区"],"tier":"VIP","points":[[574,508],[525,521],[538,600],[602,584]]},{"id":"8-vip","label":"8","aliases":["8","8-vip","VIP Seats","VIP","8区"],"tier":"VIP","points":[[463,522],[452,599],[482,610],[450,617],[487,631],[520,623],[521,613],[492,610],[522,599],[513,524]]},{"id":"9-vip","label":"9","aliases":["9","9-vip","VIP Seats","VIP","9区"],"tier":"VIP","points":[[402,510],[374,577],[401,598],[374,595],[369,603],[398,618],[433,620],[434,610],[409,599],[441,598],[450,522]]},{"id":"10-vip","label":"10","aliases":["10","10-vip","VIP Seats","VIP","10区"],"tier":"VIP","points":[[345,482],[303,540],[303,549],[360,578],[389,503]]},{"id":"11-vip","label":"11","aliases":["11","11-vip","VIP Seats","VIP","11区"],"tier":"VIP","points":[[302,441],[241,489],[246,504],[286,538],[295,534],[335,477]]},{"id":"12-general","label":"12","aliases":["12","12-general","General Seats","GENERAL","12区","General"],"tier":"GENERAL","points":[[249,352],[170,373],[175,398],[194,433],[265,393]]},{"id":"13-general","label":"13","aliases":["13","13-general","General Seats","GENERAL","13区","General"],"tier":"GENERAL","points":[[234,288],[153,294],[166,362],[243,338]]},{"id":"14-general","label":"14","aliases":["14","14-general","General Seats","GENERAL","14区","General"],"tier":"GENERAL","points":[[156,211],[154,281],[235,275],[239,229],[234,223]]},{"id":"15-general","label":"15","aliases":["15","15-general","General Seats","GENERAL","15区","General"],"tier":"GENERAL","points":[[182,130],[160,196],[240,214],[256,165]]},{"id":"24-general","label":"24","aliases":["24","24-general","General Seats","GENERAL","24区","General"],"tier":"GENERAL","points":[[926,96],[830,134],[846,192],[948,172]]},{"id":"25-general","label":"25","aliases":["25","25-general","General Seats","GENERAL","25区","General"],"tier":"GENERAL","points":[[951,185],[850,204],[855,263],[957,263]]},{"id":"26-general","label":"26","aliases":["26","26-general","General Seats","GENERAL","26区","General"],"tier":"GENERAL","points":[[854,278],[850,337],[952,353],[961,290],[956,275]]},{"id":"27-general","label":"27","aliases":["27","27-general","General Seats","GENERAL","27区","General"],"tier":"GENERAL","points":[[847,348],[830,406],[926,444],[948,367]]},{"id":"28-general","label":"28","aliases":["28","28-general","General Seats","GENERAL","28区","General"],"tier":"GENERAL","points":[[824,417],[798,470],[883,526],[919,456]]},{"id":"29-general","label":"29","aliases":["29","29-general","General Seats","GENERAL","29区","General"],"tier":"GENERAL","points":[[789,480],[755,528],[828,597],[875,536]]},{"id":"30-general","label":"30","aliases":["30","30-general","General Seats","GENERAL","30区","General"],"tier":"GENERAL","points":[[742,533],[699,575],[752,653],[761,655],[818,604]]},{"id":"31-general","label":"31","aliases":["31","31-general","General Seats","GENERAL","31区","General"],"tier":"GENERAL","points":[[689,578],[635,611],[677,701],[745,665]]},{"id":"32-general","label":"32","aliases":["32","32-general","General Seats","GENERAL","32区","General"],"tier":"GENERAL","points":[[624,611],[565,632],[586,724],[617,724],[664,705]]},{"id":"33-general","label":"33","aliases":["33","33-general","General Seats","GENERAL","33区","General"],"tier":"GENERAL","points":[[553,630],[496,637],[495,724],[575,723]]},{"id":"34-general","label":"34","aliases":["34","34-general","General Seats","GENERAL","34区","General"],"tier":"GENERAL","points":[[428,630],[405,723],[484,724],[485,639]]},{"id":"35-general","label":"35","aliases":["35","35-general","General Seats","GENERAL","35区","General"],"tier":"GENERAL","points":[[356,612],[317,709],[360,724],[395,724],[413,630]]},{"id":"36-general","label":"36","aliases":["36","36-general","General Seats","GENERAL","36区","General"],"tier":"GENERAL","points":[[293,553],[288,563],[312,586],[288,581],[234,664],[304,703],[343,613],[317,591],[354,598],[357,588]]},{"id":"37-general","label":"37","aliases":["37","37-general","General Seats","GENERAL","37区","General"],"tier":"GENERAL","points":[[236,535],[162,605],[219,657],[280,576]]},{"id":"38-general","label":"38","aliases":["38","38-general","General Seats","GENERAL","38区","General"],"tier":"GENERAL","points":[[188,481],[104,535],[151,598],[224,527]]},{"id":"39-general","label":"39","aliases":["39","39-general","General Seats","GENERAL","39区","General"],"tier":"GENERAL","points":[[154,418],[58,456],[93,526],[180,472]]},{"id":"40-general","label":"40","aliases":["40","40-general","General Seats","GENERAL","40区","General"],"tier":"GENERAL","points":[[131,349],[29,369],[52,445],[147,406]]},{"id":"41-general","label":"41","aliases":["41","41-general","General Seats","GENERAL","41区","General"],"tier":"GENERAL","points":[[17,279],[26,356],[127,337],[123,278]]},{"id":"42-general","label":"42","aliases":["42","42-general","General Seats","GENERAL","42区","General"],"tier":"GENERAL","points":[[26,186],[20,263],[124,262],[128,203]]},{"id":"43-general","label":"43","aliases":["43","43-general","General Seats","GENERAL","43区","General"],"tier":"GENERAL","points":[[52,95],[29,171],[129,192],[146,132]]}];

function createExoEncoreTemplateZones(targetSize = EXO_ENCORE_SEATMAP_SIZE) {
  return createTemplateZones(EXO_ENCORE_TEMPLATE_ZONES, EXO_ENCORE_SEATMAP_SIZE, targetSize);
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
    id: "nct-dream-10th-fm",
    name: "地租十周年FM",
    artist: "NCT DREAM",
    city: "",
    location: "待填写城市 · 待填写场馆",
    dates: "待定",
    dateOptions: [{ id: "nct-dream-10th-fm-tbd", label: "待定", aliases: ["待定"] }],
    venue: "待填写场馆",
    venueLocal: "",
    seatmapTitle: "地租十周年FM 官方座位图",
    seatmapImage: "assets/nct-dream-10th-fm-seatmap.jpg",
    seatmapFileName: "nct-dream-10th-fm-seatmap.jpg",
    seatmapSize: { width: 1206, height: 1226 },
    seatmapTemplateId: "builtin-nct-dream-10th-fm",
    zones: [],
    tables: [],
  },
  {
    id: "weeknd-goyang",
    name: "盆栽高阳",
    artist: "The Weeknd",
    city: "高阳",
    location: "韩国高阳 · 待填写场馆",
    dates: "待定",
    dateOptions: [{ id: "weeknd-goyang-tbd", label: "待定", aliases: ["待定"] }],
    venue: "待填写场馆",
    venueLocal: "",
    seatmapTitle: "盆栽高阳官方座位图",
    seatmapImage: "assets/weeknd-goyang-seatmap.jpg",
    seatmapFileName: "weeknd-goyang-seatmap.jpg",
    seatmapSize: { width: 1193, height: 1590 },
    seatmapTemplateId: "builtin-weeknd-goyang",
    zones: createWeekndGoyangTemplateZones(),
    tables: [],
  },
  {
    id: "exo-encore",
    name: "EXO 安可",
    artist: "EXO",
    city: "待填写城市",
    location: "待填写城市 · 待填写场馆",
    dates: "待定",
    dateOptions: [{ id: "exo-encore-tbd", label: "待定", aliases: ["待定"] }],
    venue: "待填写场馆",
    venueLocal: "",
    seatmapTitle: "EXO 安可官方座位图",
    seatmapImage: "assets/exo-encore-seatmap.jpg",
    seatmapFileName: "exo-encore-seatmap.jpg",
    seatmapSize: { width: 980, height: 854 },
    seatmapTemplateId: "builtin-exo-encore",
    zones: createExoEncoreTemplateZones(),
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
    seatmapImage: "assets/bigbang-goyang-seatmap.jpg",
    seatmapFileName: "bigbang-goyang-seatmap.jpg",
    seatmapSize: { width: 1206, height: 1679 },
    seatmapTemplateId: "builtin-bigbang-goyang",
    zones: [],
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
  {
    id: "bigbang-singapore",
    name: "BIGBANG 新加坡",
    artist: "BIGBANG",
    city: "新加坡",
    location: "新加坡 · National Stadium",
    dates: "2026.10.17",
    dateOptions: [
      { id: "20261017", label: "10月17日", aliases: ["10.17", "10月17日", "20261017", "2026-10-17", "2026.10.17"] },
    ],
    venue: "National Stadium",
    venueLocal: "National Stadium",
    seatmapTitle: "BIGBANG 新加坡官方座位图",
    seatmapImage: "assets/bigbang-singapore-seatmap.jpg",
    seatmapFileName: "bigbang-singapore-seatmap.jpg",
    seatmapSize: { width: 1206, height: 1181 },
    seatmapTemplateId: "builtin-bigbang-singapore",
    zones: [],
    tables: [],
  },
];

let currentEvent = events[0];
let searchTerm = "";
let eventSearchTerm = "";
let eventPickerOpen = false;
let selectedDateId = null;
let sortMode = "recommended";
let selectedZone = null;
let hoveredZone = null;
let seatmapPixelSampler = null;
let seatmapHotspotVisible = false;
let seatmapEditingZoneId = "";
let seatmapEditDraftPolygon = null;
let seatmapEditDragging = null;

const customerView = document.querySelector("#customerView");
const adminView = document.querySelector("#adminView");
const modeButtons = document.querySelectorAll("[data-mode]");
const modeShortcuts = document.querySelectorAll("[data-mode-shortcut]");
const eventList = document.querySelector("#eventList");
const eventSearchInput = document.querySelector("#eventSearchInput");
const eventPickerToggle = document.querySelector("#eventPickerToggle");
const eventPickerMeta = document.querySelector("#eventPickerMeta");
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
const operationArchiveCount = document.querySelector("#operationArchiveCount");
const operationArchiveList = document.querySelector("#operationArchiveList");
const createOperationArchiveButton = document.querySelector("#createOperationArchiveButton");
const clearOperationArchivesButton = document.querySelector("#clearOperationArchivesButton");
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
const publishReadyButton = document.querySelector("#publishReadyButton");
const showManualReviewButton = document.querySelector("#showManualReviewButton");
const clearPendingButton = document.querySelector("#clearPendingButton");
const clearPublishedButton = document.querySelector("#clearPublishedButton");
const toggleNewEventForm = document.querySelector("#toggleNewEventForm");
const deleteCurrentEventButton = document.querySelector("#deleteCurrentEventButton");
const newEventForm = document.querySelector("#newEventForm");
const newEventArtist = document.querySelector("#newEventArtist");
const newEventCity = document.querySelector("#newEventCity");
const newEventVenue = document.querySelector("#newEventVenue");
const newEventName = document.querySelector("#newEventName");
const newEventDates = document.querySelector("#newEventDates");
const eventArtistHistory = document.querySelector("#eventArtistHistory");
const eventCityHistory = document.querySelector("#eventCityHistory");
const eventVenueHistory = document.querySelector("#eventVenueHistory");
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
const localSaveStatus = document.querySelector("#localSaveStatus");
const failedOcrPanel = document.querySelector("#failedOcrPanel");
const failedOcrSummary = document.querySelector("#failedOcrSummary");
const failedOcrList = document.querySelector("#failedOcrList");
const failedOcrData = document.querySelector("#failedOcrData");
const retryFailedOcrButton = document.querySelector("#retryFailedOcrButton");
const copyFailedOcrButton = document.querySelector("#copyFailedOcrButton");
const fieldMappingPanel = document.querySelector("#fieldMappingPanel");
const fieldMappingTitle = document.querySelector("#fieldMappingTitle");
const fieldMappingSummary = document.querySelector("#fieldMappingSummary");
const fieldMappingTable = document.querySelector("#fieldMappingTable");
const fieldMappingStatus = document.querySelector("#fieldMappingStatus");
const confirmFieldMappingButton = document.querySelector("#confirmFieldMappingButton");
const cancelFieldMappingButton = document.querySelector("#cancelFieldMappingButton");
const uploadRecords = document.querySelector("#uploadRecords");
const publishUploadButton = document.querySelector("#publishUploadButton");
const quickManualUploadButton = document.querySelector("#quickManualUploadButton");
const saveOcrTextButton = document.querySelector("#saveOcrTextButton");
const clearGeneratedPendingButton = document.querySelector("#clearGeneratedPendingButton");
const clearOcrTextButton = document.querySelector("#clearOcrTextButton");
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
const OPERATION_ARCHIVE_KEY = "ticket-admin-operation-archives-v1";
const APP_STATE_BACKUP_DB = "ticket-admin-state-backup-v1";
const APP_STATE_BACKUP_STORE = "state";
const APP_STATE_BACKUP_KEY = "latest";
const MAX_OPERATION_ARCHIVES = 12;
const MAX_OPERATION_ARCHIVE_PENDING_TABLES = 80;
const MAX_OPERATION_ARCHIVE_STORAGE_CHARS = 6 * 1024 * 1024;
const MAX_UPLOAD_DRAFT_STORAGE_CHARS = 240 * 1024;
let eventDraftHistory = { artists: [], cities: [], venues: [] };
let operationArchives = [];
let manualReviewOnly = false;
let pendingReviewFocusRowIndex = null;
let reviewAiBusy = false;
const editingReviewRows = new Set();
let fieldMappingTemplates = [];
let fieldMappingDraft = null;
let markingZones = [];
let markingIndex = 0;
let isMarkingZones = false;
let scannedRegions = [];
let aiStatus = null;
let activeTicketOcrJobId = null;
let activeTicketOcrPollTimer = null;
let activeTicketOcrPollInFlight = false;
let lastTicketOcrJobSnapshot = null;
let autoPendingGenerationJobId = null;
let uploadPendingGenerationBusy = false;
let quickManualGenerationBusy = false;
let seatmapTemplates = [];
let externalSeatmapTemplates = [];
let templateLibraryOpen = false;
let seatmapUploadRunId = 0;
let pendingTablesNormalizeCacheKey = "";
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
  return String(value).toLowerCase().replace(/[\s/\\（）()·.-]+/g, "");
}

function rowMatches(row, term) {
  if (!term) return true;
  const normalizedTerm = normalize(term);
  return row.some((cell) => normalize(cell).includes(normalizedTerm));
}

function splitTableLine(line) {
  if (line.includes("\t")) return line.split("\t");
  if (line.includes(",")) return line.split(",");
  const trimmed = line.trim();
  const wideSplit = trimmed.split(/\s{2,}/);
  if (wideSplit.length > 1) return wideSplit;
  const trailingPriceMatch = trimmed.match(/^(.+?)\s+([￥¥$₩]?\s*\d{3,6}(?:[,.]\d{3})?(?:\s*(?:cny|rmb|원))?)$/i);
  if (trailingPriceMatch) return [trailingPriceMatch[1].trim(), trailingPriceMatch[2].trim()];
  return [trimmed];
}

function extendColumnsForOverflowRows(columns, rows) {
  if (!Array.isArray(columns) || !Array.isArray(rows) || !rows.length) return false;
  const maxCellCount = Math.max(columns.length, ...rows.map((row) => row.length));
  if (maxCellCount <= columns.length) return false;
  const extraCount = maxCellCount - columns.length;
  const lastColumn = columns[columns.length - 1] || "";
  const extraColumns = Array.from({ length: extraCount }, (_, index) => (index === 0 ? "备注" : `备注${index + 1}`));
  if (isSalePriceColumnName(lastColumn)) {
    columns.splice(Math.max(0, columns.length - 1), 0, ...extraColumns);
  } else {
    columns.push(...extraColumns);
  }
  return true;
}

function looksLikeTicketDataCells(cells = []) {
  const values = cells.map((cell) => String(cell || "").trim()).filter(Boolean);
  if (values.length < 2) return false;
  if (isNonTicketFooterCells(values)) return false;
  if (looksLikeRecognizedTableHeader(values.join("\t"))) return false;
  const dateLike = values.filter(isLikelyDateValue).length;
  const priceLike = values.filter((value) => isLikelySalePriceValue(value, { minPrice: 100 })).length;
  const compositeLike = values.filter((value) => parseCompositeSeatInfo(value)).length;
  const zoneLike = values.filter((value) => extractZoneTokenFromText(value)).length;
  return priceLike >= 1 && (dateLike >= 1 || compositeLike >= 1 || zoneLike >= 1);
}

function isNonTicketFooterText(value = "") {
  const text = normalize(String(value || ""));
  if (!text) return false;
  return /下单后|下单不退|售出不退|售出后不退|不退不换|不退换|延期不退|延期只退|演出延期|演出取消|取消退票面|仅退票面|只退票面|退票面|画面价|票面价|顺丰到付|连坐可拆|出售不退|售出票面|保留订单|包含理售后|不包zone/.test(text);
}

function isNonTicketFooterCells(cells = [], columns = []) {
  const values = cells.map((cell) => String(cell || "").trim()).filter(Boolean);
  if (!values.length) return false;
  const joined = values.join(" ");
  if (!isNonTicketFooterText(joined)) return false;
  const hasPrice = values.some((value) => isLikelySalePriceValue(value, { minPrice: 100 }));
  if (hasPrice) return false;
  const hasDate = values.some(isLikelyDateValue);
  const hasSeatInfo = values.some((value) => {
    const parsed = parseCompositeSeatInfo(value);
    return Boolean(parsed?.zone || parsed?.row || parsed?.seat || extractZoneTokenFromText(value));
  });
  const meaningfulValues = values.filter((value, index) => {
    const column = columns[index] || "";
    if (isNonTicketFooterText(value)) return false;
    if (isQuantityColumnName(column) && /^1$/.test(value)) return false;
    return !/^[\-/|]+$/.test(value);
  });
  if (!hasDate && !hasSeatInfo) return true;
  if (meaningfulValues.length <= 1 && values.length <= 3) return true;
  const footerTextLength = values.filter(isNonTicketFooterText).join("").length;
  const allTextLength = values.join("").length || 1;
  return footerTextLength / allTextLength >= 0.65 && meaningfulValues.length <= 2;
}

function inferColumnsForHeaderlessRows(rows = []) {
  const maxCellCount = Math.max(0, ...rows.map((row) => row.length));
  if (!maxCellCount) return [];
  const columns = Array.from({ length: maxCellCount }, (_, index) => `第${index + 1}列`);
  const priceIndex = columns.length - 1;
  columns[priceIndex] = "售价";
  if (columns.length === 2) {
    columns[0] = "位置";
    return columns;
  }
  const sampleValues = (columnIndex) => rows.map((row) => row[columnIndex]).filter((value) => String(value || "").trim());
  for (let index = 0; index < columns.length - 1; index += 1) {
    const values = sampleValues(index);
    if (!values.length) continue;
    if (values.some(isLikelyDateValue)) columns[index] = "日期";
    else if (values.some((value) => extractZoneTokenFromText(value))) columns[index] = "区域";
    else if (values.some((value) => parseCompositeSeatInfo(value))) columns[index] = "位置";
  }
  return columns;
}

function addRecognizedColumnIfMissing(targetColumns, rows, column) {
  const label = String(column || "").trim();
  if (!label || !isStrongRecognizedHeaderName(label)) return false;
  if (getRecognizedColumnTargetIndex(targetColumns, label) >= 0) return false;
  targetColumns.push(label);
  rows.forEach((row) => row.push(""));
  return true;
}

function mapRecognizedRowToColumns(row, sourceColumns, targetColumns) {
  if (!Array.isArray(row)) return [];
  const mapped = Array.from({ length: targetColumns.length }, () => "");
  if (!Array.isArray(sourceColumns) || !sourceColumns.length) {
    return adaptRowsToColumns([row], targetColumns)[0] || mapped;
  }
  const compactMapped = alignCompactTicketRowToColumns(row, targetColumns);
  if (compactMapped) return compactMapped;

  const usedIndexes = new Set();
  sourceColumns.forEach((column, columnIndex) => {
    const value = String(row[columnIndex] || "").trim();
    if (!value) return;
    const targetIndex = getRecognizedColumnTargetIndex(targetColumns, column, usedIndexes);
    if (targetIndex < 0) return;
    const field = getDefaultFieldForHeader(targetColumns[targetIndex]) || targetColumns[targetIndex];
    mapped[targetIndex] = mergeCanonicalCellValue(field, mapped[targetIndex], value);
    usedIndexes.add(targetIndex);
  });

  row.slice(sourceColumns.length).forEach((value) => {
    const text = String(value || "").trim();
    if (!text) return;
    const emptyIndex = mapped.findIndex((item, index) => !usedIndexes.has(index) && !String(item || "").trim());
    if (emptyIndex >= 0) {
      mapped[emptyIndex] = text;
    } else {
      mapped.push(text);
    }
  });
  return mapped;
}

function findFirstColumnIndexByField(columns = [], field = "") {
  return columns.findIndex((column) => getDefaultFieldForHeader(column) === field);
}

function findFirstColumnIndexByPredicate(columns = [], predicate) {
  return columns.findIndex((column) => predicate(column));
}

function putMappedCell(mapped, index, value, field = "") {
  if (index < 0 || !String(value || "").trim()) return false;
  const current = String(mapped[index] || "").trim();
  const incoming = String(value || "").trim();
  mapped[index] = field ? mergeCanonicalCellValue(field, current, incoming) : current || incoming;
  return true;
}

function alignCompactTicketRowToColumns(row, columns) {
  if (!Array.isArray(row) || !Array.isArray(columns) || row.length >= columns.length || row.length < 3) return null;
  const values = row.map((cell) => String(cell || "").trim()).filter(Boolean);
  if (values.length < 3) return null;
  const lastValue = values[values.length - 1];
  if (!hasPriceOrSoldValue(lastValue)) return null;
  const priceIndex = findPreferredSalePriceColumnIndexes(columns)[0] ?? findFirstColumnIndexByField(columns, "售价");
  if (priceIndex < 0) return null;

  const mapped = Array.from({ length: columns.length }, () => "");
  putMappedCell(mapped, priceIndex, lastValue, "售价");

  const serialIndex = findFirstColumnIndexByField(columns, "序号");
  const dateIndex = findFirstColumnIndexByField(columns, "日期");
  const zoneIndex = findFirstColumnIndexByField(columns, "区域");
  const faceIndex = findFirstColumnIndexByField(columns, "票面");
  const rowIndex = findFirstColumnIndexByField(columns, "排");
  const seatIndex = findFirstColumnIndexByField(columns, "座位号");
  const quantityIndex = findQuantityColumnIndex(columns);
  const remarkIndex = findFirstColumnIndexByPredicate(columns, isRemarkColumnName);
  const deliveryIndex = findFirstColumnIndexByPredicate(columns, isDeliveryColumnName);

  const rest = values.slice(0, -1);
  let cursor = 0;
  const nextAfterSerial = rest[cursor + 1] || "";
  const serialIsFollowedByDate = isLikelyDateValue(nextAfterSerial) || isLikelyDateColumnValue(nextAfterSerial);
  if (serialIndex >= 0 && rest.length - cursor >= 2 && isLikelySerialValue(rest[cursor]) && (serialIsFollowedByDate || rest.length - cursor >= 4)) {
    putMappedCell(mapped, serialIndex, rest[cursor], "序号");
    cursor += 1;
  }
  if (dateIndex >= 0 && rest[cursor] && (isLikelyDateValue(rest[cursor]) || isLikelyDateColumnValue(rest[cursor]))) {
    putMappedCell(mapped, dateIndex, rest[cursor], "日期");
    cursor += 1;
  }

  const remaining = rest.slice(cursor);
  if (remaining.length === 1) {
    const onlyValue = remaining[0];
    if (faceIndex >= 0 && isLikelyFaceValue(onlyValue)) {
      putMappedCell(mapped, faceIndex, onlyValue, "票面");
      return mapped;
    }
    const onlyComposite = parseCompositeSeatInfo(onlyValue);
    if (onlyComposite && zoneIndex >= 0) {
      putMappedCell(mapped, zoneIndex, onlyValue, "区域");
      return mapped;
    }
    if (remarkIndex >= 0 && (isStandaloneLogisticsValue(onlyValue) || isLikelyRemarkValue(onlyValue))) {
      putMappedCell(mapped, remarkIndex, onlyValue, getDefaultFieldForHeader(columns[remarkIndex]));
      return mapped;
    }
  }
  if (remaining.length === 2 && faceIndex >= 0) {
    const faceValueIndex = remaining.findIndex((value) => isLikelyFaceValue(value));
    const locationValueIndex = remaining.findIndex((value, index) => index !== faceValueIndex && Boolean(parseCompositeSeatInfo(value)));
    if (faceValueIndex >= 0 && locationValueIndex >= 0) {
      putMappedCell(mapped, faceIndex, remaining[faceValueIndex], "票面");
      if (zoneIndex >= 0) putMappedCell(mapped, zoneIndex, remaining[locationValueIndex], "区域");
      return mapped;
    }
  }
  if (remaining.length < 2) return null;
  const structuralCount = remaining.filter((value) => {
    return (
      parseCompositeSeatInfo(value) ||
      extractZoneTokenFromText(value) ||
      isLikelyZoneCode(value) ||
      extractSeatRowFromText(value, { allowBareRange: true }) ||
      isLikelySeatRowValue(value) ||
      extractSeatNumberFromText(value, { allowBareRange: true }) ||
      isLikelySeatNumberValue(value) ||
      isStandaloneLogisticsValue(value) ||
      isLikelyRemarkValue(value)
    );
  }).length;
  if (structuralCount < Math.min(2, remaining.length)) return null;

  const used = new Set();
  remaining.forEach((value, index) => {
    if (!value) return;
    if (!used.has("delivery") && deliveryIndex >= 0 && isStandaloneLogisticsValue(value)) {
      putMappedCell(mapped, deliveryIndex, value, getDefaultFieldForHeader(columns[deliveryIndex]));
      used.add("delivery");
      return;
    }
    if (!used.has("zone") && zoneIndex >= 0 && (extractZoneTokenFromText(value) || isLikelyZoneCode(value) || index === 0)) {
      putMappedCell(mapped, zoneIndex, value, "区域");
      used.add("zone");
      return;
    }
    if (!used.has("row") && rowIndex >= 0) {
      putMappedCell(mapped, rowIndex, value, "排");
      used.add("row");
      return;
    }
    if (!used.has("seat") && seatIndex >= 0) {
      putMappedCell(mapped, seatIndex, value, "座位号");
      used.add("seat");
      return;
    }
    if (!used.has("quantity") && quantityIndex >= 0 && isLikelySeatCountValue(value)) {
      putMappedCell(mapped, quantityIndex, value, "数量");
      used.add("quantity");
      return;
    }
    if (remarkIndex >= 0) putMappedCell(mapped, remarkIndex, value, getDefaultFieldForHeader(columns[remarkIndex]));
  });

  if (!mapped[zoneIndex] && zoneIndex >= 0 && remaining.length >= 3) putMappedCell(mapped, zoneIndex, remaining[0], "区域");
  if (!mapped[rowIndex] && rowIndex >= 0 && remaining.length >= 2) putMappedCell(mapped, rowIndex, remaining[1], "排");
  if (!mapped[seatIndex] && seatIndex >= 0 && remaining.length >= 3) putMappedCell(mapped, seatIndex, remaining[2], "座位号");
  return mapped;
}

function parseTableText(text) {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  if (lines.length < 2) return null;
  const headerIndex = lines.findIndex((line) => looksLikeRecognizedTableHeader(line));
  const firstDataIndex = lines.findIndex((line) => looksLikeTicketDataCells(splitTableLine(line).map((cell) => cell.trim())));
  const firstLineIsData = headerIndex < 0 && firstDataIndex >= 0;

  if (firstLineIsData) {
    const dataStartIndex = Math.max(firstDataIndex, 0);
    const rows = lines
      .slice(dataStartIndex)
      .filter((line) => !looksLikeRecognizedTableHeader(line))
      .map((line) => splitTableLine(line).map((cell) => cell.trim()))
      .filter((row) => row.some(Boolean) && !isNonTicketFooterCells(row));
    const columns = inferColumnsForHeaderlessRows(rows);
    extendColumnsForOverflowRows(columns, rows);
    if (!columns.some(Boolean) || !rows.length) return null;
    return { columns, rows, headerless: true };
  }

  if (headerIndex < 0) return null;
  const columns = splitTableLine(lines[headerIndex]).map((cell) => cell.trim());
  let activeColumns = [...columns];
  const rows = [];

  lines.slice(headerIndex + 1).forEach((line) => {
    if (looksLikeRecognizedTableHeader(line)) {
      activeColumns = splitTableLine(line).map((cell) => cell.trim());
      activeColumns.forEach((column) => addRecognizedColumnIfMissing(columns, rows, column));
      return;
    }
    const row = splitTableLine(line).map((cell) => cell.trim());
    if (!row.some(Boolean) || isNonTicketFooterCells(row, activeColumns)) return;
    rows.push(mapRecognizedRowToColumns(row, activeColumns, columns));
  });

  extendColumnsForOverflowRows(columns, rows);
  if (!columns.some(Boolean) || !rows.length) return null;
  return { columns, rows, headerless: false };
}

function parseContinuationRows(text, columns) {
  const lines = String(text || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  if (!lines.length || !Array.isArray(columns) || !columns.length) return [];
  return lines
    .filter((line) => !looksLikeRecognizedTableHeader(line))
    .map((line) => splitTableLine(line).map((cell) => cell.trim()))
    .filter((row) => !isNonTicketFooterCells(row, columns))
    .filter((row) => isLikelyContinuationRowForColumns(row, columns))
    .map((row) => adaptRowsToColumns([row], columns)[0]);
}

function getRecognizedColumnFieldCount(columns = []) {
  return columns.map((column) => getDefaultFieldForHeader(column)).filter(Boolean).length;
}

function hasStrongRecognizedColumns(columns = []) {
  if (!Array.isArray(columns) || columns.length < 3) return false;
  const fieldCount = columns.filter(isStrongRecognizedHeaderName).length;
  const hasPrice = columns.some(isSalePriceColumnName) || columns.some((column) => getDefaultFieldForHeader(column) === "售价");
  const hasSeatCue = columns.some((column) => {
    const field = getDefaultFieldForHeader(column);
    return ["区域", "排", "座位号", "位置", "票面"].includes(field);
  });
  return fieldCount >= 3 && hasPrice && hasSeatCue;
}

function isStandaloneLogisticsValue(value = "") {
  return /^(转寄|轉寄|转赠|自取|面交|过户|配送|现场|配送\/现场|邮寄|邮寄票|快递|物流|电子票|纸质票|实体票|delivery|transfer|pickup|shipping|courier|배송|택배|현장)$/i.test(
    String(value || "").trim(),
  );
}

function isLikelyDataColumnName(column = "") {
  const text = String(column || "").trim();
  if (!text) return false;
  if (isLikelyDateValue(text) || isLikelyDateColumnValue(text)) return true;
  if (isSoldText(text, { strict: true }) || isLikelyStatusValue(text)) return true;
  if (isStandaloneLogisticsValue(text) || isGenericFaceValue(text)) return true;
  if (isLikelySalePriceValue(text, { minPrice: 100 })) return true;
  if (parseCompositeSeatInfo(text) || extractZoneTokenFromText(text) || isLikelyZoneCode(text)) return true;
  if (isLikelySeatRowValue(text) || isLikelySeatNumberValue(text)) return true;
  return false;
}

function isStrongRecognizedHeaderName(column = "") {
  const field = getDefaultFieldForHeader(column);
  if (!field) return false;
  if (isLikelyDataColumnName(column)) return false;
  return true;
}

function shouldTreatParsedTableAsHeaderless(table) {
  const columns = Array.isArray(table?.columns) ? table.columns : [];
  if (!columns.length) return false;
  const strongHeaders = columns.filter(isStrongRecognizedHeaderName).length;
  const dataLikeHeaders = columns.filter(isLikelyDataColumnName).length;
  return dataLikeHeaders >= Math.max(2, strongHeaders + 1);
}

function coerceSourceTableForSamePageMerge(source, targetColumns = []) {
  if (!source || !Array.isArray(source.columns) || !Array.isArray(source.rows) || !Array.isArray(targetColumns) || !targetColumns.length) {
    return source;
  }
  repairMisreadDataHeaderTable(source);
  const sourceColumns = source.columns.map((column) => String(column || "").trim());
  const targetFieldCount = getRecognizedColumnFieldCount(targetColumns);
  const strongCount = sourceColumns.filter(isStrongRecognizedHeaderName).length;
  const dataLikeCount = sourceColumns.filter(isLikelyDataColumnName).length;
  const shouldUseTargetColumns =
    targetFieldCount >= 3 &&
    (shouldTreatParsedTableAsHeaderless(source) ||
      hasMisreadDataHeaderColumns(source.columns, source.rows) ||
      (strongCount < 3 && dataLikeCount >= 2));
  if (!shouldUseTargetColumns) return source;

  const rows = [source.columns, ...source.rows]
    .filter((row) => Array.isArray(row) && row.some((cell) => String(cell || "").trim()))
    .filter((row) => !isNonTicketFooterCells(row, targetColumns));
  source.columns = [...targetColumns];
  source.rows = adaptRowsToColumns(rows, targetColumns);
  source.originalColumns = [...source.columns];
  source.originalRows = cloneRows(source.rows);
  source.headerless = true;
  source._columnRepairChanged = true;
  return source;
}

function getDataLikeHeaderField(column = "") {
  const text = String(column || "").trim();
  if (!text || isStrongRecognizedHeaderName(text)) return "";
  const composite = parseCompositeSeatInfo(text);
  if (isLikelySerialValue(text)) return "序号";
  if (isLikelyDateValue(text) || isLikelyDateColumnValue(text)) return "日期";
  if (isSoldText(text, { strict: true }) || isLikelyStatusValue(text)) return "状态";
  if (isLikelySalePriceValue(text, { minPrice: 100 })) return "售价";
  if (isStandaloneLogisticsValue(text)) return "备注";
  if (isGenericFaceValue(text)) return "票面";
  if (composite?.zone || extractZoneTokenFromText(text) || isLikelyZoneCode(text)) return "区域";
  if (composite?.row || extractSeatRowFromText(text, { allowBareRange: true }) || isLikelySeatRowValue(text)) return "排";
  if (composite?.seat || extractSeatNumberFromText(text, { allowBareRange: true }) || isLikelySeatNumberValue(text)) return "座位号";
  return "";
}

function hasRepeatedInferredDataHeaderFields(columns = []) {
  const counts = new Map();
  columns.forEach((column) => {
    const field = getDataLikeHeaderField(column);
    if (!field) return;
    counts.set(field, (counts.get(field) || 0) + 1);
  });
  return Array.from(counts.values()).some((count) => count > 1);
}

function hasMultipleTicketValueColumnLabels(columns = []) {
  const fields = columns
    .map(getDataLikeHeaderField)
    .filter((field) => field && !["备注", "状态"].includes(field));
  return fields.length >= 2 && new Set(fields).size >= 2;
}

function rowLooksOffsetFromHeaderValues(columns = [], row = []) {
  if (!Array.isArray(row) || !row.some((cell) => String(cell || "").trim())) return false;
  let offsetPairs = 0;
  columns.forEach((column, index) => {
    if (displayPairLooksOffset(column, row[index])) offsetPairs += 1;
  });
  return offsetPairs >= 2;
}

function hasMisreadDataHeaderColumns(columns = [], rows = []) {
  if (!Array.isArray(columns) || columns.length < 3) return false;
  const filledColumns = columns.map((column) => String(column || "").trim()).filter(Boolean);
  if (filledColumns.length < 3) return false;
  const strongHeaders = filledColumns.filter(isStrongRecognizedHeaderName).length;
  const dataLikeHeaders = filledColumns.filter(isLikelyDataColumnName).length;
  const nonStrongDataHeaders = filledColumns.filter((column) => !isStrongRecognizedHeaderName(column) && isLikelyDataColumnName(column));
  const explicitHeaders = strongHeaders;
  const oldRule = dataLikeHeaders >= Math.max(2, strongHeaders + 1) && explicitHeaders < Math.ceil(filledColumns.length * 0.5);
  if (oldRule) return true;
  if (hasMultipleTicketValueColumnLabels(filledColumns) && explicitHeaders < Math.ceil(filledColumns.length * 0.5)) return true;

  const hasSerialOrDateValue = nonStrongDataHeaders.some((column) => isLikelySerialValue(column) || isLikelyDateValue(column) || isLikelyDateColumnValue(column));
  const hasSeatOrPriceValue = nonStrongDataHeaders.some((column) => {
    const composite = parseCompositeSeatInfo(column);
    return (
      Boolean(composite?.zone || composite?.row || composite?.seat) ||
      Boolean(extractZoneTokenFromText(column)) ||
      isLikelyZoneCode(column) ||
      isLikelySeatRowValue(column) ||
      isLikelySeatNumberValue(column) ||
      isLikelySalePriceValue(column, { minPrice: 100 }) ||
      isGenericFaceValue(column)
    );
  });
  if (nonStrongDataHeaders.length >= 3 && hasSerialOrDateValue && hasSeatOrPriceValue) return true;
  if (nonStrongDataHeaders.length >= 2 && hasRepeatedInferredDataHeaderFields(filledColumns)) return true;
  if (Array.isArray(rows) && rows.slice(0, 5).some((row) => rowLooksOffsetFromHeaderValues(columns, row))) return true;
  return false;
}

const CANONICAL_TICKET_COLUMN_ORDER = ["序号", "日期", "票面", "区域", "排", "座位号", "数量", "售价", "备注", "状态"];

function getColumnValues(rows = [], columnIndex) {
  return (Array.isArray(rows) ? rows : []).map((row) => String(row?.[columnIndex] || "").trim()).filter(Boolean);
}

function inferFieldFromColumnValues(values = []) {
  if (!values.length) return "";
  const ratio = (predicate) => values.filter(predicate).length / values.length;
  if (ratio(isLikelySerialValue) >= 0.55) return "序号";
  if (ratio((value) => isLikelyDateValue(value) || isLikelyDateColumnValue(value)) >= 0.45) return "日期";
  if (ratio(hasPriceOrSoldValue) >= 0.45) return "售价";
  if (ratio(isLikelyStatusValue) >= 0.45) return "状态";
  if (ratio(isLikelySeatCountValue) >= 0.7 && values.length > 1) return "数量";
  if (ratio(isLikelyRemarkValue) >= 0.45 || ratio(isStandaloneLogisticsValue) >= 0.45) return "备注";
  if (ratio(isLikelyFaceValue) >= 0.45) return "票面";
  if (
    ratio((value) => {
      const parsed = parseCompositeSeatInfo(value);
      return Boolean(parsed?.zone || extractZoneTokenFromText(value) || isLikelyZoneCode(value));
    }) >= 0.45
  ) {
    return "区域";
  }
  if (ratio((value) => Boolean(extractSeatRowFromText(value)) || isLikelySeatRowValue(value)) >= 0.45) return "排";
  if (ratio((value) => Boolean(extractSeatNumberFromText(value, { allowBareRange: true })) || isLikelySeatNumberValue(value)) >= 0.45) return "座位号";
  return "";
}

function getTrustedFieldForPossiblyMisreadColumn(column = "", rows = [], columnIndex = 0) {
  const strongField = getDefaultFieldForHeader(column);
  if (strongField && !isLikelyDataColumnName(column)) return strongField;
  const dataField = getDataLikeHeaderField(column);
  if (dataField) return dataField;
  return inferFieldFromColumnValues(getColumnValues(rows, columnIndex));
}

function mergeCanonicalCellValue(field, current = "", incoming = "") {
  const left = String(current || "").trim();
  const right = String(incoming || "").trim();
  if (!right) return left;
  if (!left) return right;
  if (normalize(left) === normalize(right)) return left;

  if (field === "售价") {
    const leftPrice = isLikelySalePriceValue(left, { minPrice: 100 });
    const rightPrice = isLikelySalePriceValue(right, { minPrice: 100 });
    if (rightPrice && !leftPrice) return right;
    if (leftPrice && !rightPrice) return left;
  }
  if (field === "日期") {
    const leftDate = isLikelyDateValue(left) || isLikelyDateColumnValue(left);
    const rightDate = isLikelyDateValue(right) || isLikelyDateColumnValue(right);
    if (rightDate && !leftDate) return right;
    if (leftDate && !rightDate) return left;
  }
  if (field === "区域") {
    const leftZone = extractZoneTokenFromText(left) || cleanZoneToken(left);
    const rightZone = extractZoneTokenFromText(right) || cleanZoneToken(right);
    if (currentEvent?.zones?.some((zone) => zoneTokenMatches(rightZone, zone)) && !currentEvent.zones.some((zone) => zoneTokenMatches(leftZone, zone))) return right;
    if (leftZone && rightZone && rightZone.length > leftZone.length && !isLikelySeatRowValue(right)) return right;
  }
  if (field === "排") {
    const rightRow = extractSeatRowFromText(right) || isLikelySeatRowValue(right);
    const leftRow = extractSeatRowFromText(left) || isLikelySeatRowValue(left);
    if (rightRow && !leftRow) return right;
    if (leftRow && !rightRow) return left;
  }
  if (field === "座位号") {
    const rightSeat = extractSeatNumberFromText(right, { allowBareRange: true }) || isLikelySeatNumberValue(right);
    const leftSeat = extractSeatNumberFromText(left, { allowBareRange: true }) || isLikelySeatNumberValue(left);
    if (rightSeat && !leftSeat) return right;
    if (leftSeat && !rightSeat) return left;
  }
  if (field === "数量") {
    if (isLikelySeatCountValue(right) && !isLikelySeatCountValue(left)) return right;
    if (isLikelySeatCountValue(left) && !isLikelySeatCountValue(right)) return left;
  }
  if (field === "备注") {
    return [left, right].filter(Boolean).filter((value, index, list) => list.findIndex((item) => normalize(item) === normalize(value)) === index).join(" / ");
  }
  return left;
}

function rebuildMisreadColumnsWithoutPromotingHeaderRow(table) {
  if (!table || !Array.isArray(table.columns) || !Array.isArray(table.rows) || !table.rows.length) return false;
  const fieldByIndex = table.columns.map((column, index) => getTrustedFieldForPossiblyMisreadColumn(column, table.rows, index));
  const trustedCount = fieldByIndex.filter(Boolean).length;
  if (trustedCount < 3) return false;

  const orderedFields = CANONICAL_TICKET_COLUMN_ORDER.filter((field) => fieldByIndex.includes(field));
  fieldByIndex.forEach((field, index) => {
    if (field || orderedFields.includes(table.columns[index])) return;
    const label = String(table.columns[index] || "").trim();
    if (label && !isLikelyDataColumnName(label) && !looksLikeRecognizedTableHeader(label)) orderedFields.push(label);
  });
  if (orderedFields.length < 3) return false;

  table.rows = table.rows
    .map((row) => {
      const valuesByField = new Map();
      (Array.isArray(row) ? row : []).forEach((cell, index) => {
        const value = String(cell || "").trim();
        if (!value) return;
        const field = fieldByIndex[index];
        if (!field) return;
        valuesByField.set(field, mergeCanonicalCellValue(field, valuesByField.get(field), value));
      });
      return orderedFields.map((field) => valuesByField.get(field) || "");
    })
    .filter((row) => row.some(Boolean) && !isNonTicketFooterCells(row, orderedFields));
  table.columns = orderedFields;
  table.originalColumns = [...orderedFields];
  table.originalRows = cloneRows(table.rows);
  table.headerless = false;
  table._columnRepairChanged = true;
  return Boolean(table.rows.length);
}

function getSampleValuesForRows(rows = [], columnIndex) {
  return rows.map((row) => String(row?.[columnIndex] || "").trim()).filter(Boolean);
}

function valueMatchCount(values = [], predicate) {
  return values.filter(predicate).length;
}

function hasPriceOrSoldValue(value) {
  return isLikelySalePriceValue(value, { minPrice: 100 }) || isSoldText(value, { strict: true });
}

function isLikelyFaceValue(value) {
  const text = String(value || "").trim();
  if (!text || isLikelyDateValue(text) || hasPriceOrSoldValue(text)) return false;
  if (isStandaloneLogisticsValue(text) || isLogisticsOrRemarkValue(text)) return false;
  return isGenericFaceValue(text) || /^(general|vip|cat\s*\d+|floor|standing|内场|內場|看台|看臺|121000|[134]\d{2})$/i.test(text);
}

function makeUniqueInferredColumn(label, seen) {
  const base = label || "备注";
  const count = seen.get(base) || 0;
  seen.set(base, count + 1);
  return count ? `${base}${count + 1}` : base;
}

function inferColumnsForMisreadDataRows(rows = []) {
  const maxCellCount = Math.max(0, ...rows.map((row) => row.length));
  const columns = Array.from({ length: maxCellCount }, () => "");
  const used = new Set();
  const chooseBestIndex = (label, predicate, scorer = () => 0, { threshold = 0.45, preferLast = false } = {}) => {
    const candidates = Array.from({ length: maxCellCount }, (_, index) => {
      if (used.has(index)) return null;
      const values = getSampleValuesForRows(rows, index);
      if (!values.length) return null;
      const matches = valueMatchCount(values, predicate);
      const ratio = matches / values.length;
      if (ratio < threshold && matches < Math.min(2, values.length)) return null;
      return {
        index,
        ratio,
        matches,
        score: ratio * 100 + matches * 8 + scorer(values, index) + (preferLast ? index : -index) * 0.2,
      };
    })
      .filter(Boolean)
      .sort((a, b) => b.score - a.score)[0];
    if (!candidates) return -1;
    columns[candidates.index] = label;
    used.add(candidates.index);
    return candidates.index;
  };

  chooseBestIndex("售价", hasPriceOrSoldValue, (values, index) => index * 3, { threshold: 0.35, preferLast: true });
  chooseBestIndex("日期", (value) => isLikelyDateValue(value) || isLikelyDateColumnValue(value), (values, index) => (index <= 2 ? 8 : 0), { threshold: 0.45 });
  chooseBestIndex("状态", isLikelyStatusValue, () => 0, { threshold: 0.45 });
  chooseBestIndex("票面", isLikelyFaceValue, () => 0, { threshold: 0.45 });
  chooseBestIndex(
    "区域",
    (value) => {
      const parsed = parseCompositeSeatInfo(value);
      return Boolean(parsed?.zone || extractZoneTokenFromText(value) || isLikelyZoneCode(value));
    },
    (values) => values.filter((value) => currentEvent?.zones?.some((zone) => zoneTokenMatches(value, zone))).length * 30,
    { threshold: 0.35 },
  );
  chooseBestIndex("排", (value) => Boolean(extractSeatRowFromText(value)) || isLikelySeatRowValue(value), () => 0, { threshold: 0.35 });
  chooseBestIndex("座位号", (value) => Boolean(extractSeatNumberFromText(value, { allowBareRange: true })) || isLikelySeatNumberValue(value), () => 0, {
    threshold: 0.35,
  });
  chooseBestIndex("数量", isLikelySeatCountValue, (values, index) => (index > 0 ? -index : 0), { threshold: 0.55 });
  chooseBestIndex("序号", isLikelySerialValue, (values, index) => (index === 0 ? 30 : 0), { threshold: 0.45 });

  const seen = new Map();
  return columns.map((column, index) => {
    if (column) return makeUniqueInferredColumn(column, seen);
    const values = getSampleValuesForRows(rows, index);
    const label = values.some(isLogisticsOrRemarkValue) || values.some(isLikelyRemarkValue) ? "备注" : `第${index + 1}列`;
    return makeUniqueInferredColumn(label, seen);
  });
}

function repairMisreadDataHeaderTable(table) {
  if (!table || !Array.isArray(table.columns) || !Array.isArray(table.rows)) return table;
  const columnsMisread = hasMisreadDataHeaderColumns(table.columns, table.rows);
  const originalColumnsMisread = hasMisreadDataHeaderColumns(table.originalColumns, table.originalRows);
  if (!columnsMisread && !originalColumnsMisread) return table;

  if (columnsMisread) {
    if (!rebuildMisreadColumnsWithoutPromotingHeaderRow(table)) {
      const promotedRows = [table.columns, ...table.rows]
        .map((row) => (Array.isArray(row) ? row.map((cell) => String(cell || "").trim()) : []))
        .filter((row) => row.some(Boolean) && !isNonTicketFooterCells(row));
      if (promotedRows.length) {
        table.columns = inferColumnsForMisreadDataRows(promotedRows);
        table.rows = promotedRows.map((row) => adaptRowsToColumns([row], table.columns)[0]);
        table.originalColumns = [...table.columns];
        table.originalRows = cloneRows(table.rows);
        table.headerless = true;
        table._columnRepairChanged = true;
      }
    }
  } else if (originalColumnsMisread) {
    table.originalColumns = [...table.columns];
    table.originalRows = cloneRows(table.rows);
    table._columnRepairChanged = true;
  }
  if (table._columnRepairChanged) table.reviewFlagsVersion = 0;
  return table;
}

function isLikelyContinuationRowForColumns(row = [], columns = []) {
  if (!Array.isArray(row) || !row.some((cell) => String(cell || "").trim())) return false;
  if (looksLikeRecognizedTableHeader(row.join("\t"))) return false;
  if (isNonTicketFooterCells(row, columns)) return false;
  const values = row.map((cell) => String(cell || "").trim()).filter(Boolean);
  if (values.length < 2) return false;
  const hasPriceOrSold = values.some((value) => isLikelySalePriceValue(value) || isSoldText(value, { strict: true }));
  const hasDate = values.some((value) => isLikelyDateValue(value) || isLikelyDateColumnValue(value));
  const hasSeat = values.some(
    (value) =>
      Boolean(extractZoneTokenFromText(value)) ||
      Boolean(parseCompositeSeatInfo(value)) ||
      isLikelySeatRowValue(value) ||
      isLikelySeatNumberValue(value),
  );
  const hasStatus = values.some(isLikelyStatusValue);
  if (hasPriceOrSold && (hasDate || hasSeat || hasStatus)) return true;
  if (hasStatus && (hasDate || hasSeat)) return true;
  if (looksLikeTicketDataCells(row)) return true;
  const fieldCount = getRecognizedColumnFieldCount(columns);
  const minimumCells = Math.min(4, Math.max(2, columns.length - 2));
  return fieldCount >= 3 && values.length >= minimumCells && (hasDate || hasSeat);
}

function canTreatAsContinuationTable(previous, next) {
  if (!previous || !next) return false;
  if (previous.sourcePage !== next.sourcePage) return false;
  if (!hasStrongRecognizedColumns(previous.columns)) return false;
  if (!next.headerless && !shouldTreatParsedTableAsHeaderless(next) && hasStrongRecognizedColumns(next.columns)) return false;
  const rows = Array.isArray(next.rows) ? next.rows : [];
  if (!rows.length) return false;
  const continuationRows = rows.filter((row) => isLikelyContinuationRowForColumns(row, previous.columns)).length;
  if (!continuationRows) return false;
  const compatibleLength = rows.some((row) => row.length <= previous.columns.length + 2);
  return compatibleLength && continuationRows / rows.length >= 0.5;
}

function appendContinuationRows(previous, rows = []) {
  if (!previous || !rows.length) return;
  previous.rows.push(...adaptRowsToColumns(rows, previous.columns));
  extendColumnsForOverflowRows(previous.columns, previous.rows);
}

function canMergeRecognizedTables(previous, next) {
  if (!previous || !next) return false;
  if (previous.sourcePage !== next.sourcePage) return false;
  if (shouldTreatParsedTableAsHeaderless(next)) return false;
  const compatibleColumns = areRecognizedColumnsCompatible(previous.columns, next.columns);
  if (compatibleColumns) return true;
  if (!next.headerless) return false;
  if (next.rows.length > 3 && previous.columns.length !== next.columns.length) return false;
  if (previous.columns.length === next.columns.length) return true;
  if (next.columns.length === 2 && isSalePriceColumnName(next.columns[next.columns.length - 1])) return true;
  return false;
}

function getRecognizedColumnField(column = "") {
  return getDefaultFieldForHeader(column) || normalize(column);
}

function areRecognizedColumnsCompatible(left = [], right = []) {
  if (!Array.isArray(left) || !Array.isArray(right) || !left.length || !right.length) return false;
  if (Math.abs(left.length - right.length) > 2) return false;
  const leftFields = left.map(getRecognizedColumnField).filter(Boolean);
  const rightFields = right.map(getRecognizedColumnField).filter(Boolean);
  if (!leftFields.length || !rightFields.length) return false;
  const common = rightFields.filter((field) => leftFields.includes(field)).length;
  const denominator = Math.max(leftFields.length, rightFields.length);
  if (common / denominator >= 0.62) return true;
  const leftHasPrice = left.some(isSalePriceColumnName);
  const rightHasPrice = right.some(isSalePriceColumnName);
  const leftHasDate = left.some((column) => getDefaultFieldForHeader(column) === "日期");
  const rightHasDate = right.some((column) => getDefaultFieldForHeader(column) === "日期");
  return leftHasPrice && rightHasPrice && leftHasDate === rightHasDate && common >= 2;
}

function adaptRowsToColumns(rows, columns) {
  return rows.map((row) => {
    if (row.length === columns.length) return row.slice();
    const compactMapped = alignCompactTicketRowToColumns(row, columns);
    if (compactMapped) return compactMapped;
    if (row.length === 2 && columns.length > 2) {
      const next = Array.from({ length: columns.length }, () => "");
      const positionIndex = findColumnIndex(columns, ["位置", "区域", "区", "排", "座位"]);
      const priceIndex = findColumnIndex(columns, ["售价", "价格", "price", "ask"]);
      next[positionIndex >= 0 ? positionIndex : 0] = row[0] || "";
      next[priceIndex >= 0 ? priceIndex : columns.length - 1] = row[1] || "";
      return next;
    }
    const next = row.slice(0, columns.length);
    while (next.length < columns.length) next.push("");
    return next;
  });
}

function getRecognizedColumnTargetIndex(columns, column, usedIndexes = new Set()) {
  const field = getDefaultFieldForHeader(column);
  const exact = normalize(column);
  let index = columns.findIndex((candidate, candidateIndex) => !usedIndexes.has(candidateIndex) && normalize(candidate) === exact);
  if (index >= 0) return index;
  if (!field) return -1;
  index = columns.findIndex(
    (candidate, candidateIndex) => !usedIndexes.has(candidateIndex) && getDefaultFieldForHeader(candidate) === field,
  );
  return index;
}

function mergeRecognizedTableInto(previous, next) {
  if (!previous || !next) return;
  if (shouldTreatParsedTableAsHeaderless(next)) {
    appendContinuationRows(previous, next.rows);
    return;
  }
  next.columns.forEach((column) => {
    if (isStrongRecognizedHeaderName(column) && getRecognizedColumnTargetIndex(previous.columns, column) < 0) {
      previous.columns.push(column);
      previous.rows.forEach((row) => row.push(""));
    }
  });
  const mappedRows = next.rows.map((row) => {
    const mapped = Array.from({ length: previous.columns.length }, () => "");
    const usedIndexes = new Set();
    next.columns.forEach((column, columnIndex) => {
      const targetIndex = getRecognizedColumnTargetIndex(previous.columns, column, usedIndexes);
      if (targetIndex < 0) return;
      mapped[targetIndex] = row[columnIndex] || "";
      usedIndexes.add(targetIndex);
    });
    row.slice(next.columns.length).forEach((value) => {
      const emptyIndex = mapped.findIndex((item) => !String(item || "").trim());
      if (emptyIndex >= 0) mapped[emptyIndex] = value;
    });
    return mapped;
  });
  previous.rows.push(...mappedRows);
  extendColumnsForOverflowRows(previous.columns, previous.rows);
}

function isRecognizedHeaderCueCell(cell = "") {
  const text = String(cell || "").trim();
  const normalized = normalize(text);
  if (!normalized) return false;
  if (
    isLikelyDateValue(text) ||
    isLikelyDateColumnValue(text) ||
    isLikelySalePriceValue(text) ||
    isSoldText(text, { strict: true }) ||
    isLikelyStatusValue(text) ||
    isStandaloneLogisticsValue(text) ||
    parseCompositeSeatInfo(text) ||
    isLikelySeatRowValue(text) ||
    isLikelySeatNumberValue(text)
  ) {
    return false;
  }
  if (/^(no|no\.|num|number|id|date|day|price|ask|block|section|zone|area|row|seat|qty|count|status)$/i.test(text)) return true;
  if (
    /^(序号|编号|日期|演出日期|时间|门票时间|票面|票价|价位|价格|售价|单价|区域|区|位置|席位|座席|排|排数|行|行数|座位|座位号|座号|号数|号段|票面位置|票面号段|座位图|数量|张数|连坐|备注|说明|状态)$/.test(
      text,
    )
  ) {
    return true;
  }
  return /(date|day|price|ask|block|section|zone|area|row|seat|qty|status|구역|열|좌석|가격|매수|수량)/i.test(text);
}

function looksLikeRecognizedTableHeader(line) {
  const cells = splitTableLine(line).map((cell) => cell.trim()).filter(Boolean);
  if (cells.length < 2) return false;
  const valueLikeCount = cells.filter(
    (cell) =>
      isLikelyDateValue(cell) ||
      isLikelyDateColumnValue(cell) ||
      isLikelySalePriceValue(cell) ||
      isSoldText(cell, { strict: true }) ||
      isStandaloneLogisticsValue(cell) ||
      parseCompositeSeatInfo(cell),
  ).length;
  const hasDateAndPrice =
    cells.some((cell) => isLikelyDateValue(cell) || isLikelyDateColumnValue(cell)) &&
    cells.some((cell) => isLikelySalePriceValue(cell) || isSoldText(cell, { strict: true }));
  if (hasDateAndPrice && valueLikeCount >= Math.max(2, Math.floor(cells.length * 0.35))) return false;
  const cueCount = cells.filter(isRecognizedHeaderCueCell).length;
  if (cueCount < 2) return false;
  const canonicalFields = new Set(cells.map((cell) => getDefaultFieldForHeader(cell)).filter(Boolean));
  const hasKeyField = canonicalFields.has("日期") || canonicalFields.has("售价") || canonicalFields.has("区域") || canonicalFields.has("排");
  return hasKeyField && valueLikeCount <= Math.max(1, Math.floor(cells.length * 0.25));
}

function splitRecognizedTableSections(block) {
  return [block];
}

function extractSourcePageFromBlock(block) {
  const lines = String(block || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const markerIndex = lines.findIndex((line) => /^-{2,}\s*PDF\s*第\s*(\d+)\s*页\s*-{2,}$/i.test(line));
  if (markerIndex < 0) return { text: block, sourcePage: null };
  const pageMatch = lines[markerIndex].match(/第\s*(\d+)\s*页/i);
  const sourcePage = Number(pageMatch?.[1] || 0) || null;
  lines.splice(markerIndex, 1);
  return { text: lines.join("\n"), sourcePage };
}

function splitRecognizedPageBlocks(text) {
  const blocks = [];
  let currentSourcePage = null;
  let currentLines = [];
  String(text || "")
    .split(/\r?\n/)
    .forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed) return;
      const pageMatch = trimmed.match(/^-{2,}\s*PDF\s*第\s*(\d+)\s*页\s*-{2,}$/i);
      if (pageMatch) {
        if (currentLines.length) {
          blocks.push({ text: currentLines.join("\n"), sourcePage: currentSourcePage });
          currentLines = [];
        }
        currentSourcePage = Number(pageMatch[1] || 0) || null;
        return;
      }
      currentLines.push(trimmed);
    });
  if (currentLines.length) blocks.push({ text: currentLines.join("\n"), sourcePage: currentSourcePage });
  return blocks;
}

function splitRecognizedTables(text) {
  const parsedBlocks = [];
  splitRecognizedPageBlocks(text).forEach((source) => {
    splitRecognizedTableSections(source.text).forEach((section) => {
      const parsed = parseTableText(section);
      const sourcePage = source.sourcePage || null;
      const sectionLines = String(section || "")
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);
      const hasHeader = sectionLines.some((line) => looksLikeRecognizedTableHeader(line));
      const previous = parsedBlocks[parsedBlocks.length - 1];
      if (parsed && hasHeader) {
        const nextTable = { ...parsed, sourcePage };
        if (canMergeRecognizedTables(previous, nextTable)) {
          mergeRecognizedTableInto(previous, nextTable);
          return;
        }
        parsedBlocks.push(nextTable);
        return;
      }
      if (previous && previous.sourcePage === sourcePage) {
        const continuationRows = parseContinuationRows(section, previous.columns);
        if (continuationRows.length) {
          previous.rows.push(...continuationRows);
          extendColumnsForOverflowRows(previous.columns, previous.rows);
          return;
        }
      }
      if (parsed) {
        const nextTable = { ...parsed, sourcePage };
        if (canTreatAsContinuationTable(previous, nextTable)) {
          appendContinuationRows(previous, nextTable.rows);
          return;
        }
        if (canMergeRecognizedTables(previous, nextTable)) {
          mergeRecognizedTableInto(previous, nextTable);
          return;
        }
        parsedBlocks.push(nextTable);
      }
    });
  });
  const pagePartCounts = {};
  parsedBlocks.forEach((table) => {
    const pageKey = String(table.sourcePage || "single");
    pagePartCounts[pageKey] = (pagePartCounts[pageKey] || 0) + 1;
    table.sourcePart = pagePartCounts[pageKey];
  });
  return parsedBlocks.length ? parsedBlocks : [];
}

const FIELD_MAPPING_OPTIONS = [
  { value: "", label: "忽略" },
  { value: "序号", label: "序号" },
  { value: "日期", label: "日期" },
  { value: "票面", label: "票面" },
  { value: "区域", label: "区域" },
  { value: "排", label: "排数" },
  { value: "座位号", label: "座位号" },
  { value: "数量", label: "数量" },
  { value: "售价", label: "售价" },
  { value: "备注", label: "备注" },
  { value: "状态", label: "状态" },
];

function isSpreadsheetFile(file) {
  const name = String(file?.name || "").toLowerCase();
  return /\.(csv|tsv|txt|xlsx)$/.test(name) || /spreadsheet|csv|tab-separated/i.test(file?.type || "");
}

function getFieldMappingSignature(headers = []) {
  return headers.map((header) => normalize(header || "空列")).join("|");
}

function hasHeaderHint(header = "", names = []) {
  const text = normalize(header);
  return names.some((name) => text.includes(normalize(name)));
}

function getColumnValuesFromRows(rows = [], index) {
  return rows.map((row) => String(row[index] || "").trim()).filter(Boolean);
}

function valueRatio(values = [], predicate) {
  if (!values.length) return 0;
  return values.filter(predicate).length / values.length;
}

function isLikelyDateValue(value) {
  const text = String(value || "").trim();
  return Boolean(
    /^\d{1,2}[./-]\d{1,2}$/.test(text) ||
      /^\d{4}[./-]\d{1,2}[./-]\d{1,2}$/.test(text) ||
      /^\d{8}$/.test(text) ||
      isLikelyCompactMonthDayDateValue(text) ||
      /^\d{1,2}\s*月\s*\d{1,2}\s*日?$/.test(text),
  );
}

function isLikelyCompactMonthDayDateValue(value) {
  const text = String(value || "").trim();
  const match = text.match(/^(\d{2})(\d{2})$/);
  if (!match) return false;
  const month = Number(match[1]);
  const day = Number(match[2]);
  return month >= 1 && month <= 12 && day >= 1 && day <= 31;
}

function isLikelyDayOnlyDateValue(value) {
  const text = String(value || "").trim();
  if (!/^\d{1,2}$/.test(text)) return false;
  const day = Number(text);
  return day >= 1 && day <= 31;
}

function isLikelyDateColumnValue(value) {
  return isLikelyDateValue(value) || isLikelyDayOnlyDateValue(value);
}

function isEmailDeliveryValue(value) {
  return /(电子邮件|邮箱|email|e-mail|mailbox|mail address)/i.test(String(value || ""));
}

function isShippingDeliveryValue(value) {
  return /(邮寄票|邮寄|郵寄|邮件|郵件|邮箱|郵箱|快递|物流|配送|送达|送下|转寄|轉寄|寄送|发货|到付|纸质票|實體票|实体票|shipping|ship|courier|delivery|택배|배송|배달)/i.test(String(value || ""));
}

function isLikelyRemarkValue(value) {
  const text = String(value || "").trim();
  return Boolean(
    text &&
      /连|视阻|rv|restricted|自取|邮寄票|邮寄|郵寄|邮件|郵件|邮箱|郵箱|寄送|转寄|轉寄|转赠|配送|送达|送下|配合|面交|过户|過戶|邮\/过户|邮寄\/过户|靠过道|靠過道|过道|過道|电子票|纸质票|实体票|實體票|快递|物流|酒店|地址|卡|权益|备注|说明|实际|避雷|可拆|不可拆|包含|배송|배달|택배|양도|전달|수령|현장|직거래|비고|메모|참고/i.test(
        text,
      ),
  );
}

function isLogisticsOrRemarkValue(value) {
  const text = String(value || "").trim();
  if (!text || isSoldText(text, { strict: true })) return false;
  return /(配送|送达|送下|配合|可协助|转寄|轉寄|转赠|转客|转让|自取|面交|过户|過戶|邮\/过户|邮寄\/过户|电子票|纸质票|实体票|實體票|快递|物流|邮寄票|邮寄|郵寄|邮件|郵件|邮箱|郵箱|寄送|酒店|地址|取票|交付|发货|到付|面交|delivery|transfer|pickup|shipping|ship|courier|배송|배달|택배|양도|전달|수령|현장|직거래)/i.test(
    text,
  );
}

function isDeliveryColumnName(column = "") {
  return /(交付|取票|配送|送达|送下|转寄|轉寄|转赠|自取|面交|过户|過戶|邮\/过户|邮寄\/过户|物流|快递|邮寄票|邮寄|郵寄|邮件|郵件|邮箱|郵箱|寄送|发货|delivery|transfer|pickup|shipping|ship|courier|배송|배달|택배|양도|전달|수령|현장|직거래)/i.test(
    String(column || ""),
  );
}

function isRemarkColumnName(column = "") {
  return /(备注|说明|remark|note|标记|交付|取票|配送|送达|送下|转寄|轉寄|转赠|自取|面交|过户|過戶|邮\/过户|邮寄\/过户|物流|快递|邮寄票|邮寄|郵寄|邮件|郵件|邮箱|郵箱|寄送|发货|delivery|transfer|pickup|shipping|ship|courier|비고|메모|참고|배송|배달|택배|양도|전달|수령|현장|직거래)/i.test(
    String(column || ""),
  );
}

function isLikelyStatusValue(value) {
  return isSoldText(value, { strict: true }) || /未售|可售|在售|available/i.test(String(value || ""));
}

function isBusinessStatusRemarkValue(value) {
  const text = String(value || "").trim();
  if (!text || isSoldText(text, { strict: true })) return false;
  return isLogisticsOrRemarkValue(text);
}

function getLockedFieldForHeader(header = "", values = [], options = {}) {
  const text = String(header || "");
  const normalizedHeader = normalize(text);
  const businessRemarkRatio = valueRatio(values, isBusinessStatusRemarkValue);
  const saleRatio = valueRatio(values, (value) => isLikelySalePriceValue(value, { minPrice: isSalePriceColumnName(text) ? 100 : 1000 }));
  if (/^(no|no\.|num|number|id|序号|编号|编号\.?)$/i.test(text.trim()) || ["no", "num", "number", "id", "序号", "编号"].includes(normalizedHeader)) {
    return "序号";
  }
  if (isDeliveryColumnName(text) || isRemarkColumnName(text)) return "备注";
  if (hasHeaderHint(text, ["状态", "售卖状态", "销售状态", "status", "是否售出"])) return "状态";
  if (isSalePriceColumnName(text)) {
    if (options.hasExplicitSaleHeader && isGenericPriceColumnName(text)) return "票面";
    return "售价";
  }
  if (isQuantityColumnName(text) && saleRatio < 0.35 && businessRemarkRatio < 0.35) return "数量";
  if (hasHeaderHint(text, ["日期", "演出日期", "时间", "date", "day", "일자", "날짜", "시간"])) return "日期";
  if (hasHeaderHint(text, ["票面", "票价", "价位", "面值", "席位", "席别", "席別", "座席", "类型", "类别", "face", "category", "cat", "좌석", "등급", "구분", "석"])) {
    return "票面";
  }
  if (hasHeaderHint(text, ["票面号段", "门票号段", "座位号段", "座位号", "座号", "号数", "大小号", "号段", "号码", "seat", "번호", "좌석번호"])) {
    return "座位号";
  }
  if (hasHeaderHint(text, ["票面排数", "门票排数", "座位排数", "票面位置", "门票位置", "座位位置", "排数", "排", "行数", "行", "row", "열"])) return "排";
  if (hasHeaderHint(text, ["区域", "票面区域", "场区", "block", "section", "구역", "구"]) && saleRatio < 0.35) return "区域";
  return "";
}

function getSmartFieldMapping(headers = [], rows = [], template = null) {
  const fields = ["序号", "日期", "票面", "区域", "排", "座位号", "数量", "售价", "备注", "状态"];
  const hasExplicitSaleHeader = headers.some((header) => isExplicitSalePriceColumnName(header));
  const usedIndexes = new Set();
  const lockedIndexes = new Set();
  const mapping = headers.map(() => "");
  const scored = headers.map((header, index) => {
    const values = getColumnValuesFromRows(rows, index);
    const saleHeader = isSalePriceColumnName(header);
    const saleValues = valueRatio(values, (value) => {
      return isLikelySalePriceValue(value, { minPrice: saleHeader ? 100 : 1000 });
    });
    const smallZoneValues = valueRatio(values, (value) => isLikelyZoneCode(value));
    const businessRemarkValues = valueRatio(values, isBusinessStatusRemarkValue);
    const countValues = valueRatio(values, isLikelySeatCountValue);
    const scores = {
      序号: (hasHeaderHint(header, ["序号", "编号", "no", "num", "number", "id"]) ? 80 : 0) + valueRatio(values, (value) => /^\d+$/.test(value)) * 10,
      日期: (hasHeaderHint(header, ["日期", "演出日期", "时间", "date", "day", "일자", "날짜", "시간"]) ? 90 : 0) + valueRatio(values, isLikelyDateValue) * 80,
      票面:
        (hasHeaderHint(header, ["票面", "票价", "价位", "面值", "席位", "席别", "席別", "座席", "类型", "类别", "face", "category", "cat", "좌석", "등급", "구분", "석"]) ? 85 : 0) +
        valueRatio(values, (value) => {
          const number = extractNumber(value);
          return number !== null && number >= 100 && number < 1000;
        }) *
          35,
      区域:
        (hasHeaderHint(header, ["区域", "票面区域", "场区", "区", "位置", "block", "section", "구역", "구"]) ? 95 : 0) +
        smallZoneValues * 90 -
        saleValues * 55,
      排:
        (hasHeaderHint(header, ["票面排数", "门票排数", "座位排数", "票面位置", "门票位置", "座位位置", "排数", "排", "行数", "行", "row", "열"]) ? 90 : 0) +
        valueRatio(values, isLikelySeatRowValue) * 80 -
        smallZoneValues * 20,
      座位号:
        (hasHeaderHint(header, ["座位图", "座席图", "seatmap"]) ? -120 : 0) +
        (hasHeaderHint(header, ["票面号段", "门票号段", "座位号段", "座位号", "座位", "座号", "号数", "大小号", "号段", "号码", "号", "seat", "번호", "좌석번호"]) ? 90 : 0) +
        valueRatio(values, isLikelySeatNumberValue) * 65,
      数量:
        (hasHeaderHint(header, ["数量", "张数", "连坐", "连坐数量", "count", "qty", "매수", "수량", "장수", "연석"]) ? 90 : 0) +
        countValues * 60 -
        saleValues * 70 -
        businessRemarkValues * 120,
      售价:
        (hasHeaderHint(header, ["售价", "价格", "单价", "报价", "金额", "售價", "price", "ask"]) ? 100 : 0) +
        saleValues * 110 -
        smallZoneValues * 45 -
        businessRemarkValues * 75 -
        countValues * 35,
      备注:
        (hasHeaderHint(header, ["备注", "说明", "remark", "note", "标记", "交付", "取票", "配送", "邮寄", "邮寄票", "快递", "物流", "纸质票", "实体票", "转寄", "转赠", "自取", "面交", "过户", "delivery", "shipping", "ship", "courier", "transfer", "pickup", "비고", "메모", "참고", "배송", "배달", "택배", "양도", "전달", "수령", "현장"]) ? 90 : 0) +
        valueRatio(values, isLikelyRemarkValue) * 65 +
        businessRemarkValues * 100,
      状态:
        (hasHeaderHint(header, ["状态", "售卖状态", "销售状态", "status", "是否售出"]) ? 80 : 0) +
        valueRatio(values, isLikelyStatusValue) * 95 -
        valueRatio(values, isBusinessStatusRemarkValue) * 90,
    };
    return { header, index, scores };
  });

  headers.forEach((header, index) => {
    const lockedField = getLockedFieldForHeader(header, getColumnValuesFromRows(rows, index), { hasExplicitSaleHeader });
    if (!lockedField || usedIndexes.has(index)) return;
    mapping[index] = lockedField;
    usedIndexes.add(index);
    lockedIndexes.add(index);
  });

  fields.forEach((field) => {
    const best = scored
      .filter((item) => !usedIndexes.has(item.index))
      .map((item) => ({ ...item, score: item.scores[field] || 0 }))
      .filter((item) => item.score >= 50)
      .sort((a, b) => b.score - a.score)[0];
    if (!best) return;
    mapping[best.index] = field;
    usedIndexes.add(best.index);
  });

  if (template?.mapping?.length === headers.length) {
    template.mapping.forEach((field, index) => {
      if (!field || !FIELD_MAPPING_OPTIONS.some((option) => option.value === field)) return;
      if (lockedIndexes.has(index)) return;
      const values = getColumnValuesFromRows(rows, index);
      const looksLikeZone = valueRatio(values, isLikelyZoneCode) >= 0.5;
      const looksLikeHighPrice = valueRatio(values, (value) => {
        const number = extractNumber(value);
        return number !== null && number >= 1000;
      }) >= 0.5;
      if (field === "售价" && looksLikeZone && !looksLikeHighPrice) return;
      if (field === "区域" && looksLikeHighPrice && !looksLikeZone) return;
      mapping[index] = field;
    });
  }

  const deduped = headers.map(() => "");
  fields.forEach((field) => {
    const candidates = mapping
      .map((mappedField, index) => ({ field: mappedField, index, score: (scored[index]?.scores[field] || 0) + (lockedIndexes.has(index) ? 10000 : 0) }))
      .filter((item) => item.field === field)
      .sort((a, b) => b.score - a.score);
    if (candidates[0]) deduped[candidates[0].index] = field;
  });
  return deduped;
}

function getDefaultFieldForHeader(header = "") {
  const text = normalize(header);
  if (!text) return "";
  if (/座位图|座席图|seatmap/.test(text)) return "";
  if (["序号", "编号", "no", "num", "number", "id"].some((name) => text.includes(normalize(name)))) return "序号";
  if (["日期", "演出日期", "时间", "date", "day", "일자", "날짜", "시간"].some((name) => text.includes(normalize(name)))) return "日期";
  if (/票面(排数|位置)|门票(排数|位置)|座位(排数|位置)/.test(text)) return "排";
  if (/票面号段|门票号段|座位号段|号段|号码/.test(text)) return "座位号";
  if (["区域", "区", "位置", "block", "section", "구역", "구", "위치"].some((name) => text.includes(normalize(name)))) return "区域";
  if (["票面", "票价", "价位", "面值", "席位", "席别", "席別", "座席", "类型", "类别", "face", "category", "cat", "좌석", "등급", "구분", "석"].some((name) => text.includes(normalize(name)))) return "票面";
  if (["排数", "排", "行数", "行", "row", "열"].some((name) => text.includes(normalize(name)))) return "排";
  if (["座位号", "座位", "座号", "号数", "大小号", "号", "seat", "번호", "좌석번호"].some((name) => text.includes(normalize(name)))) return "座位号";
  if (["数量", "张数", "连坐", "count", "qty", "매수", "수량", "장수", "연석"].some((name) => text.includes(normalize(name)))) return "数量";
  if (["售价", "价格", "单价", "报价", "金额", "price", "ask"].some((name) => text.includes(normalize(name)))) return "售价";
  if (["备注", "说明", "remark", "note", "标记", "交付", "取票", "配送", "邮寄", "邮寄票", "快递", "物流", "纸质票", "实体票", "转寄", "转赠", "自取", "面交", "过户", "delivery", "shipping", "ship", "courier", "transfer", "pickup", "비고", "메모", "참고", "배송", "배달", "택배", "양도", "전달", "수령", "현장"].some((name) => text.includes(normalize(name)))) return "备注";
  if (["状态", "售卖状态", "销售状态", "status", "是否售出"].some((name) => text.includes(normalize(name)))) return "状态";
  return "";
}

function normalizeSpreadsheetRows(rows = []) {
  const nonEmptyRows = rows.filter((row) => Array.isArray(row) && row.some((cell) => String(cell || "").trim()));
  if (!nonEmptyRows.length) return null;
  const headers = nonEmptyRows[0].map((cell, index) => String(cell || "").trim() || `第${index + 1}列`);
  const dataRows = nonEmptyRows
    .slice(1)
    .map((row) => headers.map((_, index) => String(row[index] || "").trim()))
    .filter((row) => row.some(Boolean));
  if (!headers.length || !dataRows.length) return null;
  return { headers, rows: dataRows };
}

function findFieldMappingTemplate(headers) {
  const signature = getFieldMappingSignature(headers);
  return fieldMappingTemplates.find((template) => template.signature === signature) || null;
}

function getInitialFieldMapping(headers, rows = []) {
  const template = findFieldMappingTemplate(headers);
  return getSmartFieldMapping(headers, rows, template);
}

function parseDelimitedSpreadsheetText(text) {
  const lines = String(text || "")
    .split(/\r?\n/)
    .filter((line) => line.trim());
  const delimiter = lines.join("\n").includes("\t") ? "\t" : ",";
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];
    if (char === '"') {
      if (quoted && next === '"') {
        cell += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (char === delimiter && !quoted) {
      row.push(cell.trim());
      cell = "";
    } else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && next === "\n") index += 1;
      row.push(cell.trim());
      if (row.some(Boolean)) rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += char;
    }
  }
  row.push(cell.trim());
  if (row.some(Boolean)) rows.push(row);
  return rows;
}

async function readSpreadsheetRows(file, dataUrl) {
  const name = String(file.name || "").toLowerCase();
  if (/\.(csv|tsv|txt)$/.test(name)) {
    const text = await file.text();
    return parseDelimitedSpreadsheetText(text);
  }
  const response = await fetch("/api/spreadsheet/preview", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ file: dataUrl, fileName: file.name }),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.message || payload.error || "Excel 表格读取失败。");
  return payload.rows || [];
}

function startFieldMappingPreview({ headers, rows, tables = null, sourceName, sourceUrl, sourceType }) {
  const mapping = getInitialFieldMapping(headers, rows);
  const template = findFieldMappingTemplate(headers);
  fieldMappingDraft = {
    id: `mapping-${Date.now()}`,
    sourceName,
    sourceUrl,
    sourceType,
    headers,
    rows,
    tables: Array.isArray(tables) && tables.length ? tables : [{ columns: headers, rows }],
    mapping,
    signature: getFieldMappingSignature(headers),
    matchedTemplateName: template?.name || "",
  };
  renderFieldMappingPreview();
  saveAndArchiveAppStep(`字段映射预览：${sourceName || currentEvent.name}`, "字段映射");
}

function renderFieldMappingPreview() {
  if (!fieldMappingPanel || !fieldMappingTable) return;
  if (!fieldMappingDraft) {
    fieldMappingPanel.classList.add("hidden");
    fieldMappingTable.innerHTML = "";
    return;
  }
  fieldMappingPanel.classList.remove("hidden");
  fieldMappingTitle.textContent = fieldMappingDraft.sourceName || "字段映射预览";
  const rows = fieldMappingDraft.rows || [];
  const tableCount = Array.isArray(fieldMappingDraft.tables) ? fieldMappingDraft.tables.length : 1;
  fieldMappingSummary.textContent = `${tableCount > 1 ? `共 ${tableCount} 张表，` : ""}当前预览 ${rows.length} 行数据中的前 ${Math.min(3, rows.length)} 行。`;
  fieldMappingStatus.textContent = fieldMappingDraft.matchedTemplateName
    ? `已自动套用模板：${fieldMappingDraft.matchedTemplateName}。你仍可以改下拉菜单后再确认导入。`
    : "没有匹配到旧模板，请选择每一列含义；确认导入后会记住这套表头。";
  const previewRows = rows.slice(0, 3);
  fieldMappingTable.innerHTML = `
    <div class="mapping-grid" style="--mapping-columns:${fieldMappingDraft.headers.length}">
      ${fieldMappingDraft.headers
        .map(
          (header, index) => `
            <div class="mapping-cell mapping-head">
              <strong>${escapeHtml(header || `第${index + 1}列`)}</strong>
              <select data-field-mapping-index="${index}">
                ${FIELD_MAPPING_OPTIONS.map(
                  (option) => `<option value="${escapeHtml(option.value)}" ${fieldMappingDraft.mapping[index] === option.value ? "selected" : ""}>${escapeHtml(option.label)}</option>`,
                ).join("")}
              </select>
            </div>
          `,
        )
        .join("")}
      ${previewRows
        .flatMap((row) =>
          fieldMappingDraft.headers.map(
            (_, index) => `<div class="mapping-cell">${escapeHtml(row[index] || "") || "<span>空</span>"}</div>`,
          ),
        )
        .join("")}
    </div>
  `;
}

function saveFieldMappingTemplate(draft) {
  const signature = draft.signature || getFieldMappingSignature(draft.headers);
  const template = {
    signature,
    name: draft.sourceName || `字段模板 ${fieldMappingTemplates.length + 1}`,
    headers: [...draft.headers],
    mapping: [...draft.mapping],
    updatedAt: Date.now(),
  };
  const existingIndex = fieldMappingTemplates.findIndex((item) => item.signature === signature);
  if (existingIndex >= 0) {
    fieldMappingTemplates[existingIndex] = template;
  } else {
    fieldMappingTemplates.unshift(template);
  }
}

function createMappedTableFromDraft(draft, sourceTable = null) {
  const selected = draft.mapping.map((field, index) => ({ field, index })).filter((item) => item.field);
  const columns = [...new Set(selected.map((item) => item.field))];
  const sourceColumns = sourceTable?.columns || draft.headers || [];
  const sourceRows = sourceTable?.rows || draft.rows || [];
  const rows = sourceRows
    .map((row) =>
      columns.map((column) => {
        const source = selected.find((item) => item.field === column);
        return source ? row[source.index] || "" : "";
      }),
    )
    .filter((row) => row.some(Boolean));
  return {
    columns,
    rows,
    originalColumns: [...sourceColumns],
    originalRows: sourceRows.map((row) => sourceColumns.map((_, index) => row[index] || "")),
  };
}

function confirmFieldMappingImport() {
  if (!fieldMappingDraft) {
    showToast("没有待确认的字段映射。", "error");
    return;
  }
  const requiredFields = ["区域", "售价"];
  const missingFields = requiredFields.filter((field) => !fieldMappingDraft.mapping.includes(field));
  if (missingFields.length) {
    showToast(`请至少映射：${missingFields.join("、")}。`, "error");
    return;
  }
  const mappedTables = (fieldMappingDraft.tables || [{ columns: fieldMappingDraft.headers, rows: fieldMappingDraft.rows }])
    .map((table) => ({ ...createMappedTableFromDraft(fieldMappingDraft, table), sourcePage: table.sourcePage, sourcePart: table.sourcePart }))
    .filter((table) => table.rows.length);
  if (!mappedTables.length) {
    showToast("映射后没有可导入的数据。", "error");
    return;
  }
  const mappingSourceName = fieldMappingDraft.sourceName || currentEvent.name;
  saveFieldMappingTemplate(fieldMappingDraft);
  const rawTables = createUploadedTables(mappedTables);
  const removedSoldRows = rawTables.reduce((count, table) => count + removeSoldRowsFromTable(table), 0);
  const tables = rawTables.filter((table) => table.rows.length);
  pendingTables.unshift(...tables);
  selectedPendingTableId = tables[0]?.id || selectedPendingTableId;
  fieldMappingDraft = null;
  renderFieldMappingPreview();
  setUploadStatus(`已按字段映射生成 ${tables.length} 张待确认表${removedSoldRows ? `，已跳过 ${removedSoldRows} 条已售/表尾说明行` : ""}。`, "success");
  showToast("字段映射已保存，表格已进入待确认。", "success");
  saveAndArchiveAppStep(`字段映射导入：${mappingSourceName}`, "生成待确认");
  renderUploadRecords();
  renderReviewPanel();
  renderPublishedTables();
  renderAdminEvent();
  uploadRecords.scrollIntoView({ behavior: "smooth", block: "start" });
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
  activeTicketOcrPollInFlight = false;
}

function getRecoverableOcrTextFromState(state) {
  const draftText = String(state?.uploadDraft?.tableText || "");
  if (draftText.trim()) return draftText;
  const snapshot = state?.ocrJobState?.lastTicketOcrJobSnapshot || null;
  const savedText = String(snapshot?.savedOcrText || "");
  if (savedText.trim()) return savedText;
  const finalText = String(snapshot?.text || "");
  if (finalText.trim()) return finalText;
  const partialText = String(snapshot?.partialText || "");
  return partialText.trim() ? partialText : "";
}

function rememberCurrentOcrText(extra = {}) {
  const text = String(uploadTableText.value || "");
  if (!text.trim()) return false;
  const previous = lastTicketOcrJobSnapshot || {};
  lastTicketOcrJobSnapshot = {
    ...previous,
    ...extra,
    savedOcrText: text,
    partialText: text,
    text: extra.final === true ? text : String(previous.text || ""),
    omittedLargeText: false,
    savedOcrTextAt: Date.now(),
  };
  return true;
}

function persistCurrentOcrTextNow(extra = {}) {
  rememberCurrentOcrText(extra);
  return saveAppState();
}

function setRecognizedOcrText(text, { final = false, snapshot = null } = {}) {
  const nextText = String(text || "");
  if (!nextText.trim()) return false;
  const currentText = String(uploadTableText.value || "");
  if (final || nextText.length >= currentText.length) uploadTableText.value = nextText;
  rememberCurrentOcrText({ ...(snapshot || {}), final });
  saveAppState();
  return true;
}

async function autoGeneratePendingTablesFromOcr(result, jobId) {
  const effectiveJobId = result?.id || jobId || "";
  if (!effectiveJobId || autoPendingGenerationJobId === effectiveJobId) return;
  if (!uploadedSource || fieldMappingDraft || uploadPendingGenerationBusy) return;
  const recognizedText = result?.text || result?.partialText || uploadTableText.value || "";
  if (!recognizedText.trim()) return;
  const parsedTables = splitRecognizedTables(recognizedText);
  if (!parsedTables.length) return;
  autoPendingGenerationJobId = effectiveJobId;
  pdfDetectionStatus.textContent = "PDF 表格已识别，正在自动生成待确认表并进行本地行底色校对...";
  setUploadStatus("OCR 已完成，正在自动生成待确认表...", "loading");
  try {
    await publishUpload();
  } catch (error) {
    autoPendingGenerationJobId = null;
    pdfDetectionStatus.textContent = error.message || "自动生成待确认表失败，请手动点击生成待确认表。";
    setUploadStatus("自动生成待确认表失败，请手动点击生成待确认表。", "error");
    showToast("自动生成待确认表失败。", "error");
  }
}

function buildFailedOcrReport(result = lastTicketOcrJobSnapshot) {
  if (!result) return "";
  const errors = result.errors || [];
  const failedPages = result.failedPages || errors.map((item) => item.page);
  const aiColorErrors = result.aiColorErrors || [];
  const describeFailureStage = (stage) => {
    if (stage === "render") return "PDF渲染失败";
    if (stage === "ocr") return "OCR识别失败";
    return "识别失败";
  };
  return [
    `文件：${result.fileName || uploadedSource?.name || "未知文件"}`,
    `任务：${result.id || activeTicketOcrJobId || "未知任务"}`,
    `总页数：${result.totalPages || result.pagesQueued || "未知"}`,
    `已处理：${result.pagesProcessed || 0}`,
    `成功页：${result.pagesSucceeded || 0}`,
    `失败页：${result.pagesFailed || failedPages.length || 0}`,
    failedPages.length ? `失败页码：${failedPages.join("、")}` : "失败页码：无",
    "",
    "失败原因：",
    ...(errors.length ? errors.map((item) => `PDF 第 ${item.page} 页 · ${describeFailureStage(item.stage)}：${item.message || "识别接口未返回可用表格内容"}`) : ["无"]),
    "",
    "AI 底色复核失败：",
    ...(aiColorErrors.length ? aiColorErrors.map((item) => `PDF 第 ${item.page} 页：${item.message || "AI 视觉复核失败"}`) : ["无"]),
    "",
    "已识别内容：",
    result.partialText || result.text || uploadTableText.value || "暂无",
  ].join("\n");
}

function renderFailedOcrPanel(result = null) {
  if (result) lastTicketOcrJobSnapshot = result;
  const snapshot = result || lastTicketOcrJobSnapshot;
  const errors = snapshot?.errors || [];
  const failedPages = snapshot?.failedPages || errors.map((item) => item.page);
  const aiColorErrors = snapshot?.aiColorErrors || [];
  const hasFailed = failedPages.length > 0;
  failedOcrPanel.classList.toggle("hidden", !snapshot || !hasFailed);
  if (!snapshot || !hasFailed) {
    failedOcrSummary.textContent = "暂无失败页";
    failedOcrList.innerHTML = "";
    failedOcrData.value = "";
    return;
  }

  failedOcrSummary.textContent = `${snapshot.fileName || "当前 PDF"} · ${failedPages.length} 页失败`;
  failedOcrList.innerHTML = [
    ...errors.map((item) => ({ ...item, kind: item.stage === "render" ? "PDF 渲染" : "OCR" })),
    ...aiColorErrors.map((item) => ({ ...item, kind: "AI 底色复核" })),
  ]
    .map(
      (item) => `
        <div class="failed-ocr-item">
          <strong>${escapeHtml(item.kind)} · PDF 第 ${item.page} 页</strong>
          <span>${escapeHtml(item.message || "识别接口未返回可用表格内容")}</span>
        </div>
      `,
    )
    .join("");
  failedOcrData.value = buildFailedOcrReport(snapshot);
  retryFailedOcrButton.disabled = !(snapshot.id || activeTicketOcrJobId);
}

async function pollTicketOcrJob(jobId) {
  if (activeTicketOcrPollInFlight) return;
  activeTicketOcrPollInFlight = true;
  try {
    const response = await fetch(`/api/tables/recognize/job?id=${encodeURIComponent(jobId)}`);
    const result = await response.json();
    if (!response.ok) {
      const error = new Error(result.message || result.error || "批量识别任务查询失败。");
      if (response.status === 404 && handleInterruptedTicketOcrJob(error)) return;
      throw error;
    }
    renderFailedOcrPanel(result);
    const total = result.pagesQueued || result.totalPages || 0;
    const processed = result.pagesProcessed || 0;
    const success = result.pagesSucceeded || 0;
    const failed = result.pagesFailed || 0;
    const progressText = total ? `${processed}/${total}` : `${processed}`;
    const aiQueued = Number(result.aiColorPagesQueued || 0);
    const aiProcessed = Number(result.aiColorPagesProcessed || 0);
    const aiFailed = Number(result.aiColorPagesFailed || 0);
    const aiProgressText = aiQueued ? `，AI 复核 ${aiProcessed}/${aiQueued} 页${aiFailed ? `，AI 失败 ${aiFailed} 页` : ""}` : "";
    const ppQueued = Number(result.ppStructurePagesQueued || 0);
    const ppProcessed = Number(result.ppStructurePagesProcessed || 0);
    const ppFailed = Number(result.ppStructurePagesFailed || 0);
    const ppProgressText = ppQueued ? `，结构复核 ${ppProcessed}/${ppQueued} 页${ppFailed ? `，结构失败 ${ppFailed} 页` : ""}` : "";
    const partialText = result.partialText || result.text || "";
    if (partialText) setRecognizedOcrText(partialText, { snapshot: result });
    pdfDetectionStatus.textContent = result.message || `正在批量识别 ${progressText} 页。`;
    const failedDetail = failed && result.failedPages?.length ? `，失败页：${result.failedPages.slice(0, 24).join("、")}${result.failedPages.length > 24 ? "..." : ""}` : "";
    setUploadStatus(`批量识别进度：${progressText} 页，已读到 ${success} 页内容${aiProgressText}${ppProgressText}${failed ? `，失败 ${failed} 页` : ""}${failedDetail}。`, "loading");
    scheduleAppStateSave(0);

    if (result.status === "done") {
      stopTicketOcrPolling();
      activeTicketOcrJobId = result.id || jobId;
      setRecognizedOcrText(result.text || result.partialText || "", { final: true, snapshot: result });
      pdfDetectionStatus.textContent = `${result.message} 已自动填入下方表格内容，正在自动生成待确认表。`;
      setUploadStatus(
        failed
          ? `批量 PDF 已完成，成功 ${success} 页，失败 ${failed} 页。正在先生成成功页的待确认表，失败页可稍后补扫。`
          : "批量 PDF 表格已识别，正在自动生成待确认表。",
        "loading",
      );
      showToast("批量识别完成，正在生成待确认表。", "success");
      saveAndArchiveAppStep(`PDF OCR 完成：${result.fileName || uploadedSource?.name || "票源 PDF"}`, "PDF OCR");
      await autoGeneratePendingTablesFromOcr(result, jobId);
      return;
    }

    if (result.status === "error") {
      stopTicketOcrPolling();
      activeTicketOcrJobId = result.id || jobId;
      if (partialText) {
        setRecognizedOcrText(partialText, { snapshot: result });
        pdfDetectionStatus.textContent = `${result.message || "批量识别中断"} 已保留已识别页面内容，可先生成待确认表。`;
        setUploadStatus(`批量识别中断，但已保留 ${success} 页内容。失败 ${failed} 页可稍后补扫。`, "error");
        showToast("已保留部分识别结果。", "error");
        saveAndArchiveAppStep(`PDF OCR 部分完成：${result.fileName || uploadedSource?.name || "票源 PDF"}`, "PDF OCR");
        return;
      }
      throw new Error(result.message || "批量识别没有读到可用表格内容。");
    }

    activeTicketOcrPollTimer = setTimeout(() => {
      activeTicketOcrPollTimer = null;
      pollTicketOcrJob(jobId).catch((error) => {
        if (handleInterruptedTicketOcrJob(error)) return;
        stopTicketOcrPolling();
        pdfDetectionStatus.textContent = error.message || "批量识别失败，请重试。";
        setUploadStatus("批量识别失败，请重试或手动粘贴 OCR 文本。", "error");
        showToast("批量识别失败。", "error");
      });
    }, 1200);
  } finally {
    activeTicketOcrPollInFlight = false;
  }
}

function handleInterruptedTicketOcrJob(error) {
  const recognizedText = String(uploadTableText.value || "").trim();
  if (!recognizedText) return false;
  stopTicketOcrPolling();
  retryFailedOcrButton.disabled = true;
  pdfDetectionStatus.textContent = `${error?.message || "批量识别任务已中断"}；已保留已读 OCR 文本，可直接点“快速人工生成”。`;
  setUploadStatus("批量识别任务已中断，但已保留已读 OCR 文本；可直接快速人工生成。", "error");
  showToast("已保留 OCR 文本，可快速人工生成。", "error");
  persistCurrentOcrTextNow({ status: lastTicketOcrJobSnapshot?.status || "interrupted" });
  return true;
}

async function refreshTicketOcrJobSnapshot(jobId) {
  const response = await fetch(`/api/tables/recognize/job?id=${encodeURIComponent(jobId)}`);
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || result.error || "批量识别任务查询失败。");
  activeTicketOcrJobId = result.id || jobId;
  renderFailedOcrPanel(result);
  return result;
}

function resumeTicketOcrPollingIfNeeded() {
  const jobId = activeTicketOcrJobId || lastTicketOcrJobSnapshot?.id || "";
  const status = String(lastTicketOcrJobSnapshot?.status || "");
  if (!jobId || activeTicketOcrPollTimer || activeTicketOcrPollInFlight || status === "done" || status === "error") return;
  activeTicketOcrPollTimer = setTimeout(() => {
    activeTicketOcrPollTimer = null;
    pollTicketOcrJob(jobId).catch((error) => {
      if (handleInterruptedTicketOcrJob(error)) return;
      stopTicketOcrPolling();
      pdfDetectionStatus.textContent = error.message || "批量识别失败，请重试。";
      setUploadStatus("批量识别失败，请重试或手动粘贴 OCR 文本。", "error");
      showToast("批量识别失败。", "error");
    });
  }, 250);
}

function resumeRestoredTicketOcrJobIfNeeded() {
  const jobId = activeTicketOcrJobId || lastTicketOcrJobSnapshot?.id || "";
  if (!jobId) return;
  const status = String(lastTicketOcrJobSnapshot?.status || "");
  if (status === "done") {
    autoGeneratePendingTablesFromOcr(lastTicketOcrJobSnapshot, jobId).catch((error) => {
      console.warn("Restored OCR auto-generation skipped.", error);
      setUploadStatus("OCR 已恢复，但自动生成确认表失败；可以手动点击生成。", "error");
    });
    return;
  }
  if (status === "error") return;
  pdfDetectionStatus.textContent = "已恢复上次 OCR 任务，正在继续查询进度...";
  setUploadStatus("已恢复上次 OCR 任务，正在继续查询进度。", "loading");
  resumeTicketOcrPollingIfNeeded();
}

async function recognizeTicketSource(file, detectedTables) {
  const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
  if (!isPdf) return;
  stopTicketOcrPolling();
  lastTicketOcrJobSnapshot = null;
  renderFailedOcrPanel(null);
  const sourceUrl = uploadedSource?.sourceFile === file ? uploadedSource.url || "" : uploadedSource?.url || "";
  const dataUrl = String(sourceUrl || "").startsWith("uploads/") ? "" : await readFileAsDataUrl(file);
  const estimatedPages = Math.max(detectedTables || 1, 1);
  setUploadStatus(`正在创建批量识别任务，预计处理整份 PDF（约 ${estimatedPages} 页）...`, "loading");
  pdfDetectionStatus.textContent = `PDF 约 ${estimatedPages} 页，正在创建完整批量 OCR 任务。`;
  const response = await fetch("/api/tables/recognize/start", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ file: dataUrl, sourceUrl, fileName: file.name, detectedPages: detectedTables }),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || result.error || "PDF 批量识别任务创建失败。");
  activeTicketOcrJobId = result.id;
  renderFailedOcrPanel(result);
  scheduleAppStateSave(0);
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
  return [...getBuiltInSeatmapTemplates(), ...externalSeatmapTemplates, ...seatmapTemplates];
}

function getTemplateZonesForSize(template, targetSize = template.size) {
  return createTemplateZones(
    template.zones.map((zone) => ({ id: zone.id, label: zone.label, aliases: zone.aliases, points: zone.polygon })),
    template.size,
    targetSize,
  );
}

function normalizeExternalSeatmapTemplate(rawTemplate) {
  if (!rawTemplate || typeof rawTemplate !== "object") return null;
  const size = rawTemplate.size || {};
  const width = Number(size.width);
  const height = Number(size.height);
  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) return null;
  const zones = Array.isArray(rawTemplate.zones)
    ? rawTemplate.zones
        .map((zone) => {
          const polygon = Array.isArray(zone?.polygon) ? zone.polygon : Array.isArray(zone?.points) ? zone.points : [];
          const normalizedPolygon = polygon
            .map((point) => (Array.isArray(point) ? [Number(point[0]), Number(point[1])] : null))
            .filter((point) => point && Number.isFinite(point[0]) && Number.isFinite(point[1]));
          const label = String(zone?.label || zone?.id || "").trim();
          if (!label || normalizedPolygon.length < 3) return null;
          return {
            id: String(zone.id || label),
            label,
            aliases: Array.isArray(zone.aliases) ? zone.aliases.map(String) : [label],
            polygon: normalizedPolygon,
            source: "template-file",
          };
        })
        .filter(Boolean)
    : [];
  if (!zones.length) return null;
  const name = String(rawTemplate.name || rawTemplate.eventName || rawTemplate.fileName || "座位图模板").trim();
  return {
    id: String(rawTemplate.id || `template-file-${slugify(name)}`),
    name,
    fileName: rawTemplate.fileName || rawTemplate.seatmapFileName || "",
    eventName: rawTemplate.eventName || "",
    seatmapImage: rawTemplate.seatmapImage || rawTemplate.image || "",
    seatmapFileName: rawTemplate.seatmapFileName || rawTemplate.fileName || "",
    size: { width, height },
    zones,
    fingerprint: rawTemplate.fingerprint || "",
    keywords: Array.isArray(rawTemplate.keywords) ? rawTemplate.keywords.map(String) : [],
    builtIn: true,
    external: true,
    createdAt: rawTemplate.createdAt || 0,
  };
}

async function loadExternalSeatmapTemplates() {
  try {
    const response = await fetch("/api/seatmap/templates");
    if (!response.ok) throw new Error("模板文件读取失败");
    const result = await response.json();
    externalSeatmapTemplates = (Array.isArray(result.templates) ? result.templates : []).map(normalizeExternalSeatmapTemplate).filter(Boolean);
    if (!externalSeatmapTemplates.length) {
      const fallbackFiles = ["bigbang-goyang.json", "bigbang-singapore.json", "itzy-venetian.json", "nct-dream-10th-fm.json", "weeknd-goyang.json", "exo-encore.json"];
      const fallbackTemplates = await Promise.all(
        fallbackFiles.map((fileName) =>
          fetch(`/seatmap-templates/${fileName}`)
            .then((templateResponse) => (templateResponse.ok ? templateResponse.json() : null))
            .catch(() => null),
        ),
      );
      externalSeatmapTemplates = fallbackTemplates.map(normalizeExternalSeatmapTemplate).filter(Boolean);
    }
    const repaired = events.reduce((count, event) => count + (repairKnownEventTemplateMismatch(event) ? 1 : 0), 0);
    const synced = events.reduce((count, event) => count + (syncBuiltInSeatmapTemplate(event) || syncKnownExternalSeatmapTemplate(event) ? 1 : 0), 0);
    if (synced || repaired) saveAppState();
    renderAdminEvent();
    render();
  } catch (error) {
    console.warn("Seatmap template files unavailable", error);
    if (templateLibrarySummary) {
      templateLibrarySummary.textContent = "模板文件夹暂时读取失败，已保留内置模板和自建模板。";
    }
  }
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

const GENERIC_TEMPLATE_KEYWORDS = new Set(["bigbang", "itzy", "tws", "twice", "concert", "tour", "world tour", "座位图", "seatmap"]);
const DISABLED_AUTO_SEATMAP_TEMPLATE_IDS = new Set(["builtin-nct-dream-10th-fm"]);

function isGenericTemplateKeyword(keyword) {
  return GENERIC_TEMPLATE_KEYWORDS.has(normalizeTemplateName(keyword));
}

function isSeatmapTemplateAutoDisabled(templateId) {
  return DISABLED_AUTO_SEATMAP_TEMPLATE_IDS.has(String(templateId || ""));
}

function getTemplateMatchScore(template, source) {
  const templateName = normalizeTemplateName(`${template.name} ${template.fileName} ${template.eventName || ""}`);
  const sourceName = normalizeTemplateName(`${source.fileName || ""} ${currentEvent?.name || ""} ${currentEvent?.seatmapTitle || ""}`);
  const size = source.size || currentEvent.seatmapSize;
  const templateRatio = template.size.width / template.size.height;
  const sourceRatio = size.width / size.height;
  const ratioPenalty = Math.abs(templateRatio - sourceRatio) * 100;
  const keywordHit = (template.keywords || []).some((keyword) => {
    if (isGenericTemplateKeyword(keyword)) return false;
    return sourceName.includes(normalizeTemplateName(keyword));
  });
  const nameHit = sourceName && templateName && (sourceName.includes(templateName) || templateName.includes(sourceName));
  const fingerprintDistance = template.fingerprint && source.fingerprint ? getHexDistance(template.fingerprint, source.fingerprint) : Infinity;
  if (fingerprintDistance <= 8) return { template, score: fingerprintDistance + ratioPenalty, reason: "图片指纹匹配" };
  if (keywordHit || nameHit) return { template, score: 20 + ratioPenalty + (template.builtIn ? -8 : 0), reason: "名称匹配" };
  if (template.builtIn && Math.abs(templateRatio - sourceRatio) <= 0.012) {
    return { template, score: 52 + ratioPenalty, reason: "图片比例匹配" };
  }
  return null;
}

function findBestSeatmapTemplate(source = {}) {
  const matches = getAllSeatmapTemplates()
    .filter((template) => !isSeatmapTemplateAutoDisabled(template.id))
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
  resetSeatmapTestStatus(`${reason}套用后需要逐区测试`);
  selectedDateId = null;
  selectedZone = null;
  hoveredZone = null;
  const imageText = templateImage ? "座位图和热区" : "热区";
  zoneMarkingStatus.textContent = `${reason}已套用：${template.name}，已带入${imageText}，共 ${currentEvent.zones.length} 个精准热区。`;
  seatmapStatus.textContent = `已套用模板：${template.name}。发布票源前必须前台逐区测试通过。`;
  saveAndArchiveAppStep(`套用座位图模板：${template.name}`, "座位图");
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
  if (!saveAndArchiveAppStep(`保存座位图模板：${template.name}`, "座位图模板")) return null;
  renderSeatmapTemplates();
  renderAdminChecklist();
  if (!auto) showToast("已保存整套座位图模板。", "success");
  return template;
}

function renderSeatmapTemplates() {
  if (!templateLibrarySummary || !seatmapTemplateList) return;
  const templates = getAllSeatmapTemplates().sort((a, b) => {
    const left = normalizeTemplateName(a.name || a.eventName || a.fileName || "");
    const right = normalizeTemplateName(b.name || b.eventName || b.fileName || "");
    return left.localeCompare(right, "en", { numeric: true, sensitivity: "base" });
  });
  const userTemplateCount = seatmapTemplates.length;
  const fileTemplateCount = externalSeatmapTemplates.length;
  templateLibrarySummary.textContent = templates.length
    ? `${templates.length} 个 · 文件 ${fileTemplateCount} · 自建 ${userTemplateCount}`
    : "暂无模板";
  if (toggleTemplateLibraryButton) {
    toggleTemplateLibraryButton.textContent = templateLibraryOpen ? "收起模板大全" : `模板大全 ${templates.length} 个`;
  }
  seatmapTemplateList.hidden = !templateLibraryOpen;
  seatmapTemplateList.classList.toggle("collapsed", !templateLibraryOpen);
  seatmapTemplateList.innerHTML = templates
    .map(
      (template) => {
        const sourceText = template.external ? " · 模板文件" : template.builtIn ? " · 内置" : "";
        return `
        <div class="template-item ${template.id === currentEvent.seatmapTemplateId ? "active" : ""}">
          <span class="template-item-main">
            <b>${escapeHtml(template.name)}</b>
            <small>${getTemplateSeatmapImage(template) ? "含图" : "仅热区"} · ${template.size.width}x${template.size.height} · ${template.zones.length} 热区${sourceText}</small>
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
      `;
      },
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

function uniqueCleanValues(values) {
  return [...new Set(values.map((value) => String(value || "").trim()).filter(Boolean))];
}

function splitLocationParts(location = "") {
  const parts = String(location)
    .split(/[·|｜@]/)
    .map((part) => part.trim())
    .filter(Boolean);
  return {
    city: parts[0] || "",
    venue: parts.slice(1).join(" · ") || "",
  };
}

function getEventArtist(event) {
  if (event.artist) return event.artist;
  const { city } = splitLocationParts(event.location);
  if (city && event.name.endsWith(city)) return event.name.slice(0, -city.length).trim();
  return event.name;
}

function getEventCity(event) {
  return event.city || splitLocationParts(event.location).city || "";
}

function getEventVenue(event) {
  return event.venueLocal || event.venue || splitLocationParts(event.location).venue || "";
}

function mergeEventDraftHistory(seed = eventDraftHistory) {
  eventDraftHistory = {
    artists: uniqueCleanValues([...(seed.artists || []), ...events.map(getEventArtist)]),
    cities: uniqueCleanValues([...(seed.cities || []), ...events.map(getEventCity)]),
    venues: uniqueCleanValues([...(seed.venues || []), ...events.map(getEventVenue)]),
  };
}

function renderEventDraftHistory() {
  mergeEventDraftHistory();
  eventArtistHistory.innerHTML = eventDraftHistory.artists.map((value) => `<option value="${escapeHtml(value)}"></option>`).join("");
  eventCityHistory.innerHTML = eventDraftHistory.cities.map((value) => `<option value="${escapeHtml(value)}"></option>`).join("");
  eventVenueHistory.innerHTML = eventDraftHistory.venues.map((value) => `<option value="${escapeHtml(value)}"></option>`).join("");
}

function findQuantityColumnIndex(columns = []) {
  return columns.findIndex((column) => isQuantityColumnName(column));
}

function isFaceValueColumnName(column = "") {
  const text = normalize(column);
  if (/票面(位置|排数|排|号段|号码|座位|座号)|门票(位置|排数|排|号段|号码)|座位图|座席图|seat\s*map|seatmap/i.test(String(column || ""))) return false;
  return ["票面", "票价", "价位", "面值", "席位", "席别", "席別", "座席", "类型", "类别", "face", "category", "cat", "좌석", "등급", "구분", "석"].some((name) =>
    text.includes(normalize(name)),
  );
}

function findFaceValueColumnIndexes(columns = []) {
  return columns.map((column, index) => (isFaceValueColumnName(column) ? index : -1)).filter((index) => index >= 0);
}

function getFirstFaceValue(table, row) {
  const indexes = findFaceValueColumnIndexes(table?.columns || []);
  const index = indexes.find((item) => String(row?.[item] || "").trim());
  return index >= 0 ? row[index] : "";
}

function getFirstFaceValueFromTicket(ticket) {
  const current = getFirstFaceValue(ticket?.table, ticket?.row);
  if (String(current || "").trim()) return current;
  const originalColumns = ticket?.table?.originalColumns || [];
  const originalRow = Array.isArray(ticket?.table?.originalRows) && ticket.table.originalRows[ticket.index] ? ticket.table.originalRows[ticket.index] : null;
  if (!originalRow) return "";
  const indexes = findFaceValueColumnIndexes(originalColumns);
  const index = indexes.find((item) => String(originalRow[item] || "").trim());
  return index >= 0 ? originalRow[index] : "";
}

function isGenericFaceValue(value) {
  const text = normalize(value);
  if (!text) return false;
  return /^(floor|standing|stand|vip|vipseat|vipstanding|内场|內場|看台|看臺|座席|席位|配送|配达|配達|转寄|轉寄|电子票|電子票|纸质票|紙質票)$/.test(text);
}

function isSalePriceColumnName(column = "") {
  const text = normalize(column);
  if (!text || isFaceValueColumnName(column) || isInternalColorColumn(column)) return false;
  if (["售", "售价", "售價", "单", "單", "单价", "單價", "价", "價格", "价格", "报价", "報價", "金额", "金額"].includes(text)) return true;
  return /(售价|售價|单价|單價|价格|價格|报价|報價|金额|金額|售\/张|售\/張|price|ask|가격|금액)/i.test(text);
}

function isExplicitSalePriceColumnName(column = "") {
  const text = normalize(column);
  if (!text || isFaceValueColumnName(column) || isInternalColorColumn(column)) return false;
  if (["售", "售价", "售價", "报价", "報價", "卖价", "賣價", "出价", "出價", "ask"].includes(text)) return true;
  return /(售价|售價|售出价|售出價|出售价|出售價|销售价|銷售价|卖价|賣價|报价|報價|售\/张|售\/張|ask|saleprice|sellprice|sellingprice)/i.test(
    column,
  );
}

function isGenericPriceColumnName(column = "") {
  const text = normalize(column);
  if (!isSalePriceColumnName(column) || isExplicitSalePriceColumnName(column)) return false;
  return ["单", "單", "单价", "單價", "价", "價格", "价格", "金额", "金額", "price", "가격", "금액"].includes(text) ||
    /(单价|單價|价格|價格|金额|金額|price|가격|금액)/i.test(column);
}

function isQuantityColumnName(column = "") {
  const text = normalize(column);
  return ["数量", "张数", "張數", "连坐", "連坐", "连坐数量", "count", "qty", "매수", "수량", "장수", "연석"].some((name) =>
    text.includes(normalize(name)),
  );
}

function isSeatPositionColumnName(column = "") {
  return /(票面|门票|座位|座席)?(位置|排数|排|号段|号码|座位号|座号)|seat\s*(position|row|number)|seatmap|座位图|座席图/i.test(String(column || ""));
}

function isSeatmapImageColumnName(column = "") {
  return /座位图|座席图|seat\s*map|seatmap/i.test(String(column || ""));
}

function isSeatLocationColumnName(column = "") {
  const text = normalize(column);
  if (!text) return false;
  if (isSeatmapImageColumnName(column) || /seatmap|map/.test(text)) return false;
  return /(位置|席位|座位位置|座席位置|票面位置|门票位置|location|seatposition|구역|구|열|좌석|위치)/i.test(String(column || "")) || /^位置$/.test(text);
}

function isProtectedNonPriceColumnName(column = "") {
  const text = normalize(column);
  if (!text) return false;
  if (isSalePriceColumnName(column)) return false;
  return (
    isQuantityColumnName(column) ||
    isDeliveryColumnName(column) ||
    isSeatPositionColumnName(column) ||
    /^(序号|编号|no|num|id)$/.test(text) ||
    /(日期|演出日期|时间|date|day|일자|날짜|시간|区域|区|位置|구역|block|section|zone|area|排|排数|行|行数|row|열|座位号|座位|座号|号段|号码|大小号|seat|number|번호|좌석번호|备注|remark|note|说明|비고|메모|참고|状态|status|售卖状态|销售状态|是否售出|底色|颜色)/i.test(
      column,
    )
  );
}

function extractSalePriceText(value, { minPrice = 1000 } = {}) {
  const raw = String(value || "").trim();
  const hasCurrency = /[￥¥$€£₩]/.test(raw);
  if (!raw || isSoldText(raw, { strict: true }) || (!hasCurrency && isLikelyDateValue(raw)) || isLikelyRowColorValue(raw)) return "";
  const minDigits = Number(minPrice) < 1000 ? 3 : 4;
  const pricePattern = new RegExp(`[￥¥$€£₩]?\\s*\\d{1,3}(?:[,，]\\d{3})+(?:\\.\\d+)?|[￥¥$€£₩]?\\s*\\d{${minDigits},7}(?:\\.\\d+)?`, "g");
  const matches = raw.match(pricePattern) || [];
  const price = matches.find((match) => {
    const number = extractNumber(match);
    return number !== null && number >= minPrice;
  });
  return price ? price.replace(/\s+/g, "") : "";
}

function isLikelySalePriceValue(value, options = {}) {
  const text = String(value || "").trim();
  if (!text || isSoldText(text, { strict: true })) return false;
  if (!/[￥¥$€£₩]/.test(text) && isLikelyDateValue(text)) return false;
  const minPrice = Number(options.minPrice || 1000);
  const priceText = extractSalePriceText(text, { minPrice });
  const number = extractNumber(priceText);
  return number !== null && number >= minPrice;
}

function isSalePriceCandidateValue(value) {
  const text = String(value || "").trim();
  if (!text || isSoldText(text, { strict: true }) || (!/[￥¥$€£₩]/.test(text) && isLikelyDateValue(text)) || isLikelyRowColorValue(text)) return false;
  const priceText = extractSalePriceText(text, { minPrice: 100 });
  const number = extractNumber(priceText);
  return number !== null && number >= 100;
}

function isLikelySeatCountValue(value) {
  const text = String(value || "").trim().toLowerCase();
  if (!text || isSoldText(text, { strict: true }) || isLikelyRowColorValue(text)) return false;
  if (/[￥¥$€£₩]/.test(text) || /[,，]/.test(text)) return false;
  if (/^\d+$/.test(text)) return Number(text) > 0 && Number(text) <= 20;
  if (/^\d+\s*(张|连)$/.test(text)) return true;
  if (/^[一二三四五六七八九十]\s*(张|连)?$/.test(text)) return true;
  if (/^(单|单张|一张|两张|二连|三连|四连|五连|隔一连|可拆|连坐)$/i.test(text)) return true;
  if (/^\d+\s*\+\s*\d+$/.test(text)) return true;
  return false;
}

function isLikelySeatRowValue(value) {
  const text = String(value || "").trim();
  if (!text || isSoldText(text, { strict: true }) || isLikelyRowColorValue(text)) return false;
  if (isLikelySalePriceValue(text)) return false;
  if (extractSeatRowFromText(text)) return true;
  if (/^(ga|floor|standing|内场)$/i.test(text)) return true;
  if (/^[a-z]$/i.test(text)) return true;
  if (/^[a-z]\s*[（(].+[）)]$/i.test(text)) return true;
  if (/^[pqkmhfedcbas]\s*排?$/i.test(text)) return true;
  if (/^\d{1,2}\s*(排|row)?$/i.test(text)) return true;
  if (/^\d{1,2}\s*排?\s*(?:实际)?第?\d{1,2}\s*排?$/.test(text)) return true;
  return false;
}

function isLikelySeatNumberValue(value) {
  const text = String(value || "").trim();
  if (!text || isSoldText(text, { strict: true }) || isLikelyRowColorValue(text)) return false;
  if (extractSeatNumberFromText(text)) return true;
  if (/^\d{1,4}$/.test(text)) return true;
  if (/^\d{1,4}\s*[-~到至]\s*\d{1,4}(?:号)?$/.test(text)) return true;
  if (/^\d+x$/i.test(text)) return true;
  if (/^\d*x\s*号$/i.test(text)) return true;
  if (/^\d+x\s*[（(].+[）)]$/i.test(text)) return true;
  if (/^x$/i.test(text)) return true;
  if (/^x\s*号$/i.test(text)) return true;
  if (/^x\s*[（(].+[）)]$/i.test(text)) return true;
  return false;
}

function isLikelyZoneCode(value) {
  const composite = parseCompositeSeatInfo(value);
  if (composite?.zone) return true;
  const text = cleanZoneToken(value);
  if (!text || isSoldText(text, { strict: true }) || isLikelyRowColorValue(text)) return false;
  if (/^\d{1,2}$/.test(text)) return false;
  if (/^\d{3}[a-z]?$/i.test(text)) return true;
  if (/^[a-z]{1,3}\d+[a-z]?$/i.test(text)) return true;
  if (/^[a-z]\d$/i.test(text)) return true;
  if (/^(fe|fw|floor|standing|vip|pb\d+|pc\d+|pd\d+|pe\d+|pen[a-z]\d*|r\d+|z\d+|e\d+|b\d+)$/i.test(text)) return true;
  return false;
}

function isLikelyRowColorValue(value) {
  return Boolean(normalizeRowColorLabel(value));
}

function getColumnFilledValues(table, columnIndex) {
  return (table.rows || []).map((row) => row[columnIndex]).filter((value) => String(value || "").trim());
}

function columnRatio(table, columnIndex, predicate) {
  const values = getColumnFilledValues(table, columnIndex);
  if (!values.length) return 0;
  return values.filter(predicate).length / values.length;
}

function isLikelySerialValue(value) {
  const text = String(value || "").trim();
  if (!text || isSoldText(text, { strict: true }) || isLikelyRowColorValue(text)) return false;
  return /^(序号|编号|no\.?|new|day\d+[-_])?\s*[\w-]*\d+$/i.test(text) && !isLikelyDateValue(text) && !isLikelySalePriceValue(text);
}

function isLikelyRemarkOnlyColumnValue(value) {
  const text = String(value || "").trim();
  return Boolean(text && isLikelyRemarkValue(text) && !isLikelyZoneCode(text) && !isLikelySeatRowValue(text) && !isLikelySeatNumberValue(text));
}

function columnLooksLike(table, columnIndex, predicate, threshold = 0.45) {
  return columnRatio(table, columnIndex, predicate) >= threshold;
}

function cloneRows(rows = []) {
  return (rows || []).map((row) => [...(row || [])]);
}

function ensureOriginalTableSnapshot(table) {
  if (!table || !Array.isArray(table.columns) || !Array.isArray(table.rows)) return table;
  if (!Array.isArray(table.originalColumns)) {
    table.originalColumns = [...table.columns];
  }
  if (!Array.isArray(table.originalRows) || table.originalRows.length !== table.rows.length) {
    table.originalRows = cloneRows(table.rows);
  }
  return table;
}

function syncOriginalRowValue(table, rowIndex, columnIndex, value, { appendMissing = false } = {}) {
  ensureOriginalTableSnapshot(table);
  if (!table?.originalRows?.[rowIndex] || !table.columns?.[columnIndex]) return;
  const columnName = table.columns[columnIndex];
  if (isInternalColorColumn(columnName)) return;
  let originalIndex = -1;
  if (table.originalColumns[columnIndex] && normalize(table.originalColumns[columnIndex]) === normalize(columnName)) {
    originalIndex = columnIndex;
  } else {
    originalIndex = table.originalColumns.findIndex((column) => normalize(column) === normalize(columnName));
  }
  if (originalIndex < 0 && appendMissing) {
    table.originalColumns.push(columnName);
    originalIndex = table.originalColumns.length - 1;
    table.originalRows.forEach((row) => {
      while (row.length < table.originalColumns.length) row.push("");
    });
  }
  if (originalIndex < 0) return;
  while (table.originalRows[rowIndex].length < table.originalColumns.length) table.originalRows[rowIndex].push("");
  table.originalRows[rowIndex][originalIndex] = value;
}

function syncOriginalRowValueByPosition(table, rowIndex, columnIndex, value, { appendMissing = false } = {}) {
  ensureOriginalTableSnapshot(table);
  if (!table?.originalRows?.[rowIndex] || !table.columns?.[columnIndex]) return;
  const columnName = table.columns[columnIndex];
  if (isInternalColorColumn(columnName)) return;
  if (table.originalColumns[columnIndex] && !isInternalColorColumn(table.originalColumns[columnIndex])) {
    while (table.originalRows[rowIndex].length < table.originalColumns.length) table.originalRows[rowIndex].push("");
    table.originalRows[rowIndex][columnIndex] = value;
    return;
  }
  syncOriginalRowValue(table, rowIndex, columnIndex, value, { appendMissing });
}

function syncOriginalRowFromCurrentRow(table, rowIndex, row) {
  if (!table || !row) return;
  (table.columns || []).forEach((column, columnIndex) => {
    if (isInternalColorColumn(column)) return;
    syncOriginalRowValueByPosition(table, rowIndex, columnIndex, row[columnIndex] || "", { appendMissing: true });
  });
}

function setSemanticColumnName(table, columnIndex, columnName) {
  if (columnIndex < 0 || !table?.columns || columnIndex >= table.columns.length || table.columns[columnIndex] === columnName) return false;
  ensureOriginalTableSnapshot(table);
  table.columns[columnIndex] = columnName;
  return true;
}

function mergeDuplicateColumnsByName(table, names = ["备注", "售价"]) {
  if (!table || !Array.isArray(table.columns) || !Array.isArray(table.rows)) return false;
  let changed = false;
  const targets = new Set(names.map((name) => normalize(name)));
  for (let index = 0; index < table.columns.length; index += 1) {
    const target = normalize(table.columns[index]);
    if (!targets.has(target)) continue;
    let duplicateIndex = table.columns.findIndex((column, itemIndex) => itemIndex > index && normalize(column) === target);
    while (duplicateIndex > index) {
      let duplicateHasValue = false;
      table.rows.forEach((row) => {
        while (row.length < table.columns.length) row.push("");
        const duplicateValue = String(row[duplicateIndex] || "").trim();
        if (!duplicateValue) return;
        duplicateHasValue = true;
        const keepValue = String(row[index] || "").trim();
        if (!keepValue) {
          row[index] = duplicateValue;
        } else if (target === normalize("备注") && !normalize(keepValue).includes(normalize(duplicateValue))) {
          row[index] = `${keepValue} ${duplicateValue}`.trim();
        }
        row[duplicateIndex] = "";
      });
      const canRemove = !duplicateHasValue || table.rows.every((row) => !String(row[duplicateIndex] || "").trim());
      if (!canRemove) break;
      table.columns.splice(duplicateIndex, 1);
      table.rows.forEach((row) => row.splice(duplicateIndex, 1));
      changed = true;
      duplicateIndex = table.columns.findIndex((column, itemIndex) => itemIndex > index && normalize(column) === target);
    }
  }
  return changed;
}

function removeTicketColumnAt(table, columnIndex) {
  if (!table || !Array.isArray(table.columns) || columnIndex < 0 || columnIndex >= table.columns.length) return false;
  table.columns.splice(columnIndex, 1);
  (table.rows || []).forEach((row) => {
    if (Array.isArray(row)) row.splice(columnIndex, 1);
  });
  if (Array.isArray(table.originalColumns)) table.originalColumns.splice(columnIndex, 1);
  if (Array.isArray(table.originalRows)) {
    table.originalRows.forEach((row) => {
      if (Array.isArray(row)) row.splice(columnIndex, 1);
    });
  }
  return true;
}

function columnHasNoUsefulValues(table, columnIndex) {
  return !(table?.rows || []).some((row) => String(row?.[columnIndex] || "").trim());
}

function repairTailSalePriceAndExplicitRowColumns(table) {
  if (!table || !Array.isArray(table.columns) || !Array.isArray(table.rows) || !table.rows.length) return false;
  let changed = false;
  const columns = table.columns;
  const usableColumnIndexes = columns
    .map((column, index) => ({ column, index }))
    .filter(({ column }) => !isInternalColorColumn(column));
  const priceLikeColumns = usableColumnIndexes
    .map(({ column, index }) => ({
      column,
      index,
      ratio: columnRatio(table, index, (value) => isLikelySalePriceValue(value, { minPrice: isSalePriceColumnName(column) ? 100 : 1000 })),
      filled: getColumnFilledValues(table, index).length,
    }))
    .filter((item) => item.filled && item.ratio >= 0.7)
    .sort((a, b) => b.index - a.index);
  const bestTailPrice = priceLikeColumns[0] || null;
  let priceIndex = findSalePriceColumnIndex(columns);
  if (bestTailPrice && priceIndex !== bestTailPrice.index) {
    const oldPriceIndex = priceIndex;
    table.rows.forEach((row) => {
      while (row.length < columns.length) row.push("");
      const movedPrice = extractSalePriceText(row[bestTailPrice.index], { minPrice: 100 }) || String(row[bestTailPrice.index] || "").trim();
      if (movedPrice) row[bestTailPrice.index] = movedPrice;
      if (oldPriceIndex >= 0 && oldPriceIndex !== bestTailPrice.index && !String(row[bestTailPrice.index] || "").trim()) {
        row[bestTailPrice.index] = row[oldPriceIndex] || "";
      }
      if (oldPriceIndex >= 0 && oldPriceIndex !== bestTailPrice.index) row[oldPriceIndex] = "";
    });
    columns[bestTailPrice.index] = "售价";
    if (oldPriceIndex >= 0 && oldPriceIndex !== bestTailPrice.index) columns[oldPriceIndex] = isRemarkColumnName(columns[oldPriceIndex]) ? columns[oldPriceIndex] : "备注";
    priceIndex = bestTailPrice.index;
    changed = true;
  }

  const emptyPriceIndexes = findSalePriceColumnIndexes(columns).filter((index) => index !== priceIndex && columnHasNoUsefulValues(table, index));
  emptyPriceIndexes
    .sort((a, b) => b - a)
    .forEach((index) => {
      if (removeTicketColumnAt(table, index)) changed = true;
    });

  const explicitRowIndex = columns.findIndex((column, index) => {
    const text = normalize(column);
    if (!["排", "排数", "行", "行数", "row", "열"].includes(text)) return false;
    return columnRatio(table, index, (value) => Boolean(String(value || "").trim())) >= 0.2;
  });
  const emptyExplicitRowIndex = findSeatRowColumnIndexes(columns).find((index) => {
    const text = normalize(columns[index] || "");
    return ["排", "排数", "行", "行数", "row", "열"].includes(text) && columnHasNoUsefulValues(table, index);
  });
  if (explicitRowIndex < 0 && emptyExplicitRowIndex >= 0) {
    const misplacedRowIndex = findSeatNumberColumnIndexes(columns).find((index) => {
      const values = getColumnFilledValues(table, index);
      if (!values.length) return false;
      const shortRowLike = valueRatio(values, (value) => {
        const text = String(value || "").trim();
        if (!text || isLikelySalePriceValue(text, { minPrice: 100 }) || isLikelyDateValue(text)) return false;
        return /^(?:[A-Za-z]|[A-Za-z]排|[0-9]{1,3}x|[0-9]{1,3}X|[0-9]{1,3}排|[A-Za-z0-9]{1,4}排)$/.test(text);
      });
      return shortRowLike >= 0.55;
    });
    if (misplacedRowIndex >= 0) {
      columns[misplacedRowIndex] = "排";
      if (removeTicketColumnAt(table, emptyExplicitRowIndex)) changed = true;
      changed = true;
    }
  }
  const currentExplicitRowIndex = columns.findIndex((column, index) => {
    const text = normalize(column);
    return ["排", "排数", "行", "行数", "row", "열"].includes(text) && !columnHasNoUsefulValues(table, index);
  });
  if (currentExplicitRowIndex >= 0) {
    const duplicateSeatIndexes = findSeatNumberColumnIndexes(columns).filter((index) => {
      if (index === currentExplicitRowIndex) return false;
      if (columnHasNoUsefulValues(table, index)) return true;
      const rowValues = getColumnFilledValues(table, currentExplicitRowIndex);
      const seatValues = getColumnFilledValues(table, index);
      if (!rowValues.length || seatValues.length < Math.max(1, Math.floor(rowValues.length * 0.7))) return false;
      const duplicateRatio = table.rows.filter((row) => {
        const rowValue = normalize(String(row?.[currentExplicitRowIndex] || ""));
        const seatValue = normalize(String(row?.[index] || ""));
        return rowValue && seatValue && rowValue === seatValue;
      }).length / Math.max(1, table.rows.length);
      return duplicateRatio >= 0.7;
    });
    duplicateSeatIndexes
      .sort((a, b) => b - a)
      .forEach((index) => {
        if (removeTicketColumnAt(table, index)) changed = true;
      });
  }
  const emptyAppendedRowIndexes = findSeatRowColumnIndexes(columns).filter((index) => {
    if (index === currentExplicitRowIndex) return false;
    return columnHasNoUsefulValues(table, index) && /^(排|排数|行|行数|row|열)$/i.test(String(columns[index] || "").trim());
  });
  emptyAppendedRowIndexes
    .sort((a, b) => b - a)
    .forEach((index) => {
      if (removeTicketColumnAt(table, index)) changed = true;
    });
  if (currentExplicitRowIndex >= 0 && columns[currentExplicitRowIndex] !== "排") {
    columns[currentExplicitRowIndex] = "排";
    changed = true;
  }
  return changed;
}

function repairDuplicateDateColumns(table) {
  const dateIndexes = findColumnIndexes(table.columns || [], DATE_COLUMN_NAMES);
  if (dateIndexes.length <= 1) return false;
  let changed = false;
  dateIndexes.forEach((index) => {
    const dateRatio = columnRatio(table, index, isLikelyDateValue);
    if (dateRatio < 0.35 && columnLooksLike(table, index, isLikelySerialValue, 0.35)) {
      changed = setSemanticColumnName(table, index, "序号") || changed;
    }
  });
  return changed;
}

function findLikelyDateColumnIndex(table) {
  const columns = table.columns || [];
  const rows = table.rows || [];
  const candidates = columns
    .map((column, index) => {
      const values = getColumnFilledValues(table, index);
      const header = normalize(column);
      const hasDateHeader = /日期|演出日期|时间|date|day|일자/.test(header);
      const excludedHeader = /序号|编号|no|num|区域|区|位置|排|行|座位|号|数量|张数|连坐|售价|价格|金额|price|状态/.test(header);
      const fullDateRatio = valueRatio(values, isLikelyDateValue);
      const dayOnlyRatio = valueRatio(values, isLikelyDayOnlyDateValue);
      const uniqueCount = new Set(values.map((value) => String(value || "").trim()).filter(Boolean)).size;
      const repeatedDayColumn =
        rows.length >= 4 &&
        dayOnlyRatio >= 0.7 &&
        uniqueCount > 0 &&
        uniqueCount <= Math.max(2, Math.ceil(values.length * 0.35)) &&
        !excludedHeader;
      const score = (hasDateHeader ? 120 : 0) + fullDateRatio * 90 + (repeatedDayColumn ? 70 : 0);
      return { index, score };
    })
    .filter((item) => item.score >= 70)
    .sort((a, b) => b.score - a.score);
  return candidates[0]?.index ?? -1;
}

function repairSemanticColumnRoles(table) {
  if (!table || !Array.isArray(table.columns) || !Array.isArray(table.rows)) return false;
  let changed = repairTailSalePriceAndExplicitRowColumns(table);
  changed = repairDuplicateDateColumns(table) || changed;

  const columns = table.columns;
  const ratios = columns.map((column, index) => ({
    index,
    column,
    date: columnRatio(table, index, isLikelyDateColumnValue),
    zone: columnRatio(table, index, isLikelyZoneCode),
    eventZone: columnRatio(table, index, (value) => currentEvent?.zones?.some((zone) => zoneTokenMatches(value, zone))),
    row: columnRatio(table, index, isLikelySeatRowValue),
    seat: columnRatio(table, index, isLikelySeatNumberValue),
    composite: columnRatio(table, index, (value) => Boolean(parseCompositeSeatInfo(value))),
    price: columnRatio(table, index, (value) => isLikelySalePriceValue(value, { minPrice: isSalePriceColumnName(column) ? 100 : 1000 })),
    count: columnRatio(table, index, isLikelySeatCountValue),
    serial: columnRatio(table, index, isLikelySerialValue),
    remark: columnRatio(table, index, isLikelyRemarkOnlyColumnValue),
    businessRemark: columnRatio(table, index, isBusinessStatusRemarkValue),
  }));

  ratios.forEach((item) => {
    const header = normalize(item.column);
    if (["no", "num", "number", "id", "序号", "编号"].includes(header)) {
      changed = setSemanticColumnName(table, item.index, "序号") || changed;
      return;
    }
    if (item.serial >= 0.5 && /(日期|date|day|일자)/i.test(header) && item.date < 0.3) {
      changed = setSemanticColumnName(table, item.index, "序号") || changed;
    }
  });

  if (!findColumnIndexes(columns, DATE_COLUMN_NAMES).length) {
    const likelyDateIndex = findLikelyDateColumnIndex(table);
    if (likelyDateIndex >= 0) {
      changed = setSemanticColumnName(table, likelyDateIndex, "日期") || changed;
    }
  }

  ratios.forEach((item) => {
    if (item.businessRemark >= 0.35 || (isDeliveryColumnName(item.column) && item.remark >= 0.2)) {
      changed = setSemanticColumnName(table, item.index, "备注") || changed;
    }
  });

  const priceIndexes = findSalePriceColumnIndexes(columns);
  const priceLikeIndexes = ratios
    .filter((item) => item.price >= 0.45 && !isFaceValueColumnName(item.column) && !isProtectedNonPriceColumnName(item.column))
    .map((item) => item.index);
  const bestPriceIndex = priceLikeIndexes[priceLikeIndexes.length - 1] ?? -1;
  if (bestPriceIndex >= 0 && (!priceIndexes.length || !priceIndexes.some((index) => ratios[index]?.price >= 0.35))) {
    changed = setSemanticColumnName(table, bestPriceIndex, "售价") || changed;
  }

  const faceIndexes = findFaceValueColumnIndexes(columns);
  const strongSeparateZoneIndex = ratios.find(
    (item) =>
      !faceIndexes.includes(item.index) &&
      /(区域|区|區|block|section|zone|area|구역|구)/i.test(item.column) &&
      (item.eventZone >= 0.2 || item.zone >= 0.35 || item.composite >= 0.2) &&
      item.price < 0.25,
  )?.index;
  faceIndexes.forEach((index) => {
    const item = ratios[index];
    const values = getColumnFilledValues(table, index);
    const genericFaceRatio = valueRatio(values, isGenericFaceValue);
    if (strongSeparateZoneIndex >= 0 && genericFaceRatio >= 0.35) return;
    if (genericFaceRatio >= 0.5 && item?.eventZone < 0.2 && item?.composite < 0.35) return;
    if ((item?.eventZone >= 0.3 || item?.zone >= 0.45 || item?.composite >= 0.35) && item.price < 0.2) {
      changed = setSemanticColumnName(table, index, "区域") || changed;
    }
  });

  const zoneIndexes = findColumnIndexes(columns, ["区域", "区", "block", "section", "구역"]);
  zoneIndexes.forEach((index) => {
    const item = ratios[index];
    if (!item) return;
    if (item.price >= 0.65 && item.zone < 0.2 && isSalePriceColumnName(item.column)) {
      changed = setSemanticColumnName(table, index, "售价") || changed;
      return;
    }
    if (item.row >= 0.45 && item.zone < 0.25) {
      const previousZone = ratios
        .slice(0, index)
        .reverse()
        .find((candidate) => candidate.zone >= 0.45 && candidate.price < 0.25);
      if (previousZone) {
        changed = setSemanticColumnName(table, previousZone.index, "区域") || changed;
        changed = setSemanticColumnName(table, index, "排") || changed;
      }
    }
  });

  const rowIndexes = findColumnIndexes(columns, ["排", "排数", "行", "行数", "row", "位置"]);
  rowIndexes.forEach((index) => {
    const item = ratios[index];
    if (!item) return;
    const strongRowHeader = /^(排|排数|行|行数|row|열)$/i.test(String(item.column || "").trim()) || /票面排数|门票排数|座位排数/i.test(item.column);
    if (item.businessRemark >= 0.35) {
      changed = setSemanticColumnName(table, index, "备注") || changed;
      return;
    }
    if ((item.zone >= 0.45 || item.composite >= 0.35) && item.row < 0.35) {
      changed = setSemanticColumnName(table, index, "区域") || changed;
    } else if (!strongRowHeader && item.seat >= 0.45 && item.row < 0.35) {
      changed = setSemanticColumnName(table, index, "座位号") || changed;
    }
  });

  const quantityIndexes = findColumnIndexes(columns, ["数量", "张数", "连坐", "连坐数量", "count", "qty", "매수"]);
  quantityIndexes.forEach((index) => {
    const item = ratios[index];
    if (!item) return;
    if (item.businessRemark >= 0.35) {
      changed = setSemanticColumnName(table, index, "备注") || changed;
    } else if (item.price >= 0.55 && item.count < 0.35 && !isFaceValueColumnName(item.column)) {
      changed = setSemanticColumnName(table, index, "售价") || changed;
    } else if (item.seat >= 0.45 && item.count < 0.35) {
      changed = setSemanticColumnName(table, index, "座位号") || changed;
    } else if (item.row >= 0.45 && item.count < 0.35) {
      changed = setSemanticColumnName(table, index, "排") || changed;
    }
  });

  const statusIndexes = findColumnIndexes(columns, ["状态", "售卖状态", "销售状态", "status", "是否售出"]);
  statusIndexes.forEach((index) => {
    const item = ratios[index];
    if (!item) return;
    if (item.businessRemark >= 0.35 && columnRatio(table, index, (value) => isSoldText(value, { strict: true })) < 0.25) {
      changed = setSemanticColumnName(table, index, "备注") || changed;
    }
  });

  const seatIndexes = findSeatNumberColumnIndexes(columns);
  seatIndexes.forEach((index) => {
    const item = ratios[index];
    if (!item) return;
    const strongSeatHeader = /票面号段|门票号段|座位号段|座位号|座号|号数|大小号|号段|号码|seat|number|no|번호|좌석번호/i.test(
      item.column,
    );
    if (item.price >= 0.65 && item.seat < 0.25 && isSalePriceColumnName(item.column)) {
      changed = setSemanticColumnName(table, index, "售价") || changed;
    } else if (!strongSeatHeader && item.row >= 0.5 && item.seat < 0.35) {
      changed = setSemanticColumnName(table, index, "排") || changed;
    }
  });

  ratios.forEach((item) => {
    if (item.remark >= 0.55 && !/(备注|remark|note|说明)/i.test(item.column)) {
      changed = setSemanticColumnName(table, item.index, "备注") || changed;
    }
  });

  if (repairTailSalePriceAndExplicitRowColumns(table)) changed = true;
  return changed;
}

function findMisreadSalePriceColumnIndex(table) {
  const columns = table.columns || [];
  const candidates = columns
    .map((column, index) => ({ column, index }))
    .filter(({ column }) => !isFaceValueColumnName(column))
    .filter(({ column }) => !isProtectedNonPriceColumnName(column))
    .filter(({ column }) => !["日期", "区域", "排", "行", "座位", "号数", "编号", "序号"].some((name) => normalize(column).includes(normalize(name))))
    .map((item) => ({
      ...item,
      ratio: columnRatio(table, item.index, (value) => isLikelySalePriceValue(value, { minPrice: isSalePriceColumnName(item.column) ? 100 : 1000 })),
    }))
    .filter((item) => item.ratio >= (isSalePriceColumnName(item.column) ? 0.35 : 0.75));
  if (!candidates.length) return -1;
  const preferred = candidates.find((item) => isSalePriceColumnName(item.column) || /售价|价格|单价|报价|金额|price/i.test(item.column));
  if (preferred) return preferred.index;
  return candidates[candidates.length - 1]?.index ?? -1;
}

function getDirectSalePriceFromRow(table, row) {
  return (
    findPreferredSalePriceColumnIndexes(table.columns || [])
      .map((index) => extractSalePriceText(row[index], { minPrice: 100 }))
      .find(Boolean) || ""
  );
}

function getSalePriceCandidateFromRow(table, row, { afterIndex = -1, excludeIndexes = new Set() } = {}) {
  const columns = table.columns || [];
  const candidates = row
    .map((value, index) => ({ value: String(value || "").trim(), index, column: columns[index] || "" }))
    .filter(({ value, index, column }) => {
      if (!value || excludeIndexes.has(index) || isInternalColorColumn(column) || isLikelyRowColorValue(value)) return false;
      if (!isSalePriceCandidateValue(value)) return false;
      const protectedColumn = isProtectedNonPriceColumnName(column);
      const hasExplicitCurrencyPrice = /[￥¥$€£₩]/.test(value) && Boolean(extractSalePriceText(value, { minPrice: 100 }));
      const shiftedPriceInSeatmapColumn =
        isSeatmapImageColumnName(column) && index >= Math.max(0, row.length - 2) && Boolean(extractSalePriceText(value, { minPrice: 1000 }));
      if (shiftedPriceInSeatmapColumn) return true;
      if (protectedColumn && !hasExplicitCurrencyPrice && !isSalePriceColumnName(column) && !isRemarkColumnName(column) && !isDeliveryColumnName(column)) {
        return false;
      }
      return true;
    })
    .map((item) => {
      const price = extractSalePriceText(item.value, { minPrice: 100 });
      const number = extractNumber(price);
      const hasCurrency = /[￥¥$€£₩]/.test(item.value);
      const saleHeader = isSalePriceColumnName(item.column) || /售价|售價|价格|價格|单价|單價|报价|報價|金额|金額|price|ask/i.test(item.column);
      const remarkHeader = isRemarkColumnName(item.column) || isDeliveryColumnName(item.column);
      let score = 0;
      if (saleHeader) score += 130;
      if (hasCurrency) score += 55;
      if (remarkHeader && hasCurrency) score += 12;
      if (remarkHeader && !hasCurrency) score -= 45;
      if (item.index > afterIndex) score += 30;
      if (item.index >= Math.max(0, row.length - 3)) score += 16;
      if (item.index === row.length - 1) score += 35;
      if (number >= 1000) score += 18;
      if (number >= 10000) score += 4;
      if (!hasCurrency && number < 1000 && !saleHeader) score -= 70;
      if (isLikelyRemarkValue(item.value) && !hasCurrency) score -= 25;
      return { ...item, price, number, score };
    })
    .filter((item) => item.score >= 20)
    .sort((a, b) => b.score - a.score || b.index - a.index);
  return candidates[0] || null;
}

function moveValueIntoRemarkColumn(table, row, value) {
  const text = String(value || "").trim();
  if (!text) return false;
  const remarkIndex = ensureNamedColumn(table, "备注", ["备注", "remark", "note", "说明"]);
  const existing = String(row[remarkIndex] || "").trim();
  if (!existing) {
    row[remarkIndex] = text;
    return true;
  }
  if (!normalize(existing).includes(normalize(text))) {
    row[remarkIndex] = `${existing} ${text}`.trim();
    return true;
  }
  return false;
}

function shouldClearMovedPriceSource(table, sourceIndex, priceIndex, sourceValue = "") {
  if (sourceIndex < 0 || sourceIndex === priceIndex) return false;
  const column = table.columns?.[sourceIndex] || "";
  if (isSalePriceColumnName(column) || isFaceValueColumnName(column)) return false;
  const hasExplicitCurrencyPrice = /[￥¥$€£₩]/.test(String(sourceValue || "")) && Boolean(extractSalePriceText(sourceValue, { minPrice: 100 }));
  if (hasExplicitCurrencyPrice) return true;
  if (isRemarkColumnName(column) || isDeliveryColumnName(column)) return true;
  return !isProtectedNonPriceColumnName(column);
}

function isExplicitCurrencySalePrice(value) {
  const text = String(value || "").trim();
  return /[￥¥$€£₩]/.test(text) && Boolean(extractSalePriceText(text, { minPrice: 100 }));
}

function findExplicitCurrencySalePriceInRow(table, row) {
  if (!table || !Array.isArray(row)) return "";
  const columns = table.columns || [];
  const candidates = row
    .map((value, index) => ({
      value: String(value || "").trim(),
      index,
      column: columns[index] || "",
      price: extractSalePriceText(value, { minPrice: 100 }),
    }))
    .filter((item) => item.value && item.price && isExplicitCurrencySalePrice(item.value))
    .filter((item) => !isFaceValueColumnName(item.column) && !isInternalColorColumn(item.column))
    .filter((item) => !isBusinessStatusRemarkValue(item.value) && !isSoldText(item.value, { strict: true }))
    .sort((a, b) => {
      const aSaleHeader = isSalePriceColumnName(a.column) ? 1 : 0;
      const bSaleHeader = isSalePriceColumnName(b.column) ? 1 : 0;
      return bSaleHeader - aSaleHeader || b.index - a.index;
    });
  return candidates[0]?.price || "";
}

function repairExplicitCurrencyPriceInWrongColumn(table, row, rowIndex = -1) {
  if (!table || !Array.isArray(table.columns) || !Array.isArray(row)) return false;
  let priceIndex = findSalePriceColumnIndex(table.columns);
  const directPrice = priceIndex >= 0 ? extractSalePriceText(row[priceIndex], { minPrice: 100 }) : "";
  const priceCellText = priceIndex >= 0 ? String(row[priceIndex] || "").trim() : "";
  const priceCellIsWrong =
    priceCellText &&
    !directPrice &&
    (isLikelyRemarkValue(priceCellText) || isLogisticsOrRemarkValue(priceCellText) || isLikelyDateValue(priceCellText));
  const explicitPriceCell = row
    .map((value, index) => ({
      value: String(value || "").trim(),
      index,
      column: table.columns[index] || "",
      price: extractSalePriceText(value, { minPrice: 100 }),
    }))
    .filter((item) => item.value && item.index !== priceIndex && item.price && isExplicitCurrencySalePrice(item.value))
    .filter((item) => !isFaceValueColumnName(item.column) && !isInternalColorColumn(item.column))
    .sort((a, b) => {
      const aSaleHeader = isSalePriceColumnName(a.column) ? 1 : 0;
      const bSaleHeader = isSalePriceColumnName(b.column) ? 1 : 0;
      return bSaleHeader - aSaleHeader || b.index - a.index;
    })[0];

  if (!explicitPriceCell || (directPrice && !priceCellIsWrong)) return false;

  let changed = false;
  priceIndex = ensureSalePriceColumn(table);
  if (priceCellText && priceCellIsWrong && moveValueIntoRemarkColumn(table, row, priceCellText)) changed = true;
  if (row[priceIndex] !== explicitPriceCell.price) {
    row[priceIndex] = explicitPriceCell.price;
    changed = true;
  }
  if (shouldClearMovedPriceSource(table, explicitPriceCell.index, priceIndex, explicitPriceCell.value)) {
    row[explicitPriceCell.index] = "";
    changed = true;
  }
  if (changed && rowIndex >= 0) syncOriginalRowFromCurrentRow(table, rowIndex, row);
  return changed;
}

function repairShiftedSalePriceAndRemark(table, row) {
  if (!table || !Array.isArray(row)) return false;
  let changed = false;
  let priceIndex = findSalePriceColumnIndex(table.columns);
  const directPrice = priceIndex >= 0 ? extractSalePriceText(row[priceIndex], { minPrice: 100 }) : "";
  const priceCellText = priceIndex >= 0 ? String(row[priceIndex] || "").trim() : "";
  const priceCellIsRemark = Boolean(priceCellText && !directPrice && (isLikelyRemarkValue(priceCellText) || isLogisticsOrRemarkValue(priceCellText)));
  const excluded = new Set(priceIndex >= 0 ? [priceIndex] : []);
  const candidate = getSalePriceCandidateFromRow(table, row, { afterIndex: priceIndex, excludeIndexes: excluded });

  if (priceCellIsRemark && candidate) {
    if (shouldClearMovedPriceSource(table, candidate.index, priceIndex, candidate.value)) {
      row[candidate.index] = "";
      changed = true;
    }
    row[priceIndex] = candidate.price;
    changed = true;
    if (moveValueIntoRemarkColumn(table, row, priceCellText)) changed = true;
    return changed;
  }

  if (!directPrice && candidate) {
    priceIndex = ensureSalePriceColumn(table);
    if (
      priceCellText &&
      !isLikelySalePriceValue(priceCellText, { minPrice: 100 }) &&
      !isSoldText(priceCellText, { strict: true }) &&
      !isLikelyDateValue(priceCellText)
    ) {
      if (moveValueIntoRemarkColumn(table, row, priceCellText)) changed = true;
    }
    if (row[priceIndex] !== candidate.price) {
      row[priceIndex] = candidate.price;
      changed = true;
    }
    if (shouldClearMovedPriceSource(table, candidate.index, priceIndex, candidate.value)) {
      row[candidate.index] = "";
      changed = true;
    }
  }

  return changed;
}

function rowHasTicketContentOutsideDate(table, row, dateIndex) {
  const zoneIndex = findColumnIndex(table.columns || [], ["区域", "区", "block", "section", "구역"]);
  const rowIndex = findSeatRowColumnIndexes(table.columns || [])[0] ?? -1;
  const seatIndex = findSeatNumberColumnIndexes(table.columns || [])[0] ?? -1;
  return row.some((cell, index) => {
    if (index === dateIndex) return false;
    const text = String(cell || "").trim();
    if (!text || isPlaceholderOrSeparatorText(text)) return false;
    if (index === zoneIndex && isLikelyZoneCode(text)) return true;
    if (index === rowIndex && isLikelySeatRowValue(text)) return true;
    if (index === seatIndex && isLikelySeatNumberValue(text)) return true;
    return isExplicitCurrencySalePrice(text) || isSalePriceCandidateValue(text);
  });
}

function repairMisplacedDateAndPriceValues(table) {
  if (!table || !Array.isArray(table.columns) || !Array.isArray(table.rows)) return false;
  const dateIndexes = findColumnIndexes(table.columns, DATE_COLUMN_NAMES);
  if (!dateIndexes.length) return false;
  let changed = false;

  dateIndexes.forEach((dateIndex) => {
    let lastDate = "";
    table.rows.forEach((row, rowIndex) => {
      while (row.length < table.columns.length) row.push("");
      if (table.userEditedRows?.[rowIndex]) {
        const editedDate = String(row[dateIndex] || "").trim();
        if (editedDate && isLikelyDateColumnValue(editedDate)) lastDate = editedDate;
        return;
      }

      let rowChanged = false;
      const currentDate = String(row[dateIndex] || "").trim();
      if (currentDate && isExplicitCurrencySalePrice(currentDate)) {
        const priceIndex = ensureSalePriceColumn(table);
        const existingPrice = getDirectSalePriceFromRow(table, row);
        const movedPrice = extractSalePriceText(currentDate, { minPrice: 100 });
        const priceCellText = String(row[priceIndex] || "").trim();
        const priceCellIsRemark =
          Boolean(priceCellText && !extractSalePriceText(priceCellText, { minPrice: 100 })) &&
          (isLikelyRemarkValue(priceCellText) || isLogisticsOrRemarkValue(priceCellText));
        if (priceCellIsRemark && moveValueIntoRemarkColumn(table, row, priceCellText)) {
          changed = true;
          rowChanged = true;
        }
        if ((!existingPrice || priceCellIsRemark) && movedPrice && row[priceIndex] !== movedPrice) {
          row[priceIndex] = movedPrice;
          changed = true;
          rowChanged = true;
        }
        row[dateIndex] = "";
        changed = true;
        rowChanged = true;
        if (lastDate && rowHasTicketContentOutsideDate(table, row, dateIndex)) {
          row[dateIndex] = lastDate;
        }
      }

      const nextDate = String(row[dateIndex] || "").trim();
      if (nextDate && isLikelyDateColumnValue(nextDate)) {
        lastDate = nextDate;
      } else if (!nextDate && lastDate && rowHasTicketContentOutsideDate(table, row, dateIndex)) {
        row[dateIndex] = lastDate;
        changed = true;
        rowChanged = true;
      }
      if (rowChanged) syncOriginalRowFromCurrentRow(table, rowIndex, row);
    });
  });

  return changed;
}

function cleanZoneToken(value) {
  const text = String(value || "")
    .normalize("NFKC")
    .trim()
    .replace(/[（）()【】\[\]]/g, "")
    .replace(/^(?:区域|区号|分区|場區|场区|구역|구|section|block|area|zone)\s*[:：-]?/i, "")
    .replace(/\s*(?:区域|区|區|구역|구|座区|席区|座|席|section|block|area|zone)$/i, "")
    .replace(/\s+/g, "")
    .replace(/[‐-‒–—―]+/g, "")
    .trim();
  if (/^I{2,}(\d+[A-Z]?)$/i.test(text)) return text.replace(/^I+/i, "I");
  return text;
}

function normalizeExtractedZoneToken(value, sourceText = "") {
  let token = cleanZoneToken(value);
  if (!token) return "";
  const source = normalizeSeatText(sourceText || value);

  const gluedNumberRow = token.match(/^(\d{2,4})([A-Z])$/i);
  if (gluedNumberRow && new RegExp(`${gluedNumberRow[1]}\\s*${gluedNumberRow[2]}\\s*(?:排|row|열)`, "i").test(source)) {
    token = gluedNumberRow[1];
  }

  const gluedLetterRow = token.match(/^([A-Z]\d+)([A-Z])$/i);
  if (gluedLetterRow && new RegExp(`${gluedLetterRow[1]}\\s*${gluedLetterRow[2]}\\s*(?:排|row|열)`, "i").test(source)) {
    token = gluedLetterRow[1].toUpperCase();
  }

  if (/^I{2,}(\d+[A-Z]?)$/i.test(token)) token = token.replace(/^I+/i, "I");
  return token.toUpperCase();
}

function zoneTokenSpecificityScore(value) {
  const token = cleanZoneToken(value);
  if (!token) return 0;
  let score = token.length;
  if (/\d/.test(token)) score += 8;
  if (/^(PB|PC|PD|PE|PEN|R|Z|E|B|D|M|A|F|I)\d/i.test(token)) score += 4;
  if (/^[A-Z]$/i.test(token)) score -= 6;
  if (/^\d{1,2}$/.test(token)) score -= 10;
  return score;
}

function chooseBetterZoneToken(...values) {
  return values
    .map((value) => normalizeExtractedZoneToken(value))
    .filter(Boolean)
    .sort((a, b) => zoneTokenSpecificityScore(b) - zoneTokenSpecificityScore(a))[0] || "";
}

function extractZoneTokenFromText(value) {
  const text = normalizeSeatText(value);
  if (!text || isSoldText(text, { strict: true }) || isLikelySalePriceValue(text)) return "";
  const compactText = text.replace(/\s+/g, "");
  const rowAttachedZone =
    compactText.match(/((?:PB|PC|PD|PE|PEN|R|Z|E|B|D|M|A|F|I{1,3})\d+[A-Z]?|\d{2,4}[A-Z]?)(?=(?:区|區|구역|구)?(?:[A-Z]|\d{1,3}|[一二三四五六七八九十]+)?(?:排|row|열))/i) ||
    compactText.match(/(?:看台|看臺|内场|內場|场内|場內|floor|层|층)((?:PB|PC|PD|PE|PEN|R|Z|E|B|D|M|A|F|I{1,3})?\d{1,4}[A-Z]?|[A-Z]\d?|FE|FW)(?=(?:[A-Z]|\d{1,3}|[一二三四五六七八九十]+)?(?:排|row|열|区|區))/i);
  const explicitZone =
    rowAttachedZone ||
    compactText.match(/((?:I{1,3}|[A-Z]{1,4})\d+[A-Z]?|\d{2,4}[A-Z]?|[A-Z]{1,4})\s*(?:区|區|구역|구|section|block|area|zone)/i) ||
    compactText.match(/(?:区|區|구역|구|section|block|area|zone)\s*((?:I{1,3}|[A-Z]{1,4})\d+[A-Z]?|\d{2,4}[A-Z]?|[A-Z]{1,4})/i);
  const venueZone =
    explicitZone ||
    compactText.match(/(?:看台|看臺|内场|內場|场内|場內|floor|层|층)((?:PB|PC|PD|PE|PEN|R|Z|E|B|D|M|A|F|I{1,3})?\d{1,4}[A-Z]?|[A-Z]\d?|FE|FW)(?=$|[^A-Z0-9]|(?:区|區|排|row|side))/i);
  const englishZone =
    venueZone ||
    text.match(/(?:^|[^A-Z0-9])(?:\d+\s*F\s*)?(?:side|section|block|area|zone)\s*([A-Z]{0,3}\d{1,4}[A-Z]?|[A-Z]\d?|FE|FW)(?=$|[^A-Z0-9])/i) ||
    text.match(/(?:^|[^A-Z0-9])([A-Z]{0,3}\d{2,4}[A-Z]?|[A-Z]\d?)\s*side\b/i);
  const token = normalizeExtractedZoneToken(englishZone?.[1] || "", text);
  if (!token || isLikelyDateValue(token) || isLikelySalePriceValue(token)) return "";
  if (/^\d{1,2}$/.test(token) || /^2F|3F$/i.test(token)) return "";
  return token;
}

function normalizeSeatText(value) {
  return String(value || "")
    .normalize("NFKC")
    .replace(/입장\s*번호/gi, "입장번호")
    .replace(/([A-Za-z0-9]+)\s*구역/g, "$1区")
    .replace(/([A-Za-z0-9]+)\s*구(?=$|\s|[A-Za-z0-9])/g, "$1区")
    .replace(/([A-Za-z0-9]+)\s*열/g, "$1排")
    .replace(/([A-Za-z0-9]+)\s*번/g, "$1号")
    .replace(/([A-Za-z0-9]+)\s*호/g, "$1号")
    .replace(/[‐‑‒–—―～~]/g, "-")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeSeatRange(start, end, suffix = "") {
  const left = String(start || "").trim().toUpperCase();
  const right = String(end || "").trim().toUpperCase();
  const unit = suffix ? suffix.replace(/row|열/i, "排") : "";
  return `${left}-${right}${unit}`;
}

function extractSeatRowFromText(value, { allowBareRange = false, preferActual = true } = {}) {
  const text = normalizeSeatText(value);
  if (!text || isSoldText(text, { strict: true }) || isLikelySalePriceValue(text)) return "";
  const actualRange = text.match(/实际\s*(?:第)?\s*([A-Z]?\d{1,3}|[一二三四五六七八九十]+)\s*[-到至]\s*([A-Z]?\d{1,3}|[一二三四五六七八九十]+)\s*(?:排|row|열)/i);
  if (preferActual && actualRange) return `实际${normalizeSeatRange(actualRange[1], actualRange[2], "排")}`;
  const repeatedUnitRange = text.match(/([A-Z]?\d{1,3}|[一二三四五六七八九十]+)\s*(?:排|row|열)\s*[-到至]\s*([A-Z]?\d{1,3}|[一二三四五六七八九十]+)\s*(?:排|row|열)/i);
  if (repeatedUnitRange) return normalizeSeatRange(repeatedUnitRange[1], repeatedUnitRange[2], "排");
  const rowRange = text.match(/([A-Z]?\d{1,3}|[一二三四五六七八九十]+)\s*[-到至]\s*([A-Z]?\d{1,3}|[一二三四五六七八九十]+)\s*(排|row|열)/i);
  if (rowRange) return normalizeSeatRange(rowRange[1], rowRange[2], rowRange[3]);
  const rowLabelBefore = text.match(/(?:^|[^A-Z0-9])(?:row|열)\s*([A-Z]|\d{1,3}|[一二三四五六七八九十]+)(?:$|[^A-Z0-9])/i);
  if (rowLabelBefore) return `${String(rowLabelBefore[1]).trim().toUpperCase()}排`;
  const sideRow = text.match(/(?:^|[^A-Z0-9-])(?:side|사이드)?\s*([A-Z]|\d{1,3}|[一二三四五六七八九十]+)\s*(?:排|row|열)(?:$|[^A-Z0-9])/i);
  if (sideRow) return `${String(sideRow[1]).trim().toUpperCase()}排`;
  if (allowBareRange) {
    const bareRange = text.match(/^([A-Z]?\d{1,3}|[一二三四五六七八九十]+)\s*[-到至]\s*([A-Z]?\d{1,3}|[一二三四五六七八九十]+)$/i);
    if (bareRange) return normalizeSeatRange(bareRange[1], bareRange[2], "");
  }
  const actualSingle = text.match(/实际\s*(?:第)?\s*([A-Z]?\d{1,3}|[一二三四五六七八九十]+)\s*(?:排|row|열)/i);
  if (preferActual && actualSingle) return `实际${String(actualSingle[1]).trim().toUpperCase()}排`;
  const rowWithSeatTail = text.match(/(?:^|[^A-Z0-9])([A-Z]|\d{1,3}|[一二三四五六七八九十]+)\s*(?:排|row|열)\s*(?=\d*X\b|X\b|\d{1,4}\s*(?:号|號)\b|\d{1,4}\s*[-到至]\s*\d{1,4}|$)/i);
  if (rowWithSeatTail) return `${String(rowWithSeatTail[1]).trim().toUpperCase()}排`;
  const rowSingle = text.match(/(?:^|[^A-Z0-9])([A-Z]|\d{1,3}|[一二三四五六七八九十]+)\s*(?:排|row|열)(?:$|[^A-Z0-9])/i);
  if (rowSingle) return `${String(rowSingle[1]).trim().toUpperCase()}排`;
  if (actualRange) return `实际${normalizeSeatRange(actualRange[1], actualRange[2], "排")}`;
  if (actualSingle) return `实际${String(actualSingle[1]).trim().toUpperCase()}排`;
  return "";
}

function extractSeatNumberFromText(value, { allowBareRange = false } = {}) {
  const text = normalizeSeatText(value);
  if (!text || isSoldText(text, { strict: true }) || isLikelySalePriceValue(text)) return "";
  const seatAfterEnglishRow = text.match(/(?:row|열)\s*(?:[A-Z]|\d{1,3}|[一二三四五六七八九十]+)\s*[.。,:：-]*\s*(-?\s*[0-9]*X|X|\d{1,4}\s*[-到至~—]\s*\d{1,4}\s*(?:号|號)?|\d{1,4}\s*(?:号|號))/i);
  if (seatAfterEnglishRow) {
    const token = seatAfterEnglishRow[1].replace(/^[\s-]+/, "").replace(/\s+/g, "").toUpperCase();
    const range = token.match(/^([A-Z]?\d{1,4}|X)[-到至~—]+([A-Z]?\d{1,4}|X)(号|號)?$/i);
    if (range) return normalizeSeatRange(range[1], range[2], range[3] ? "号" : "");
    return token;
  }
  const seatAfterRow = text.match(/(?:排|row|열)\s*[.。,:：-]*\s*(-?\s*[0-9]*X|X|\d{1,4}\s*[-到至~—]\s*\d{1,4}\s*(?:号|號)?|\d{1,4}\s*(?:号|號))/i);
  if (seatAfterRow) {
    const token = seatAfterRow[1].replace(/^[\s-]+/, "").replace(/\s+/g, "").toUpperCase();
    const range = token.match(/^([A-Z]?\d{1,4}|X)[-到至~—]+([A-Z]?\d{1,4}|X)(号|號)?$/i);
    if (range) return normalizeSeatRange(range[1], range[2], range[3] ? "号" : "");
    return token;
  }
  if (/(?:排|row|열)/i.test(text) && !/(?:号|號|座位|seat|no\.?|number)/i.test(text)) return "";
  const hasSeatLabel = /(?:座位号?|座号|号段|号码|座位|seat|no\.?|number)/i.test(text);
  const labelledRange = text.match(/^(?:(?:座位号?|座号|号段|号码|座位|seat|no\.?|number)\s*[:：]?\s*)?([A-Z]?\d{1,4}|X)\s*[-到至]\s*([A-Z]?\d{1,4}|X)\s*(号|號)?$/i);
  if (labelledRange && (hasSeatLabel || labelledRange[3] || allowBareRange)) {
    return normalizeSeatRange(labelledRange[1], labelledRange[2], labelledRange[3] ? "号" : "");
  }
  const xRange = text.match(/^(?:X|x)\s*[（(]\s*(\d{1,4}\s*[-到至]\s*\d{1,4})\s*[）)]$/);
  if (xRange) return `X(${xRange[1].replace(/\s+/g, "")})`;
  const xValue = text.match(/^(\d*X)\s*(号|號)?(?:\s*[（(].+[）)])?$/i);
  if (xValue) return text.replace(/\s+/g, "").toUpperCase();
  const single = text.match(/^(?:(?:座位号?|座号|号段|号码|座位|seat|no\.?|number)\s*[:：]?\s*)?(\d{1,4}X?|X)\s*(号|號)?$/i);
  if (single && (hasSeatLabel || single[2])) return `${single[1].toUpperCase()}${single[2] ? "号" : ""}`;
  if (allowBareRange) {
    const bareRange = text.match(/^([A-Z]?\d{1,4}|X)\s*[-到至]\s*([A-Z]?\d{1,4}|X)$/i);
    if (bareRange) return normalizeSeatRange(bareRange[1], bareRange[2], "");
  }
  return "";
}

function isSeatRowColumnName(column = "") {
  const text = normalize(column);
  if (!text) return false;
  if (/票面排数|门票排数|座位排数|票面位置|门票位置|座位位置|座位图位置|座席图位置/.test(text)) {
    return true;
  }
  if (/座位|座号|号数|号段|大小号|数量|张数|售价|价格|金额|区域|区|票面|价位|面值/.test(text)) {
    return false;
  }
  return /排|行数|行|row|열|位置/.test(text);
}

function isSeatNumberColumnName(column = "") {
  const text = normalize(column);
  if (!text || /序号|编号|日期|价格|售价|金额|数量|张数|座位图|座席图|seatmap/.test(text)) return false;
  return /座位号|座位|座号|号数|大小号|号段|号码|seat|number|no|번호|좌석번호/.test(text);
}

function isBetterSeatRowCandidate(candidate, current) {
  const next = String(candidate || "").trim();
  const previous = String(current || "").trim();
  if (!next) return false;
  if (!previous || isLikelySalePriceValue(previous) || isLikelySeatNumberValue(previous)) return true;
  if (/[-到至]/.test(next) && !/[-到至]/.test(previous)) return true;
  if (/实际/.test(next) && /[-到至]/.test(previous)) return false;
  if (/实际/.test(next) && !isLikelySeatRowValue(previous)) return true;
  return false;
}

function isBetterSeatNumberCandidate(candidate, current) {
  const next = String(candidate || "").trim();
  const previous = String(current || "").trim();
  if (!next) return false;
  if (!previous || isLikelySalePriceValue(previous) || isLikelySeatRowValue(previous)) return true;
  if (/[-到至]/.test(next) && !/[-到至]/.test(previous)) return true;
  return false;
}

function removeFirstSeatRowPhrase(text) {
  return normalizeSeatText(text)
    .replace(/实际\s*(?:第)?\s*([A-Z]?\d{1,3}|[一二三四五六七八九十]+)\s*[-到至]\s*([A-Z]?\d{1,3}|[一二三四五六七八九十]+)\s*(?:排|row|열)/i, " ")
    .replace(/([A-Z]?\d{1,3}|[一二三四五六七八九十]+)\s*(?:排|row|열)\s*[-到至]\s*([A-Z]?\d{1,3}|[一二三四五六七八九十]+)\s*(?:排|row|열)/i, " ")
    .replace(/([A-Z]?\d{1,3}|[一二三四五六七八九十]+)\s*[-到至]\s*([A-Z]?\d{1,3}|[一二三四五六七八九十]+)\s*(?:排|row|열)/i, " ")
    .replace(/(?:^|[^A-Z0-9])(?:row|열)\s*([A-Z]|\d{1,3}|[一二三四五六七八九十]+)(?:$|[^A-Z0-9])/i, " ")
    .replace(/实际\s*(?:第)?\s*([A-Z]?\d{1,3}|[一二三四五六七八九十]+)\s*(?:排|row|열)/i, " ")
    .replace(/(?:^|[^A-Z0-9])([A-Z]|\d{1,3}|[一二三四五六七八九十]+)\s*(?:排|row|열)\s*(?=\d*X\b|X\b|\d{1,4}\s*(?:号|號)\b|\d{1,4}\s*[-到至]\s*\d{1,4}|$)/i, " ")
    .replace(/(?:^|[^A-Z0-9])([A-Z]|\d{1,3}|[一二三四五六七八九十]+)\s*(?:排|row|열)(?:$|[^A-Z0-9])/i, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractDateFromCompositeSeatText(value) {
  const text = String(value || "").normalize("NFKC").trim();
  if (!text) return "";
  const compact = text.match(/(?:^|[^\d])(20\d{2})(\d{2})(\d{2})(?=$|[^\d])/);
  if (compact) return `${compact[1]}.${Number(compact[2])}.${Number(compact[3])}`;
  const full = text.match(/(?:^|[^\d])(20\d{2})[./\-年](\d{1,2})[./\-月](\d{1,2})\s*(?:日|号)?(?=$|[^\d])/);
  if (full) return `${full[1]}.${Number(full[2])}.${Number(full[3])}`;
  const monthDay = text.match(/(?:^|[^\d])(\d{1,2})[./\-月](\d{1,2})\s*(?:日|号)?(?!\s*(?:排|row|열))(?=$|[^\d])/i);
  if (monthDay) return `${Number(monthDay[1])}.${Number(monthDay[2])}`;
  return "";
}

function extractCompositeSeatNote(text) {
  const source = String(text || "").trim();
  const notes = [
    ...source.matchAll(/(?:有)?同排|同一排|连坐|連坐|연석|연번|视阻|視阻|遮挡|遮擋|靠过道|靠過道|过道|過道|可拆|不可拆|实际\s*(?:第)?\s*[A-Z]?\d{1,3}\s*(?:[-到至]\s*[A-Z]?\d{1,3})?\s*(?:排|row|열)/gi),
  ].map((match) => match[0].trim());
  const floorMatch = source.match(/((?:Floor|floor)|\d{1,2})\s*층/i);
  if (floorMatch) notes.push(`${floorMatch[1].toLowerCase() === "floor" ? "Floor" : Number(floorMatch[1])}层`);
  if (/입장\s*번호/i.test(source)) notes.push("入场号");
  return uniqueCleanValues(notes.map((note) => note.replace(/연석|연번/g, "连坐"))).join(" ");
}

function normalizeCompositeSeatValue(value) {
  return normalizeSeatText(value)
    .replace(/\bSide\b/gi, " Side ")
    .replace(/\bRow\b/gi, " Row ")
    .replace(/\s*([.。,:：])\s*/g, "$1 ")
    .replace(/\s+/g, " ")
    .trim();
}

function parseEnglishCompositeSeatInfo(value) {
  const text = normalizeCompositeSeatValue(value);
  if (!/(?:side|row)/i.test(text)) return null;
  const match =
    text.match(
      /(?:^|\s)(?:\d+\s*F\s*[- ]*)?(?:Side\s*)?([A-Z]{0,3}\d{2,4}[A-Z]?|[A-Z]\d?)(?:\s*Side)?[.。,\s-]+(?:Row\s*)?([A-Z]|\d{1,3})(?:\s*Row)?[.。,\s-]*((?:\d+\s*)?X|\d{1,4}\s*[-到至]\s*\d{1,4}|\d{1,4}\s*(?:号|號))?/i,
    ) ||
    text.match(
      /(?:^|\s)(?:\d+\s*F\s*)?([A-Z]{0,3}\d{2,4}[A-Z]?|[A-Z]\d?)\s*Side[.。,\s-]+([A-Z]|\d{1,3})\s*Row[.。,\s-]*((?:\d+\s*)?X|\d{1,4}\s*[-到至]\s*\d{1,4}|\d{1,4}\s*(?:号|號))?/i,
    );
  if (!match) return null;
  const zone = normalizeExtractedZoneToken(match[1], text);
  if (!zone || !isLikelyZoneCode(zone)) return null;
  const row = `${String(match[2] || "").trim().toUpperCase()}排`;
  const seat = String(match[3] || "").replace(/\s+/g, "").toUpperCase();
  return { zone, row, seat };
}

function parseEnglishSideRowPosition(value) {
  const text = normalizeCompositeSeatValue(value);
  if (!/(?:side|row)/i.test(text)) return null;
  const normalized = text
    .replace(/\bSide\b/gi, " Side ")
    .replace(/\bRow\b/gi, " Row ")
    .replace(/\s+/g, " ")
    .trim();
  const patterns = [
    /(?:^|\s)(?:\d+\s*F\s*[-\s]*)?Side\s*([A-Z]{0,3}\d{2,4}[A-Z]?|[A-Z]\d?)[.。,\s-]+Row\s*([A-Z]|\d{1,3})[.。,\s-]*((?:\d+\s*)?X|\d{1,4}\s*[-到至]\s*\d{1,4}|\d{1,4}\s*(?:号|號))?/i,
    /(?:^|\s)(?:\d+\s*F\s*[-\s]*)?Side\s*([A-Z]{0,3}\d{2,4}[A-Z]?|[A-Z]\d?)\s*Row\s*([A-Z]|\d{1,3})[.。,\s-]*((?:\d+\s*)?X|\d{1,4}\s*[-到至]\s*\d{1,4}|\d{1,4}\s*(?:号|號))?/i,
    /(?:^|\s)(?:\d+\s*F\s*[-\s]*)?([A-Z]{0,3}\d{2,4}[A-Z]?|[A-Z]\d?)\s*Side[.。,\s-]+([A-Z]|\d{1,3})\s*Row[.。,\s-]*((?:\d+\s*)?X|\d{1,4}\s*[-到至]\s*\d{1,4}|\d{1,4}\s*(?:号|號))?/i,
    /(?:^|\s)(?:\d+\s*F\s*[-\s]*)?([A-Z]{0,3}\d{2,4}[A-Z]?|[A-Z]\d?)\s+Row\s*([A-Z]|\d{1,3})[.。,\s-]*((?:\d+\s*)?X|\d{1,4}\s*[-到至]\s*\d{1,4}|\d{1,4}\s*(?:号|號))?/i,
  ];
  const match = patterns.map((pattern) => normalized.match(pattern)).find(Boolean);
  if (!match) return null;
  const zone = normalizeExtractedZoneToken(match[1], text);
  if (!zone || !isLikelyZoneCode(zone)) return null;
  const rowValue = String(match[2] || "").trim().toUpperCase();
  const row = rowValue ? `${rowValue}排` : "";
  const seat = String(match[3] || "").replace(/\s+/g, "").toUpperCase();
  return { zone, row, seat };
}

function parseHybridCompositeSeatInfo(value) {
  const text = normalizeCompositeSeatValue(value);
  if (!text) return null;
  const normalized = text
    .replace(/[.。,:：]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const zonePattern = "(?:PB|PC|PD|PE|PEN|R|Z|E|B|D|M|A|F|I{1,3})\\d+[A-Z]?|\\d{2,4}[A-Z]?|FE|FW";
  const rowUnitPattern = "[A-Z]?\\d{1,3}|[A-Z]|[一二三四五六七八九十]+";
  const rowPattern = `${rowUnitPattern}(?:\\s*[-到至~—]\\s*${rowUnitPattern})?`;
  const seatPattern = "(?:\\d+\\s*)?X|X|\\d{1,4}\\s*[-到至]\\s*\\d{1,4}\\s*(?:号|號)?|\\d{1,4}\\s*(?:号|號)?";
  const explicitZoneRow = normalized.match(
    new RegExp(`(${zonePattern})\\s*(?:区|區|구역|구)?\\s*(${rowPattern})\\s*(?:排|row|열)\\s*(${seatPattern})?`, "i"),
  );
  if (!explicitZoneRow) return null;
  const zone = normalizeExtractedZoneToken(explicitZoneRow[1], text);
  if (!zone || !isLikelyZoneCode(zone)) return null;
  const rowRaw = String(explicitZoneRow[2] || "")
    .trim()
    .toUpperCase()
    .replace(/\s*[-到至~—]\s*/g, "-");
  const row = rowRaw ? `${rowRaw}排` : "";
  const tail = normalized.slice((explicitZoneRow.index || 0) + explicitZoneRow[0].length);
  const tailSeat = extractSeatNumberFromText(tail, { allowBareRange: true });
  const seat = String(explicitZoneRow[3] || tailSeat || "").replace(/\s+/g, "").toUpperCase();
  return { zone, row, seat };
}

function hasKoreanText(value = "") {
  return /[\u3131-\u318e\uac00-\ud7a3]/.test(String(value || ""));
}

function normalizeKoreanSeatToken(value = "") {
  return String(value || "")
    .normalize("NFKC")
    .replace(/\s+/g, "")
    .replace(/[ｘＸ]/g, "X")
    .replace(/号|號|번|호/gi, "")
    .toUpperCase()
    .trim();
}

function normalizeKoreanRowToken(value = "") {
  const raw = String(value || "")
    .normalize("NFKC")
    .trim()
    .toUpperCase()
    .replace(/\s*[-到至~—]\s*/g, "-");
  return raw ? `${raw}排` : "";
}

function cleanKoreanZoneToken(value = "", sourceText = "") {
  const raw = String(value || "").normalize("NFKC").trim();
  if (!raw) return "";
  if (/^(one|are|we|exo)$/i.test(raw)) return raw;
  return normalizeExtractedZoneToken(raw, sourceText);
}

function parseKoreanCompositeSeatInfo(value) {
  const source = String(value || "").normalize("NFKC").trim();
  if (!source || !hasKoreanText(source)) return null;
  const text = source
    .replace(/입장\s*번호/gi, "입장번호")
    .replace(/[‐‑‒–—―～~]/g, "-")
    .replace(/\s+/g, " ")
    .trim();
  const compact = text.replace(/\s+/g, "");
  const zoneTokenPattern = "(?:[A-Z]{1,4}|I{1,3})?\\d{1,4}[A-Z]?|[A-Z]{1,4}|one|are|we|exo";
  const zoneMatch =
    text.match(new RegExp(`(${zoneTokenPattern})\\s*(?:구역|구|区|區)(?=$|\\s|[^A-Za-z0-9])`, "i")) ||
    compact.match(new RegExp(`(${zoneTokenPattern})(?:구역|구|区|區)`, "i"));
  const rowMatch =
    text.match(/([A-Z]?\d{1,3}|[A-Z])\s*(?:열|排)\b/i) ||
    compact.match(/([A-Z]?\d{1,3}|[A-Z])(?:열|排)/i);
  const entrySeatMatch =
    text.match(/입장번호\s*((?:\d+\s*)?[Xx]|[Xx]|\d{1,4}\s*[-到至]\s*\d{1,4}|\d{1,4})\s*(?:번|호|号|號)?/i) ||
    compact.match(/입장번호((?:\d+)?[Xx]|[Xx]|\d{1,4}[-到至]\d{1,4}|\d{1,4})(?:번|호|号|號)?/i);
  const seatAfterRowMatch = rowMatch
    ? text
        .slice((rowMatch.index || 0) + rowMatch[0].length)
        .match(/((?:\d+\s*)?[Xx]|[Xx]|\d{1,4}\s*[-到至]\s*\d{1,4}|\d{1,4})\s*(?:번|호|号|號)\b/i)
    : null;
  const explicitSeatMatch =
    entrySeatMatch ||
    seatAfterRowMatch ||
    text.match(/((?:\d+\s*)?[Xx]|[Xx])\s*(?:번|호|号|號)\b/i) ||
    compact.match(/((?:\d+)?[Xx]|[Xx])(?:번|호|号|號)/i);
  const zone = cleanKoreanZoneToken(zoneMatch?.[1] || "", text);
  const row = normalizeKoreanRowToken(rowMatch?.[1] || "");
  const seat = normalizeKoreanSeatToken(explicitSeatMatch?.[1] || "");
  const note = extractCompositeSeatNote(text);
  if (!zone && !row && !seat) return null;
  return { zone, row, seat, note };
}

function parseCompactCompositeSeatInfo(value) {
  const text = normalizeCompositeSeatValue(value);
  const match = text.match(
    /((?:PB|PC|PD|PE|PEN|R|Z|E|B|D|M|A|F|I{1,3})\d+[A-Z]?|\d{2,4}[A-Z]?|FE|FW)\s*(?:区|區)?\s*([A-Z]?\d{1,3}(?:\s*[-到至]\s*[A-Z]?\d{1,3})?|[A-Z]|[一二三四五六七八九十]+(?:\s*[-到至]\s*[A-Z]?\d{1,3})?)\s*(?:排|row|열)\s*((?:\d+\s*)?X|\d{1,4}\s*[-到至]\s*\d{1,4}\s*(?:号|號)?|\d{1,4}\s*(?:号|號)?)?/i,
  );
  if (!match) return null;
  const zone = normalizeExtractedZoneToken(match[1], text);
  if (!zone || !isLikelyZoneCode(zone)) return null;
  const row = extractSeatRowFromText(match[0], { preferActual: false }) || `${String(match[2] || "").trim().toUpperCase()}排`;
  const tail = text.slice((match.index || 0) + match[0].length);
  const tailSeat = tail.match(/((?:\d+\s*)?X|\d{1,4}\s*[-到至]\s*\d{1,4}\s*(?:号|號)?|\d{1,4}\s*(?:号|號))/i)?.[1] || "";
  const seat = String(match[3] || tailSeat || "").replace(/\s+/g, "").toUpperCase();
  return { zone, row, seat };
}

function parseLooseCompositeSeatInfo(value) {
  const text = normalizeCompositeSeatValue(value);
  if (!text) return null;
  const normalized = text
    .replace(/(?:看臺|看台|內場|内场|场内|場內|floor|층|层)/gi, " ")
    .replace(/\bSide\b/gi, " ")
    .replace(/[.。,:：]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const explicitZoneRow =
    normalized.match(
      /((?:PB|PC|PD|PE|PEN|R|Z|E|B|D|M|A|F|I{1,3})\d+[A-Z]?|\d{2,4}[A-Z]?|FE|FW)\s*(?:区|區|구역|구)?\s*([A-Z]?\d{1,3}(?:\s*[-到至]\s*[A-Z]?\d{1,3})?|[A-Z]|[一二三四五六七八九十]+)\s*(?:排|row|열)\s*((?:\d+\s*)?X|X|\d{1,4}\s*[-到至]\s*\d{1,4}\s*(?:号|號)?|\d{1,4}\s*(?:号|號)?)?/i,
    ) ||
    normalized.match(
      /((?:PB|PC|PD|PE|PEN|R|Z|E|B|D|M|A|F|I{1,3})\d+[A-Z]?|\d{2,4}[A-Z]?|FE|FW)\s+([A-Z])\s*((?:\d+\s*)?X|X|\d{1,4}\s*[-到至]\s*\d{1,4}\s*(?:号|號)?|\d{1,4}\s*(?:号|號)?)\b/i,
    );
  if (!explicitZoneRow) return null;
  const zone = normalizeExtractedZoneToken(explicitZoneRow[1], text);
  if (!zone || !isLikelyZoneCode(zone)) return null;
  const row = explicitZoneRow[2] ? `${String(explicitZoneRow[2]).trim().toUpperCase()}排` : "";
  const seat = String(explicitZoneRow[3] || "").replace(/\s+/g, "").toUpperCase();
  return { zone, row, seat };
}

function parseCompositeSeatInfo(value) {
  const text = normalizeCompositeSeatValue(value);
  if (!text) return null;
  const date = extractDateFromCompositeSeatText(text);
  const withoutDate = text
    .replace(/(?:^|[^\d])20\d{6}(?=$|[^\d])/, " ")
    .replace(/(?:^|[^\d])20\d{2}[./\-年]\d{1,2}[./\-月]\d{1,2}\s*(?:日|号)?(?=$|[^\d])/, " ")
    .replace(/(?:^|[^\d])\d{1,2}[./\-月]\d{1,2}\s*(?:日|号)?(?=$|[^\d])/, " ")
    .replace(/\s+/g, " ")
    .trim();
  const parsedLocation =
    parseEnglishSideRowPosition(withoutDate) ||
    parseKoreanCompositeSeatInfo(withoutDate) ||
    parseHybridCompositeSeatInfo(withoutDate) ||
    parseLooseCompositeSeatInfo(withoutDate) ||
    parseEnglishCompositeSeatInfo(withoutDate) ||
    parseCompactCompositeSeatInfo(withoutDate);
  if (parsedLocation?.zone) {
    return {
      date,
      zone: parsedLocation.zone,
      row: parsedLocation.row || "",
      seat: parsedLocation.seat || "",
      note: extractCompositeSeatNote(text),
    };
  }
  const compactLocation = date
    ? withoutDate.match(
        /(?:^|\s)(\d{2,4}[A-Z]?|[A-Z]{1,4}\d+[A-Z]?|[A-Z]\d?)(?:\s+|[.。,:：-]+)([A-Z]|\d{1,3})(?:\s+|[.。,:：-]+)(\d*X|X|\d{1,4}\s*[-到至~—]\s*\d{1,4}\s*(?:号|號)?|\d{1,4}\s*(?:号|號)?)(?:$|\s)/i,
      )
    : null;
  if (compactLocation) {
    return {
      date,
      zone: cleanZoneToken(compactLocation[1]),
      row: `${String(compactLocation[2]).trim().toUpperCase()}排`,
      seat: String(compactLocation[3]).replace(/\s+/g, "").toUpperCase(),
      note: extractCompositeSeatNote(text),
    };
  }
  const zoneFromText = extractZoneTokenFromText(text);
  const zoneMatch =
    text.match(/((?:I{1,3}|[A-Z]{1,4})\d+[A-Z]?|\d{2,4}[A-Z]?|[A-Z]{1,4}|[一二三四五六七八九十]+)\s*(?:区|區|구역|구|section|block|area|zone)/i) ||
    text.match(/((?:PB|PC|PD|PE|PEN|R|Z|E|B|D|M|A|F|I{1,3})\d+[A-Z]?|FE|FW)(?=\s*(?:side|row|排|열|区|區|구|$))/i) ||
    text.match(/((?:PB|PC|PD|PE|PEN|R|Z|E|B|D|M|A|F|I{1,3})\d+[A-Z]?|FE|FW)\b/i);
  if (!zoneMatch && !zoneFromText) return null;
  let zone = chooseBetterZoneToken(zoneMatch?.[1], zoneFromText);
  const afterZone = zoneMatch ? text.slice(zoneMatch.index + zoneMatch[0].length).trim() : text;
  const zoneRepeatedWithRow = afterZone.match(/^([A-Z])\s*(\d+[A-Z]?)\s*(?:排|row|열)/i);
  if (/^[A-Z]$/i.test(zone) && zoneRepeatedWithRow && zoneRepeatedWithRow[1].toUpperCase() === zone.toUpperCase()) {
    zone = `${zoneRepeatedWithRow[1].toUpperCase()}${zoneRepeatedWithRow[2].toUpperCase()}`;
  }
  const row = extractSeatRowFromText(afterZone, { preferActual: false }) || extractSeatRowFromText(text, { preferActual: false });
  const seatCandidate = removeFirstSeatRowPhrase(afterZone);
  const seat =
    extractSeatNumberFromText(afterZone, { allowBareRange: true }) ||
    extractSeatNumberFromText(seatCandidate, { allowBareRange: true }) ||
    "";
  const note = extractCompositeSeatNote(text);
  if (!zone || (!row && !seat && !date)) return null;
  return { date, zone, row, seat, note };
}

function getZoneTokenFromCell(value) {
  const parsed = parseCompositeSeatInfo(value);
  return parsed?.zone || extractZoneTokenFromText(value) || cleanZoneToken(value);
}

function isCompositeZoneRowColumnName(column = "") {
  const text = String(column || "");
  const normalized = normalize(text);
  if (!normalized) return false;
  const hasZoneCue = /(区域|区|區|位置|席位|구역|구|block|section|zone|area)/i.test(text);
  const hasRowCue = /(排数|排|行数|行|row|열)/i.test(text);
  if (hasZoneCue && hasRowCue) return true;
  return /(区域排|区排|位置排|zonerow|sectionrow|blockrow|구역열|구열)/i.test(normalized);
}

function repairCompositeSeatInfo(table, row, indexes) {
  const { zoneIndex: sourceIndex } = indexes;
  if (sourceIndex < 0) return false;
  const parsed = parseCompositeSeatInfo(row[sourceIndex]);
  if (!parsed) return false;
  let changed = false;
  const sourceColumn = table.columns[sourceIndex] || "";
  const sourceIsCompositeZoneRow = isCompositeZoneRowColumnName(sourceColumn);
  const sourceIsSeatStructureColumn =
    isSeatLocationColumnName(sourceColumn) || isSeatRowColumnName(sourceColumn) || isSeatNumberColumnName(sourceColumn);
  const sourceNeedsDedicatedSplit = sourceIsCompositeZoneRow || (parsed.zone && parsed.row && sourceIsSeatStructureColumn);
  if (parsed.date) {
    const dateIndex = ensureDateColumn(table);
    const currentDate = String(row[dateIndex] || "").trim();
    if (!currentDate || !isLikelyDateValue(currentDate)) {
      row[dateIndex] = parsed.date;
      changed = true;
    }
  }
  const zoneIndex = sourceNeedsDedicatedSplit
    ? ensureDedicatedColumn(table, "区域")
    : /区域|区|區|位置|구역|block|section|zone|area/i.test(sourceColumn)
      ? sourceIndex
      : ensureNamedColumn(table, "区域", ["区域", "区", "block", "section", "구역"]);
  if (parsed.zone && cleanZoneToken(row[zoneIndex]) !== parsed.zone) {
    row[zoneIndex] = parsed.zone;
    changed = true;
  }
  if (parsed.row) {
    const rowIndex = sourceNeedsDedicatedSplit ? ensureDedicatedColumn(table, "排") : ensureSeatRowColumn(table);
    const displacedRowValue = String(row[rowIndex] || "").trim();
    const shouldReplaceRow =
      !displacedRowValue ||
      cleanZoneToken(displacedRowValue) === cleanZoneToken(parsed.zone) ||
      isLikelySeatNumberValue(displacedRowValue) ||
      isLikelySalePriceValue(displacedRowValue);
    if (shouldReplaceRow || String(displacedRowValue).trim().toUpperCase() !== parsed.row.toUpperCase()) {
      row[rowIndex] = parsed.row;
      changed = true;
    }
    if (displacedRowValue && isLikelySeatNumberValue(displacedRowValue)) {
      const seatIndex = ensureSeatNumberColumn(table);
      if (!isLikelySeatNumberValue(row[seatIndex]) || isLikelySerialValue(row[seatIndex])) {
        row[seatIndex] = displacedRowValue;
        changed = true;
      }
    }
  }
  if (parsed.seat) {
    const seatIndex = ensureSeatNumberColumn(table);
    if (!isLikelySeatNumberValue(row[seatIndex])) {
      row[seatIndex] = parsed.seat;
      changed = true;
    }
  }
  if (parsed.note) {
    const remarkIndex = ensureNamedColumn(table, "备注", ["备注", "remark", "note", "说明"]);
    const existingRemark = String(row[remarkIndex] || "").trim();
    if (!existingRemark) {
      row[remarkIndex] = parsed.note;
      changed = true;
    } else if (!normalize(existingRemark).includes(normalize(parsed.note))) {
      row[remarkIndex] = `${existingRemark} ${parsed.note}`.trim();
      changed = true;
    }
  }
  if (
    sourceIndex !== zoneIndex &&
    (isFaceValueColumnName(sourceColumn) || (sourceNeedsDedicatedSplit && !isRemarkColumnName(sourceColumn))) &&
    String(row[sourceIndex] || "").trim()
  ) {
    row[sourceIndex] = "";
    changed = true;
  }
  return changed;
}

function repairCompositeSeatInfoFromCandidateColumns(table, row) {
  const columns = table.columns || [];
  const preferredIndexes = [
    ...findColumnIndexes(columns, ["区域", "区", "位置", "block", "section", "구역", "구", "위치"]),
    ...findColumnIndexes(columns, ["票面", "票价", "价位", "面值", "席位", "席别", "席別", "座席", "类型", "类别", "face", "category", "cat", "좌석", "등급", "구분"]),
  ];
  const fallbackIndexes = row
    .map((value, index) => ({ value, index, column: columns[index] || "" }))
    .filter(({ value, column }) => {
      if (!String(value || "").trim()) return false;
      if (isInternalColorColumn(column) || isSalePriceColumnName(column) || isRemarkColumnName(column) || isQuantityColumnName(column)) return false;
      return Boolean(parseCompositeSeatInfo(value));
    })
    .map(({ index }) => index);
  const candidateIndexes = [...new Set([...preferredIndexes, ...fallbackIndexes])];
  return candidateIndexes.some((zoneIndex) => repairCompositeSeatInfo(table, row, { zoneIndex }));
}

function repairCompositeSeatInfoFromAnyCell(table, row) {
  const columns = table.columns || [];
  let changed = false;
  row.forEach((value, index) => {
    const column = columns[index] || "";
    if (!String(value || "").trim()) return;
    if (isInternalColorColumn(column) || isSalePriceColumnName(column) || isQuantityColumnName(column) || isRemarkColumnName(column)) return;
    const parsed = parseCompositeSeatInfo(value);
    if (!parsed || !(parsed.date || parsed.zone || parsed.row || parsed.seat)) return;
    if (repairCompositeSeatInfo(table, row, { zoneIndex: index })) changed = true;
  });
  return changed;
}

function repairSeparatedSeatPositionFields(table, row) {
  if (!table || !Array.isArray(table.columns) || !Array.isArray(row)) return false;
  let changed = false;
  const rowIndex = ensureSeatRowColumn(table);
  const seatIndex = ensureSeatNumberColumn(table);
  const candidates = row.map((value, index) => ({ value, index, column: table.columns[index] || "" }));
  const rowCandidate = candidates
    .map((item) => ({
      ...item,
      parsed: extractSeatRowFromText(item.value, { allowBareRange: isSeatRowColumnName(item.column) }),
      score:
        (isSeatRowColumnName(item.column) ? 120 : 0) +
        (/票面排数|门票排数|座位排数|票面位置|门票位置|座位位置|座位图位置/i.test(item.column) ? 50 : 0) +
        (/[-到至]/.test(String(item.value || "")) ? 45 : 0) +
        (/实际/.test(String(item.value || "")) ? 8 : 0),
    }))
    .filter((item) => item.parsed)
    .sort((a, b) => b.score - a.score)[0];
  const currentRowValue = String(row[rowIndex] || "").trim();
  const currentRowParsed = extractSeatRowFromText(currentRowValue, { allowBareRange: isSeatRowColumnName(table.columns[rowIndex]) });
  const sourceIsRowColumn = rowCandidate?.index === rowIndex || isSeatRowColumnName(rowCandidate?.column || "");
  const shouldUseRowCandidate =
    rowCandidate &&
    (sourceIsRowColumn || !currentRowParsed) &&
    isBetterSeatRowCandidate(rowCandidate.parsed, row[rowIndex]);
  if (shouldUseRowCandidate) {
    row[rowIndex] = rowCandidate.parsed;
    changed = true;
  }

  const seatCandidate = candidates
    .map((item) => ({
      ...item,
      parsed: extractSeatNumberFromText(item.value, { allowBareRange: isSeatNumberColumnName(item.column) }),
      score:
        (isSeatNumberColumnName(item.column) ? 120 : 0) +
        (/票面号段|门票号段|座位号段|座位号|号段|号码/i.test(item.column) ? 40 : 0) +
        (/[-到至]/.test(String(item.value || "")) ? 35 : 0),
    }))
    .filter((item) => item.parsed)
    .sort((a, b) => b.score - a.score)[0];
  if (seatCandidate && isBetterSeatNumberCandidate(seatCandidate.parsed, row[seatIndex])) {
    row[seatIndex] = seatCandidate.parsed;
    changed = true;
  }
  return changed;
}

function getLikelyZoneFromRow(table, row) {
  const columns = table.columns || [];
  const preferredIndexes = findColumnIndexes(columns, ["位置", "区域", "区", "block", "section", "구역", "구"]);
  const matchedBySeatmap = preferredIndexes.find((index) =>
    currentEvent?.zones?.some((zone) => zoneTokenMatches(row[index], zone)),
  );
  if (matchedBySeatmap >= 0) return getZoneTokenFromCell(row[matchedBySeatmap]);

  const compositeIndex = preferredIndexes.find((index) => parseCompositeSeatInfo(row[index])?.zone);
  if (compositeIndex >= 0) return parseCompositeSeatInfo(row[compositeIndex])?.zone || "";

  const likelyIndex = preferredIndexes.find((index) => isLikelyZoneCode(row[index]));
  if (likelyIndex >= 0) return getZoneTokenFromCell(row[likelyIndex]);

  return findLikelyZoneValueInRow(table, row);
}

function findSeatmapZoneValueInRow(table, row) {
  const zones = currentEvent?.zones || [];
  if (!zones.length) return "";
  const columns = table.columns || [];
  const ignoredIndexes = new Set([
    ...findColumnIndexes(columns, DATE_COLUMN_NAMES),
    ...findSalePriceColumnIndexes(columns),
    ...findColumnIndexes(columns, ["售价", "单价", "价格", "报价", "金额", "ask", "price"]),
    ...findColumnIndexes(columns, ["备注", "remark", "note", "说明", "状态", "status"]),
  ]);
  const candidates = row
    .map((value, index) => ({ value, index, token: getZoneTokenFromCell(value) }))
    .filter(({ value, index, token }) => value && token && !ignoredIndexes.has(index))
    .filter(({ value, token }) => isLikelyZoneCode(token) || zones.some((zone) => zoneTokenMatches(value, zone)))
    .filter(({ value }) => zones.some((zone) => zoneTokenMatches(value, zone)));
  const preferred = candidates.find(({ index }) => /区域|区|位置|block|section|zone|area/i.test(columns[index] || ""));
  return getZoneTokenFromCell((preferred || candidates[0] || {}).value || "");
}

function findLikelyZoneValueInRow(table, row) {
  const columns = table.columns || [];
  const ignoredIndexes = new Set([
    ...findColumnIndexes(columns, DATE_COLUMN_NAMES),
    ...findSalePriceColumnIndexes(columns),
    ...findColumnIndexes(columns, ["售价", "单价", "价格", "报价", "金额", "ask", "price"]),
    ...findColumnIndexes(columns, ["状态", "售卖状态", "销售状态", "status", "是否售出", "售出"]),
  ]);
  const candidates = row
    .map((value, index) => ({ value, index, token: getZoneTokenFromCell(value), column: columns[index] || "" }))
    .filter(({ value, index, token }) => value && token && !ignoredIndexes.has(index))
    .filter(({ value, token }) => isLikelyZoneCode(token) || currentEvent?.zones?.some((zone) => zoneTokenMatches(value, zone)));
  if (!candidates.length) return "";
  const seatmapMatched = candidates.find(({ value }) => currentEvent?.zones?.some((zone) => zoneTokenMatches(value, zone)));
  const headerMatched = candidates.find(({ column }) => /区域|区|位置|block|section|zone|area|仅供参考/i.test(column));
  const strongZone = candidates.find(({ token }) => isLikelyZoneCode(token));
  return getZoneTokenFromCell((seatmapMatched || headerMatched || strongZone || candidates[0]).value);
}

function repairZoneFromPosition(table, row) {
  const zoneIndex = ensureDedicatedColumn(table, "区域");
  const rowIndex = ensureSeatRowColumn(table);
  const seatIndex = ensureSeatNumberColumn(table);
  const currentZone = cleanZoneToken(row[zoneIndex]);
  const bestZone = getLikelyZoneFromRow(table, row) || findSeatmapZoneValueInRow(table, row);
  if (!bestZone || bestZone === currentZone) return false;
  if (isLikelyZoneCode(bestZone) && (!isLikelyZoneCode(currentZone) || /^\d{1,2}$/.test(currentZone))) {
    const displacedRow = row[zoneIndex];
    const displacedSeat = row[rowIndex];
    const displacedPrice = row[seatIndex];
    row[zoneIndex] = bestZone;
    if (isLikelySeatRowValue(displacedRow) && !isLikelyZoneCode(displacedRow)) {
      row[rowIndex] = displacedRow;
    }
    if (isLikelySeatNumberValue(displacedSeat) && !isLikelySalePriceValue(displacedSeat)) {
      row[seatIndex] = displacedSeat;
    }
    if (isLikelySalePriceValue(displacedPrice) && !hasTicketSalePrice({ table, row, index: -1 })) {
      const priceIndex = ensureSalePriceColumn(table);
      row[priceIndex] = displacedPrice;
    }
    return true;
  }
  return false;
}

function getBestSalePriceFromRow(table, row) {
  const priceIndexes = findPreferredSalePriceColumnIndexes(table.columns || []);
  for (const index of priceIndexes) {
    const price = extractSalePriceText(row[index], { minPrice: 100 });
    if (price) return price;
  }

  const zoneIndex = findColumnIndex(table.columns || [], ["区域", "区", "block", "section", "구역"]);
  const preferredIndexes = (table.columns || [])
    .map((column, index) => ({ column, index }))
    .filter(({ index }) => index !== zoneIndex)
    .filter(({ column }) => !isInternalColorColumn(column))
    .filter(({ column }) => isSalePriceColumnName(column) || /售价|价格|单价|报价|金额|price|ask/i.test(column))
    .map(({ index }) => index);
  const preferredValue = preferredIndexes.map((index) => extractSalePriceText(row[index], { minPrice: 100 })).find(Boolean);
  if (preferredValue) return preferredValue;

  const tailValues = row
    .map((value, index) => ({ value, column: table.columns[index] || "", index }))
    .filter(({ column, value }) => !isInternalColorColumn(column) && !isLikelyRowColorValue(value))
    .filter(({ column }) => !isQuantityColumnName(column))
    .filter(({ column, value, index }) => {
      if (isSalePriceColumnName(column)) return true;
      if (isSeatmapImageColumnName(column) && index >= Math.max(0, row.length - 2) && extractSalePriceText(value, { minPrice: 1000 })) return true;
      if (isFaceValueColumnName(column) || isProtectedNonPriceColumnName(column)) return false;
      if (isRemarkColumnName(column) || isDeliveryColumnName(column)) return false;
      return true;
    })
    .map(({ value, column, index }) => ({ value, column, index }))
    .reverse();
  return (
    tailValues
      .map(({ value, column, index }) => {
        const minPrice = isSalePriceColumnName(column) ? 100 : 1000;
        return extractSalePriceText(value, { minPrice });
      })
      .find(Boolean) ||
    getSalePriceCandidateFromRow(table, row)?.price ||
    ""
  );
}

function findFallbackSalePriceFromAnyCell(table, row) {
  const columns = table.columns || [];
  const ignoredIndexes = new Set([
    ...findColumnIndexes(columns, DATE_COLUMN_NAMES),
    ...findColumnIndexes(columns, ["序号", "编号", "no", "id"]),
    ...findColumnIndexes(columns, ["区域", "区", "block", "section", "구역"]),
    ...findSeatRowColumnIndexes(columns),
    ...findSeatNumberColumnIndexes(columns),
    ...findColumnIndexes(columns, ["数量", "张数", "连坐", "qty", "count", "매수", "수량"]),
  ]);
  const candidates = row
    .map((value, index) => ({ value: String(value || "").trim(), index, column: columns[index] || "" }))
    .filter(({ value, index, column }) => {
      if (!value || ignoredIndexes.has(index) || isInternalColorColumn(column) || isLikelyRowColorValue(value)) return false;
      if (isSoldText(value, { strict: true }) || isLikelyDateValue(value)) return false;
      if (isSeatmapImageColumnName(column) && index < Math.max(0, row.length - 2)) return false;
      return Boolean(extractSalePriceText(value, { minPrice: 100 }));
    })
    .map((item) => {
      const price = extractSalePriceText(item.value, { minPrice: 100 });
      const number = extractNumber(price);
      const hasCurrency = /[￥¥$€£₩]/.test(item.value);
      const saleHeader = isSalePriceColumnName(item.column);
      const tail = item.index >= Math.max(0, row.length - 3);
      let score = 0;
      if (saleHeader) score += 120;
      if (hasCurrency) score += 70;
      if (tail) score += 45;
      if (number >= 1000) score += 35;
      if (number >= 10000) score += 8;
      if (isRemarkColumnName(item.column) || isDeliveryColumnName(item.column)) score += 20;
      if (number < 1000 && !hasCurrency && !saleHeader) score -= 35;
      return { ...item, price, score };
    })
    .filter((item) => item.score >= 35)
    .sort((a, b) => b.score - a.score || b.index - a.index);
  return candidates[0] || null;
}

function repairCompactShiftedTicketRow(table, row) {
  if (!table || !Array.isArray(row) || hasTicketSalePrice({ table, row, index: -1 })) return false;
  const columns = table.columns || [];
  if (!columns.some(isSalePriceColumnName)) return false;
  const candidates = row
    .map((value, index) => ({ value: String(value || "").trim(), index, column: columns[index] || "" }))
    .filter(({ value, column }) => value && !isInternalColorColumn(column) && !isLikelyRowColorValue(value))
    .filter(({ value }) => !isSoldText(value, { strict: true }) && isLikelySalePriceValue(value, { minPrice: 1000 }))
    .filter(({ column }) => !isSalePriceColumnName(column) && isProtectedNonPriceColumnName(column))
    .sort((a, b) => b.index - a.index);
  const candidate = candidates[0];
  if (!candidate) return false;
  const compactValues = row.slice(0, candidate.index + 1).map((cell) => String(cell || "").trim()).filter(Boolean);
  const mapped = alignCompactTicketRowToColumns(compactValues, columns);
  if (!mapped || !hasTicketSalePrice({ table, row: mapped, index: -1 })) return false;
  const quantityIndex = findQuantityColumnIndex(columns);
  const existingQuantity = quantityIndex >= 0 && isLikelySeatCountValue(row[quantityIndex]) ? String(row[quantityIndex] || "").trim() : "";
  columns.forEach((column, index) => {
    const field = getDefaultFieldForHeader(column);
    if (!field || isInternalColorColumn(column)) return;
    row[index] = mapped[index] || "";
  });
  if (existingQuantity && quantityIndex >= 0 && !String(row[quantityIndex] || "").trim()) row[quantityIndex] = existingQuantity;
  return true;
}

function repairSalePriceAndQuantity(table, row) {
  let changed = false;
  if (repairCompactShiftedTicketRow(table, row)) {
    changed = true;
  }
  if (repairShiftedSalePriceAndRemark(table, row)) {
    changed = true;
  }
  const bestPrice = getBestSalePriceFromRow(table, row);
  if (bestPrice && !getDirectSalePriceFromRow(table, row)) {
    const priceIndex = ensureSalePriceColumn(table);
    if (row[priceIndex] !== bestPrice) {
      row[priceIndex] = bestPrice;
      changed = true;
    }
  }

  if (!hasTicketSalePrice({ table, row, index: -1 })) {
    const fallbackPrice = findFallbackSalePriceFromAnyCell(table, row);
    if (fallbackPrice?.price) {
      const priceIndex = ensureSalePriceColumn(table);
      row[priceIndex] = fallbackPrice.price;
      if (shouldClearMovedPriceSource(table, fallbackPrice.index, priceIndex, fallbackPrice.value)) row[fallbackPrice.index] = "";
      changed = true;
    }
  }

  const quantityIndex = findQuantityColumnIndex(table.columns);
  if (quantityIndex >= 0) {
    const quantityValue = String(row[quantityIndex] || "").trim();
    const quantityNumber = extractNumber(quantityValue);
    if (isLikelySalePriceValue(quantityValue, { minPrice: 100 }) && hasTicketSalePrice({ table, row, index: -1 })) {
      row[quantityIndex] = "";
      changed = true;
    } else if (quantityValue && !isLikelySeatCountValue(quantityValue)) {
      if (quantityNumber && quantityNumber > 20) {
        if (!hasTicketSalePrice({ table, row, index: -1 })) {
          const priceIndex = ensureSalePriceColumn(table);
          const movedPrice = extractSalePriceText(quantityValue, { minPrice: 100 }) || quantityValue;
          if (row[priceIndex] !== movedPrice) {
            row[priceIndex] = movedPrice;
            changed = true;
          }
        }
        row[quantityIndex] = "";
        changed = true;
      }
    }
  }

  const rowIndex = findSeatRowColumnIndexes(table.columns)[0] ?? -1;
  if (rowIndex >= 0 && isLikelySalePriceValue(row[rowIndex]) && hasTicketSalePrice({ table, row, index: -1 })) {
    row[rowIndex] = "";
    changed = true;
  }
  const seatIndex = findSeatNumberColumnIndexes(table.columns)[0] ?? -1;
  if (seatIndex >= 0 && isLikelySalePriceValue(row[seatIndex]) && hasTicketSalePrice({ table, row, index: -1 })) {
    row[seatIndex] = "";
    changed = true;
  }
  return changed;
}

function repairMergedContextValues(table) {
  if (!table || !Array.isArray(table.columns) || !Array.isArray(table.rows)) return false;
  let changed = false;
  const dateIndex = findColumnIndex(table.columns, DATE_COLUMN_NAMES);
  const zoneIndex = findColumnIndex(table.columns, ["区域", "区", "block", "section", "구역"]);
  const rowIndex = ensureSeatRowColumn(table);
  const seatIndex = ensureSeatNumberColumn(table);
  let lastDate = "";
  let lastZone = "";

  table.rows.forEach((row, index) => {
    while (row.length < table.columns.length) row.push("");
    const rowValue = String(row[rowIndex] || "").trim();
    const seatValue = String(row[seatIndex] || "").trim();
    const hasInheritedTicketContent =
      isLikelySeatRowValue(rowValue) ||
      isLikelySeatNumberValue(seatValue) ||
      hasTicketSalePrice({ table, row, index: -1 });
    if (dateIndex >= 0) {
      const currentDate = String(row[dateIndex] || "").trim();
      if (currentDate && isLikelyDateColumnValue(currentDate)) {
        lastDate = currentDate;
      } else if (lastDate && !table.userEditedRows?.[index]) {
        const dateCellLooksLikePosition =
          currentDate &&
          (Boolean(parseCompositeSeatInfo(currentDate)) ||
            isLikelyZoneCode(currentDate) ||
            isLikelySeatRowValue(currentDate) ||
            isLikelySeatNumberValue(currentDate));
        if (!currentDate || (dateCellLooksLikePosition && hasInheritedTicketContent)) {
          row[dateIndex] = lastDate;
          changed = true;
        }
      }
    }

    if (zoneIndex < 0) return;
    const currentZone = cleanZoneToken(row[zoneIndex]);
    if (isLikelyZoneCode(currentZone)) {
      lastZone = currentZone;
      return;
    }

    if (table.userEditedRows?.[index]) return;

    if (lastZone && currentZone && isLikelySeatRowValue(currentZone)) {
      if (!rowValue || !isLikelySeatRowValue(rowValue) || isLikelySalePriceValue(rowValue)) {
        row[rowIndex] = row[zoneIndex];
        changed = true;
      }
      row[zoneIndex] = lastZone;
      changed = true;
      return;
    }

    if (lastZone && !currentZone && hasInheritedTicketContent) {
      row[zoneIndex] = lastZone;
      changed = true;
    }
  });
  return changed;
}

function normalizePendingTableColumns(table) {
  if (!table || !Array.isArray(table.columns) || !Array.isArray(table.rows)) return table;
  const initialSignature = [
    (table.columns || []).join("\u0001"),
    (table.rows || []).map((row) => (Array.isArray(row) ? row.join("\u0001") : "")).join("\u0002"),
  ].join("\u0003");
  if (table._normalizedColumnsSignature === initialSignature && Number(table._columnNormalizationVersion || 0) === COLUMN_NORMALIZATION_VERSION) {
    return table;
  }
  extendColumnsForOverflowRows(table.columns, table.rows);
  ensureOriginalTableSnapshot(table);
  let changed = false;
  if (repairTailSalePriceAndExplicitRowColumns(table)) changed = true;
  table.rows.forEach((row) => {
    while (row.length < table.columns.length) {
      row.push("");
      changed = true;
    }
  });

  table.rows.forEach((row, rowIndex) => {
    if (table.userEditedRows?.[rowIndex]) return;
    if (repairCompactShiftedTicketRow(table, row)) changed = true;
  });

  if (repairSemanticColumnRoles(table)) {
    changed = true;
  }
  if (repairTailSalePriceAndExplicitRowColumns(table)) {
    changed = true;
  }

  let priceIndex = findSalePriceColumnIndex(table.columns);
  const misreadPriceIndex = findMisreadSalePriceColumnIndex(table);
  if (priceIndex < 0 && misreadPriceIndex >= 0) {
    table.columns[misreadPriceIndex] = "售价";
    priceIndex = misreadPriceIndex;
    changed = true;
  }

  let colorIndex = getRowColorColumnIndex(table);
  const colorCandidateIndex = table.columns.findIndex(
    (column, index) => index !== priceIndex && isInternalColorColumn(column) && columnRatio(table, index, isLikelyRowColorValue) >= 0.6,
  );
  if (colorIndex < 0 && colorCandidateIndex >= 0) {
    table.columns[colorCandidateIndex] = "行底色";
    colorIndex = colorCandidateIndex;
    changed = true;
  }

  let quantityIndex = findQuantityColumnIndex(table.columns);
  table.rows.forEach((row, rowIndex) => {
    const manuallyEdited = Boolean(table.userEditedRows?.[rowIndex]);
    if (!manuallyEdited && moveBusinessStatusMarkersToRemark(table, row)) {
      changed = true;
    }

    if (!manuallyEdited) {
      const repairedComposite = repairCompositeSeatInfoFromCandidateColumns(table, row);
      const repairedCompositeAnyCell = repairCompositeSeatInfoFromAnyCell(table, row);
      const repairedSeparatedPosition = repairSeparatedSeatPositionFields(table, row);
      const repairedZone = repairZoneFromPosition(table, row);
      if (repairedComposite || repairedCompositeAnyCell || repairedSeparatedPosition || repairedZone) {
        changed = true;
        quantityIndex = findQuantityColumnIndex(table.columns);
        priceIndex = findSalePriceColumnIndex(table.columns);
      }
    }

    if (!manuallyEdited && repairSalePriceAndQuantity(table, row)) {
      changed = true;
      quantityIndex = findQuantityColumnIndex(table.columns);
      priceIndex = findSalePriceColumnIndex(table.columns);
    }
    if (!manuallyEdited && repairExplicitCurrencyPriceInWrongColumn(table, row, rowIndex)) {
      changed = true;
      quantityIndex = findQuantityColumnIndex(table.columns);
      priceIndex = findSalePriceColumnIndex(table.columns);
    }

    const priceMissing = priceIndex < 0 || !hasTicketSalePrice({ table, row, index: -1 });
    if (!manuallyEdited && priceMissing && colorIndex >= 0 && isLikelySalePriceValue(row[colorIndex], { minPrice: 100 })) {
      const movedPrice = row[colorIndex];
      if (quantityIndex >= 0 && isLikelyRowColorValue(row[quantityIndex])) {
        if (row[colorIndex] !== row[quantityIndex]) {
          row[colorIndex] = row[quantityIndex];
          changed = true;
        }
        if (row[quantityIndex] !== "") {
          row[quantityIndex] = "";
          changed = true;
        }
      }
      priceIndex = ensureSalePriceColumn(table);
      if (row[priceIndex] !== movedPrice) {
        row[priceIndex] = movedPrice;
        changed = true;
      }
      quantityIndex = findQuantityColumnIndex(table.columns);
    }

    if (
      !manuallyEdited &&
      priceIndex >= 0 &&
      !hasTicketSalePrice({ table, row, index: -1 }) &&
      quantityIndex >= 0 &&
      isLikelySalePriceValue(row[quantityIndex], { minPrice: 100 })
    ) {
      if (row[priceIndex] !== row[quantityIndex]) {
        row[priceIndex] = row[quantityIndex];
        changed = true;
      }
    }

  });

  if (repairMisplacedDateAndPriceValues(table)) {
    changed = true;
    quantityIndex = findQuantityColumnIndex(table.columns);
    priceIndex = findSalePriceColumnIndex(table.columns);
  }
  if (repairTailSalePriceAndExplicitRowColumns(table)) {
    changed = true;
    quantityIndex = findQuantityColumnIndex(table.columns);
    priceIndex = findSalePriceColumnIndex(table.columns);
  }

  if (repairMergedContextValues(table)) {
    changed = true;
    table.rows.forEach((row, rowIndex) => {
      if (table.userEditedRows?.[rowIndex]) return;
      if (repairSalePriceAndQuantity(table, row)) changed = true;
      if (repairExplicitCurrencyPriceInWrongColumn(table, row, rowIndex)) changed = true;
    });
    if (repairMisplacedDateAndPriceValues(table)) changed = true;
  }

  if (mergeDuplicateColumnsByName(table)) {
    changed = true;
    if (repairSemanticColumnRoles(table)) changed = true;
    table.rows.forEach((row, rowIndex) => {
      if (table.userEditedRows?.[rowIndex]) return;
      const repairedComposite = repairCompositeSeatInfoFromCandidateColumns(table, row);
      const repairedCompositeAnyCell = repairCompositeSeatInfoFromAnyCell(table, row);
      const repairedSeparatedPosition = repairSeparatedSeatPositionFields(table, row);
      const repairedZone = repairZoneFromPosition(table, row);
      if (repairedComposite || repairedCompositeAnyCell || repairedSeparatedPosition || repairedZone) {
        changed = true;
      }
      if (repairSalePriceAndQuantity(table, row)) changed = true;
      if (repairExplicitCurrencyPriceInWrongColumn(table, row, rowIndex)) changed = true;
    });
    if (repairMergedContextValues(table)) changed = true;
    if (repairMisplacedDateAndPriceValues(table)) changed = true;
  }
  if (repairTailSalePriceAndExplicitRowColumns(table)) {
    changed = true;
  }

  table.autoRepairedColumns = Boolean(table.autoRepairedColumns || changed);
  table._columnRepairChanged = changed;
  table._normalizedColumnsSignature = [
    (table.columns || []).join("\u0001"),
    (table.rows || []).map((row) => (Array.isArray(row) ? row.join("\u0001") : "")).join("\u0002"),
  ].join("\u0003");
  table._columnNormalizationVersion = COLUMN_NORMALIZATION_VERSION;
  return table;
}

function ensureDefaultQuantityColumn(table) {
  if (!table || !Array.isArray(table.columns) || !Array.isArray(table.rows)) return -1;
  let quantityIndex = findQuantityColumnIndex(table.columns);
  if (quantityIndex < 0) {
    return -1;
  }
  table.rows.forEach((row) => {
    while (row.length < table.columns.length) row.push("");
    if (!String(row[quantityIndex] || "").trim()) row[quantityIndex] = "1";
  });
  return quantityIndex;
}

function normalizeRowColorLabel(value) {
  const raw = normalize(value);
  if (!raw || /^[￥¥$,\d.]+$/.test(raw)) return "";
  const text = raw
    .replace(/\s+/g, "")
    .replace(/底色|背景色|行色|色/g, "")
    .replace(/浅|淡|深|亮|明显/g, "");
  if (!text || /^(无|空|默认|透明|unknown|不确定|无法判断|看不清|na|n\/a|-|\/)$/.test(text)) return "";
  if (/white|白|灰白|米白/.test(text)) return "白底";
  if (/pink|粉/.test(text)) return "粉底";
  if (/red|红/.test(text)) return "红底";
  if (/yellow|黄|橙黄/.test(text)) return "黄底";
  if (/orange|橙/.test(text)) return "橙底";
  if (/green|绿/.test(text)) return "绿底";
  if (/gray|grey|灰/.test(text)) return "灰底";
  if (/blue|蓝/.test(text)) return "蓝底";
  if (/purple|violet|紫/.test(text)) return "紫底";
  if (/black|黑/.test(text)) return "黑底";
  if (/cyan|青|湖蓝|天蓝/.test(text)) return "青底";
  if (/非白|有色|彩色|colored|colour/.test(text)) return "非白底";
  return "";
}

function getOpenCvCellStats(item) {
  const cellCount = Number(item?.cellCount || 0);
  const coloredCellCount = Number(item?.coloredCellCount || 0);
  const whiteCellCount = Number(item?.whiteCellCount || 0);
  return {
    cellCount,
    coloredCellCount,
    whiteCellCount,
    coloredCellRatio: cellCount ? coloredCellCount / cellCount : 0,
    whiteCellRatio: cellCount ? whiteCellCount / cellCount : 0,
  };
}

function hasOpenCvWhitePriceSideCell(item) {
  if (!item || item.userCleared || item.source === "ai_row_color") return false;
  if (item.rightmostCellWhite === true) return true;
  const rightWhiteRatio = Number(item.rightmostCellWhiteRatio || 0);
  const rightColoredRatio = Number(item.rightmostCellColoredRatio || 0);
  return rightWhiteRatio >= 0.3 && rightColoredRatio <= Math.max(0.34, rightWhiteRatio * 1.2);
}

function isOpenCvCellMajorityWhite(item) {
  const { cellCount, coloredCellCount, whiteCellCount, whiteCellRatio } = getOpenCvCellStats(item);
  if (cellCount < 3) return false;
  const neededWhite = Math.max(2, Math.ceil(cellCount * 0.4));
  return whiteCellCount >= neededWhite && whiteCellRatio >= 0.42 && coloredCellCount <= Math.max(1, Math.floor(cellCount * 0.35));
}

function isOpenCvCellMajorityNonWhite(item) {
  const { cellCount, coloredCellCount, whiteCellCount, coloredCellRatio } = getOpenCvCellStats(item);
  if (cellCount < 3) return false;
  const neededColor = Math.max(2, Math.ceil(cellCount * 0.42));
  return coloredCellCount >= neededColor && coloredCellRatio >= 0.42 && coloredCellCount >= whiteCellCount + 1;
}

function isOpenCvCellNonWhiteTicketSignal(item) {
  if (!item || item.userCleared || item.source === "ai_row_color") return false;
  if (isOpenCvCellMajorityWhite(item)) return false;
  if (hasOpenCvWhitePriceSideCell(item)) return false;
  if (isOpenCvCellMajorityNonWhite(item)) return true;
  const rawLabel = getOpenCvItemRawColorLabel(item);
  if (!rawLabel || isAvailableRowColorLabel(rawLabel)) return false;
  const { cellCount, coloredCellCount, whiteCellCount, coloredCellRatio } = getOpenCvCellStats(item);
  if (cellCount < 3) return false;
  // Judge by independent data cells, not by one full-row stripe. A sold row can
  // still include one neutral/date cell, so "all cells colored" is too strict.
  const clearColoredMajority =
    coloredCellCount >= Math.max(2, Math.ceil(cellCount * 0.42)) &&
    coloredCellRatio >= 0.42 &&
    coloredCellCount >= whiteCellCount + 1;
  const onlyColoredDataCells = coloredCellCount >= 1 && whiteCellCount === 0 && coloredCellRatio >= 0.12;
  const dominantColoredPixels =
    Boolean(item.strong) &&
    Number(item.confidence || 0) >= 0.5 &&
    Number(item.coverageRatio || 0) >= 0.38 &&
    Number(item.coloredRatio || 0) >= Math.max(0.42, Number(item.whiteRatio || 0) + 0.18);
  return clearColoredMajority || onlyColoredDataCells || dominantColoredPixels;
}

function getStrictRowLocalOpenCvColorLabel(item) {
  if (!item || item.userCleared || item.source === "ai_row_color") return "";
  const rawLabel = getOpenCvItemRawColorLabel(item);
  if (item.source === "paddle_ppstructure" || item.source === "ticket_row_anchor") {
    return item.rowTextVerified === true && item.rowGeometryVerified === true && Number(item.confidence || 0) >= 0.82 ? rawLabel : "";
  }
  const { cellCount, coloredCellCount, whiteCellCount, coloredCellRatio, whiteCellRatio } = getOpenCvCellStats(item);
  const coloredRatio = Number(item.coloredRatio || 0);
  const whiteRatio = Number(item.whiteRatio || 0);
  const coverageRatio = Number(item.coverageRatio || 0);

  if (isOpenCvCellMajorityWhite(item)) return "白底";
  if (rawLabel && isAvailableRowColorLabel(rawLabel)) {
    const enoughWhiteCells = cellCount >= 3 && whiteCellCount >= Math.max(2, coloredCellCount + 1) && whiteCellRatio >= 0.42;
    const weakColorBleed = coloredRatio <= Math.max(0.34, whiteRatio + 0.12) && coverageRatio <= 0.62;
    return enoughWhiteCells || weakColorBleed ? "白底" : "";
  }
  if (!rawLabel || isAvailableRowColorLabel(rawLabel)) return "";
  if (hasOpenCvWhitePriceSideCell(item)) return "白底";

  // Only auto-drop when this exact row's own cells are clearly non-white.
  // Pixel-level labels alone can bleed from separators or adjacent sold rows.
  const strongCellColor =
    cellCount >= 3 &&
    coloredCellCount >= Math.max(2, Math.ceil(cellCount * 0.55)) &&
    coloredCellRatio >= 0.55 &&
    coloredCellCount >= whiteCellCount + 2;
  if (strongCellColor) return rawLabel;

  return "";
}

function isStrictRowLocalOpenCvNonWhite(item) {
  const label = getStrictRowLocalOpenCvColorLabel(item);
  return Boolean(label && !isAvailableRowColorLabel(label));
}

function isStrictRowLocalOpenCvWhite(item) {
  return isAvailableRowColorLabel(getStrictRowLocalOpenCvColorLabel(item));
}

function isExactRowColorSelectionMode(table) {
  return /(^|_)exact$/i.test(String(table?.rowColorSelectionMode || ""));
}

function hasExactMixedRowColorAutoSkipSource(table) {
  return (
    hasOpenCvRowColorPreview(table) &&
    table?.rowColorSource !== "ai_row_color" &&
    table?.rowColorExactRowAligned === true &&
    isExactRowColorSelectionMode(table) &&
    hasConfirmedOpenCvWhiteAndColoredConflict(table)
  );
}

function getOpenCvSoldTextColorAnchorState(table) {
  const storedAnchor = table?.rowColorSoldTextAnchor || {};
  const state = {
    soldNonWhiteCount: Math.max(0, Math.floor(Number(storedAnchor.soldNonWhiteCount || 0) || 0)),
    nonSoldWhiteCount: 0,
    labels: Array.isArray(storedAnchor.labels) ? uniqueCleanValues(storedAnchor.labels) : [],
  };
  if (
    !hasOpenCvRowColorPreview(table) ||
    table?.rowColorSource === "ai_row_color" ||
    !Array.isArray(table.rows) ||
    !Array.isArray(table.rowColorRows) ||
    table.rows.length === 0 ||
    table.rowColorRows.length !== table.rows.length
  ) {
    return state;
  }
  table.rows.forEach((row, index) => {
    const item = table.rowColorRows[index];
    const label = getStrictRowLocalOpenCvColorLabel(item);
    if (!label) return;
    const ticket = { table, row, index };
    if (isSoldTicket(ticket) && !isAvailableRowColorLabel(label)) {
      state.soldNonWhiteCount += 1;
      state.labels.push(label);
      return;
    }
    if (!isSoldTicket(ticket) && isEffectiveTicketRowForColorDecision(ticket) && isAvailableRowColorLabel(label)) {
      state.nonSoldWhiteCount += 1;
    }
  });
  state.labels = uniqueCleanValues(state.labels);
  return state;
}

function hasOpenCvSoldTextColorAnchor(table) {
  const state = getOpenCvSoldTextColorAnchorState(table);
  return state.soldNonWhiteCount >= 2 && state.nonSoldWhiteCount >= 1 && state.labels.length === 1;
}

function getOpenCvCurrentRedWhiteFallbackState(table) {
  const state = { redCount: 0, whiteCount: 0, labels: [] };
  if (
    !hasOpenCvRowColorPreview(table) ||
    table?.rowColorSource === "ai_row_color" ||
    !Array.isArray(table.rows) ||
    !Array.isArray(table.rowColorRows) ||
    table.rows.length === 0 ||
    table.rowColorRows.length !== table.rows.length
  ) {
    return state;
  }
  table.rows.forEach((row, index) => {
    const ticket = { table, row, index };
    if (!isEffectiveTicketRowForColorDecision(ticket) || isSoldTicket(ticket)) return;
    const label = getStrictRowLocalOpenCvColorLabel(table.rowColorRows[index]);
    if (!label) return;
    state.labels.push(label);
    if (label === "红底") state.redCount += 1;
    if (isAvailableRowColorLabel(label)) state.whiteCount += 1;
  });
  state.labels = uniqueCleanValues(state.labels);
  return state;
}

function hasOpenCvCurrentRedWhiteFallback(table) {
  const state = getOpenCvCurrentRedWhiteFallbackState(table);
  return state.redCount >= 1 && state.whiteCount >= 1 && state.labels.every((label) => label === "红底" || isAvailableRowColorLabel(label));
}

function hasOpenCvMixedNonWhiteAutoSkipSignal(table) {
  const state = getOpenCvEffectiveColorState(table);
  if (!state.hasNonWhite || state.hasWhite) return false;
  return false;
}

function hasOpenCvSparseMappedRedPageSignal(table, rowIndex) {
  if (!table?.rowColorSparseSourceRepair || !table.rowColorPartialSequenceAligned || table.rowColorReliable !== true) return false;
  const sourceIndex = Array.isArray(table.rowColorSourceIndexes) ? Number(table.rowColorSourceIndexes[rowIndex]) : -1;
  if (!Number.isInteger(sourceIndex) || sourceIndex < 0) return false;
  const labels = Array.isArray(table.rowColorPageLabels) ? table.rowColorPageLabels : [];
  return labels.includes("红底") && labels.some((label) => label && label !== "红底");
}

function hasOpenCvSparseMappedRedPageSignalForTable(table) {
  if (!Array.isArray(table?.rows)) return false;
  return table.rows.some((_, rowIndex) => hasOpenCvSparseMappedRedPageSignal(table, rowIndex));
}

function isPendingRowManuallyPublished(table, rowIndex) {
  return table?.manualPublishRows?.[rowIndex] === true && table?.publishRows?.[rowIndex] === true;
}

function isPendingRowManuallySkipped(table, rowIndex) {
  return table?.manualSkipRows?.[rowIndex] === true && table?.publishRows?.[rowIndex] === false;
}

function isPendingRowDirectlyUserSkipped(table, rowIndex) {
  return table?.manualSkipRows?.[rowIndex] === true && table?.publishRows?.[rowIndex] === false && table?.userEditedRows?.[rowIndex] === true;
}

function getAiRowColorItem(table, rowIndex) {
  if (
    table?.rowColorSource !== "ai_row_color" ||
    Number(table.rowColorLogicVersion || 0) !== ROW_COLOR_LOGIC_VERSION ||
    !Array.isArray(table.rowColorRows) ||
    !table.rowColorRows[rowIndex] ||
    table.rowColorRows[rowIndex].userCleared
  ) {
    return null;
  }
  return table.rowColorRows[rowIndex];
}

function isTrustedAiRowColorAction(item, action, threshold) {
  if (!item || item.userCleared) return false;
  if (String(item.action || "") !== action) return false;
  const confidence = Number(item.confidence || 0);
  return confidence >= threshold;
}

function isTrustedAiRowSkipDecision(table, rowIndex) {
  if (isPendingRowManuallyPublished(table, rowIndex)) return false;
  if (table?.rowColorAiAutoApplyAllowed !== true) return false;
  const item = getAiRowColorItem(table, rowIndex);
  if (!item || item.rowTextVerified !== true || item.rowGeometryVerified !== true) return false;
  if (item.pixelMismatch === true) return false;
  return isTrustedAiRowColorAction(item, "skip", AI_ROW_COLOR_SKIP_CONFIDENCE);
}

function isTrustedAiRowPublishDecision(table, rowIndex) {
  if (isPendingRowDirectlyUserSkipped(table, rowIndex)) return false;
  if (table?.rowColorAiAutoApplyAllowed !== true) return false;
  const item = getAiRowColorItem(table, rowIndex);
  if (!item || item.rowTextVerified !== true || item.rowGeometryVerified !== true) return false;
  if (item.pixelMismatch === true) return false;
  return isTrustedAiRowColorAction(item, "publish", AI_ROW_COLOR_PUBLISH_CONFIDENCE);
}

function shouldAutoSkipForRowColor(table, rowIndex) {
  if (!hasOpenCvRowColorPreview(table)) return false;
  if (isPendingRowManuallyPublished(table, rowIndex)) return false;
  if (table.rowColorSource === "ai_row_color") return isTrustedAiRowSkipDecision(table, rowIndex);
  if (hasVerifiedWhiteAndNonWhiteRowColorHold(table) && hasVerifiedNonWhiteRowColorHold(table, rowIndex)) return true;
  if (
    (table.rowColorSource === "opencv" ||
      table.rowColorSource === "pdf_vector" ||
      table.rowColorSource === "paddle_ppstructure" ||
      table.rowColorSource === "ticket_row_anchor") &&
    table.rowColorReliable !== true
  )
    return false;
  if (!hasActionableOpenCvColorSource(table)) return false;
  if (isMixedTableRawNonWhiteAutoSkipItem(table, rowIndex)) return true;
  const item = table.rowColorRows?.[rowIndex];
  const label = getStrictRowLocalOpenCvColorLabel(item);
  if (!label || isAvailableRowColorLabel(label)) return false;
  return true;
}

function getRowColorColumnIndex(table) {
  return findColumnIndex(table.columns || [], ["行底色", "底色", "背景色", "颜色标记", "颜色", "row color", "background"]);
}

function ensureRowColorColumn(table) {
  let colorIndex = getRowColorColumnIndex(table);
  if (colorIndex >= 0) return colorIndex;
  table.columns.push("行底色");
  colorIndex = table.columns.length - 1;
  table.rows.forEach((row) => {
    while (row.length < table.columns.length) row.push("");
  });
  return colorIndex;
}

function isVisualRowColorSource(table) {
  return (
    table?.rowColorSource === "opencv" ||
    table?.rowColorSource === "ai_row_color" ||
    table?.rowColorSource === "pdf_vector" ||
    table?.rowColorSource === "paddle_ppstructure" ||
    table?.rowColorSource === "ticket_row_anchor"
  );
}

function getRowColorEngineName(table) {
  if (table?.rowColorSource === "pdf_vector") return "PDF 原始颜色";
  if (table?.rowColorSource === "paddle_ppstructure") return "PP-Structure";
  if (table?.rowColorSource === "ticket_row_anchor") return "文字锚点";
  return table?.rowColorSource === "ai_row_color" ? "AI" : "OpenCV";
}

function hasTrustedRowColorSource(table) {
  return (
    isVisualRowColorSource(table) &&
    Number(table.rowColorLogicVersion || 0) === ROW_COLOR_LOGIC_VERSION &&
    (table.rowColorReliable === true || table.rowColorConfirmed === true)
  );
}

function hasExactOpenCvRowAlignment(table) {
  return (
    (table?.rowColorSource === "opencv" ||
      table?.rowColorSource === "pdf_vector" ||
      table?.rowColorSource === "paddle_ppstructure" ||
      table?.rowColorSource === "ticket_row_anchor") &&
    Number(table.rowColorLogicVersion || 0) === ROW_COLOR_LOGIC_VERSION &&
    Array.isArray(table.rows) &&
    Array.isArray(table.rowColorRows) &&
    table.rows.length > 0 &&
    table.rowColorRows.length === table.rows.length &&
    table.rowColorExactRowAligned === true
  );
}

function hasExactVisualRowColorAlignment(table) {
  if (!hasOpenCvRowColorPreview(table) || !Array.isArray(table.rows) || !table.rows.length) return false;
  if (
    table.rowColorSource === "opencv" ||
    table.rowColorSource === "pdf_vector" ||
    table.rowColorSource === "paddle_ppstructure" ||
    table.rowColorSource === "ticket_row_anchor"
  )
    return hasExactOpenCvRowAlignment(table);
  return (
    table.rowColorSource === "ai_row_color" &&
    Number(table.rowColorLogicVersion || 0) === ROW_COLOR_LOGIC_VERSION &&
    Array.isArray(table.rowColorRows) &&
    table.rowColorRows.length === table.rows.length &&
    (table.rowColorReliable === true || table.rowColorConfirmed === true)
  );
}

function hasOpenCvRowColorPreview(table) {
  return (
    isVisualRowColorSource(table) &&
    Number(table.rowColorLogicVersion || 0) === ROW_COLOR_LOGIC_VERSION &&
    Array.isArray(table.rowColorRows) &&
    table.rowColorRows.length > 0
  );
}

function hasOneToOneOpenCvRowColorCoverage(table) {
  if (
    table?.rowColorSource !== "opencv" ||
    Number(table.rowColorLogicVersion || 0) !== ROW_COLOR_LOGIC_VERSION ||
    !Array.isArray(table.rows) ||
    !Array.isArray(table.rowColorRows) ||
    table.rows.length === 0 ||
    table.rowColorRows.length !== table.rows.length
  ) {
    return false;
  }
  const effectiveRows = table.rows
    .map((row, index) => ({ row, index }))
    .filter(({ row, index }) => {
      const ticket = { table, row, index };
      return isEffectiveTicketRowForColorDecision(ticket) && !isSoldTicket(ticket);
    });
  if (!effectiveRows.length) return false;
  return effectiveRows.every(({ row, index }) => hasUsableOpenCvColorSignalForEffectiveTicket(table, row, index, table.rowColorRows[index]));
}

function hasOpenCvColorDecisionAlignment(table) {
  return hasExactVisualRowColorAlignment(table) || hasOneToOneOpenCvRowColorCoverage(table);
}

function getOpenCvRawRowColorLabel(table, rowIndex) {
  const item = table?.rowColorRows?.[rowIndex];
  if (item?.userCleared) return "";
  return getOpenCvItemRawColorLabel(item);
}

function getOpenCvItemRawColorLabel(item) {
  return normalizeRowColorLabel(item?.label) || normalizeRowColorLabel(item?.rawLabel);
}

function getOpenCvItemDecisionColorLabel(item) {
  const label = getOpenCvItemRawColorLabel(item);
  if (!label) return "";
  const cellMajorityWhite = isOpenCvCellMajorityWhite(item);
  const cellMajorityNonWhite = isOpenCvCellMajorityNonWhite(item);
  const confidence = Number(item?.confidence || 0);
  if (item?.source === "ticket_row_anchor") {
    if (item.rowTextVerified !== true || item.rowGeometryVerified !== true || confidence < 0.82 || item.strong !== true) return "";
    return label;
  }
  if (item?.source === "ai_row_color") {
    if (isAvailableRowColorLabel(label)) return confidence >= 0.55 ? "白底" : "";
    return confidence >= 0.72 ? label : "";
  }
  const coloredRatio = Number(item?.coloredRatio || 0);
  const whiteRatio = Number(item?.whiteRatio || 0);
  const coverageRatio = Number(item?.coverageRatio || 0);

  if (isAvailableRowColorLabel(label)) {
    if (cellMajorityWhite) return "白底";
    if (cellMajorityNonWhite) return "";
    const looksWhite = whiteRatio >= 0.3 && (coloredRatio <= 0.36 || coloredRatio <= whiteRatio * 1.25);
    const explicitlyWhite = confidence >= 0.52 && coloredRatio <= 0.42 && coverageRatio <= 0.68;
    return looksWhite || explicitlyWhite ? "白底" : "";
  }

  if (cellMajorityNonWhite) return label;
  if (cellMajorityWhite) return "白底";

  const whiteLooksDominant =
    whiteRatio >= 0.28 &&
    (coloredRatio <= 0.42 || coloredRatio <= whiteRatio * 1.35) &&
    coverageRatio <= 0.72;
  if (whiteLooksDominant) return "";

  return getAutoSkipOpenCvColorLabel(item);
}

function getOpenCvItemStrictSignalLabel(item) {
  if (!item || item.userCleared) return "";
  const decisionLabel = getOpenCvItemDecisionColorLabel(item);
  if (decisionLabel) return decisionLabel;

  const rawLabel = getOpenCvItemRawColorLabel(item);
  if (!rawLabel) return "";

  const confidence = Number(item?.confidence || 0);
  const coloredRatio = Number(item?.coloredRatio || 0);
  const whiteRatio = Number(item?.whiteRatio || 0);
  const coverageRatio = Number(item?.coverageRatio || 0);

  if (isAvailableRowColorLabel(rawLabel)) {
    const safeWhite =
      confidence >= 0.38 &&
      (whiteRatio >= 0.22 || coloredRatio <= 0.4 || coverageRatio <= 0.68) &&
      coloredRatio <= Math.max(0.46, whiteRatio * 1.55);
    return safeWhite ? "白底" : "";
  }

  if (isPartialOpenCvNonWhiteSignal(item)) return rawLabel;

  return getAutoSkipOpenCvColorLabel(item);
}

function getOpenCvItemConflictSignalLabel(item) {
  if (!item || item.userCleared) return "";
  const strictLabel = getOpenCvItemStrictSignalLabel(item);
  if (strictLabel) return strictLabel;
  if (isOpenCvCellMajorityWhite(item)) return "白底";

  const rawLabel = getOpenCvItemRawColorLabel(item);
  const confidence = Number(item?.confidence || 0);
  const coloredRatio = Number(item?.coloredRatio || 0);
  const whiteRatio = Number(item?.whiteRatio || 0);
  const coverageRatio = Number(item?.coverageRatio || 0);

  if (rawLabel && isAvailableRowColorLabel(rawLabel)) {
    const looksLikeWhiteTicketRow =
      whiteRatio >= 0.18 &&
      coloredRatio <= Math.max(0.5, whiteRatio * 1.7) &&
      coverageRatio <= 0.72;
    return looksLikeWhiteTicketRow ? "白底" : "";
  }

  if (rawLabel && !isAvailableRowColorLabel(rawLabel)) {
    if (isOpenCvCellMajorityNonWhite(item)) return rawLabel;
    const looksLikeColoredTicketRow =
      isPartialOpenCvNonWhiteSignal(item) ||
      (confidence >= 0.48 &&
        coloredRatio >= 0.22 &&
        coverageRatio >= 0.2 &&
        coloredRatio >= whiteRatio + 0.08);
    return looksLikeColoredTicketRow ? rawLabel : "";
  }

  if (!rawLabel && whiteRatio >= 0.38 && coloredRatio <= 0.24 && coverageRatio <= 0.5) return "白底";
  return "";
}

function getOpenCvItemConflictActionLabel(item) {
  if (!item || item.userCleared) return "";
  if (item.source === "ticket_row_anchor") {
    const label = getStrictRowLocalOpenCvColorLabel(item);
    return label && !isAvailableRowColorLabel(label) && item.strong === true ? label : "";
  }
  if (isOpenCvCellMajorityWhite(item)) return "白底";
  if (hasOpenCvWhitePriceSideCell(item)) return "白底";
  const rawLabel = getOpenCvItemRawColorLabel(item);
  if (!rawLabel || isAvailableRowColorLabel(rawLabel)) return "";
  if (item.strong === true && isOpenCvCellNonWhiteTicketSignal(item)) return rawLabel;
  return isOpenCvCellNonWhiteTicketSignal(item) ? rawLabel : "";
}

function getOpenCvConflictNonWhiteLabel(item) {
  if (!item || item.userCleared) return "";
  if (isOpenCvCellMajorityWhite(item)) return "";
  const rawLabel = getOpenCvItemRawColorLabel(item);
  if (!rawLabel || isAvailableRowColorLabel(rawLabel)) return "";
  if (item?.source === "ai_row_color") return "";
  return isOpenCvCellNonWhiteTicketSignal(item) ? rawLabel : "";
}

function isStrongOpenCvNonWhiteColorItem(item) {
  return Boolean(getOpenCvConflictNonWhiteLabel(item));
}

function hasUsableOpenCvColorSignalForEffectiveTicket(table, row, rowIndex, colorItem) {
  const ticket = { table, row, index: rowIndex };
  if (!isEffectiveTicketRowForColorDecision(ticket) || isSoldTicket(ticket)) return true;
  const actionLabel = getOpenCvItemConflictActionLabel(colorItem);
  const rawLabel = getOpenCvItemRawColorLabel(colorItem);
  const confidence = Number(colorItem?.confidence || 0);
  const coloredRatio = Number(colorItem?.coloredRatio || 0);
  const whiteRatio = Number(colorItem?.whiteRatio || 0);
  const coverageRatio = Number(colorItem?.coverageRatio || 0);
  return Boolean(actionLabel || rawLabel || confidence >= 0.25 || coloredRatio >= 0.08 || whiteRatio >= 0.12 || coverageRatio >= 0.08);
}

function getAutoSkipOpenCvColorLabel(item) {
  const label = getOpenCvItemRawColorLabel(item);
  if (!label || isAvailableRowColorLabel(label) || item?.userCleared) return "";
  if (item?.source === "ai_row_color") return "";
  if (isOpenCvCellMajorityWhite(item)) return "";
  return isOpenCvCellNonWhiteTicketSignal(item) ? label : "";
}

function isPartialOpenCvNonWhiteSignal(item) {
  const label = getOpenCvItemRawColorLabel(item);
  if (!label || isAvailableRowColorLabel(label) || item?.userCleared) return false;
  if (item?.source === "ai_row_color") return false;
  if (isOpenCvCellMajorityWhite(item)) return false;
  return isOpenCvCellNonWhiteTicketSignal(item);
}

function getTrustedOpenCvRowColorLabel(table, rowIndex) {
  const item = table?.rowColorRows?.[rowIndex];
  if (item?.userCleared) return "";
  return getOpenCvItemDecisionColorLabel(item);
}

function getDecisionOpenCvRowColorLabel(table, rowIndex) {
  const item = table?.rowColorRows?.[rowIndex];
  if (item?.userCleared) return "";
  return getOpenCvItemDecisionColorLabel(item);
}

function getAutoOpenCvRowColorLabel(table, rowIndex) {
  const decisionLabel = getDecisionOpenCvRowColorLabel(table, rowIndex);
  if (decisionLabel) return decisionLabel;
  if (!hasTrustedRowColorSource(table)) return "";
  const item = table?.rowColorRows?.[rowIndex];
  if (item?.userCleared) return "";
  const rawLabel = getOpenCvItemRawColorLabel(item);
  if (!rawLabel || isAvailableRowColorLabel(rawLabel)) return rawLabel;
  const confidence = Number(item?.confidence || 0);
  const coloredRatio = Number(item?.coloredRatio || 0);
  const whiteRatio = Number(item?.whiteRatio || 0);
  const coverageRatio = Number(item?.coverageRatio || 0);
  const fullRowEnough =
    confidence >= 0.72 &&
    coloredRatio >= 0.62 &&
    coverageRatio >= 0.68 &&
    (whiteRatio <= 0.2 || coloredRatio >= whiteRatio * 2.8);
  return fullRowEnough ? rawLabel : "";
}

function hasActionableOpenCvColorSource(table) {
  if (!hasOpenCvRowColorPreview(table) || !Array.isArray(table.rows) || !table.rows.length) return false;
  if (
    Number(table.rowColorLogicVersion || 0) === ROW_COLOR_LOGIC_VERSION &&
    typeof table.rowColorActionableConflict === "boolean"
  ) {
    return table.rowColorActionableConflict;
  }
  if (hasVerifiedWhiteAndNonWhiteRowColorHold(table)) return true;
  if (!hasOpenCvColorDecisionAlignment(table)) return false;
  return hasConfirmedOpenCvWhiteAndColoredConflict(table);
}

function isStrictRowColorActionable(table, rowIndex) {
  if (!hasActionableOpenCvColorSource(table)) return false;
  if (table.rowColorRows.length !== table.rows.length) return false;
  const ticket = { table, row: table.rows?.[rowIndex], index: rowIndex };
  if (!isEffectiveTicketRowForColorDecision(ticket)) return false;
  const item = table.rowColorRows[rowIndex];
  if (!item || item.userCleared) return false;
  return isStrictRowLocalOpenCvNonWhite(item);
}

function getStrictWhiteOnlyOpenCvRowColorLabel(table, rowIndex) {
  if (!hasActionableOpenCvColorSource(table)) return "";
  return getStrictRowLocalOpenCvColorLabel(table?.rowColorRows?.[rowIndex]);
}

function getOpenCvNonSoldColorLabels(table) {
  if (!hasOpenCvColorDecisionAlignment(table)) return [];
  const nonSoldRows = table.rows
    .map((row, index) => ({ row, index }))
    .filter(({ row, index }) => {
      const ticket = { table, row, index };
      return isEffectiveTicketRowForColorDecision(ticket) && !isSoldTicket(ticket);
    });
  const labels = nonSoldRows.map(({ index }) => getOpenCvItemConflictActionLabel(table.rowColorRows?.[index])).filter(Boolean);
  const hasNonWhiteColor = labels.some((label) => label && !isAvailableRowColorLabel(label));
  const hasNeutralCandidate = nonSoldRows.some(({ index }) => {
    const decisionLabel = getOpenCvItemConflictActionLabel(table.rowColorRows?.[index]);
    const rawLabel = getOpenCvRawRowColorLabel(table, index);
    return !decisionLabel && (!rawLabel || isAvailableRowColorLabel(rawLabel));
  });
  if (hasNonWhiteColor && hasNeutralCandidate) labels.push("白底");
  return uniqueCleanValues(labels);
}

function hasOpenCvWhiteAndColoredConflict(table) {
  const labels = getOpenCvNonSoldColorLabels(table);
  return labels.some(isAvailableRowColorLabel) && labels.some((label) => label && !isAvailableRowColorLabel(label));
}

function getOpenCvRawNonSoldColorLabels(table) {
  if (!hasOpenCvColorDecisionAlignment(table)) return [];
  const labels = (table.rows || [])
    .map((row, index) => {
      const ticket = { table, row, index };
      if (!isEffectiveTicketRowForColorDecision(ticket) || isSoldTicket(ticket)) return "";
      return getOpenCvItemRawColorLabel(table.rowColorRows?.[index]);
    })
    .filter(Boolean);
  const hasNeutralCandidate = (table.rows || []).some((row, index) => {
    const ticket = { table, row, index };
    if (!isEffectiveTicketRowForColorDecision(ticket) || isSoldTicket(ticket)) return false;
    const rawLabel = getOpenCvItemRawColorLabel(table.rowColorRows?.[index]);
    const decisionLabel = getDecisionOpenCvRowColorLabel(table, index);
    return !rawLabel || isAvailableRowColorLabel(rawLabel) || isAvailableRowColorLabel(decisionLabel);
  });
  return uniqueCleanValues([...labels, ...(hasNeutralCandidate ? ["白底"] : [])]);
}

function hasOpenCvRawColorDifference(table) {
  const labels = getOpenCvRawNonSoldColorLabels(table);
  return labels.some(isAvailableRowColorLabel) && labels.some((label) => label && !isAvailableRowColorLabel(label));
}

function hasOpenCvRawWhiteAndColoredConflict(table) {
  if (!hasOpenCvColorDecisionAlignment(table) || !Array.isArray(table.rows)) return false;
  const labels = table.rows
    .map((row, index) => {
      const ticket = { table, row, index };
      if (!isEffectiveTicketRowForColorDecision(ticket) || isSoldTicket(ticket)) return "";
      return getOpenCvItemConflictActionLabel(table.rowColorRows?.[index]);
    })
    .filter(Boolean);
  return labels.some(isAvailableRowColorLabel) && labels.some((label) => label && !isAvailableRowColorLabel(label));
}

function hasExactMixedRawRowColorConflict(table) {
  return (
    hasOpenCvColorDecisionAlignment(table) &&
    hasOpenCvRawColorDifference(table) &&
    (table?.rowColorExactRowAligned === true || table?.rowColorReliable === true || table?.rowColorConfirmed === true)
  );
}

function isRawNonWhiteColorStrongEnoughForMixedTable(item) {
  const rawLabel = getOpenCvItemRawColorLabel(item);
  if (!rawLabel || isAvailableRowColorLabel(rawLabel) || item?.userCleared) return false;
  if (item?.source === "ai_row_color") return false;
  if (isOpenCvCellMajorityWhite(item) || hasOpenCvWhitePriceSideCell(item)) return false;
  const confidence = Number(item?.confidence || 0);
  const coloredRatio = Math.max(Number(item?.coloredRatio || 0), Number(item?.localPixelColoredRatio || 0));
  const whiteRatio = Math.max(Number(item?.whiteRatio || 0), Number(item?.localPixelWhiteRatio || 0));
  const coverageRatio = Number(item?.coverageRatio || 0);
  const coloredCells = Number(item?.coloredCellCount || 0);
  if (item?.source === "ticket_row_anchor" && (item.rowTextVerified !== true || item.rowGeometryVerified !== true)) return false;
  return (
    item?.strong === true ||
    isOpenCvCellNonWhiteTicketSignal(item) ||
    coloredCells >= 1 ||
    (confidence >= 0.45 && coloredRatio >= 0.18 && coloredRatio >= whiteRatio + 0.05) ||
    (confidence >= 0.6 && coverageRatio >= 0.2 && coloredRatio >= 0.14)
  );
}

function isMixedTableRawNonWhiteAutoSkipItem(table, rowIndex) {
  if (!hasExactMixedRawRowColorConflict(table)) return false;
  const ticket = { table, row: table?.rows?.[rowIndex], index: rowIndex };
  if (!isEffectiveTicketRowForColorDecision(ticket) || isSoldTicket(ticket)) return false;
  return isRawNonWhiteColorStrongEnoughForMixedTable(table?.rowColorRows?.[rowIndex]);
}

function hasStrongOpenCvWhiteAndColoredConflict(table) {
  if (!hasOpenCvColorDecisionAlignment(table) || !Array.isArray(table.rows)) return false;
  let hasWhite = false;
  let hasStrongNonWhite = false;
  table.rows.forEach((row, index) => {
    const ticket = { table, row, index };
    if (!isEffectiveTicketRowForColorDecision(ticket) || isSoldTicket(ticket)) return;
    const item = table.rowColorRows?.[index];
    const label = getOpenCvItemConflictActionLabel(item);
    if (label && isAvailableRowColorLabel(label)) hasWhite = true;
    if (label && !isAvailableRowColorLabel(label)) hasStrongNonWhite = true;
    if (!label && isStrongOpenCvNonWhiteColorItem(item)) hasStrongNonWhite = true;
  });
  return hasWhite && hasStrongNonWhite;
}

function getOpenCvEffectiveColorState(table) {
  const state = {
    hasWhite: false,
    hasNonWhite: false,
    whiteCount: 0,
    nonWhiteCount: 0,
    labels: [],
  };
  if (!hasOpenCvColorDecisionAlignment(table) || !Array.isArray(table.rows)) return state;

  table.rows.forEach((row, index) => {
    const ticket = { table, row, index };
    if (!isEffectiveTicketRowForColorDecision(ticket) || isSoldTicket(ticket)) return;
    const item = table.rowColorRows?.[index];
    if (!item || item.userCleared) return;

    const localLabel = getStrictRowLocalOpenCvColorLabel(item);
    if (isAvailableRowColorLabel(localLabel)) {
      state.hasWhite = true;
      state.whiteCount += 1;
      state.labels.push("白底");
    }
    if ((localLabel && !isAvailableRowColorLabel(localLabel)) || hasVerifiedNonWhiteRowColorHold(table, index)) {
      state.hasNonWhite = true;
      state.nonWhiteCount += 1;
      state.labels.push(localLabel || getOpenCvItemRawColorLabel(item) || "非白底");
    } else if (isMixedTableRawNonWhiteAutoSkipItem(table, index)) {
      state.hasNonWhite = true;
      state.nonWhiteCount += 1;
      state.labels.push(getOpenCvItemRawColorLabel(item) || "非白底");
    }
  });

  state.labels = uniqueCleanValues(state.labels);
  return state;
}

function hasConfirmedOpenCvWhiteAndColoredConflict(table) {
  const state = getOpenCvEffectiveColorState(table);
  return state.hasWhite && state.hasNonWhite;
}

function getOpenCvColorReferenceMessage(table) {
  const state = getOpenCvEffectiveColorState(table);
  const engineName = getRowColorEngineName(table);
  if (state.hasWhite && state.hasNonWhite) {
    return `${engineName} 检测到白底有效票 ${state.whiteCount} 条、非白底有效票 ${state.nonWhiteCount} 条；同表混色时非白底行会自动设为不发布。`;
  }
  if (state.hasNonWhite && !state.hasWhite) {
    return `${engineName} 检测到非白底有效票 ${state.nonWhiteCount} 条；已验证的非白底行会自动设为不发布。`;
  }
  if (state.hasWhite) {
    return `${engineName} 仅检测到白底有效票 ${state.whiteCount} 条。`;
  }
  return `${engineName} 未检测到有效票底色。`;
}

function hasAnyOpenCvWhiteAndColoredConflict(table) {
  return hasActionableOpenCvColorSource(table);
}

function getWhiteVsColoredConflictLabel(table, rowIndex) {
  if (!hasActionableOpenCvColorSource(table)) return "";
  const item = table.rowColorRows?.[rowIndex];
  if (item?.userCleared) return "";
  return getStrictRowLocalOpenCvColorLabel(item);
}

function getOpenCvColorDecisionText(table, rowIndex) {
  const ticket = { table, row: table?.rows?.[rowIndex], index: rowIndex };
  if (!isEffectiveTicketRowForColorDecision(ticket)) return "无售价/占位行，忽略颜色";
  const action = table?.rowColorRows?.[rowIndex]?.action || "";
  if (action === "skip") return "AI 建议不发布";
  if (action === "publish") return "AI 建议发布";
  if (action === "uncertain") return "AI 不确定";
  if (isSoldTicket(ticket)) return "文字已售";
  const item = table?.rowColorRows?.[rowIndex];
  const label = getOpenCvItemConflictActionLabel(item);
  const rawLabel = getOpenCvRawRowColorLabel(table, rowIndex);
  const actionableConflict = hasActionableOpenCvColorSource(table);
  const conflictLabel = getWhiteVsColoredConflictLabel(table, rowIndex);
  if (actionableConflict && conflictLabel && !isAvailableRowColorLabel(conflictLabel)) return "非白底参考";
  if (actionableConflict && conflictLabel && isAvailableRowColorLabel(conflictLabel)) return "白底参考";
  if (actionableConflict && label && !isAvailableRowColorLabel(label)) return "非白底参考";
  if (actionableConflict && label && isAvailableRowColorLabel(label)) return "白底参考";
  if (actionableConflict && rawLabel && !isAvailableRowColorLabel(rawLabel)) return "非白底参考";
  if (actionableConflict && rawLabel && isAvailableRowColorLabel(rawLabel)) return "白底参考";
  if (table?.rowColorReliable === true) {
    const colorState = getOpenCvEffectiveColorState(table);
    if (colorState.hasNonWhite && !colorState.hasWhite) return "带色参考";
    if (colorState.hasWhite && isAvailableRowColorLabel(label || rawLabel)) return "白底参考";
  }
  if (!label && !rawLabel) return "未识别";
  if (!getAutoOpenCvRowColorLabel(table, rowIndex)) return "不确定";
  return "颜色参考";
}

function applyAiRowColorActionDecision(table) {
  if (!table || table.rowColorSource !== "ai_row_color" || !Array.isArray(table.rowColorRows)) return 0;
  table.rowColorConfirmed = true;
  table.showOpenCvColorPreview = false;
  table.publishRows = table.publishRows || {};
  const previousAutoRows = Array.isArray(table.aiRowColorAutoRows) ? table.aiRowColorAutoRows : [];
  previousAutoRows.forEach((rowIndex) => {
    const index = Number(rowIndex);
    if (!Number.isInteger(index) || table.manualSkipRows?.[index] === true || table.manualPublishRows?.[index] === true) return;
    const ticket = { table, row: table.rows?.[index], index };
    if (table.publishRows[index] === false && isCustomerPublishableTicket(ticket)) delete table.publishRows[index];
  });
  const autoRows = [];
  let skipCount = 0;
  let publishCount = 0;
  let uncertainCount = 0;
  (table.rows || []).forEach((row, rowIndex) => {
    const ticket = { table, row, index: rowIndex };
    const item = getAiRowColorItem(table, rowIndex);
    if (!item) {
      uncertainCount += 1;
      return;
    }
    if (isTrustedAiRowSkipDecision(table, rowIndex) && !isSoldTicket(ticket)) {
      table.publishRows[rowIndex] = false;
      autoRows.push(rowIndex);
      skipCount += 1;
      return;
    }
    if (isTrustedAiRowPublishDecision(table, rowIndex) && isCustomerPublishableTicket(ticket)) {
      if (table.publishRows[rowIndex] === false) {
        delete table.publishRows[rowIndex];
        delete table.manualSkipRows?.[rowIndex];
        autoRows.push(rowIndex);
        publishCount += 1;
      }
      return;
    }
    if (String(item.action || "") === "uncertain" || Number(item.confidence || 0) < AI_ROW_COLOR_SKIP_CONFIDENCE) {
      uncertainCount += 1;
    }
  });
  table.aiRowColorAutoRows = autoRows;
  table.rowColorAutoApplied = skipCount > 0 || publishCount > 0;
  table.rowColorAutoSkipCount = skipCount;
  table.rowColorMessage = `AI 视觉复核已按高置信结果处理：${skipCount} 条不发布、${publishCount} 条恢复可发布${uncertainCount ? `，${uncertainCount} 条不确定保留人工确认` : ""}。`;
  return skipCount + publishCount;
}

function applyOpenCvWhiteVsColoredAutoDecision(table) {
  if (!table || !hasOpenCvRowColorPreview(table)) return 0;
  if (table.rowColorSource === "ai_row_color") return applyAiRowColorActionDecision(table);
  table.publishRows = table.publishRows || {};
  let skipCount = 0;
  let releasedCount = 0;
  table.rows.forEach((row, rowIndex) => {
    const ticket = { table, row, index: rowIndex };
    if (!isEffectiveTicketRowForColorDecision(ticket) || isSoldTicket(ticket)) return;
    if (shouldAutoSkipForRowColor(table, rowIndex)) {
      table.publishRows[rowIndex] = false;
      skipCount += 1;
    } else if (table.publishRows[rowIndex] === false && table.manualSkipRows?.[rowIndex] !== true && isCustomerPublishableTicket(ticket)) {
      delete table.publishRows[rowIndex];
      releasedCount += 1;
    }
  });
  table.rowColorConfirmed = skipCount > 0;
  table.rowColorAutoApplied = skipCount > 0;
  table.rowColorAutoSkipCount = skipCount;
  return skipCount + releasedCount;
}

function clearUntrustedRowColorPublishHolds(table) {
  if (!table || !Array.isArray(table.rows) || !table.publishRows) return 0;
  let cleared = 0;
  Object.keys(table.publishRows).forEach((rowIndexText) => {
    const rowIndex = Number(rowIndexText);
    if (!Number.isInteger(rowIndex) || table.publishRows[rowIndex] !== false || table.manualSkipRows?.[rowIndex] === true) return;
    const ticket = { table, row: table.rows[rowIndex], index: rowIndex };
    if (isSoldTicket(ticket) || !hasTicketSalePrice(ticket) || isNonTicketPlaceholderRow(ticket)) return;
    delete table.publishRows[rowIndex];
    cleared += 1;
  });
  if (cleared > 0) {
    table.rowColorAutoApplied = false;
    table.rowColorAutoSkipCount = 0;
  }
  return cleared;
}

function clearStalePublishDecisionBlocks(table) {
  if (!table || !Array.isArray(table.rows) || !table.publishRows) return 0;
  let cleared = 0;
  Object.keys(table.publishRows).forEach((rowIndexText) => {
    const rowIndex = Number(rowIndexText);
    if (!Number.isInteger(rowIndex) || table.publishRows[rowIndex] !== false) return;
    if (table.manualSkipRows?.[rowIndex] === true || table.bulkSkipDraft === true) return;
    const ticket = { table, row: table.rows[rowIndex], index: rowIndex };
    if (!isCustomerPublishableTicket(ticket)) return;
    delete table.publishRows[rowIndex];
    cleared += 1;
  });
  return cleared;
}

function getLastOcrColorAnalysisForPage(page) {
  if (!page) return null;
  const analyses = lastTicketOcrJobSnapshot?.rowColorAnalyses || {};
  return analyses[String(page)] || analyses[page] || null;
}

function isSourceSequenceColumnName(column = "") {
  return /(^|[^a-z0-9])(序号|编号|no|number|index)([^a-z0-9]|$)/i.test(normalize(column || ""));
}

function getVisibleSourceSequenceNumbers(table) {
  const rows = Array.isArray(table?.rows) ? table.rows : [];
  const columns = Array.isArray(table?.columns) ? table.columns : [];
  if (!rows.length || !isSourceSequenceColumnName(columns[0])) return [];
  const numbers = rows.map((row) => {
    const raw = String(row?.[0] || "").trim();
    if (!/^\d{1,4}$/.test(raw)) return null;
    const number = Number(raw);
    return number > 0 ? number : null;
  });
  return numbers.length === rows.length && !numbers.some((number) => number === null) ? numbers : [];
}

function getReasonableRowColorSourceIndexesFromSequence(table, availableRowCount = 0) {
  const rows = Array.isArray(table?.rows) ? table.rows : [];
  const numbers = getVisibleSourceSequenceNumbers(table);
  if (!rows.length || numbers.length !== rows.length) return [];
  const max = Math.max(...numbers);
  const min = Math.min(...numbers);
  if (availableRowCount && max > availableRowCount) return [];
  const sourceSpan = max - min + 1;
  const looseLimit = Math.max(rows.length + 12, rows.length * 4);
  if (!availableRowCount && max > looseLimit) return [];
  if (!availableRowCount && sourceSpan > looseLimit) return [];
  return numbers.map((number) => number - 1);
}

function ensurePendingTableSourceRowIndexes(table, { forceSequence = false } = {}) {
  if (!table || !Array.isArray(table.rows) || !table.rows.length) return [];
  const sequenceIndexes = getReasonableRowColorSourceIndexesFromSequence(table);
  if (sequenceIndexes.length === table.rows.length) {
    const current = Array.isArray(table.rowColorSourceIndexes) ? table.rowColorSourceIndexes.map((value) => Number(value)) : [];
    const alreadySame = current.length === sequenceIndexes.length && current.every((value, index) => value === sequenceIndexes[index]);
    if (forceSequence || table.rowColorSourceIndexMode !== "sequence" || !alreadySame) {
      table.rowColorSourceIndexes = sequenceIndexes;
      table.rowColorSourceIndexMode = "sequence";
    }
    return table.rowColorSourceIndexes;
  }
  if (Array.isArray(table.rowColorSourceIndexes) && table.rowColorSourceIndexes.length === table.rows.length) {
    return table.rowColorSourceIndexes;
  }
  return [];
}

function getInferredRowColorSourceIndexesFromSequence(table, availableRowCount) {
  if (!availableRowCount) return [];
  return getReasonableRowColorSourceIndexesFromSequence(table, availableRowCount);
}

function getPartialRowColorSourceIndexesFromSequence(table, availableRowCount) {
  const rows = Array.isArray(table?.rows) ? table.rows : [];
  const columns = Array.isArray(table?.columns) ? table.columns : [];
  if (!rows.length || !availableRowCount) return [];
  if (!isSourceSequenceColumnName(columns[0])) return [];
  const indexes = rows.map((row) => {
    const raw = String(row?.[0] || "").trim();
    if (!/^\d{1,4}$/.test(raw)) return -1;
    const sourceIndex = Number(raw) - 1;
    return sourceIndex >= 0 && sourceIndex < availableRowCount ? sourceIndex : -1;
  });
  const mappedCount = indexes.filter((index) => Number.isInteger(index) && index >= 0).length;
  const validIndexes = indexes.filter((index) => Number.isInteger(index) && index >= 0);
  if (validIndexes.length) {
    const minIndex = Math.min(...validIndexes);
    const maxIndex = Math.max(...validIndexes);
    if (maxIndex - minIndex + 1 > validIndexes.length + 2) return [];
  }
  return mappedCount > 0 && mappedCount < rows.length ? indexes : [];
}

function getFirstSourceSequenceIndex(table, aligned) {
  if (!table || table.rowColorSourceIndexMode !== "sequence") return -1;
  const sourceIndexes = Array.isArray(aligned?.sourceIndexes) ? aligned.sourceIndexes.map((value) => Number(value)) : [];
  const validIndexes = sourceIndexes.filter((value) => Number.isInteger(value) && value >= 0);
  return validIndexes.length ? Math.min(...validIndexes) : -1;
}

function hasSafeSkippedOpenCvPrefixForSourceSequence(availableRows, firstSourceIndex) {
  const firstIndex = Math.floor(Number(firstSourceIndex));
  if (!Number.isInteger(firstIndex) || firstIndex <= 0) return true;
  const rows = Array.isArray(availableRows) ? availableRows : [];
  if (rows.length <= firstIndex) return false;
  const skippedRows = rows.slice(0, firstIndex);
  if (skippedRows.length !== firstIndex) return false;
  return skippedRows.every((row) => {
    const label = getOpenCvItemConflictActionLabel(row) || getOpenCvItemRawColorLabel(row);
    return label && !isAvailableRowColorLabel(label) && !isOpenCvCellMajorityWhite(row);
  });
}

function hasUnsafeSourceSequenceColorPrefix(table, analysis, aligned, availableRows) {
  if (!table || !analysis || table.rowColorSourceIndexMode !== "sequence") return false;
  if (!["opencv", "pdf_vector"].includes(analysis.source)) return false;
  const sequenceNumbers = getVisibleSourceSequenceNumbers(table);
  if (!sequenceNumbers.length || Math.min(...sequenceNumbers) <= 1) return false;
  const firstSourceIndex = getFirstSourceSequenceIndex(table, aligned);
  if (firstSourceIndex <= 0) return false;
  return !hasSafeSkippedOpenCvPrefixForSourceSequence(availableRows, firstSourceIndex);
}

function getAlignedOpenCvRowsForTable(table, availableRows, startIndex = 0) {
  const length = table?.rows?.length || 0;
  const rows = Array.isArray(availableRows) ? availableRows.filter(Boolean) : [];
  const start = Math.max(0, Math.floor(Number(startIndex) || 0));
  if (!length || !rows.length) return { rows: [], startIndex: start, exact: false };
  const canTrustPrefixSlice = rows.length === length;

  const rowsByIndex = new Map(
    rows.map((row, index) => [Number.isFinite(Number(row?.index)) ? Number(row.index) : index, row]),
  );
  const isTrustedStoredIndexMap = (indexes) => {
    if (!Array.isArray(indexes) || indexes.length !== length) return false;
    const numericIndexes = indexes.map((value) => Number(value));
    if (!numericIndexes.every((value) => Number.isInteger(value) && value >= 0 && value < rows.length)) return false;
    if (canTrustPrefixSlice) return true;
    if (table?.rowColorSourceIndexMode === "sequence") return true;
    return false;
  };
  const storedIndexes = ensurePendingTableSourceRowIndexes(table)
    .slice(0, length)
    .map((value) => Number(value));
  if (isTrustedStoredIndexMap(storedIndexes)) {
    const mappedRows = storedIndexes.map((sourceIndex) => rowsByIndex.get(sourceIndex) || rows[sourceIndex] || null);
    if (mappedRows.every(Boolean)) {
      return {
        rows: mappedRows,
        startIndex: storedIndexes[0] || 0,
        exact: true,
        sourceIndexes: storedIndexes,
      };
    }
  }

  const inferredIndexes = getInferredRowColorSourceIndexesFromSequence(table, rows.length);
  if (inferredIndexes.length === length) {
    const mappedRows = inferredIndexes.map((sourceIndex) => rowsByIndex.get(sourceIndex) || rows[sourceIndex] || null);
    if (mappedRows.every(Boolean)) {
      return {
        rows: mappedRows,
        startIndex: inferredIndexes[0] || 0,
        exact: true,
        sourceIndexes: inferredIndexes,
      };
    }
  }

  const sourceIndexes = Array.isArray(table?.rowColorSourceIndexes)
    ? table.rowColorSourceIndexes.slice(0, length).map((value) => Number(value))
    : [];
  if (isTrustedStoredIndexMap(sourceIndexes)) {
    const mappedRows = sourceIndexes.map((sourceIndex) => rowsByIndex.get(sourceIndex) || rows[sourceIndex] || null);
    if (mappedRows.every(Boolean)) {
      return {
        rows: mappedRows,
        startIndex: sourceIndexes[0] || 0,
        exact: true,
        sourceIndexes,
      };
    }
  }

  const partialIndexes = getPartialRowColorSourceIndexesFromSequence(table, rows.length);
  if (partialIndexes.length === length) {
    const rowsByIndex = new Map(
      rows.map((row, index) => [Number.isFinite(Number(row?.index)) ? Number(row.index) : index, row]),
    );
    return {
      rows: partialIndexes.map((sourceIndex) =>
        Number.isInteger(sourceIndex) && sourceIndex >= 0
          ? rowsByIndex.get(sourceIndex) || rows[sourceIndex] || null
          : { label: "", rawLabel: "", confidence: 0, reason: "未按数字序号对齐" },
      ),
      startIndex: Number.isInteger(partialIndexes[0]) && partialIndexes[0] >= 0 ? partialIndexes[0] : start,
      exact: false,
      sourceIndexes: partialIndexes,
      partialSequenceAligned: true,
    };
  }

  if (rows.length === length) {
    return {
      rows: rows.slice(0, length),
      startIndex: 0,
      exact: true,
      sourceIndexes: rows.slice(0, length).map((row, index) => (Number.isFinite(Number(row?.index)) ? Number(row.index) : index)),
    };
  }
  return { rows: [], startIndex: start, exact: false };
}

function hasSourceIndexedOpenCvAlignment(table, analysis, aligned, availableRows) {
  if (!table || !analysis || !aligned || table.rowColorSourceIndexMode !== "sequence") return false;
  if (!["opencv", "pdf_vector"].includes(analysis.source)) return false;
  if (analysis.contiguous !== true) return false;
  if (Array.isArray(analysis.lowConfidenceRows) && analysis.lowConfidenceRows.length) return false;
  if (hasUnsafeSourceSequenceColorPrefix(table, analysis, aligned, availableRows)) return false;
  const sourceIndexes = Array.isArray(aligned.sourceIndexes) ? aligned.sourceIndexes.map((value) => Number(value)) : [];
  if (!Array.isArray(table.rows) || sourceIndexes.length !== table.rows.length || aligned.rows?.length !== table.rows.length) return false;
  const availableCount = Array.isArray(availableRows) ? availableRows.length : 0;
  if (!availableCount) return false;
  const maxSourceIndex = Math.max(...sourceIndexes);
  if (!Number.isInteger(maxSourceIndex) || maxSourceIndex < 0 || maxSourceIndex >= availableCount) return false;
  const expectedRows = Number(analysis.expectedRows || 0);
  const detectedRows = Number(analysis.detectedRows || availableCount);
  const sourceCoversExpectedRows = expectedRows > 0 && maxSourceIndex + 1 <= expectedRows && availableCount >= expectedRows;
  const backendReturnedFullRows = detectedRows >= maxSourceIndex + 1 && availableCount >= maxSourceIndex + 1;
  const selectionMode = String(analysis.selectionMode || "");
  const selectionLooksTableLike = /(^|_)exact$/i.test(selectionMode) && !/text_projection_split/i.test(selectionMode);
  return selectionLooksTableLike && (sourceCoversExpectedRows || backendReturnedFullRows);
}

function hasStableOpenCvActionableAlignment(table, analysis, aligned, availableRows) {
  if (!table || !analysis || !aligned || !Array.isArray(table.rows)) return false;
  const rowCount = table.rows.length;
  if (!rowCount || aligned.rows?.length !== rowCount) return false;
  const selectionMode = String(analysis.selectionMode || "");
  const hasNumericSourceSequence = table.rowColorSourceIndexMode === "sequence" && getVisibleSourceSequenceNumbers(table).length === rowCount;
  if (hasNumericSourceSequence) return true;
  if (rowCount <= 5) return true;
  if (selectionMode.startsWith("group_")) return false;
  return true;
}

function applyOpenCvRowColorsToTable(table, analysis, startIndex = 0) {
  if (!table || !Array.isArray(table.rows)) return 0;
  table.rowColorSource = "none";
  table.rowColorReliable = false;
  table.rowColorConfirmed = false;
  table.rowColorAutoApplied = false;
  table.rowColorAutoSkipCount = 0;
  table.rowColorLogicVersion = ROW_COLOR_LOGIC_VERSION;
  table.rowColorMessage = "";
  table.rowColorRows = [];
  table.rowColorSoldTextAnchor = null;
  table.rowColorPartialSequenceAligned = false;
  table.rowColorPageLabels = [];
  table.rowColorExactRowAligned = false;
  table.rowColorActionableConflict = false;
  table.rowColorAiAutoApplyAllowed = false;

  if (!analysis || !["opencv", "ai_row_color", "pdf_vector", "paddle_ppstructure", "ticket_row_anchor"].includes(analysis.source)) return 0;
  table.rowColorSource = analysis.source;
  table.rowColorLogicVersion = ROW_COLOR_LOGIC_VERSION;
  table.rowColorSelectionMode = analysis.selectionMode || "";
  table.rowColorImageWidth = Number(analysis.imageWidth || 0);
  table.rowColorImageHeight = Number(analysis.imageHeight || 0);
  table.rowColorContiguous = analysis.contiguous === true;
  table.rowColorAiGeometryVerified = analysis.aiGeometryVerified === true || analysis.rowGeometryVerified === true;
  table.rowColorAiAutoApplyAllowed = analysis.autoApplyAllowed === true;
  table.rowColorMaxGap = Number(analysis.maxRowGap || 0);
  table.rowColorLowConfidenceRows = Array.isArray(analysis.lowConfidenceRows) ? analysis.lowConfidenceRows : [];
  table.rowColorUnreliableReasons = Array.isArray(analysis.unreliableReasons) ? analysis.unreliableReasons : [];
  table.rowColorWarningReasons = Array.isArray(analysis.warningReasons) ? analysis.warningReasons : [];
  const availableRows = Array.isArray(analysis.rows) ? analysis.rows : [];
  const aligned =
    analysis.source === "ai_row_color" || analysis.source === "ticket_row_anchor"
      ? {
          rows: table.rows.map(
            (_, index) =>
              availableRows.find((row) => Number(row?.index) === index) || {
                index,
                label: "",
                rawLabel: "",
                confidence: 0,
                reason: analysis.source === "ticket_row_anchor" ? "文字锚点未返回这一行，保留人工确认。" : "AI 未返回这一行，保留人工确认。",
              },
          ),
          startIndex: 0,
        }
      : getAlignedOpenCvRowsForTable(table, availableRows, startIndex);
  const assignedRows = aligned.rows;
  const sourceIndexedAlignment = hasSourceIndexedOpenCvAlignment(table, analysis, aligned, availableRows);
  const unsafeSourceSequencePrefix = hasUnsafeSourceSequenceColorPrefix(table, analysis, aligned, availableRows);
  if (unsafeSourceSequencePrefix && !table.rowColorWarningReasons.includes("source_sequence_prefix_not_verified")) {
    table.rowColorWarningReasons = [...table.rowColorWarningReasons, "source_sequence_prefix_not_verified"];
  }
  const backendSelectionMode = String(analysis.selectionMode || "");
  const backendExactAllowed = !/text_projection_split/i.test(backendSelectionMode);
  table.rowColorExactBackendAligned = (analysis.exactRowAligned === true && !unsafeSourceSequencePrefix && backendExactAllowed) || sourceIndexedAlignment;
  table.rowColorAlignedStart = aligned.startIndex;
  table.rowColorPartialSequenceAligned = aligned.partialSequenceAligned === true;
  table.rowColorPageLabels = uniqueCleanValues(availableRows.map((row) => getOpenCvItemRawColorLabel(row)));
  table.rowColorExactRowAligned = Boolean(
    ((analysis.source === "ai_row_color" || analysis.source === "ticket_row_anchor") && analysis.reliable === true && analysis.exactRowAligned === true) ||
      ((analysis.source === "opencv" || analysis.source === "pdf_vector" || analysis.source === "paddle_ppstructure") &&
        table.rowColorExactBackendAligned &&
        aligned.exact === true &&
        assignedRows.length === table.rows.length),
  );
  const alignedSourceIndexes = Array.isArray(aligned.sourceIndexes) ? aligned.sourceIndexes : [];
  table.rowColorSourceIndexes = alignedSourceIndexes.length === table.rows.length ? [...alignedSourceIndexes] : table.rowColorSourceIndexes;
  table.rowColorRows = assignedRows.map((row, index) => ({
    source: analysis.source,
    label: row?.label || "",
    rawLabel: row?.rawLabel || "",
    confidence: row?.confidence || 0,
    coloredRatio: row?.coloredRatio || 0,
    whiteRatio: row?.whiteRatio || 0,
    coverageRatio: row?.coverageRatio || 0,
    coloredBins: row?.coloredBins || 0,
    whiteBins: row?.whiteBins || 0,
    cellCount: row?.cellCount || 0,
    coloredCellCount: row?.coloredCellCount || 0,
    whiteCellCount: row?.whiteCellCount || 0,
    rightmostCellLabel: row?.rightmostCellLabel || "",
    rightmostCellWhite: row?.rightmostCellWhite === true,
    rightmostCellColoredRatio: row?.rightmostCellColoredRatio || 0,
    rightmostCellWhiteRatio: row?.rightmostCellWhiteRatio || 0,
    cellResults: Array.isArray(row?.cellResults) ? row.cellResults : [],
    rowBox: row?.rowBox || row?.row_box || row?.bbox || null,
    bbox: row?.bbox || row?.rowBox || row?.row_box || null,
    sampleBox: row?.sampleBox || null,
    strong: row?.strong === true,
    action: row?.action || "",
    reason: row?.reason || "",
    rowTextVerified: row?.rowTextVerified === true,
    rowGeometryVerified: row?.rowGeometryVerified === true,
    pixelMismatch: row?.pixelMismatch === true,
    matchedText: row?.matchedText || "",
    localPixelLabel: row?.localPixelLabel || "",
    localPixelRedRatio: row?.localPixelRedRatio || 0,
    localPixelWhiteRatio: row?.localPixelWhiteRatio || 0,
    localPixelColoredRatio: row?.localPixelColoredRatio || 0,
    sourceIndex: alignedSourceIndexes[index] ?? row?.index ?? "",
    y: row?.y ?? "",
  }));

  const exactRowCount = assignedRows.length === table.rows.length;
  const labels = table.rowColorRows.map((row) => getOpenCvItemConflictActionLabel(row) || getOpenCvItemRawColorLabel(row)).filter(Boolean);
  const canAttemptReliableColorDecision = Boolean(
    (analysis.reliable || sourceIndexedAlignment) &&
      (analysis.source !== "ai_row_color" || table.rowColorAiGeometryVerified === true) &&
      table.rowColorExactBackendAligned &&
      exactRowCount &&
      table.rowColorExactRowAligned &&
      hasStableOpenCvActionableAlignment(table, analysis, aligned, availableRows),
  );
  const allEffectiveRowsHaveSignal = canAttemptReliableColorDecision
    ? assignedRows.every((colorItem, rowIndex) =>
        hasUsableOpenCvColorSignalForEffectiveTicket(table, table.rows[rowIndex], rowIndex, colorItem),
      )
    : false;
  table.rowColorReliable = Boolean(canAttemptReliableColorDecision && allEffectiveRowsHaveSignal);
  const colorState = table.rowColorReliable
    ? getOpenCvEffectiveColorState(table)
    : {
        hasWhite: false,
        hasNonWhite: false,
        whiteCount: 0,
        nonWhiteCount: 0,
        labels: [],
      };
  const hasColorConflict = colorState.hasWhite && colorState.hasNonWhite;
  const hasVerifiedRowColorConflict = hasVerifiedWhiteAndNonWhiteRowColorHold(table);
  table.rowColorActionableConflict = Boolean((table.rowColorReliable && hasColorConflict) || hasVerifiedRowColorConflict);
  applyOpenCvWhiteVsColoredAutoDecision(table);
  const actionableColorState = table.rowColorActionableConflict ? getOpenCvEffectiveColorState(table) : colorState;
  const hasActionableColorConflict = actionableColorState.hasWhite && actionableColorState.hasNonWhite;
  const untrustedColorMapping =
    !table.rowColorReliable &&
    ((analysis.source === "opencv" || analysis.source === "pdf_vector" || analysis.source === "paddle_ppstructure") &&
      (!table.rowColorExactBackendAligned || !table.rowColorExactRowAligned || table.rowColorPartialSequenceAligned));
  if (untrustedColorMapping) clearUntrustedRowColorPublishHolds(table);
  if (
    analysis.source !== "ai_row_color" &&
    !table.rowColorReliable &&
    !hasActionableOpenCvColorSource(table)
  ) {
    Object.keys(table.publishRows || {}).forEach((rowIndex) => {
      if (table.manualSkipRows?.[rowIndex] !== true && table.publishRows[rowIndex] === false) delete table.publishRows[rowIndex];
    });
  }
  const engineName = getRowColorEngineName(table);
  if (analysis.source === "ai_row_color" && table.rowColorAutoApplied === true) {
    table.rowColorMessage = table.rowColorMessage || `${engineName} 已按高置信逐行结果处理。`;
  } else if (analysis.source === "ai_row_color" && table.rowColorAiAutoApplyAllowed !== true) {
    table.rowColorMessage = `${engineName} 已记录逐行颜色复核，但未通过行框级一对一验证，不会自动改变发布状态。`;
  } else if (analysis.source === "ai_row_color" && table.rowColorAiGeometryVerified !== true) {
    table.rowColorMessage = `${engineName} 已记录逐行建议，但没有原图行框验证，不会自动改变发布状态。`;
  } else if (hasActionableColorConflict) {
    table.rowColorMessage = `${engineName} 已识别 ${assignedRows.length}/${table.rows.length} 行底色，检测到白底有效票 ${actionableColorState.whiteCount} 条、非白底有效票 ${actionableColorState.nonWhiteCount} 条；非白底行会自动设为不发布。`;
  } else if (table.rowColorReliable && colorState.hasNonWhite && !colorState.hasWhite) {
    table.rowColorMessage = `${engineName} 已匹配 ${table.rows.length} 行底色：只有非白底有效票，没有白底有效票作参照，按整表带色处理。`;
  } else if (table.rowColorReliable && colorState.hasWhite && !colorState.hasNonWhite) {
    table.rowColorMessage = `${engineName} 已匹配 ${table.rows.length} 行底色：只有白底有效票，未发现需要按颜色下架的票。`;
  } else if (table.rowColorReliable) {
    table.rowColorMessage = `${engineName} 已匹配 ${table.rows.length} 行底色`;
  } else if (hasColorConflict) {
    const lowRows = Array.isArray(table.rowColorLowConfidenceRows) && table.rowColorLowConfidenceRows.length
      ? `，低置信行：${table.rowColorLowConfidenceRows.map((index) => index + 1).join("、")}`
      : "";
    const gapText = table.rowColorWarningReasons?.includes("row_gap") ? "，检测到行间空隙但不会单独阻止判断" : "";
    table.rowColorMessage =
      analysis.error || `${engineName} 行底色需逐行强信号确认：识别 ${assignedRows.length}/${table.rows.length} 行${table.rowColorSelectionMode ? `，模式 ${table.rowColorSelectionMode}` : ""}${lowRows}${gapText}`;
  } else {
    table.rowColorMessage = labels.length
      ? `${engineName} 已识别 ${assignedRows.length}/${table.rows.length} 行底色，未发现白底+非白底有效票冲突`
      : analysis.source === "opencv" && availableRows.length !== table.rows.length
        ? `${engineName} 行数未一一对应：识别 ${availableRows.length}/${table.rows.length} 行，已停止自动套色，避免误下架。`
      : `${engineName} 未识别到会影响上架的颜色冲突`;
  }
  return Math.max(assignedRows.length, aligned.startIndex + assignedRows.length - startIndex);
}

function toggleOpenCvRowColorPreview(table) {
  if (!table || !hasOpenCvRowColorPreview(table)) {
    showToast("这张表没有逐行颜色明细。", "error");
    return;
  }
  table.showOpenCvColorPreview = !table.showOpenCvColorPreview;
  renderReviewPanel();
}

function moveBusinessColorMarkersToInternalColumn(table, row) {
  return false;
}

function moveBusinessStatusMarkersToRemark(table, row) {
  if (!table || !row) return false;
  const statusIndexes = findColumnIndexes(table.columns || [], ["状态", "售卖状态", "销售状态", "status", "是否售出"]);
  const sourceIndex = statusIndexes.find((index) => isBusinessStatusRemarkValue(row[index]));
  if (sourceIndex < 0) return false;
  const remarkIndex = ensureNamedColumn(table, "备注", ["备注", "remark", "note", "说明"]);
  while (row.length < table.columns.length) row.push("");
  const value = String(row[sourceIndex] || "").trim();
  if (!value) return false;
  const existingRemark = String(row[remarkIndex] || "").trim();
  if (!existingRemark) {
    row[remarkIndex] = value;
  } else if (!normalize(existingRemark).includes(normalize(value))) {
    row[remarkIndex] = `${existingRemark} ${value}`.trim();
  }
  row[sourceIndex] = "";
  return true;
}

function getTicketRowColorLabels(table, options = {}) {
  if (isVisualRowColorSource(table) && hasOpenCvRowColorPreview(table)) {
    const labels = (table.rows || []).map((row, index) => {
      if (options.excludeSold && isSoldTicket({ table, row, index })) return "";
      return getAutoOpenCvRowColorLabel(table, index);
    });
    return uniqueCleanValues(labels.filter(Boolean));
  }
  const colorIndex = getRowColorColumnIndex(table);
  if (colorIndex < 0) return [];
  const rowsForColorCheck = (table.rows || []).filter((row, index) => {
    if (!options.excludeSold) return true;
    return !isSoldTicket({ table, row, index });
  });
  const labels = rowsForColorCheck.map((row) => normalizeRowColorLabel(row[colorIndex]));
  const filledLabels = labels.filter(Boolean);
  if (!filledLabels.length) return [];
  const hasBlankRows = labels.some((label) => !label);
  return uniqueCleanValues([...filledLabels, ...(hasBlankRows ? ["白底"] : [])]);
}

function hasWhiteAndNonWhiteRowColorLabels(labels = []) {
  const cleanLabels = uniqueCleanValues(labels);
  return cleanLabels.some(isAvailableRowColorLabel) && cleanLabels.some((label) => label && !isAvailableRowColorLabel(label));
}

function getTicketRowColorLabel(ticket) {
  if (isVisualRowColorSource(ticket.table) && hasOpenCvRowColorPreview(ticket.table)) {
    return getStrictWhiteOnlyOpenCvRowColorLabel(ticket.table, ticket.index);
  }
  const colorIndex = getRowColorColumnIndex(ticket.table);
  return colorIndex >= 0 ? normalizeRowColorLabel(ticket.row[colorIndex]) : "";
}

function isAvailableRowColorLabel(label) {
  return /^白底$/.test(String(label || ""));
}

function isDefaultAutoSkipColorLabel(label) {
  return /^(红底|橙底)$/.test(String(label || ""));
}

function hasContextualAnchorNonWhiteRowColorSignal(table, rowIndex) {
  if (!hasOpenCvRowColorPreview(table) || isPendingRowManuallyPublished(table, rowIndex)) return false;
  const item = table?.rowColorRows?.[rowIndex];
  if (!item || item.userCleared || item.source !== "ticket_row_anchor") return false;
  if (item.rowTextVerified !== true || item.rowGeometryVerified !== true) return false;
  const rawLabel = getOpenCvItemRawColorLabel(item);
  if (!rawLabel || isAvailableRowColorLabel(rawLabel) || !/^(红底|橙底|绿底)$/.test(rawLabel)) return false;
  const coloredRatio = Number(item.coloredRatio || 0);
  const whiteRatio = Number(item.whiteRatio || 0);
  const coverageRatio = Number(item.coverageRatio || 0);
  return coloredRatio >= 0.34 && coverageRatio >= 0.5 && coloredRatio >= whiteRatio + 0.1;
}

function hasVerifiedWhiteRowColorReference(table) {
  if (!Array.isArray(table?.rows) || !table.rows.length) return false;
  return table.rows.some((row, index) => {
    const ticket = { table, row, index };
    return isEffectiveTicketRowForColorDecision(ticket) && !isSoldTicket(ticket) && hasVerifiedWhiteRowColorHold(table, index);
  });
}

function hasVerifiedNonWhiteRowColorHold(table, rowIndex) {
  if (!hasOpenCvRowColorPreview(table) || isPendingRowManuallyPublished(table, rowIndex)) return false;
  if (!Array.isArray(table?.rowColorRows) || !table.rowColorRows[rowIndex]) return false;
  const item = table.rowColorRows[rowIndex];
  const label = getStrictRowLocalOpenCvColorLabel(item) || getOpenCvItemDecisionColorLabel(item);
  if (!label || isAvailableRowColorLabel(label)) return false;
  if (item.source === "ticket_row_anchor") {
    if (item.rowTextVerified !== true || item.rowGeometryVerified !== true) return false;
    if (item.strong === true) return true;
    return hasVerifiedWhiteRowColorReference(table) && hasContextualAnchorNonWhiteRowColorSignal(table, rowIndex);
  }
  if (item.source === "ai_row_color") return isTrustedAiRowSkipDecision(table, rowIndex);
  if (!hasExactVisualRowColorAlignment(table)) return false;
  return item.strong === true || isOpenCvCellNonWhiteTicketSignal(item);
}

function hasAnyVerifiedNonWhiteRowColorHold(table) {
  if (!Array.isArray(table?.rows) || !table.rows.length) return false;
  return table.rows.some((row, index) => {
    const ticket = { table, row, index };
    return isEffectiveTicketRowForColorDecision(ticket) && !isSoldTicket(ticket) && hasVerifiedNonWhiteRowColorHold(table, index);
  });
}

function hasVerifiedWhiteRowColorHold(table, rowIndex) {
  if (!hasOpenCvRowColorPreview(table)) return false;
  if (!Array.isArray(table?.rowColorRows) || !table.rowColorRows[rowIndex]) return false;
  const item = table.rowColorRows[rowIndex];
  const label = getStrictRowLocalOpenCvColorLabel(item) || getOpenCvItemDecisionColorLabel(item);
  if (!isAvailableRowColorLabel(label)) return false;
  if (item.source === "ticket_row_anchor") {
    return item.rowTextVerified === true && item.rowGeometryVerified === true && Number(item.confidence || 0) >= 0.82;
  }
  if (item.source === "ai_row_color") return isTrustedAiRowPublishDecision(table, rowIndex);
  if (!hasExactVisualRowColorAlignment(table)) return false;
  return item.strong === true || isOpenCvCellMajorityWhite(item);
}

function hasVerifiedWhiteAndNonWhiteRowColorHold(table) {
  if (!Array.isArray(table?.rows) || !table.rows.length) return false;
  let hasWhite = false;
  let hasNonWhite = false;
  table.rows.forEach((row, index) => {
    const ticket = { table, row, index };
    if (!isEffectiveTicketRowForColorDecision(ticket) || isSoldTicket(ticket)) return;
    if (hasVerifiedWhiteRowColorHold(table, index)) hasWhite = true;
    if (hasVerifiedNonWhiteRowColorHold(table, index)) hasNonWhite = true;
  });
  return hasWhite && hasNonWhite;
}

function hasWhiteOnlyRowColorRule(table) {
  if (hasOpenCvRowColorPreview(table)) return hasAnyOpenCvWhiteAndColoredConflict(table);
  const labels = getTicketRowColorLabels(table, { excludeSold: true });
  return hasWhiteAndNonWhiteRowColorLabels(labels);
}

function getWhiteOnlyRuleRowColorLabel(ticket) {
  if (hasOpenCvRowColorPreview(ticket.table) && hasAnyOpenCvWhiteAndColoredConflict(ticket.table)) {
    return getWhiteVsColoredConflictLabel(ticket.table, ticket.index) || getTicketRowColorLabel(ticket);
  }
  return getTicketRowColorLabel(ticket);
}

function isColorMarkedSoldTicket(ticket) {
  if (!ticket?.table || !Array.isArray(ticket.table.rows)) return false;
  if (isSoldTicket(ticket)) return false;
  return shouldAutoSkipForRowColor(ticket.table, ticket.index);
}

function hasTicketRowColorColumn(table) {
  return getRowColorColumnIndex(table) >= 0;
}

function isInternalColorColumn(column = "") {
  return ["行底色", "底色", "背景色", "颜色标记", "颜色", "row color", "background"].some((name) => normalize(column).includes(normalize(name)));
}

function analyzePendingTableRisk(table) {
  pruneNonTicketRowsFromTable(table);
  normalizePendingTableColumns(table);
  ensureDefaultQuantityColumn(table);
  const reasons = [];
  const columns = table.columns || [];
  const rows = table.rows || [];
  const reviewTickets = rows.map((row, index) => ({ table, row, index })).filter((ticket) => !isUnavailableTicket(ticket));
  const reviewRows = reviewTickets.map((ticket) => ticket.row);
  const dateIndex = findColumnIndex(columns, DATE_COLUMN_NAMES);
  const zoneIndex = findColumnIndex(columns, ["区域", "区", "block", "section", "구역"]);
  const priceIndex = findColumnIndex(columns, ["售价", "单价", "价格", "报价", "金额", "ask", "price"]);
  const hasDerivedDate = reviewTickets.some((ticket) => getTicketDateValues(ticket).length > 0);
  const hasDerivedZone = reviewTickets.some((ticket) => Boolean(getTicketZoneValue(ticket)));
  const hasDerivedPrice = reviewTickets.some((ticket) => hasTicketSalePrice(ticket));

  if (columns.length < 4) reasons.push("识别到的列数偏少");
  if (rows.length < 1) reasons.push("没有识别到票源行");
  if (dateIndex < 0 && !hasDerivedDate) reasons.push("缺少日期列");
  if (zoneIndex < 0 && !hasDerivedZone) reasons.push("缺少区域列");
  if (priceIndex < 0 && !hasDerivedPrice) reasons.push("缺少售价列");

  const missingPriceRows = reviewTickets.filter((ticket) => !hasTicketSalePrice(ticket)).length;
  if (missingPriceRows) reasons.push(`${missingPriceRows} 行缺少售价`);

  const sparseRows = rows.filter((row) => row.filter((cell) => String(cell || "").trim()).length < Math.min(3, columns.length)).length;
  if (rows.length && sparseRows / rows.length > 0.35) reasons.push("空缺单元格较多");

  if (zoneIndex >= 0 && currentEvent.zones.length && reviewRows.length) {
    const matchedRows = reviewRows.filter((row) =>
      currentEvent.zones.some((zone) => zoneMatchesTicket({ table, row, index: -1 }, zone)),
    ).length;
    if (!matchedRows) reasons.push("未售候选区域内容暂未匹配当前座位图热区");
  }

  return {
    needsManualReview: reasons.length > 0,
    reasons,
  };
}

function analyzePendingTableRiskLightly(table) {
  const reasons = [];
  const columns = table.columns || [];
  const rows = table.rows || [];
  const reviewTickets = rows.map((row, index) => ({ table, row, index })).filter((ticket) => !isUnavailableTicket(ticket));
  const dateIndex = findColumnIndex(columns, DATE_COLUMN_NAMES);
  const zoneIndex = findColumnIndex(columns, ["区域", "区", "block", "section", "구역"]);
  const priceIndex = findColumnIndex(columns, ["售价", "单价", "价格", "报价", "金额", "ask", "price"]);
  const hasDerivedDate = reviewTickets.some((ticket) => getTicketDateValues(ticket).length > 0);
  const hasDerivedZone = reviewTickets.some((ticket) => Boolean(getTicketZoneValue(ticket)));
  const hasDerivedPrice = reviewTickets.some((ticket) => hasTicketSalePrice(ticket));

  if (columns.length < 4) reasons.push("识别到的列数偏少");
  if (rows.length < 1) reasons.push("没有识别到票源行");
  if (dateIndex < 0 && !hasDerivedDate) reasons.push("缺少日期列");
  if (zoneIndex < 0 && !hasDerivedZone) reasons.push("缺少区域列");
  if (priceIndex < 0 && !hasDerivedPrice) reasons.push("缺少售价列");

  const missingPriceRows = reviewTickets.filter((ticket) => !hasTicketSalePrice(ticket)).length;
  if (missingPriceRows) reasons.push(`${missingPriceRows} 行缺少售价`);

  return {
    needsManualReview: reasons.length > 0,
    reasons,
  };
}

function updatePendingTableReviewFlags(table) {
  if (!table) return table;
  repairMisreadDataHeaderTable(table);
  normalizePendingTableColumns(table);
  let rowRepairChanged = false;
  (table.rows || []).forEach((row, rowIndex) => {
    const changedThisRow =
      repairExplicitCurrencyPriceInWrongColumn(table, row, rowIndex) ||
      repairShiftedSalePriceAndRemark(table, row);
    if (changedThisRow) {
      rowRepairChanged = true;
      syncOriginalRowFromCurrentRow(table, rowIndex, row);
    }
  });
  if (repairMisplacedDateAndPriceValues(table)) {
    rowRepairChanged = true;
  }
  if (rowRepairChanged) table._columnRepairChanged = true;
  if (table._columnRepairChanged === true) {
    forceCanonicalOriginalDisplay(table);
  }
  const useLightRisk = table.lightReviewFlags === true || (table.rows || []).length > 12;
  const risk = useLightRisk ? analyzePendingTableRiskLightly(table) : analyzePendingTableRisk(table);
  const forcedReviewReasons = table.returnedForReview ? ["从已发布退回校对"] : [];
  table.lightReviewFlags = Boolean(table.lightReviewFlags || useLightRisk);
  table.needsManualReview = Boolean(risk.needsManualReview || forcedReviewReasons.length);
  table.reviewReasons = [...forcedReviewReasons, ...risk.reasons.filter((reason) => !forcedReviewReasons.includes(reason))];
  table.reviewFlagsVersion = REVIEW_FLAGS_VERSION;
  return table;
}

function markPendingTableReviewFlagsLightly(table) {
  if (!table) return table;
  const risk = analyzePendingTableRiskLightly(table);
  const forcedReviewReasons = table.returnedForReview ? ["从已发布退回校对"] : [];
  table.lightReviewFlags = true;
  delete table._columnRepairChanged;
  table.needsManualReview = Boolean(risk.needsManualReview || forcedReviewReasons.length);
  table.reviewReasons = [...forcedReviewReasons, ...risk.reasons.filter((reason) => !forcedReviewReasons.includes(reason))];
  table.reviewFlagsVersion = REVIEW_FLAGS_VERSION;
  return table;
}

function getCachedMissingPriceReviewCount(table) {
  const reasons = Array.isArray(table?.reviewReasons) ? table.reviewReasons : [];
  const reason = reasons.find((item) => /缺少售价/.test(String(item || "")));
  if (!reason) return -1;
  const count = extractNumber(reason);
  return Number.isFinite(count) && count !== null ? count : 1;
}

function getCurrentMissingPriceReviewCount(table) {
  if (!table || !Array.isArray(table.rows)) return 0;
  return table.rows
    .map((row, index) => ({ table, row, index }))
    .filter((ticket) => !isUnavailableTicket(ticket))
    .filter((ticket) => !hasTicketSalePrice(ticket)).length;
}

function hasStaleMissingPriceReviewReason(table) {
  const cachedCount = getCachedMissingPriceReviewCount(table);
  if (cachedCount < 0) return false;
  return cachedCount !== getCurrentMissingPriceReviewCount(table);
}

function ensurePendingTableReviewFlags(table) {
  if (!table) return table;
  if (
    table.reviewFlagsVersion === REVIEW_FLAGS_VERSION &&
    typeof table.needsManualReview === "boolean" &&
    Array.isArray(table.reviewReasons) &&
    !hasStaleMissingPriceReviewReason(table) &&
    table._columnRepairChanged !== true
  ) {
    return table;
  }
  if (table.lightReviewFlags) {
    return markPendingTableReviewFlagsLightly(table);
  }
  repairMisreadDataHeaderTable(table);
  return updatePendingTableReviewFlags(table);
}

function formatStandardDateLabel(year, month, day) {
  return `${year}年${Number(month)}月${Number(day)}日`;
}

function makeDateKeys(year, month, day) {
  const monthNumber = Number(month);
  const dayNumber = Number(day);
  if (!monthNumber || !dayNumber) return [];
  const keys = [`${monthNumber}-${dayNumber}`, `day-${dayNumber}`];
  if (year) keys.push(`${year}-${monthNumber}-${dayNumber}`);
  return keys;
}

function getDateKeysFromText(value) {
  const text = String(value || "").trim();
  if (!text) return [];
  const compactText = text.replace(/\s+/g, "");
  const keys = [];
  const extractedDate = extractDateFromCompositeSeatText(text);
  if (extractedDate && extractedDate !== text) {
    keys.push(...getDateKeysFromText(extractedDate));
  }
  const fullMatches = [...compactText.matchAll(/(20\d{2})(?:[.\/-]|年)(\d{1,2})(?:[.\/-]|月)(\d{1,2})(?:日|号|號)?/g)];
  fullMatches.forEach((match) => keys.push(...makeDateKeys(match[1], match[2], match[3])));

  const compactMatches = [...compactText.matchAll(/\b(20\d{2})(\d{2})(\d{2})\b/g)];
  compactMatches.forEach((match) => keys.push(...makeDateKeys(match[1], match[2], match[3])));

  const compactMonthDayMatches = [...compactText.matchAll(/\b(0[1-9]|1[0-2])([0-2]\d|3[01])\b/g)];
  compactMonthDayMatches.forEach((match) => keys.push(...makeDateKeys("", match[1], match[2])));

  const monthDayMatches = [...compactText.matchAll(/(?:^|[^\d])(\d{1,2})(?:[.\/-]|月)(\d{1,2})(?:日|号|號)?(?=$|[^\d])/g)];
  monthDayMatches.forEach((match) => keys.push(...makeDateKeys("", match[1], match[2])));

  const dayKeywordMatches = [...compactText.matchAll(/(?:^|[^\d])([0-2]?\d|3[01])(?:日|号|號|day)(?=$|[^\d])/gi)];
  dayKeywordMatches.forEach((match) => keys.push(`day-${Number(match[1])}`));

  const dayOnlyMatch = compactText.match(/^(?:day)?([1-9]|[12]\d|3[01])$/i);
  if (dayOnlyMatch) keys.push(`day-${Number(dayOnlyMatch[1])}`);

  return [...new Set(keys)];
}

function getDateKeysFromValues(values) {
  return [...new Set(values.flatMap((value) => getDateKeysFromText(value)))];
}

function normalizeDateCellValue(value, { allowDayOnly = true } = {}) {
  const text = String(value || "").trim();
  if (!text) return "";
  const extracted = extractDateFromCompositeSeatText(text);
  if (extracted) return extracted;
  if (isLikelyDateValue(text)) return text;
  return allowDayOnly && isLikelyDayOnlyDateValue(text) ? text : "";
}

function getTicketDateValues(ticket) {
  const dateIndexes = findColumnIndexes(ticket.table.columns || [], DATE_COLUMN_NAMES);
  const dateValues = dateIndexes.map((index) => normalizeDateCellValue(ticket.row[index], { allowDayOnly: true })).filter(Boolean);
  if (dateValues.length) return dateValues;
  if (dateIndexes.length) return [];
  return (ticket.row || []).map((value) => normalizeDateCellValue(value, { allowDayOnly: false })).filter(Boolean);
}

function getSelectedDateDebugInfo() {
  const date = getSelectedDate();
  if (!date) return null;
  return {
    selectedDateId,
    selectedDateLabel: date.label,
    targetDateKeys: getDateKeysFromValues([date.id, date.label, ...(date.aliases || [])]),
  };
}

function parseDateOptions(text) {
  const parts = String(text || "")
    .split(/[\/,，、]/)
    .map((part) => part.trim())
    .filter(Boolean);
  const values = parts.length ? parts : ["待定"];
  return values.map((rawLabel, index) => {
    const standardMatch = rawLabel.match(/^(\d{4})[-./年](\d{1,2})[-./月](\d{1,2})日?$/);
    const compactMatch = rawLabel.match(/^(\d{4})(\d{2})(\d{2})$/);
    const match = standardMatch || compactMatch;
    if (!match) {
      const label = rawLabel;
      return {
        id: `date-${Date.now()}-${index}`,
        label,
        aliases: [label, label.replace(/\s+/g, "")],
      };
    }
    const [, year, month, day] = match;
    const monthText = String(Number(month));
    const dayText = String(Number(day));
    const compact = `${year}${String(month).padStart(2, "0")}${String(day).padStart(2, "0")}`;
    const dashed = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const label = formatStandardDateLabel(year, month, day);
    return {
      id: compact,
      label,
      aliases: [
        label,
        dashed,
        compact,
        `${monthText}.${dayText}`,
        `${monthText}月${dayText}日`,
        `${dayText}日`,
        `${dayText}号`,
        `${dayText}號`,
        `0${monthText}`.slice(-2) + "." + `0${dayText}`.slice(-2),
      ],
    };
  });
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

async function saveUploadedSourceFile(file, dataUrl = "") {
  let response = await fetch("/api/source/save", {
    method: "POST",
    headers: {
      "Content-Type": file.type || "application/octet-stream",
      "X-File-Name": encodeURIComponent(file.name || "source"),
      "X-File-Type": file.type || "",
    },
    body: file,
  });
  if (!response.ok && dataUrl) {
    response = await fetch("/api/source/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ file: dataUrl, fileName: file.name }),
    });
  }
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.message || payload.error || "原始文件保存失败。");
  return payload.url;
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

function compactLargeStateBeforeSave() {
  if (uploadedSource?.url?.startsWith("uploads/") && uploadedSource.dataUrl) uploadedSource.dataUrl = "";
  pendingTables.forEach((table) => {
    if (String(table.originalImage || "").startsWith("data:") && uploadedSource?.url?.startsWith("uploads/") && table.sourceFileName === uploadedSource.name) {
      table.originalImage = uploadedSource.url;
    }
  });
}

function buildSerializableAppState(serializableEvents, serializablePendingTables, serializableUploadedSource, options = {}) {
  const uploadDraftText = String(uploadTableText.value || "");
  const shouldStoreUploadDraft = options.keepLargeDrafts === true || (!options.omitLargeDrafts && uploadDraftText.length <= MAX_UPLOAD_DRAFT_STORAGE_CHARS);
  return {
    events: serializableEvents,
    currentEventId: currentEvent.id,
    seatmapTemplates,
    fieldMappingTemplates,
    fieldMappingDraft,
    eventDraftHistory,
    pendingTables: serializablePendingTables,
    selectedPendingTableId,
    uploadedSource: serializableUploadedSource,
    ocrJobState: buildSerializableOcrJobState(),
    uploadDraft: {
      tableTitle: uploadTableTitle.value,
      tableText: shouldStoreUploadDraft ? uploadDraftText : "",
      status: shouldStoreUploadDraft ? uploadStatus.textContent : "",
      pdfStatus: shouldStoreUploadDraft ? pdfDetectionStatus.textContent : "",
      omittedLargeDraft: !shouldStoreUploadDraft && Boolean(uploadDraftText),
    },
  };
}

function trimAppStateForLocalStorage(state) {
  if (!state || typeof state !== "object") return state;
  const uploadDraft = state.uploadDraft || {};
  const tableText = String(uploadDraft.tableText || "");
  const ocrSnapshot = state.ocrJobState?.lastTicketOcrJobSnapshot || null;
  const ocrText = String(ocrSnapshot?.text || "");
  const ocrPartialText = String(ocrSnapshot?.partialText || "");
  const ocrSavedText = String(ocrSnapshot?.savedOcrText || "");
  const shouldTrimDraft = tableText.length > MAX_UPLOAD_DRAFT_STORAGE_CHARS;
  const shouldTrimOcrSnapshot =
    ocrText.length > MAX_UPLOAD_DRAFT_STORAGE_CHARS ||
    ocrPartialText.length > MAX_UPLOAD_DRAFT_STORAGE_CHARS ||
    ocrSavedText.length > MAX_UPLOAD_DRAFT_STORAGE_CHARS;
  if (!shouldTrimDraft && !shouldTrimOcrSnapshot) return state;
  const trimmedState = {
    ...state,
    uploadDraft: {
      ...uploadDraft,
      tableText: shouldTrimDraft ? "" : tableText,
      status: shouldTrimDraft ? "" : uploadDraft.status,
      pdfStatus: shouldTrimDraft ? "" : uploadDraft.pdfStatus,
      omittedLargeDraft: shouldTrimDraft ? true : uploadDraft.omittedLargeDraft,
    },
  };
  if (shouldTrimOcrSnapshot) {
    trimmedState.ocrJobState = {
      ...(state.ocrJobState || {}),
      lastTicketOcrJobSnapshot: {
        ...ocrSnapshot,
        text: "",
        partialText: "",
        savedOcrText: "",
        omittedLargeText: true,
      },
    };
  }
  return trimmedState;
}

function buildSerializableOcrJobState() {
  return {
    activeTicketOcrJobId: activeTicketOcrJobId || "",
    autoPendingGenerationJobId: autoPendingGenerationJobId || "",
    lastTicketOcrJobSnapshot: lastTicketOcrJobSnapshot
      ? {
          ...lastTicketOcrJobSnapshot,
          errors: Array.isArray(lastTicketOcrJobSnapshot.errors) ? lastTicketOcrJobSnapshot.errors.map((item) => ({ ...item })) : [],
          failedPages: Array.isArray(lastTicketOcrJobSnapshot.failedPages) ? [...lastTicketOcrJobSnapshot.failedPages] : [],
          aiColorErrors: Array.isArray(lastTicketOcrJobSnapshot.aiColorErrors) ? lastTicketOcrJobSnapshot.aiColorErrors.map((item) => ({ ...item })) : [],
          rowColorAnalyses: lastTicketOcrJobSnapshot.rowColorAnalyses ? { ...lastTicketOcrJobSnapshot.rowColorAnalyses } : {},
          ppStructureAnalyses: lastTicketOcrJobSnapshot.ppStructureAnalyses ? { ...lastTicketOcrJobSnapshot.ppStructureAnalyses } : {},
        }
      : null,
  };
}

function makeCompactPendingTable(table) {
  return {
    id: table.id,
    title: table.title,
    originalImage: table.originalImage,
    originalType: table.originalType,
    originalColumns: Array.isArray(table.originalColumns) ? [...table.originalColumns] : [],
    originalRows: Array.isArray(table.originalRows) ? table.originalRows.map((row) => [...row]) : [],
    sourceFileName: table.sourceFileName,
    sourceName: table.sourceName,
    sourcePage: table.sourcePage,
    sourcePart: table.sourcePart,
    eventId: table.eventId,
    quickManualMode: Boolean(table.quickManualMode),
    quickCheckVisible: Boolean(table.quickCheckVisible),
    columns: Array.isArray(table.columns) ? [...table.columns] : [],
    rows: Array.isArray(table.rows) ? table.rows.map((row) => [...row]) : [],
    publishRows: { ...(table.publishRows || {}) },
    manualPublishRows: { ...(table.manualPublishRows || {}) },
    manualSkipRows: { ...(table.manualSkipRows || {}) },
    reviewedRows: { ...(table.reviewedRows || {}) },
    userEditedRows: { ...(table.userEditedRows || {}) },
    rowColorSourceIndexes: Array.isArray(table.rowColorSourceIndexes) ? [...table.rowColorSourceIndexes] : null,
    rowColorSourceIndexMode: table.rowColorSourceIndexMode || "",
    rowActionGeometryVersion: Number(table.rowActionGeometryVersion || 0),
    rowColorImageWidth: Number(table.rowColorImageWidth || 0),
    rowColorImageHeight: Number(table.rowColorImageHeight || 0),
    rowColorPartialSequenceAligned: Boolean(table.rowColorPartialSequenceAligned),
    rowColorSparseSourceRepair: Boolean(table.rowColorSparseSourceRepair),
    rowColorPageLabels: Array.isArray(table.rowColorPageLabels) ? [...table.rowColorPageLabels] : [],
    rowColorRows: Array.isArray(table.rowColorRows)
      ? table.rowColorRows.map((item) => ({
          source: item?.source || "",
          label: item?.label || "",
          rawLabel: item?.rawLabel || "",
          action: item?.action || "",
          confidence: Number(item?.confidence || 0),
          whiteRatio: Number(item?.whiteRatio || 0),
          coloredRatio: Number(item?.coloredRatio || 0),
          coverageRatio: Number(item?.coverageRatio || 0),
          reason: item?.reason || "",
          rowBox: item?.rowBox || null,
          bbox: item?.bbox || null,
          sampleBox: item?.sampleBox || null,
          y1: item?.y1 ?? "",
          y2: item?.y2 ?? "",
          x1: item?.x1 ?? "",
          x2: item?.x2 ?? "",
          height: item?.height ?? "",
          rowActionGeometry: item?.rowActionGeometry === true,
          pixelMismatch: item?.pixelMismatch === true,
          rowTextVerified: item?.rowTextVerified === true,
          rowGeometryVerified: item?.rowGeometryVerified === true,
          matchedText: item?.matchedText || "",
          localPixelLabel: item?.localPixelLabel || "",
          localPixelRedRatio: Number(item?.localPixelRedRatio || 0),
          localPixelWhiteRatio: Number(item?.localPixelWhiteRatio || 0),
          localPixelColoredRatio: Number(item?.localPixelColoredRatio || 0),
        }))
      : [],
    aiRowColorAutoRows: Array.isArray(table.aiRowColorAutoRows) ? [...table.aiRowColorAutoRows] : [],
    rowColorSource: table.rowColorSource || "",
    rowColorReliable: Boolean(table.rowColorReliable),
    rowColorConfirmed: Boolean(table.rowColorConfirmed),
    rowColorExactRowAligned: Boolean(table.rowColorExactRowAligned),
    rowColorActionableConflict: Boolean(table.rowColorActionableConflict),
    rowColorLogicVersion: Number(table.rowColorLogicVersion || 0),
    publishDecisionLogicVersion: Number(table.publishDecisionLogicVersion || 0),
    colorReviewSamples: { ...(table.colorReviewSamples || {}) },
    rowColorSoldTextAnchor: table.rowColorSoldTextAnchor
      ? {
          soldNonWhiteCount: Number(table.rowColorSoldTextAnchor.soldNonWhiteCount || 0),
          labels: Array.isArray(table.rowColorSoldTextAnchor.labels) ? [...table.rowColorSoldTextAnchor.labels] : [],
        }
      : null,
    ppStructureAnalysis: compactPpStructureAnalysis(table.ppStructureAnalysis),
    ppStructureTicketRowMatches: clonePpStructureMatches(table.ppStructureTicketRowMatches),
    ppStructureMessage: table.ppStructureMessage || "",
    needsManualReview: Boolean(table.needsManualReview),
    reviewReasons: Array.isArray(table.reviewReasons) ? [...table.reviewReasons] : [],
    reviewFlagsVersion: table.reviewFlagsVersion || 0,
    lightReviewFlags: Boolean(table.lightReviewFlags),
  };
}

function clonePpStructureMatch(match) {
  return {
    ticketRowIndex: Number(match?.ticketRowIndex || 0),
    matched: match?.matched === true,
    score: Number(match?.score || 0),
    confidence: match?.confidence || "",
    reason: match?.reason || "",
    ppTableIndex: Number(match?.ppTableIndex || 0),
    ppRowIndex: Number(match?.ppRowIndex || 0),
    ppText: match?.ppText || "",
    color: match?.color
      ? {
          label: match.color.label || "",
          rawLabel: match.color.rawLabel || "",
          confidence: Number(match.color.confidence || 0),
          coloredRatio: Number(match.color.coloredRatio || 0),
          whiteRatio: Number(match.color.whiteRatio || 0),
          coverageRatio: Number(match.color.coverageRatio || 0),
        }
      : null,
    matchedTokens: Array.isArray(match?.matchedTokens) ? [...match.matchedTokens] : [],
    priceMatched: match?.priceMatched === true,
    dateMatched: match?.dateMatched === true,
  };
}

function compactPpStructureAnalysis(analysis) {
  if (!analysis || typeof analysis !== "object") return null;
  return {
    source: analysis.source || "paddle_ppstructure",
    tableCount: Number(analysis.tableCount || 0),
    tables: Array.isArray(analysis.tables)
      ? analysis.tables.map((table) => ({
          bbox: table.bbox || null,
          rowCount: Number(table.rowCount || 0),
          cellCount: Number(table.cellCount || 0),
          cellBBoxCount: Number(table.cellBBoxCount || 0),
          ocrBoxCount: Number(table.ocrBoxCount || 0),
          htmlCellCount: Number(table.htmlCellCount || 0),
          cellAlignmentExact: table.cellAlignmentExact === true,
        }))
      : [],
    rowColorAnalysis: analysis.rowColorAnalysis
      ? {
          source: analysis.rowColorAnalysis.source || "paddle_ppstructure",
          expectedRows: Number(analysis.rowColorAnalysis.expectedRows || 0),
          detectedRows: Number(analysis.rowColorAnalysis.detectedRows || 0),
          selectionMode: analysis.rowColorAnalysis.selectionMode || "",
          reliable: analysis.rowColorAnalysis.reliable === true,
          exactRowAligned: analysis.rowColorAnalysis.exactRowAligned === true,
          unreliableReasons: Array.isArray(analysis.rowColorAnalysis.unreliableReasons) ? [...analysis.rowColorAnalysis.unreliableReasons] : [],
        }
      : null,
    ticketAlignedRowColorAnalysis: analysis.ticketAlignedRowColorAnalysis
      ? {
          ...analysis.ticketAlignedRowColorAnalysis,
          rows: Array.isArray(analysis.ticketAlignedRowColorAnalysis.rows)
            ? analysis.ticketAlignedRowColorAnalysis.rows.map((row) => ({ ...row, bbox: row?.bbox || null }))
            : [],
        }
      : null,
  };
}

function clonePpStructureMatches(matches) {
  return Array.isArray(matches) ? matches.map(clonePpStructureMatch) : [];
}

function buildSerializableEvents() {
  return events.map((event) => ({
    id: event.id,
    name: event.name,
    artist: event.artist || getEventArtist(event),
    city: event.city || getEventCity(event),
    location: event.location,
    dates: event.dates,
    dateOptions: event.dateOptions,
    venue: event.venue,
    venueLocal: event.venueLocal || getEventVenue(event),
    seatmapTitle: event.seatmapTitle,
    seatmapImage: event.seatmapImage,
    seatmapFileName: event.seatmapFileName,
    seatmapSize: event.seatmapSize,
    seatmapFingerprint: event.seatmapFingerprint || "",
    seatmapTemplateId: event.seatmapTemplateId || "",
    seatmapTestedZoneIds: Array.isArray(event.seatmapTestedZoneIds) ? [...event.seatmapTestedZoneIds] : [],
    seatmapTestedAt: event.seatmapTestedAt || "",
    seatmapTestRequired: event.seatmapTestRequired === true,
    seatmapTestReason: event.seatmapTestReason || "",
    zones: event.zones,
    tables: event.tables,
  }));
}

function buildSerializablePendingTables({ compact = false } = {}) {
  if (compact) return pendingTables.slice(0, MAX_OPERATION_ARCHIVE_PENDING_TABLES).map(makeCompactPendingTable);
  return pendingTables.map((table) => ({
    ...table,
    columns: Array.isArray(table.columns) ? [...table.columns] : [],
    rows: Array.isArray(table.rows) ? table.rows.map((row) => [...row]) : [],
    publishRows: { ...(table.publishRows || {}) },
    manualPublishRows: { ...(table.manualPublishRows || {}) },
    manualSkipRows: { ...(table.manualSkipRows || {}) },
    reviewedRows: { ...(table.reviewedRows || {}) },
    userEditedRows: { ...(table.userEditedRows || {}) },
    quickManualMode: Boolean(table.quickManualMode),
    quickCheckVisible: Boolean(table.quickCheckVisible),
    aiReviewDecisions: Array.isArray(table.aiReviewDecisions) ? table.aiReviewDecisions.map((item) => ({ ...item })) : [],
    colorReviewSamples: { ...(table.colorReviewSamples || {}) },
    ppStructureAnalysis: compactPpStructureAnalysis(table.ppStructureAnalysis),
    ppStructureTicketRowMatches: clonePpStructureMatches(table.ppStructureTicketRowMatches),
    ppStructureMessage: table.ppStructureMessage || "",
    reviewSnapshots: Array.isArray(table.reviewSnapshots)
      ? table.reviewSnapshots.map((snapshot) => ({
          ...snapshot,
          state: snapshot.state
            ? {
                ...snapshot.state,
                columns: Array.isArray(snapshot.state.columns) ? [...snapshot.state.columns] : [],
                rows: Array.isArray(snapshot.state.rows) ? snapshot.state.rows.map((row) => [...row]) : [],
                publishRows: { ...(snapshot.state.publishRows || {}) },
                manualPublishRows: { ...(snapshot.state.manualPublishRows || {}) },
                manualSkipRows: { ...(snapshot.state.manualSkipRows || {}) },
                reviewedRows: { ...(snapshot.state.reviewedRows || {}) },
                userEditedRows: { ...(snapshot.state.userEditedRows || {}) },
                aiReviewDecisions: Array.isArray(snapshot.state.aiReviewDecisions) ? snapshot.state.aiReviewDecisions.map((item) => ({ ...item })) : [],
              }
            : null,
        }))
      : [],
  }));
}

function buildSerializableUploadedSource() {
  return uploadedSource
    ? {
        name: uploadedSource.name,
        type: uploadedSource.type,
        url: uploadedSource.url || "",
        dataUrl: String(uploadedSource.url || "").startsWith("uploads/") ? "" : uploadedSource.dataUrl || "",
        detectedTables: uploadedSource.detectedTables || 1,
      }
    : null;
}

function openAppStateBackupDb() {
  return new Promise((resolve, reject) => {
    if (!("indexedDB" in window)) {
      reject(new Error("当前浏览器不支持本地大容量备份。"));
      return;
    }
    const request = indexedDB.open(APP_STATE_BACKUP_DB, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(APP_STATE_BACKUP_STORE)) db.createObjectStore(APP_STATE_BACKUP_STORE);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error("打开本地备份失败。"));
  });
}

function withAppStateBackupStore(mode, callback) {
  return openAppStateBackupDb().then(
    (db) =>
      new Promise((resolve, reject) => {
        const transaction = db.transaction(APP_STATE_BACKUP_STORE, mode);
        const store = transaction.objectStore(APP_STATE_BACKUP_STORE);
        let callbackResult;
        transaction.oncomplete = () => {
          db.close();
          resolve(callbackResult);
        };
        transaction.onerror = () => {
          db.close();
          reject(transaction.error || new Error("本地备份读写失败。"));
        };
        callbackResult = callback(store);
      }),
  );
}

function saveAppStateToIndexedBackup(state) {
  if (!state) return;
  withAppStateBackupStore("readwrite", (store) => {
    store.put({ state, savedAt: Date.now() }, APP_STATE_BACKUP_KEY);
  })
    .then(() => {
      updateLocalSaveStatus({ saved: true, backup: "大容量备份完成" });
    })
    .catch((error) => {
      console.warn("Indexed app state backup skipped.", error);
      updateLocalSaveStatus({ saved: true, backup: "主缓存已保存，大容量备份失败" });
    });
}

function loadAppStateFromIndexedBackup() {
  return withAppStateBackupStore("readonly", (store) => {
    return new Promise((resolve, reject) => {
      const request = store.get(APP_STATE_BACKUP_KEY);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error || new Error("读取本地备份失败。"));
    });
  });
}

function getAppStateRecoveryScore(state) {
  if (!state || typeof state !== "object") return 0;
  const pendingCount = Array.isArray(state.pendingTables) ? state.pendingTables.length : 0;
  const publishedCount = Array.isArray(state.events)
    ? state.events.reduce((sum, event) => sum + (Array.isArray(event.tables) ? event.tables.length : 0), 0)
    : 0;
  const uploadTextLength = String(state.uploadDraft?.tableText || "").length;
  const snapshot = state.ocrJobState?.lastTicketOcrJobSnapshot || null;
  const ocrTextLength = String(snapshot?.savedOcrText || snapshot?.text || snapshot?.partialText || "").length;
  const hasSource = state.uploadedSource ? 1 : 0;
  return pendingCount * 10000 + publishedCount * 1000 + hasSource * 100 + Math.min(uploadTextLength + ocrTextLength, 99999) / 1000;
}

function shouldReplaceIndexedBackup(existingState, nextState) {
  if (!existingState) return true;
  const existingScore = getAppStateRecoveryScore(existingState);
  const nextScore = getAppStateRecoveryScore(nextState);
  const existingPending = Array.isArray(existingState.pendingTables) ? existingState.pendingTables.length : 0;
  const nextPending = Array.isArray(nextState?.pendingTables) ? nextState.pendingTables.length : 0;
  const existingSnapshot = existingState.ocrJobState?.lastTicketOcrJobSnapshot || null;
  const nextSnapshot = nextState?.ocrJobState?.lastTicketOcrJobSnapshot || null;
  const existingHasLargeOcr = Boolean(String(existingSnapshot?.savedOcrText || existingSnapshot?.text || existingSnapshot?.partialText || "").trim());
  const nextHasLargeOcr = Boolean(String(nextSnapshot?.savedOcrText || nextSnapshot?.text || nextSnapshot?.partialText || "").trim());
  if (existingPending > 0 && nextPending === 0) return false;
  if (existingHasLargeOcr && !nextHasLargeOcr && nextPending <= existingPending) return false;
  return nextScore >= existingScore * 0.85;
}

function saveAppState(options = {}) {
  compactLargeStateBeforeSave();
  const serializableEvents = buildSerializableEvents();
  const serializablePendingTables = buildSerializablePendingTables();
  const serializableUploadedSource = buildSerializableUploadedSource();
  const indexedBackupState = () =>
    buildSerializableAppState(serializableEvents, serializablePendingTables, serializableUploadedSource, { keepLargeDrafts: true });
  const saveIndexedBackup = () => {
    if (largeAppStateBackupRestorePending && !String(uploadTableText.value || "").trim() && options.forceIndexedBackupReplace !== true) return;
    const nextState = indexedBackupState();
    if (options.forceIndexedBackupReplace === true) {
      saveAppStateToIndexedBackup(nextState);
      return;
    }
    loadAppStateFromIndexedBackup()
      .then((backup) => {
        if (shouldReplaceIndexedBackup(backup?.state, nextState)) {
          saveAppStateToIndexedBackup(nextState);
        } else {
          updateLocalSaveStatus({ saved: true, backup: "已保留更完整的大容量备份" });
        }
      })
      .catch(() => saveAppStateToIndexedBackup(nextState));
  };
  try {
    mergeEventDraftHistory();
    const state = buildSerializableAppState(serializableEvents, serializablePendingTables, serializableUploadedSource);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimAppStateForLocalStorage(state)));
    saveIndexedBackup();
    updateLocalSaveStatus({ saved: true, backup: largeAppStateBackupRestorePending ? "等待恢复完整 OCR" : "主缓存完成" });
    return true;
  } catch (error) {
    const trimmedPendingTables = serializablePendingTables.map((table) => ({ ...table, reviewSnapshots: [] }));
    try {
      const state = buildSerializableAppState(serializableEvents, trimmedPendingTables, serializableUploadedSource, { omitLargeDrafts: true });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trimAppStateForLocalStorage(state)));
      saveIndexedBackup();
      updateLocalSaveStatus({ saved: true, backup: "主缓存精简保存" });
      pendingTables.forEach((table) => {
        table.reviewSnapshots = [];
      });
      return true;
    } catch {
      try {
        const state = buildSerializableAppState(serializableEvents, pendingTables.map(makeCompactPendingTable), serializableUploadedSource, { omitLargeDrafts: true });
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(trimAppStateForLocalStorage(state)),
        );
        saveIndexedBackup();
        updateLocalSaveStatus({ saved: true, backup: "主缓存压缩保存" });
        return true;
      } catch {
        saveIndexedBackup();
        console.warn("App state auto-save skipped because local storage is full.");
        updateLocalSaveStatus({ error: "主缓存已满，正在依赖大容量备份" });
      }
    }
    return false;
  }
}

function loadOperationArchives() {
  try {
    const saved = localStorage.getItem(OPERATION_ARCHIVE_KEY);
    if (saved && saved.length > MAX_OPERATION_ARCHIVE_STORAGE_CHARS) {
      operationArchives = [];
      localStorage.removeItem(OPERATION_ARCHIVE_KEY);
      window.setTimeout(() => showToast("旧操作存档过大，已自动清理以避免刷新白屏；当前主数据未删除。", "warning"), 0);
      return;
    }
    const parsed = saved ? JSON.parse(saved) : [];
    operationArchives = Array.isArray(parsed) ? parsed.filter((item) => item?.id && item?.state).slice(0, MAX_OPERATION_ARCHIVES) : [];
    if (Array.isArray(parsed) && parsed.length > operationArchives.length) {
      window.setTimeout(saveOperationArchives, 0);
    }
  } catch {
    operationArchives = [];
    localStorage.removeItem(OPERATION_ARCHIVE_KEY);
  }
}

function saveOperationArchives() {
  try {
    localStorage.setItem(OPERATION_ARCHIVE_KEY, JSON.stringify(operationArchives.slice(0, MAX_OPERATION_ARCHIVES)));
    return true;
  } catch {
    operationArchives = operationArchives.slice(0, Math.max(5, Math.floor(MAX_OPERATION_ARCHIVES / 2)));
    try {
      localStorage.setItem(OPERATION_ARCHIVE_KEY, JSON.stringify(operationArchives));
      return true;
    } catch {
      console.warn("Operation archive save skipped because local storage is full.");
      return false;
    }
  }
}

function getOperationArchiveSummary() {
  const pendingCount = pendingTables.filter((table) => table.eventId === currentEvent.id).length;
  return `${currentEvent.name} · 已发布 ${currentEvent.tables.length} 张 · 待确认 ${pendingCount} 张`;
}

function archiveCurrentSavedState(label, type = "操作", { silent = true } = {}) {
  compactLargeStateBeforeSave();
  const archive = {
    id: `operation-archive-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    label,
    type,
    createdAt: Date.now(),
    createdAtText: new Date().toLocaleString("zh-CN", { hour12: false }),
    eventId: currentEvent.id,
    eventName: currentEvent.name,
    summary: getOperationArchiveSummary(),
    state: buildSerializableAppState(buildSerializableEvents(), buildSerializablePendingTables({ compact: true }), buildSerializableUploadedSource(), { omitLargeDrafts: true }),
  };
  operationArchives = [archive, ...operationArchives].slice(0, MAX_OPERATION_ARCHIVES);
  const saved = saveOperationArchives();
  renderOperationArchives();
  if (saved && !silent) showToast("已创建操作存档。", "success");
  return saved;
}

function saveAndArchiveAppStep(label, type = "操作", options = {}) {
  const saved = saveAppState();
  if (!saved) return false;
  return archiveCurrentSavedState(label, type, options);
}

function renderOperationArchives() {
  if (!operationArchiveList || !operationArchiveCount) return;
  operationArchiveCount.textContent = `自动保留最近 ${operationArchives.length}/${MAX_OPERATION_ARCHIVES} 个恢复点`;
  if (!operationArchives.length) {
    operationArchiveList.innerHTML = `<div class="empty-upload-record">还没有操作存档。</div>`;
    if (clearOperationArchivesButton) clearOperationArchivesButton.disabled = true;
    return;
  }
  if (clearOperationArchivesButton) clearOperationArchivesButton.disabled = false;
  operationArchiveList.innerHTML = operationArchives
    .slice(0, 8)
    .map(
      (archive) => `
        <div class="operation-archive-item">
          <div>
            <strong>${escapeHtml(archive.label || archive.type || "操作存档")}</strong>
            <span>${escapeHtml(archive.createdAtText || "")} · ${escapeHtml(archive.summary || archive.eventName || "")}</span>
          </div>
          <div class="operation-archive-actions">
            <button class="small-button ghost" type="button" data-restore-operation-archive="${archive.id}">恢复</button>
            <button class="small-button danger ghost" type="button" data-delete-operation-archive="${archive.id}">删除</button>
          </div>
        </div>
      `,
    )
    .join("");
}

function restoreOperationArchive(archiveId) {
  const archive = operationArchives.find((item) => item.id === archiveId);
  if (!archive?.state) {
    showToast("没有找到这个操作存档。", "error");
    return;
  }
  const confirmed = window.confirm(`恢复到「${archive.label}」吗？\n\n当前页面状态会被这个存档覆盖。`);
  if (!confirmed) return;
  saveAndArchiveAppStep(`恢复前备份：${currentEvent.name}`, "恢复前备份");
  localStorage.setItem(STORAGE_KEY, JSON.stringify(archive.state));
  window.location.reload();
}

function deleteOperationArchive(archiveId) {
  const before = operationArchives.length;
  operationArchives = operationArchives.filter((item) => item.id !== archiveId);
  if (operationArchives.length === before) return;
  saveOperationArchives();
  renderOperationArchives();
  showToast("已删除这个操作存档。", "success");
}

function clearOperationArchives() {
  if (!operationArchives.length) return;
  const confirmed = window.confirm(`确定删除全部 ${operationArchives.length} 个操作存档吗？\n\n当前主数据不会删除。`);
  if (!confirmed) return;
  operationArchives = [];
  saveOperationArchives();
  renderOperationArchives();
  showToast("已删除全部旧存档。", "success");
}

let pendingAppStateSaveTimer = null;
let appStateSaveBackoffUntil = 0;
let largeAppStateBackupRestorePending = false;

function stateNeedsLargeBackupRestore(state) {
  if (!state || typeof state !== "object") return false;
  const uploadDraft = state.uploadDraft || {};
  const snapshot = state.ocrJobState?.lastTicketOcrJobSnapshot || null;
  const draftWasTrimmed = uploadDraft.omittedLargeDraft === true && !String(uploadDraft.tableText || "").trim();
  const snapshotWasTrimmed = snapshot?.omittedLargeText === true && !String(snapshot.savedOcrText || snapshot.text || snapshot.partialText || "").trim();
  return draftWasTrimmed || snapshotWasTrimmed;
}

function scheduleAppStateSave(delay = 500) {
  if (pendingAppStateSaveTimer) clearTimeout(pendingAppStateSaveTimer);
  const wait = Math.max(delay, appStateSaveBackoffUntil - Date.now());
  pendingAppStateSaveTimer = window.setTimeout(() => {
    pendingAppStateSaveTimer = null;
    const runSave = () => {
      const saved = saveAppState();
      appStateSaveBackoffUntil = saved ? 0 : Date.now() + 10000;
    };
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(runSave, { timeout: 2000 });
    } else {
      window.setTimeout(runSave, 0);
    }
  }, wait);
}

function restoreAppStateFromBackupAfterLoad(reason = "") {
  loadAppStateFromIndexedBackup()
    .then((backup) => {
      const state = backup?.state;
      if (!state || !Array.isArray(state.events) || !state.events.length) return;
      const pendingCount = Array.isArray(state.pendingTables) ? state.pendingTables.length : 0;
      const publishedCount = Array.isArray(state.events)
        ? state.events.reduce((sum, event) => sum + (Array.isArray(event.tables) ? event.tables.length : 0), 0)
        : 0;
      if (!pendingCount && !publishedCount && !state.uploadedSource) return;
      applyLoadedAppState(state);
      largeAppStateBackupRestorePending = false;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trimAppStateForLocalStorage(state)));
      showToast(reason ? `已从本地备份恢复页面数据：${reason}` : "已从本地备份恢复页面数据。", "success");
      render();
      renderAdminEvent();
      renderUploadRecords();
      renderFieldMappingPreview();
      renderPublishedTables();
      renderOperationArchives();
      renderReviewPanel();
      resumeRestoredTicketOcrJobIfNeeded();
      updateLocalSaveStatus({ saved: true, backup: "已从大容量备份恢复" });
    })
    .catch((error) => {
      console.warn("Indexed app state restore skipped.", error);
    });
}

function restoreAppStateFromBackupIfRicher(reason = "") {
  loadAppStateFromIndexedBackup()
    .then((backup) => {
      const backupState = backup?.state;
      if (!backupState || !Array.isArray(backupState.events) || !backupState.events.length) return;
      const currentState = buildSerializableAppState(buildSerializableEvents(), buildSerializablePendingTables(), buildSerializableUploadedSource(), {
        keepLargeDrafts: true,
      });
      if (getAppStateRecoveryScore(backupState) <= getAppStateRecoveryScore(currentState) + 1) return;
      applyLoadedAppState(backupState);
      largeAppStateBackupRestorePending = false;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trimAppStateForLocalStorage(backupState)));
      showToast(reason ? `已找回上次数据：${reason}` : "已从本地备份找回上次数据。", "success");
      render();
      renderAdminEvent();
      renderUploadRecords();
      renderFieldMappingPreview();
      renderPublishedTables();
      renderOperationArchives();
      renderReviewPanel();
      resumeRestoredTicketOcrJobIfNeeded();
      updateLocalSaveStatus({ saved: true, backup: "已用更完整备份回填" });
    })
    .catch((error) => {
      console.warn("Richer Indexed app state restore skipped.", error);
    });
}

function flushAppStateSaveNow() {
  if (pendingAppStateSaveTimer) {
    clearTimeout(pendingAppStateSaveTimer);
    pendingAppStateSaveTimer = null;
  }
  saveAppState();
}

function normalizeLoadedPendingTable(table) {
  const loadedRowColorVersion = Number(table?.rowColorLogicVersion || 0);
  const hasStaleRowColorLogic = loadedRowColorVersion !== ROW_COLOR_LOGIC_VERSION;
  const loadedPublishDecisionVersion = Number(table?.publishDecisionLogicVersion || 0);
  const hasStalePublishDecisionLogic = loadedPublishDecisionVersion !== PUBLISH_DECISION_LOGIC_VERSION;
  const normalizedTable = {
    ...table,
    columns: Array.isArray(table.columns) ? [...table.columns] : [],
    rows: Array.isArray(table.rows) ? table.rows.map((row) => [...row]) : [],
    publishRows: { ...(table.publishRows || {}) },
    manualPublishRows: { ...(table.manualPublishRows || {}) },
    manualSkipRows: { ...(table.manualSkipRows || {}) },
    reviewedRows: { ...(table.reviewedRows || {}) },
    userEditedRows: { ...(table.userEditedRows || {}) },
    ppStructureAnalysis: compactPpStructureAnalysis(table.ppStructureAnalysis),
    ppStructureTicketRowMatches: clonePpStructureMatches(table.ppStructureTicketRowMatches),
    ppStructureMessage: table.ppStructureMessage || "",
  };
  if (hasStaleRowColorLogic) {
    normalizedTable._rowColorRepairing = false;
    normalizedTable._rowColorRepairDone = false;
    normalizedTable._rowColorRepairTried = false;
  }
  if (isVisualRowColorSource(normalizedTable) && hasStaleRowColorLogic) {
    Object.keys(normalizedTable.publishRows || {}).forEach((rowIndex) => {
      if (normalizedTable.manualSkipRows?.[rowIndex] !== true) delete normalizedTable.publishRows[rowIndex];
    });
    normalizedTable.rowColorSource = "";
    normalizedTable.rowColorReliable = false;
    normalizedTable.rowColorConfirmed = false;
    normalizedTable.rowColorExactRowAligned = false;
    normalizedTable.rowColorActionableConflict = false;
    normalizedTable.rowColorAutoApplied = false;
    normalizedTable.rowColorAutoSkipCount = 0;
    normalizedTable.aiRowColorAutoRows = [];
    normalizedTable.rowColorRows = [];
    normalizedTable.rowColorSoldTextAnchor = null;
    normalizedTable.rowColorPartialSequenceAligned = false;
    normalizedTable.rowColorSparseSourceRepair = false;
    normalizedTable.rowColorPageLabels = [];
    normalizedTable.rowColorMessage = "旧版颜色判断已停用，打开本页会重新逐行识别底色。";
    normalizedTable._rowColorRepairing = false;
    normalizedTable._rowColorRepairDone = false;
    normalizedTable._rowColorRepairTried = false;
  }
  if (
    normalizedTable.quickManualMode === true &&
    Array.isArray(normalizedTable.rowColorRows) &&
    normalizedTable.rowColorRows.length &&
    Number(normalizedTable.rowActionGeometryVersion || 0) !== ROW_ACTION_GEOMETRY_VERSION
  ) {
    normalizedTable.rowColorRows = [];
    normalizedTable.rowColorImageWidth = 0;
    normalizedTable.rowColorImageHeight = 0;
    normalizedTable.rowActionGeometryVersion = 0;
    normalizedTable.quickRowActionGeometryTried = false;
    normalizedTable.quickRowActionGeometryTriedVersion = 0;
    normalizedTable.rowColorMessage = "旧版原图贴行按钮坐标已作废，已切回稳定表格核对。";
  }
  normalizedTable.rowColorLogicVersion = Number(normalizedTable.rowColorLogicVersion || 0);
  repairMisreadDataHeaderTable(normalizedTable);
  normalizePendingTableColumns(normalizedTable);
  ensurePendingTableSourceRowIndexes(normalizedTable);
  if (hasStalePublishDecisionLogic) clearStalePublishDecisionBlocks(normalizedTable);
  normalizedTable.publishDecisionLogicVersion = PUBLISH_DECISION_LOGIC_VERSION;
  return normalizedTable;
}

function mergeFragmentedPendingTables(tables = []) {
  const merged = [];
  const mergedByPdfPage = new Map();
  tables.forEach((table) => {
    const tableSourceName = table.sourceFileName || table.sourceName || "";
    const sourcePage = Number(table.sourcePage || 0) || 0;
    const canMergePdfPage = sourcePage > 0 && tableSourceName;
    const sourceKey = `${table.eventId || ""}::${tableSourceName}::${sourcePage}`;
    if (canMergePdfPage && mergedByPdfPage.has(sourceKey)) {
      appendParsedTableOnSamePdfPage(mergedByPdfPage.get(sourceKey), table);
      return;
    }
    if (canMergePdfPage) mergedByPdfPage.set(sourceKey, table);
    merged.push(table);
  });
  return merged.map((table) => {
    table.title = String(table.title || "").replace(/\s*·\s*第\s*\d+\s*块表\s*/g, "");
    repairMisreadDataHeaderTable(table);
    if (Number(table.sourcePage || 0) > 0) forceCanonicalOriginalDisplay(table);
    return table;
  });
}

function getPendingTableRuntimeSignature(table) {
  const rowPreview = Array.isArray(table?.rows)
    ? table.rows
        .slice(0, 3)
        .map((row) => (Array.isArray(row) ? row.join("|") : ""))
        .join(";;")
    : "";
  return [
    table?.id || "",
    table?.eventId || "",
    table?.sourceFileName || table?.sourceName || "",
    Number(table?.sourcePage || 0) || 0,
    Number(table?.sourcePart || 0) || 0,
    table?.title || "",
    Array.isArray(table?.columns) ? table.columns.join("|") : "",
    Array.isArray(table?.originalColumns) ? table.originalColumns.join("|") : "",
    Array.isArray(table?.rows) ? table.rows.length : 0,
    rowPreview,
    Number(table?.publishDecisionLogicVersion || 0) || 0,
    JSON.stringify(table?.publishRows || {}),
    JSON.stringify(table?.manualSkipRows || {}),
    table?._forceCanonicalDisplay === true ? "canonical" : "original",
  ].join("::");
}

function getPendingTablesNormalizeCacheKey() {
  return pendingTables
    .map((table) =>
      [
        table?.id || "",
        table?.eventId || "",
        table?.sourceFileName || table?.sourceName || "",
        Number(table?.sourcePage || 0) || 0,
        Number(table?.sourcePart || 0) || 0,
        Array.isArray(table?.columns) ? table.columns.length : 0,
        Array.isArray(table?.rows) ? table.rows.length : 0,
        Number(table?.rowColorLogicVersion || 0) || 0,
        Number(table?.publishDecisionLogicVersion || 0) || 0,
        Number(table?._columnNormalizationVersion || 0) || 0,
        table?.rowColorSource || "",
        Object.keys(table?.publishRows || {}).length,
        Object.keys(table?.manualSkipRows || {}).length,
        table?._forceCanonicalDisplay === true ? "canonical" : "raw",
      ].join(":"),
    )
    .join("|");
}

function normalizePendingTablesInMemory({ save = false } = {}) {
  if (!pendingTables.length) return false;
  const cacheKey = getPendingTablesNormalizeCacheKey();
  if (cacheKey && cacheKey === pendingTablesNormalizeCacheKey) return false;
  const selectedBefore = pendingTables.find((table) => table.id === selectedPendingTableId) || null;
  const selectedSourceKey = selectedBefore
    ? `${selectedBefore.eventId || ""}::${selectedBefore.sourceFileName || selectedBefore.sourceName || ""}::${Number(selectedBefore.sourcePage || 0) || 0}`
    : "";
  const beforeSignature = pendingTables.map(getPendingTableRuntimeSignature).join("\n");
  const normalizedTables = mergeFragmentedPendingTables(pendingTables.map(normalizeLoadedPendingTable));
  const afterSignature = normalizedTables.map(getPendingTableRuntimeSignature).join("\n");
  const needsPdfCanonicalDisplay = pendingTables.some((table) => Number(table.sourcePage || 0) > 0 && table._forceCanonicalDisplay !== true);
  if (beforeSignature === afterSignature && !needsPdfCanonicalDisplay) {
    pendingTablesNormalizeCacheKey = cacheKey;
    return false;
  }

  pendingTables.splice(0, pendingTables.length, ...normalizedTables);
  if (selectedBefore && !pendingTables.some((table) => table.id === selectedBefore.id)) {
    const replacement =
      pendingTables.find((table) => {
        const sourceKey = `${table.eventId || ""}::${table.sourceFileName || table.sourceName || ""}::${Number(table.sourcePage || 0) || 0}`;
        return sourceKey === selectedSourceKey;
      }) || pendingTables.find((table) => table.eventId === currentEvent.id);
    selectedPendingTableId = replacement?.id || null;
  }
  pendingTablesNormalizeCacheKey = getPendingTablesNormalizeCacheKey();
  if (save) scheduleAppStateSave();
  return true;
}

function applyLoadedAppState(parsed) {
  if (!Array.isArray(parsed?.events) || !parsed.events.length) return false;
  sessionStorage.removeItem("ticket-admin-state-backup-restore-attempted");
  eventDraftHistory = parsed.eventDraftHistory || eventDraftHistory;
  seatmapTemplates = Array.isArray(parsed.seatmapTemplates) ? parsed.seatmapTemplates : [];
  fieldMappingTemplates = Array.isArray(parsed.fieldMappingTemplates) ? parsed.fieldMappingTemplates : [];
  fieldMappingDraft = parsed.fieldMappingDraft || null;
  const loadedPendingTables = Array.isArray(parsed.pendingTables)
    ? mergeFragmentedPendingTables(parsed.pendingTables.map(normalizeLoadedPendingTable))
    : [];
  pendingTables.splice(0, pendingTables.length, ...loadedPendingTables);
  selectedPendingTableId = parsed.selectedPendingTableId || null;
  uploadedSource = parsed.uploadedSource || null;
  if (uploadedSource?.dataUrl && !uploadedSource.url) uploadedSource.url = uploadedSource.dataUrl;
  const loadedOcrJobState = parsed.ocrJobState || {};
  activeTicketOcrJobId = loadedOcrJobState.activeTicketOcrJobId || loadedOcrJobState.lastTicketOcrJobSnapshot?.id || activeTicketOcrJobId || null;
  autoPendingGenerationJobId = loadedOcrJobState.autoPendingGenerationJobId || autoPendingGenerationJobId || null;
  lastTicketOcrJobSnapshot = loadedOcrJobState.lastTicketOcrJobSnapshot || lastTicketOcrJobSnapshot;
  largeAppStateBackupRestorePending = stateNeedsLargeBackupRestore(parsed);
  if (parsed.uploadDraft) {
    const recoverableOcrText = getRecoverableOcrTextFromState(parsed);
    const draftText = String(parsed.uploadDraft.tableText || "");
    uploadTableTitle.value = parsed.uploadDraft.tableTitle || "";
    uploadTableText.value = draftText || recoverableOcrText || "";
    uploadStatus.textContent = parsed.uploadDraft.status || uploadStatus.textContent;
    pdfDetectionStatus.textContent = parsed.uploadDraft.pdfStatus || pdfDetectionStatus.textContent;
    if (!draftText && recoverableOcrText) {
      uploadStatus.textContent = `已恢复 OCR 文本 ${recoverableOcrText.length.toLocaleString("zh-CN")} 字；可以重新生成确认表。`;
      uploadStatus.dataset.status = "success";
    } else if (parsed.uploadDraft.omittedLargeDraft) {
      uploadStatus.textContent = "上次 OCR 草稿过大，未写入浏览器主缓存；如果本地备份可用会自动恢复 OCR 文本。";
      uploadStatus.dataset.status = "idle";
    }
    if (uploadedSource?.name) {
      selectedSourceName.textContent = `已恢复：${getSelectedFileDisplayName(uploadedSource.name)}`;
      selectedSourceName.title = decodePossiblyEncodedFileName(uploadedSource.name);
    }
  } else {
    const recoverableOcrText = getRecoverableOcrTextFromState(parsed);
    if (recoverableOcrText) {
      uploadTableText.value = recoverableOcrText;
      setUploadStatus(`已恢复 OCR 文本 ${recoverableOcrText.length.toLocaleString("zh-CN")} 字；可以重新生成确认表。`, "success");
    }
  }
  const builtInEvents = events.map((event) => ({
    ...event,
    dateOptions: Array.isArray(event.dateOptions) ? event.dateOptions.map((date) => ({ ...date })) : [],
    zones: Array.isArray(event.zones) ? event.zones.map((zone) => ({ ...zone, polygon: Array.isArray(zone.polygon) ? zone.polygon.map((point) => [...point]) : [] })) : [],
    tables: Array.isArray(event.tables)
      ? event.tables.map((table) => ({ ...table, columns: [...table.columns], rows: table.rows.map((row) => [...row]) }))
      : [],
  }));
  const templateGuideZones = seatmapTemplates.reduce((count, template) => {
    if (!Array.isArray(template.zones)) return count;
    const before = template.zones.length;
    template.zones = template.zones.filter((zone) => !isGuideOnlySeatmapZone(zone));
    return count + before - template.zones.length;
  }, 0);
  const savedEvents = parsed.events.map((event) => ({
    ...event,
    artist: event.artist || getEventArtist(event),
    city: event.city || getEventCity(event),
    venueLocal: event.venueLocal || getEventVenue(event),
  }));
  const missingBuiltInEvents = builtInEvents.filter((event) => !savedEvents.some((savedEvent) => savedEvent.id === event.id));
  events.splice(
    0,
    events.length,
    ...savedEvents,
    ...missingBuiltInEvents,
  );
  const repairedTemplateMismatch = events.reduce((count, event) => count + (repairKnownEventTemplateMismatch(event) ? 1 : 0), 0);
  const syncedBuiltIns = events.reduce((count, event) => count + (syncBuiltInSeatmapTemplate(event) ? 1 : 0), 0);
  currentEvent = events.find((event) => event.id === parsed.currentEventId) || events[0];
  const removedSoldRows = removeSoldRowsEverywhere();
  const hydrated = hydrateSeatmapTemplatesFromEvents();
  const removed = events.reduce((count, event) => count + removeOversizedZones(event), 0);
  const removedGuides = events.reduce((count, event) => count + removeGuideOnlySeatmapZones(event), 0);
  if (removedSoldRows || removed || removedGuides || syncedBuiltIns || templateGuideZones || hydrated || missingBuiltInEvents.length || repairedTemplateMismatch) saveAppState();
  updateLocalSaveStatus({ saved: true, backup: largeAppStateBackupRestorePending ? "等待恢复完整 OCR" : "已恢复" });
  return true;
}

function loadAppState({ includeArchives = true } = {}) {
  if (includeArchives) loadOperationArchives();
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    restoreAppStateFromBackupAfterLoad("主缓存为空");
    renderOperationArchives();
    return;
  }
  try {
    const parsed = JSON.parse(saved);
    if (!applyLoadedAppState(parsed)) {
      restoreAppStateFromBackupAfterLoad("主缓存无可用数据");
    } else if (stateNeedsLargeBackupRestore(parsed)) {
      restoreAppStateFromBackupAfterLoad("OCR 文本在大容量备份中");
    } else if (!pendingTables.length) {
      restoreAppStateFromBackupIfRicher("主缓存没有确认表，已回填更完整备份");
    }
  } catch (error) {
    console.warn("App state load failed; keeping local state and trying IndexedDB backup.", error);
    restoreAppStateFromBackupAfterLoad("主缓存读取失败");
  }
}

function getSelectedDate() {
  return currentEvent.dateOptions.find((date) => date.id === selectedDateId) || null;
}

function dateMatchesRow(row) {
  return dateMatchesValues(row);
}

function dateMatchesTicket(ticket) {
  const dateValues = getTicketDateValues(ticket);
  if (dateValues.length) return dateMatchesValues(dateValues, { strict: true });
  return dateMatchesValues(ticket.row, { strict: false });
}

function dateMatchesValues(values, { strict = false } = {}) {
  const date = getSelectedDate();
  if (!date) return false;
  const targetDateKeys = new Set(getDateKeysFromValues([date.id, date.label, ...(date.aliases || [])]));
  const rowDateKeyGroups = values
    .map((cell) => getDateKeysFromText(cell))
    .filter((keys) => keys.length);
  if (targetDateKeys.size && rowDateKeyGroups.length) {
    if (strict) {
      return rowDateKeyGroups.every((keys) => keys.some((key) => targetDateKeys.has(key)));
    }
    return rowDateKeyGroups.some((keys) => keys.some((key) => targetDateKeys.has(key)));
  }
  if (strict) return false;
  const searchable = normalize(values.join(" "));
  return date.aliases.some((alias) => searchable.includes(normalize(alias)));
}

function findColumnIndex(columns, names) {
  return columns.findIndex((column) => names.some((name) => normalize(column).includes(normalize(name))));
}

function splitZoneValue(value) {
  return String(value || "")
    .replace(/[（）()]/g, " ")
    .split(/[\/,，、\s]+/)
    .map((item) => cleanZoneToken(item.replace(/视阻|restricted|rv/gi, "")))
    .filter(Boolean);
}

function zoneTokenMatches(value, zone) {
  const aliases = [zone.label, zone.id, ...(zone.aliases || [])].map(cleanZoneToken).map(normalize);
  return splitZoneValue(value).some((token) => aliases.includes(normalize(cleanZoneToken(token))));
}

function zoneMatchesTicket(ticket, zone) {
  const standardZone = getTicketZoneValue(ticket);
  if (standardZone) return zoneTokenMatches(standardZone, zone);
  const zoneIndex = findColumnIndex(ticket.table.columns, ["区域", "区", "位置", "block", "section", "구역"]);
  if (zoneIndex >= 0) return zoneTokenMatches(ticket.row[zoneIndex], zone);
  return ticket.row.some((cell) => zoneTokenMatches(cell, zone));
}

function zoneMatchesRow(row, zone, table = null) {
  if (table) return zoneMatchesTicket({ table, row, index: -1 }, zone);
  return row.some((cell) => zoneTokenMatches(cell, zone));
}

function isSoldText(value, { strict = false } = {}) {
  const rawText = String(value || "").trim();
  const hasSlashSold = /s\s*\/\s*o/i.test(rawText);
  const text = rawText.toLowerCase().replace(/[\s/\\（）()·._-]+/g, "");
  if (!text) return false;
  const availablePattern = /(notsold|notforsale|unsold|available|avail|可售|在售|未售|未出|未卖|有票|有货|可出|可发布|售卖中|판매중|판매가능)/i;
  if (availablePattern.test(text)) return false;
  const refundPolicyPattern = /(售出|出售|售后|出后|卖出).{0,12}(不退|不换|不退换|不退款|不退票|退款|退票|取消|延期|改期|画面价|票面)/i;
  const explicitSoldStatusPattern = /(soldout|sold|s0ld|so1d|已售出|已出售|已售罄|已售|售罄|售完|已出|已转|转出|出掉|已卖|卖掉|无了|没了|下架|疑似已售|已锁|锁票|已订|预订中|판매완료|판매완료됨|매진|팔림|완료)/i;
  if (refundPolicyPattern.test(text) && !explicitSoldStatusPattern.test(text)) return false;
  const explicitPattern =
    /(soldout|sold|s0ld|so1d|已售出|已出售|已售罄|已售|售出|售罄|售完|已出|已转|转出|出掉|已卖|卖掉|无了|没了|下架|疑似已售|已锁|锁票|已订|预订中|판매완료|판매완료됨|매진|팔림|완료)/i;
  if (strict) return hasSlashSold || explicitPattern.test(text);
  if (hasSlashSold) return true;
  return new RegExp(`^${explicitPattern.source}$`, "i").test(text);
}

function getTicketRowsForSoldScan(ticket) {
  const table = ticket?.table || {};
  const sources = [];
  const seenRows = new Set();
  const currentSource = { columns: table.columns || [], row: ticket?.row || [] };
  const add = (row, columns, requireMatch = false) => {
    if (!Array.isArray(row) || seenRows.has(row)) return;
    const source = { columns: columns || table.columns || [], row };
    if (requireMatch && !soldScanRowMatchesCurrentSource(currentSource, source)) return;
    seenRows.add(row);
    sources.push(source);
  };
  add(ticket?.row, table.columns || []);
  const index = Number.isInteger(ticket?.index) ? ticket.index : -1;
  if (index >= 0) {
    add(Array.isArray(table.rows) ? table.rows[index] : null, table.columns || []);
    add(Array.isArray(table.originalRows) ? table.originalRows[index] : null, table.originalColumns || table.columns || [], true);
  }
  return sources;
}

function getSoldScanSourceValue(source, names) {
  const index = findColumnIndex(source?.columns || [], names);
  return index >= 0 ? String(source.row?.[index] || "").trim() : "";
}

function soldScanRowMatchesCurrentSource(currentSource, candidateSource) {
  const currentRow = currentSource?.row || [];
  const candidateRow = candidateSource?.row || [];
  const currentSerial = getSoldScanSourceValue(currentSource, ["序号", "编号", "no", "id"]);
  const candidateSerial = getSoldScanSourceValue(candidateSource, ["序号", "编号", "no", "id"]);
  const currentSerialKey = normalize(currentSerial);
  const candidateSerialKey = normalize(candidateSerial);
  if (currentSerialKey && candidateSerialKey && currentSerialKey === candidateSerialKey) return true;

  const checks = [
    [DATE_COLUMN_NAMES, (value) => getDateKeysFromText(value)[0] || normalize(value)],
    [["区域", "区", "block", "section", "구역"], (value) => cleanZoneToken(value)],
    [["排", "排数", "行", "行数", "row", "열"], (value) => normalize(extractSeatRowFromText(value, { allowBareRange: true }) || value)],
    [["座位号", "座位", "号段", "号码", "seat", "번호", "좌석번호"], (value) => normalize(extractSeatNumberFromText(value, { allowBareRange: true }) || value)],
    [["备注", "remark", "note", "说明"], (value) => normalize(value)],
  ];
  let compared = 0;
  let matched = 0;
  checks.forEach(([names, normalizeValue]) => {
    const currentValue = normalizeValue(getSoldScanSourceValue(currentSource, names));
    const candidateValue = normalizeValue(getSoldScanSourceValue(candidateSource, names));
    if (!currentValue || !candidateValue) return;
    compared += 1;
    if (currentValue === candidateValue) matched += 1;
  });
  if (currentSerialKey && candidateSerialKey && currentSerialKey !== candidateSerialKey && compared >= 3) return matched >= 2;
  if (compared >= 2) return matched >= 2;

  const currentTokens = new Set(currentRow.map((cell) => normalize(cell)).filter((cell) => cell && !isSoldText(cell, { strict: true })));
  const candidateTokens = candidateRow.map((cell) => normalize(cell)).filter((cell) => cell && !isSoldText(cell, { strict: true }));
  const overlap = candidateTokens.filter((token) => currentTokens.has(token)).length;
  return overlap >= 3;
}

function rowSourceHasSoldText(source) {
  const columns = source?.columns || [];
  const row = source?.row || [];
  const statusIndex = findColumnIndex(columns, ["状态", "售卖状态", "销售状态", "status", "是否售出", "售出"]);
  if (statusIndex >= 0 && isSoldText(row[statusIndex], { strict: true })) return true;

  const noteIndex = findColumnIndex(columns, ["备注", "remark", "note", "标记", "说明"]);
  if (noteIndex >= 0 && isSoldText(row[noteIndex], { strict: true })) return true;

  const salePriceIndexes = findSalePriceColumnIndexes(columns);
  if (salePriceIndexes.some((index) => isSoldText(row[index], { strict: true }))) return true;

  return row.some((cell) => isSoldText(cell, { strict: true }));
}

function isSoldTicket(ticket) {
  const table = ticket?.table;
  const rowIndex = Number(ticket?.index);
  if (table && Number.isInteger(rowIndex) && rowIndex >= 0 && Array.isArray(ticket.row)) {
    table._soldTicketCache = table._soldTicketCache || {};
    const cacheKey = `${rowIndex}:${(table.columns || []).join("\u0001")}:${ticket.row.join("\u0001")}`;
    if (Object.prototype.hasOwnProperty.call(table._soldTicketCache, cacheKey)) return table._soldTicketCache[cacheKey];
    const value = getTicketRowsForSoldScan(ticket).some(rowSourceHasSoldText);
    table._soldTicketCache[cacheKey] = value;
    return value;
  }
  return getTicketRowsForSoldScan(ticket).some(rowSourceHasSoldText);
}

function isColorHeldForReviewTicket(ticket) {
  return !isSoldTicket(ticket) && isColorMarkedSoldTicket(ticket);
}

function isUnavailableTicket(ticket) {
  return isSoldTicket(ticket) || isColorMarkedSoldTicket(ticket);
}

function isCustomerPublishableTicket(ticket) {
  return !isUnavailableTicket(ticket) && hasTicketSalePrice(ticket);
}

function isNonTicketFooterRow(table, row) {
  if (!table || !Array.isArray(row)) return false;
  if (!isNonTicketFooterCells(row, table.columns || [])) return false;
  return !hasTicketSalePrice({ table, row, index: -1 });
}

function removeRowsFromTable(table, shouldRemove) {
  if (!table?.rows?.length) return 0;
  ensureOriginalTableSnapshot(table);
  const keptRows = [];
  const keptOriginalRows = [];
  const nextPublishRows = {};
  const nextManualPublishRows = {};
  const nextManualSkipRows = {};
  const nextReviewedRows = {};
  const nextUserEditedRows = {};
  const nextRowColorRows = [];
  const nextRowColorSourceIndexes = [];
  let removed = 0;
  table.rows.forEach((row, rowIndex) => {
    if (shouldRemove(row, rowIndex)) {
      removed += 1;
      return;
    }
    const nextIndex = keptRows.length;
    keptRows.push(row);
    if (Array.isArray(table.originalRows) && table.originalRows[rowIndex]) {
      keptOriginalRows[nextIndex] = table.originalRows[rowIndex];
    }
    if (table.publishRows?.[rowIndex] !== undefined) nextPublishRows[nextIndex] = table.publishRows[rowIndex];
    if (table.manualPublishRows?.[rowIndex] !== undefined) nextManualPublishRows[nextIndex] = table.manualPublishRows[rowIndex];
    if (table.manualSkipRows?.[rowIndex] !== undefined) nextManualSkipRows[nextIndex] = table.manualSkipRows[rowIndex];
    if (table.reviewedRows?.[rowIndex] !== undefined) nextReviewedRows[nextIndex] = table.reviewedRows[rowIndex];
    if (table.userEditedRows?.[rowIndex] !== undefined) nextUserEditedRows[nextIndex] = table.userEditedRows[rowIndex];
    if (Array.isArray(table.rowColorRows) && table.rowColorRows[rowIndex]) nextRowColorRows[nextIndex] = table.rowColorRows[rowIndex];
    if (Array.isArray(table.rowColorSourceIndexes) && table.rowColorSourceIndexes[rowIndex] !== undefined) {
      nextRowColorSourceIndexes[nextIndex] = table.rowColorSourceIndexes[rowIndex];
    }
  });
  if (removed) {
    table.rows = keptRows;
    if (Array.isArray(table.originalRows)) table.originalRows = keptOriginalRows;
    table.publishRows = nextPublishRows;
    table.manualPublishRows = nextManualPublishRows;
    table.manualSkipRows = nextManualSkipRows;
    table.reviewedRows = nextReviewedRows;
    table.userEditedRows = nextUserEditedRows;
    if (Array.isArray(table.rowColorRows)) table.rowColorRows = nextRowColorRows;
    if (Array.isArray(table.rowColorSourceIndexes)) table.rowColorSourceIndexes = nextRowColorSourceIndexes;
  }
  return removed;
}

function pruneNonTicketRowsFromTable(table) {
  return removeRowsFromTable(table, (row) => isNonTicketFooterRow(table, row));
}

function rememberOpenCvSoldTextColorAnchors(table) {
  if (
    !hasOpenCvRowColorPreview(table) ||
    table?.rowColorSource === "ai_row_color" ||
    !Array.isArray(table.rows) ||
    !Array.isArray(table.rowColorRows) ||
    table.rows.length === 0 ||
    table.rowColorRows.length !== table.rows.length
  ) {
    return;
  }
  const labels = [];
  let soldNonWhiteCount = 0;
  table.rows.forEach((row, rowIndex) => {
    const label = getStrictRowLocalOpenCvColorLabel(table.rowColorRows[rowIndex]);
    if (!label || isAvailableRowColorLabel(label)) return;
    if (!isSoldTicket({ table, row, index: rowIndex })) return;
    soldNonWhiteCount += 1;
    labels.push(label);
  });
  if (!soldNonWhiteCount) return;
  const previous = table.rowColorSoldTextAnchor || {};
  table.rowColorSoldTextAnchor = {
    soldNonWhiteCount: Math.max(Number(previous.soldNonWhiteCount || 0) || 0, soldNonWhiteCount),
    labels: uniqueCleanValues([...(Array.isArray(previous.labels) ? previous.labels : []), ...labels]),
  };
}

function removeSoldRowsFromTable(table) {
  rememberOpenCvSoldTextColorAnchors(table);
  const useLightSoldCleanup = table.lightReviewFlags && !hasOpenCvRowColorPreview(table);
  const removed = removeRowsFromTable(table, (row, rowIndex) =>
    useLightSoldCleanup
      ? row.some((cell) => isSoldText(cell, { strict: true })) || isNonTicketFooterRow(table, row)
      : isUnavailableTicket({ table, row, index: rowIndex }) || isNonTicketFooterRow(table, row),
  );
  if (removed) {
    if (table.lightReviewFlags) {
      markPendingTableReviewFlagsLightly(table);
    } else {
      updatePendingTableReviewFlags(table);
    }
  }
  return removed;
}

function removeSoldRowsEverywhere() {
  const publishedRemoved = events.reduce(
    (count, event) => count + event.tables.reduce((sum, table) => sum + removeSoldRowsFromTable(table), 0),
    0,
  );
  const pendingRemoved = pendingTables.reduce((count, table) => count + removeSoldRowsFromTable(table), 0);
  for (let index = pendingTables.length - 1; index >= 0; index -= 1) {
    if (!pendingTables[index].rows.length) pendingTables.splice(index, 1);
  }
  if (selectedPendingTableId && !pendingTables.some((table) => table.id === selectedPendingTableId)) {
    selectedPendingTableId = pendingTables.find((table) => table.eventId === currentEvent.id)?.id || null;
  }
  return publishedRemoved + pendingRemoved;
}

function cleanupPendingSoldRowsForCurrentEvent() {
  let changed = false;
  for (let index = pendingTables.length - 1; index >= 0; index -= 1) {
    const table = pendingTables[index];
    if (table.eventId !== currentEvent.id) continue;
    const removed = removeSoldRowsFromTable(table);
    if (removed) changed = true;
    if (!table.rows.length) {
      pendingTables.splice(index, 1);
      changed = true;
    }
  }
  if (selectedPendingTableId && !pendingTables.some((table) => table.id === selectedPendingTableId)) {
    selectedPendingTableId = pendingTables.find((table) => table.eventId === currentEvent.id)?.id || null;
    changed = true;
  }
  return changed;
}

function prepareTickets(tickets) {
  const availableTickets = tickets.filter((ticket) => !isUnavailableTicket(ticket));
  const filtered = selectedDateId ? availableTickets.filter((ticket) => dateMatchesTicket(ticket)) : availableTickets;
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
  const count = currentEvent.tables
    .flatMap((table) => table.rows.map((row, index) => ({ table, row, index })))
    .filter((ticket) => !isUnavailableTicket(ticket) && dateMatchesTicket(ticket)).length;
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
  const zoneRows = currentEvent.tables.flatMap((table) =>
      table.rows.filter((row, index) => !isUnavailableTicket({ table, row, index }) && zoneMatchesRow(row, zone, table)),
    );
    return total + zoneRows.length;
  }, 0);
}

function getSeatmapZoneTestKey(zone) {
  return String(zone?.id || zone?.label || "").trim().toLowerCase();
}

function getSeatmapTestProgress(event = currentEvent) {
  const zoneKeys = (event.zones || []).map(getSeatmapZoneTestKey).filter(Boolean);
  const uniqueZoneKeys = [...new Set(zoneKeys)];
  const tested = new Set(Array.isArray(event.seatmapTestedZoneIds) ? event.seatmapTestedZoneIds.map(String) : []);
  const testedCount = uniqueZoneKeys.filter((key) => tested.has(key)).length;
  const missingZones = (event.zones || []).filter((zone) => !tested.has(getSeatmapZoneTestKey(zone)));
  return {
    total: uniqueZoneKeys.length,
    testedCount,
    missingZones,
    uniqueZoneKeys: uniqueZoneKeys.map((key) => ({ key, label: (event.zones || []).find((zone) => getSeatmapZoneTestKey(zone) === key)?.label || key })),
    passed: uniqueZoneKeys.length > 0 && testedCount === uniqueZoneKeys.length && event.seatmapTestRequired !== true,
  };
}

function resetSeatmapTestStatus(reason = "座位图热区已更新，需要重新测试") {
  currentEvent.seatmapTestedZoneIds = [];
  currentEvent.seatmapTestedAt = "";
  currentEvent.seatmapTestRequired = true;
  currentEvent.seatmapTestReason = reason;
}

function resetSeatmapTestStatusForEvent(event, reason = "座位图热区已更新，需要重新测试") {
  if (!event) return;
  event.seatmapTestedZoneIds = [];
  event.seatmapTestedAt = "";
  event.seatmapTestRequired = true;
  event.seatmapTestReason = reason;
}

function markSeatmapZoneTested(zone) {
  if (!IS_ADMIN_PAGE) return;
  const key = getSeatmapZoneTestKey(zone);
  if (!key) return;
  const beforeProgress = getSeatmapTestProgress();
  currentEvent.seatmapTestedZoneIds = Array.isArray(currentEvent.seatmapTestedZoneIds) ? currentEvent.seatmapTestedZoneIds : [];
  const wasAlreadyTested = currentEvent.seatmapTestedZoneIds.includes(key);
  if (!wasAlreadyTested) currentEvent.seatmapTestedZoneIds.push(key);
  const progress = getSeatmapTestProgress();
  if (progress.total && progress.testedCount === progress.total) {
    currentEvent.seatmapTestRequired = false;
    currentEvent.seatmapTestedAt = new Date().toISOString();
    currentEvent.seatmapTestReason = "";
    seatmapStatus.textContent = `座位图热区已逐区测试通过：${progress.testedCount}/${progress.total}。现在可以发布票源。`;
    if (!beforeProgress.passed) showToast("座位图热区已全部测试通过。", "success");
  } else {
    currentEvent.seatmapTestRequired = true;
    seatmapStatus.textContent = `座位图测试中：已测 ${progress.testedCount}/${progress.total}，剩余 ${progress.missingZones.slice(0, 6).map((item) => item.label).join("、")}${progress.missingZones.length > 6 ? "…" : ""}`;
  }
  if (!wasAlreadyTested) {
    saveAndArchiveAppStep(`点击座位图热区：${currentEvent.name} · ${zone.label || key}`, "座位图测试");
  } else {
    scheduleAppStateSave(200);
  }
  renderAdminChecklist();
}

function markSeatmapTestComplete() {
  if (!IS_ADMIN_PAGE || !currentEvent) return;
  const uniqueZones = getSeatmapTestProgress().uniqueZoneKeys || [];
  if (!currentEvent.zones.length || !uniqueZones.length) {
    const message = "当前座位图还没有热区，不能确认测试完成。";
    seatmapStatus.textContent = message;
    showToast(message, "error");
    return;
  }
  currentEvent.seatmapTestedZoneIds = uniqueZones.map((item) => item.key);
  currentEvent.seatmapTestRequired = false;
  currentEvent.seatmapTestedAt = new Date().toISOString();
  currentEvent.seatmapTestReason = "";
  seatmapHotspotVisible = false;
  seatmapEditingZoneId = "";
  seatmapEditDraftPolygon = null;
  seatmapEditDragging = null;
  const progress = getSeatmapTestProgress();
  seatmapStatus.textContent = `座位图测试已确认完成：${progress.testedCount}/${progress.total}。后续上传/发布票源不会再弹出测试要求。`;
  zoneMarkingStatus.textContent = "座位图热区已确认可用。客户视角不会显示线框，只保留点击效果。";
  saveAndArchiveAppStep(`确认座位图测试完成：${currentEvent.name}`, "座位图测试");
  renderSeatmap();
  renderAdminChecklist();
  showToast("座位图测试已确认完成。", "success");
}

function requireSeatmapTestBeforePublish() {
  const progress = getSeatmapTestProgress();
  if (!currentEvent.zones.length) {
    const message = "当前座位图没有热区，不能发布票源。请先扫描/保存座位图热区。";
    setUploadStatus(message, "error");
    showToast(message, "error");
    return false;
  }
  if (!progress.passed) {
    const message = `座位图测试尚未点“确认测试完成”（${progress.testedCount}/${progress.total}），本次继续发布票源，不再自动弹出前台测试。`;
    setUploadStatus(message, "idle");
    showToast("座位图未确认测试完成，已继续发布票源。", "idle");
  }
  return true;
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
  const text = String(value || "")
    .replace(/[￥¥$€£₩,\s，]/g, "")
    .trim();
  const match = text.match(/\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : null;
}

function getColumnValue(ticket, names) {
  const index = ticket.table.columns.findIndex((column) => names.some((name) => normalize(column).includes(normalize(name))));
  return index >= 0 ? ticket.row[index] : "";
}

function findColumnIndexes(columns = [], names = []) {
  return columns
    .map((column, index) => ({ column, index }))
    .filter(({ column }) => names.some((name) => normalize(column).includes(normalize(name))))
    .map(({ index }) => index);
}

function findSalePriceColumnIndexes(columns = []) {
  return columns.map((column, index) => (isSalePriceColumnName(column) ? index : -1)).filter((index) => index >= 0);
}

function findPreferredSalePriceColumnIndexes(columns = []) {
  const indexes = findSalePriceColumnIndexes(columns);
  const explicitIndexes = indexes.filter((index) => isExplicitSalePriceColumnName(columns[index]));
  return explicitIndexes.length ? explicitIndexes : indexes;
}

function rowHasNumericSalePrice(table, row) {
  return findSalePriceColumnIndexes(table.columns || []).some((index) => isLikelySalePriceValue(row[index], { minPrice: 100 }));
}

function getTicketRowsForSalePrice(ticket) {
  const table = ticket?.table || {};
  const sources = [];
  const seenRows = new Set();
  const add = (row, columns) => {
    if (!Array.isArray(row) || seenRows.has(row)) return;
    seenRows.add(row);
    sources.push({ table: { ...table, columns: columns || table.columns || [] }, row });
  };
  add(ticket?.row, table.columns || []);
  const index = Number.isInteger(ticket?.index) ? ticket.index : -1;
  if (index >= 0) {
    add(Array.isArray(table.rows) ? table.rows[index] : null, table.columns || []);
    add(Array.isArray(table.originalRows) ? table.originalRows[index] : null, table.originalColumns || table.columns || []);
  }
  return sources;
}

function findRightmostSalePriceInRow(table, row) {
  if (!table || !Array.isArray(row)) return "";
  const columns = table.columns || [];
  for (let index = row.length - 1; index >= 0; index -= 1) {
    const value = String(row[index] || "").trim();
    const column = String(columns[index] || "").trim();
    if (!value || isInternalColorColumn(column) || isLikelyRowColorValue(value)) continue;
    if (isSoldText(value, { strict: true }) || isBusinessStatusRemarkValue(value) || isFaceValueColumnName(column)) continue;
    const hasCurrency = /[￥¥$€£₩]/.test(value);
    if (!hasCurrency && (isLikelyDateColumnValue(value) || isLikelyDateValue(value))) continue;
    const price = extractSalePriceText(value, { minPrice: hasCurrency ? 100 : 1000 });
    if (!price) continue;
    const trustedPriceColumn =
      isSalePriceColumnName(column) ||
      isGenericPriceColumnName(column) ||
      /售价|售價|价格|價格|单价|單價|报价|報價|金额|金額|price|ask/i.test(column);
    const trailingColumn = index >= Math.max(0, row.length - 3);
    const shiftedSeatmapPrice = isSeatmapImageColumnName(column) && trailingColumn && extractNumber(price) >= 1000;
    if (!hasCurrency && !trustedPriceColumn && !trailingColumn) continue;
    if (!hasCurrency && isProtectedNonPriceColumnName(column) && !trustedPriceColumn && !shiftedSeatmapPrice) continue;
    return price;
  }
  return "";
}

function getSalePriceFromRowSource(source) {
  const table = source?.table || {};
  const row = source?.row || [];
  const priceIndexes = findPreferredSalePriceColumnIndexes(table.columns || []);
  const numericIndex = priceIndexes.find((index) => extractSalePriceText(row[index], { minPrice: 100 }));
  if (numericIndex >= 0) return extractSalePriceText(row[numericIndex], { minPrice: 100 });
  const explicitCurrencyPrice = findExplicitCurrencySalePriceInRow(table, row);
  if (explicitCurrencyPrice) return explicitCurrencyPrice;
  const bestPrice = getBestSalePriceFromRow(table, row);
  if (bestPrice) return bestPrice;
  const rightmostPrice = findRightmostSalePriceInRow(table, row);
  if (rightmostPrice) return rightmostPrice;
  const index = priceIndexes[0];
  if (index < 0) return "";
  const value = row[index];
  if (isLikelyRowColorValue(value) || isSoldText(value, { strict: true }) || isBusinessStatusRemarkValue(value)) return "";
  return isLikelySalePriceValue(value, { minPrice: 100 }) ? extractSalePriceText(value, { minPrice: 100 }) || value : "";
}

function getTicketSalePriceValue(ticket) {
  return getTicketRowsForSalePrice(ticket).map(getSalePriceFromRowSource).find(Boolean) || "";
}

function getExplicitCurrencySalePriceFromTicket(ticket) {
  return getTicketRowsForSalePrice(ticket)
    .map((source) => findExplicitCurrencySalePriceInRow(source.table, source.row))
    .find(Boolean) || "";
}

function getExplicitCurrencySalePriceFromFields(fields = []) {
  return fields
    .map((field) => String(field?.value || ""))
    .map((value) => (isExplicitCurrencySalePrice(value) ? extractSalePriceText(value, { minPrice: 100 }) : ""))
    .find(Boolean) || "";
}

function getVisibleTicketSalePriceValue(ticket) {
  const directValue = getTicketSalePriceValue(ticket);
  if (directValue) return directValue;
  const fields = getOriginalTicketFields(ticket, { preserveOriginal: false });
  return (
    fields
      .map((field) => (isSalePriceColumnName(field.label) ? extractSalePriceText(field.value, { minPrice: 100 }) || field.value : ""))
      .find(Boolean) ||
    getExplicitCurrencySalePriceFromFields(fields) ||
    ""
  );
}

function findSalePriceColumnIndex(columns = []) {
  return findPreferredSalePriceColumnIndexes(columns)[0] ?? -1;
}

function ensureNamedColumn(table, columnName, aliases = [columnName]) {
  let index = findColumnIndex(table.columns, aliases);
  if (index >= 0) return index;
  table.columns.push(columnName);
  index = table.columns.length - 1;
  table.rows.forEach((row) => {
    while (row.length < table.columns.length) row.push("");
  });
  return index;
}

function ensureDedicatedColumn(table, columnName) {
  const target = normalize(columnName);
  let index = table.columns.findIndex((column) => normalize(column) === target);
  if (index >= 0) return index;
  table.columns.push(columnName);
  index = table.columns.length - 1;
  table.rows.forEach((row) => {
    while (row.length < table.columns.length) row.push("");
  });
  return index;
}

function ensureSalePriceColumn(table) {
  let priceIndex = findSalePriceColumnIndex(table.columns);
  if (priceIndex >= 0) return priceIndex;
  table.columns.push("售价");
  priceIndex = table.columns.length - 1;
  table.rows.forEach((row) => {
    while (row.length < table.columns.length) row.push("");
  });
  return priceIndex;
}

function findSeatNumberColumnIndexes(columns = []) {
  return findColumnIndexes(columns, ["票面号段", "门票号段", "座位号段", "座位号", "座位", "号数", "大小号", "号段", "号码", "座位/序号", "seat", "번호", "좌석번호"]).filter((index) => {
    const column = String(columns[index] || "");
    return !/座位图|座席图|seat\s*map|seatmap|map/i.test(column);
  });
}

function findSeatRowColumnIndexes(columns = []) {
  return findColumnIndexes(columns, ["票面排数", "门票排数", "座位排数", "票面位置", "门票位置", "座位位置", "排", "排数", "行", "行数", "row", "位置", "열"]).filter((index) => {
    const column = String(columns[index] || "");
    if (/票面排数|门票排数|座位排数|票面位置|门票位置|座位位置/i.test(column)) return true;
    return !/座位号|座号|号数|号段|号码|大小号|数量|张数|售价|价格|金额|区域|区|票面号段/i.test(column);
  });
}

function ensureSeatRowColumn(table) {
  const existingIndex = findSeatRowColumnIndexes(table.columns || [])[0];
  if (existingIndex >= 0) return existingIndex;
  return ensureNamedColumn(table, "排", ["排", "排数", "行", "行数", "row"]);
}

function ensureSeatNumberColumn(table) {
  const existingIndex = findSeatNumberColumnIndexes(table.columns || [])[0];
  if (existingIndex >= 0) return existingIndex;
  return ensureNamedColumn(table, "座位号", ["票面号段", "门票号段", "座位号段", "座位号", "号数", "大小号", "号段", "号码", "座位/序号", "seat", "번호", "좌석번호"]);
}

function ensureDateColumn(table) {
  return ensureNamedColumn(table, "日期", DATE_COLUMN_NAMES);
}

function hasTicketSalePrice(ticket) {
  const table = ticket?.table;
  const rowIndex = Number(ticket?.index);
  if (table && Number.isInteger(rowIndex) && Array.isArray(ticket.row)) {
    table._ticketSalePriceCache = table._ticketSalePriceCache || {};
    const cacheKey = `${rowIndex}:${(table.columns || []).join("\u0001")}:${ticket.row.join("\u0001")}`;
    if (Object.prototype.hasOwnProperty.call(table._ticketSalePriceCache, cacheKey)) return table._ticketSalePriceCache[cacheKey];
    const value = hasTicketSalePriceUncached(ticket);
    table._ticketSalePriceCache[cacheKey] = value;
    return value;
  }
  return hasTicketSalePriceUncached(ticket);
}

function hasTicketSalePriceUncached(ticket) {
  const value = String(getVisibleTicketSalePriceValue(ticket) || "").trim();
  const missingLike = !value || value === "/" || value === "-" || /^无$/i.test(value);
  if (!missingLike && !isSoldText(value, { strict: true }) && extractNumber(value) !== null) return true;
  return Boolean(getExplicitCurrencySalePriceFromTicket(ticket));
}

function getTicketRowPlainText(ticket) {
  return (ticket?.row || [])
    .map((cell) => String(cell || "").trim())
    .filter(Boolean)
    .join(" ");
}

function isPlaceholderOrSeparatorText(value) {
  const text = String(value || "").trim();
  if (!text) return false;
  return /(分割线|分隔线|日期分割|日期分隔|注意|须知|温馨提示|友情提示|说明行|表尾|表头)/i.test(text);
}

function isNonTicketPlaceholderRow(ticket) {
  if (!ticket?.table || !Array.isArray(ticket.row)) return true;
  const rowText = getTicketRowPlainText(ticket);
  if (!rowText) return true;
  if (isPlaceholderOrSeparatorText(rowText)) return true;
  const hasPrice = hasTicketSalePrice(ticket);
  if (!hasPrice) return true;
  return false;
}

function isEffectiveTicketRowForColorDecision(ticket) {
  const table = ticket?.table;
  const rowIndex = Number(ticket?.index);
  if (table && Number.isInteger(rowIndex) && rowIndex >= 0 && Array.isArray(ticket.row)) {
    table._rowColorEffectiveTicketCache = table._rowColorEffectiveTicketCache || {};
    const cacheKey = `${rowIndex}:${(table.columns || []).length}:${ticket.row.join("\u0001")}`;
    const cached = table._rowColorEffectiveTicketCache[rowIndex];
    if (cached?.key === cacheKey) return cached.value;
    const value = hasTicketSalePrice(ticket) && !isNonTicketPlaceholderRow(ticket);
    table._rowColorEffectiveTicketCache[rowIndex] = { key: cacheKey, value };
    return value;
  }
  return hasTicketSalePrice(ticket) && !isNonTicketPlaceholderRow(ticket);
}

function getFirstNonEmptyColumnValue(table, row, names) {
  const indexes = findColumnIndexes(table.columns || [], names);
  const index = indexes.find((item) => String(row[item] || "").trim());
  return index >= 0 ? row[index] : "";
}

function findCompositeSeatInfoInTicket(ticket) {
  if (!ticket?.table || !Array.isArray(ticket.row)) return null;
  const candidateSources = [
    { columns: ticket.table.columns || [], row: ticket.row, original: false },
    {
      columns: ticket.table.originalColumns || [],
      row: Array.isArray(ticket.table.originalRows) && ticket.table.originalRows[ticket.index] ? ticket.table.originalRows[ticket.index] : null,
      original: true,
    },
  ].filter((source) => Array.isArray(source.columns) && Array.isArray(source.row) && source.columns.length && source.row.length);
  const candidates = [];
  candidateSources.forEach((source) => {
    const { columns, row, original } = source;
  const ignoredIndexes = new Set([
    ...findColumnIndexes(columns, DATE_COLUMN_NAMES),
    ...findSalePriceColumnIndexes(columns),
    ...findColumnIndexes(columns, ["售价", "单价", "价格", "报价", "金额", "ask", "price"]),
    ...findColumnIndexes(columns, ["数量", "张数", "连坐", "qty", "count", "매수", "수량"]),
    ...findColumnIndexes(columns, ["状态", "售卖状态", "销售状态", "status", "是否售出", "售出"]),
  ]);
    row
    .map((value, index) => {
      const column = columns[index] || "";
      const parsed = parseCompositeSeatInfo(value);
      if (!parsed?.zone) return null;
      const ignoredPenalty = ignoredIndexes.has(index) && !(parsed.row || parsed.seat) ? 120 : ignoredIndexes.has(index) ? 15 : 0;
      const score =
        (/(位置|区域|区|區|block|section|zone|area|구역|구|seat|side|row|열|좌석)/i.test(column) ? 120 : 0) +
        (currentEvent?.zones?.some((zone) => zoneTokenMatches(parsed.zone, zone)) ? 80 : 0) +
        (parsed.row ? 35 : 0) +
        (parsed.seat ? 20 : 0) -
        ignoredPenalty +
        (original ? 8 : 0);
      return { parsed, score, index };
    })
    .filter(Boolean)
      .forEach((candidate) => candidates.push(candidate));
  });
  candidates.sort((a, b) => b.score - a.score || a.index - b.index);
  return candidates[0]?.score > 0 ? candidates[0].parsed : null;
}

function getTicketZoneValue(ticket) {
  const composite = findCompositeSeatInfoInTicket(ticket);
  if (composite?.zone) return composite.zone;
  return getLikelyZoneFromRow(ticket.table, ticket.row);
}

function getTicketRowValue(ticket) {
  const composite = findCompositeSeatInfoInTicket(ticket);
  if (composite?.row) return composite.row;
  const zoneValue = cleanZoneToken(getTicketZoneValue(ticket));
  const indexes = findSeatRowColumnIndexes(ticket.table.columns || []);
  const ranked = indexes
    .map((item) => {
      const value = ticket.row[item];
      const column = String(ticket.table.columns[item] || "");
      const parsed = extractSeatRowFromText(value, { allowBareRange: isSeatRowColumnName(column) });
      const text = String(value || "").trim();
      const score =
        (parsed ? 100 : 0) +
        (/^排$|^排数$|^row$/i.test(column) ? 60 : 0) +
        (/票面排数|门票排数|座位排数|票面位置|门票位置|座位位置/.test(column) ? 80 : 0) +
        (/[-到至]/.test(text) ? 70 : 0) +
        (/实际/.test(text) ? 8 : 0);
      return { index: item, value, column, parsed, score };
    })
    .filter(({ value, column, parsed }) => {
      const token = cleanZoneToken(value);
      const strongRowColumn = /^(排|排数|行|行数|row|열)$/i.test(column.trim()) || /票面排数|门票排数|座位排数|票面位置|门票位置|座位位置/.test(column);
      return (
        String(value || "").trim() &&
        token !== zoneValue &&
        (strongRowColumn || parsed || isLikelySeatRowValue(value)) &&
        (strongRowColumn || !isLikelyZoneCode(value)) &&
        !isLikelySalePriceValue(value)
      );
    })
    .sort((a, b) => b.score - a.score);
  const index = ranked[0]?.index ?? -1;
  if (index >= 0) return extractSeatRowFromText(ticket.row[index], { allowBareRange: isSeatRowColumnName(ticket.table.columns[index]) }) || ticket.row[index];
  const ignoredIndexes = new Set([
    ...findColumnIndexes(ticket.table.columns || [], DATE_COLUMN_NAMES),
    ...findColumnIndexes(ticket.table.columns || [], ["序号", "编号", "no", "number"]),
    ...findColumnIndexes(ticket.table.columns || [], ["数量", "张数", "连坐", "连坐数量", "count", "qty", "매수"]),
    ...findSeatNumberColumnIndexes(ticket.table.columns || []),
    ...findSalePriceColumnIndexes(ticket.table.columns || []),
  ]);
  const fallbackCandidates = ticket.row
    .map((value, itemIndex) => ({ value, itemIndex }))
    .filter(({ value, itemIndex }) => {
      const token = cleanZoneToken(value);
      const column = String(ticket.table.columns[itemIndex] || "");
      const strongRowColumn = /^(排|排数|行|行数|row|열)$/i.test(column.trim()) || /票面排数|门票排数|座位排数|票面位置|门票位置|座位位置/.test(column);
      return (
        !ignoredIndexes.has(itemIndex) &&
        token !== zoneValue &&
        (strongRowColumn || extractSeatRowFromText(value, { allowBareRange: isSeatRowColumnName(ticket.table.columns[itemIndex]) }) || isLikelySeatRowValue(value)) &&
        (strongRowColumn || !isLikelyZoneCode(value)) &&
        !isLikelySalePriceValue(value)
      );
    })
    .map((item) => ({
      ...item,
      score:
        (/票面排数|门票排数|座位排数|票面位置|门票位置|座位位置/.test(String(ticket.table.columns[item.itemIndex] || "")) ? 80 : 0) +
        (/[-到至]/.test(String(item.value || "")) ? 70 : 0),
    }))
    .sort((a, b) => b.score - a.score);
  const fallbackIndex = fallbackCandidates[0]?.itemIndex ?? -1;
  return fallbackIndex >= 0
    ? extractSeatRowFromText(ticket.row[fallbackIndex], { allowBareRange: isSeatRowColumnName(ticket.table.columns[fallbackIndex]) }) || ticket.row[fallbackIndex]
    : "";
}

function getTicketSeatValue(ticket) {
  const composite = findCompositeSeatInfoInTicket(ticket);
  if (composite?.seat) return composite.seat;
  const zoneValue = cleanZoneToken(getTicketZoneValue(ticket));
  const rowValue = String(getTicketRowValue(ticket) || "").trim();
  const indexes = findSeatNumberColumnIndexes(ticket.table.columns || []);
  const ranked = indexes
    .map((item) => {
      const value = ticket.row[item];
      const column = String(ticket.table.columns[item] || "");
      const parsed = extractSeatNumberFromText(value, { allowBareRange: isSeatNumberColumnName(column) });
      const text = String(value || "").trim();
      const score =
        (parsed ? 100 : 0) +
        (/座位号|座号|号段|号码/.test(column) ? 70 : 0) +
        (/票面号段|门票号段/.test(column) ? 80 : 0) +
        (/[-到至]/.test(text) ? 55 : 0);
      return { index: item, value, parsed, score };
    })
    .filter(({ value, parsed }) => {
      const token = cleanZoneToken(value);
      return (
        String(value || "").trim() &&
        token !== zoneValue &&
        String(value || "").trim() !== rowValue &&
        (parsed || isLikelySeatNumberValue(value)) &&
        !isLikelySalePriceValue(value)
      );
    })
    .sort((a, b) => b.score - a.score);
  const index = ranked[0]?.index ?? -1;
  if (index >= 0) return extractSeatNumberFromText(ticket.row[index], { allowBareRange: isSeatNumberColumnName(ticket.table.columns[index]) }) || ticket.row[index];
  return "";
}

function getTicketQuantityValue(ticket) {
  const sourceColumns = ticket.table.originalColumns || ticket.table.columns || [];
  const sourceQuantityIndex = findQuantityColumnIndex(sourceColumns);
  if (sourceQuantityIndex < 0) return "1";
  const originalRow = Array.isArray(ticket.table.originalRows) && ticket.table.originalRows[ticket.index] ? ticket.table.originalRows[ticket.index] : ticket.row;
  const value = originalRow[sourceQuantityIndex];
  return isLikelySeatCountValue(value) ? value : "1";
}

function getTicketPrimaryDateValue(ticket) {
  const values = getTicketDateValues(ticket);
  return values.find((value) => getDateKeysFromText(value).length) || "";
}

function getStandardTicketFields(ticket) {
  const date = getTicketPrimaryDateValue(ticket) || getFirstNonEmptyColumnValue(ticket.table, ticket.row, DATE_COLUMN_NAMES);
  const face = getFirstFaceValueFromTicket(ticket);
  const composite = findCompositeSeatInfoInTicket(ticket);
  const zone = getTicketZoneValue(ticket);
  const rowValue = getTicketRowValue(ticket);
  const seat = getTicketSeatValue(ticket);
  const quantity = getTicketQuantityValue(ticket);
  const salePrice = getTicketSalePriceValue(ticket);
  const rawNote = getFirstNonEmptyColumnValue(ticket.table, ticket.row, ["备注", "remark", "note", "说明"]);
  const fallbackNote = composite?.note || "";
  const note =
    salePrice && extractNumber(rawNote) === extractNumber(salePrice) && isLikelySalePriceValue(rawNote, { minPrice: 100 })
      ? ""
      : rawNote || fallbackNote;
  const visibleFace = String(face || "").trim() && extractNumber(face) !== extractNumber(salePrice) ? face : "";
  return [
    { label: "日期", value: date },
    { label: "票面", value: visibleFace },
    { label: "区域", value: zone },
    { label: "排", value: rowValue },
    { label: "座位号", value: seat },
    { label: "数量", value: quantity },
    { label: "售价", value: salePrice },
    { label: "备注", value: note },
  ].filter((field) => String(field.value || "").trim());
}

function getQuickManualDisplayColumns(table) {
  const preferredOrder = ["日期", "票面", "区域", "排", "座位号", "备注", "售价", "数量"];
  const labels = new Set();
  (table?.rows || []).slice(0, MAX_REVIEW_ROWS_RENDERED).forEach((row, index) => {
    getStandardTicketFields({ table, row, index }).forEach((field) => labels.add(field.label));
  });
  return preferredOrder.filter((label) => labels.has(label));
}

function getQuickManualDisplayRowCells(table, row, rowIndex, labels) {
  const fieldMap = new Map();
  getStandardTicketFields({ table, row, index: rowIndex }).forEach((field) => {
    if (!fieldMap.has(field.label)) fieldMap.set(field.label, String(field.value || "").trim());
  });
  return labels.map((label) => fieldMap.get(label) || "");
}

function valueMatchesCurrentSeatmapZone(value) {
  return Boolean(currentEvent?.zones?.some((zone) => zoneTokenMatches(value, zone)));
}

function normalizeOriginalDisplayFields(ticket, field, { preserveOriginal = true } = {}) {
  const label = String(field.label || "").trim();
  const value = String(field.value || "").trim();
  if (!label || !value) return [];
  const number = extractNumber(value);
  const salePrice = getTicketSalePriceValue(ticket);
  const saleNumber = extractNumber(salePrice);

  if (isInternalColorColumn(label)) return [];
  const explicitCurrencyPrice = /[￥¥$€£₩]/.test(value) ? extractSalePriceText(value, { minPrice: 100 }) : "";
  if (
    !preserveOriginal &&
    explicitCurrencyPrice &&
    !isSalePriceColumnName(label) &&
    !isFaceValueColumnName(label) &&
    !isLikelyDateColumnValue(value)
  ) {
    return [{ label: "售价", value: explicitCurrencyPrice }];
  }
  if (!preserveOriginal && /(区域|^区$|區|block|section|zone|area|구역|구)/i.test(label) && !isSalePriceColumnName(label)) {
    return [{ label: "区域", value: getZoneTokenFromCell(value) || value }];
  }
  if (!preserveOriginal && hasHeaderHint(label, ["date", "day", "일자", "날짜", "时间", "日期"])) {
    return [{ label: "日期", value }];
  }
  if (!preserveOriginal && isSalePriceColumnName(label)) {
    const price = extractSalePriceText(value, { minPrice: 100 }) || salePrice || value;
    if (isLogisticsOrRemarkValue(value) && !isLikelySalePriceValue(value, { minPrice: 100 })) return [{ label: "备注", value }];
    const hasExplicitSaleColumn = (ticket.table.columns || []).some((column) => isExplicitSalePriceColumnName(column));
    if (hasExplicitSaleColumn && isGenericPriceColumnName(label) && saleNumber !== null && number !== saleNumber) {
      return [{ label: "票面", value }];
    }
    return [{ label: "售价", value: price }];
  }

  const parsedComposite = parseCompositeSeatInfo(value);
  if (isFaceValueColumnName(label) && isGenericFaceValue(value) && !parsedComposite) {
    return [{ label: preserveOriginal ? label : "票面", value }];
  }
  if (!preserveOriginal && parsedComposite && (isSeatLocationColumnName(label) || isFaceValueColumnName(label) || /区域|区|block|section|zone|area|구역/i.test(label))) {
    return [
      parsedComposite.date ? { label: "日期", value: parsedComposite.date } : null,
      parsedComposite.zone ? { label: "区域", value: parsedComposite.zone } : null,
      parsedComposite.row ? { label: "排", value: parsedComposite.row } : null,
      parsedComposite.seat ? { label: "座位号", value: parsedComposite.seat } : null,
      parsedComposite.note ? { label: "备注", value: parsedComposite.note } : null,
    ].filter(Boolean);
  }

  if (isFaceValueColumnName(label) && (valueMatchesCurrentSeatmapZone(value) || parsedComposite)) {
    if (isGenericFaceValue(value) && !parsedComposite) return [{ label: preserveOriginal ? label : "票面", value }];
    if (preserveOriginal && parsedComposite) return [{ label, value }];
    return [{ label: "区域", value: getZoneTokenFromCell(value) || value }];
  }

  if (!preserveOriginal && isSeatRowColumnName(label)) {
    const rowValue = extractSeatRowFromText(value, { allowBareRange: true }) || value;
    return [{ label: "排", value: rowValue }];
  }
  if (!preserveOriginal && isSeatNumberColumnName(label)) {
    const seatValue = extractSeatNumberFromText(value, { allowBareRange: true }) || value;
    return [{ label: "座位号", value: seatValue }];
  }

  if ((/区域|区|位置|block|section|zone|area|구역/i.test(label) || normalize(label) === "票面") && !valueMatchesCurrentSeatmapZone(value)) {
    const parsedRow = extractSeatRowFromText(value, { allowBareRange: true, preferActual: false });
    if (!preserveOriginal && parsedRow && !isLikelyZoneCode(value)) return [{ label: "排", value: parsedRow }];
    if (!preserveOriginal && isLikelySeatRowValue(value) && !isLikelyZoneCode(value)) return [{ label: "排", value }];
  }

  if (
    !isSeatRowColumnName(label) &&
    /(位置|seat\s*position)/i.test(label) &&
    isLikelySeatNumberValue(value) &&
    !extractSeatRowFromText(value)
  ) {
    return [{ label: preserveOriginal ? label : "座位号", value }];
  }

  if (isQuantityColumnName(label) && !isLikelySeatCountValue(value)) {
    if (isLikelySalePriceValue(value, { minPrice: 100 }) || /[￥¥$€£₩]/.test(value) || (number !== null && number > 20)) {
      return [{ label: "售价", value: salePrice || extractSalePriceText(value, { minPrice: 100 }) || value }];
    }
    if (isLogisticsOrRemarkValue(value)) return [{ label: preserveOriginal ? label : "备注", value }];
    if (!preserveOriginal && isLikelySeatNumberValue(value)) return [{ label: "座位号", value }];
    return preserveOriginal ? [{ label, value }] : [];
  }

  if (isSeatPositionColumnName(label) && isLikelySalePriceValue(value, { minPrice: 100 }) && saleNumber !== null && number === saleNumber) {
    return [{ label: "售价", value: salePrice || value }];
  }

  if (isSalePriceColumnName(label) && isLogisticsOrRemarkValue(value) && !isLikelySalePriceValue(value, { minPrice: 100 })) {
    return [{ label: preserveOriginal ? label : "备注", value }];
  }

  if (!preserveOriginal && isRemarkColumnName(label) && isSalePriceCandidateValue(value)) {
    return [{ label: "售价", value: salePrice || extractSalePriceText(value, { minPrice: 100 }) || value }];
  }

  return [{ label, value }];
}

function normalizeOriginalDisplayField(ticket, field, options = {}) {
  return normalizeOriginalDisplayFields(ticket, field, options)[0] || null;
}

function getCanonicalDisplayFieldLabel(label = "") {
  const text = String(label || "");
  const normalized = normalize(text);
  if (!normalized) return "";
  if (hasHeaderHint(text, ["日期", "演出日期", "时间", "date", "day", "일자", "날짜", "시간"])) return "日期";
  if (isFaceValueColumnName(text)) return "票面";
  if (/(区域|^区$|區|block|section|zone|area|구역|구)/i.test(text)) return "区域";
  if (isSeatRowColumnName(text) || /^(排|排数|行|行数|row|열)$/i.test(text)) return "排";
  if (isSeatNumberColumnName(text)) return "座位号";
  if (isQuantityColumnName(text)) return "数量";
  if (isSalePriceColumnName(text)) return isGenericPriceColumnName(text) ? normalized : "售价";
  if (isRemarkColumnName(text)) return "备注";
  return normalized;
}

function dedupeTicketFields(fields = [], { canonical = false } = {}) {
  const seen = new Set();
  return fields.filter((field) => {
    const labelKey = canonical ? getCanonicalDisplayFieldLabel(field.label) : normalize(field.label);
    const key = `${labelKey}::${normalize(field.value)}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function isMisreadDataHeaderField(field = {}) {
  const label = String(field.label || "").trim();
  if (!label || isStrongRecognizedHeaderName(label)) return false;
  return isLikelyDataColumnName(label);
}

function displayLabelLooksLikeTicketData(label = "") {
  const text = String(label || "").trim();
  if (!text || isStrongRecognizedHeaderName(text)) return false;
  if (isLikelyDataColumnName(text)) return true;
  if (isLikelySerialValue(text)) return true;
  if (isLikelySalePriceValue(text, { minPrice: 100 })) return true;
  if (parseCompositeSeatInfo(text) || extractZoneTokenFromText(text) || isLikelyZoneCode(text)) return true;
  if (extractSeatRowFromText(text, { allowBareRange: true }) || isLikelySeatRowValue(text)) return true;
  if (extractSeatNumberFromText(text, { allowBareRange: true }) || isLikelySeatNumberValue(text)) return true;
  return false;
}

function displayPairLooksOffset(label = "", value = "") {
  const left = String(label || "").trim();
  const right = String(value || "").trim();
  if (!left || !right || isStrongRecognizedHeaderName(left)) return false;
  const leftComposite = parseCompositeSeatInfo(left);
  const rightComposite = parseCompositeSeatInfo(right);
  return (
    (isLikelySerialValue(left) && isLikelySerialValue(right)) ||
    ((isLikelyDateValue(left) || isLikelyDateColumnValue(left)) && (isLikelyDateValue(right) || isLikelyDateColumnValue(right))) ||
    (isLikelySalePriceValue(left, { minPrice: 100 }) && isLikelySalePriceValue(right, { minPrice: 100 })) ||
    ((leftComposite?.zone || extractZoneTokenFromText(left) || isLikelyZoneCode(left) || isGenericFaceValue(left)) &&
      (rightComposite?.zone || extractZoneTokenFromText(right) || isLikelyZoneCode(right) || isGenericFaceValue(right))) ||
    ((leftComposite?.row || extractSeatRowFromText(left, { allowBareRange: true }) || isLikelySeatRowValue(left)) &&
      (rightComposite?.row || extractSeatRowFromText(right, { allowBareRange: true }) || isLikelySeatRowValue(right))) ||
    ((leftComposite?.seat || extractSeatNumberFromText(left, { allowBareRange: true }) || isLikelySeatNumberValue(left)) &&
      (rightComposite?.seat || extractSeatNumberFromText(right, { allowBareRange: true }) || isLikelySeatNumberValue(right)))
  );
}

function originalDisplayFieldsLookOffset(fields = []) {
  const visibleFields = fields.filter(
    (field) => String(field?.label || "").trim() && String(field?.value || "").trim() && !isInternalColorColumn(field.label),
  );
  if (visibleFields.length < 2) return false;
  const strongLabelCount = visibleFields.filter((field) => isStrongRecognizedHeaderName(field.label)).length;
  const dataLabelCount = visibleFields.filter((field) => displayLabelLooksLikeTicketData(field.label)).length;
  const offsetPairCount = visibleFields.filter((field) => displayPairLooksOffset(field.label, field.value)).length;
  if (dataLabelCount >= Math.max(2, strongLabelCount + 1)) return true;
  if (offsetPairCount >= 2) return true;
  if (dataLabelCount >= 1 && offsetPairCount >= 2) return true;
  if (strongLabelCount === 0 && dataLabelCount >= 1 && offsetPairCount >= 1) return true;
  return dataLabelCount >= 2 && offsetPairCount >= 1;
}

function shouldUseOriginalTableDisplay(table) {
  if (!Array.isArray(table?.originalColumns) || !Array.isArray(table.originalRows)) return false;
  if (table._forceCanonicalDisplay) return false;
  if (hasMisreadDataHeaderColumns(table.originalColumns, table.originalRows)) return false;
  const sampleFields = table.originalRows.slice(0, 5).flatMap((row) =>
    table.originalColumns.map((column, columnIndex) => ({
      label: String(column || "").trim(),
      value: String(row?.[columnIndex] || "").trim(),
    })),
  );
  return !originalDisplayFieldsLookOffset(sampleFields);
}

function forceCanonicalOriginalDisplay(table) {
  if (!table || !Array.isArray(table.columns) || !Array.isArray(table.rows)) return table;
  table.originalColumns = [...table.columns];
  table.originalRows = cloneRows(table.rows);
  table._forceCanonicalDisplay = true;
  return table;
}

function getOriginalTicketFields(ticket, options = {}) {
  repairMisreadDataHeaderTable(ticket?.table);
  if (!ticket?.table) return [];
  const preserveOriginal = options.preserveOriginal !== false;
  const columns = preserveOriginal ? ticket.table.originalColumns || ticket.table.columns || [] : ticket.table.columns || ticket.table.originalColumns || [];
  if (preserveOriginal && hasMisreadDataHeaderColumns(columns, ticket.table.originalRows || ticket.table.rows)) {
    return getOriginalTicketFields(ticket, { ...options, preserveOriginal: false });
  }
  const originalRow =
    preserveOriginal && Array.isArray(ticket.table.originalRows) && ticket.table.originalRows[ticket.index]
      ? ticket.table.originalRows[ticket.index]
      : Array.isArray(ticket.table.rows) && ticket.table.rows[ticket.index]
        ? ticket.table.rows[ticket.index]
        : ticket.row || [];
  if (preserveOriginal) {
    const originalFields = columns
      .map((column, columnIndex) => ({
        label: String(column || "").trim(),
        value: String(originalRow[columnIndex] || "").trim(),
      }))
      .filter((field) => field.label && field.value)
      .filter((field) => !isInternalColorColumn(field.label));
    if (originalDisplayFieldsLookOffset(originalFields)) {
      return getOriginalTicketFields(ticket, { ...options, preserveOriginal: false });
    }
    return dedupeTicketFields(
      originalFields.filter((field) => !isMisreadDataHeaderField(field) && !displayLabelLooksLikeTicketData(field.label)),
    );
  }
  const salePrice = getTicketSalePriceValue(ticket);
  const saleNumber = extractNumber(salePrice);
  let movedPriceFromQuantity = false;
  let movedPriceValue = salePrice;
  const fields = columns
    .map((column, columnIndex) => ({
      label: String(column || "").trim(),
      value: String(originalRow[columnIndex] || "").trim(),
    }))
    .filter((field) => field.value)
    .filter((field) => {
      const number = extractNumber(field.value);
      if (isQuantityColumnName(field.label) && saleNumber !== null && number === saleNumber && !isLikelySeatCountValue(field.value)) {
        movedPriceFromQuantity = true;
        movedPriceValue = salePrice || extractSalePriceText(field.value, { minPrice: 100 }) || field.value;
        return false;
      }
      if (isQuantityColumnName(field.label) && field.value && !isLikelySeatCountValue(field.value)) {
        const priceLikeQuantity = isLikelySalePriceValue(field.value, { minPrice: 100 }) || /[￥¥$€£₩]/.test(field.value) || (number !== null && number > 20);
        if (priceLikeQuantity) {
          movedPriceFromQuantity = true;
          movedPriceValue = salePrice || extractSalePriceText(field.value, { minPrice: 100 }) || field.value;
          return false;
        }
      }
      if (isSeatPositionColumnName(field.label) && isLikelySalePriceValue(field.value, { minPrice: 100 }) && saleNumber !== null && number === saleNumber) {
        return false;
      }
      return true;
    })
    .flatMap((field) => normalizeOriginalDisplayFields(ticket, field, options))
    .filter(Boolean);
  const fallbackSalePriceValue = movedPriceValue || salePrice;
  const cleanedFields = fields.filter((field) => !isMisreadDataHeaderField(field) && !displayLabelLooksLikeTicketData(field.label));
  const visibleSalePriceField = cleanedFields.find((field) => isSalePriceColumnName(field.label));
  const visibleSalePriceIsNumeric = visibleSalePriceField
    ? Boolean(extractSalePriceText(visibleSalePriceField.value, { minPrice: 100 }))
    : false;
  if (visibleSalePriceField && fallbackSalePriceValue && !visibleSalePriceIsNumeric) {
    visibleSalePriceField.value = fallbackSalePriceValue;
  }
  const hasVisibleSalePrice = cleanedFields.some(
    (field) => isSalePriceColumnName(field.label) && extractSalePriceText(field.value, { minPrice: 100 }),
  );
  if ((movedPriceFromQuantity || salePrice) && fallbackSalePriceValue && !hasVisibleSalePrice) {
    cleanedFields.push({ label: "售价", value: fallbackSalePriceValue });
  }
  const hasVisibleQuantity = cleanedFields.some((field) => isQuantityColumnName(field.label));
  const quantityValue = getTicketQuantityValue(ticket);
  if (!hasVisibleQuantity && quantityValue) {
    cleanedFields.push({ label: "数量", value: quantityValue });
  }
  return dedupeTicketFields(cleanedFields, { canonical: true });
}

function getTicketPrice(ticket) {
  const directValue = getTicketSalePriceValue(ticket);
  const directNumber = extractNumber(directValue);
  if (directNumber) return directNumber;

  const candidateNumber = extractNumber(getSalePriceCandidateFromRow(ticket.table, ticket.row)?.price);
  return candidateNumber || 999999;
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

function isGuideOnlySeatmapZone(zone) {
  const id = String(zone?.id || "").toLowerCase();
  const label = String(zone?.label || "");
  return id.startsWith("wc-") || /^轮椅席\s/.test(label);
}

function removeGuideOnlySeatmapZones(event) {
  if (!Array.isArray(event?.zones)) return 0;
  const before = event.zones.length;
  event.zones = event.zones.filter((zone) => !isGuideOnlySeatmapZone(zone));
  return before - event.zones.length;
}

function syncBuiltInSeatmapTemplate(event) {
  if (!event?.seatmapTemplateId) return false;
  if (isSeatmapTemplateAutoDisabled(event.seatmapTemplateId)) {
    const hadTemplateZones = Array.isArray(event.zones) && event.zones.some((zone) => /template/.test(String(zone?.source || "")));
    event.seatmapTemplateId = "";
    event.seatmapFingerprint = "";
    if (hadTemplateZones) {
      event.zones = event.zones.filter((zone) => !/template/.test(String(zone?.source || "")));
      resetSeatmapTestStatusForEvent(event, "已停用错位座位图模板，请重新扫描/保存热区并逐区测试");
    }
    return true;
  }
  const template = getAllSeatmapTemplates().find((item) => item.builtIn && item.id === event.seatmapTemplateId);
  if (!template) return false;
  if (template.id === "builtin-bigbang-goyang" && event.id !== "bigbang-goyang") return false;
  if (Array.isArray(event.zones) && event.zones.length) return false;
  event.seatmapImage = getTemplateSeatmapImage(template) || event.seatmapImage;
  event.seatmapFileName = template.seatmapFileName || template.fileName || event.seatmapFileName;
  event.seatmapSize = { ...template.size };
  event.seatmapFingerprint = template.fingerprint || event.seatmapFingerprint || "";
  event.zones = getTemplateZonesForSize(template, event.seatmapSize);
  return true;
}

function repairKnownEventTemplateMismatch(event) {
  if (event?.id === "exo-encore") {
    const zones = createExoEncoreTemplateZones();
    const needsExoTemplate =
      event.seatmapImage !== "assets/exo-encore-seatmap.jpg" ||
      event.seatmapTemplateId !== "builtin-exo-encore" ||
      event.seatmapSize?.width !== 980 ||
      event.seatmapSize?.height !== 854 ||
      !Array.isArray(event.zones) ||
      event.zones.length !== zones.length;
    if (!needsExoTemplate) return false;
    event.seatmapTemplateId = "builtin-exo-encore";
    event.seatmapImage = "assets/exo-encore-seatmap.jpg";
    event.seatmapFileName = "exo-encore-seatmap.jpg";
    event.seatmapSize = { width: 980, height: 854 };
    event.seatmapTitle = "EXO 安可官方座位图";
    event.zones = zones;
    resetSeatmapTestStatusForEvent(event, "EXO 安可座位图分层热区已更新，需要逐区测试");
    return true;
  }
  if (event?.id === "weeknd-goyang") {
    const zones = createWeekndGoyangTemplateZones();
    const needsWeekndTemplate =
      event.seatmapImage !== "assets/weeknd-goyang-seatmap.jpg" ||
      event.seatmapTemplateId !== "builtin-weeknd-goyang" ||
      event.seatmapSize?.width !== 1193 ||
      event.seatmapSize?.height !== 1590 ||
      !Array.isArray(event.zones) ||
      event.zones.length !== zones.length;
    if (!needsWeekndTemplate) return false;
    event.seatmapTemplateId = "builtin-weeknd-goyang";
    event.seatmapImage = "assets/weeknd-goyang-seatmap.jpg";
    event.seatmapFileName = "weeknd-goyang-seatmap.jpg";
    event.seatmapSize = { width: 1193, height: 1590 };
    event.seatmapTitle = "盆栽高阳官方座位图";
    event.zones = zones;
    resetSeatmapTestStatusForEvent(event, "盆栽高阳座位图分层热区已更新，需要逐区测试");
    return true;
  }
  if (!event || event.id !== "bigbang-singapore") return false;
  const hasGoyangTemplate = event.seatmapTemplateId === "builtin-bigbang-goyang" || String(event.seatmapImage || "").includes("bigbang-goyang-seatmap");
  const needsSingaporeTemplate =
    !event.seatmapTemplateId ||
    event.seatmapTemplateId === "builtin-bigbang-singapore" ||
    hasGoyangTemplate ||
    !Array.isArray(event.zones) ||
    !event.zones.length;
  if (!needsSingaporeTemplate) return false;
  event.seatmapTemplateId = "builtin-bigbang-singapore";
  event.seatmapImage = "assets/bigbang-singapore-seatmap.jpg";
  event.seatmapFileName = "bigbang-singapore-seatmap.jpg";
  event.seatmapSize = { width: 1206, height: 1181 };
  event.seatmapFingerprint = "";
  event.seatmapTitle = "BIGBANG 新加坡官方座位图";
  event.zones = [];
  return true;
}

function syncKnownExternalSeatmapTemplate(event) {
  if (!event || event.id !== "bigbang-goyang") return false;
  const template = getAllSeatmapTemplates().find((item) => item.id === "builtin-bigbang-goyang");
  if (!template) return false;
  const templateImage = getTemplateSeatmapImage(template);
  const alreadySynced =
    event.seatmapTemplateId === template.id &&
    event.seatmapImage === templateImage &&
    event.seatmapSize?.width === template.size.width &&
    event.seatmapSize?.height === template.size.height &&
    Array.isArray(event.zones) &&
    event.zones.length === template.zones.length;
  if (alreadySynced) return false;
  event.seatmapTemplateId = template.id;
  event.seatmapImage = templateImage || event.seatmapImage;
  event.seatmapFileName = template.seatmapFileName || template.fileName || event.seatmapFileName;
  event.seatmapSize = { ...template.size };
  event.seatmapFingerprint = template.fingerprint || event.seatmapFingerprint || "";
  event.seatmapTitle = `${event.name}官方座位图`;
  event.zones = getTemplateZonesForSize(template, event.seatmapSize);
  return true;
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
  return getZoneAtPoint(point);
}

function getZoneFromTarget(target) {
  const hotspot = target.closest("[data-zone-id]");
  if (!hotspot) return null;
  const zoneId = String(hotspot.dataset.zoneId || "").toLowerCase();
  return currentEvent.zones.find((zone) => String(zone.id).toLowerCase() === zoneId) || null;
}

function getZoneForSeatmapEvent(event, seatmap) {
  const targetZone = getZoneFromTarget(event.target);
  if (targetZone) return targetZone;
  return getZoneForPointer(event, seatmap);
}

window.ticketSeatmapDebug = {
  getZones() {
    return currentEvent.zones.map((zone) => ({
      id: zone.id,
      label: zone.label,
      polygon: zone.polygon.map((point) => [...point]),
    }));
  },
  getZoneAtCoordinate(x, y) {
    const zone = getZoneAtPoint({ x, y });
    return zone ? { id: zone.id, label: zone.label } : null;
  },
};

function getPolygonPoints(polygon) {
  return polygon.map(([x, y]) => `${x},${y}`).join(" ");
}

function clonePolygonPoints(polygon) {
  return Array.isArray(polygon) ? polygon.map(([x, y]) => [Number(x), Number(y)]) : [];
}

function getSeatmapZoneById(zoneId) {
  return currentEvent.zones.find((zone) => String(zone.id) === String(zoneId)) || null;
}

function getSeatmapHotspotElement(zoneId) {
  return Array.from(seatmapFrame.querySelectorAll(".seatmap-hotspot")).find(
    (hotspot) => hotspot.dataset.zoneId === String(zoneId),
  );
}

function getSeatmapEditingZone() {
  return seatmapEditingZoneId ? getSeatmapZoneById(seatmapEditingZoneId) : null;
}

function getSeatmapEditPolygon() {
  const zone = getSeatmapEditingZone();
  if (!zone) return [];
  return seatmapEditDraftPolygon || clonePolygonPoints(zone.polygon);
}

function clampSeatmapPoint(point) {
  const { width, height } = currentEvent.seatmapSize;
  return {
    x: Math.max(0, Math.min(width, point.x)),
    y: Math.max(0, Math.min(height, point.y)),
  };
}

function getSeatmapEditBox(polygon) {
  const bounds = getPolygonBounds(polygon);
  return {
    left: bounds.minX,
    top: bounds.minY,
    right: bounds.maxX,
    bottom: bounds.maxY,
    width: bounds.maxX - bounds.minX,
    height: bounds.maxY - bounds.minY,
    centerX: (bounds.minX + bounds.maxX) / 2,
    centerY: (bounds.minY + bounds.maxY) / 2,
  };
}

function transformSeatmapPolygon(polygon, fromBox, toBox) {
  const safeWidth = fromBox.width || 1;
  const safeHeight = fromBox.height || 1;
  return polygon.map(([x, y]) => {
    const nx = (x - fromBox.left) / safeWidth;
    const ny = (y - fromBox.top) / safeHeight;
    const point = clampSeatmapPoint({
      x: toBox.left + nx * toBox.width,
      y: toBox.top + ny * toBox.height,
    });
    return [Math.round(point.x), Math.round(point.y)];
  });
}

function buildSeatmapResizeBox(startBox, point, handle) {
  const minSize = 10;
  let { left, top, right, bottom } = startBox;
  if (handle.includes("w")) left = Math.min(point.x, right - minSize);
  if (handle.includes("e")) right = Math.max(point.x, left + minSize);
  if (handle.includes("n")) top = Math.min(point.y, bottom - minSize);
  if (handle.includes("s")) bottom = Math.max(point.y, top + minSize);
  return {
    left,
    top,
    right,
    bottom,
    width: right - left,
    height: bottom - top,
  };
}

function getSeatmapEditPoint(event) {
  const seatmap = event.target.closest(".seatmap-stage") || seatmapFrame.querySelector(".seatmap-stage");
  return seatmap ? getSeatmapPoint(event, seatmap) : null;
}

function renderSeatmapEditControls() {
  const zone = getSeatmapEditingZone();
  const polygon = getSeatmapEditPolygon();
  if (!zone || !polygon.length) return "";
  const box = getSeatmapEditBox(polygon);
  const handles = [
    ["nw", box.left, box.top],
    ["n", box.centerX, box.top],
    ["ne", box.right, box.top],
    ["e", box.right, box.centerY],
    ["se", box.right, box.bottom],
    ["s", box.centerX, box.bottom],
    ["sw", box.left, box.bottom],
    ["w", box.left, box.centerY],
  ]
    .map(
      ([handle, x, y]) => `
        <rect
          class="seatmap-edit-control seatmap-edit-resize-handle seatmap-edit-resize-${handle}"
          x="${x - 8}"
          y="${y - 8}"
          width="16"
          height="16"
          rx="3"
          data-seatmap-edit-action="resize"
          data-seatmap-edit-handle="${handle}"
        />
      `,
    )
    .join("");
  const points = polygon
    .map(
      ([x, y], index) => `
        <circle
          class="seatmap-edit-control seatmap-edit-point-handle"
          cx="${x}"
          cy="${y}"
          r="7"
          data-seatmap-edit-action="point"
          data-seatmap-edit-point="${index}"
        />
      `,
    )
    .join("");
  return `
    <g id="seatmapEditControls" class="seatmap-edit-controls" data-zone-id="${zone.id}">
      <polygon class="seatmap-edit-outline" points="${getPolygonPoints(polygon)}" />
      <rect
        class="seatmap-edit-frame"
        x="${box.left}"
        y="${box.top}"
        width="${box.width}"
        height="${box.height}"
        rx="3"
      />
      <circle
        class="seatmap-edit-control seatmap-edit-move-handle"
        cx="${box.centerX}"
        cy="${box.centerY}"
        r="13"
        data-seatmap-edit-action="move"
      />
      ${handles}
      ${points}
    </g>
  `;
}

function updateSeatmapEditDom() {
  const zone = getSeatmapEditingZone();
  const polygon = getSeatmapEditPolygon();
  if (!zone || !polygon.length) return;
  const hotspot = getSeatmapHotspotElement(zone.id);
  if (hotspot) {
    hotspot.setAttribute("points", getPolygonPoints(polygon));
  }
  const controls = seatmapFrame.querySelector("#seatmapEditControls");
  if (controls) {
    const wrapper = document.createElementNS("http://www.w3.org/2000/svg", "g");
    wrapper.innerHTML = renderSeatmapEditControls();
    const nextControls = wrapper.firstElementChild;
    if (nextControls) controls.replaceWith(nextControls);
  }
}

function renderSeatmapAdminTools() {
  const tools = seatmapFrame.querySelector("#seatmapAdminTools");
  if (!tools || !IS_ADMIN_PAGE) return;
  const editingZone = getSeatmapEditingZone();
  const canEditSelected = selectedZone && currentEvent.zones.some((zone) => zone.id === selectedZone.id);
  const progress = getSeatmapTestProgress();
  tools.innerHTML = `
    <div class="seatmap-tool-copy">
      <strong>座位图热区校准</strong>
      <span>${
        editingZone
          ? `正在修改 ${editingZone.label}，可拖动边框、角点或多边形顶点。`
          : progress.passed
            ? `已确认测试完成：${progress.testedCount}/${progress.total}，后续发布票源不会再要求测试。`
          : seatmapHotspotVisible
            ? "已显示全部热区，先点击要检查的区域，再点“修改选中热区”。"
            : "客户视角不会显示热区线框，只保留点击效果。"
      }</span>
    </div>
    <div class="seatmap-tool-actions">
      <button type="button" class="secondary-button" data-seatmap-tool="show-hotspots">显示全部热区</button>
      <button type="button" class="secondary-button" data-seatmap-tool="customer-test">客户视角测试</button>
      <button type="button" class="primary-button compact" data-seatmap-tool="confirm-tested" ${currentEvent.zones.length ? "" : "disabled"}>
        ${progress.passed ? "已确认测试完成" : "确认测试完成"}
      </button>
      <button type="button" class="secondary-button" data-seatmap-tool="edit-selected" ${canEditSelected || editingZone ? "" : "disabled"}>
        ${editingZone ? `继续修改 ${editingZone.label}` : canEditSelected ? `修改 ${selectedZone.label} 热区` : "先点一个区域再修改"}
      </button>
      ${
        editingZone
          ? `
            <button type="button" class="primary-button compact" data-seatmap-tool="save-edit">保存这个热区</button>
            <button type="button" class="secondary-button" data-seatmap-tool="cancel-edit">取消修改</button>
          `
          : ""
      }
    </div>
  `;
}

function showSeatmapHotspots() {
  seatmapHotspotVisible = true;
  renderSeatmap();
  showToast("已显示全部热区，可以点击检查或修改。", "success");
}

function showSeatmapCustomerTest() {
  seatmapHotspotVisible = false;
  seatmapEditingZoneId = "";
  seatmapEditDraftPolygon = null;
  seatmapEditDragging = null;
  renderSeatmap();
  showToast("已切到客户视角：热区线框隐藏，只测试点击结果。", "success");
}

function startSeatmapHotspotEdit(zoneId = selectedZone?.id) {
  const zone = getSeatmapZoneById(zoneId);
  if (!zone) {
    showToast("请先点击一个要修改的区域。", "error");
    return;
  }
  seatmapHotspotVisible = true;
  seatmapEditingZoneId = zone.id;
  seatmapEditDraftPolygon = clonePolygonPoints(zone.polygon);
  seatmapEditDragging = null;
  selectedZone = zone;
  renderSeatmap();
  zoneMarkingStatus.textContent = `正在修改 ${zone.label} 热区：可拖边、拖角、拖点，保存后再用客户视角测试。`;
  showToast(`正在修改 ${zone.label} 热区。`, "success");
}

function cancelSeatmapHotspotEdit() {
  const zone = getSeatmapEditingZone();
  seatmapEditingZoneId = "";
  seatmapEditDraftPolygon = null;
  seatmapEditDragging = null;
  renderSeatmap();
  showToast(zone ? `已取消修改 ${zone.label}。` : "已取消修改。", "idle");
}

async function saveSeatmapHotspotEdit() {
  const zone = getSeatmapEditingZone();
  const polygon = getSeatmapEditPolygon();
  if (!zone || !polygon.length) {
    showToast("没有正在修改的热区。", "error");
    return;
  }
  zone.polygon = clonePolygonPoints(polygon);
  if (!Array.isArray(zone.aliases) || !zone.aliases.length) zone.aliases = [zone.label];
  resetSeatmapTestStatus(`已修改 ${zone.label} 热区，需要重新测试`);
  selectedZone = null;
  hoveredZone = null;
  seatmapHotspotVisible = false;
  seatmapEditingZoneId = "";
  seatmapEditDraftPolygon = null;
  seatmapEditDragging = null;
  const template = await saveCurrentSeatmapAsTemplate(true);
  zoneMarkingStatus.textContent = template
    ? `已保存 ${zone.label} 热区，并更新模板“${template.name}”。现在是客户视角，请重新点击验证。`
    : `已保存 ${zone.label} 热区。现在是客户视角，请重新点击验证。`;
  saveAndArchiveAppStep(`修改座位图热区：${currentEvent.name} · ${zone.label}`, "座位图");
  renderSeatmapMarkers();
  renderAdminEvent();
  render();
  setMode("customer");
  seatmapFrame.scrollIntoView({ behavior: "smooth", block: "center" });
  showToast("热区已保存，已切到客户视角测试。", "success");
}

function handleSeatmapEditPointerDown(event) {
  const control = event.target.closest(".seatmap-edit-control");
  if (!control || !seatmapEditingZoneId || !seatmapEditDraftPolygon) return;
  const point = getSeatmapEditPoint(event);
  if (!point) return;
  event.preventDefault();
  event.stopPropagation();
  const action = control.dataset.seatmapEditAction;
  seatmapEditDragging = {
    action,
    handle: control.dataset.seatmapEditHandle || "",
    pointIndex: Number(control.dataset.seatmapEditPoint),
    startPoint: point,
    startPolygon: clonePolygonPoints(seatmapEditDraftPolygon),
    startBox: getSeatmapEditBox(seatmapEditDraftPolygon),
  };
}

function handleSeatmapEditPointerMove(event) {
  if (!seatmapEditDragging || !seatmapEditDraftPolygon) return;
  const point = getSeatmapEditPoint(event);
  if (!point) return;
  event.preventDefault();
  const drag = seatmapEditDragging;
  const nextPoint = clampSeatmapPoint(point);
  if (drag.action === "move") {
    const dx = nextPoint.x - drag.startPoint.x;
    const dy = nextPoint.y - drag.startPoint.y;
    seatmapEditDraftPolygon = drag.startPolygon.map(([x, y]) => {
      const moved = clampSeatmapPoint({ x: x + dx, y: y + dy });
      return [Math.round(moved.x), Math.round(moved.y)];
    });
  } else if (drag.action === "resize") {
    const nextBox = buildSeatmapResizeBox(drag.startBox, nextPoint, drag.handle);
    seatmapEditDraftPolygon = transformSeatmapPolygon(drag.startPolygon, drag.startBox, nextBox);
  } else if (drag.action === "point" && Number.isInteger(drag.pointIndex)) {
    seatmapEditDraftPolygon = drag.startPolygon.map((item, index) =>
      index === drag.pointIndex ? [Math.round(nextPoint.x), Math.round(nextPoint.y)] : item,
    );
  }
  updateSeatmapEditDom();
}

function handleSeatmapEditPointerEnd() {
  seatmapEditDragging = null;
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
  markSeatmapZoneTested(zone);
  if (window.ticketSeatmapDebug?.enabled !== false) {
    console.info("[seatmap-click-debug] select-zone", JSON.stringify({
      eventId: currentEvent?.id,
      zoneId: zone?.id || "",
      zoneLabel: zone?.label || "",
      ...getSelectedDateDebugInfo(),
    }));
  }
  updateSeatmapHotspots();
  renderSeatmapAdminTools();
  renderZoneDrawer();
  zoneDrawer.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function bindSeatmapHotspotEvents() {
  seatmapFrame.querySelectorAll(".seatmap-hotspot").forEach((hotspot) => {
    hotspot.addEventListener("click", (event) => {
      const zone = getZoneFromTarget(event.currentTarget);
      if (!zone) return;
      event.preventDefault();
      event.stopPropagation();
      selectZone(zone);
    });
  });
}

function renderSeatmap() {
  const { width, height } = currentEvent.seatmapSize;
  seatmapFrame.innerHTML = `
    <div class="seatmap-stage ${seatmapHotspotVisible ? "show-seatmap-hotspots" : ""} ${seatmapEditingZoneId ? "editing-seatmap-hotspot" : ""}" style="aspect-ratio: ${width} / ${height};">
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
          .map((zone) => {
            const isEditing = zone.id === seatmapEditingZoneId;
            const polygon = isEditing && seatmapEditDraftPolygon ? seatmapEditDraftPolygon : zone.polygon;
            return `
              <polygon
                class="seatmap-hotspot ${isEditing ? "editing" : ""}"
                points="${getPolygonPoints(polygon)}"
                data-zone-id="${zone.id}"
                pointer-events="all"
                tabindex="0"
                role="button"
                aria-label="${zone.label}"
              />
            `;
          })
          .join("")}
        ${renderSeatmapEditControls()}
      </svg>
      ${
        currentEvent.zones.length
          ? ""
          : `<div class="seatmap-empty-hint">这张座位图还没有配置可点击区域，请在后台标注区域后再测试。</div>`
      }
      <div class="seatmap-hover-card hidden" id="seatmapHoverCard"></div>
    </div>
    ${IS_ADMIN_PAGE ? `<div class="seatmap-test-tools" id="seatmapAdminTools"></div>` : ""}
  `;
  bindSeatmapHotspotEvents();
  rebuildSeatmapPixelSampler();
  updateSeatmapHotspots();
  renderSeatmapAdminTools();
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

function getCleanSourceName(table) {
  const rawName = String(table.sourceFileName || table.sourceName || table.title || "表格来源")
    .replace(/\s*·\s*第\s*\d+\s*页\/表\s*$/i, "")
    .trim();
  return shortenFileName(decodePossiblyEncodedFileName(rawName), 34);
}

function decodePossiblyEncodedFileName(value = "") {
  let decoded = String(value || "");
  for (let index = 0; index < 2; index += 1) {
    try {
      const next = decodeURIComponent(decoded);
      if (next === decoded) break;
      decoded = next;
    } catch {
      break;
    }
  }
  return decoded;
}

function shortenFileName(value = "", maxLength = 38) {
  const text = String(value || "").trim();
  if (text.length <= maxLength) return text;
  const extensionMatch = text.match(/(\.[a-z0-9]{2,8})$/i);
  const extension = extensionMatch?.[1] || "";
  const body = extension ? text.slice(0, -extension.length) : text;
  const available = Math.max(12, maxLength - extension.length - 1);
  const headLength = Math.ceil(available * 0.58);
  const tailLength = Math.max(4, available - headLength);
  return `${body.slice(0, headLength)}…${body.slice(-tailLength)}${extension}`;
}

function getSelectedFileDisplayName(fileName = "") {
  return shortenFileName(decodePossiblyEncodedFileName(fileName), 42);
}

function isPdfTableSource(table) {
  const source = `${table.originalType || ""} ${table.originalImage || ""} ${table.sourceName || ""} ${table.sourceFileName || ""}`.toLowerCase();
  return source.includes("application/pdf") || source.includes(".pdf");
}

function getTablePageText(table) {
  const page = Number(table.sourcePage || 0);
  if (page > 0) return isPdfTableSource(table) ? `PDF 第 ${page} 页` : `第 ${page} 张表`;
  const part = Number(table.sourcePart || 0);
  if (part > 0) return `第 ${part} 张表`;
  return "";
}

function getTableSourceSummary(table) {
  const sourceName = getCleanSourceName(table);
  const pageText = getTablePageText(table);
  return pageText ? `${sourceName} · ${pageText}` : sourceName;
}

function getCustomerTableSourceSummary(table) {
  const pageText = getTablePageText(table);
  return pageText ? `表格来源 · ${pageText}` : "表格来源";
}

function renderTicketCard(ticket, title, rank) {
  const { table, row, index } = ticket;
  const fields = getOriginalTicketFields(ticket, { preserveOriginal: true })
    .map(
      ({ label, value }) => `
        <div class="ticket-field">
          <span>${escapeHtml(label)}</span>
          <strong>${escapeHtml(value || "")}</strong>
        </div>
      `,
    )
    .join("");

  const recommendation = sortMode === "recommended" && rank < 3 ? `<span class="recommend-badge">优先推荐</span>` : "";
  const reason = sortMode === "recommended" ? `<span class="ticket-reason">按售价和座位/号数综合排序</span>` : "";
  const sourceSummary = escapeHtml(getCustomerTableSourceSummary(table));

  return `
    <button class="ticket-card" type="button" data-ticket-key="${makeTicketKey(table, index)}">
      <span class="ticket-card-head">
        <span class="ticket-card-title">${title}</span>
        ${recommendation}
      </span>
      <span class="ticket-source-meta">${sourceSummary}</span>
      <span class="ticket-fields">${fields}</span>
      ${reason}
      <span class="ticket-open">查看原表 / 来源页</span>
    </button>
  `;
}

function renderRecognizedTableCard(group) {
  const { table, hitRows } = group;
  repairMisreadDataHeaderTable(table);
  const pageText = getTablePageText(table);
  const customerTitle = pageText ? `匹配票源 · ${pageText}` : "匹配票源表";
  const useOriginalDisplay = shouldUseOriginalTableDisplay(table);
  const displayColumns = useOriginalDisplay ? table.originalColumns : table.columns;
  const displayRows = useOriginalDisplay ? table.originalRows : table.rows;
  const visibleColumns = displayColumns
    .map((column, columnIndex) => ({ column, columnIndex }))
    .filter((field) => !isInternalColorColumn(field.column));
  const headers = visibleColumns.map(({ column }) => `<th>${escapeHtml(column || "")}</th>`).join("");
  const rows = displayRows
    .map(
      (row, rowIndex) => `
        <tr class="${hitRows.has(rowIndex) ? "hit-row" : ""}">
          ${visibleColumns.map(({ columnIndex }) => `<td>${escapeHtml(row[columnIndex] || "")}</td>`).join("")}
        </tr>
      `,
    )
    .join("");
  return `
    <article class="table-card">
      <div class="table-card-header">
        <div>
          <p class="table-card-title">${escapeHtml(customerTitle)}</p>
          <span class="ticket-reason">${escapeHtml(getCustomerTableSourceSummary(table))} · 命中 ${hitRows.size} 行</span>
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

  const tickets = getZoneTickets(selectedZone).filter((ticket) => !selectedDateId || dateMatchesTicket(ticket));
  const rawZoneTickets = currentEvent.tables.flatMap((table) =>
    table.rows
      .map((row, index) => ({ table, row, index }))
      .filter((ticket) => !isUnavailableTicket(ticket) && zoneMatchesTicket(ticket, selectedZone)),
  );
  if (window.ticketSeatmapDebug?.enabled !== false) {
    console.info("[ticket-date-debug] render-zone-drawer", JSON.stringify({
      eventId: currentEvent?.id,
      zone: selectedZone.label,
      ...getSelectedDateDebugInfo(),
      rawZoneTickets: rawZoneTickets.map((ticket) => ({
        tableId: ticket.table.id,
        rowIndex: ticket.index,
          sourcePage: ticket.table.sourcePage || "",
          dateValues: getTicketDateValues(ticket),
          rowDateKeys: getTicketDateValues(ticket).flatMap((value) => getDateKeysFromText(value)),
          zone: getTicketZoneValue(ticket),
          dateMatches: !selectedDateId || dateMatchesTicket(ticket),
      })),
      shownTickets: tickets.map((ticket) => ({
        tableId: ticket.table.id,
        rowIndex: ticket.index,
        sourcePage: ticket.table.sourcePage || "",
        dateValues: getTicketDateValues(ticket),
        rowDateKeys: getTicketDateValues(ticket).flatMap((value) => getDateKeysFromText(value)),
        zone: getTicketZoneValue(ticket),
      })),
    }));
  }
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
  const pageText = getTablePageText(table);
  const isCustomerMode = !customerView.classList.contains("hidden");
  const safeCustomerTitle = pageText ? `表格来源 · ${pageText}` : "表格来源";
  modalTitle.textContent = isCustomerMode ? safeCustomerTitle : `${table.title} · ${pageText || "表格来源"}`;
  const source = table.originalImage || "";
  const isPdf = isPdfTableSource(table);
  modalImage.classList.toggle("hidden", isPdf);
  modalPdf.classList.toggle("hidden", !isPdf);
  if (isPdf) {
    const page = Number(table.sourcePage || 0);
    modalPdf.src = page > 0 ? `${source.split("#")[0]}#page=${page}` : source;
    modalImage.removeAttribute("src");
  } else {
    modalImage.src = source;
    modalImage.alt = isCustomerMode ? safeCustomerTitle : `${table.title} ${pageText || "表格来源"}`;
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
  const normalizedQuery = normalize(eventSearchTerm);
  const hasQuery = Boolean(normalizedQuery);
  const shouldShowMatches = eventPickerOpen || hasQuery;
  const matchedEvents = hasQuery
    ? events.filter((event) => normalize(`${event.name} ${event.location} ${event.venue || ""} ${event.dates}`).includes(normalizedQuery))
    : events;
  const visibleEvents = shouldShowMatches ? matchedEvents : [currentEvent];
  eventList.classList.toggle("event-list-collapsed", !shouldShowMatches);
  if (eventSearchInput && eventSearchInput.value !== eventSearchTerm) eventSearchInput.value = eventSearchTerm;
  if (eventPickerToggle) {
    eventPickerToggle.textContent = hasQuery ? "清空搜索" : eventPickerOpen ? "收起列表" : "展开全部";
    eventPickerToggle.setAttribute("aria-expanded", shouldShowMatches ? "true" : "false");
  }
  if (eventPickerMeta) {
    eventPickerMeta.textContent = hasQuery
      ? matchedEvents.length
        ? `找到 ${matchedEvents.length} 场演出`
        : "没有找到匹配演出"
      : shouldShowMatches
        ? `共 ${events.length} 场演出`
        : `当前：${currentEvent.name}`;
  }
  eventList.innerHTML = visibleEvents.length
    ? visibleEvents
        .map(
          (event) => `
        <button class="event-card ${event.id === currentEvent.id ? "active" : ""}" type="button" data-event-id="${event.id}">
          <span class="event-card-head">
            <span class="event-name">${escapeHtml(event.name)}</span>
            ${event.id === currentEvent.id ? `<span class="event-current-pill">当前</span>` : ""}
          </span>
          <span class="event-info">
            <span>${escapeHtml(event.location)}</span>
            <span>${escapeHtml(event.dates)}</span>
          </span>
        </button>
      `,
        )
        .join("")
    : `<div class="event-empty-state">换个关键词试试。</div>`;
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
  renderEventDraftHistory();
  renderOperationArchives();
  deleteCurrentEventButton.disabled = events.length <= 1;
}

function renderAdminChecklist() {
  const pendingCount = pendingTables.filter((table) => table.eventId === currentEvent.id).length;
  const seatmapTestProgress = getSeatmapTestProgress();
  const items = [
    { done: Boolean(currentEvent.seatmapImage), label: "座位图已配置" },
    { done: currentEvent.zones.length > 0, label: `可点击热区 ${currentEvent.zones.length} 个` },
    {
      done: seatmapTestProgress.passed,
      label: seatmapTestProgress.total
        ? `座位图逐区测试 ${seatmapTestProgress.testedCount}/${seatmapTestProgress.total}`
        : "座位图逐区测试 0/0",
    },
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

function setLocalSaveStatus(message, type = "idle") {
  if (!localSaveStatus) return;
  localSaveStatus.textContent = message;
  localSaveStatus.dataset.status = type;
}

function updateLocalSaveStatus({ saved = false, backup = "", error = "" } = {}) {
  if (!localSaveStatus) return;
  const ocrChars = String(uploadTableText.value || "").length;
  const ocrText = ocrChars ? `OCR ${ocrChars.toLocaleString("zh-CN")} 字` : "OCR 空";
  const currentPendingCount = pendingTables.filter((table) => table.eventId === currentEvent.id).length;
  const pendingText = `确认表 ${currentPendingCount} 张`;
  const snapshot = lastTicketOcrJobSnapshot;
  const jobText = activeTicketOcrJobId
    ? `任务 ${snapshot?.pagesProcessed || 0}/${snapshot?.pagesQueued || snapshot?.totalPages || "?"}`
    : "无运行任务";
  if (error) {
    setLocalSaveStatus(`本地保存异常：${error}；${ocrText}，${pendingText}，${jobText}`, "error");
    return;
  }
  const time = new Date().toLocaleTimeString("zh-CN", { hour12: false });
  const backupText = backup ? `，${backup}` : "";
  setLocalSaveStatus(`本地保存${saved ? "完成" : "待保存"} ${time}${backupText}；${ocrText}，${pendingText}，${jobText}`, saved ? "success" : "idle");
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

function renderUploadRecords({ save = true, normalize = true } = {}) {
  if (normalize) normalizePendingTablesInMemory({ save });
  const allCurrentPending = pendingTables.filter((table) => table.eventId === currentEvent.id).map(ensurePendingTableReviewFlags);
  const repairedTables = allCurrentPending.filter((table) => table._columnRepairChanged);
  if (repairedTables.length) {
    repairedTables.forEach((table) => {
      delete table._columnRepairChanged;
    });
    scheduleAppStateSave();
  }
  const manualCount = allCurrentPending.filter((table) => table.needsManualReview).length;
  const currentPending = manualReviewOnly ? allCurrentPending.filter((table) => table.needsManualReview) : allCurrentPending;
  showManualReviewButton.textContent = manualReviewOnly ? "查看全部待确认" : `查看需人工确认${manualCount ? `（${manualCount}）` : ""}`;
  showManualReviewButton.disabled = !allCurrentPending.length;
  if (!allCurrentPending.length) {
    manualReviewOnly = false;
    uploadRecords.innerHTML = `
      <strong>当前演出待确认/本次上传记录</strong>
      <div class="empty-upload-record">还没有发布记录。</div>
    `;
    return;
  }
  if (!currentPending.length) {
    uploadRecords.innerHTML = `
      <strong>当前演出待确认/本次上传记录</strong>
      <div class="empty-upload-record">当前没有需要人工确认的表。</div>
    `;
    return;
  }
  const selectedIndex = Math.max(0, currentPending.findIndex((table) => table.id === selectedPendingTableId));
  const shouldWindowRecords = currentPending.length > MAX_UPLOAD_RECORDS_RENDERED;
  const windowStart = shouldWindowRecords
    ? Math.min(
        Math.max(selectedIndex - Math.floor(MAX_UPLOAD_RECORDS_RENDERED / 2), 0),
        Math.max(0, currentPending.length - MAX_UPLOAD_RECORDS_RENDERED),
      )
    : 0;
  const visiblePending = shouldWindowRecords ? currentPending.slice(windowStart, windowStart + MAX_UPLOAD_RECORDS_RENDERED) : currentPending;
  const windowEnd = windowStart + visiblePending.length;
  const windowNote = shouldWindowRecords
    ? `<div class="upload-record-window-note">为避免页面卡顿，只显示当前附近第 ${windowStart + 1}-${windowEnd} / ${currentPending.length} 张待确认表；上一页/下一页仍可切到全部页面。</div>`
    : "";

  uploadRecords.innerHTML = `
    <strong>当前演出待确认/本次上传记录</strong>
    ${windowNote}
    ${visiblePending
      .map(
        (table) => {
          const reasons = table.reviewReasons || [];
          const reviewBadge = table.needsManualReview
            ? `<em class="review-risk-badge">需人工确认</em>`
            : `<em class="review-ok-badge">标准识别</em>`;
          const titleText = shortenFileName(table.title || "新上传票源", 30);
          const sourceText = getTableSourceSummary(table);
          return `
          <div class="upload-record ${table.id === selectedPendingTableId ? "active" : ""}" data-review-table="${table.id}" role="button" tabindex="0">
            <span>
              <b title="${escapeHtml(table.title || "")}">${escapeHtml(titleText)}${reviewBadge}</b>
              <small title="${escapeHtml(sourceText)}">${escapeHtml(shortenFileName(sourceText, 46))} · ${table.rows.length} 条票源 · 待确认${reasons.length ? ` · ${escapeHtml(reasons.join(" / "))}` : ""}</small>
            </span>
            <button class="small-button ghost" type="button" data-review-table="${table.id}">打开这一页</button>
          </div>
        `;
        },
      )
      .join("")}
  `;
}

function getSelectedPendingTable() {
  return pendingTables.find((table) => table.id === selectedPendingTableId) || null;
}

function getCurrentPendingTables({ manualOnly = manualReviewOnly } = {}) {
  const allCurrentPending = pendingTables.filter((table) => table.eventId === currentEvent.id).map(ensurePendingTableReviewFlags);
  return manualOnly ? allCurrentPending.filter((table) => table.needsManualReview) : allCurrentPending;
}

function getReviewTableNavigation(table) {
  const queue = getCurrentPendingTables();
  const index = table ? queue.findIndex((item) => item.id === table.id) : -1;
  return {
    queue,
    index,
    previous: index > 0 ? queue[index - 1] : null,
    next: index >= 0 && index < queue.length - 1 ? queue[index + 1] : null,
  };
}

function selectPendingTable(tableId, { scroll = false } = {}) {
  const table = pendingTables.find((item) => item.id === tableId && item.eventId === currentEvent.id);
  if (!table) return false;
  selectedPendingTableId = table.id;
  ensurePendingTableReviewFlags(table);
  pendingReviewFocusRowIndex = getReviewableRowIndexes(table)[0] ?? getVisibleReviewRowIndexes(table)[0] ?? null;
  renderReviewPanel(pendingReviewFocusRowIndex, { normalize: false });
  window.requestAnimationFrame(() => renderUploadRecords({ normalize: false }));
  if (scroll) document.querySelector("#reviewPanel")?.scrollIntoView({ behavior: "auto", block: "start" });
  return true;
}

function selectAdjacentPendingTable(direction, { saveCurrent = true } = {}) {
  const table = getSelectedPendingTable();
  const navigation = getReviewTableNavigation(table);
  const target = direction < 0 ? navigation.previous : navigation.next;
  if (!target) {
    showToast(direction < 0 ? "前面没有待校对表了。" : "后面没有待校对表了。", "error");
    return;
  }
  if (saveCurrent && table) {
    updatePendingTableReviewFlags(table);
    renderUploadRecords();
    saveAppState();
  }
  selectPendingTable(target.id, { scroll: true });
}

function selectNextPendingTableAfterPublish(queueSnapshot, currentIndex) {
  const stillVisible = getCurrentPendingTables();
  const visibleIds = new Set(stillVisible.map((table) => table.id));
  for (let index = currentIndex + 1; index < queueSnapshot.length; index += 1) {
    const tableId = queueSnapshot[index]?.id;
    if (visibleIds.has(tableId)) {
      selectedPendingTableId = tableId;
      pendingReviewFocusRowIndex = null;
      return true;
    }
  }
  const fallback = stillVisible[0];
  selectedPendingTableId = fallback?.id || null;
  pendingReviewFocusRowIndex = null;
  return Boolean(fallback);
}

function isPendingRowReviewed(table, rowIndex) {
  return Boolean(table?.reviewedRows?.[rowIndex]);
}

function markPendingRowReviewed(table, rowIndex) {
  if (!table || !table.rows[rowIndex]) return;
  table.reviewedRows = table.reviewedRows || {};
  table.reviewedRows[rowIndex] = true;
}

function getReviewableRowIndexes(table) {
  if (!table) return [];
  return table.rows
    .map((row, index) => ({ row, index }))
    .filter(({ row, index }) => !isUnavailableTicket({ table, row, index }) && !isPendingRowReviewed(table, index))
    .map(({ index }) => index);
}

function getNextReviewableRowIndex(table, currentIndex) {
  const indexes = getReviewableRowIndexes(table);
  return indexes.find((index) => index > currentIndex) ?? indexes[0] ?? null;
}

function getNextManualReviewTableAfter(currentTable) {
  const allCurrentPending = pendingTables.filter((table) => table.eventId === currentEvent.id).map(ensurePendingTableReviewFlags);
  const currentIndex = currentTable ? allCurrentPending.findIndex((table) => table.id === currentTable.id) : -1;
  const riskyTables = allCurrentPending.filter((table) => table.needsManualReview && table.id !== currentTable?.id);
  if (!riskyTables.length) return null;
  const laterTable = riskyTables.find((table) => allCurrentPending.findIndex((item) => item.id === table.id) > currentIndex);
  return laterTable || riskyTables[0] || null;
}

function focusReviewRow(rowIndex) {
  if (rowIndex === null || rowIndex === undefined) return;
  window.requestAnimationFrame(() => {
    document.querySelector(`[data-review-row-index="${rowIndex}"]`)?.scrollIntoView({ behavior: "smooth", block: "center" });
  });
}

function refreshReviewAfterRowAction(rowIndex, archiveLabel = "", archiveType = "校对") {
  const table = getSelectedPendingTable();
  pendingReviewFocusRowIndex = getNextReviewableRowIndex(table, rowIndex);
  if (pendingReviewFocusRowIndex === null) {
    const nextTable = getNextManualReviewTableAfter(table);
    if (nextTable) {
      manualReviewOnly = true;
      selectedPendingTableId = nextTable.id;
      pendingReviewFocusRowIndex = getReviewableRowIndexes(nextTable)[0] ?? getVisibleReviewRowIndexes(nextTable)[0] ?? null;
      showToast("已跳到下一张需要人工确认的表。", "success");
    }
  }
  renderReviewPanel(pendingReviewFocusRowIndex);
  window.requestAnimationFrame(() => renderUploadRecords());
  if (archiveLabel) {
    saveAndArchiveAppStep(archiveLabel, archiveType);
  } else {
    scheduleAppStateSave();
  }
}

function cloneReviewState(table) {
  return {
    columns: Array.isArray(table.columns) ? [...table.columns] : [],
    rows: Array.isArray(table.rows) ? table.rows.map((row) => [...row]) : [],
    originalColumns: Array.isArray(table.originalColumns) ? [...table.originalColumns] : [],
    originalRows: Array.isArray(table.originalRows) ? cloneRows(table.originalRows) : [],
    publishRows: { ...(table.publishRows || {}) },
    manualPublishRows: { ...(table.manualPublishRows || {}) },
    manualSkipRows: { ...(table.manualSkipRows || {}) },
    reviewedRows: { ...(table.reviewedRows || {}) },
    userEditedRows: { ...(table.userEditedRows || {}) },
    aiReviewDecisions: Array.isArray(table.aiReviewDecisions) ? table.aiReviewDecisions.map((item) => ({ ...item })) : [],
    aiReviewStatus: table.aiReviewStatus || "",
    colorReviewSamples: { ...(table.colorReviewSamples || {}) },
    rowColorSource: table.rowColorSource || "",
    rowColorLogicVersion: Number(table.rowColorLogicVersion || 0),
    publishDecisionLogicVersion: Number(table.publishDecisionLogicVersion || 0),
    rowColorReliable: Boolean(table.rowColorReliable),
    rowColorConfirmed: Boolean(table.rowColorConfirmed),
    rowColorExactRowAligned: Boolean(table.rowColorExactRowAligned),
    rowColorActionableConflict: Boolean(table.rowColorActionableConflict),
    rowColorAutoApplied: Boolean(table.rowColorAutoApplied),
    rowColorAutoSkipCount: Number(table.rowColorAutoSkipCount || 0),
    rowColorMessage: table.rowColorMessage || "",
    rowColorSelectionMode: table.rowColorSelectionMode || "",
    rowColorContiguous: Boolean(table.rowColorContiguous),
    rowColorMaxGap: Number(table.rowColorMaxGap || 0),
    rowColorSourceIndexes: Array.isArray(table.rowColorSourceIndexes) ? [...table.rowColorSourceIndexes] : null,
    rowColorPartialSequenceAligned: Boolean(table.rowColorPartialSequenceAligned),
    rowColorSparseSourceRepair: Boolean(table.rowColorSparseSourceRepair),
    rowColorPageLabels: Array.isArray(table.rowColorPageLabels) ? [...table.rowColorPageLabels] : [],
    rowColorSoldTextAnchor: table.rowColorSoldTextAnchor
      ? {
          soldNonWhiteCount: Number(table.rowColorSoldTextAnchor.soldNonWhiteCount || 0),
          labels: Array.isArray(table.rowColorSoldTextAnchor.labels) ? [...table.rowColorSoldTextAnchor.labels] : [],
        }
      : null,
    rowColorRows: Array.isArray(table.rowColorRows) ? table.rowColorRows.map((item) => ({ ...item })) : [],
    aiRowColorAutoRows: Array.isArray(table.aiRowColorAutoRows) ? [...table.aiRowColorAutoRows] : [],
    ppStructureAnalysis: compactPpStructureAnalysis(table.ppStructureAnalysis),
    ppStructureTicketRowMatches: clonePpStructureMatches(table.ppStructureTicketRowMatches),
    ppStructureMessage: table.ppStructureMessage || "",
    showOpenCvColorPreview: Boolean(table.showOpenCvColorPreview),
    showSoldInReview: Boolean(table.showSoldInReview),
    bulkSkipDraft: Boolean(table.bulkSkipDraft),
  };
}

function pushReviewSnapshot(table, label) {
  if (!table) return;
  table.reviewSnapshots = Array.isArray(table.reviewSnapshots) ? table.reviewSnapshots : [];
  table.reviewSnapshots.unshift({
    id: `review-snapshot-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    label,
    createdAt: new Date().toLocaleString("zh-CN", { hour12: false }),
    state: cloneReviewState(table),
  });
  table.reviewSnapshots = table.reviewSnapshots.slice(0, 8);
}

function restoreReviewSnapshot(table, snapshotId) {
  if (!table) return;
  const snapshot = (table.reviewSnapshots || []).find((item) => item.id === snapshotId);
  if (!snapshot?.state) {
    showToast("没有找到这条历史记录。", "error");
    return;
  }
  pushReviewSnapshot(table, "恢复前自动备份");
  const state = snapshot.state;
  table.columns = Array.isArray(state.columns) ? [...state.columns] : [];
  table.rows = Array.isArray(state.rows) ? state.rows.map((row) => [...row]) : [];
  table.originalColumns = Array.isArray(state.originalColumns) ? [...state.originalColumns] : [...table.columns];
  table.originalRows = Array.isArray(state.originalRows) && state.originalRows.length ? cloneRows(state.originalRows) : cloneRows(table.rows);
  table.publishRows = { ...(state.publishRows || {}) };
  table.manualPublishRows = { ...(state.manualPublishRows || {}) };
  table.manualSkipRows = { ...(state.manualSkipRows || {}) };
  table.reviewedRows = { ...(state.reviewedRows || {}) };
  table.userEditedRows = { ...(state.userEditedRows || {}) };
  table.aiReviewDecisions = Array.isArray(state.aiReviewDecisions) ? state.aiReviewDecisions.map((item) => ({ ...item })) : [];
  table.aiReviewStatus = `已恢复：${snapshot.label}`;
  table.colorReviewSamples = { ...(state.colorReviewSamples || {}) };
  table.rowColorSource = state.rowColorSource || "";
  table.rowColorLogicVersion = Number(state.rowColorLogicVersion || 0);
  table.publishDecisionLogicVersion = Number(state.publishDecisionLogicVersion || 0);
  table.rowColorReliable = Boolean(state.rowColorReliable);
  table.rowColorConfirmed = Boolean(state.rowColorConfirmed);
  table.rowColorExactRowAligned = Boolean(state.rowColorExactRowAligned);
  table.rowColorActionableConflict = Boolean(state.rowColorActionableConflict);
  table.rowColorAutoApplied = Boolean(state.rowColorAutoApplied);
  table.rowColorAutoSkipCount = Number(state.rowColorAutoSkipCount || 0);
  table.rowColorMessage = state.rowColorMessage || "";
  table.rowColorSelectionMode = state.rowColorSelectionMode || "";
  table.rowColorImageWidth = Number(state.rowColorImageWidth || 0);
  table.rowColorImageHeight = Number(state.rowColorImageHeight || 0);
  table.rowColorContiguous = Boolean(state.rowColorContiguous);
  table.rowColorMaxGap = Number(state.rowColorMaxGap || 0);
  table.rowColorSourceIndexes = Array.isArray(state.rowColorSourceIndexes) ? [...state.rowColorSourceIndexes] : null;
  table.rowColorPartialSequenceAligned = Boolean(state.rowColorPartialSequenceAligned);
  table.rowColorSparseSourceRepair = Boolean(state.rowColorSparseSourceRepair);
  table.rowColorPageLabels = Array.isArray(state.rowColorPageLabels) ? [...state.rowColorPageLabels] : [];
  table.rowColorSoldTextAnchor = state.rowColorSoldTextAnchor
    ? {
        soldNonWhiteCount: Number(state.rowColorSoldTextAnchor.soldNonWhiteCount || 0),
        labels: Array.isArray(state.rowColorSoldTextAnchor.labels) ? [...state.rowColorSoldTextAnchor.labels] : [],
      }
    : null;
  table.rowColorRows = Array.isArray(state.rowColorRows) ? state.rowColorRows.map((item) => ({ ...item })) : [];
  table.aiRowColorAutoRows = Array.isArray(state.aiRowColorAutoRows) ? [...state.aiRowColorAutoRows] : [];
  table.ppStructureAnalysis = compactPpStructureAnalysis(state.ppStructureAnalysis);
  table.ppStructureTicketRowMatches = clonePpStructureMatches(state.ppStructureTicketRowMatches);
  table.ppStructureMessage = state.ppStructureMessage || "";
  table.showOpenCvColorPreview = Boolean(state.showOpenCvColorPreview);
  table.showSoldInReview = Boolean(state.showSoldInReview);
  table.bulkSkipDraft = Boolean(state.bulkSkipDraft);
  updatePendingTableReviewFlags(table);
  renderUploadRecords();
  renderReviewPanel();
  saveAndArchiveAppStep(`恢复校对历史：${table.title || currentEvent.name}`, "校对");
  showToast("已恢复到历史记录。", "success");
}

function toggleShowSkippedReviewRows(table) {
  if (!table) return;
  table.showSoldInReview = !table.showSoldInReview;
  renderReviewPanel();
}

function setColorReviewSample(table, rowIndex, sampleType) {
  if (!table || !table.rows[rowIndex]) return;
  table.colorReviewSamples = table.colorReviewSamples || {};
  if (sampleType === "sold") table.colorReviewSamples.soldRow = rowIndex;
  if (sampleType === "available") table.colorReviewSamples.availableRow = rowIndex;
  renderReviewPanel(rowIndex);
  saveAndArchiveAppStep(`设置颜色样本：第 ${rowIndex + 1} 条${sampleType === "sold" ? "已售" : "未售"}样本`, "校对");
  showToast(sampleType === "sold" ? "已设置已售颜色样本。" : "已设置未售颜色样本。", "success");
}

function getReviewEditKey(table, rowIndex) {
  return `${table?.id || "table"}:${rowIndex}`;
}

function isReviewRowEditing(table, rowIndex) {
  return editingReviewRows.has(getReviewEditKey(table, rowIndex));
}

function startReviewRowEdit(table, rowIndex) {
  if (!table || !table.rows[rowIndex]) return;
  editingReviewRows.add(getReviewEditKey(table, rowIndex));
  renderReviewPanel(rowIndex);
}

function cancelReviewRowEdit(table, rowIndex) {
  editingReviewRows.delete(getReviewEditKey(table, rowIndex));
  renderReviewPanel(rowIndex);
}

function saveReviewRowPrice(table, rowIndex, value) {
  if (!table || !table.rows[rowIndex]) return;
  const price = String(value || "").trim();
  if (!extractNumber(price)) {
    showToast("请填写有效售价，例如 4800。", "error");
    return;
  }
  const priceIndex = ensureSalePriceColumn(table);
  while (table.rows[rowIndex].length < table.columns.length) table.rows[rowIndex].push("");
  table.rows[rowIndex][priceIndex] = price;
  syncOriginalRowValue(table, rowIndex, priceIndex, price, { appendMissing: true });
  table.publishRows = table.publishRows || {};
  table.manualPublishRows = table.manualPublishRows || {};
  table.manualSkipRows = table.manualSkipRows || {};
  table.publishRows[rowIndex] = true;
  table.manualPublishRows[rowIndex] = true;
  delete table.manualSkipRows[rowIndex];
  table.userEditedRows = table.userEditedRows || {};
  table.userEditedRows[rowIndex] = true;
  updatePendingTableReviewFlags(table);
  markPendingRowReviewed(table, rowIndex);
  refreshReviewAfterRowAction(rowIndex, `修改售价：第 ${rowIndex + 1} 条设为 ${price}`, "校对");
  showToast("售价已保存，并设为可发布。", "success");
}

function applyReviewDateToTable(table, value) {
  if (!table) return;
  const date = String(value || "").trim();
  if (!date) {
    showToast("请填写日期，例如 9.12 或 2026-09-12。", "error");
    return;
  }
  const dateIndex = ensureDateColumn(table);
  let changedRows = 0;
  table.rows.forEach((row, rowIndex) => {
    while (row.length < table.columns.length) row.push("");
    if (!String(row[dateIndex] || "").trim()) {
      row[dateIndex] = date;
      syncOriginalRowValue(table, rowIndex, dateIndex, date, { appendMissing: true });
      table.userEditedRows = table.userEditedRows || {};
      table.userEditedRows[rowIndex] = true;
      changedRows += 1;
    }
  });
  if (!changedRows) {
    showToast("这张表的票源已经都有日期。", "error");
    return;
  }
  updatePendingTableReviewFlags(table);
  renderUploadRecords();
  renderReviewPanel();
  saveAndArchiveAppStep(`批量补日期：${changedRows} 条设为 ${date}`, "校对");
  showToast(`已给 ${changedRows} 条票补上日期。`, "success");
}

function saveReviewRowEdits(table, rowIndex, card) {
  if (!table || !table.rows[rowIndex] || !card) return;
  const inputs = [...card.querySelectorAll("[data-review-edit-input]")];
  if (!inputs.length) return;
  const nextRow = [...table.rows[rowIndex]];
  inputs.forEach((input) => {
    const columnIndex = Number(input.dataset.reviewEditInput);
    if (!Number.isInteger(columnIndex)) return;
    nextRow[columnIndex] = input.value.trim();
    syncOriginalRowValueByPosition(table, rowIndex, columnIndex, nextRow[columnIndex], { appendMissing: true });
  });
  while (nextRow.length < table.columns.length) nextRow.push("");
  moveBusinessStatusMarkersToRemark(table, nextRow);
  syncOriginalRowFromCurrentRow(table, rowIndex, nextRow);
  table.rows[rowIndex] = nextRow;
  table.userEditedRows = table.userEditedRows || {};
  table.userEditedRows[rowIndex] = true;
  table.publishRows = table.publishRows || {};
  if (table.publishRows[rowIndex] === undefined) {
    table.publishRows[rowIndex] = isCustomerPublishableTicket({ table, row: table.rows[rowIndex], index: rowIndex });
  }
  editingReviewRows.delete(getReviewEditKey(table, rowIndex));
  updatePendingTableReviewFlags(table);
  markPendingRowReviewed(table, rowIndex);
  refreshReviewAfterRowAction(rowIndex, `修改票源：第 ${rowIndex + 1} 条`, "校对");
  showToast("票源信息已修改。", "success");
}

function ensureStatusColumn(table) {
  let statusIndex = findColumnIndex(table.columns, ["状态", "售卖状态", "销售状态", "status"]);
  if (statusIndex >= 0) return statusIndex;
  table.columns.push("状态");
  statusIndex = table.columns.length - 1;
  table.rows.forEach((row) => {
    while (row.length < table.columns.length) row.push("");
  });
  return statusIndex;
}

function togglePendingRowSold(table, rowIndex) {
  if (!table || !table.rows[rowIndex]) return;
  const statusIndex = ensureStatusColumn(table);
  const ticket = { table, row: table.rows[rowIndex], index: rowIndex };
  table.rows[rowIndex][statusIndex] = isSoldTicket(ticket) ? "" : "已售";
  syncOriginalRowValue(table, rowIndex, statusIndex, table.rows[rowIndex][statusIndex], { appendMissing: true });
  table.userEditedRows = table.userEditedRows || {};
  table.userEditedRows[rowIndex] = true;
  table.publishRows = table.publishRows || {};
  const nextTicket = { table, row: table.rows[rowIndex], index: rowIndex };
  table.publishRows[rowIndex] = isCustomerPublishableTicket(nextTicket);
  table.manualPublishRows = table.manualPublishRows || {};
  table.manualSkipRows = table.manualSkipRows || {};
  if (table.publishRows[rowIndex] === true) {
    table.manualPublishRows[rowIndex] = true;
    delete table.manualSkipRows[rowIndex];
  } else {
    delete table.manualPublishRows[rowIndex];
  }
  markPendingRowReviewed(table, rowIndex);
  updatePendingTableReviewFlags(table);
  refreshReviewAfterRowAction(rowIndex, `标记售卖状态：第 ${rowIndex + 1} 条`, "校对");
}

function clearSoldMarkersFromRow(table, rowIndex) {
  if (!table || !table.rows[rowIndex]) return;
  table.rows[rowIndex].forEach((value, columnIndex) => {
    if (!isSoldText(value, { strict: true })) return;
    table.rows[rowIndex][columnIndex] = "";
    syncOriginalRowValue(table, rowIndex, columnIndex, "");
  });
  if (Array.isArray(table.originalRows) && Array.isArray(table.originalRows[rowIndex])) {
    table.originalRows[rowIndex].forEach((value, columnIndex) => {
      if (!isSoldText(value, { strict: true })) return;
      table.originalRows[rowIndex][columnIndex] = "";
    });
  }
  const statusIndex = findColumnIndex(table.columns, ["状态", "售卖状态", "销售状态", "status"]);
  if (statusIndex >= 0 && isSoldText(table.rows[rowIndex][statusIndex], { strict: true })) {
    table.rows[rowIndex][statusIndex] = "";
    syncOriginalRowValue(table, rowIndex, statusIndex, "");
  }
  const noteIndex = findColumnIndex(table.columns, ["备注", "remark", "note"]);
  if (noteIndex >= 0 && isSoldText(table.rows[rowIndex][noteIndex], { strict: false })) {
    table.rows[rowIndex][noteIndex] = "";
    syncOriginalRowValue(table, rowIndex, noteIndex, "");
  }
}

function clearColorMarkerFromRow(table, rowIndex) {
  if (!table || !table.rows[rowIndex]) return;
  const colorIndex = getRowColorColumnIndex(table);
  if (colorIndex >= 0 && normalizeRowColorLabel(table.rows[rowIndex][colorIndex])) {
    table.rows[rowIndex][colorIndex] = "";
    syncOriginalRowValue(table, rowIndex, colorIndex, "");
  }
  if (Array.isArray(table.rowColorRows) && table.rowColorRows[rowIndex]) {
    table.rowColorRows[rowIndex].userCleared = true;
  }
}

function clearUnavailableMarkersFromRow(table, rowIndex) {
  clearSoldMarkersFromRow(table, rowIndex);
  clearColorMarkerFromRow(table, rowIndex);
}

function shouldPublishPendingRow(table, rowIndex) {
  if (!table || !table.rows[rowIndex]) return false;
  const ticket = { table, row: table.rows[rowIndex], index: rowIndex };
  if (isUnavailableTicket(ticket)) return false;
  if (!table.publishRows || table.publishRows[rowIndex] === undefined) {
    return isCustomerPublishableTicket(ticket);
  }
  return table.publishRows[rowIndex] !== false && isCustomerPublishableTicket(ticket);
}

function isPendingRowSelectedForPublish(table, rowIndex) {
  if (!table || !table.rows[rowIndex]) return false;
  if (!table.publishRows || table.publishRows[rowIndex] === undefined) {
    return shouldPublishPendingRow(table, rowIndex);
  }
  return table.publishRows[rowIndex] === true;
}

function getPendingRowPublishBlockReason(ticket) {
  if (!ticket?.table || !ticket.table.rows?.[ticket.index]) return "票源行不存在，无法发布。";
  if (isSoldTicket(ticket)) return "仍被识别为已售，请点修改清掉 SOLD/已售字样，或重新点“发布到前台”。";
  if (isColorHeldForReviewTicket(ticket)) return "仍被颜色标色下架，请确认这行不是已售后再点“发布到前台”。";
  if (!hasTicketSalePrice(ticket)) return "缺少有效售价，请先补售价。";
  return "";
}

function getPendingRowDecisionReason(ticket, { selectedForPublish = false, publishEligible = false } = {}) {
  if (!ticket?.table || !ticket.table.rows?.[ticket.index]) return "票源行不存在";
  if (isSoldTicket(ticket)) return "文字 SOLD/已售 下架";
  const aiItem = getAiRowColorItem(ticket.table, ticket.index);
  if (isTrustedAiRowSkipDecision(ticket.table, ticket.index)) {
    return `AI视觉复核不发布${aiItem?.reason ? `：${aiItem.reason}` : ""}`;
  }
  if (isColorHeldForReviewTicket(ticket)) {
    const label = getWhiteVsColoredConflictLabel(ticket.table, ticket.index) || getTicketRowColorLabel(ticket) || "非白底";
    return `颜色${label}下架`;
  }
  if (!hasTicketSalePrice(ticket)) return "缺少有效售价";
  if (selectedForPublish && !publishEligible) return getPendingRowPublishBlockReason(ticket) || "未满足发布条件";
  if (!selectedForPublish) {
    if (ticket.table.manualSkipRows?.[ticket.index] === true || ticket.table.bulkSkipDraft === true) return "人工选择不发布";
    return "历史不发布状态";
  }
  return "满足发布条件";
}

function togglePendingRowPublish(table, rowIndex) {
  if (!table || !table.rows[rowIndex]) return;
  table.publishRows = table.publishRows || {};
  table.manualPublishRows = table.manualPublishRows || {};
  table.manualSkipRows = table.manualSkipRows || {};
  const nextPublish = !isPendingRowSelectedForPublish(table, rowIndex);
  if (nextPublish) clearUnavailableMarkersFromRow(table, rowIndex);
  table.publishRows[rowIndex] = nextPublish;
  if (nextPublish) {
    table.manualPublishRows[rowIndex] = true;
    delete table.manualSkipRows[rowIndex];
  } else {
    delete table.manualPublishRows[rowIndex];
    table.manualSkipRows[rowIndex] = true;
  }
  table.userEditedRows = table.userEditedRows || {};
  table.userEditedRows[rowIndex] = true;
  markPendingRowReviewed(table, rowIndex);
  updatePendingTableReviewFlags(table);
  renderUploadRecords();
  renderReviewPanel(rowIndex);
  saveAndArchiveAppStep(`${nextPublish ? "设为发布" : "设为不发布"}：第 ${rowIndex + 1} 条`, "校对");
}

function setPendingRowPublish(table, rowIndex, shouldPublish) {
  if (!table || !table.rows[rowIndex]) return;
  if (shouldPublish) clearUnavailableMarkersFromRow(table, rowIndex);
  table.publishRows = table.publishRows || {};
  table.manualPublishRows = table.manualPublishRows || {};
  table.manualSkipRows = table.manualSkipRows || {};
  table.publishRows[rowIndex] = Boolean(shouldPublish);
  if (shouldPublish) {
    table.manualPublishRows[rowIndex] = true;
    delete table.manualSkipRows[rowIndex];
  } else {
    delete table.manualPublishRows[rowIndex];
    table.manualSkipRows[rowIndex] = true;
  }
  table.userEditedRows = table.userEditedRows || {};
  table.userEditedRows[rowIndex] = true;
  markPendingRowReviewed(table, rowIndex);
  updatePendingTableReviewFlags(table);
  renderUploadRecords();
  renderReviewPanel(rowIndex);
  saveAndArchiveAppStep(`${shouldPublish ? "设为发布" : "设为不发布"}：第 ${rowIndex + 1} 条`, "校对");
}

function setPendingRowPublishDraft(table, rowIndex, shouldPublish) {
  if (!table || !table.rows[rowIndex]) return;
  table.publishRows = table.publishRows || {};
  table.manualPublishRows = table.manualPublishRows || {};
  table.manualSkipRows = table.manualSkipRows || {};
  table.publishRows[rowIndex] = Boolean(shouldPublish);
  if (shouldPublish) {
    table.manualPublishRows[rowIndex] = true;
    delete table.manualSkipRows[rowIndex];
  } else {
    delete table.manualPublishRows[rowIndex];
    table.manualSkipRows[rowIndex] = true;
  }
  renderReviewPanel(rowIndex);
  saveAndArchiveAppStep(`${shouldPublish ? "草稿设为发布" : "草稿设为不发布"}：第 ${rowIndex + 1} 条`, "校对");
}

function updateQuickManualCounts(table) {
  const counters = reviewLayout.querySelectorAll("[data-quick-manual-counts]");
  if (!counters.length || !table?.rows) return;
  const publishCount = table.rows.filter((row, rowIndex) => {
    return isPendingRowSelectedForPublish(table, rowIndex) && isCustomerPublishableTicket({ table, row, index: rowIndex });
  }).length;
  counters.forEach((counter) => {
    counter.textContent = `当前上传 ${publishCount} 条 / 下架 ${table.rows.length - publishCount} 条。`;
  });
}

function setQuickManualRowPublish(table, rowIndex, shouldPublish, options = {}) {
  if (!table?.rows?.[rowIndex]) return false;
  if (shouldPublish) clearUnavailableMarkersFromRow(table, rowIndex);
  table.publishRows = table.publishRows || {};
  table.manualPublishRows = table.manualPublishRows || {};
  table.manualSkipRows = table.manualSkipRows || {};
  table.userEditedRows = table.userEditedRows || {};
  table.quickManualReviewedRows = table.quickManualReviewedRows || {};
  table.publishRows[rowIndex] = Boolean(shouldPublish);
  table.userEditedRows[rowIndex] = true;
  table.quickManualReviewedRows[rowIndex] = true;
  if (shouldPublish) {
    table.manualPublishRows[rowIndex] = true;
    delete table.manualSkipRows[rowIndex];
  } else {
    delete table.manualPublishRows[rowIndex];
    table.manualSkipRows[rowIndex] = true;
  }
  const rowElements = reviewLayout.querySelectorAll(`[data-review-row-index="${rowIndex}"]`);
  rowElements.forEach((rowEl) => {
    rowEl.classList.toggle("publish", Boolean(shouldPublish));
    rowEl.classList.toggle("skip", !shouldPublish);
    const status = rowEl.querySelector(".quick-decision-status, .source-decision-status");
    if (status) status.textContent = shouldPublish ? "上传" : "下架";
    rowEl.querySelectorAll("[data-quick-row-publish]").forEach((button) => {
      const active = button.dataset.publishValue === String(Boolean(shouldPublish));
      button.classList.toggle("active", active);
    });
  });
  if (options.updateCounts !== false) updateQuickManualCounts(table);
  if (options.save === true) scheduleAppStateSave(1200);
  return true;
}

function markAllQuickManualRows(table, shouldPublish) {
  if (!table || !Array.isArray(table.rows) || !table.rows.length) {
    showToast("当前没有可批量设置的票。", "error");
    return false;
  }
  pushReviewSnapshot(table, shouldPublish ? "全部改为上传前" : "全部改为下架前");
  table.rows.forEach((_, rowIndex) => {
    setQuickManualRowPublish(table, rowIndex, shouldPublish, { save: false, updateCounts: false });
  });
  updateQuickManualCounts(table);
  updatePendingTableReviewFlags(table);
  renderUploadRecords();
  scheduleAppStateSave(0);
  saveAndArchiveAppStep(`${shouldPublish ? "快速全部上传" : "快速全部下架"}：${table.rows.length} 条`, "校对");
  showToast(`已全部改为${shouldPublish ? "上传" : "下架"}。`, "success");
  return true;
}

function invertQuickManualRows(table) {
  if (!table || !Array.isArray(table.rows) || !table.rows.length) {
    showToast("当前没有可反选的票。", "error");
    return false;
  }
  pushReviewSnapshot(table, "反选前");
  table.rows.forEach((_, rowIndex) => {
    setQuickManualRowPublish(table, rowIndex, !isPendingRowSelectedForPublish(table, rowIndex), { save: false, updateCounts: false });
  });
  updateQuickManualCounts(table);
  updatePendingTableReviewFlags(table);
  renderUploadRecords();
  scheduleAppStateSave(0);
  saveAndArchiveAppStep(`快速反选：${table.rows.length} 条`, "校对");
  showToast("已反选本页所有勾叉。", "success");
  return true;
}

function saveCurrentReviewChoices({ advance = false } = {}) {
  const table = getSelectedPendingTable();
  if (!table) {
    showToast("请先选择一张待确认表。", "error");
    return false;
  }
  updatePendingTableReviewFlags(table);
  renderUploadRecords();
  const saved = saveAndArchiveAppStep(`保存本页勾叉：${table.title || currentEvent.name}`, "校对", { silent: true });
  showToast(saved ? (advance ? "已保存本页勾叉，进入下一页。" : "已保存本页勾叉。") : "保存失败，请稍后再试。", saved ? "success" : "error");
  if (saved && advance) selectAdjacentPendingTable(1, { saveCurrent: false });
  else renderReviewPanel(undefined, { normalize: false });
  return saved;
}

function saveAllReviewChoices() {
  const currentPending = pendingTables.filter((table) => table.eventId === currentEvent.id);
  if (!currentPending.length) {
    showToast("当前没有待确认表可保存。", "error");
    return false;
  }
  currentPending.forEach((table) => updatePendingTableReviewFlags(table));
  renderUploadRecords();
  const saved = saveAndArchiveAppStep(`保存全部待确认勾叉：${currentPending.length} 张表`, "校对", { silent: true });
  showToast(saved ? `已保存 ${currentPending.length} 张待确认表的勾叉。` : "保存失败，请稍后再试。", saved ? "success" : "error");
  return saved;
}

function toggleQuickCheckTable(table) {
  if (!table) return;
  table.quickCheckVisible = !table.quickCheckVisible;
  renderReviewPanel(undefined, { normalize: false });
  scheduleAppStateSave(800);
}

function confirmAllQuickManualTables() {
  if (!requireSeatmapTestBeforePublish()) return;
  const currentPending = pendingTables.filter((table) => table.eventId === currentEvent.id && table.quickManualMode);
  if (!currentPending.length) {
    showToast("当前没有快速人工待提交表。", "error");
    return;
  }
  let publishedRowCount = 0;
  let publishedTableCount = 0;
  currentPending.forEach((table) => {
    const publishRows = [];
    table.rows.forEach((row, rowIndex) => {
      const ticket = { table, row, index: rowIndex };
      if (isUnavailableTicket(ticket)) return;
      if (table.publishRows?.[rowIndex] === true && isCustomerPublishableTicket(ticket)) publishRows.push(row);
    });
    if (!publishRows.length) return;
    const publishedTable = createPublishedTableFromRows(table, publishRows, currentPending.length > 1 ? ` ${publishRows.length}条` : "");
    currentEvent.tables.unshift(publishedTable);
    uploadedTables.unshift(publishedTable);
    publishedRowCount += publishRows.length;
    publishedTableCount += 1;
  });
  currentPending.forEach((table) => {
    const index = pendingTables.findIndex((item) => item.id === table.id);
    if (index >= 0) pendingTables.splice(index, 1);
  });
  if (!publishedRowCount) {
    showToast("当前没有勾选上传的票。", "error");
    renderUploadRecords();
    renderReviewPanel();
    return;
  }
  selectedPendingTableId = pendingTables.find((table) => table.eventId === currentEvent.id)?.id || null;
  manualReviewOnly = false;
  selectFirstDateWithTickets();
  const matchedRows = countZoneRowsFromTables();
  const matchMessage = getPublishMatchMessage(`快速提交 ${publishedTableCount} 张表、${publishedRowCount} 条票`, matchedRows);
  setUploadStatus(matchMessage.text, matchMessage.type);
  showToast(matchMessage.toast, matchMessage.type);
  renderUploadRecords();
  renderReviewPanel();
  renderPublishedTables();
  renderAdminEvent();
  window.setTimeout(render, 0);
  saveAndArchiveAppStep(`快速总体提交：${publishedTableCount} 张表、${publishedRowCount} 条票`, "发布");
}

function confirmQuickManualCurrentTable() {
  if (!requireSeatmapTestBeforePublish()) return;
  const table = getSelectedPendingTable();
  if (!table?.quickManualMode) {
    confirmSelectedPendingTable();
    return;
  }
  const queueSnapshot = getCurrentPendingTables();
  const currentQueueIndex = queueSnapshot.findIndex((item) => item.id === table.id);
  const publishRows = [];
  table.rows.forEach((row, rowIndex) => {
    const ticket = { table, row, index: rowIndex };
    if (isUnavailableTicket(ticket)) return;
    if (table.publishRows?.[rowIndex] === true && isCustomerPublishableTicket(ticket)) publishRows.push(row);
  });
  if (publishRows.length) {
    const publishedTable = createPublishedTableFromRows(table, publishRows);
    currentEvent.tables.unshift(publishedTable);
    uploadedTables.unshift(publishedTable);
  }
  const index = pendingTables.findIndex((item) => item.id === table.id);
  if (index >= 0) pendingTables.splice(index, 1);
  selectFirstDateWithTickets();
  selectNextPendingTableAfterPublish(queueSnapshot, currentQueueIndex);
  const matchedRows = countZoneRowsFromTables();
  const messageText = publishRows.length ? `${table.title} · 已提交 ${publishRows.length} 条上传票` : `${table.title} · 本页全部下架，已跳过`;
  const matchMessage = getPublishMatchMessage(messageText, matchedRows);
  setUploadStatus(matchMessage.text, matchMessage.type);
  showToast(publishRows.length ? matchMessage.toast : "本页已处理，进入下一页。", publishRows.length ? matchMessage.type : "success");
  renderUploadRecords();
  renderReviewPanel();
  renderPublishedTables();
  renderAdminEvent();
  window.setTimeout(render, 0);
  saveAndArchiveAppStep(`快速提交本页：${table.title} · ${publishRows.length} 条上传`, "发布");
}

function getVisibleReviewRowIndexes(table) {
  if (!table) return [];
  return table.rows
    .map((row, index) => ({ row, index }))
    .filter(({ row, index }) => !isUnavailableTicket({ table, row, index }))
    .map(({ index }) => index);
}

function markAllReviewRowsSkipDraft(table) {
  const rowIndexes = getVisibleReviewRowIndexes(table);
  if (!table || !rowIndexes.length) {
    showToast("当前没有可批量设置的票。", "error");
    return;
  }
  pushReviewSnapshot(table, "全部改为不发布前");
  table.publishRows = table.publishRows || {};
  table.manualPublishRows = table.manualPublishRows || {};
  table.manualSkipRows = table.manualSkipRows || {};
  rowIndexes.forEach((rowIndex) => {
    table.publishRows[rowIndex] = false;
    delete table.manualPublishRows[rowIndex];
    table.manualSkipRows[rowIndex] = true;
  });
  table.bulkSkipDraft = true;
  table.aiReviewStatus = `已把 ${rowIndexes.length} 条候选票全部改为“不发布”。你可以把少数可上架的票反选成“发布到前台”，最后点右上角“确认并发布”。`;
  renderReviewPanel(rowIndexes[0]);
  saveAndArchiveAppStep(`批量设为不发布：${rowIndexes.length} 条`, "校对");
  showToast("已全部改为不发布，可反选少量上架。", "success");
}

function markAllReviewRowsPublishDraft(table) {
  if (!table || !Array.isArray(table.rows) || !table.rows.length) {
    showToast("当前没有可批量设置的票。", "error");
    return;
  }
  pushReviewSnapshot(table, "全部改为上传前");
  table.publishRows = table.publishRows || {};
  table.manualPublishRows = table.manualPublishRows || {};
  table.manualSkipRows = table.manualSkipRows || {};
  let changedRows = 0;
  table.rows.forEach((row, rowIndex) => {
    clearUnavailableMarkersFromRow(table, rowIndex);
    const ticket = { table, row: table.rows[rowIndex], index: rowIndex };
    if (!isCustomerPublishableTicket(ticket)) return;
    table.publishRows[rowIndex] = true;
    table.manualPublishRows[rowIndex] = true;
    delete table.manualSkipRows[rowIndex];
    changedRows += 1;
  });
  table.bulkSkipDraft = false;
  updatePendingTableReviewFlags(table);
  renderUploadRecords();
  renderReviewPanel(0);
  saveAndArchiveAppStep(`批量设为上传：${changedRows} 条`, "校对");
  showToast(`已把 ${changedRows} 条改为上传。`, "success");
}

function createPublishedTableFromRows(table, rows, suffix = "") {
  ensureOriginalTableSnapshot(table);
  const sourceIndexes = rows.map((row) => table.rows.findIndex((candidate) => candidate === row));
  const originalRows = rows.map((row, index) => {
    const sourceIndex = sourceIndexes[index];
    return [...(sourceIndex >= 0 && table.originalRows?.[sourceIndex] ? table.originalRows[sourceIndex] : row)];
  });
  const rowColorRows = sourceIndexes
    .map((sourceIndex) => (sourceIndex >= 0 && Array.isArray(table.rowColorRows) && table.rowColorRows[sourceIndex] ? { ...table.rowColorRows[sourceIndex] } : null))
    .filter(Boolean);
  const rowColorSourceIndexes = sourceIndexes
    .map((sourceIndex) =>
      sourceIndex >= 0 && Array.isArray(table.rowColorSourceIndexes) && table.rowColorSourceIndexes[sourceIndex] !== undefined
        ? table.rowColorSourceIndexes[sourceIndex]
        : null,
    )
    .filter((value) => value !== null);
  const ppStructureTicketRowMatches = sourceIndexes
    .map((sourceIndex, nextIndex) => {
      const match = getPpStructureMatchForTicket(table, sourceIndex);
      return match ? { ...clonePpStructureMatch(match), ticketRowIndex: nextIndex } : null;
    })
    .filter(Boolean);
  return {
    ...table,
    id: `${table.id}-published-${Date.now()}${suffix}`,
    title: suffix ? `${table.title} · 已发布${suffix}` : table.title,
    rows: rows.map((row) => [...row]),
    originalColumns: Array.isArray(table.originalColumns) ? [...table.originalColumns] : [...(table.columns || [])],
    originalRows,
    publishRows: {},
    reviewedRows: {},
    userEditedRows: {},
    aiReviewDecisions: [],
    rowColorRows: rowColorRows.length === rows.length ? rowColorRows : [],
    rowColorSourceIndexes: rowColorSourceIndexes.length === rows.length ? rowColorSourceIndexes : null,
    rowColorSourceIndexMode: table.rowColorSourceIndexMode || "",
    ppStructureAnalysis: compactPpStructureAnalysis(table.ppStructureAnalysis),
    ppStructureTicketRowMatches: ppStructureTicketRowMatches.length === rows.length ? ppStructureTicketRowMatches : [],
    ppStructureMessage: ppStructureTicketRowMatches.length ? getPpStructureMatchSummary({ ppStructureTicketRowMatches }) : table.ppStructureMessage || "",
    rowColorSoldTextAnchor: table.rowColorSoldTextAnchor
      ? {
          soldNonWhiteCount: Number(table.rowColorSoldTextAnchor.soldNonWhiteCount || 0),
          labels: Array.isArray(table.rowColorSoldTextAnchor.labels) ? [...table.rowColorSoldTextAnchor.labels] : [],
        }
      : null,
    rowColorReliable: rowColorRows.length === rows.length ? table.rowColorReliable : false,
    rowColorConfirmed: rowColorRows.length === rows.length ? table.rowColorConfirmed : false,
    rowColorExactRowAligned: rowColorRows.length === rows.length ? table.rowColorExactRowAligned : false,
    rowColorActionableConflict: rowColorRows.length === rows.length ? table.rowColorActionableConflict : false,
    rowColorAutoApplied: rowColorRows.length === rows.length ? table.rowColorAutoApplied : false,
    needsManualReview: false,
    reviewReasons: [],
  };
}

function keepPendingRows(table, rows) {
  ensureOriginalTableSnapshot(table);
  const previousRows = table.rows || [];
  const previousOriginalRows = table.originalRows || [];
  const previousPublishRows = { ...(table.publishRows || {}) };
  const previousManualPublishRows = { ...(table.manualPublishRows || {}) };
  const previousManualSkipRows = { ...(table.manualSkipRows || {}) };
  const previousReviewedRows = { ...(table.reviewedRows || {}) };
  const previousUserEditedRows = { ...(table.userEditedRows || {}) };
  const previousRowColorRows = Array.isArray(table.rowColorRows) ? table.rowColorRows : [];
  const previousRowColorSourceIndexes = Array.isArray(table.rowColorSourceIndexes) ? table.rowColorSourceIndexes : [];
  const previousRowColorSourceIndexMode = table.rowColorSourceIndexMode || "";
  const nextPublishRows = {};
  const nextManualPublishRows = {};
  const nextManualSkipRows = {};
  const nextReviewedRows = {};
  const nextUserEditedRows = {};
  const nextRowColorRows = [];
  const nextRowColorSourceIndexes = [];
  const originalRows = rows.map((row, nextIndex) => {
    const sourceIndex = previousRows.findIndex((candidate) => candidate === row);
    if (sourceIndex >= 0) {
      if (previousPublishRows[sourceIndex] !== undefined) nextPublishRows[nextIndex] = previousPublishRows[sourceIndex];
      if (previousManualPublishRows[sourceIndex] !== undefined) nextManualPublishRows[nextIndex] = previousManualPublishRows[sourceIndex];
      if (previousManualSkipRows[sourceIndex] !== undefined) nextManualSkipRows[nextIndex] = previousManualSkipRows[sourceIndex];
      if (previousReviewedRows[sourceIndex] !== undefined) nextReviewedRows[nextIndex] = previousReviewedRows[sourceIndex];
      if (previousUserEditedRows[sourceIndex] !== undefined) nextUserEditedRows[nextIndex] = previousUserEditedRows[sourceIndex];
      if (previousRowColorRows[sourceIndex]) nextRowColorRows[nextIndex] = { ...previousRowColorRows[sourceIndex] };
      if (previousRowColorSourceIndexes[sourceIndex] !== undefined) nextRowColorSourceIndexes[nextIndex] = previousRowColorSourceIndexes[sourceIndex];
    }
    return [...(sourceIndex >= 0 && previousOriginalRows?.[sourceIndex] ? previousOriginalRows[sourceIndex] : row)];
  });
  table.rows = rows.map((row) => [...row]);
  table.originalRows = originalRows;
  table.publishRows = nextPublishRows;
  table.manualPublishRows = nextManualPublishRows;
  table.manualSkipRows = nextManualSkipRows;
  table.reviewedRows = nextReviewedRows;
  table.userEditedRows = nextUserEditedRows;
  if (Array.isArray(table.rowColorRows)) table.rowColorRows = nextRowColorRows;
  if (Array.isArray(table.rowColorSourceIndexes)) table.rowColorSourceIndexes = nextRowColorSourceIndexes;
  table.rowColorSourceIndexMode = previousRowColorSourceIndexMode;
  table.aiReviewDecisions = [];
  table.bulkSkipDraft = false;
  updatePendingTableReviewFlags(table);
}

function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

const reviewSourceAvailableUrls = new Set();
const reviewSourceMissingUrls = new Set();
const reviewSourceCheckingUrls = new Set();
const reviewSourceCheckedAt = new Map();
const REVIEW_SOURCE_CHECK_TTL = 8000;

function getReviewSourceCheckUrl(sourceUrl) {
  const url = String(sourceUrl || "").trim().split("#")[0];
  return url && !url.startsWith("data:") ? url : "";
}

function isLocalUploadedReviewSource(url) {
  return /^\.?\/?uploads\//.test(String(url || "").trim());
}

async function assertReviewSourceReadable(response, url) {
  if (!response.ok) throw new Error(`source ${response.status}`);
  const contentType = String(response.headers.get("content-type") || "");
  if (!/text\/plain|text\/html|application\/json/i.test(contentType)) return;
  const bodyResponse = await fetch(url, { method: "GET", cache: "no-store" });
  if (!bodyResponse.ok) throw new Error(`source ${bodyResponse.status}`);
  const text = await bodyResponse.text().catch(() => "");
  if (/^\s*Not found\b/i.test(text.slice(0, 256))) throw new Error("source not found body");
}

function ensureReviewSourceAvailability(sourceUrl) {
  const url = getReviewSourceCheckUrl(sourceUrl);
  if (!url || reviewSourceCheckingUrls.has(url)) return;
  if (isLocalUploadedReviewSource(url)) {
    reviewSourceMissingUrls.delete(url);
    reviewSourceAvailableUrls.add(url);
    reviewSourceCheckedAt.set(url, Date.now());
    return;
  }
  const lastCheckedAt = reviewSourceCheckedAt.get(url) || 0;
  if (reviewSourceAvailableUrls.has(url) && Date.now() - lastCheckedAt < REVIEW_SOURCE_CHECK_TTL) return;
  reviewSourceAvailableUrls.delete(url);
  reviewSourceCheckingUrls.add(url);
  fetch(url, { method: "HEAD", cache: "no-store" })
    .then((response) => assertReviewSourceReadable(response, url))
    .then(() => {
      reviewSourceMissingUrls.delete(url);
      reviewSourceCheckedAt.set(url, Date.now());
      if (!reviewSourceAvailableUrls.has(url)) {
        reviewSourceAvailableUrls.add(url);
        renderReviewPanel(pendingReviewFocusRowIndex);
      }
    })
    .catch(() => {
      reviewSourceAvailableUrls.delete(url);
      reviewSourceCheckedAt.set(url, Date.now());
      if (!reviewSourceMissingUrls.has(url)) {
        reviewSourceMissingUrls.add(url);
        renderReviewPanel(pendingReviewFocusRowIndex);
      }
    })
    .finally(() => {
      reviewSourceCheckingUrls.delete(url);
    });
}

function isReviewSourceMissing(sourceUrl) {
  const url = getReviewSourceCheckUrl(sourceUrl);
  return !sourceUrl || (url && reviewSourceMissingUrls.has(url));
}

function isReviewSourceWaiting(sourceUrl) {
  const url = getReviewSourceCheckUrl(sourceUrl);
  if (isLocalUploadedReviewSource(url)) return false;
  return Boolean(url && !reviewSourceAvailableUrls.has(url) && !reviewSourceMissingUrls.has(url));
}

function renderReviewSourceChecking(sourceUrl) {
  const source = String(sourceUrl || "").split("#")[0];
  return `
    <div class="review-source-missing checking">
      <strong>正在检查原始文件</strong>
      <p>当前记录指向 ${escapeHtml(source || "空地址")}，正在确认本地开发服务器能不能读取。</p>
    </div>
  `;
}

function renderReviewSourceMissing(table, sourceUrl) {
  const source = String(sourceUrl || table?.originalImage || "").split("#")[0];
  return `
    <div class="review-source-missing">
      <strong>原始文件暂时找不到</strong>
      <p>当前记录指向 ${escapeHtml(source || "空地址")}，但本地开发服务器没有读到这个文件。</p>
      <p>常见原因是 PDF 被移动、清理，或者 iCloud 把 uploads 里的原文件变成了 .icloud 占位文件。请把这份 PDF 下载回本机，或重新上传一次。</p>
    </div>
  `;
}

async function getReviewSourceDataUrl(table) {
  const source = table?.originalImage || "";
  if (source.startsWith("data:")) return source;
  if (!source) return "";
  const response = await fetch(source);
  if (!response.ok) throw new Error("原图/PDF 无法读取，请重新上传文件后再试。");
  return blobToDataUrl(await response.blob());
}

function shouldAutoRepairRowColors(table) {
  if (!AUTO_REPAIR_ROW_COLORS_ON_REVIEW_OPEN && table?.forceRowColorRepair !== true) return false;
  if (!table || !Array.isArray(table.rows) || !table.rows.length) return false;
  const hasFreshRowColorLogic = Number(table.rowColorLogicVersion || 0) === ROW_COLOR_LOGIC_VERSION;
  if (hasFreshRowColorLogic && table.rowColorSource === "ai_row_color") return false;
  if (hasFreshRowColorLogic && (table._rowColorRepairing || table._rowColorRepairDone || table._rowColorRepairTried)) return false;
  if (isVisualRowColorSource(table) && hasFreshRowColorLogic) {
    const hasAnyAutoSkip = table.rows.some((row, rowIndex) => isColorMarkedSoldTicket({ table, row, index: rowIndex }));
    if (hasAnyAutoSkip || !hasAnyOpenCvWhiteAndColoredConflict(table)) return false;
  }
  if (!isPdfTableSource(table) && !String(table.originalType || "").startsWith("image/")) return false;
  if (!table.originalImage) return false;
  return true;
}

function hasPageWideSequenceColumn(table) {
  const rows = Array.isArray(table?.rows) ? table.rows : [];
  const numbers = getVisibleSourceSequenceNumbers(table);
  if (!rows.length || numbers.length !== rows.length) return false;
  const min = Math.min(...numbers);
  const max = Math.max(...numbers);
  return max > rows.length && max <= Math.max(rows.length + 12, rows.length * 4) && max - min + 1 <= Math.max(rows.length + 12, rows.length * 4);
}

function getMaxPageWideSequenceNumber(table) {
  if (!hasPageWideSequenceColumn(table)) return 0;
  const numbers = (table.rows || [])
    .map((row) => String(row?.[0] || "").trim())
    .filter((value) => /^\d{1,4}$/.test(value))
    .map(Number);
  return numbers.length ? Math.max(...numbers) : 0;
}

function getRowColorExpectedRowsForPendingTable(table) {
  const rowCount = Array.isArray(table?.rows) ? table.rows.length : 0;
  const sourceIndexes = ensurePendingTableSourceRowIndexes(table);
  const maxSourceIndex = sourceIndexes
    .map((value) => Number(value))
    .filter((value) => Number.isInteger(value) && value >= 0)
    .reduce((max, value) => Math.max(max, value), -1);
  if (isPdfTableSource(table) && rowCount > 0 && maxSourceIndex + 1 > rowCount) return maxSourceIndex + 1;
  const maxSequence = getMaxPageWideSequenceNumber(table);
  if (isPdfTableSource(table) && rowCount > 0 && maxSequence > rowCount) return maxSequence;
  return rowCount;
}

function waitForPendingTableRowColorRepair(table) {
  if (!table?._rowColorRepairing) return Promise.resolve(false);
  return new Promise((resolve) => {
    const startedAt = Date.now();
    const check = () => {
      if (!table._rowColorRepairing) {
        resolve(true);
        return;
      }
      if (Date.now() - startedAt > 8000) {
        resolve(false);
        return;
      }
      window.setTimeout(check, 100);
    };
    check();
  });
}

function shouldEscalateRowColorAnalysisToAi(table, analysis) {
  if (!table || table.rowColorSource === "ai_row_color") return false;
  const rowCount = Array.isArray(table.rows) ? table.rows.length : 0;
  if (!rowCount || rowCount > 80) return false;
  if (!analysis || !Array.isArray(analysis.rows)) return true;
  const labels = uniqueCleanValues((analysis.labels || analysis.rows.map((row) => row?.label || row?.rawLabel)).map(normalizeRowColorLabel).filter(Boolean));
  if (analysis.reliable === true && analysis.exactRowAligned === true && !(Array.isArray(analysis.lowConfidenceRows) && analysis.lowConfidenceRows.length)) return false;
  const hasWhite = labels.some(isAvailableRowColorLabel);
  const hasNonWhite = labels.some((label) => label && !isAvailableRowColorLabel(label));
  if (analysis.reliable !== true || analysis.exactRowAligned !== true) return true;
  if (Array.isArray(analysis.lowConfidenceRows) && analysis.lowConfidenceRows.length) return true;
  if (hasWhite && hasNonWhite) return true;
  return false;
}

async function requestAiRowColorAnalysisForTable(table, sourcePayload) {
  const response = await fetch("/api/tables/analyze-row-colors-ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...sourcePayload,
      sourcePage: table.sourcePage || 1,
      columns: table.columns,
      rows: table.rows,
    }),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.message || result.error || "AI 视觉复核失败。");
  if (!result.rowColorAnalysis) throw new Error("AI 视觉复核没有返回逐行结果。");
  return result.rowColorAnalysis;
}

async function requestAnchorRowColorAnalysisForTable(table, sourcePayload) {
  const response = await fetch("/api/tables/analyze-row-colors-anchor", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...sourcePayload,
      sourcePage: table.sourcePage || 1,
      columns: table.columns,
      rows: table.rows,
    }),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.message || result.error || "文字锚点取色失败。");
  if (!result.rowColorAnalysis) throw new Error("文字锚点取色没有返回逐行结果。");
  return result.rowColorAnalysis;
}

async function requestAnchorRowColorAnalysesForTables(tables, sourcePayload) {
  const payloadTables = (tables || [])
    .map((table) => ({
      sourcePage: table.sourcePage || 1,
      columns: table.columns || [],
      rows: table.rows || [],
    }))
    .filter((table) => Array.isArray(table.rows) && table.rows.length > 0 && table.rows.length <= 80);
  if (!payloadTables.length) return {};
  const response = await fetch("/api/tables/analyze-row-colors-anchor-batch", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...sourcePayload,
      tables: payloadTables,
    }),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.message || result.error || "批量文字锚点取色失败。");
  return result.rowColorAnalyses && typeof result.rowColorAnalyses === "object" ? result.rowColorAnalyses : {};
}

function queuePendingTableRowColorRepair(table) {
  if (!shouldAutoRepairRowColors(table) || table._rowColorRepairQueued) return false;
  table._rowColorRepairQueued = true;
  runWhenPageIdle(() => {
    table._rowColorRepairQueued = false;
    if (shouldAutoRepairRowColors(table)) {
      repairPendingTableRowColors(table);
    }
  }, 1800);
  return true;
}

async function repairPendingTableRowColors(table) {
  if (!shouldAutoRepairRowColors(table)) return false;
  table._rowColorRepairing = true;
  table._rowColorRepairTried = true;
  const wasLightReview = table.lightReviewFlags === true;
  table.rowColorMessage = "正在用文字锚点定位原图票行底色...";
  renderUploadRecords({ normalize: false });
  try {
    const source = String(table.originalImage || "");
    const sourcePayload = source.startsWith("uploads/") ? { sourceUrl: source } : { image: await getReviewSourceDataUrl(table) };
    let response = { ok: true };
    let result;
    let anchorError = null;
    try {
      const anchorAnalysis = await requestAnchorRowColorAnalysisForTable(table, sourcePayload);
      if (anchorAnalysis?.reliable === true && anchorAnalysis?.exactRowAligned === true && anchorAnalysis?.autoApplyAllowed === true) {
        result = { rowColorAnalysis: anchorAnalysis };
      } else {
        anchorError = new Error(anchorAnalysis?.error || "文字锚点未能一一匹配全部票行。");
      }
    } catch (error) {
      anchorError = error;
    }
    if (!result) {
      try {
        table.rowColorMessage = "文字锚点未能稳定定位全部票行，正在用 AI 视觉复核...";
        renderReviewPanel(undefined, { normalize: false });
        result = { rowColorAnalysis: await requestAiRowColorAnalysisForTable(table, sourcePayload) };
        result.rowColorAnalysis.anchorFallbackError = anchorError?.message || "文字锚点未能一一匹配全部票行。";
      } catch (aiError) {
      table.rowColorMessage = "文字锚点/AI 视觉复核失败，改用像素颜色参考，不自动覆盖规则...";
      renderReviewPanel(undefined, { normalize: false });
      response = await fetch("/api/tables/analyze-row-colors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...sourcePayload,
          sourcePage: table.sourcePage || 1,
          expectedRows: getRowColorExpectedRowsForPendingTable(table),
        }),
      });
      result = await response.json().catch(() => ({}));
      if (result.rowColorAnalysis) {
        result.rowColorAnalysis = {
          ...result.rowColorAnalysis,
          aiFallbackError: [anchorError?.message, aiError.message || "AI 视觉复核失败。"].filter(Boolean).join("；"),
        };
      }
      }
    }
    if (!response.ok) throw new Error(result.message || result.error || "行底色重新检测失败。");
    const analysis = result.rowColorAnalysis;
    if (!analysis) throw new Error("行底色重新检测没有返回结果。");
    table.rowColorSparseSourceRepair = isPdfTableSource(table) && getRowColorExpectedRowsForPendingTable(table) > (table.rows?.length || 0);
    const rowColorStart = Math.max(0, Math.floor(Number(table.rowColorAlignedStart ?? table.rowColorPageRowOffset ?? 0) || 0));
    applyOpenCvRowColorsToTable(table, analysis, rowColorStart);
    if (analysis.aiFallbackError) {
      table.rowColorMessage = `${table.rowColorMessage || "像素颜色已保留为参考"}；AI 视觉复核未完成：${analysis.aiFallbackError}`;
    } else if (analysis.anchorFallbackError) {
      table.rowColorMessage = `${table.rowColorMessage || "AI 视觉复核已完成"}；文字锚点未接管：${analysis.anchorFallbackError}`;
    }
    table._rowColorRepairDone = true;
    table._rowColorRepairError = "";
    if (wasLightReview) markPendingTableReviewFlagsLightly(table);
    else updatePendingTableReviewFlags(table);
    renderUploadRecords({ normalize: false });
    renderReviewPanel(undefined, { normalize: false });
    return true;
  } catch (error) {
    table._rowColorRepairError = error.message || "行底色重新检测失败。";
    table.rowColorMessage = table._rowColorRepairError;
    showToast(table._rowColorRepairError, "error");
    renderUploadRecords({ normalize: false });
    renderReviewPanel(undefined, { normalize: false });
    return false;
  } finally {
    table._rowColorRepairing = false;
  }
}

async function requestReviewAiAssist(table, instruction) {
  if (!table || reviewAiBusy) return;
  reviewAiBusy = true;
  table.aiReviewInstruction = instruction;
  table.aiReviewStatus = "AI 正在看原图并生成建议...";
  renderReviewPanel();
  try {
    const source = await getReviewSourceDataUrl(table);
    const samples = table.colorReviewSamples || {};
    const sampleLines = [];
    if (Number.isInteger(samples.soldRow) && table.rows[samples.soldRow]) {
      sampleLines.push(`人工颜色样本：第 ${samples.soldRow + 1} 条票这一整行的底色/样式 = 已售/不发布样本。该样本优先级最高，请用它对比其它行的底色，不要把不同底色行误判成已售。样本行数据：${JSON.stringify(table.rows[samples.soldRow])}`);
    }
    if (Number.isInteger(samples.availableRow) && table.rows[samples.availableRow]) {
      sampleLines.push(`人工颜色样本：第 ${samples.availableRow + 1} 条票这一整行的底色/样式 = 未售/可发布样本。该样本优先级最高，和它相同或接近的白底/浅底行应发布。样本行数据：${JSON.stringify(table.rows[samples.availableRow])}`);
    }
    const assistedInstruction = [instruction, ...sampleLines].filter(Boolean).join("\n");
    const response = await fetch("/api/tables/review-assist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source,
        sourcePage: table.sourcePage || 1,
        columns: table.columns,
        rows: table.rows,
        instruction: assistedInstruction,
      }),
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload.message || payload.error || "AI 辅助校对失败。");
    table.aiReviewDecisions = Array.isArray(payload.decisions) ? payload.decisions : [];
    table.aiReviewStatus = table.aiReviewDecisions.length
      ? `AI 已生成 ${table.aiReviewDecisions.length} 条建议，请核对后再点“应用 AI 建议”。`
      : "AI 没有返回可用建议，请换一种规则描述再试。";
    showToast(table.aiReviewStatus, table.aiReviewDecisions.length ? "success" : "error");
  } catch (error) {
    table.aiReviewStatus = error.message || "AI 辅助校对失败。";
    showToast(table.aiReviewStatus, "error");
  } finally {
    reviewAiBusy = false;
    renderReviewPanel();
    saveAndArchiveAppStep(`生成 AI 校对建议：${table.title || currentEvent.name}`, "AI 校对");
  }
}

function applyReviewAiSuggestions(table) {
  if (!table?.aiReviewDecisions?.length) {
    showToast("当前没有 AI 建议可以应用。", "error");
    return;
  }
  pushReviewSnapshot(table, `应用 AI 建议前：${table.aiReviewInstruction || "未填写规则"}`);
  table.publishRows = table.publishRows || {};
  table.manualPublishRows = table.manualPublishRows || {};
  table.manualSkipRows = table.manualSkipRows || {};
  let publishCount = 0;
  let skipCount = 0;
  table.aiReviewDecisions.forEach((decision) => {
    const rowIndex = Number(decision.row) - 1;
    if (!table.rows[rowIndex]) return;
    const shouldSkip = decision.action !== "publish" || /已售|疑似|下架|复核/.test(String(decision.status || ""));
    if (shouldSkip) {
      table.publishRows[rowIndex] = false;
      delete table.manualPublishRows[rowIndex];
      table.manualSkipRows[rowIndex] = true;
      skipCount += 1;
      return;
    }
    if (table.publishRows[rowIndex] !== false) delete table.publishRows[rowIndex];
    delete table.manualSkipRows[rowIndex];
    publishCount += 1;
  });
  table.aiReviewStatus = `AI 建议已应用：${skipCount} 条设为不发布，${publishCount} 条建议发布但仍需人工逐条点“发布到前台”。已自动保存历史，可随时恢复。`;
  updatePendingTableReviewFlags(table);
  pendingReviewFocusRowIndex = getVisibleReviewRowIndexes(table)[0] ?? null;
  renderUploadRecords();
  renderReviewPanel(pendingReviewFocusRowIndex);
  saveAndArchiveAppStep(`应用 AI 建议：${skipCount} 条不发布、${publishCount} 条候选发布`, "校对");
  showToast("已应用 AI 建议。", "success");
}

function renderQuickManualReviewPanel(table, navigation, navigationLabel) {
  reviewLayout.classList.add("quick-manual-review-layout");
  const source = table.originalImage || "";
  const isPdf = isPdfTableSource(table);
  const page = Number(table.sourcePage || 0);
  const sourceUrl = isPdf && page > 0 ? `${source.split("#")[0]}#page=${page}` : source;
  ensureReviewSourceAvailability(sourceUrl);
  const sourceMissing = isReviewSourceMissing(sourceUrl);
  const sourceWaiting = isReviewSourceWaiting(sourceUrl);
  const sourceRowActionOverlays = getSourceRowActionOverlays(table);
  const hasSourceRowActions = sourceRowActionOverlays.length > 0;
  const hasEstimatedSourceRowActions = sourceRowActionOverlays.some((item) => item.estimated === true);
  const hasMeasuredSourceRowActions = getSourceRowActionOverlays(table, { includeEstimated: false }).length > 0;
  reviewLayout.classList.toggle("source-action-review-layout", hasSourceRowActions);
  const sourceActionStatusText = hasSourceRowActions
    ? hasEstimatedSourceRowActions
      ? "已在原图旁按 OCR 行数贴上逐行按钮；请直接对照原图颜色勾叉。"
      : "已在原图旁生成逐行按钮；请直接对照原图颜色勾叉。"
    : table.rowColorMessage || "";
  if (!hasMeasuredSourceRowActions && !sourceMissing && !sourceWaiting) queueQuickManualRowActionGeometry(table);
  const waitingForSourceRowActions =
    table.quickManualMode &&
    !hasSourceRowActions &&
    !sourceMissing &&
    !sourceWaiting &&
    (table._quickRowActionGeometryQueued || table._quickRowActionGeometryRunning);
  const publishCount = table.rows.filter((row, rowIndex) => {
    return isPendingRowSelectedForPublish(table, rowIndex) && isCustomerPublishableTicket({ table, row, index: rowIndex });
  }).length;
  const skipCount = table.rows.length - publishCount;
  const visibleColumns = getQuickManualDisplayColumns(table);
  const headerCells = visibleColumns.map((column) => `<th>${escapeHtml(column)}</th>`).join("");
  const renderedRows = table.rows.slice(0, MAX_REVIEW_ROWS_RENDERED);
  const hiddenRowCount = Math.max(0, table.rows.length - renderedRows.length);
  const rows = renderedRows
    .map((row, rowIndex) => {
      const ticket = { table, row, index: rowIndex };
      const selectedForPublish = isPendingRowSelectedForPublish(table, rowIndex);
      const publishEligible = isCustomerPublishableTicket(ticket);
      const shouldPublish = selectedForPublish && publishEligible;
      const soldLike = isSoldTicket(ticket);
      const publishBlockReason = selectedForPublish && !publishEligible ? getPendingRowPublishBlockReason(ticket) : "";
      const cells = getQuickManualDisplayRowCells(table, row, rowIndex, visibleColumns)
        .map((value) => `<td>${escapeHtml(value)}</td>`)
        .join("");
      return `
        <tr class="quick-ticket-row ${shouldPublish ? "publish" : "skip"} ${soldLike ? "sold-row" : ""}" data-review-row-index="${rowIndex}">
          <td class="quick-row-number">${rowIndex + 1}</td>
          ${cells || `<td class="review-ticket-empty" colspan="${Math.max(1, visibleColumns.length)}">这一行没有识别到有效内容</td>`}
          <td class="quick-decision-cell">
            <div class="quick-decision-status">${publishBlockReason ? "需修改" : shouldPublish ? "上传" : "下架"}</div>
            <div class="quick-decision-buttons">
              <button class="quick-check-button ${selectedForPublish ? "active" : ""}" type="button" data-quick-row-publish="${rowIndex}" data-publish-value="true" title="上传">✓</button>
              <button class="quick-check-button danger ${!selectedForPublish ? "active" : ""}" type="button" data-quick-row-publish="${rowIndex}" data-publish-value="false" title="下架">×</button>
              <button class="quick-edit-button" type="button" data-edit-review-row="${rowIndex}" title="修改">改</button>
            </div>
            ${publishBlockReason ? `<small>${escapeHtml(publishBlockReason)}</small>` : ""}
          </td>
        </tr>
      `;
    })
    .join("");

  reviewLayout.innerHTML = `
    <div class="manual-review-note ok">
      <strong>快速人工通道</strong>
      <span>只等 OCR 文本；不等 AI 复核。当前只会生成已读到 OCR 文本的页，后面页读完后可再追加生成。</span>
    </div>
    <div class="review-source-panel">
      <div class="review-source-head">
        <span>原始图片/PDF 页面</span>
        <button class="small-button ghost" type="button" data-review-source="${table.id}">放大查看</button>
      </div>
      <strong>${escapeHtml(getTableSourceSummary(table))}</strong>
      ${sourceActionStatusText ? `<p class="review-source-action-status">${escapeHtml(sourceActionStatusText)}</p>` : ""}
      <div class="review-source-with-actions">
        ${renderReviewSourceMedia(table, sourceUrl, { sourceMissing, sourceWaiting, isPdf, page })}
      </div>
    </div>
    <div class="review-ticket-list quick-manual-list">
      <div class="review-ticket-list-head">
        <div>
          <strong>快速逐行选择</strong>
          <span data-quick-manual-counts>当前上传 ${publishCount} 条 / 下架 ${skipCount} 条。</span>
        </div>
        <div class="review-bulk-actions">
          <button class="small-button ghost" type="button" data-quick-mark-all-publish>一键全打勾</button>
          <button class="small-button ghost danger" type="button" data-quick-mark-all-skip>一键全打叉</button>
          <button class="small-button ghost" type="button" data-quick-invert-selection>反选</button>
          <button class="small-button ghost" type="button" data-cache-review-page-next>保存并下一页</button>
          <button class="small-button" type="button" data-quick-submit-page>提交本页并下一页</button>
          <button class="small-button" type="button" data-quick-submit-all>全部提交已选择</button>
        </div>
      </div>
      <div class="review-table-nav">
        <button class="small-button ghost" type="button" data-review-table-nav="prev" ${navigation.previous ? "" : "disabled"}>上一页</button>
        <span>${escapeHtml(navigationLabel)}</span>
        <button class="small-button ghost" type="button" data-review-table-nav="next" ${navigation.next ? "" : "disabled"}>下一页</button>
      </div>
      ${
        hasSourceRowActions
          ? `<div class="review-ticket-limit-note">${hasEstimatedSourceRowActions ? "本页已先按 OCR 行数生成原图贴行按钮；请对照原图颜色快速勾叉。" : "本页已启用原图贴行按钮；下方表格已隐藏，减少来回对齐。"}</div>`
          : waitingForSourceRowActions
            ? `<div class="review-ticket-limit-note">正在定位原图逐行按钮；定位完成后会直接贴在原图右侧。</div>`
          : hiddenRowCount
            ? `<div class="review-ticket-limit-note">正在尝试生成原图贴行按钮；本页先显示前 ${MAX_REVIEW_ROWS_RENDERED} 条，剩余 ${hiddenRowCount} 条仍保留在待确认表里。</div>`
            : ""
      }
      ${
        !hasSourceRowActions && !waitingForSourceRowActions && rows
          ? `<div class="quick-table-wrap">
              <table class="quick-decision-table">
                <thead>
                  <tr>
                    <th class="quick-row-number">#</th>
                    ${headerCells || `<th>票源</th>`}
                    <th class="quick-decision-head">操作</th>
                  </tr>
                </thead>
                <tbody>${rows}</tbody>
              </table>
            </div>`
          : !hasSourceRowActions && !waitingForSourceRowActions
            ? `<div class="empty-state">这张表没有识别到票源行。</div>`
            : ""
      }
      <div class="quick-submit-footer">
        <button class="small-button ghost" type="button" data-cache-review-page>保存本页</button>
        <button class="small-button ghost" type="button" data-cache-review-page-next>保存并下一页</button>
        <button class="small-button ghost" type="button" data-cache-all-review-choices>保存全部已选</button>
        <button class="small-button ghost" type="button" data-quick-submit-page>提交本页并下一页</button>
        <button class="small-button" type="button" data-quick-submit-all>全部提交已选择</button>
      </div>
    </div>
  `;
}

function renderQuickCheckTablePanel(table) {
  const publishCount = table.rows.filter((row, rowIndex) => {
    return isPendingRowSelectedForPublish(table, rowIndex) && isCustomerPublishableTicket({ table, row, index: rowIndex });
  }).length;
  const skipCount = table.rows.length - publishCount;
  const visibleColumns = getQuickManualDisplayColumns(table);
  const headerCells = visibleColumns.map((column) => `<th>${escapeHtml(column)}</th>`).join("");
  const renderedRows = table.rows.slice(0, MAX_REVIEW_ROWS_RENDERED);
  const hiddenRowCount = Math.max(0, table.rows.length - renderedRows.length);
  const rows = renderedRows
    .map((row, rowIndex) => {
      const ticket = { table, row, index: rowIndex };
      const selectedForPublish = isPendingRowSelectedForPublish(table, rowIndex);
      const publishEligible = isCustomerPublishableTicket(ticket);
      const shouldPublish = selectedForPublish && publishEligible;
      const soldLike = isSoldTicket(ticket);
      const publishBlockReason = selectedForPublish && !publishEligible ? getPendingRowPublishBlockReason(ticket) : "";
      const cells = getQuickManualDisplayRowCells(table, row, rowIndex, visibleColumns)
        .map((value) => `<td>${escapeHtml(value)}</td>`)
        .join("");
      return `
        <tr class="quick-ticket-row ${shouldPublish ? "publish" : "skip"} ${soldLike ? "sold-row" : ""}" data-review-row-index="${rowIndex}">
          <td class="quick-row-number">${rowIndex + 1}</td>
          ${cells || `<td class="review-ticket-empty" colspan="${Math.max(1, visibleColumns.length)}">这一行没有识别到有效内容</td>`}
          <td class="quick-decision-cell">
            <div class="quick-decision-status">${publishBlockReason ? "需修改" : shouldPublish ? "上传" : "下架"}</div>
            <div class="quick-decision-buttons">
              <button class="quick-check-button ${selectedForPublish ? "active" : ""}" type="button" data-quick-row-publish="${rowIndex}" data-publish-value="true" title="上传">✓</button>
              <button class="quick-check-button danger ${!selectedForPublish ? "active" : ""}" type="button" data-quick-row-publish="${rowIndex}" data-publish-value="false" title="下架">×</button>
              <button class="quick-edit-button" type="button" data-edit-review-row="${rowIndex}" title="修改">改</button>
            </div>
            ${publishBlockReason ? `<small>${escapeHtml(publishBlockReason)}</small>` : ""}
          </td>
        </tr>
      `;
    })
    .join("");
  return `
    <div class="review-quick-table-panel">
      <div class="review-ticket-list-head">
        <div>
          <strong>表格快速检查</strong>
          <span data-quick-manual-counts>当前上传 ${publishCount} 条 / 下架 ${skipCount} 条。</span>
        </div>
        <div class="review-bulk-actions">
          <button class="small-button ghost" type="button" data-quick-mark-all-publish>一键全打勾</button>
          <button class="small-button ghost danger" type="button" data-quick-mark-all-skip>一键全打叉</button>
          <button class="small-button ghost" type="button" data-quick-invert-selection>反选</button>
        </div>
      </div>
      ${hiddenRowCount ? `<div class="review-ticket-limit-note">本页先显示前 ${MAX_REVIEW_ROWS_RENDERED} 条，剩余 ${hiddenRowCount} 条仍保留在待确认表里。</div>` : ""}
      ${
        rows
          ? `<div class="quick-table-wrap">
              <table class="quick-decision-table">
                <thead>
                  <tr>
                    <th class="quick-row-number">#</th>
                    ${headerCells || `<th>票源</th>`}
                    <th class="quick-decision-head">操作</th>
                  </tr>
                </thead>
                <tbody>${rows}</tbody>
              </table>
            </div>`
          : `<div class="empty-state">这张表没有识别到票源行。</div>`
      }
      <div class="quick-submit-footer review-cache-footer">
        <button class="small-button ghost" type="button" data-cache-review-page>保存本页</button>
        <button class="small-button ghost" type="button" data-cache-review-page-next>保存并下一页</button>
        <button class="small-button ghost" type="button" data-cache-all-review-choices>保存全部已选</button>
      </div>
    </div>
  `;
}

function getRowActionOverlayBox(item) {
  const box = item?.rowBox || item?.row_box || item?.bbox || item?.sampleBox || item || null;
  if (!box || typeof box !== "object") return null;
  const y1 = Number(box.y1 ?? box.top ?? box.y ?? NaN);
  const y2 = Number(box.y2 ?? box.bottom ?? (Number.isFinite(y1) ? y1 + Number(box.height || 0) : NaN));
  const x1 = Number(box.x1 ?? box.left ?? box.x ?? NaN);
  const x2 = Number(box.x2 ?? box.right ?? (Number.isFinite(x1) ? x1 + Number(box.width || 0) : NaN));
  if (!Number.isFinite(y1) || !Number.isFinite(y2) || y2 <= y1) return null;
  return {
    y1,
    y2,
    x1: Number.isFinite(x1) ? x1 : null,
    x2: Number.isFinite(x2) ? x2 : null,
  };
}

function getEstimatedQuickManualRowActionOverlays(table) {
  if (!table?.quickManualMode || !Array.isArray(table.rows) || !table.rows.length) return [];
  const count = Math.min(table.rows.length, MAX_REVIEW_ROWS_RENDERED);
  const defaultStartPct = count >= 20 ? 10.8 : 16;
  const defaultEndPct = count >= 20 ? 93.2 : 88;
  const startPct = Number.isFinite(Number(table.rowActionEstimatedStartPct)) ? Number(table.rowActionEstimatedStartPct) : defaultStartPct;
  const endPct = Number.isFinite(Number(table.rowActionEstimatedEndPct)) ? Number(table.rowActionEstimatedEndPct) : defaultEndPct;
  const usableSpan = Math.max(20, endPct - startPct);
  const pitch = usableSpan / Math.max(1, count);
  const heightPct = Math.max(1.4, Math.min(4.8, pitch * 0.76));
  return table.rows.slice(0, count).map((row, rowIndex) => {
    const selectedForPublish = isPendingRowSelectedForPublish(table, rowIndex);
    const ticket = { table, row, index: rowIndex };
    const shouldPublish = selectedForPublish && isCustomerPublishableTicket(ticket);
    return {
      rowIndex,
      topPct: Math.max(0, Math.min(100, startPct + pitch * (rowIndex + 0.5))),
      heightPct,
      selectedForPublish,
      shouldPublish,
      actionLeftCss: "calc(100% + 6px)",
      estimated: true,
    };
  });
}

function getSourceRowActionOverlays(table, { includeEstimated = true } = {}) {
  if (!table || !Array.isArray(table.rows)) return [];
  if (!Array.isArray(table.rowColorRows)) return includeEstimated ? getEstimatedQuickManualRowActionOverlays(table) : [];
  if (table.quickManualMode && Number(table.rowActionGeometryVersion || 0) !== ROW_ACTION_GEOMETRY_VERSION) {
    return includeEstimated ? getEstimatedQuickManualRowActionOverlays(table) : [];
  }
  const sourceRows = table.rowColorRows;
  if (sourceRows.length < table.rows.length) return includeEstimated ? getEstimatedQuickManualRowActionOverlays(table) : [];
  if (table.quickManualMode && !sourceRows.slice(0, table.rows.length).every((item) => item?.rowActionGeometry === true)) {
    return includeEstimated ? getEstimatedQuickManualRowActionOverlays(table) : [];
  }
  let imageHeight = Number(table.rowColorImageHeight || 0);
  if (!imageHeight) {
    const maxY = Math.max(
      0,
      ...sourceRows.map((item) => {
        const box = getRowActionOverlayBox(item);
        return box ? box.y2 : 0;
      }),
    );
    imageHeight = maxY > 0 ? maxY * 1.04 : 0;
  }
  if (!imageHeight) return includeEstimated ? getEstimatedQuickManualRowActionOverlays(table) : [];
  const overlays = table.rows
    .slice(0, MAX_REVIEW_ROWS_RENDERED)
    .map((row, rowIndex) => {
      const item = sourceRows[rowIndex] || {};
      const box = getRowActionOverlayBox(item);
      if (!box) return null;
      const centerPct = Math.max(0, Math.min(100, (((box.y1 + box.y2) / 2) / imageHeight) * 100));
      const heightPct = Math.max(0.8, Math.min(7, ((box.y2 - box.y1) / imageHeight) * 100));
      const imageWidth = Math.max(1, Number(table.rowColorImageWidth || 0) || Number(box.x2 || 0) || 1);
      const rowRightPct = Number.isFinite(box.x2) ? ((box.x2 || 0) / imageWidth) * 100 : NaN;
      const selectedForPublish = isPendingRowSelectedForPublish(table, rowIndex);
      const ticket = { table, row, index: rowIndex };
      const shouldPublish = selectedForPublish && isCustomerPublishableTicket(ticket);
      return {
        rowIndex,
        topPct: centerPct,
        heightPct,
        selectedForPublish,
        shouldPublish,
        actionLeftCss: Number.isFinite(rowRightPct) && rowRightPct < 88 ? `${Math.max(0, rowRightPct + 0.6)}%` : "calc(100% + 6px)",
      };
    })
    .filter(Boolean);
  return overlays.length ? overlays : includeEstimated ? getEstimatedQuickManualRowActionOverlays(table) : [];
}

function getReviewSourceImageUrlForRowActions(sourceUrl, isPdf, page) {
  if (!isPdf) return sourceUrl;
  const source = normalizeUploadSourceReference(sourceUrl);
  if (!source) return "";
  return `/api/source/page-image?source=${encodeURIComponent(source)}&page=${encodeURIComponent(String(Math.max(1, Number(page || 1))))}`;
}

function normalizeUploadSourceReference(value) {
  const raw = String(value || "").split("#")[0].trim();
  if (!raw) return "";
  if (raw.startsWith("uploads/")) return raw;
  if (raw.startsWith("/uploads/")) return raw.slice(1);
  try {
    const url = new URL(raw, window.location.href);
    const path = decodeURIComponent(url.pathname || "").replace(/^\/+/, "");
    return path.startsWith("uploads/") ? path : "";
  } catch (error) {
    return "";
  }
}

function applyRowActionGeometryToTable(table, analysis) {
  if (!table || !Array.isArray(table.rows) || !analysis || !Array.isArray(analysis.rows)) return false;
  const aligned = getAlignedOpenCvRowsForTable(table, analysis.rows, 0);
  if (!aligned.rows?.length || aligned.rows.length !== table.rows.length) {
    return applyInterpolatedRowActionGeometryToTable(table, analysis);
  }
  table.rowColorSource = "quick_manual_row_geometry";
  table.rowColorLogicVersion = ROW_COLOR_LOGIC_VERSION;
  table.rowActionGeometryVersion = ROW_ACTION_GEOMETRY_VERSION;
  table.rowColorImageWidth = Number(analysis.imageWidth || 0);
  table.rowColorImageHeight = Number(analysis.imageHeight || 0);
  table.rowColorRows = aligned.rows.map((row, index) => ({
    source: analysis.source || "row_geometry",
    label: row?.label || "",
    rawLabel: row?.rawLabel || "",
    confidence: row?.confidence || 0,
    rowBox: row?.rowBox || row?.row_box || row?.bbox || null,
    bbox: row?.bbox || row?.rowBox || row?.row_box || null,
    sampleBox: row?.sampleBox || null,
    y1: row?.y1 ?? row?.top ?? "",
    y2: row?.y2 ?? row?.bottom ?? "",
    x1: row?.x1 ?? row?.left ?? "",
    x2: row?.x2 ?? row?.right ?? "",
    height: row?.height ?? "",
    rowActionGeometry: true,
    sourceIndex: aligned.sourceIndexes?.[index] ?? row?.index ?? index,
  }));
  table.rowColorSourceIndexes = Array.isArray(aligned.sourceIndexes) ? aligned.sourceIndexes : table.rowColorSourceIndexes;
  table.rowColorMessage = "已生成原图逐行操作按钮。";
  return table.rowColorRows.every((item) => getRowActionOverlayBox(item));
}

function getSortedRowActionBoxes(rows = []) {
  return rows
    .map((row, index) => ({ box: getRowActionOverlayBox(row), row, index }))
    .filter((item) => item.box)
    .sort((left, right) => ((left.box.y1 + left.box.y2) / 2) - ((right.box.y1 + right.box.y2) / 2));
}

function buildInterpolatedRowActionBoxes(table, analysis) {
  const expectedRows = Array.isArray(table?.rows) ? table.rows.length : 0;
  const imageHeight = Number(analysis?.imageHeight || 0);
  const sorted = getSortedRowActionBoxes(analysis?.rows || []);
  if (!table?.quickManualMode || expectedRows < 5 || !imageHeight) return [];

  const textRows = Array.isArray(analysis?.rowActionTextRows)
    ? analysis.rowActionTextRows
        .map((item) => {
          const center = Number(item?.textCenter ?? ((Number(item?.y1) + Number(item?.y2)) / 2));
          const y1 = Number(item?.y1);
          const y2 = Number(item?.y2);
          return Number.isFinite(center) && Number.isFinite(y1) && Number.isFinite(y2) && y2 > y1
            ? { center, y1, y2 }
            : null;
        })
        .filter(Boolean)
        .sort((left, right) => left.center - right.center)
    : [];
  const textGaps = textRows
    .slice(1)
    .map((item, index) => item.center - textRows[index].center)
    .filter((gap) => gap >= 8 && gap <= 70)
    .sort((a, b) => a - b);
  const textPitch = textGaps.length >= 3 ? textGaps[Math.floor(textGaps.length / 2)] : 0;
  const useTextAnchor = textRows.length === expectedRows && textPitch >= 8;

  if (textRows.length && textRows.length !== expectedRows) {
    table.rowColorMessage = `原图识别到 ${textRows.length} 条视觉票行，但 OCR 有 ${expectedRows} 条票；为保证一对一，未生成贴图按钮，请用下方表格核对。`;
    return [];
  }
  if (!useTextAnchor) {
    table.rowColorMessage = "未能从原图识别到完整逐行文字中心；为保证一对一，未生成贴图按钮，请用下方表格核对。";
    return [];
  }

  const firstCenter = useTextAnchor ? textRows[0].center : (sorted[0].box.y1 + sorted[0].box.y2) / 2;
  const centers = sorted.map((item) => (item.box.y1 + item.box.y2) / 2);
  const gaps = centers.slice(1).map((center, index) => ({ index, gap: center - centers[index] })).filter((item) => item.gap > 0);
  const largeBoundaryGap = gaps.find((item) => {
    const pitch = item.gap / expectedRows;
    return item.index <= 2 && pitch >= 8 && pitch <= 60;
  });
  const smallGaps = gaps.map((item) => item.gap).filter((gap) => gap >= 8 && gap <= 60).sort((a, b) => a - b);
  const medianSmallGap = smallGaps.length ? smallGaps[Math.floor(smallGaps.length / 2)] : 0;
  const pitch = useTextAnchor ? textPitch : smallGaps.length >= 3 ? medianSmallGap : largeBoundaryGap ? largeBoundaryGap.gap / expectedRows : medianSmallGap;
  if (!Number.isFinite(pitch) || pitch < 8 || pitch > 60) return [];

  const sourceWidth = Math.max(
    0,
    ...sorted.map((item) => Number(item.box.x2 || 0)).filter(Number.isFinite),
    Number(analysis?.imageWidth || 0),
  );
  const rowHeight = Math.max(8, Math.min(42, pitch * 0.82));
  const top = firstCenter - rowHeight / 2;
  const bottom = firstCenter + (expectedRows - 1) * pitch + rowHeight / 2;
  if (top < -imageHeight * 0.02 || bottom > imageHeight * 1.04) return [];

  return table.rows.map((row, index) => {
    const textRow = useTextAnchor ? textRows[index] : null;
    const center = textRow ? textRow.center : firstCenter + index * pitch;
    const effectiveHeight = textRow ? Math.max(8, Math.min(42, textRow.y2 - textRow.y1)) : rowHeight;
    return {
      source: analysis.source || "interpolated_row_geometry",
      label: "",
      rawLabel: "",
      confidence: useTextAnchor ? 1 : largeBoundaryGap ? 0.82 : 0.72,
      rowBox: {
        y1: Math.max(0, center - effectiveHeight / 2),
        y2: Math.min(imageHeight, center + effectiveHeight / 2),
        x1: sorted[0]?.box?.x1 ?? 0,
        x2: sourceWidth || null,
      },
      y1: Math.max(0, center - effectiveHeight / 2),
      y2: Math.min(imageHeight, center + effectiveHeight / 2),
      x1: sorted[0]?.box?.x1 ?? 0,
      x2: sourceWidth || "",
      height: effectiveHeight,
      rowActionGeometry: true,
      interpolatedRowActionGeometry: true,
      textAnchoredRowActionGeometry: useTextAnchor,
      sourceIndex: index,
    };
  });
}

function applyInterpolatedRowActionGeometryToTable(table, analysis) {
  const rows = buildInterpolatedRowActionBoxes(table, analysis);
  if (!rows.length || rows.length !== table.rows.length) return false;
  table.rowColorSource = "quick_manual_interpolated_row_geometry";
  table.rowColorLogicVersion = ROW_COLOR_LOGIC_VERSION;
  table.rowActionGeometryVersion = ROW_ACTION_GEOMETRY_VERSION;
  table.rowColorImageWidth = Number(analysis.imageWidth || 0);
  table.rowColorImageHeight = Number(analysis.imageHeight || 0);
  table.rowColorRows = rows;
  table.rowColorSourceIndexes = rows.map((_, index) => index);
  table.rowColorMessage = rows.some((row) => row.textAnchoredRowActionGeometry === true)
    ? "本地分割线未能逐行识别，已按文字中心生成原图贴行按钮；请按原图颜色人工勾叉。"
    : "本地分割线未能逐行识别，已按 OCR 行数等距生成原图贴行按钮；请按原图颜色人工勾叉。";
  return true;
}

function getTableSourcePayloadForRowActions(table) {
  const source = normalizeUploadSourceReference(table?.originalImage || "");
  if (source) return { sourceUrl: source };
  const rawSource = String(table?.originalImage || "").split("#")[0];
  if (rawSource.startsWith("uploads/")) return { sourceUrl: rawSource };
  if (rawSource.startsWith("data:")) return { image: rawSource };
  return null;
}

async function requestQuickManualRowActionGeometry(table) {
  const sourcePayload = getTableSourcePayloadForRowActions(table);
  if (!table || !sourcePayload) throw new Error("没有可读取的原始图片/PDF。");
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 15000);
  const response = await fetch("/api/tables/analyze-row-colors", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    signal: controller.signal,
    body: JSON.stringify({
      ...sourcePayload,
      sourcePage: table.sourcePage || 1,
      expectedRows: getRowColorExpectedRowsForPendingTable(table),
    }),
  }).finally(() => window.clearTimeout(timeoutId));
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.message || result.error || "本地行定位失败。");
  if (!result.rowColorAnalysis) throw new Error("本地行定位没有返回坐标。");
  return result.rowColorAnalysis;
}

function queueQuickManualRowActionGeometry(table) {
  const failedAt = Number(table?._quickRowActionGeometryFailedAt || 0);
  if (
    !table?.quickManualMode ||
    table._quickRowActionGeometryQueued ||
    table._quickRowActionGeometryRunning ||
    (failedAt && Date.now() - failedAt < 15000) ||
    (table.quickRowActionGeometryTried === true && Number(table.quickRowActionGeometryTriedVersion || 0) === ROW_ACTION_GEOMETRY_VERSION)
  ) {
    return false;
  }
  if (getSourceRowActionOverlays(table, { includeEstimated: false }).length) return false;
  table.quickRowActionGeometryTried = true;
  table.quickRowActionGeometryTriedVersion = ROW_ACTION_GEOMETRY_VERSION;
  table._quickRowActionGeometryQueued = true;
  window.setTimeout(async () => {
    table._quickRowActionGeometryQueued = false;
    if (!table?.quickManualMode || getSourceRowActionOverlays(table).length) return;
    table._quickRowActionGeometryRunning = true;
    table.rowColorMessage = "正在定位原图逐行按钮...";
    try {
      const analysis = await requestQuickManualRowActionGeometry(table);
      if (!applyRowActionGeometryToTable(table, analysis)) {
        throw new Error(table.rowColorMessage || "本地行定位未能一一对应票行。");
      }
      saveAndArchiveAppStep(`快速人工行按钮定位：${table.title || currentEvent.name}`, "校对", { silent: true });
    } catch (error) {
      table.rowActionGeometryVersion = 0;
      table.rowColorRows = [];
      table.rowColorImageWidth = 0;
      table.rowColorImageHeight = 0;
      table.quickRowActionGeometryTried = false;
      table.quickRowActionGeometryTriedVersion = 0;
      table._quickRowActionGeometryFailedAt = Date.now();
      table.rowColorMessage = `${error.message || "原图逐行按钮定位失败"}；已保留右侧表格兜底。`;
    } finally {
      table._quickRowActionGeometryRunning = false;
      renderReviewPanel(undefined, { normalize: false });
      renderUploadRecords({ normalize: false });
      scheduleAppStateSave(0);
    }
  }, 100);
  return true;
}

function renderSourceRowActionOverlay(table, sourceImageUrl) {
  if (!table?.quickManualMode) return "";
  const overlays = getSourceRowActionOverlays(table);
  if (!sourceImageUrl || !overlays.length) return "";
  const controls = overlays
    .map(
      (item) => `
        <div class="review-source-row-control ${item.shouldPublish ? "publish" : "skip"}" data-review-row-index="${item.rowIndex}" style="top:${item.topPct}%;height:${item.heightPct}%;left:${item.actionLeftCss || "calc(100% + 6px)"};">
          <button class="upload ${item.selectedForPublish ? "active" : ""}" type="button" data-quick-row-publish="${item.rowIndex}" data-publish-value="true" title="上传第 ${item.rowIndex + 1} 行">✓</button>
          <button class="skip ${!item.selectedForPublish ? "active" : ""}" type="button" data-quick-row-publish="${item.rowIndex}" data-publish-value="false" title="下架第 ${item.rowIndex + 1} 行">×</button>
        </div>
      `,
    )
    .join("");
  return `
    <div class="review-source-action-layer">
      <div class="review-source-action-stage">
        <img class="review-source-action-image" src="${escapeHtml(sourceImageUrl)}" alt="${escapeHtml(getTableSourceSummary(table))}" />
        <div class="review-source-row-actions" aria-label="原图逐行上传下架">${controls}</div>
      </div>
    </div>
  `;
}

function renderReviewSourceMedia(table, sourceUrl, { sourceMissing, sourceWaiting, isPdf, page }) {
  const actionImageUrl = getReviewSourceImageUrlForRowActions(sourceUrl, isPdf, page);
  const overlay = renderSourceRowActionOverlay(table, actionImageUrl);
  if (sourceMissing) return renderReviewSourceMissing(table, sourceUrl);
  if (sourceWaiting) return renderReviewSourceChecking(sourceUrl);
  if (overlay) return overlay;
  if (isPdf && actionImageUrl) {
    return `<img class="review-source-image" src="${escapeHtml(actionImageUrl)}" alt="${escapeHtml(getTableSourceSummary(table))}" />`;
  }
  return isPdf
    ? `<iframe class="review-source-frame" src="${sourceUrl}" title="${escapeHtml(getTableSourceSummary(table))}"></iframe>`
    : `<img class="review-source-image" src="${sourceUrl}" alt="${escapeHtml(getTableSourceSummary(table))}" />`;
}

function renderReviewPanel(focusRowIndex = pendingReviewFocusRowIndex, { normalize = true } = {}) {
  if (normalize) normalizePendingTablesInMemory({ save: true });
  const table = getSelectedPendingTable();
  if (!table || table.eventId !== currentEvent.id) {
    reviewLayout.classList.remove("quick-manual-review-layout");
    reviewLayout.classList.remove("source-action-review-layout");
    reviewTitle.textContent = "选择一张待确认表";
    confirmReviewButton.disabled = true;
    reviewLayout.innerHTML = `<div class="empty-state">上传票源文件后，先在上方待确认列表中选择一张表进行校对。</div>`;
    return;
  }

  reviewTitle.textContent = shortenFileName(table.title || "新上传票源", 36);
  reviewTitle.title = table.title || "";
  confirmReviewButton.disabled = false;
  repairMisreadDataHeaderTable(table);
  if (isPdfTableSource(table)) forceCanonicalOriginalDisplay(table);
  if (table._columnRepairChanged) {
    table.reviewFlagsVersion = 0;
  }
  ensurePendingTableReviewFlags(table);
  if (Number(table.publishDecisionLogicVersion || 0) !== PUBLISH_DECISION_LOGIC_VERSION) {
    const clearedStaleBlocks = clearStalePublishDecisionBlocks(table);
    table.publishDecisionLogicVersion = PUBLISH_DECISION_LOGIC_VERSION;
    if (clearedStaleBlocks > 0) scheduleAppStateSave(0);
  }
  const colorDecisionApplied = applyOpenCvWhiteVsColoredAutoDecision(table);
  if (colorDecisionApplied > 0) scheduleAppStateSave(0);
  queuePendingTableRowColorRepair(table);
  if (table._columnRepairChanged) {
    delete table._columnRepairChanged;
    scheduleAppStateSave(0);
  }
  const navigation = getReviewTableNavigation(table);
  const navigationLabel =
    navigation.index >= 0
      ? `当前第 ${navigation.index + 1}/${navigation.queue.length} 张${manualReviewOnly ? "需人工确认" : "待确认"}表`
      : `当前表不在${manualReviewOnly ? "需人工确认" : "待确认"}队列里`;
  table.publishRows = table.publishRows || {};
  table.rows.forEach((row, rowIndex) => {
    if (table.publishRows[rowIndex] === undefined) {
      const ticket = { table, row, index: rowIndex };
      if (!isCustomerPublishableTicket(ticket)) table.publishRows[rowIndex] = false;
    }
  });
  if (table.quickManualMode) {
    renderQuickManualReviewPanel(table, navigation, navigationLabel);
    focusReviewRow(focusRowIndex);
    return;
  }
  reviewLayout.classList.remove("quick-manual-review-layout");
  reviewLayout.classList.remove("source-action-review-layout");
  const skippedSoldRows = table.rows.filter((row, rowIndex) => isUnavailableTicket({ table, row, index: rowIndex })).length;
  const aiDecisions = Array.isArray(table.aiReviewDecisions) ? table.aiReviewDecisions : [];
  const aiDecisionByRow = new Map(aiDecisions.map((item) => [Number(item.row), item]));
  const snapshots = Array.isArray(table.reviewSnapshots) ? table.reviewSnapshots : [];
  const colorSamples = table.colorReviewSamples || {};
  const sampleText = [
    Number.isInteger(colorSamples.soldRow) ? `已售样本：第 ${colorSamples.soldRow + 1} 条` : "已售样本：未设置",
    Number.isInteger(colorSamples.availableRow) ? `未售样本：第 ${colorSamples.availableRow + 1} 条` : "未售样本：未设置",
  ].join(" / ");
  const hasColorPreview = hasOpenCvRowColorPreview(table);
  const openCvConflict = hasColorPreview && hasAnyOpenCvWhiteAndColoredConflict(table);
  const openCvLabels = hasColorPreview && table.rowColorReliable === true ? getOpenCvNonSoldColorLabels(table) : [];
  const openCvColorState = hasColorPreview && table.rowColorReliable === true ? getOpenCvEffectiveColorState(table) : null;
  const rowColorEngineName = getRowColorEngineName(table);
  const rowColorStatusText =
    isVisualRowColorSource(table)
      ? table.rowColorReliable
        ? table.rowColorMessage || getOpenCvColorReferenceMessage(table)
        : openCvConflict
          ? table.rowColorMessage || `${rowColorEngineName} 检测到颜色差异，未可靠对齐前不会自动改发布状态`
          : openCvColorState?.hasNonWhite && !openCvColorState?.hasWhite
            ? table.rowColorMessage || `${rowColorEngineName} 检测到非白底有效票，未找到白底参照，先保留人工确认。`
          : openCvLabels.length
            ? `${rowColorEngineName} 已识别 ${table.rowColorRows.length}/${table.rows.length} 行底色`
            : `${rowColorEngineName} 未识别到有效颜色参考`
      : "";
  const ppStructureStatusText = table.ppStructureMessage || getPpStructureMatchSummary(table);
  const colorEngineHint = openCvConflict
    ? "同表混色时非白底行会自动设为不发布；你仍可手动改回发布。"
    : "颜色检测会先等待白底参照和可靠对齐，再参与发布判断。";
  const openCvPreviewRows =
    hasColorPreview && table.showOpenCvColorPreview
      ? table.rows
          .slice(0, MAX_OPENCV_PREVIEW_ROWS_RENDERED)
          .map((row, index) => {
            const item = table.rowColorRows[index] || {};
            const rawLabel = normalizeRowColorLabel(item.label) || normalizeRowColorLabel(item.rawLabel);
            const confidence = Math.round(Number(item.confidence || 0) * 100);
            const whiteRatio = Math.round(Number(item.whiteRatio || 0) * 100);
            const coloredRatio = Math.round(Number(item.coloredRatio || 0) * 100);
            const coverageRatio = Math.round(Number(item.coverageRatio || 0) * 100);
            const decision = getOpenCvColorDecisionText(table, index);
            const autoSkipLabel = getAutoSkipOpenCvColorLabel(item);
            const strictLabel = getOpenCvItemConflictActionLabel(item);
            const label =
              autoSkipLabel ||
              strictLabel ||
              (decision.includes("疑似") ? "疑似颜色" : "") ||
              (rawLabel && !decision.includes("下架") ? rawLabel : "") ||
              "未识别";
            return `
              <span class="opencv-color-row ${decision.includes("下架") || decision.includes("已售") ? "skip" : "keep"}">
                <b>第 ${index + 1} 行</b>
                <em>${escapeHtml(label)} · ${escapeHtml(decision)}</em>
                <small>可信度 ${confidence}% / 白 ${whiteRatio}% / 色 ${coloredRatio}% / 覆盖 ${coverageRatio}%</small>
              </span>
            `;
          })
          .join("")
      : "";
  const dateColumnIndex = findColumnIndex(table.columns, DATE_COLUMN_NAMES);
  const missingDateCount =
    dateColumnIndex < 0
      ? table.rows.filter((row, rowIndex) => {
          const ticket = { table, row, index: rowIndex };
          return !isUnavailableTicket(ticket) && !getTicketDateValues(ticket).length;
        }).length
      : table.rows.filter((row, rowIndex) => {
          const ticket = { table, row, index: rowIndex };
          return !isUnavailableTicket(ticket) && !String(row[dateColumnIndex] || "").trim() && !getTicketDateValues(ticket).length;
        }).length;
  const reviewRows = table.rows
    .map((row, rowIndex) => ({ row, rowIndex }))
    .filter(({ row, rowIndex }) => table.showSoldInReview || !isUnavailableTicket({ table, row, index: rowIndex }));
  const renderedReviewRows = reviewRows.slice(0, MAX_REVIEW_ROWS_RENDERED);
  const hiddenReviewRowCount = Math.max(0, reviewRows.length - renderedReviewRows.length);
  const reviewZoneIndex = findColumnIndex(table.columns, ["区域", "区", "block", "section", "구역"]);
  const rows = renderedReviewRows
    .map(({ row, rowIndex }) => {
      const currentRow = table.rows[rowIndex] || row;
      const aiDecision = aiDecisionByRow.get(rowIndex + 1);
      const ticket = { table, row: currentRow, index: rowIndex };
      const selectedForPublish = isPendingRowSelectedForPublish(table, rowIndex);
      const publishEligible = isCustomerPublishableTicket(ticket);
      const shouldPublish = selectedForPublish && publishEligible;
      const fieldObjects = getOriginalTicketFields(ticket, { preserveOriginal: false });
      const visibleSalePrice = getVisibleTicketSalePriceValue(ticket);
      const missingPrice = !visibleSalePrice;
      const soldLike = isSoldTicket(ticket);
      const colorHeld = !soldLike && isColorHeldForReviewTicket(ticket);
      const ppStructureMatchText = getPpStructureMatchText(table, rowIndex);
      const publishBlockReason = selectedForPublish && !publishEligible ? getPendingRowPublishBlockReason(ticket) : "";
      const decisionReason = getPendingRowDecisionReason(ticket, { selectedForPublish, publishEligible });
      const zoneUnmatched =
        !soldLike &&
        currentEvent.zones.length > 0 &&
        !currentEvent.zones.some((zone) => zoneMatchesTicket(ticket, zone));
      const editing = isReviewRowEditing(table, rowIndex);
      const fields = fieldObjects
        .map(
          (field) => `
            <span class="review-ticket-field">
              <em>${escapeHtml(field.label)}</em>
              <strong>${escapeHtml(field.value)}</strong>
            </span>
          `,
        )
        .join("");
      const editFields = table.columns
        .map((column, index) => ({ column, index }))
        .filter((field) => !isInternalColorColumn(field.column))
        .map(
          (field) => `
            <label class="review-edit-field">
              <span>${escapeHtml(field.column)}</span>
              <input type="text" value="${escapeHtml(currentRow[field.index] || "")}" data-review-edit-input="${field.index}" />
            </label>
          `,
        )
        .join("");
      const priceEditor = missingPrice
        ? `<div class="review-price-editor">
            <label>
              <span>补售价</span>
              <input type="text" placeholder="例如 4800" data-review-price-input="${rowIndex}" />
            </label>
            <button class="small-button" type="button" data-save-review-price="${rowIndex}">保存价格</button>
          </div>`
        : "";
      return `
        <article class="review-ticket-card ${soldLike ? "sold-row" : ""} ${colorHeld ? "color-review-row" : ""} ${missingPrice ? "missing-price" : ""}" data-review-row-index="${rowIndex}">
          <div class="review-ticket-top">
            <strong>第 ${rowIndex + 1} 条票</strong>
            <span class="${shouldPublish ? "review-ticket-status upload" : "review-ticket-status skip"}">${shouldPublish ? "会发布到客户前台" : selectedForPublish ? "已选择发布，待修正" : soldLike ? "已售" : colorHeld ? "颜色标色下架" : "不会发布"}</span>
          </div>
          ${missingPrice ? `<div class="review-ticket-warning">缺少售价：请对照左侧原图补上售价，保存后再决定是否发布。</div>${priceEditor}` : ""}
          ${publishBlockReason ? `<div class="review-ticket-warning">已记录“发布到前台”，但暂不能发布：${escapeHtml(publishBlockReason)}</div>` : ""}
          ${!shouldPublish ? `<div class="review-ticket-warning">当前原因：${escapeHtml(decisionReason)}</div>` : ""}
          ${zoneUnmatched ? `<div class="review-ticket-warning">区域未匹配座位图热区：请检查“区域”是否识别错字，或到座位图热区里补这个区。</div>` : ""}
          ${ppStructureMatchText ? `<div class="ai-suggestion publish"><strong>结构坐标</strong><span>${escapeHtml(ppStructureMatchText)}</span></div>` : ""}
          ${
            aiDecision
              ? `<div class="ai-suggestion ${aiDecision.action === "publish" ? "publish" : "skip"}">
                  <strong>AI 建议：${aiDecision.action === "publish" ? "发布" : "不发布"}</strong>
                  <span>${escapeHtml(aiDecision.status || "")}${aiDecision.reason ? ` · ${escapeHtml(aiDecision.reason)}` : ""}</span>
                </div>`
              : ""
          }
          <div class="review-ticket-fields">
            ${fields || `<span class="review-ticket-empty">这一行没有识别到有效内容</span>`}
          </div>
          ${
            editing
              ? `<div class="review-edit-panel">
                  <div class="review-edit-grid">${editFields}</div>
                  <div class="review-edit-actions">
                    <button class="small-button" type="button" data-save-review-row="${rowIndex}">保存修改</button>
                    <button class="small-button ghost" type="button" data-cancel-review-row="${rowIndex}">取消</button>
                  </div>
                </div>`
              : ""
          }
          <div class="review-ticket-actions">
            <div class="publish-choice" role="group" aria-label="是否发布到前台">
              <button class="choice-button ${selectedForPublish ? "active" : ""}" type="button" data-set-row-publish="${rowIndex}" data-publish-value="true">发布到前台</button>
              <button class="choice-button ${!selectedForPublish ? "danger active" : ""}" type="button" data-set-row-publish="${rowIndex}" data-publish-value="false">不发布</button>
            </div>
            <button class="row-action-button" type="button" data-edit-review-row="${rowIndex}">${editing ? "正在修改" : "修改"}</button>
            <button class="row-action-button" type="button" data-toggle-row-sold="${rowIndex}">标已售</button>
            <button class="row-action-button sample ${colorSamples.soldRow === rowIndex ? "active" : ""}" type="button" data-color-sample-row="${rowIndex}" data-color-sample-type="sold">设为已售样本</button>
            <button class="row-action-button sample ${colorSamples.availableRow === rowIndex ? "active" : ""}" type="button" data-color-sample-row="${rowIndex}" data-color-sample-type="available">设为未售样本</button>
          </div>
        </article>
      `;
    })
    .join("");
  const source = table.originalImage || "";
  const isPdf = isPdfTableSource(table);
  const page = Number(table.sourcePage || 0);
  const sourceUrl = isPdf && page > 0 ? `${source.split("#")[0]}#page=${page}` : source;
  ensureReviewSourceAvailability(sourceUrl);
  const sourceMissing = isReviewSourceMissing(sourceUrl);
  const sourceWaiting = isReviewSourceWaiting(sourceUrl);
  const hasSourceRowActions = table.quickManualMode && getSourceRowActionOverlays(table).length > 0;
  reviewLayout.classList.toggle("source-action-review-layout", hasSourceRowActions);
  reviewLayout.innerHTML = `
    ${
      table.needsManualReview
        ? `<div class="manual-review-note"><strong>需人工确认</strong><span>${escapeHtml((table.reviewReasons || []).join(" / "))}</span></div>`
        : `<div class="manual-review-note ok"><strong>标准识别</strong><span>关键字段完整，仍建议发布前快速看一眼原始图。</span></div>`
    }
    ${ppStructureStatusText ? `<div class="manual-review-note ok"><strong>结构复核</strong><span>${escapeHtml(ppStructureStatusText)}</span></div>` : ""}
    <div class="review-source-panel">
      <div class="review-source-head">
        <span>原始图片/PDF 页面</span>
        <button class="small-button ghost" type="button" data-review-source="${table.id}">放大查看</button>
      </div>
      <strong>${escapeHtml(getTableSourceSummary(table))}</strong>
      <div class="review-source-with-actions">
        ${renderReviewSourceMedia(table, sourceUrl, { sourceMissing, sourceWaiting, isPdf, page })}
      </div>
    </div>
    <div class="review-ticket-list">
      <div class="review-ticket-list-head">
        <div>
          <strong>逐票确认</strong>
          <span>${skippedSoldRows ? `已自动跳过 ${skippedSoldRows} 条已售/颜色下架票源；` : ""}修改和发布状态会先保留，最后点“确认并发布”。</span>
        </div>
        <div class="review-bulk-actions">
          ${
            skippedSoldRows
              ? `<button class="small-button ghost" type="button" data-toggle-skipped-review>${table.showSoldInReview ? "隐藏已跳过票源" : `显示已跳过票源 ${skippedSoldRows} 条`}</button>`
              : ""
          }
          <button class="small-button ghost danger" type="button" data-mark-all-skip-draft>全部改为不发布</button>
        </div>
      </div>
      <div class="review-table-nav">
        <button class="small-button ghost" type="button" data-review-table-nav="prev" ${navigation.previous ? "" : "disabled"}>上一页</button>
        <span>${escapeHtml(navigationLabel)}</span>
        <button class="small-button ghost" type="button" data-review-table-nav="next" ${navigation.next ? "" : "disabled"}>下一页</button>
      </div>
      ${hasSourceRowActions ? "" : renderQuickCheckTablePanel(table)}
      ${
        missingDateCount
          ? `<div class="review-quick-tools">
              <label>
                <span>批量补日期</span>
                <input type="text" data-review-date-input placeholder="例如 9.12 或 2026-09-12" />
              </label>
              <button class="small-button" type="button" data-apply-review-date>给空日期一键补上</button>
              <em>只补 ${missingDateCount} 条空日期，不覆盖已有日期。</em>
            </div>`
          : ""
      }
      ${
        snapshots.length
          ? `<div class="review-history-panel">
              <strong>校对历史</strong>
              <div class="review-history-actions">
                ${snapshots
                  .slice(0, 4)
                  .map(
                    (snapshot) => `
                      <button class="small-button ghost" type="button" data-restore-review-snapshot="${snapshot.id}">
                        恢复：${escapeHtml(snapshot.label)} · ${escapeHtml(snapshot.createdAt)}
                      </button>
                    `,
                  )
                  .join("")}
              </div>
            </div>`
          : ""
      }
      ${
        rowColorStatusText
          ? `<div class="review-sample-panel color-engine-status">
              <div>
                <strong>颜色检测</strong>
                <span>${escapeHtml(rowColorStatusText)}</span>
                <em>${escapeHtml(colorEngineHint)}${openCvLabels.length ? ` 未 sold 候选底色：${escapeHtml(openCvLabels.join(" / "))}` : ""}</em>
              </div>
              ${
                hasColorPreview
                  ? `<div class="review-color-actions">
                      <button class="small-button ghost" type="button" data-toggle-opencv-colors>
                        ${table.showOpenCvColorPreview ? "隐藏识别颜色" : "查看识别颜色"}
                      </button>
                    </div>`
                  : ""
              }
            </div>
            ${
              openCvPreviewRows
                ? `<div class="opencv-color-preview">
                    <strong>${escapeHtml(rowColorEngineName)} 逐行颜色</strong>
                    <span>${openCvConflict ? "这张表同时有白底和其他底色；非白底行会自动设为不发布。" : "颜色会等待同表白底参照后再参与发布判断。"}${table.rows.length > MAX_OPENCV_PREVIEW_ROWS_RENDERED ? ` 仅显示前 ${MAX_OPENCV_PREVIEW_ROWS_RENDERED} 行颜色明细。` : ""}</span>
                    <div class="opencv-color-grid">${openCvPreviewRows}</div>
                  </div>`
                : ""
            }`
          : ""
      }
      <div class="review-ai-panel">
        <label for="reviewAiInstruction">AI 辅助校对</label>
        <textarea id="reviewAiInstruction" rows="3" placeholder="例如：橙色整行底色是已售；浅绿色底不是已售；只有整行明显橙色才下架。AI 只生成建议，应用前你还能再看。">${escapeHtml(table.aiReviewInstruction || "")}</textarea>
        <div class="review-sample-panel">
          <strong>颜色样本</strong>
          <span>${escapeHtml(sampleText)}</span>
          <em>先在下方票卡选择一条“已售样本”和一条“未售样本”，再生成建议。</em>
        </div>
        <div class="review-ai-actions">
          <button class="small-button" type="button" data-review-ai-assist ${reviewAiBusy ? "disabled" : ""}>${reviewAiBusy ? "正在生成..." : "生成发布/下架建议"}</button>
          <button class="small-button ghost ${aiDecisions.length ? "" : "hidden"}" type="button" data-apply-ai-review>应用 AI 建议</button>
        </div>
        <p class="review-ai-status">${escapeHtml(table.aiReviewStatus || "输入这张表的颜色/标记规则，AI 会按原图给出哪些上传、哪些下架。")}</p>
      </div>
      ${
        hiddenReviewRowCount
          ? `<div class="review-ticket-limit-note">为了避免大表卡住页面，本页先显示前 ${MAX_REVIEW_ROWS_RENDERED} 条可见票源，剩余 ${hiddenReviewRowCount} 条仍会参与确认发布和保存。</div>`
          : ""
      }
      ${
        rows ||
        `<div class="empty-state">这张表当前没有显示中的票；可以点“显示已跳过票源”恢复查看，或从“校对历史”恢复到上一步。</div>`
      }
    </div>
  `;
  focusReviewRow(focusRowIndex);
}

function renderPublishedTables() {
  const rows = currentEvent.tables
    .map(
      (table) => `
        <div class="admin-table-row">
          <span>${table.title}</span>
          <span>${currentEvent.name}</span>
          <span>${escapeHtml(getTableSourceSummary(table))}</span>
          <span>已发布</span>
          <span>${table.rows.length} 条票源</span>
          <div class="admin-table-actions">
            <button class="small-button danger ghost" type="button" data-published-table-action="${table.id}">删除/退回</button>
          </div>
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
      <span>操作</span>
    </div>
    ${rows || `<div class="empty-state">当前演出还没有已发布票源。</div>`}
  `;
}

function clonePublishedTableForPendingReview(table) {
  const rows = Array.isArray(table.rows) ? cloneRows(table.rows) : [];
  return updatePendingTableReviewFlags({
    ...table,
    id: `returned-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    title: `退回校对：${table.title || "已发布票源"}`,
    rows,
    originalColumns: Array.isArray(table.originalColumns) ? [...table.originalColumns] : Array.isArray(table.columns) ? [...table.columns] : [],
    originalRows: Array.isArray(table.originalRows) && table.originalRows.length ? cloneRows(table.originalRows) : cloneRows(rows),
    publishRows: {},
    manualPublishRows: {},
    manualSkipRows: {},
    reviewedRows: {},
    userEditedRows: {},
    aiReviewDecisions: [],
    aiReviewStatus: "已从已发布票源退回待确认，请重新校对后再发布。",
    returnedForReview: true,
    needsManualReview: true,
    publishDecisionLogicVersion: PUBLISH_DECISION_LOGIC_VERSION,
    reviewReasons: ["从已发布退回校对"],
    bulkSkipDraft: false,
  });
}

function removePublishedTableById(tableId) {
  const tableIndex = currentEvent.tables.findIndex((table) => table.id === tableId);
  if (tableIndex < 0) return null;
  const [removedTable] = currentEvent.tables.splice(tableIndex, 1);
  for (let index = uploadedTables.length - 1; index >= 0; index -= 1) {
    if (uploadedTables[index].id === tableId) uploadedTables.splice(index, 1);
  }
  return removedTable;
}

function refreshAfterPublishedTableAction() {
  selectFirstDateWithTickets();
  render();
  renderAdminEvent();
  renderUploadRecords();
  renderReviewPanel();
  renderPublishedTables();
}

function handlePublishedTableAction(tableId) {
  const table = currentEvent.tables.find((item) => item.id === tableId);
  if (!table) {
    showToast("没有找到这一页已发布票源。", "error");
    return;
  }
  const choice = window.prompt(
    `处理「${table.title || "这一页票源"}」？\n\n输入 1：退回待确认重新校正\n输入 2：直接删除这一页\n\n取消或留空：不处理`,
    "1",
  );
  if (!choice) return;
  const normalizedChoice = normalize(choice);
  if (normalizedChoice === "1" || normalizedChoice.includes("退回") || normalizedChoice.includes("校正") || normalizedChoice.includes("校对")) {
    const removedTable = removePublishedTableById(tableId);
    if (!removedTable) return;
    const pendingTable = clonePublishedTableForPendingReview(removedTable);
    pendingTables.unshift(pendingTable);
    selectedPendingTableId = pendingTable.id;
    manualReviewOnly = false;
    pendingReviewFocusRowIndex = getVisibleReviewRowIndexes(pendingTable)[0] ?? null;
    saveAndArchiveAppStep(`退回已发布页到待确认：${removedTable.title || currentEvent.name}`, "已发布票源");
    refreshAfterPublishedTableAction();
    showToast("已退回待确认，可以重新校正后再发布。", "success");
    return;
  }
  if (normalizedChoice === "2" || normalizedChoice.includes("删除")) {
    const confirmed = window.confirm(`确定直接删除「${table.title || "这一页票源"}」吗？\n\n这页会从客户前台移除，不会回到待确认。`);
    if (!confirmed) return;
    const removedTable = removePublishedTableById(tableId);
    if (!removedTable) return;
    saveAndArchiveAppStep(`直接删除已发布页：${removedTable.title || currentEvent.name}`, "已发布票源");
    refreshAfterPublishedTableAction();
    showToast("已直接删除这一页已发布票源。", "success");
    return;
  }
  showToast("没有识别到选择，请输入 1 或 2。", "error");
}

async function getUploadImageRowColorAnalyses(parsedTables) {
  const isPdf = uploadedSource?.type === "application/pdf" || uploadedSource?.name?.toLowerCase().endsWith(".pdf");
  if (isPdf) return await getUploadPdfRowColorAnalyses(parsedTables);
  const isImage = String(uploadedSource?.type || "").startsWith("image/") || /\.(png|jpe?g|webp|gif)$/i.test(uploadedSource?.name || "");
  const hasImageSource = uploadedSource?.dataUrl?.startsWith("data:image/") || String(uploadedSource?.url || "").startsWith("uploads/");
  if (isImage && !hasImageSource) {
    console.warn("Row color analysis skipped because the original image is unavailable.");
    return {};
  }
  if (!hasImageSource) return {};
  const expectedRows = parsedTables.reduce((count, table) => {
    const rowCount = Array.isArray(table.rows) ? table.rows.length : 0;
    return count + rowCount + (hasMisreadDataHeaderColumns(table.columns, table.rows) ? 1 : 0);
  }, 0);
  if (!expectedRows) return {};
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 6000);
  let response;
  try {
    response = await fetch("/api/tables/analyze-row-colors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        image: uploadedSource.dataUrl || "",
        sourceUrl: uploadedSource.url || "",
        expectedRows,
      }),
    });
  } finally {
    window.clearTimeout(timeout);
  }
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.message || result.error || "图片行底色检测失败。");
  return result.rowColorAnalysis ? { "1": result.rowColorAnalysis } : {};
}

function getUploadRowColorSourcePayload() {
  const sourceUrl = String(uploadedSource?.url || "");
  if (sourceUrl.startsWith("uploads/")) return { sourceUrl };
  const dataUrl = String(uploadedSource?.dataUrl || "");
  if (dataUrl.startsWith("data:")) return { image: dataUrl };
  return null;
}

async function getUploadPdfRowColorAnalyses(parsedTables) {
  const baseAnalyses = { ...(lastTicketOcrJobSnapshot?.rowColorAnalyses || {}) };
  const sourcePayload = getUploadRowColorSourcePayload();
  if (!sourcePayload) return baseAnalyses;
  const uploadTables = mergeParsedTablesByPdfPage(parsedTables);
  const shouldDeferAnchorForLargePdf = uploadTables.length > MAX_AUTO_ANCHOR_PAGES_DURING_UPLOAD;
  if (shouldDeferAnchorForLargePdf) {
    setUploadStatus(
      `这份 PDF 有 ${uploadTables.length} 页，已跳过全量文字锚点；先生成待确认表，打开具体页面时再做行底色校对。`,
      "loading",
    );
    return baseAnalyses;
  }
  const anchorBatchAnalyses = {};
  const anchorBatchTables = [];
  uploadTables.forEach((table) => {
    const sourcePage = Number(table?.sourcePage || 0) || 1;
    const pageKey = String(sourcePage);
    const rowCount = Array.isArray(table?.rows) ? table.rows.length : 0;
    const currentAnalysis = baseAnalyses[pageKey] || baseAnalyses[sourcePage] || null;
    if (!rowCount || rowCount > 80) return;
    if (
      (currentAnalysis?.source === "ai_row_color" || currentAnalysis?.source === "ticket_row_anchor") &&
      currentAnalysis?.rowColorLogicVersion === ROW_COLOR_LOGIC_VERSION
    ) {
      return;
    }
    anchorBatchTables.push(table);
  });
  if (anchorBatchTables.length > 1) {
    try {
      setUploadStatus(`正在批量用文字锚点定位 ${anchorBatchTables.length} 页行底色...`, "loading");
      Object.assign(anchorBatchAnalyses, await requestAnchorRowColorAnalysesForTables(anchorBatchTables, sourcePayload));
    } catch (error) {
      console.warn("Batch anchor row-color analysis failed; falling back to per-page analysis.", error);
    }
  }
  const repairAttempts = new Set();
  for (const table of uploadTables) {
    const sourcePage = Number(table?.sourcePage || 0) || 1;
    const pageKey = String(sourcePage);
    if (repairAttempts.has(pageKey)) continue;
    const rowCount = Array.isArray(table?.rows) ? table.rows.length : 0;
    if (!rowCount || rowCount > 80) continue;
    const currentAnalysis = baseAnalyses[pageKey] || baseAnalyses[sourcePage] || null;
    if (
      (currentAnalysis?.source === "ai_row_color" || currentAnalysis?.source === "ticket_row_anchor") &&
      currentAnalysis?.rowColorLogicVersion === ROW_COLOR_LOGIC_VERSION
    ) {
      continue;
    }
    repairAttempts.add(pageKey);
    let anchorError = null;
    try {
      const anchorAnalysis = anchorBatchAnalyses[pageKey] || anchorBatchAnalyses[sourcePage];
      if (!anchorAnalysis) setUploadStatus(`PDF 第 ${sourcePage} 页正在用文字锚点定位行底色...`, "loading");
      const effectiveAnchorAnalysis = anchorAnalysis || (await requestAnchorRowColorAnalysisForTable(table, sourcePayload));
      if (
        effectiveAnchorAnalysis?.source === "ticket_row_anchor" &&
        Array.isArray(effectiveAnchorAnalysis.rows) &&
        effectiveAnchorAnalysis.rows.some((row) => row?.rowTextVerified === true && row?.rowGeometryVerified === true && row?.strong === true)
      ) {
        effectiveAnchorAnalysis.rowColorLogicVersion = ROW_COLOR_LOGIC_VERSION;
        baseAnalyses[pageKey] = effectiveAnchorAnalysis;
        if (lastTicketOcrJobSnapshot?.rowColorAnalyses) lastTicketOcrJobSnapshot.rowColorAnalyses[pageKey] = effectiveAnchorAnalysis;
        continue;
      }
      if (effectiveAnchorAnalysis?.reliable === true && effectiveAnchorAnalysis?.exactRowAligned === true && effectiveAnchorAnalysis?.autoApplyAllowed === true) {
        effectiveAnchorAnalysis.rowColorLogicVersion = ROW_COLOR_LOGIC_VERSION;
        baseAnalyses[pageKey] = effectiveAnchorAnalysis;
        if (lastTicketOcrJobSnapshot?.rowColorAnalyses) lastTicketOcrJobSnapshot.rowColorAnalyses[pageKey] = effectiveAnchorAnalysis;
        continue;
      }
      anchorError = new Error(effectiveAnchorAnalysis?.error || "文字锚点未能一一匹配全部票行。");
    } catch (error) {
      anchorError = error;
    }
    const previous = currentAnalysis || { source: "opencv", rows: [], reliable: false, exactRowAligned: false };
    baseAnalyses[pageKey] = {
      ...previous,
      reliable: false,
      exactRowAligned: false,
      autoApplyAllowed: false,
      aiFallbackSkipped: true,
      aiFallbackError: anchorError?.message || "文字锚点未能一一匹配全部票行。",
      unreliableReasons: uniqueCleanValues([...(previous.unreliableReasons || []), "anchor_not_matched_ai_fallback_skipped"]),
    };
    if (lastTicketOcrJobSnapshot?.rowColorAnalyses) lastTicketOcrJobSnapshot.rowColorAnalyses[pageKey] = baseAnalyses[pageKey];
  }
  return baseAnalyses;
}

async function getUploadImageRowColorAnalysesSafely(parsedTables) {
  try {
    return await getUploadImageRowColorAnalyses(parsedTables);
  } catch (error) {
    console.warn("Row color analysis skipped during pending table generation.", error);
    showToast("颜色检测暂时不可用，已先生成待确认表。", "warning");
    return {};
  }
}

function setPublishUploadBusy(isBusy) {
  uploadPendingGenerationBusy = isBusy;
  publishUploadButton.disabled = isBusy;
  publishUploadButton.textContent = isBusy ? "正在生成..." : "生成待确认表";
  if (saveOcrTextButton) saveOcrTextButton.disabled = isBusy;
  if (clearGeneratedPendingButton) clearGeneratedPendingButton.disabled = isBusy;
  if (clearOcrTextButton) clearOcrTextButton.disabled = isBusy;
}

function setQuickManualUploadBusy(isBusy) {
  quickManualGenerationBusy = isBusy;
  if (quickManualUploadButton) {
    quickManualUploadButton.disabled = isBusy;
    quickManualUploadButton.textContent = isBusy ? "正在生成..." : "快速人工生成";
  }
  if (saveOcrTextButton) saveOcrTextButton.disabled = isBusy;
  if (clearGeneratedPendingButton) clearGeneratedPendingButton.disabled = isBusy;
  if (clearOcrTextButton) clearOcrTextButton.disabled = isBusy;
}

async function publishUpload() {
  setPublishUploadBusy(true);
  setUploadStatus("正在检查上传内容...", "loading");
  showToast("正在处理上传...", "loading");
  try {
    await publishUploadInner();
  } finally {
    setPublishUploadBusy(false);
  }
}

async function publishUploadInner() {
  if (fieldMappingDraft) {
    const draftSource = String(fieldMappingDraft.sourceName || fieldMappingDraft.sourceType || "").toLowerCase();
    if (/\.(csv|tsv|txt|xlsx)$/.test(draftSource) || /csv|spreadsheet|excel/.test(draftSource)) {
      setUploadStatus("当前 CSV / Excel 正在字段映射预览，请先点“按这个映射导入”或取消映射。", "error");
      showToast("请先处理字段映射。", "error");
      return;
    }
    fieldMappingDraft = null;
    renderFieldMappingPreview();
  }
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
  const rowColorAnalyses = await getUploadImageRowColorAnalysesSafely(parsedTables);
  const rawTables = createUploadedTables(parsedTables, rowColorAnalyses);
  const removedSoldRows = rawTables.reduce((count, table) => count + removeSoldRowsFromTable(table), 0);
  const tables = rawTables.filter((table) => table.rows.length);
  pendingTables.unshift(...tables);
  selectedPendingTableId = tables[0]?.id || selectedPendingTableId;
  selectedDateId = null;
  selectedZone = null;
  searchTerm = "";
  searchInput.value = "";
  setUploadStatus(`已生成 ${tables.length} 张待确认表${removedSoldRows ? `，已自动跳过 ${removedSoldRows} 条已售/表尾说明行` : ""}。校对确认后才会发布给客户。`, "success");
  showToast(`已生成 ${tables.length} 张待确认表${removedSoldRows ? `，跳过 ${removedSoldRows} 条已售/表尾说明行` : ""}。`, "success");
  renderUploadRecords({ save: false, normalize: false });
  reviewTitle.textContent = "待确认表已生成";
  confirmReviewButton.disabled = true;
  reviewLayout.innerHTML = `<div class="empty-state">已生成 ${tables.length} 张待确认表。为避免大 PDF 卡住页面，请从上方待确认列表点“打开这一页”逐页校对。</div>`;
  renderPublishedTables();
  renderAdminEvent();
  uploadRecords.scrollIntoView({ behavior: "smooth", block: "start" });
  runWhenPageIdle(() => {
    renderUploadRecords({ save: false, normalize: false });
    saveAndArchiveAppStep(`生成待确认表：${uploadedSource?.name || uploadTableTitle.value || currentEvent.name}`, "生成待确认");
  }, 5000);
}

async function publishUploadQuickManual() {
  if (quickManualGenerationBusy) return;
  if (fieldMappingDraft) {
    setUploadStatus("当前 CSV / Excel 正在字段映射预览，请先处理字段映射后再使用快速通道。", "error");
    showToast("请先处理字段映射。", "error");
    return;
  }
  const parsedTables = splitRecognizedTables(uploadTableText.value);
  if (!uploadedSource) {
    setUploadStatus("请先选择一张图片或 PDF。", "error");
    showToast("快速生成失败：请先选择文件。", "error");
    return;
  }
  if (!parsedTables.length) {
    setUploadStatus("OCR 文本至少需要表头和一行票源。", "error");
    showToast("快速生成失败：表格内容不完整。", "error");
    return;
  }
  setQuickManualUploadBusy(true);
  setUploadStatus("正在用快速人工通道生成待确认表...", "loading");
  showToast("正在生成快速人工待确认表...", "loading");
  try {
    const sourceKey = String(uploadedSource?.url || uploadedSource?.name || "");
    const existingPageKeys = new Set(
      [...pendingTables, ...(currentEvent.tables || [])]
        .filter((table) => table.eventId === currentEvent.id && String(table.originalImage || table.sourceFileName || "") === sourceKey)
        .map((table) => `${sourceKey}::${Number(table.sourcePage || 0) || 1}`),
    );
    const tables = createUploadedTables(parsedTables, {}, { skipRowColor: true, quickManualMode: true })
      .filter((table) => table.rows.length)
      .filter((table) => !existingPageKeys.has(`${sourceKey}::${Number(table.sourcePage || 0) || 1}`));
    if (!tables.length) {
      setUploadStatus("当前 OCR 文本里的页都已经生成过了；等后面页文本继续出现后，再点快速人工生成即可追加。", "idle");
      showToast("没有新的 OCR 页需要追加。", "error");
      return;
    }
    pendingTables.unshift(...tables);
    selectedPendingTableId = tables[0]?.id || selectedPendingTableId;
    selectedDateId = null;
    selectedZone = null;
    searchTerm = "";
    searchInput.value = "";
    setUploadStatus(
      activeTicketOcrJobId
        ? `快速人工通道已生成 ${tables.length} 张待确认表。OCR 会继续读取后续页，后面页出现后可再追加生成。`
        : `快速人工通道已生成 ${tables.length} 张待确认表。请按原图点上传/下架。`,
      "success",
    );
    showToast(`已生成 ${tables.length} 张快速人工待确认表。`, "success");
    renderUploadRecords({ save: false, normalize: false });
    renderReviewPanel(0);
    renderPublishedTables();
    renderAdminEvent();
    uploadRecords.scrollIntoView({ behavior: "smooth", block: "start" });
    runWhenPageIdle(() => {
      renderUploadRecords({ save: false, normalize: false });
      saveAndArchiveAppStep(`快速人工生成：${uploadedSource?.name || uploadTableTitle.value || currentEvent.name}`, "生成待确认");
    }, 1000);
  } finally {
    setQuickManualUploadBusy(false);
    resumeTicketOcrPollingIfNeeded();
  }
}

function hasAnyRowColorAnalysis(rowColorAnalyses) {
  return Boolean(rowColorAnalyses && typeof rowColorAnalyses === "object" && Object.keys(rowColorAnalyses).length > 0);
}

function getLastPpStructureAnalysisForPage(page) {
  if (!page) return null;
  const analyses = lastTicketOcrJobSnapshot?.ppStructureAnalyses || {};
  return analyses[String(page)] || analyses[page] || null;
}

function getPpStructureMatchSummary(table) {
  const matches = Array.isArray(table?.ppStructureTicketRowMatches) ? table.ppStructureTicketRowMatches : [];
  if (!matches.length) return "";
  const matched = matches.filter((item) => item?.matched);
  const high = matched.filter((item) => item.confidence === "high").length;
  const medium = matched.filter((item) => item.confidence === "medium").length;
  const scores = matched.map((item) => Number(item.score || 0)).filter((score) => score > 0);
  const minScore = scores.length ? Math.min(...scores).toFixed(2) : "0.00";
  return `PP-Structure 已匹配 ${matched.length}/${matches.length} 条票行坐标，高置信 ${high} 条，中置信 ${medium} 条，最低分 ${minScore}`;
}

function getPpStructureMatchForTicket(table, rowIndex) {
  const matches = Array.isArray(table?.ppStructureTicketRowMatches) ? table.ppStructureTicketRowMatches : [];
  return matches.find((item) => Number(item?.ticketRowIndex) === Number(rowIndex)) || null;
}

function getPpStructureMatchText(table, rowIndex) {
  const match = getPpStructureMatchForTicket(table, rowIndex);
  if (!match) return "";
  if (!match.matched) return `PP-Structure 未可靠匹配原图坐标${match.score ? `，最高分 ${Number(match.score).toFixed(2)}` : ""}`;
  const color = normalizeRowColorLabel(match.color?.label || match.color?.rawLabel || "");
  const score = Number(match.score || 0).toFixed(2);
  const confidence = match.confidence === "high" ? "高置信" : match.confidence === "medium" ? "中置信" : "低置信";
  return `PP-Structure ${confidence}匹配原图第 ${Number(match.ppRowIndex || 0) + 1} 行，分数 ${score}${color ? `，底色 ${color}` : ""}`;
}

function cloneParsedTableForPageMerge(table) {
  const cloned = {
    ...table,
    columns: Array.isArray(table?.columns) ? [...table.columns] : [],
    rows: Array.isArray(table?.rows) ? cloneRows(table.rows) : [],
    originalColumns: Array.isArray(table?.originalColumns) ? [...table.originalColumns] : Array.isArray(table?.columns) ? [...table.columns] : [],
    originalRows: Array.isArray(table?.originalRows)
      ? cloneRows(table.originalRows)
      : Array.isArray(table?.rows)
        ? cloneRows(table.rows)
        : [],
  };
  repairMisreadDataHeaderTable(cloned);
  const rowColorStart = Math.max(
    0,
    Math.floor(Number(table?.rowColorPageStartIndex ?? table?.rowColorAlignedStart ?? table?.rowColorPageRowOffset ?? 0) || 0),
  );
  cloned.rowColorPageRowOffset = rowColorStart;
  const sequenceIndexes = getReasonableRowColorSourceIndexesFromSequence(cloned);
  if (sequenceIndexes.length === cloned.rows.length) {
    cloned.rowColorSourceIndexes = sequenceIndexes;
    cloned.rowColorSourceIndexMode = "sequence";
  } else {
    cloned.rowColorSourceIndexes = cloned.rows.map((_, index) => rowColorStart + index);
    cloned.rowColorSourceIndexMode = "sequential";
  }
  cloned.sourcePart = 1;
  return cloned;
}

function appendParsedTableOnSamePdfPage(target, source) {
  if (!target || !source) return;
  repairMisreadDataHeaderTable(target);
  repairMisreadDataHeaderTable(source);
  if (!Array.isArray(target.rowColorSourceIndexes) || target.rowColorSourceIndexes.length !== target.rows.length) {
    ensurePendingTableSourceRowIndexes(target);
  }
  if (!Array.isArray(target.rowColorSourceIndexes) || target.rowColorSourceIndexes.length !== target.rows.length) {
    const targetStart = Math.max(0, Math.floor(Number(target.rowColorPageRowOffset || 0) || 0));
    target.rowColorSourceIndexes = target.rows.map((_, index) => targetStart + index);
    target.rowColorSourceIndexMode = target.rowColorSourceIndexMode || "sequential";
  }
  coerceSourceTableForSamePageMerge(source, target.columns);
  const existingColumnCount = target.columns.length;
  const usedIndexes = new Set();
  const columnMap = source.columns.map((column, columnIndex) => {
    let targetIndex = getRecognizedColumnTargetIndex(target.columns, column, usedIndexes);
    if (targetIndex < 0) {
      const shouldAddColumn = isStrongRecognizedHeaderName(column);
      if (!shouldAddColumn) return { columnIndex, targetIndex: -1 };
      const fallbackLabel = String(column || "").trim() || `第${target.columns.length + 1}列`;
      target.columns.push(fallbackLabel);
      target.rows.forEach((row) => row.push(""));
      targetIndex = target.columns.length - 1;
    }
    usedIndexes.add(targetIndex);
    return { columnIndex, targetIndex };
  });
  const sourceRows = Array.isArray(source.rows) ? source.rows : [];
  const targetColorIndexBase = target.rowColorSourceIndexes.length;
  const sourceColorIndexes = Array.isArray(source.rowColorSourceIndexes)
    ? source.rowColorSourceIndexes
    : sourceRows.map((_, index) => targetColorIndexBase + index);
  const mappedEntries = sourceRows
    .map((row, sourceRowIndex) => ({ row, sourceRowIndex }))
    .filter(({ row }) => Array.isArray(row) && row.some((cell) => String(cell || "").trim()) && !isNonTicketFooterCells(row, source.columns))
    .map(({ row, sourceRowIndex }) => {
      const mapped = Array.from({ length: target.columns.length }, () => "");
      columnMap.forEach(({ columnIndex, targetIndex }) => {
        if (targetIndex < 0) return;
        mapped[targetIndex] = row[columnIndex] || "";
      });
      row.slice(source.columns.length).forEach((value) => {
        const emptyIndex = mapped.findIndex((item, index) => index >= existingColumnCount && !String(item || "").trim());
        if (emptyIndex >= 0) mapped[emptyIndex] = value;
      });
      return {
        row: mapped,
        sourceRowIndex,
      };
    });
  const mappedRows = mappedEntries.map((entry) => entry.row);
  target.rows.push(...mappedRows);
  target.rowColorSourceIndexes.push(
    ...mappedEntries.map((entry, index) => {
      const sourceIndex = Number(sourceColorIndexes[entry.sourceRowIndex]);
      if (Number.isFinite(sourceIndex) && sourceIndex >= 0) return sourceIndex;
      return targetColorIndexBase + index;
    }),
  );
  if (target.rowColorSourceIndexMode !== "sequence" && source.rowColorSourceIndexMode === "sequence") {
    target.rowColorSourceIndexMode = "sequence";
  }
  extendColumnsForOverflowRows(target.columns, target.rows);
  repairMisreadDataHeaderTable(target);
  normalizePendingTableColumns(target);
  forceCanonicalOriginalDisplay(target);
  target.sourcePart = 1;
  target.headerless = Boolean(target.headerless && source.headerless);
  target._columnRepairChanged = true;
}

function mergeParsedTablesByPdfPage(parsedTables = []) {
  const mergedTables = [];
  const tableByPage = new Map();
  const nextRowColorIndexByPage = new Map();
  parsedTables.forEach((table, index) => {
    const sourcePage = Number(table?.sourcePage || 0) || index + 1;
    const pageKey = String(sourcePage);
    const startIndex = nextRowColorIndexByPage.get(pageKey) || 0;
    const cloned = cloneParsedTableForPageMerge({ ...table, sourcePage, sourcePart: 1, rowColorPageStartIndex: startIndex });
    nextRowColorIndexByPage.set(pageKey, startIndex + cloned.rows.length);
    const existing = tableByPage.get(pageKey);
    if (!existing) {
      tableByPage.set(pageKey, cloned);
      mergedTables.push(cloned);
      return;
    }
    appendParsedTableOnSamePdfPage(existing, cloned);
  });
  return mergedTables;
}

function createUploadedTables(parsedTables, rowColorAnalyses = null, options = {}) {
  const skipRowColor = options.skipRowColor === true;
  const quickManualMode = options.quickManualMode === true;
  const isPdf = uploadedSource.type === "application/pdf" || uploadedSource.name.toLowerCase().endsWith(".pdf");
  const uploadTables = isPdf ? mergeParsedTablesByPdfPage(parsedTables) : parsedTables;
  const count = uploadTables.length;
  const totalUploadRows = uploadTables.reduce((sum, table) => sum + (Array.isArray(table?.rows) ? table.rows.length : 0), 0);
  const useLightReviewFlags = totalUploadRows > 250 || count > 12;
  const colorAnalyses = skipRowColor
    ? {}
    : hasAnyRowColorAnalysis(rowColorAnalyses)
      ? rowColorAnalyses
      : isPdf
        ? lastTicketOcrJobSnapshot?.rowColorAnalyses || {}
        : {};
  return Array.from({ length: count }, (_, index) => {
    const parsedTable = uploadTables[index];
    const sourcePage = Number(parsedTable.sourcePage || 0) || index + 1;
    const sourcePart = isPdf ? 1 : Number(parsedTable.sourcePart || 0) || index + 1;
    const pageText = isPdf ? `PDF 第 ${sourcePage} 页` : `第 ${sourcePart} 张表`;
    const baseTitle = uploadTableTitle.value.trim() || uploadedSource.name;
    const table = {
      id: `uploaded-${Date.now()}-${index}`,
      title: count > 1 ? `${baseTitle} · ${pageText}` : baseTitle,
      originalImage: uploadedSource.url,
      originalType: uploadedSource.type,
      sourceFileName: uploadedSource.name,
      sourceName: uploadedSource.name,
      sourcePage,
      sourcePart,
      eventId: currentEvent.id,
      columns: parsedTable.columns,
      originalColumns: Array.isArray(parsedTable.originalColumns) ? parsedTable.originalColumns : [...parsedTable.columns],
      originalRows: Array.isArray(parsedTable.originalRows) ? cloneRows(parsedTable.originalRows) : cloneRows(parsedTable.rows),
      rows: parsedTable.rows,
      quickManualMode,
      rowColorPageRowOffset: Math.max(0, Math.floor(Number(parsedTable.rowColorPageRowOffset || 0) || 0)),
      rowColorSourceIndexes: Array.isArray(parsedTable.rowColorSourceIndexes) ? [...parsedTable.rowColorSourceIndexes] : null,
    };
    repairMisreadDataHeaderTable(table);
    ensurePendingTableSourceRowIndexes(table);
    if (isPdf) forceCanonicalOriginalDisplay(table);
    const colorAnalysis = colorAnalyses[String(sourcePage)] || colorAnalyses[sourcePage] || null;
    const ppStructureAnalysis = skipRowColor ? null : getLastPpStructureAnalysisForPage(sourcePage);
    let ppAlignedRowColorAnalysis = null;
    if (ppStructureAnalysis) {
      const matches = Array.isArray(ppStructureAnalysis.ticketRowMatches) ? ppStructureAnalysis.ticketRowMatches : [];
      ppAlignedRowColorAnalysis = ppStructureAnalysis.ticketAlignedRowColorAnalysis || null;
      table.ppStructureAnalysis = {
        source: ppStructureAnalysis.source || "paddle_ppstructure",
        tableCount: ppStructureAnalysis.tableCount || 0,
        tables: Array.isArray(ppStructureAnalysis.tables) ? ppStructureAnalysis.tables : [],
        rowColorAnalysis: ppStructureAnalysis.rowColorAnalysis || null,
        ticketAlignedRowColorAnalysis: ppAlignedRowColorAnalysis,
      };
      table.ppStructureTicketRowMatches = matches;
      table.ppStructureMessage = getPpStructureMatchSummary(table) || "PP-Structure 已返回表格坐标，等待票行匹配。";
    }
    const effectiveColorAnalysis =
      colorAnalysis ||
      (ppAlignedRowColorAnalysis?.reliable === true && ppAlignedRowColorAnalysis?.exactRowAligned === true ? ppAlignedRowColorAnalysis : null);
    if (effectiveColorAnalysis) {
      const rowColorStart = Math.max(0, Math.floor(Number(table.rowColorPageRowOffset || 0) || 0));
      applyOpenCvRowColorsToTable(table, effectiveColorAnalysis, rowColorStart);
    }
    if (quickManualMode) {
      table.publishRows = {};
      table.manualPublishRows = {};
      table.manualSkipRows = {};
      table.reviewReasons = ["快速人工通道：请按左侧原图逐行点上传/下架"];
      table.needsManualReview = true;
      table.quickManualReviewedRows = {};
      table.rows.forEach((row, rowIndex) => {
        const ticket = { table, row, index: rowIndex };
        table.publishRows[rowIndex] = isCustomerPublishableTicket(ticket);
      });
      return markPendingTableReviewFlagsLightly(table);
    }
    if (useLightReviewFlags || (table.rows || []).length > 250) {
      return markPendingTableReviewFlagsLightly(table);
    }
    return updatePendingTableReviewFlags(table);
  });
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

async function confirmSelectedPendingTable() {
  if (!requireSeatmapTestBeforePublish()) return;
  const table = getSelectedPendingTable();
  if (!table) {
    showToast("请先选择一张待确认表。", "error");
    return;
  }
  const queueSnapshot = getCurrentPendingTables();
  const currentQueueIndex = queueSnapshot.findIndex((item) => item.id === table.id);
  const publishRows = [];
  const remainingRows = [];
  table.rows.forEach((row, rowIndex) => {
    const ticket = { table, row, index: rowIndex };
    if (isUnavailableTicket(ticket)) return;
    const explicitDecision = table.publishRows?.[rowIndex];
    if (explicitDecision === true) {
      if (isCustomerPublishableTicket(ticket)) publishRows.push(row);
      else remainingRows.push(row);
      return;
    }
    if (explicitDecision === false) return;
    if (shouldPublishPendingRow(table, rowIndex) && isCustomerPublishableTicket(ticket)) {
      publishRows.push(row);
    } else {
      remainingRows.push(row);
    }
  });
  if (!publishRows.length) {
    table.showSoldInReview = true;
    renderUploadRecords();
    renderReviewPanel();
    saveAndArchiveAppStep(`确认发布未选中票：${table.title || currentEvent.name}`, "发布");
    showToast("这张表没有勾选要上传的票，已保留在待确认里。你可以恢复历史或反选可发布票。", "error");
    return;
  }
  const publishedTable = createPublishedTableFromRows(table, publishRows);
  const index = pendingTables.findIndex((item) => item.id === table.id);
  if (remainingRows.length) {
    keepPendingRows(table, remainingRows);
  } else if (index >= 0) {
    pendingTables.splice(index, 1);
  }
  currentEvent.tables.unshift(publishedTable);
  uploadedTables.unshift(publishedTable);
  selectFirstDateWithTickets();
  if (remainingRows.length) {
    selectedPendingTableId = table.id;
    pendingReviewFocusRowIndex = getVisibleReviewRowIndexes(table)[0] ?? null;
  } else {
    selectNextPendingTableAfterPublish(queueSnapshot, currentQueueIndex);
  }
  const matchedRows = countZoneRowsFromTables();
  const matchMessage = getPublishMatchMessage(`${table.title} · ${publishRows.length} 条`, matchedRows);
  setUploadStatus(matchMessage.text, matchMessage.type);
  showToast(matchMessage.toast, matchMessage.type);
  renderUploadRecords();
  renderReviewPanel();
  renderPublishedTables();
  renderAdminEvent();
  window.setTimeout(render, 0);
  saveAndArchiveAppStep(`确认发布：${table.title} · ${publishRows.length} 条`, "发布");
}

function confirmAllPendingTables() {
  if (!requireSeatmapTestBeforePublish()) return;
  const currentPending = pendingTables.filter((table) => table.eventId === currentEvent.id).map(ensurePendingTableReviewFlags);
  if (!currentPending.length) {
    showToast("当前演出没有待确认表。", "error");
    return;
  }
  const riskyTables = currentPending.filter((table) => table.needsManualReview);
  if (riskyTables.length) {
    const confirmed = window.confirm(`有 ${riskyTables.length} 张表被标记为“需人工确认”。\n\n建议先点“查看需人工确认”逐张校对原始图。仍然一键发布全部吗？`);
    if (!confirmed) {
      manualReviewOnly = true;
      selectedPendingTableId = riskyTables[0]?.id || selectedPendingTableId;
      renderUploadRecords();
      renderReviewPanel();
      return;
    }
  }
  let publishedRowCount = 0;
  currentPending.forEach((table) => {
    const publishRows = [];
    const remainingRows = [];
    table.rows.forEach((row, rowIndex) => {
      const ticket = { table, row, index: rowIndex };
      if (isUnavailableTicket(ticket)) return;
      const explicitDecision = table.publishRows?.[rowIndex];
      if (explicitDecision === true) {
        if (isCustomerPublishableTicket(ticket)) publishRows.push(row);
        else remainingRows.push(row);
        return;
      }
      if (explicitDecision === false) return;
      if (shouldPublishPendingRow(table, rowIndex) && isCustomerPublishableTicket(ticket)) {
        publishRows.push(row);
      } else {
        remainingRows.push(row);
      }
    });
    if (publishRows.length) {
      const publishedTable = createPublishedTableFromRows(table, publishRows, currentPending.length > 1 ? ` ${publishRows.length}条` : "");
      currentEvent.tables.unshift(publishedTable);
      uploadedTables.unshift(publishedTable);
      publishedRowCount += publishRows.length;
    } else {
      table.showSoldInReview = true;
      ensurePendingTableReviewFlags(table);
      return;
    }
    const index = pendingTables.findIndex((item) => item.id === table.id);
    if (remainingRows.length) {
      keepPendingRows(table, remainingRows);
    } else if (index >= 0) {
      pendingTables.splice(index, 1);
    }
  });
  if (!publishedRowCount) {
    showToast("当前没有勾选要上传的票。", "error");
    renderUploadRecords();
    renderReviewPanel();
    return;
  }
  selectFirstDateWithTickets();
  selectedPendingTableId = null;
  const matchedRows = countZoneRowsFromTables();
  const matchMessage = getPublishMatchMessage(`已一键发布 ${publishedRowCount} 条票`, matchedRows);
  setUploadStatus(matchMessage.text, matchMessage.type);
  showToast(matchMessage.toast, matchMessage.type);
  renderUploadRecords();
  renderReviewPanel();
  renderPublishedTables();
  renderAdminEvent();
  window.setTimeout(render, 0);
  saveAndArchiveAppStep(`一键发布：${publishedRowCount} 条票`, "发布");
}

function confirmReadyPendingTables() {
  if (!requireSeatmapTestBeforePublish()) return;
  const currentPending = pendingTables.filter((table) => table.eventId === currentEvent.id).map(ensurePendingTableReviewFlags);
  if (!currentPending.length) {
    showToast("当前演出没有待确认表。", "error");
    return;
  }
  const readyTables = currentPending.filter((table) => !table.needsManualReview);
  if (!readyTables.length) {
    manualReviewOnly = true;
    const riskyTable = currentPending.find((table) => table.needsManualReview);
    selectedPendingTableId = riskyTable?.id || selectedPendingTableId;
    renderUploadRecords();
    renderReviewPanel();
    showToast("没有无需人工确认的表，已切到需人工确认列表。", "error");
    return;
  }

  let publishedRowCount = 0;
  let publishedTableCount = 0;
  readyTables.forEach((table) => {
    const publishRows = [];
    const remainingRows = [];
    table.rows.forEach((row, rowIndex) => {
      const ticket = { table, row, index: rowIndex };
      if (isUnavailableTicket(ticket)) return;
      const explicitDecision = table.publishRows?.[rowIndex];
      if (explicitDecision === false) return;
      if (shouldPublishPendingRow(table, rowIndex) && isCustomerPublishableTicket(ticket)) {
        publishRows.push(row);
      } else {
        remainingRows.push(row);
      }
    });
    if (!publishRows.length) {
      ensurePendingTableReviewFlags(table);
      return;
    }
    const publishedTable = createPublishedTableFromRows(table, publishRows, readyTables.length > 1 ? ` ${publishRows.length}条` : "");
    currentEvent.tables.unshift(publishedTable);
    uploadedTables.unshift(publishedTable);
    publishedRowCount += publishRows.length;
    publishedTableCount += 1;

    const index = pendingTables.findIndex((item) => item.id === table.id);
    if (remainingRows.length) {
      keepPendingRows(table, remainingRows);
    } else if (index >= 0) {
      pendingTables.splice(index, 1);
    }
  });

  if (!publishedRowCount) {
    showToast("无需人工确认的表里没有可发布票源。", "error");
    renderUploadRecords();
    renderReviewPanel();
    return;
  }
  selectedPendingTableId = pendingTables.find((table) => table.eventId === currentEvent.id && table.needsManualReview)?.id || null;
  manualReviewOnly = Boolean(selectedPendingTableId);
  selectFirstDateWithTickets();
  const matchedRows = countZoneRowsFromTables();
  const matchMessage = getPublishMatchMessage(`已发布 ${publishedTableCount} 张标准表、${publishedRowCount} 条票`, matchedRows);
  setUploadStatus(matchMessage.text, matchMessage.type);
  showToast(matchMessage.toast, matchMessage.type);
  renderUploadRecords();
  renderReviewPanel();
  renderPublishedTables();
  renderAdminEvent();
  window.setTimeout(render, 0);
  saveAndArchiveAppStep(`发布无需人工确认：${publishedTableCount} 张表、${publishedRowCount} 条票`, "发布");
}

function clearCurrentPendingTables() {
  const before = pendingTables.length;
  const currentPendingCount = pendingTables.filter((table) => table.eventId === currentEvent.id).length;
  if (currentPendingCount) saveAndArchiveAppStep(`清空待确认前备份：${currentEvent.name}`, "删除前备份");
  for (let index = pendingTables.length - 1; index >= 0; index -= 1) {
    if (pendingTables[index].eventId === currentEvent.id) pendingTables.splice(index, 1);
  }
  selectedPendingTableId = null;
  const removed = before - pendingTables.length;
  showToast(removed ? `已清空 ${removed} 张待确认表。` : "当前没有待确认表。", removed ? "success" : "error");
  if (removed) saveAndArchiveAppStep(`清空待确认：${currentEvent.name}`, "清空待确认");
  renderUploadRecords();
  renderReviewPanel();
}

function clearGeneratedPendingTablesAndKeepOcr() {
  const currentPendingCount = pendingTables.filter((table) => table.eventId === currentEvent.id).length;
  if (!currentPendingCount) {
    showToast("当前没有确认表需要清空，OCR 文本会继续保留。", "error");
    return;
  }
  clearCurrentPendingTables();
  const sourceName = uploadedSource?.name ? `，原文件 ${getSelectedFileDisplayName(uploadedSource.name)} 仍保留` : "";
  setUploadStatus(`已清空 ${currentPendingCount} 张确认表；OCR 文本和上传原文件已保留${sourceName}，可以重新生成。`, "success");
  saveAndArchiveAppStep(`清空确认表重来并保留 OCR：${currentEvent.name}`, "清空待确认");
}

function saveCurrentOcrTextManually() {
  const text = String(uploadTableText.value || "");
  if (!text.trim()) {
    showToast("当前没有 OCR 文本可保存。", "error");
    setUploadStatus("当前 OCR 文本为空；识别完成或粘贴文本后再保存。", "error");
    return;
  }
  rememberCurrentOcrText({ status: lastTicketOcrJobSnapshot?.status || "manual_saved", manuallySaved: true });
  saveAppState({ forceIndexedBackupReplace: true });
  const count = text.length.toLocaleString("zh-CN");
  setUploadStatus(`OCR 文本已保存 ${count} 字；刷新或下次打开后可继续生成确认表。`, "success");
  updateLocalSaveStatus({ saved: true, backup: "已手动保存 OCR" });
  showToast(`已保存 OCR 文本 ${count} 字。`, "success");
}

function clearSavedOcrText() {
  const currentText = String(uploadTableText.value || "");
  const snapshotText = String(lastTicketOcrJobSnapshot?.savedOcrText || lastTicketOcrJobSnapshot?.text || lastTicketOcrJobSnapshot?.partialText || "");
  if (!currentText.trim() && !snapshotText.trim() && !activeTicketOcrJobId) {
    showToast("当前没有 OCR 文本需要删除。", "error");
    return;
  }
  const confirmed = window.confirm(
    "确定删除 OCR 文本吗？\n\n上传的原文件和已经生成的确认表不会删除；删除后要重新识别 PDF 或手动粘贴 OCR 文本。",
  );
  if (!confirmed) return;
  stopTicketOcrPolling();
  autoPendingGenerationJobId = null;
  uploadTableText.value = "";
  lastTicketOcrJobSnapshot = null;
  largeAppStateBackupRestorePending = false;
  renderFailedOcrPanel(null);
  pdfDetectionStatus.textContent = uploadedSource?.name
    ? `OCR 文本已删除；原文件 ${getSelectedFileDisplayName(uploadedSource.name)} 仍保留，可重新识别或手动粘贴。`
    : "OCR 文本已删除。";
  setUploadStatus("已删除 OCR 文本；确认表和已发布票未改变。", "success");
  saveAppState({ forceIndexedBackupReplace: true });
  showToast("OCR 文本已删除。", "success");
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
  resetSeatmapTestStatus("快速生成热区后需要逐区测试");
  seatmapStatus.textContent = `已生成 ${labels.length} 个可点击区域。发布票源前必须前台逐区测试。`;
  showToast(`已生成 ${labels.length} 个可点击区域。`, "success");
  saveAndArchiveAppStep(`快速生成热区：${currentEvent.name} · ${labels.length} 个`, "座位图");
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
  resetSeatmapTestStatus("开始重新标注热区");
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
    resetSeatmapTestStatus("手动标注热区后需要逐区测试");
    zoneMarkingStatus.textContent = `已标注 ${markingZones.length} 个 SVG 可点击热区。请在座位图工具栏测试后点“确认测试完成”。`;
    showToast("区域标注完成。", "success");
    saveAndArchiveAppStep(`手动标注热区完成：${currentEvent.name} · ${markingZones.length} 个`, "座位图");
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
  resetSeatmapTestStatus("扫描保存热区后需要逐区测试");
  scannedRegions = [];
  zoneNameInput.value = "";
  recognizedZonesList.textContent = currentEvent.zones.map((zone) => zone.label).join(", ");
  unrecognizedZonesList.textContent = "无";
  selectedDateId = null;
  selectedZone = null;
  hoveredZone = null;
  const template = await saveCurrentSeatmapAsTemplate(true);
  zoneMarkingStatus.textContent = template
    ? `已保存 ${currentEvent.zones.length} 个完全透明的独立 SVG 可点击热区，并已把座位图底图一起存入模板库“${template.name}”。测试无误后请点“确认测试完成”。`
    : `已保存 ${currentEvent.zones.length} 个完全透明的独立 SVG 可点击热区。测试无误后请点“确认测试完成”。`;
  showToast(template ? "整套座位图模板已保存。" : "座位图热区已保存。", "success");
  saveAndArchiveAppStep(`保存座位图热区：${currentEvent.name} · ${currentEvent.zones.length} 个`, "座位图");
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
  seatmapHotspotVisible = Boolean(currentEvent.zones.length);
  seatmapEditingZoneId = "";
  seatmapEditDraftPolygon = null;
  seatmapEditDragging = null;
  searchTerm = "";
  searchInput.value = "";
  render();
  setMode("customer");
  seatmapFrame.scrollIntoView({ behavior: "smooth", block: "center" });
  const message = currentEvent.zones.length
    ? `已进入热区检查：${currentEvent.zones.length} 个热区已显示。保存后可切到客户视角测试。`
    : "已进入前台测试：当前只有座位图，保存热区后才能点击区域。";
  showToast(message, currentEvent.zones.length ? "success" : "idle");
  saveAndArchiveAppStep(`进入座位图测试：${currentEvent.name}`, "座位图测试");
}

function syncNewEventDisplayName() {
  const artist = newEventArtist.value.trim();
  const city = newEventCity.value.trim();
  if (!newEventName.value.trim() && (artist || city)) {
    newEventName.placeholder = artist && city ? `${artist} ${city}` : "不填则自动生成：团体 + 城市";
  }
}

function createNewEvent() {
  const artist = newEventArtist.value.trim();
  const city = newEventCity.value.trim();
  const venue = newEventVenue.value.trim();
  const manualName = newEventName.value.trim();
  const name = manualName || [artist, city].filter(Boolean).join(" ").trim();
  const dates = newEventDates.value.trim();
  if (!artist && !name) {
    newEventStatus.textContent = "请先填写演出人员/团体，或填写前台显示的演出名称。";
    newEventStatus.dataset.status = "error";
    showToast("创建失败：缺少演出信息。", "error");
    return;
  }

  const idBase = slugify(name);
  const id = events.some((event) => event.id === idBase) ? `${idBase}-${Date.now()}` : idBase;
  const location = [city || "待填写城市", venue || "待填写场馆"].filter(Boolean).join(" · ");
  const newEvent = {
    id,
    name,
    artist: artist || name,
    city: city || "",
    location,
    dates: dates || "待定",
    dateOptions: parseDateOptions(dates),
    venue: venue || location || "待填写场馆",
    venueLocal: venue || "",
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
  manualReviewOnly = false;
  newEventForm.classList.add("hidden");
  newEventForm.reset();
  newEventStatus.dataset.status = "success";
  newEventStatus.textContent = "演出已创建，可以上传座位图和票源 PDF。";
  showToast(`${name} 已创建。`, "success");
  saveAndArchiveAppStep(`创建演出：${name}`, "演出");
  render();
  renderAdminEvent();
  renderUploadRecords();
  renderReviewPanel();
  renderPublishedTables();
}

function deleteCurrentEvent() {
  if (events.length <= 1) {
    showToast("至少需要保留一个演出。", "error");
    return;
  }
  const tableCount = currentEvent.tables.length;
  const pendingCount = pendingTables.filter((table) => table.eventId === currentEvent.id).length;
  const confirmed = window.confirm(`确定删除「${currentEvent.name}」吗？\n\n会删除该演出的座位图、热区、${tableCount} 张已发布票源表和 ${pendingCount} 张待确认表。`);
  if (!confirmed) return;
  const deletedName = currentEvent.name;
  const deletedId = currentEvent.id;
  saveAndArchiveAppStep(`删除前备份：${deletedName}`, "删除前备份");
  const currentIndex = events.findIndex((event) => event.id === deletedId);
  if (currentIndex >= 0) events.splice(currentIndex, 1);
  for (let index = pendingTables.length - 1; index >= 0; index -= 1) {
    if (pendingTables[index].eventId === deletedId) pendingTables.splice(index, 1);
  }
  currentEvent = events[Math.max(0, currentIndex - 1)] || events[0];
  selectedDateId = null;
  selectedZone = null;
  hoveredZone = null;
  searchTerm = "";
  selectedPendingTableId = pendingTables.find((table) => table.eventId === currentEvent.id)?.id || null;
  searchInput.value = "";
  newEventForm.classList.add("hidden");
  pendingSeatmap = null;
  manualReviewOnly = false;
  saveAndArchiveAppStep(`删除演出：${deletedName}`, "删除演出");
  render();
  renderAdminEvent();
  renderUploadRecords();
  renderReviewPanel();
  renderPublishedTables();
  showToast(`已删除 ${deletedName}。`, "success");
}

function clearCurrentPublishedTables() {
  const tableCount = currentEvent.tables.length;
  if (!tableCount) {
    showToast("当前演出没有已发布票源可清空。", "error");
    return;
  }
  const confirmed = window.confirm(
    `确定清空「${currentEvent.name}」的已发布票源吗？\n\n会删除 ${tableCount} 张已发布票源表，客户前台会立刻清空旧票。座位图、热区和待确认表不会删除。`,
  );
  if (!confirmed) return;
  saveAndArchiveAppStep(`清空已发布前备份：${currentEvent.name}`, "删除前备份");
  const removedIds = new Set(currentEvent.tables.map((table) => table.id));
  currentEvent.tables = [];
  for (let index = uploadedTables.length - 1; index >= 0; index -= 1) {
    const table = uploadedTables[index];
    if (table.eventId === currentEvent.id || removedIds.has(table.id)) uploadedTables.splice(index, 1);
  }
  selectedDateId = null;
  selectedZone = null;
  hoveredZone = null;
  searchTerm = "";
  searchInput.value = "";
  saveAndArchiveAppStep(`清空已发布票源：${currentEvent.name}`, "清空票源");
  render();
  renderAdminEvent();
  renderUploadRecords();
  renderReviewPanel();
  renderPublishedTables();
  setUploadStatus(`已清空 ${tableCount} 张已发布票源表，可以上传今天的新票。`, "success");
  showToast("已清空当前演出前台旧票。", "success");
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

function runWhenDocumentVisible(callback) {
  if (document.visibilityState !== "hidden") {
    callback();
    return;
  }
  const onVisible = () => {
    if (document.visibilityState === "hidden") return;
    document.removeEventListener("visibilitychange", onVisible);
    callback();
  };
  document.addEventListener("visibilitychange", onVisible);
}

function runWhenPageIdle(callback, timeout = 1200) {
  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(callback, { timeout });
    return;
  }
  window.setTimeout(callback, 0);
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
deleteCurrentEventButton.addEventListener("click", deleteCurrentEvent);
newEventArtist.addEventListener("input", syncNewEventDisplayName);
newEventCity.addEventListener("input", syncNewEventDisplayName);

eventSearchInput.addEventListener("input", () => {
  eventSearchTerm = eventSearchInput.value.trim();
  renderEventList();
});

eventPickerToggle.addEventListener("click", () => {
  if (eventSearchTerm) {
    eventSearchTerm = "";
    eventSearchInput.value = "";
    eventPickerOpen = false;
  } else {
    eventPickerOpen = !eventPickerOpen;
  }
  renderEventList();
});

adminEventList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-admin-event-id]");
  if (!button) return;
  currentEvent = events.find((item) => item.id === button.dataset.adminEventId);
  selectedDateId = null;
  selectedZone = null;
  searchTerm = "";
  searchInput.value = "";
  pendingSeatmap = null;
  manualReviewOnly = false;
  render();
  renderAdminEvent();
  renderUploadRecords();
  renderReviewPanel();
  renderFieldMappingPreview();
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
  eventPickerOpen = false;
  eventSearchTerm = "";
  eventSearchInput.value = "";
  searchInput.value = "";
  manualReviewOnly = false;
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
  const toolButton = event.target.closest("[data-seatmap-tool]");
  if (toolButton) {
    const action = toolButton.dataset.seatmapTool;
    if (action === "show-hotspots") showSeatmapHotspots();
    if (action === "customer-test") showSeatmapCustomerTest();
    if (action === "confirm-tested") markSeatmapTestComplete();
    if (action === "edit-selected") startSeatmapHotspotEdit();
    if (action === "save-edit") saveSeatmapHotspotEdit();
    if (action === "cancel-edit") cancelSeatmapHotspotEdit();
    return;
  }
  if (event.target.closest(".seatmap-edit-control")) return;
  const seatmap = event.target.closest(".seatmap-stage");
  if (!seatmap) return;
  const zone = getZoneForSeatmapEvent(event, seatmap);
  if (!zone) return;
  selectZone(zone);
});

seatmapFrame.addEventListener("mousemove", (event) => {
  const seatmap = event.target.closest(".seatmap-stage");
  if (!seatmap) return;
  if (seatmapEditDragging || event.target.closest(".seatmap-edit-control")) {
    seatmap.style.cursor = "";
    return;
  }
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
  const zone = getZoneFromTarget(hotspot);
  if (!zone) return;
  event.preventDefault();
  selectZone(zone);
});

seatmapFrame.addEventListener("pointerdown", handleSeatmapEditPointerDown);
window.addEventListener("pointermove", handleSeatmapEditPointerMove);
window.addEventListener("pointerup", handleSeatmapEditPointerEnd);
window.addEventListener("pointercancel", handleSeatmapEditPointerEnd);

zoneDrawer.addEventListener("click", (event) => {
  const ticketCard = event.target.closest("[data-ticket-key]");
  if (ticketCard) {
    const ticket = findTicketByKey(ticketCard.dataset.ticketKey);
    if (ticket) {
      if (window.ticketSeatmapDebug?.enabled !== false) {
        console.info("[ticket-date-debug] ticket-card-click", JSON.stringify({
          ticketKey: ticketCard.dataset.ticketKey,
          eventId: currentEvent?.id,
          zone: selectedZone?.label || "",
          ...getSelectedDateDebugInfo(),
          tableId: ticket.table.id,
          rowIndex: ticket.index,
          sourcePage: ticket.table.sourcePage || "",
          dateValues: getTicketDateValues(ticket),
          rowDateKeys: getTicketDateValues(ticket).flatMap((value) => getDateKeysFromText(value)),
          row: ticket.row,
        }));
      }
      openOriginalTable(ticket.table);
    }
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
  resetSeatmapTestStatus("座位图已更换，需要重新扫描并测试热区");
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
    resetSeatmapTestStatus("自动套用标准热区后需要逐区测试");
    seatmapStatus.textContent = `座位图已保存，并已自动套用 ${currentEvent.zones.length} 个拉椅子标准热区。发布票源前必须前台逐区测试。`;
    if (!saveAndArchiveAppStep(`保存座位图：${currentEvent.name} · ${savedSeatmapName}`, "座位图")) return false;
    showToast(`${currentEvent.name} 座位图已更新。`, "success");
    renderAdminEvent();
    render();
    return true;
  }
  seatmapStatus.textContent = autoScan ? "座位图已上传并保存，正在自动扫描热区..." : "座位图已保存。点击“扫描热区”后会自动组合 AI 和本地兜底识别。";
  if (!saveAndArchiveAppStep(`保存座位图：${currentEvent.name} · ${savedSeatmapName}`, "座位图")) return false;
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
toggleTemplateLibraryButton.addEventListener("click", async () => {
  templateLibraryOpen = !templateLibraryOpen;
  if (templateLibraryOpen) {
    templateLibrarySummary.textContent = "正在刷新模板文件...";
    await loadExternalSeatmapTemplates();
    return;
  }
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
    saveAndArchiveAppStep(`重命名座位图模板：${template.name} -> ${nextName}`, "座位图模板");
    renderSeatmapTemplates();
    showToast("模板名称已更新。", "success");
    return;
  }
  if (button.dataset.deleteTemplate) {
    seatmapTemplates.splice(templateIndex, 1);
    if (currentEvent.seatmapTemplateId === template.id) currentEvent.seatmapTemplateId = "";
    saveAndArchiveAppStep(`删除座位图模板：${template.name}`, "座位图模板");
    renderSeatmapTemplates();
    renderAdminChecklist();
    showToast("模板已删除。当前演出的座位图不会被清掉。", "success");
  }
});
confirmAllButton.addEventListener("click", confirmAllPendingTables);
publishReadyButton.addEventListener("click", confirmReadyPendingTables);
clearPublishedButton.addEventListener("click", clearCurrentPublishedTables);
publishedTables.addEventListener("click", (event) => {
  const button = event.target.closest("[data-published-table-action]");
  if (!button) return;
  handlePublishedTableAction(button.dataset.publishedTableAction);
});
createOperationArchiveButton.addEventListener("click", () => {
  saveAndArchiveAppStep(`手动存档：${currentEvent.name}`, "手动存档", { silent: false });
});
clearOperationArchivesButton.addEventListener("click", clearOperationArchives);
operationArchiveList.addEventListener("click", (event) => {
  const restoreButton = event.target.closest("[data-restore-operation-archive]");
  if (restoreButton) {
    restoreOperationArchive(restoreButton.dataset.restoreOperationArchive);
    return;
  }
  const deleteButton = event.target.closest("[data-delete-operation-archive]");
  if (deleteButton) {
    deleteOperationArchive(deleteButton.dataset.deleteOperationArchive);
  }
});
showManualReviewButton.addEventListener("click", () => {
  manualReviewOnly = !manualReviewOnly;
  const riskyTable = pendingTables.find((table) => table.eventId === currentEvent.id && ensurePendingTableReviewFlags(table).needsManualReview);
  if (manualReviewOnly && riskyTable) selectedPendingTableId = riskyTable.id;
  renderUploadRecords();
  renderReviewPanel();
});
clearPendingButton.addEventListener("click", clearCurrentPendingTables);
if (clearGeneratedPendingButton) clearGeneratedPendingButton.addEventListener("click", clearGeneratedPendingTablesAndKeepOcr);
if (saveOcrTextButton) saveOcrTextButton.addEventListener("click", saveCurrentOcrTextManually);
if (clearOcrTextButton) clearOcrTextButton.addEventListener("click", clearSavedOcrText);

sourceFileInput.addEventListener("change", async () => {
  const file = sourceFileInput.files?.[0];
  if (!file) {
    stopTicketOcrPolling();
    uploadedSource = null;
    selectedSourceName.textContent = "微信截图通常一张图是一张表；PDF 可能包含多张表，需要先按页/按表拆开。";
    selectedSourceName.title = "";
    pdfDetectionStatus.textContent = "选择 PDF 后自动识别页数/候选表数量。";
    setUploadStatus("先选择原始图片/PDF，再发布测试。");
    return;
  }
  stopTicketOcrPolling();
  lastTicketOcrJobSnapshot = null;
  autoPendingGenerationJobId = null;
  largeAppStateBackupRestorePending = false;
  renderFailedOcrPanel(null);
  const isSpreadsheet = isSpreadsheetFile(file);
  let dataUrl = isSpreadsheet ? await readFileAsDataUrl(file) : "";
  let stableUrl = "";
  try {
    stableUrl = await saveUploadedSourceFile(file, dataUrl);
  } catch (error) {
    showToast(error.message || "原始文件保存失败，将临时保存在浏览器。", "error");
    dataUrl = dataUrl || (await readFileAsDataUrl(file));
    stableUrl = dataUrl;
  }
  uploadedSource = {
    name: file.name,
    type: file.type || (file.name.toLowerCase().endsWith(".pdf") ? "application/pdf" : isSpreadsheetFile(file) ? "text/csv" : "image/*"),
    url: stableUrl,
    dataUrl: String(stableUrl || "").startsWith("uploads/") ? "" : dataUrl,
    sourceFile: file,
    detectedTables: 1,
  };
  if (isSpreadsheet) {
    try {
      setUploadStatus("正在读取表格，准备字段映射预览...", "loading");
      showToast("正在读取表格...", "loading");
      const rawRows = await readSpreadsheetRows(file, dataUrl);
      const spreadsheet = normalizeSpreadsheetRows(rawRows);
      if (!spreadsheet) throw new Error("没有读到有效表头和数据行。");
      startFieldMappingPreview({
        headers: spreadsheet.headers,
        rows: spreadsheet.rows,
        sourceName: getSelectedFileDisplayName(file.name),
        sourceUrl: stableUrl,
        sourceType: uploadedSource.type,
      });
      selectedSourceName.textContent = `已选择：${getSelectedFileDisplayName(file.name)}`;
      selectedSourceName.title = decodePossiblyEncodedFileName(file.name);
      pdfDetectionStatus.textContent = "已读取表格文件，请先完成字段映射，再确认导入。";
      setUploadStatus("请在字段映射预览里指定每一列含义。", "success");
      showToast("已进入字段映射预览。", "success");
      return;
    } catch (error) {
      setUploadStatus(error.message || "表格读取失败。", "error");
      showToast("表格读取失败。", "error");
      return;
    }
  }
  const isPdf = uploadedSource.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
  if (isPdf) uploadTableText.value = "";
  saveAndArchiveAppStep(`选择票源文件：${file.name}`, "上传文件");
  selectedSourceName.textContent = `已选择：${getSelectedFileDisplayName(file.name)}`;
  selectedSourceName.title = decodePossiblyEncodedFileName(file.name);
  setUploadStatus("正在自动检测文件结构...", "loading");
  showToast("正在检测文件结构...", "loading");
  const detectedTables = await detectPdfPageCount(file);
  uploadedSource.detectedTables = detectedTables;
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
  publishUpload().catch((error) => {
    setUploadStatus(error.message || "上传处理失败。", "error");
    showToast("上传处理失败。", "error");
  });
});

uploadTableTitle.addEventListener("input", () => scheduleAppStateSave(800));
uploadTableText.addEventListener("input", () => {
  rememberCurrentOcrText({ status: lastTicketOcrJobSnapshot?.status || "manual" });
  scheduleAppStateSave(300);
});

publishUploadButton.addEventListener("click", () => {
  publishUpload().catch((error) => {
    setUploadStatus(error.message || "上传处理失败。", "error");
    showToast("上传处理失败。", "error");
  });
});

if (quickManualUploadButton) {
  quickManualUploadButton.addEventListener("click", () => {
    publishUploadQuickManual().catch((error) => {
      setUploadStatus(error.message || "快速人工生成失败。", "error");
      showToast("快速人工生成失败。", "error");
    });
  });
}

retryFailedOcrButton.addEventListener("click", async () => {
  const jobId = lastTicketOcrJobSnapshot?.id || activeTicketOcrJobId;
  if (!jobId) {
    showToast("没有可重试的识别任务。", "error");
    return;
  }
  retryFailedOcrButton.disabled = true;
  setUploadStatus("正在重试失败页...", "loading");
  showToast("正在重试失败页。", "loading");
  try {
    const latest = await refreshTicketOcrJobSnapshot(jobId);
    if (latest.status === "running" || latest.status === "queued") {
      setUploadStatus(latest.message || "当前识别任务还没结束，请等全部扫描结束后再重试失败页。", "idle");
      showToast("当前识别任务还没结束。", "idle");
      return;
    }
    const response = await fetch("/api/tables/recognize/retry-failed", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: jobId }),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || result.error || "失败页重试启动失败。");
    activeTicketOcrJobId = result.id || jobId;
    renderFailedOcrPanel(result);
    await pollTicketOcrJob(activeTicketOcrJobId);
  } catch (error) {
    setUploadStatus(error.message || "失败页重试失败。", "error");
    showToast("失败页重试失败。", "error");
  } finally {
    const snapshot = lastTicketOcrJobSnapshot;
    retryFailedOcrButton.disabled = !snapshot?.id && !activeTicketOcrJobId;
  }
});

copyFailedOcrButton.addEventListener("click", async () => {
  const report = buildFailedOcrReport();
  if (!report) {
    showToast("暂无失败数据可复制。", "error");
    return;
  }
  failedOcrData.value = report;
  try {
    await navigator.clipboard.writeText(report);
    showToast("失败数据已复制。", "success");
  } catch {
    failedOcrData.select();
    showToast("已选中失败数据，可以手动复制。", "error");
  }
});

fieldMappingTable.addEventListener("change", (event) => {
  const select = event.target.closest("[data-field-mapping-index]");
  if (!select || !fieldMappingDraft) return;
  const index = Number(select.dataset.fieldMappingIndex);
  if (!Number.isInteger(index)) return;
  fieldMappingDraft.mapping[index] = select.value;
  saveAndArchiveAppStep(`调整字段映射：${fieldMappingDraft.sourceName || currentEvent.name}`, "字段映射");
});

confirmFieldMappingButton.addEventListener("click", confirmFieldMappingImport);

cancelFieldMappingButton.addEventListener("click", () => {
  const sourceName = fieldMappingDraft?.sourceName || currentEvent.name;
  fieldMappingDraft = null;
  renderFieldMappingPreview();
  saveAndArchiveAppStep(`取消字段映射：${sourceName}`, "字段映射");
  setUploadStatus("已取消字段映射，本次表格未导入。", "idle");
  showToast("已取消字段映射。", "success");
});

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
  selectPendingTable(button.dataset.reviewTable, { scroll: true });
});

uploadRecords.addEventListener("keydown", (event) => {
  if (!["Enter", " "].includes(event.key)) return;
  const record = event.target.closest("[data-review-table]");
  if (!record) return;
  event.preventDefault();
  selectPendingTable(record.dataset.reviewTable, { scroll: true });
});

reviewLayout.addEventListener("click", (event) => {
  const quickPublishButton = event.target.closest("[data-quick-row-publish]");
  if (quickPublishButton) {
    const table = getSelectedPendingTable();
    setQuickManualRowPublish(table, Number(quickPublishButton.dataset.quickRowPublish), quickPublishButton.dataset.publishValue === "true");
    return;
  }
  const quickSubmitPageButton = event.target.closest("[data-quick-submit-page]");
  if (quickSubmitPageButton) {
    confirmQuickManualCurrentTable();
    return;
  }
  const quickSubmitAllButton = event.target.closest("[data-quick-submit-all]");
  if (quickSubmitAllButton) {
    confirmAllQuickManualTables();
    return;
  }
  const quickBulkSkipButton = event.target.closest("[data-quick-mark-all-skip]");
  if (quickBulkSkipButton) {
    markAllQuickManualRows(getSelectedPendingTable(), false);
    return;
  }
  const quickBulkPublishButton = event.target.closest("[data-quick-mark-all-publish]");
  if (quickBulkPublishButton) {
    markAllQuickManualRows(getSelectedPendingTable(), true);
    return;
  }
  const quickInvertButton = event.target.closest("[data-quick-invert-selection]");
  if (quickInvertButton) {
    invertQuickManualRows(getSelectedPendingTable());
    return;
  }
  const cacheReviewPageNextButton = event.target.closest("[data-cache-review-page-next]");
  if (cacheReviewPageNextButton) {
    saveCurrentReviewChoices({ advance: true });
    return;
  }
  const cacheReviewPageButton = event.target.closest("[data-cache-review-page]");
  if (cacheReviewPageButton) {
    saveCurrentReviewChoices();
    return;
  }
  const cacheAllReviewChoicesButton = event.target.closest("[data-cache-all-review-choices]");
  if (cacheAllReviewChoicesButton) {
    saveAllReviewChoices();
    return;
  }
  const navButton = event.target.closest("[data-review-table-nav]");
  if (navButton) {
    selectAdjacentPendingTable(navButton.dataset.reviewTableNav === "prev" ? -1 : 1);
    return;
  }
  const bulkSkipButton = event.target.closest("[data-mark-all-skip-draft]");
  if (bulkSkipButton) {
    const table = getSelectedPendingTable();
    markAllReviewRowsSkipDraft(table);
    return;
  }
  const bulkPublishButton = event.target.closest("[data-mark-all-publish-draft]");
  if (bulkPublishButton) {
    const table = getSelectedPendingTable();
    markAllReviewRowsPublishDraft(table);
    return;
  }
  const toggleQuickCheckButton = event.target.closest("[data-toggle-quick-check-table]");
  if (toggleQuickCheckButton) {
    toggleQuickCheckTable(getSelectedPendingTable());
    return;
  }
  const toggleSkippedButton = event.target.closest("[data-toggle-skipped-review]");
  if (toggleSkippedButton) {
    toggleShowSkippedReviewRows(getSelectedPendingTable());
    return;
  }
  const restoreSnapshotButton = event.target.closest("[data-restore-review-snapshot]");
  if (restoreSnapshotButton) {
    restoreReviewSnapshot(getSelectedPendingTable(), restoreSnapshotButton.dataset.restoreReviewSnapshot);
    return;
  }
  const toggleOpenCvColorsButton = event.target.closest("[data-toggle-opencv-colors]");
  if (toggleOpenCvColorsButton) {
    toggleOpenCvRowColorPreview(getSelectedPendingTable());
    return;
  }
  const colorSampleButton = event.target.closest("[data-color-sample-row]");
  if (colorSampleButton) {
    setColorReviewSample(
      getSelectedPendingTable(),
      Number(colorSampleButton.dataset.colorSampleRow),
      colorSampleButton.dataset.colorSampleType,
    );
    return;
  }
  const aiButton = event.target.closest("[data-review-ai-assist]");
  if (aiButton) {
    const table = getSelectedPendingTable();
    const instruction = document.querySelector("#reviewAiInstruction")?.value.trim() || "";
    requestReviewAiAssist(table, instruction);
    return;
  }
  const applyAiButton = event.target.closest("[data-apply-ai-review]");
  if (applyAiButton) {
    applyReviewAiSuggestions(getSelectedPendingTable());
    return;
  }
  const savePriceButton = event.target.closest("[data-save-review-price]");
  if (savePriceButton) {
    const table = getSelectedPendingTable();
    const rowIndex = Number(savePriceButton.dataset.saveReviewPrice);
    const input = reviewLayout.querySelector(`[data-review-price-input="${rowIndex}"]`);
    saveReviewRowPrice(table, rowIndex, input?.value || "");
    return;
  }
  const applyDateButton = event.target.closest("[data-apply-review-date]");
  if (applyDateButton) {
    const input = reviewLayout.querySelector("[data-review-date-input]");
    applyReviewDateToTable(getSelectedPendingTable(), input?.value || "");
    return;
  }
  const editRowButton = event.target.closest("[data-edit-review-row]");
  if (editRowButton) {
    startReviewRowEdit(getSelectedPendingTable(), Number(editRowButton.dataset.editReviewRow));
    return;
  }
  const saveRowButton = event.target.closest("[data-save-review-row]");
  if (saveRowButton) {
    const card = saveRowButton.closest("[data-review-row-index]");
    saveReviewRowEdits(getSelectedPendingTable(), Number(saveRowButton.dataset.saveReviewRow), card);
    return;
  }
  const cancelRowButton = event.target.closest("[data-cancel-review-row]");
  if (cancelRowButton) {
    cancelReviewRowEdit(getSelectedPendingTable(), Number(cancelRowButton.dataset.cancelReviewRow));
    return;
  }
  const setPublishButton = event.target.closest("[data-set-row-publish]");
  if (setPublishButton) {
    const table = getSelectedPendingTable();
    setPendingRowPublish(table, Number(setPublishButton.dataset.setRowPublish), setPublishButton.dataset.publishValue === "true");
    return;
  }
  const publishButton = event.target.closest("[data-toggle-row-publish]");
  if (publishButton) {
    const table = getSelectedPendingTable();
    togglePendingRowPublish(table, Number(publishButton.dataset.toggleRowPublish));
    return;
  }
  const rowButton = event.target.closest("[data-toggle-row-sold]");
  if (rowButton) {
    const table = getSelectedPendingTable();
    togglePendingRowSold(table, Number(rowButton.dataset.toggleRowSold));
    return;
  }
  const button = event.target.closest("[data-review-source]");
  if (!button) return;
  const table = pendingTables.find((item) => item.id === button.dataset.reviewSource);
  if (table) openOriginalTable(table);
});

confirmReviewButton.addEventListener("click", confirmSelectedPendingTable);

if (["127.0.0.1", "localhost"].includes(window.location.hostname)) {
  window.__ticketAppDebug = {
    applyRowActionGeometryToTable,
    getSourceRowActionOverlays,
    getRowActionOverlayBox,
    buildInterpolatedRowActionBoxes,
  };
  runWhenPageIdle(() => {
    const table = {
      quickManualMode: true,
      rows: Array.from({ length: 34 }, () => ["11月6日", "内场普票", "are", "42x", "2700"]),
      columns: ["日期", "票面", "区域", "排", "售价"],
      publishRows: {},
      manualPublishRows: {},
      manualSkipRows: {},
    };
    const analysis = {
      source: "opencv",
      imageWidth: 1241,
      imageHeight: 2008,
      rows: [
        { label: "红底", y1: 231, y2: 246, x1: 33, x2: 1206 },
        { label: "白底", y1: 924, y2: 939, x1: 49, x2: 1191 },
      ],
    };
    const applied = applyRowActionGeometryToTable(table, analysis);
    const overlays = getSourceRowActionOverlays(table);
    document.documentElement.dataset.rowActionSelfTest = JSON.stringify({
      applied,
      rows: table.rowColorRows?.length || 0,
      overlays: overlays.length,
      source: table.rowColorSource || "",
      firstTop: overlays[0]?.topPct || 0,
      lastTop: overlays[overlays.length - 1]?.topPct || 0,
    });
  }, 200);
  runWhenPageIdle(() => {
    const debugParams = new URLSearchParams(window.location.search);
    if (!debugParams.has("debugQuickManualOverlay")) return;
    if (debugParams.has("resetDebugState")) {
      pendingTables.splice(0, pendingTables.length);
    }
    const sourceFileName = "EXO-09-10-13_17.pdf";
    currentEvent = events.find((event) => event.id === "exo-encore") || currentEvent;
    const rows = Array.from({ length: 34 }, (_, index) => {
      const date = index < 22 ? "11月6日" : "11月8日";
      const rowName = index < 2 ? "41x" : index < 22 ? "42x" : "44x";
      const price = index < 22 ? "2700" : "2800";
      return [date, "内场普票", "are", rowName, "", price];
    });
    const table = updatePendingTableReviewFlags({
      id: `debug-quick-overlay-${Date.now()}`,
      title: "EXO安可合集（标色已售）09-10 13_17.pdf · PDF 第 1 页",
      originalImage: "uploads/1789284363740-5e1xd4-EXO-09-10-13_17.pdf",
      originalType: "application/pdf",
      sourceFileName,
      sourceName: sourceFileName,
      sourcePage: 1,
      sourcePart: 1,
      eventId: currentEvent.id,
      columns: ["日期", "票面", "区域", "排", "备注", "售价"],
      originalColumns: ["日期", "票面", "区域", "排", "备注", "售价"],
      rows,
      originalRows: cloneRows(rows),
      quickManualMode: true,
      publishRows: {},
      manualPublishRows: {},
      manualSkipRows: {},
      quickManualReviewedRows: {},
      needsManualReview: true,
      publishDecisionLogicVersion: PUBLISH_DECISION_LOGIC_VERSION,
      reviewFlagsVersion: REVIEW_FLAGS_VERSION,
      _columnNormalizationVersion: 0,
      rowActionGeometryVersion: 0,
      quickRowActionGeometryTried: false,
      quickRowActionGeometryTriedVersion: 0,
    });
    window.__ticketAppDebug.lastQuickOverlayFixture = {
      id: table.id,
      rows: table.rows.length,
      columns: table.columns.length,
      sourcePage: table.sourcePage,
    };
    const brokenColumnFixture = {
      columns: ["日期", "票面", "区域", "座位号", "备注", "售价", "排"],
      rows: [
        ["11月6日", "内场普票", "are", "41x", "2700", "", ""],
        ["11月6日", "内场普票", "are", "42x", "2700", "", ""],
      ],
      originalColumns: ["日期", "票面", "区域", "座位号", "备注", "售价", "排"],
      originalRows: [
        ["11月6日", "内场普票", "are", "41x", "2700", "", ""],
        ["11月6日", "内场普票", "are", "42x", "2700", "", ""],
      ],
    };
    normalizePendingTableColumns(brokenColumnFixture);
    const displayColumns = getQuickManualDisplayColumns(brokenColumnFixture);
    document.documentElement.dataset.columnLockSelfTest = JSON.stringify({
      columns: brokenColumnFixture.columns,
      firstRow: brokenColumnFixture.rows[0],
      displayColumns,
      displayFirstRow: getQuickManualDisplayRowCells(brokenColumnFixture, brokenColumnFixture.rows[0], 0, displayColumns),
      priceIndex: findSalePriceColumnIndex(brokenColumnFixture.columns),
      rowIndex: findSeatRowColumnIndexes(brokenColumnFixture.columns)[0] ?? -1,
      quantityIndex: findQuantityColumnIndex(brokenColumnFixture.columns),
      price: getTicketSalePriceValue({ table: brokenColumnFixture, row: brokenColumnFixture.rows[0], index: 0 }),
      quantity: getTicketQuantityValue({ table: brokenColumnFixture, row: brokenColumnFixture.rows[0], index: 0 }),
    });
    pendingTables.unshift(table);
    selectedPendingTableId = table.id;
    manualReviewOnly = false;
    render();
    renderAdminEvent();
    renderUploadRecords({ save: false, normalize: false });
    renderReviewPanel(undefined, { normalize: false });
    runWhenPageIdle(() => {
      selectedPendingTableId = table.id;
      renderUploadRecords({ save: false, normalize: false });
      renderReviewPanel(undefined, { normalize: false });
    }, 1000);
  }, 500);
}

window.addEventListener("storage", (event) => {
  if (event.key === OPERATION_ARCHIVE_KEY) {
    loadOperationArchives();
    renderOperationArchives();
    return;
  }
  if (event.key !== STORAGE_KEY) return;
  loadAppState({ includeArchives: true });
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

window.addEventListener("pagehide", flushAppStateSaveNow);
window.addEventListener("beforeunload", flushAppStateSaveNow);
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") flushAppStateSaveNow();
});

renderRuntimeBanner();
setMode(IS_ADMIN_PAGE ? "admin" : "customer");
renderAiProviderTemplate("aliyun");
refreshAiStatus();
loadExternalSeatmapTemplates();

runWhenDocumentVisible(() => {
  render();
  renderAdminEvent();
  renderUploadRecords();
  renderFieldMappingPreview();
  renderPublishedTables();
  renderOperationArchives();

  if (!IS_ADMIN_PAGE) {
    renderReviewPanel();
  }
});

window.setTimeout(() => runWhenDocumentVisible(() => {
  loadAppState({ includeArchives: true });
  render();
  renderAdminEvent();
  renderUploadRecords();
  renderFieldMappingPreview();
  renderPublishedTables();
  renderOperationArchives();
  setMode(IS_ADMIN_PAGE ? "admin" : "customer");
  resumeRestoredTicketOcrJobIfNeeded();
  runWhenPageIdle(() => renderReviewPanel());
}), 0);
