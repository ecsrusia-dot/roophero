// 텍스트로 찍은 도트 스프라이트 정의.
// 한 글자 = 한 픽셀. '.' 은 투명. 모든 스프라이트는 16x16.

export const PALETTE = {
  k: "#180f26", // 외곽선
  h: "#241c46", // 그림자 보라(암부)
  d: "#3a2a5e", // 보라 중간
  v: "#7c4fd0", // 보라
  V: "#a98ff0", // 밝은 보라
  w: "#f4f2ff", // 흰색
  s: "#c9d2e8", // 강철 밝음
  S: "#77839f", // 강철 어두움
  g: "#f0c75e", // 골드
  G: "#a8752a", // 골드 어두움
  y: "#ffe27a", // 밝은 노랑
  r: "#e04545", // 빨강
  R: "#7e1e2c", // 어두운 빨강
  o: "#ff9838", // 주황
  O: "#c05a12", // 어두운 주황
  b: "#4aa8ff", // 파랑
  B: "#1f4e9c", // 어두운 파랑
  c: "#bce8ff", // 얼음
  C: "#5aa8cc", // 얼음 어두움
  e: "#58c86a", // 초록
  E: "#2a7a3a", // 어두운 초록
  f: "#e8b48a", // 피부
  F: "#a06848", // 피부 어두움
  n: "#8a5a2c", // 가죽 갈색
  N: "#573619", // 어두운 갈색
  m: "#9aa0b0", // 회색
  M: "#565b6c", // 어두운 회색
  ".": null
};

