"use client";

import PaymentCartItem from "@/components/PaymentCartItem";
import { useCart } from "@/contexts/ShoppingCartContext";
import {
  Alert,
  Box,
  Button,
  Container,
  HStack,
  RadioGroup,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { MdOutlineArrowForwardIos } from "react-icons/md";
import { numberFormatter } from "@/utils/formatter/numberFomatter";
import { useRouter } from "next/navigation";

const kakaoPayInfoText = `<minié 블랙프라이데이 x 카카오페이머니>
25.11.01(토) ~ 25.01.07(수)
카카오페이머니로 7만원 / 9만원 이상 결제시 3천원 / 5천원 즉시할인 (기간 내 1회)
기간 내 ID당 1회 적용, 금액대별 1회 적용 아님
※ 자세한 내용은 이벤트 탭 결제혜택에서 확인 가능합니다
<카카오페이 유의사항>
무이자할부는 카카오페이 모바일 결제창에서 선택하실 수 있습니다.
휴대폰과 카드명의자가 동일해야 결제 가능합니다.
카카오페이 결제 시, 제휴카드 할인/적립이 적용되지 않습니다.
카드 영수증 및 현금영수증 확인은 카카오페이 홈페이지에서 확인 가능합니다.(카카오페이 홈 > 설정 > 결제내역)
카카오페이 고객센터 : 1644-7405`;
const tossPayInfoText = `<minié 블랙프라이데이 x 토스페이>
25.11.05(수) ~ 11.26(수)
토스페이포인트로 7만원 / 9만원 이상 결제시 3천원 / 5천원 즉시할인(기간 내 1회)
기간 내 ID당 1회 적용, 금액대별 1회 적용 아님
※ 자세한 내용은 이벤트 탭 결제혜택에서 확인 가능합니다
<토스페이 유의사항>
무이자할부는 토스페이 모바일 결제창에서 선택하실 수 있습니다.
휴대폰과 카드명의자가 동일해야 결제 가능합니다.
토스페이 결제 시, 제휴카드 할인/적립이 적용되지 않습니다.
카드 영수증 및 현금영수증 확인은/토스페이 홈페이지에서 확인 가능합니다.(토스페이 홈 > 설정 > 결제내역)
토스페이 고객센터 : 1644-7404`;

export default function PaymentPage() {
  const router = useRouter();
  const [paymentType, setPaymentType] = useState<string | null>(null);
  const { cartItems, totalPrice } = useCart();
  const checkedCartItems = useMemo(
    () => cartItems.filter((item) => item.checked),
    [cartItems]
  );
  const totalCostPrice = useMemo(
    () => checkedCartItems.reduce((sum, item) => sum + item.price, 0),
    [checkedCartItems]
  );
  const totalDiscountAmount = useMemo(
    () => checkedCartItems.reduce((sum, item) => sum + item.discountAmount, 0),
    [checkedCartItems]
  );
  const isEmpty = useMemo(
    () => checkedCartItems.length === 0,
    [checkedCartItems]
  );

  const handleEmpty = () => {
    return (
      <Alert.Root
        status="info"
        bg={"#F7F7F7"}
        color={"black"}
        _icon={{ color: "black" }}
        title="장바구니에서 선택된 상품이 없습니다"
        variant={"outline"}
      >
        <Alert.Indicator />
        <Alert.Title>장바구니에서 선택된 상품이 없습니다</Alert.Title>
      </Alert.Root>
    );
  };

  const handlePay = () => {
    switch (paymentType) {
      case "toss_pay":
        router.push("/payment/tosspayment");
        break;
      case "kakao_pay":
        break;
      default:
        // toaster.create({
        //   description: "존재하지 않는 결제 수단입니다\n결제수단을 확인해주세요",
        //   type: "error",
        //   closable: true,ㄴ
        // });
        break;
    }
  };

  return (
    <Container
      bg={"white"}
      display={"flex"}
      flexDirection={"column"}
      maxW="7xl"
      py={"24px"}
      gap={"10px"}
      color={"black"}
      px={{ base: 4, sm: 6, lg: 8 }}
      border={"1px soild #"}
    >
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        paddingBottom={"34px"}
      >
        <Box fontWeight={"semibold"} fontSize={"32px"}>
          주문/결제
        </Box>
        <Box display={"flex"} gap={"8px"} alignItems={"center"}>
          <Box color={"#B2B2B2"} fontSize={"16px"}>
            01 장바구니
          </Box>
          <MdOutlineArrowForwardIos color={"#B2B2B2"} size={"15px"} />
          <Box fontSize={"16px"}>02 주문/결제</Box>
          <MdOutlineArrowForwardIos color={"#666666"} size={"15px"} />
          <Box color={"#B2B2B2"} fontSize={"16px"}>
            03 주문완료
          </Box>
        </Box>
      </Box>
      <Stack gap={"10px"} marginBottom={"14px"}>
        <Box fontWeight={"medium"}>Minié 배송 상품 리스트</Box>
        <Box
          display={"flex"}
          bg={"#F7F7F7"}
          p={"10px"}
          fontWeight={"semibold"}
          fontSize={"16px"}
          textAlign={"center"}
          borderY={"1px solid #C6C6C6"}
        >
          <Box flex={2}>상품설명</Box>
          <HStack flex={1}>
            <Box flex={1}>판매가</Box>
            <Box flex={1}>수량</Box>
            <Box flex={1}>가격</Box>
          </HStack>
        </Box>
        {checkedCartItems.map((item, idx) => {
          return (
            <PaymentCartItem
              key={item.id}
              item={item}
              isLast={idx === checkedCartItems.length - 1}
            />
          );
        })}
      </Stack>
      <Box>
        <HStack
          bg={"#F7F7F7"}
          py={"10px"}
          fontWeight={"medium"}
          fontSize={"14px"}
          textAlign={"center"}
          borderTop={"2px solid #C6C6C6"}
          borderBottom={"1px solid #C6C6C6"}
        >
          <Box flex={1}>총 판매 금액</Box>
          <Text fontWeight={"normal"} color="#C4C4C4">
            |
          </Text>
          <Box flex={1}>총 할인 금액</Box>
          <Text fontWeight={"normal"} color="#C4C4C4">
            |
          </Text>
          <Box flex={1}>총 결제 금액</Box>
        </HStack>
        <HStack
          py={"10px"}
          fontWeight={"medium"}
          fontSize={"14px"}
          textAlign={"center"}
          borderBottom={"1px solid #C6C6C6"}
          marginBottom={"36px"}
        >
          <Box flex={1} color={"#5C5C5C"}>
            {numberFormatter.format(totalCostPrice)}
          </Box>
          <Text fontWeight={"normal"} color="#C4C4C4">
            |
          </Text>
          <Box flex={1} color={"#5C5C5C"}>
            {numberFormatter.format(totalDiscountAmount)}
          </Box>
          <Text fontWeight={"normal"} color="#C4C4C4">
            |
          </Text>
          <Box flex={1} color={"#FA6D6D"} fontWeight={"semibold"}>
            {numberFormatter.format(totalPrice)}
          </Box>
        </HStack>
      </Box>
      {isEmpty ? (
        handleEmpty()
      ) : (
        <Box>
          <Box fontSize={"20px"} fontWeight={"medium"} marginBottom={"10px"}>
            결제
          </Box>
          <HStack
            py={"10px"}
            fontWeight={"medium"}
            fontSize={"14px"}
            textAlign={"center"}
            borderTop={"2px solid #CCCCCC"}
            borderBottom={"1px solid #CCCCCC"}
          >
            <Box flex={1}>결제수단</Box>
            <Text fontWeight={"normal"} color="#C4C4C4">
              |
            </Text>
            <Box flex={3} justifyContent={"start"} paddingStart={"50px"}>
              <RadioGroup.Root
                display={"flex"}
                gap={"24px"}
                size={"sm"}
                colorPalette={"red"}
                _icon={{}}
                variant={"outline"}
                value={paymentType}
                onValueChange={(e) => setPaymentType(e.value)}
              >
                <RadioGroup.Item value="toss_pay">
                  <RadioGroup.ItemHiddenInput />
                  <RadioGroup.ItemIndicator />
                  <RadioGroup.ItemText color={"black"}>
                    토스페이
                  </RadioGroup.ItemText>
                </RadioGroup.Item>
                <RadioGroup.Item value="kakao_pay">
                  <RadioGroup.ItemHiddenInput />
                  <RadioGroup.ItemIndicator />
                  <RadioGroup.ItemText color={"black"}>
                    카카오페이
                  </RadioGroup.ItemText>
                </RadioGroup.Item>
              </RadioGroup.Root>
            </Box>
          </HStack>
          <HStack
            py={"10px"}
            fontWeight={"medium"}
            fontSize={"14px"}
            textAlign={"center"}
            borderBottom={"1px solid #CCCCCC"}
          >
            <Box flex={1}>결제 주의사항</Box>
            <Text fontWeight={"normal"} color="#C4C4C4">
              |
            </Text>
            <Box
              flex={3}
              justifyContent={"start"}
              paddingStart={"50px"}
              color={"#666666"}
              whiteSpace={"pre-wrap"}
              textAlign={"start"}
            >
              {paymentType &&
                (paymentType === "toss_pay"
                  ? tossPayInfoText
                  : kakaoPayInfoText)}
            </Box>
          </HStack>
          <HStack paddingTop={"24px"} justifyContent={"end"}>
            <Button
              flex={1}
              maxW={"300px"}
              minW={"50px"}
              color={"black"}
              bg={"white"}
              fontWeight={"medium"}
              border={"1px solid #CCCCCC"}
              onClick={() => router.back()}
            >
              이전 페이지로
            </Button>
            <Button
              flex={1}
              maxW={"300px"}
              minW={"50px"}
              color={"white"}
              bg={"#FA6D6D"}
              fontWeight={"medium"}
              disabled={!paymentType}
              onClick={handlePay}
            >
              결제하기
            </Button>
          </HStack>
        </Box>
      )}
    </Container>
  );
}
