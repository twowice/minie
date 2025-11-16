"use client";
import TypeBadge from "@/components/Badge";
import ProductQna from "@/components/ProductQna";
import RatingStar from "@/components/RatingStar";
import {
  Accordion,
  Avatar,
  Box,
  Button,
  Checkbox,
  CloseButton,
  Container,
  Dialog,
  Flex,
  HStack,
  Icon,
  IconButton,
  Image,
  NativeSelect,
  NativeSelectIndicator,
  RadioGroup,
  Spacer,
  Tabs,
  Text,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FaMinus, FaPlus, FaRegHeart } from "react-icons/fa6";
import { IoIosStar, IoIosStarHalf, IoIosStarOutline } from "react-icons/io";

export default function ShoppingDetail() {
  const [items, setItems] = useState([]);
  const [rating, setRating] = useState(5.0);
  const [quantity, setQuantity] = useState(1);
  const [review, setReview] = useState(0);

  useEffect(() => {
    fetch("/data/items.json")
      .then((res) => res.json())
      .then((data) => setItems(data));
  }, []);

  const increase = () => setQuantity((prev) => prev + 1);
  const decrease = () => setQuantity((prev) => prev - 1);

  const { open, onOpen, onClose } = useDisclosure();

  const [productAsk, setProductAsk] = useState(true);
  const [orderAsk, setOrderAsk] = useState(false);

  const handleQna = () => {
    setProductAsk(true);
    setOrderAsk(false);
    onOpen();
  };
  const handleSaveQna = () => {
    if (productAsk) {
      setProductAsk(true);
    } else if (orderAsk) {
      setOrderAsk(true);
    } else {
      setProductAsk(false);
      setOrderAsk(false);
    }
    onClose();
  };
  const handleCancelQna = () => {
    setProductAsk(false);
    setOrderAsk(false);
    onClose();
  };

  const reviews = [
    {
      value: "info",
      title: "상품문의",
      subtitle: "구매확정 문의",
      status: "답변완료",
      userid: "따가운 볼",
      date: "2025.10.23",
      product: "타임 리페어 인텐시브 크림",
      content: `이벤트 응모할려고 오늘 아침에 상품 구매를 했는데 구매확정 상태여야 응모가 가능하더라구요.
        배송을 받아야 구매확정이 가능한데 26일까지 배송을 못받을수도 있을거같은데 미리 구매확정 처리가 가능한가요..?`,
      commenttitle: "답변.",
      comment: `안녕하세요 고객님,
        피부 고민을 함께하는 Minié입니다.
        
        이번 이벤트와 관련하여 혼란을 드린 점 진심으로 사과드립니다.
        현재 티켓 관련 추가 안내를 준비 중이며,
        금일 중으로 넘버즈인 공식 인스타그램 계정, 인스타그램 스토리, 트위터를 통해 공지될 예정입니다.
        조금만 기다려 주시면 감사하겠습니다.
        
        추가로 궁금하신 사항이 있으실 경우,
        카카오톡 @Minié으로 편하게 문의 부탁드립니다.
        
        감사합니다.`,
      commentdate: "2025.10.23",
    },
    {
      value: "productdetail",
      title: "상품문의",
      subtitle: "기존 제품과의 차이",
      status: "답변 대기중",
      userid: "불타는 스킨",
      date: "2025.10.23",
      product: "타임 리페어 인텐시브 크림",
      content:
        "기존의 수딩 미스트 토너를 잘 사용하고있는데요~ 이제품이 새로 나왔다해서요~ 성분차이는 당연히 있겠지만 여드름에는 이 제품이 더 낫나요, 아니면 새로나온 이 제품이 더 나을까요?",
      commenttitle: "",
      comment: "",
    },
  ];
  return (
    <Container maxW={"7xl"}>
      <Box>
        <Flex
          gap={"40px"}
          paddingBottom={"40px"}
          borderBottom={"1px solid rgba(204,204,204,0.8)"}
        >
          <Box maxW={"540px"} maxH={"540px"} w={"50%"}>
            <Image
              src="/images/test/image18.png"
              alt="test"
              w={"100%"}
              h={"100%"}
              objectFit={"cover"}
            />
          </Box>
          <Flex color={"black"} direction={"column"} gap={"16px"} flex={1}>
            <Flex justifyContent={"space-between"} alignItems={"center"}>
              <Text fontSize={"24px"} fontWeight={"700"}>
                아이오페
              </Text>
              <Button
                aria-label="like"
                bgColor={"white"}
                p={2}
                borderRadius="50%"
              >
                <FaRegHeart color="#cccccc" size={18} />
              </Button>
            </Flex>
            <Text
              fontSize={"24px"}
              color={"rgba(0,0,0,0.6)"}
              fontWeight={"500"}
            >
              타임 리페어 인텐시브 크림
            </Text>

            <Spacer />
            <Flex gap={"8px"} alignItems={"center"}>
              <HStack fontSize={"16px"} fontWeight={"500"} gap={"4px"}>
                <Text color={"#FA6D6D"}>20%</Text>
                <Text color={"rgba(0,0,0,0.6)"} textDecoration={"line-through"}>
                  5000원
                </Text>
              </HStack>
              <Text fontSize={"36px"} color={"#FA6D6D"} fontWeight={"700"}>
                4000원
              </Text>
            </Flex>
            <Flex
              gap={"8px"}
              w={"100%"}
              borderBottom={"1px solid #cccccc"}
              paddingBottom={"20px"}
            >
              <TypeBadge typeName={"antiaging"} />
              <TypeBadge typeName={"entire"} />
              <TypeBadge typeName={"dry"} />
              <TypeBadge typeName={"cream"} />
            </Flex>
            <Flex
              justifyContent={"space-between"}
              p={"8px 16px"}
              color={"black"}
              background={"rgba(204,204,204,0.5)"}
              border={"1px solidrgb(204,204,204)"}
              borderRadius={"5px"}
              alignItems={"center"}
            >
              <Text>구매수량</Text>
              <Flex alignItems={"center"} gap={"8px"}>
                <Button
                  aria-label="plus"
                  boxSize="24px"
                  p="0"
                  minW="24px"
                  h="24px"
                  borderRadius="50%"
                  bg="rgba(0,0,0,0.16)"
                  color="white"
                  _hover={{ opacity: 0.7 }}
                  onClick={decrease}
                  disabled={quantity <= 1}
                >
                  <Icon as={FaMinus} boxSize={"10px"} />
                </Button>

                <Text w={"30px"} textAlign={"center"}>
                  {quantity}
                </Text>
                <Button
                  aria-label="minus"
                  boxSize="24px"
                  p="0"
                  minW="24px"
                  h="24px"
                  borderRadius="50%"
                  bg="rgba(0,0,0,0.7)"
                  color="white"
                  _hover={{ opacity: 0.4 }}
                  onClick={increase}
                >
                  <Icon as={FaPlus} boxSize={"10px"} />
                </Button>
              </Flex>
            </Flex>
            <Flex
              justifyContent={"space-between"}
              paddingBottom={"20px"}
              borderBottom={"1px solid #FA6D6D"}
              fontSize={"36px"}
              color={"#FA6D6D"}
            >
              <Text>상품금액 합계</Text>
              <Text>{4000 * quantity}원</Text>
            </Flex>
            <HStack gap={"20px"} w={"100%"}>
              <Button
                border={"1px solid #cccccc"}
                bgColor={"white"}
                flex={1}
                color={"black"}
              >
                장바구니
              </Button>
              <Button bgColor={"#FA6D6D"} color={"white"} flex={1}>
                바로 구매
              </Button>
            </HStack>
          </Flex>
        </Flex>
      </Box>
      <Flex color={"black"} gap={"8px"}>
        <HStack alignContent={"flex-end"} padding={"20px 0"}>
          <Text fontSize={"20px"} fontWeight={"700"} color={"rgba(0,0,0,0.7)"}>
            고객 리뷰
          </Text>

          <Text fontSize={"32px"}>
            <strong>{rating}</strong>
          </Text>
          <Text fontSize={"16px"}>점</Text>
        </HStack>
        <HStack>
          {Array.from({ length: 5 }).map((_, idx) => {
            const starValue = idx + 1;
            let icon;
            if (rating >= starValue) {
              icon = IoIosStar;
            } else if (rating >= starValue - 0.5) {
              icon = IoIosStarHalf;
            } else {
              icon = IoIosStarOutline;
            }
            return (
              <Icon
                as={icon}
                bgColor={"white"}
                key={idx}
                boxSize={"20px"}
                color={"gold"}
              />
            );
          })}
        </HStack>
      </Flex>
      <Tabs.Root
        defaultValue={"productDetail"}
        color={"rgba(0,0,0,0.3)"}
        fontSize={"16px"}
        variant={"plain"}
        textAlign={"center"}
      >
        <Tabs.List
          borderBottom={"1px solid rgba(0,0,0,0.3)"}
          justifyContent={"center"}
          display={"flex"}
          alignItems={"center"}
          w={"100%"}
        >
          <Tabs.Trigger
            value="productDetail"
            flex={1}
            justifyContent={"center"}
            display={"flex"}
            alignItems={"center"}
            _selected={{
              color: "#FA6D6D",
            }}
            _hover={{ color: "#FA6D6D", opacity: 0.7 }}
          >
            상품설명
          </Tabs.Trigger>
          <Tabs.Trigger
            value="payInfo"
            flex={1}
            justifyContent={"center"}
            display={"flex"}
            alignItems={"center"}
            _hover={{ color: "#FA6D6D", opacity: 0.7 }}
            _selected={{
              color: "#FA6D6D",
            }}
          >
            구매정보
          </Tabs.Trigger>
          <Tabs.Trigger
            value="review"
            flex={1}
            justifyContent={"center"}
            display={"flex"}
            alignItems={"center"}
            _hover={{ color: "#FA6D6D", opacity: 0.7 }}
            _selected={{
              color: "#FA6D6D",
            }}
          >
            리뷰
          </Tabs.Trigger>
          <Tabs.Trigger
            value="QnA"
            flex={1}
            justifyContent={"center"}
            display={"flex"}
            alignItems={"center"}
            _hover={{ color: "#FA6D6D", opacity: 0.7 }}
            _selected={{
              color: "#FA6D6D",
            }}
          >
            Q & A
          </Tabs.Trigger>
          <Tabs.Indicator bgColor={"#FA6D6D"} h={"2px"} bottom={"0"} />
        </Tabs.List>
        <Tabs.Content value="productDetail">
          <Image
            src={"/images/test/image.png"}
            w={"100%"}
            alt=""
            p={"20px 0"}
          />
        </Tabs.Content>
        <Tabs.Content value="payInfo">
          <Box pb={"20px"}>
            <Text
              fontSize={"24px"}
              fontWeight={"700"}
              color={"black"}
              textAlign={"left"}
              p={"20px 0 16px 0"}
            >
              상품정보 제공고시
            </Text>
            <Box
              fontSize={"16px"}
              borderTop={"1px solid #cccccc"}
              borderBottom={"1px solid #cccccc"}
              color={"black"}
            >
              <Flex textAlign={"left"} borderBottom={"1px solid #cccccc"}>
                <Text
                  p={"20px"}
                  fontWeight={"700"}
                  bgColor={"rgba(204,204,204,0.8)"}
                  w={"300px"}
                >
                  제품명
                </Text>
                <Text p={"20px"} bgColor={"rgba(204,204,204,0.3)"} w={"100%"}>
                  타임 리페어 인텐시브 크림
                </Text>
              </Flex>
              <Flex textAlign={"left"} borderBottom={"1px solid #cccccc"}>
                <Text
                  p={"20px"}
                  fontWeight={"700"}
                  bgColor={"rgba(204,204,204,0.8)"}
                  w={"300px"}
                >
                  내용물의 용량 또는 중량
                </Text>
                <Text p={"20px"} bgColor={"rgba(204,204,204,0.3)"} w={"100%"}>
                  200ml
                </Text>
              </Flex>
              <Flex textAlign={"left"} borderBottom={"1px solid #cccccc"}>
                <Text
                  p={"20px"}
                  fontWeight={"700"}
                  bgColor={"rgba(204,204,204,0.8)"}
                  w={"300px"}
                >
                  제품 주요 사양
                </Text>
                <Text p={"20px"} bgColor={"rgba(204,204,204,0.3)"} w={"100%"}>
                  모든 피부 타입
                </Text>
              </Flex>
              <Flex textAlign={"left"} borderBottom={"1px solid #cccccc"}>
                <Text
                  p={"20px"}
                  fontWeight={"700"}
                  bgColor={"rgba(204,204,204,0.8)"}
                  w={"300px"}
                >
                  제조번호 및 사용기간
                </Text>
                <Text p={"20px"} bgColor={"rgba(204,204,204,0.3)"} w={"100%"}>
                  별도 표기
                </Text>
              </Flex>
              <Flex textAlign={"left"} borderBottom={"1px solid #cccccc"}>
                <Text
                  p={"20px"}
                  fontWeight={"700"}
                  bgColor={"rgba(204,204,204,0.8)"}
                  w={"300px"}
                >
                  사용방법
                </Text>
                <Text p={"20px"} bgColor={"rgba(204,204,204,0.3)"} w={"100%"}>
                  사용 전 가볍게 흔들어 준 후, 눈을 감고 얼굴 전체에 고르게
                  분사하여 흡수 시켜줍니다. 피부에 건조함이 느껴질 때 수시로
                  뿌려줍니다.
                </Text>
              </Flex>
              <Flex textAlign={"left"} borderBottom={"1px solid #cccccc"}>
                <Box p={"20px"} bgColor={"rgba(204,204,204,0.8)"} w={"300px"}>
                  <Text fontWeight={"700"}>식품의약품안전처 심사 필 유무</Text>
                  <Text fontWeight={"700"}>(기능성 화장품)</Text>
                </Box>
                <Text p={"20px"} bgColor={"rgba(204,204,204,0.3)"} w={"100%"}>
                  해당없음
                </Text>
              </Flex>
              <Flex textAlign={"left"} borderBottom={"1px solid #cccccc"}>
                <Text
                  p={"20px"}
                  fontWeight={"700"}
                  bgColor={"rgba(204,204,204,0.8)"}
                  w={"300px"}
                >
                  화장품법에 따라 기재해야 하는 모든 성분
                </Text>
                <Text p={"20px"} bgColor={"rgba(204,204,204,0.3)"} w={"100%"}>
                  정제수, 글리세린, 스쿠알란, 카프릴릭/카프릭트라이글리세라이드,
                  하이드로제네이티드폴리(C6-14올레핀), 다이글리세린,
                  하이드로제네이티드폴리데센, 나이아신아마이드,
                  메틸프로판다이올, 펜틸렌글라이콜,
                  암모늄아크릴로일다이메틸타우레이트/브이피코폴리머,
                  1,2-헥산다이올, 판테놀, 세테아릴올리베이트,
                  하이드록시아세토페논,
                  아크릴레이트/C10-30알킬아크릴레이트크로스폴리머,
                  아미노메틸프로판다이올, 솔비탄올리베이트,
                  하이드록시에틸아크릴레이트/소듐아크릴로일다이메틸타우레이트코폴리머,
                  해바라기씨오일, 피토스테롤, 마데카소사이드,
                  하이드로제네이티드폴리아이소부텐, 서양배추출물,
                  아라키딜알코올, 연필향나무오일, 알란토인, 에틸헥실글리세린,
                  하이드로제네이티드레시틴, 아데노신, 다마스크장미꽃수,
                  스테아릭애씨드, 베헤닐알코올, 멜론추출물, 오리스뿌리추출물,
                  아라키딜글루코사이드, 호호바씨오일, 서양송악잎/줄기추출물,
                  소듐파이테이트, 부틸렌글라이콜, 광곽향오일,
                  솔비탄아이소스테아레이트, 하이알루로닉애씨드, 세테아릴알코올,
                  세라마이드엔피, 불가리스쑥오일, 로즈마리잎오일,
                  포타슘세틸포스페이트, 카프릴릴글라이콜, 병풀추출물,
                  베타-글루칸, 글리세릴스테아레이트, 돌콩추출물, 토코페롤,
                  팔미틱애씨드, 카프릴릴/카프릴글루코사이드, 병풀잎추출물
                </Text>
              </Flex>
              <Flex textAlign={"left"} borderBottom={"1px solid #cccccc"}>
                <Text
                  p={"20px"}
                  fontWeight={"700"}
                  bgColor={"rgba(204,204,204,0.8)"}
                  w={"300px"}
                >
                  사용할 때 주의사항
                </Text>
                <Text p={"20px"} bgColor={"rgba(204,204,204,0.3)"} w={"100%"}>
                  타임 리페어 인텐시브 크림
                </Text>
              </Flex>
              <Flex textAlign={"left"} borderBottom={"1px solid #cccccc"}>
                <Text
                  p={"20px"}
                  fontWeight={"700"}
                  bgColor={"rgba(204,204,204,0.8)"}
                  w={"300px"}
                >
                  제조국
                </Text>
                <Box p={"20px"} bgColor={"rgba(204,204,204,0.3)"} w={"100%"}>
                  <Text>
                    ※사용 전에 반드시 사용법 및 사용할 때의 주의사항을 숙지 하신
                    후 사용하십시오.
                  </Text>
                  <Text>
                    1) 화장품 사용 시 또는 사용 후 직사광선에 의하여 사용부위가
                    붉은 반점, 부어오름 또는 가려움증 등의 이상 증상이나
                    부작용이 있는 경우에는 전문의 등과 상담할 것
                  </Text>
                  <Text>2) 상처가 있는 부위 등에는 사용을 자제할 것</Text>
                  <Text>3) 보관 및 취급 시 주의사항</Text>
                  <Text>가) 어린이의 손이 닿지 않는 곳에 보관할 것</Text>
                  <Text>나) 직사광선을 피해서 보관할 것</Text>
                </Box>
              </Flex>
              <Flex textAlign={"left"} borderBottom={"1px solid #cccccc"}>
                <Text
                  p={"20px"}
                  fontWeight={"700"}
                  bgColor={"rgba(204,204,204,0.8)"}
                  w={"300px"}
                >
                  제조국
                </Text>
                <Text p={"20px"} bgColor={"rgba(204,204,204,0.3)"} w={"100%"}>
                  대한민국
                </Text>
              </Flex>
              <Flex textAlign={"left"} borderBottom={"1px solid #cccccc"}>
                <Text
                  p={"20px"}
                  fontWeight={"700"}
                  bgColor={"rgba(204,204,204,0.8)"}
                  w={"300px"}
                >
                  화장품제조업자
                </Text>
                <Text p={"20px"} bgColor={"rgba(204,204,204,0.3)"} w={"100%"}>
                  코스맥스(주)
                </Text>
              </Flex>
              <Flex textAlign={"left"} borderBottom={"1px solid #cccccc"}>
                <Text
                  p={"20px"}
                  fontWeight={"700"}
                  bgColor={"rgba(204,204,204,0.8)"}
                  w={"300px"}
                >
                  화장품책임판매업자
                </Text>
                <Text p={"20px"} bgColor={"rgba(204,204,204,0.3)"} w={"100%"}>
                  동국제약주식회사
                </Text>
              </Flex>
              <Flex textAlign={"left"} borderBottom={"1px solid #cccccc"}>
                <Text
                  p={"20px"}
                  fontWeight={"700"}
                  bgColor={"rgba(204,204,204,0.8)"}
                  w={"300px"}
                >
                  품질보증기준
                </Text>
                <Text p={"20px"} bgColor={"rgba(204,204,204,0.3)"} w={"100%"}>
                  본 상품에 이상이 있을 경우, 공정거래위원회 고시
                  ‘소비자분쟁해결기준’에 의해 보상해드립니다
                </Text>
              </Flex>
              <Flex textAlign={"left"}>
                <Text
                  p={"20px"}
                  fontWeight={"700"}
                  bgColor={"rgba(204,204,204,0.8)"}
                  w={"300px"}
                >
                  소비자 상담실
                </Text>
                <Text p={"20px"} bgColor={"rgba(204,204,204,0.3)"} w={"100%"}>
                  000-000-0000(수신자부담)
                </Text>
              </Flex>
            </Box>
          </Box>
        </Tabs.Content>
        <Tabs.Content value="review">
          <Box>
            <HStack
              p={"20px 0"}
              color={"black"}
              justifyContent={"space-between"}
              alignItems={"center"}
              borderBottom={"1px solid #cccccc"}
            >
              <Text fontSize={"24px"}>상품 리뷰</Text>
              <Text fontSize={"16px"}>
                <strong>{length}</strong> 개의 리뷰
              </Text>
            </HStack>
          </Box>
          <RatingStar rating={{ 5: 14, 4: 8, 3: 3, 2: 1, 1: 2 }} />
          <Flex
            p={"8px 0"}
            alignItems={"center"}
            justifyContent={"space-between"}
            fontSize={"12px"}
          >
            <NativeSelect.Root size={"xs"} w={"60px"} variant={"plain"}>
              <NativeSelect.Field padding={"2px 4px"} h={"24px"}>
                <option value="최신 순" defaultChecked>
                  최신 순
                </option>
                <option
                  value="별점순"
                  // onChange={() => setReview().sort((a, b) => a - b)}
                >
                  별점 순
                </option>
              </NativeSelect.Field>
              <NativeSelectIndicator />
            </NativeSelect.Root>
            <Flex gap={"10px"} color={"#4A4A4A"}>
              <Button
                p={0}
                h={"30px"}
                w={"80px"}
                bg={"transparent"}
                fontSize={"12px"}
                color={"#4A4A4A"}
                borderLeft={"1px solid rgba(204,204,204,0.8)"}
              >
                검색 필터
              </Button>
              <Checkbox.Root
                w={"full"}
                variant={"solid"}
                colorPalette={"red"}
                // checked={filterPrice.includes(20000)}
                // onCheckedChange={() => togglePrice(20000)}
              >
                <Checkbox.HiddenInput />
                <Checkbox.Control />
                <Checkbox.Label fontSize={"12px"}>포토 리뷰</Checkbox.Label>
              </Checkbox.Root>
              <Checkbox.Root
                w={"full"}
                variant={"solid"}
                colorPalette={"red"}
                // checked={filterPrice.includes(20000)}
                // onCheckedChange={() => togglePrice(20000)}
              >
                <Checkbox.HiddenInput />
                <Checkbox.Control />
                <Checkbox.Label fontSize={"12px"}>일반 리뷰</Checkbox.Label>
              </Checkbox.Root>
            </Flex>
          </Flex>
          <Flex gap={"20px"} p={"20px 0"} direction={"column"}>
            <Flex
              pb={"20px"}
              borderBottom={"1px solid rgba(204,204,204,0.8)"}
              w={"100%"}
              gap={"30px"}
            >
              <Box>
                <Avatar.Root size={"2xl"} mb={"10px"}>
                  <Avatar.Fallback name="따가운 볼" />
                  <Avatar.Image src={"/images/test/피카츄.jpeg"} alt="피카츄" />
                </Avatar.Root>
                <Text fontWeight={"500"} color={"black"} fontSize={"12px"}>
                  따가운 볼
                </Text>
              </Box>
              <Flex
                direction={"column"}
                textAlign={"left"}
                fontSize={"12px"}
                color={"#5C5C5C"}
                gap={"10px"}
              >
                <Text fontWeight={"500"}>2025.10.23</Text>
                <Text color={"#A8A8A8"}>타임 리페어 인테시브 크림</Text>
                <Box>
                  <Text>아이가 아주 만족해하며 잘 쓰고있어요.</Text>
                  <Text>피부에 밀착력이 좋고 커버가 잘된다고 해요♡</Text>
                </Box>
                <Image
                  src={"/images/test/image36.png"}
                  w={"100px"}
                  h={"100px"}
                  alt=""
                />
              </Flex>
            </Flex>
            <Flex w={"100%"} gap={"30px"}>
              <Box>
                <Avatar.Root size={"2xl"} mb={"10px"}>
                  <Avatar.Fallback name="불타는 스킨" />
                  <Avatar.Image src={"/images/test/파이리.jpeg"} alt="파이리" />
                </Avatar.Root>
                <Text fontWeight={"500"} color={"black"} fontSize={"12px"}>
                  불타는 스킨
                </Text>
              </Box>
              <Flex
                direction={"column"}
                textAlign={"left"}
                fontSize={"12px"}
                color={"#5C5C5C"}
                gap={"10px"}
              >
                <Text fontWeight={"500"}>2025.10.23</Text>
                <Text color={"#A8A8A8"}>타임 리페어 인테시브 크림</Text>
                <Box>
                  <Text>
                    악건성이라 그냥 기름 뜨는 쿠션 말고 보습감 있는 촉촉한 쿠션
                    좋아하는데 제가 원하던 느낌에 얇고 가볍게 올라가서 좋았어욤
                  </Text>
                </Box>
              </Flex>
            </Flex>
          </Flex>
        </Tabs.Content>
        <Tabs.Content value="QnA">
          <Box p={"20px 0"}>
            <HStack
              pb={"20px"}
              color={"black"}
              justifyContent={"space-between"}
              alignItems={"center"}
              borderBottom={"1px solid #cccccc"}
            >
              <Text fontSize={"24px"}>상품 문의</Text>
              <Flex gap={"16px"} alignItems={"center"}>
                <Text fontSize={"16px"}>
                  <strong>{reviews.length}</strong> 개의 리뷰
                </Text>
                <Button
                  bgColor={"white"}
                  border={"1px solid rgba(0,0,0,0.2)"}
                  color={"black"}
                  borderRadius={"4px"}
                  w={"80px"}
                  h={"40px"}
                  fontSize={"16px"}
                  onClick={() => {
                    handleQna();
                  }}
                >
                  상품문의
                </Button>
              </Flex>
            </HStack>
            <Accordion.Root
              // variant={"outline"}
              mt={"10px"}
              collapsible
              w={"100%"}
              p={0}
            >
              {reviews.map((item, index) => (
                <Accordion.Item
                  key={index}
                  value={item.value}
                  p={"16px 32px"}
                  borderBottom={"1px solid #cccccc"}
                >
                  <Accordion.ItemTrigger
                    justifyContent={"space-between"}
                    w={"100%"}
                    borderRadius={0}
                  >
                    <Flex direction={"column"} gap={"8px"}>
                      <Text color={"#5c5c5c"} fontSize={"16px"}>
                        {item.title}
                      </Text>
                      <Text color={"black"} fontSize={"20px"}>
                        {item.subtitle}
                      </Text>
                      <Flex
                        gap={"10px"}
                        color={"#5c5c5c"}
                        fontSize={"12px"}
                        fontWeight={"500"}
                      >
                        <Text w={"80px"}>{item.status}</Text>
                        <Text color={"black"}>{item.userid}</Text>
                        <Text>{item.date}</Text>
                      </Flex>
                    </Flex>
                    <Accordion.ItemIndicator color={"black"} />
                  </Accordion.ItemTrigger>
                  <Accordion.ItemContent
                    bgColor={"rgba(204,204,204,0.5)"}
                    borderRadius={0}
                    color={"#A9A9A9"}
                    p={0}
                  >
                    <Accordion.ItemBody
                      textAlign={"left"}
                      p={"16px 32px"}
                      borderBottom={"1px solid #cccccc"}
                      borderTop={"1px solid #cccccc"}
                    >
                      <Text mb={"8px"}>{item.product}</Text>
                      <Text color={"#5C5C5C"} whiteSpace="pre-line">
                        {item.content}
                      </Text>
                    </Accordion.ItemBody>
                    {(item.comment || item.commenttitle) && (
                      <Accordion.ItemBody
                        textAlign={"left"}
                        p={"16px 32px"}
                        borderBottom={"1px solid #cccccc"}
                      >
                        <Text mb={"8px"}>{item.commenttitle}</Text>
                        <Text
                          mb={"8px"}
                          color={"#5C5C5C"}
                          whiteSpace="pre-line"
                        >
                          {item.comment}
                        </Text>
                        <Text>{item.commentdate}</Text>
                      </Accordion.ItemBody>
                    )}
                  </Accordion.ItemContent>
                </Accordion.Item>
              ))}
            </Accordion.Root>
          </Box>
          <Dialog.Root placement={"center"} open={open} onClose={onClose}>
            <Dialog.Backdrop />
            <Dialog.Positioner>
              <Dialog.Content bg={"white"} color={"black"} w={"400px"}>
                <Dialog.Header
                  display={"flex"}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                  p={"16px"}
                >
                  <Dialog.Title m={0} fontWeight={"500"}>
                    상품 Q & A
                  </Dialog.Title>
                  <Dialog.CloseTrigger>
                    <CloseButton
                      size={"sm"}
                      color={"black"}
                      bgColor={"white"}
                      onClick={() => {
                        handleSaveQna();
                      }}
                      position={"static"}
                    />
                  </Dialog.CloseTrigger>
                </Dialog.Header>
                <Dialog.Body>
                  <Flex direction={"column"} gap={"16px"}>
                    <Box>
                      <Text
                        fontWeight={"500"}
                        fontSize={"16px"}
                        pb={"8px"}
                        textAlign={"left"}
                      >
                        문의 유형
                      </Text>
                      <RadioGroup.Root
                        variant={"outline"}
                        defaultValue={"productAsk"}
                        colorPalette={"red"}
                        size={"sm"}
                      >
                        <Flex gap={4}>
                          <RadioGroup.Item value="productAsk">
                            <RadioGroup.ItemHiddenInput />
                            <RadioGroup.ItemIndicator />
                            <RadioGroup.ItemText fontSize={"12px"}>
                              상품문의
                            </RadioGroup.ItemText>
                          </RadioGroup.Item>
                          <RadioGroup.Item value="orderAsk">
                            <RadioGroup.ItemHiddenInput />
                            <RadioGroup.ItemIndicator />
                            <RadioGroup.ItemText fontSize={"12px"}>
                              주문 상품문의
                            </RadioGroup.ItemText>
                          </RadioGroup.Item>
                        </Flex>
                      </RadioGroup.Root>
                    </Box>
                    <Box>
                      <Text
                        fontWeight={"500"}
                        fontSize={"16px"}
                        pb={"8px"}
                        textAlign={"left"}
                      >
                        타임 리페어 인텐시브 크림
                      </Text>
                      <Textarea
                        placeholder="Q&A 게시판에서는 고객님의 정보 확인이 어려우므로 배송 문의 등은 1:1 문의를 이용 부탁드립니다."
                        variant={"outline"}
                        h={"250px"}
                        size={"xs"}
                      />
                      <Text
                        textAlign={"left"}
                        color={"#898989"}
                        fontSize={"12px"}
                      >
                        0자 / 250자
                      </Text>
                    </Box>
                  </Flex>
                </Dialog.Body>
                <Dialog.Footer>
                  <Flex w={"100%"} gap={"8px"}>
                    <IconButton
                      bgColor={"white"}
                      border={"1px solid #cccccc"}
                      color={"black"}
                      flex={1}
                      h={"40px"}
                      onClick={() => handleCancelQna()}
                    >
                      취소
                    </IconButton>
                    <Button
                      bgColor={"#FA6D6D"}
                      color={"white"}
                      w={"50%"}
                      h={"40px"}
                      onClick={() => handleSaveQna()}
                    >
                      등록
                    </Button>
                  </Flex>
                </Dialog.Footer>
              </Dialog.Content>
            </Dialog.Positioner>
          </Dialog.Root>
        </Tabs.Content>
      </Tabs.Root>
    </Container>
  );
}