export const SPRITES = {
  // ── 주인공: 보라 후드, 금테, 호박색 눈 ──
  hero: [
    "....kkkkkk......",
    "...kdvvvvdk.....",
    "..kdvvvvvvdk....",
    ".kdvvhhhhvvdk...",
    ".kdvhhhhhhvdk...",
    ".kdvhyhhyhvdk...",
    ".kdvhhhhhhvdk...",
    ".kdvhhffhhvdk...",
    "..kdhhhhhhdk....",
    "...kkddddkk.....",
    "..kgddddddgk....",
    ".kdvvdddvvvdk...",
    ".kdvdkgggkdvdk..",
    ".khddkgggkddhk..",
    "..kkk.....kkk...",
    "................"
  ],
  // ── 스킬 ──
  // 기본 검격: 대각선 검 + 하얀 검격 궤적
  skill_001: [
    "..............k.",
    ".............kwk",
    "............kwsk",
    "...........kwsk.",
    "..........kwsk..",
    ".........kwsk...",
    "..k.....kwsk....",
    ".kwk...kwsk.....",
    "..kwk.kwsk......",
    "...kwkwsk.......",
    "....kwsk........",
    "...kggggk.......",
    "..kNnkkgk.......",
    ".kNnk..kk.......",
    ".knk............",
    "..k............."
  ],
  // 뒷골목 연격: X자 번개 이연격
  skill_002: [
    ".k...........k..",
    ".kyk.......kyk..",
    "..kyyk....kyyk..",
    "...kyyk..kyyk...",
    "....kyykkyyk....",
    ".....kywwyk.....",
    "......kwwk......",
    ".....kywwyk.....",
    "....kyykkyyk....",
    "...kyyk..kyyk...",
    "..kyyk....kyyk..",
    ".kyk.......kyk..",
    ".k...........k..",
    "................",
    "................",
    "................"
  ],
  // 숨 고르기: 초록 회복 소용돌이
  skill_003: [
    "................",
    ".....kkkkk......",
    "....kewwwek.....",
    "...kew...wek....",
    "..kew.....wek...",
    "..ke...kk..ek...",
    "..kw..kwek.wk...",
    "..kw..kkek.wk...",
    "..kew.....wek...",
    "...kew...eek....",
    "....keewwek.....",
    ".....kkkkeek....",
    "..........ek....",
    "..........k.....",
    "................",
    "................"
  ],
  // 파쇄격: 강철 주먹 내려찍기 + 충격파
  skill_004: [
    "................",
    "...kkkkkkkk.....",
    "..kswssssssk....",
    ".kswssssssssk...",
    ".kssssssssssk...",
    ".kskkskkskksk...",
    ".kssssssssssk...",
    "..kssssssssk....",
    "...kkkkkkkk.....",
    ".k...ko.ok...k..",
    "kok..ko.ok..kok.",
    ".kok.ko.ok.kok..",
    "..kokkokkokok...",
    "....kkkkkkk.....",
    "................",
    "................"
  ],
  // 월영 일섬: 초승달 + 암영 검격
  skill_005: [
    "......kkkk......",
    "....kkvvvvkk....",
    "...kvvvvvvvvk...",
    "..kvvvkkkkvvk...",
    ".kvvvk...kkk....",
    ".kvvk.....k..w..",
    ".kvvk.......kwk.",
    ".kvvk......kwk..",
    ".kvvk.....kwk...",
    ".kvvvk...kwk....",
    "..kvvvk.kwkvk...",
    "...kvvvkwvvk....",
    "....kkwwvkk.....",
    ".....kwk........",
    "....kk..........",
    "................"
  ],
  // 잉걸불 탄환: 불꽃 구체 + 불티 꼬리
  skill_006: [
    "................",
    "......kkkk......",
    ".....koooook....",
    "....kooyyyok....",
    "...kooyyyyyok...",
    "...koyywwyyok...",
    "...koyywwyyok...",
    "...kooyyyyyok...",
    "....kooyyyok....",
    ".....koooook....",
    "..o...kkkk......",
    ".ko.o...........",
    "..k.ko..........",
    ".....k..........",
    "................",
    "................"
  ],
  // 서리 파문: 바닥에서 솟는 얼음 가시들
  skill_007: [
    "................",
    ".......kk.......",
    "......kcwk......",
    "......kcwk......",
    "..kk..kcwk..kk..",
    ".kcwk.kcwk.kcwk.",
    ".kcwk.kcwk.kcwk.",
    ".kcwkkkcwkkkcwk.",
    ".kcckccccckkcck.",
    "..kcccccccccck..",
    "...kkkkkkkkkk...",
    "................",
    "................",
    "................",
    "................",
    "................"
  ],
  // 흡혈 찌르기: 어둠 단검 + 핏방울
  skill_008: [
    "......kk........",
    ".....khvk.......",
    ".....khvk.......",
    ".....khvk.......",
    ".....khvk.......",
    ".....khvk.......",
    ".....khvk.......",
    "....kvvvvk......",
    ".....khhk..kr...",
    ".....khhk.krRk..",
    ".....khhk..kr...",
    "......kk........",
    "...kr...........",
    "..krRk..........",
    "...kr...........",
    "................"
  ],
  // 여명의 심판: 황금 빛기둥
  skill_009: [
    "......kggk......",
    ".....kgyygk.....",
    ".....kgyygk.....",
    ".....kywwyk.....",
    ".....kywwyk.....",
    ".....kywwyk.....",
    "..g..kywwyk..g..",
    ".....kywwyk.....",
    "....kgywwygk....",
    "...kgyywwyygk...",
    "..kgyyywwyyygk..",
    "..kkkkkkkkkkkk..",
    "..g....gg....g..",
    "................",
    "................",
    "................"
  ],
  // ── 장비 ──
  // 낡은 가죽 갑옷
  equip_001: [
    "................",
    "..kkkk....kkkk..",
    ".knnnnk..knnnnk.",
    ".knnnnkkkknnnnk.",
    ".knnnnnnnnnnnnk.",
    ".knwnnnnnnnnnnk.",
    ".knnnnnnnnnnnnk.",
    "..knnnnNNnnnnk..",
    "..knnnnnnnnnnk..",
    "..knnNnnnnNnnk..",
    "..knnnnnnnnnnk..",
    "...knnnnnnnnk...",
    "...kNNNNNNNNk...",
    "....kkkkkkkk....",
    "................",
    "................"
  ],
  // 뒷골목 단검
  equip_002: [
    "................",
    "......kk........",
    ".....kwsk.......",
    ".....kwsk.......",
    ".....kwsk.......",
    ".....kwsk.......",
    ".....kwsk.......",
    ".....kwsk.......",
    "....kggggk......",
    ".....knnk.......",
    ".....kNnk.......",
    ".....knnk.......",
    "......kk........",
    "................",
    "................",
    "................"
  ],
  // 은빛 정신 목걸이
  equip_003: [
    "................",
    "....kkkkkkk.....",
    "...ks.....sk....",
    "..ks.......sk...",
    "..ks.......sk...",
    "..ks.......sk...",
    "..ks.......sk...",
    "...ks.....sk....",
    "....ks...sk.....",
    ".....kbbbk......",
    "....kbwbbbk.....",
    "....kbbbbbk.....",
    ".....kbbbk......",
    "......kkk.......",
    "................",
    "................"
  ],
  // 수호자의 낡은 방패
  equip_004: [
    "................",
    "..kkkkkkkkkk....",
    ".ksmmmmmmmmsk...",
    ".ksmmmggmmmsk...",
    ".ksmmmggmmmsk...",
    ".ksmggggggmsk...",
    ".ksmggggggmsk...",
    ".ksmmmggmmmsk...",
    ".ksmmmggmmmsk...",
    "..ksmmmmmmsk....",
    "..ksmmmmmmsk....",
    "...ksmmmmsk.....",
    "....ksmmsk......",
    ".....kssk.......",
    "......kk........",
    "................"
  ],
  // 투사의 팔찌
  equip_005: [
    "................",
    "....kkkkkk......",
    "...knnnnnnk.....",
    "..knnkkkknnk....",
    ".knnk....knnk...",
    ".knk......knk...",
    ".knk......knk...",
    ".knk......knk...",
    ".knnk....knnk...",
    "..knnkkkknnk....",
    "...knnrrnnk.....",
    "....kkrrkk......",
    "......kk........",
    "................",
    "................",
    "................"
  ],
  // 잉걸불 부적
  equip_006: [
    "......kkk.......",
    ".....kg.gk......",
    ".....kg.gk......",
    "....kkkgkkk.....",
    "...kNnnnnnNk....",
    "..kNn.....nNk...",
    "..kn..koo..nk...",
    "..kn.kooyk.nk...",
    "..kn.koyyk.nk...",
    "..kn..kyk..nk...",
    "..kNn..k..nNk...",
    "...kNnnnnnNk....",
    "....kkkkkkk.....",
    "................",
    "................",
    "................"
  ],
  // 달빛 장막
  equip_007: [
    "..kkk...........",
    ".kswsk..........",
    ".kswssk.........",
    "..kswssk........",
    "...kswsssk......",
    "....ksswsssk....",
    ".....kssswssk...",
    "......ksssswsk..",
    ".......ksssssk..",
    "......ksssssk...",
    "....kkssssskk...",
    "..kkssssskk.....",
    ".kssssskk.......",
    ".kkkkkk.........",
    "................",
    "................"
  ],
  // ── 동료 ──
  // 떠돌이 용병: 투구 + 도끼
  comp_001: [
    "....kkkk........",
    "...kmmmmk..kkk..",
    "...kmmmmk.kssk..",
    "...kffffk.ksssk.",
    "...kfkkfk.kssk..",
    "....kffk..knk...",
    "...kkkkk..knk...",
    "..knnnnnk.knk...",
    ".knnnnnnnkknk...",
    ".kn.nnnnnkknk...",
    ".kn.nnnnn.knk...",
    "..k.nnnnn..k....",
    "...knnknnk......",
    "...kNNkNNk......",
    "....kk.kk.......",
    "................"
  ],
  // 견습 사제: 하양+금 로브
  comp_002: [
    ".....kkkk.......",
    "....knnnnk......",
    "...knnnnnnk.....",
    "...knffffnk.....",
    "...kffkkff......",
    "....kffffk......",
    "....kkkkk.......",
    "...kwwwwwk......",
    "..kwwwgwwwk.....",
    "..kww.g.wwk.....",
    ".kww..g..wwk....",
    ".kww..g..wwk....",
    ".kwwwwwwwwwk....",
    ".kwwwwwwwwwk....",
    "..kkkkkkkkk.....",
    "................"
  ],
  // 흑묘 정령: 보라 눈의 검은 고양이
  comp_003: [
    "................",
    "..kk....kk......",
    ".khhk..khhk.....",
    ".khhhkkhhhk.....",
    ".khhhhhhhhk.....",
    ".khvhhhhvhk.....",
    ".khhhkkhhhk.....",
    "..khhhhhhk......",
    "...khhhhk...kk..",
    "..khhhhhhk.khhk.",
    ".khhhhhhhhkhhk..",
    ".khhhhhhhhhhk...",
    ".khhhhhhhhhk....",
    "..kkkkkkkkk.....",
    "................",
    "................"
  ],
  // 골목 소년 궁수: 후드 + 활
  comp_004: [
    "....kkkk...k....",
    "...kddddk.kwk...",
    "..kddddddkknk...",
    "..kdhhhhdkwknk..",
    "..kdhfhfdkw.knk.",
    "..kdhhhhdkw.knk.",
    "...kdffdkkwknk..",
    "...kkkkk.kknk...",
    "..knnnnnk.kwk...",
    ".knnnnnnnk.k....",
    ".kn.nnnnnk......",
    "..k.nnnnn.......",
    "...knnknnk......",
    "...kNNkNNk......",
    "....kk.kk.......",
    "................"
  ],
  // 화로의 정령: 화로 위 불꽃
  comp_005: [
    "................",
    ".......ko.......",
    "......koyk......",
    ".....kooyok.....",
    "....koyywyok....",
    "....koywwyok....",
    "....koyywyok....",
    ".....koyyok.....",
    "....k.koook.....",
    "...kMkkkkkMk....",
    "...kMmmmmmMk....",
    "...kMkkkkkMk....",
    "....kMmmmMk.....",
    ".....kkkkk......",
    "................",
    "................"
  ],
  // ── 일반 적 ──
  // 부랑 괴물: 붉은 오거
  foe_brute: [
    "................",
    "...kkkkkkkk.....",
    "..krrrrrrrrk....",
    ".krrRrrrrRrrk...",
    ".krrrrrrrrrrk...",
    ".krykrrrrkyrk...",
    ".krrrrrrrrrrk...",
    ".krrrkkkkrrrk...",
    ".krrwk..kwrrk...",
    "..krrkkkkrrk....",
    "..krrrrrrrrk....",
    ".krrk.rr.krrk...",
    ".krk..rr..krk...",
    "..k..kkkk..k....",
    "................",
    "................"
  ],
  // 녹슨 갑주 망령: 해골 기사
  foe_wraith: [
    "....kkkkkk......",
    "...kmMMMMmk.....",
    "..kmMMMMMMmk....",
    "..kmkkkkkkmk....",
    "..kwwwwwwwwk....",
    "..kwbkwwkbwk....",
    "..kwwwwwwwwk....",
    "...kwkkkkwk.....",
    "....kwwwwk......",
    "...kkkkkkkk.....",
    "..kmMhhhhMmk....",
    "..kmhhhhhhmk....",
    "...khhhhhhk.....",
    "....khhhhk......",
    ".....kkkk.......",
    "................"
  ],
  // 굶주린 들개: 늑대 머리
  foe_hounds: [
    "................",
    "..kk............",
    ".kMmk.....kk....",
    ".kMmmk...kmk....",
    ".kMmmmk.kmmk....",
    "..kMmmmkmmmk....",
    "..kmmmmmmmmmk...",
    "..kmmymmmmmmk...",
    ".kmmmmmmmmmmmk..",
    ".kmmmkkkkmmmmk..",
    "..kmwk...kmmmk..",
    "..kwk....kmmk...",
    "...kk...kmmk....",
    ".........kk.....",
    "................",
    "................"
  ],
  // 허물 벗은 도마뱀
  foe_lizard: [
    "................",
    "...kkkkk........",
    "..keeeeek.......",
    ".keeeeeeek......",
    ".keyekeeeek.....",
    ".keeeeeeeeekk...",
    "..keekkkeeeeek..",
    "..keewwkkeeeek..",
    "...kkkk.keeek...",
    "..keeeeekeeek...",
    ".keeeeeeeeek....",
    ".kee.eeeeeek....",
    ".ke..eee.eek....",
    "..k.kkk.kkk.....",
    "................",
    "................"
  ],
  // 그림자 술사
  foe_caster: [
    "....kkkkkk......",
    "...kddddddk.....",
    "..kdhhhhhhdk....",
    "..kdhvhhvhdk....",
    "..kdhhhhhhdk....",
    "...kdhhhhdk.....",
    "..kdddddddk.....",
    ".kdd..vv..ddk...",
    ".kd..kvvk..dk...",
    ".kd..kwvk..dk...",
    ".kdd.kkkk.ddk...",
    "..kdddddddk.....",
    "...kdddddk......",
    "....kkkkk.......",
    "................",
    "................"
  ],
  // 얼어붙은 망자
  foe_frozen: [
    "....kkkkkk......",
    "...kmmmmmmk..c..",
    "..kmmcmmcmmk....",
    "..kmbkmmkbmk....",
    "..kmmmmmmmmk....",
    "..kmmkkkkmmk....",
    "...kmmmmmmk.....",
    "..kkkkkkkkkk....",
    ".kmmchhhhcmmk...",
    ".kmchhhhhhcmk...",
    "..kmhhchhhmk....",
    "..kmhhhhchk.....",
    "...kchhhhck.....",
    "....kkkkkk......",
    ".c..............",
    "................"
  ],
  // ── 보스 ──
  // 회랑의 감시자: 거대한 눈
  boss_watcher: [
    "....kkkkkkkk....",
    "..kkhhhhhhhhkk..",
    ".khhwwwwwwwwhhk.",
    ".khwwwwwwwwwwhk.",
    "khwwwkrrrkwwwhk.",
    "khwwwkrRrkwwwhk.",
    "khwwwkrrrkwwwhk.",
    ".khwwwkkkwwwhk..",
    ".khhwwwwwwwwhk..",
    "..kkhhhhhhhhk...",
    "...k.k.kk.k.....",
    "..kh.kh.kh.kh...",
    "..k...k..k..k...",
    "................",
    "................",
    "................"
  ],
  // 심연의 문지기: 돌 골렘
  boss_gate: [
    "...kkkkkkkk.....",
    "..kMmmmmmmMk....",
    ".kMmrmmmmrmMk...",
    ".kMmmmmmmmmMk...",
    "..kMMkkkkMMk....",
    ".kkMmmmmmmMkk...",
    "kMmmMmmmmMmmMk..",
    "kMmkMmmmmMkmMk..",
    "kMmkMmrmmMkmMk..",
    "kMMkMmmmmMkMMk..",
    ".kkkMmmmmMkkk...",
    "...kMmmkmmMk....",
    "..kMMmk.kmMMk...",
    "..kkkk...kkkk...",
    "................",
    "................"
  ],
  // 붉은 눈의 기사: 흑기사
  boss_knight: [
    "....kkkkkk..k...",
    "...khhhhhhk.ks..",
    "..khhhhhhhhkksk.",
    "..khrhhhhrhk.ks.",
    "..khhhhhhhhkksk.",
    "...khhhhhhk.ksk.",
    "..khhkkkkhhkksk.",
    ".krhhhhhhhhrksk.",
    ".krhhgghhhhrkk..",
    ".krhhgghhhhrk...",
    ".krhhhhhhhhrk...",
    "..krhhhhhhrk....",
    "..khhk..khhk....",
    "..kkk....kkk....",
    "................",
    "................"
  ]
};
