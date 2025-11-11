export const TYPES = {
  hydration: {
    color: "white",
    bgColor: "#005E91",
    displayName: "수분공급"
  },
  sooth_moisturizing: {
      color: "white",
      bgColor: "#005E91",
      displayName: "진정/보습"
    },
    trouble: {
        color: "white",
        bgColor: "#005E91",
        displayName: "트러블케어"
    },
    exfoliating: {
      color: "white",
      bgColor: "#005E91",
      displayName: "각질케어"
    },
  brightening: {
    color: "white",
    bgColor: "#005E91",
    displayName: "브라이트닝"
  },
  antiaging: {
    color: "white",
    bgColor: "#005E91",
    displayName: "안티에이징"
  },
  entire: {
    color: "white",
    bgColor: "#078C28",
    displayName: "온몸"
  },
  face: {
    color: "white",
    bgColor: "#078C28",
    displayName: "얼굴"
  },
  lip: {
    color: "white",
    bgColor: "#078C28",
    displayName: "입술"
  },
  eye: {
    color: "white",
    bgColor: "#078C28",
    displayName: "눈"
  },
  body: {
    color: "white",
    bgColor: "#078C28",
    displayName: "바디"
  },
  dry: {
    color: "white",
    bgColor: "#DEB100",
    displayName: "건성"
  },
  oily: {
    color: "white",
    bgColor: "#DEB100",
    displayName: "지성"
  },
  complexity: {
    color: "white",
    bgColor: "#DEB100",
    displayName: "복합성"
  },
  sensitivity: {
    color: "white",
    bgColor: "#DEB100",
    displayName: "민감성"
  },
  jell: {
    color: "white",
    bgColor: "#000000",
    displayName: "젤"
  },
  cream: {
    color: "white",
    bgColor: "#000000",
    displayName: "크림"
  },
  lotion: {
    color: "white",
    bgColor: "#000000",
    displayName: "로션"
  },
  liquid: {
    color: "white",
    bgColor: "#000000",
    displayName: "리퀴드"
  },
  balm: {
    color: "white",
    bgColor: "#000000",
    displayName: "밤"
  },
}
// 타입 이름으로 설정을 가져오는 헬퍼 함수
export const getTypeConfig = (typeName) => {
  return TYPES[typeName] || TYPES.normal;
};

// 모든 타입 이름 배열 반환
export const getAllTypeNames = () => {
  return Object.keys(TYPES);
};