"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { loadPaymentWidget } from "@tosspayments/payment-widget-sdk";
import type { PaymentWidgetInstance } from "@tosspayments/payment-widget-sdk";
import { nanoid } from "nanoid";
import { useCart } from "@/contexts/ShoppingCartContext";
import { Box, Button, Container } from "@chakra-ui/react";
import { numberFormatter } from "@/utils/formatter/numberFomatter";
import { useRouter } from "next/navigation";
import { addNewOrder } from "@/lib/minie/orderAPI";

export default function PaymentPage() {
  const router = useRouter();
  const { cartItems, totalPrice, totalDiscountAmount } = useCart();
  const checkedCartItems = cartItems.filter((item) => item.checked);

  // 주문 상품이 없는 경우 (예외 처리: 빈 장바구니 결제 방지)
  useEffect(() => {
    if (checkedCartItems.length === 0) {
      alert("선택된 상품이 없습니다. 장바구니로 이동합니다.");
      router.replace("/cart");
    }
  }, [checkedCartItems.length, router]);

  if (checkedCartItems.length === 0) {
    return null; // 빈 장바구니일 때 아무것도 렌더링하지 않음
  }

  const paymentWidgetRef = useRef<PaymentWidgetInstance | null>(null);
  const paymentMethodsWidgetRef = useRef<any>(null);
  const agreementWidgetRef = useRef<any>(null);

  const [isPaymentWidgetLoaded, setIsPaymentWidgetLoaded] = useState(false);
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);

  const clientKey = process.env.NEXT_PUBLIC_TOSS_TEST_KEY as string;
  const customerKey = "1"; // user_id로 추후에 대체

  const orderId = nanoid(); //주문번호
  const orderName = `Minié ${checkedCartItems[0].title}${
    checkedCartItems.length === 1
      ? ""
      : ` 외 ${checkedCartItems.length - 1}개의 상품`
  }`;

  useEffect(() => {
    async function initializePaymentWidget() {
      try {
        const paymentWidget = await loadPaymentWidget(clientKey, customerKey);
        paymentWidgetRef.current = paymentWidget;

        const paymentMethodsWidget = paymentWidget.renderPaymentMethods(
          "#payment-methods-root",
          { value: totalPrice },
          { variantKey: "DEFAULT" }
        );
        paymentMethodsWidgetRef.current = paymentMethodsWidget;

        const agreementWidget = paymentWidget.renderAgreement(
          "#agreement-root",
          { variantKey: "DEFAULT" }
        );
        agreementWidgetRef.current = agreementWidget;

        setIsPaymentWidgetLoaded(true);
      } catch (error) {
        console.error("결제위젯 초기화 오류:", error);
      }
    }

    if (clientKey) {
      initializePaymentWidget();
    } else {
      console.error(
        "클라이언트 키(NEXT_PUBLIC_TOSS_TEST_KEY)가 설정되지 않았습니다."
      );
    }
  }, [clientKey, customerKey, totalPrice]);

  const handlePayment = useCallback(async () => {
    if (!isPaymentWidgetLoaded || isProcessingOrder) {
      alert("결제 시스템 로드 중이거나 주문 생성 중입니다.");
      return;
    }

    setIsProcessingOrder(true);

    try {
      const isOrderAdded = await addNewOrder(
        orderId,
        orderName,
        "토스페이",
        totalPrice,
        totalDiscountAmount,
        checkedCartItems
      );

      if (!isOrderAdded) {
        throw new Error("주문 정보 저장에 실패했습니다.");
      }

      const paymentWidget = paymentWidgetRef.current;
      if (!paymentWidget) {
        throw new Error("결제위젯이 초기화되지 않았습니다.");
      }

      await paymentWidget.requestPayment({
        orderId: orderId,
        orderName: orderName,
        successUrl: `${window.location.origin}/api/payment/tosspayment`,
        failUrl: `${window.location.origin}/payment/fail`,
      });
    } catch (error: any) {
      console.error("결제 처리 중 오류 발생:", error.message);
      alert(
        `결제 중 오류가 발생했습니다: ${error.message}. 잠시 후 다시 시도해주세요.`
      );
      //  이 단계에서 주문 정보 저장 실패 또는 토스페이먼츠 요청 실패 시 결제 전 데이터 삭제
    } finally {
      setIsProcessingOrder(false);
    }
  }, [
    orderId,
    orderName,
    totalPrice,
    totalDiscountAmount,
    checkedCartItems,
    isPaymentWidgetLoaded,
    isProcessingOrder,
  ]); // 의존성 배열 업데이트

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
    >
      <Box
        id="payment-methods-root"
        style={{
          border: "1px solid #eee",
          padding: "15px",
          borderRadius: "5px",
          marginBottom: "20px",
        }}
      ></Box>
      <Box
        id="agreement-root"
        style={{
          border: "1px solid #eee",
          padding: "15px",
          borderRadius: "5px",
          marginBottom: "20px",
        }}
      ></Box>

      <Button
        onClick={handlePayment}
        disabled={!isPaymentWidgetLoaded || isProcessingOrder}
        style={{
          width: "100%",
          padding: "15px",
          backgroundColor: "#0070f3",
          color: "white",
          border: "none",
          borderRadius: "5px",
          fontSize: "18px",
          cursor:
            isPaymentWidgetLoaded && !isProcessingOrder
              ? "pointer"
              : "not-allowed",
          opacity: isPaymentWidgetLoaded && !isProcessingOrder ? 1 : 0.6,
        }}
      >
        {isProcessingOrder // ✅ 주문 처리 상태에 따른 버튼 텍스트 변경
          ? "주문 생성 중..."
          : isPaymentWidgetLoaded
          ? `${numberFormatter.format(totalPrice)}원 결제하기`
          : "결제 시스템 로드 중..."}
      </Button>
    </Container>
  );
}
