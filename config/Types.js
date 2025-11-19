export const TYPES = {
  hydration: {
    color: "white",
    bgColor: "#005E91",
    displayName: "수분공급",
  },
  sooth_moisturizing: {
    color: "white",
    bgColor: "#005E91",
    displayName: "진정/보습",
  },
  trouble: {
    color: "white",
    bgColor: "#005E91",
    displayName: "트러블케어",
  },
  exfoliating: {
    color: "white",
    bgColor: "#005E91",
    displayName: "각질케어",
  },
  brightening: {
    color: "white",
    bgColor: "#005E91",
    displayName: "브라이트닝",
  },
  antiaging: {
    color: "white",
    bgColor: "#005E91",
    displayName: "안티에이징",
  },
  entire: {
    color: "white",
    bgColor: "#078C28",
    displayName: "온몸",
  },
  face: {
    color: "white",
    bgColor: "#078C28",
    displayName: "얼굴",
  },
  lip: {
    color: "white",
    bgColor: "#078C28",
    displayName: "입술",
  },
  eye: {
    color: "white",
    bgColor: "#078C28",
    displayName: "눈",
  },
  body: {
    color: "white",
    bgColor: "#078C28",
    displayName: "바디",
  },
  dry: {
    color: "white",
    bgColor: "#DEB100",
    displayName: "건성",
  },
  oily: {
    color: "white",
    bgColor: "#DEB100",
    displayName: "지성",
  },
  complexity: {
    color: "white",
    bgColor: "#DEB100",
    displayName: "복합성",
  },
  sensitivity: {
    color: "white",
    bgColor: "#DEB100",
    displayName: "민감성",
  },
  jell: {
    color: "white",
    bgColor: "#000000",
    displayName: "젤",
  },
  cream: {
    color: "white",
    bgColor: "#000000",
    displayName: "크림",
  },
  lotion: {
    color: "white",
    bgColor: "#000000",
    displayName: "로션",
  },
  liquid: {
    color: "white",
    bgColor: "#000000",
    displayName: "리퀴드",
  },
  balm: {
    color: "white",
    bgColor: "#000000",
    displayName: "밤",
  },
  mytype: {
    color: "white",
    bgColor: "#FA6D6D",
    displayName: "마이타입",
  },
};
// 타입 이름으로 설정을 가져오는 헬퍼 함수
export const getTypeConfig = (typeName) => {
  return TYPES[typeName] || null;
};

// 모든 타입 이름 배열 반환
export const getAllTypeNames = () => {
  return Object.keys(TYPES);
};

// 한글 → TYPES 키 변환 매핑
const TYPE_MAP = {
  수분공급: "hydration",
  "진정/보습": "sooth_moisturizing",
  트러블케어: "trouble",
  각질케어: "exfoliating",
  브라이트닝: "brightening",
  안티에이징: "antiaging",

  온몸: "entire",
  얼굴: "face",
  입술: "lip",
  눈: "eye",
  바디: "body",

  건성: "dry",
  지성: "oily",
  복합성: "complexity",
  민감성: "sensitivity",

  젤: "jell",
  크림: "cream",
  로션: "lotion",
  리퀴드: "liquid",
  밤: "balm",
  기타: 'etc',

  마이타입: "mytype",
};

// 한글값으로 getTypeConfig() 호출할 수 있게 도와주는 함수
export const getBadgeConfig = (value) => {
  const key = TYPE_MAP[value];
  return key ? getTypeConfig(key) : null;
};
