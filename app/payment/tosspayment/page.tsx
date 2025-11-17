"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { loadPaymentWidget } from "@tosspayments/payment-widget-sdk";
import type { PaymentWidgetInstance } from "@tosspayments/payment-widget-sdk";
import { nanoid } from "nanoid";
import { useRouter } from "next/navigation";

export default function PaymentPage() {
  const router = useRouter();

  const paymentWidgetRef = useRef<PaymentWidgetInstance | null>(null);
  const paymentMethodsWidgetRef = useRef<any>(null); // 서브 위젯은 any로 처리 (이전 대화 기반)
  const agreementWidgetRef = useRef<any>(null); // 서브 위젯은 any로 처리

  // 📌 1. 위젯 준비 상태 관리 (state 추가)
  const [isPaymentWidgetLoaded, setIsPaymentWidgetLoaded] = useState(false);

  const clientKey = "test_gck_FWZQmPGXq0w4Lg9R4g75wGZ1rxzP";
  const customerKey = nanoid();
  const amount = 50000;

  const orderId = nanoid();
  const orderName = "Minié 주문 상품";

  useEffect(() => {
    async function initializePaymentWidget() {
      try {
        const paymentWidget = await loadPaymentWidget(clientKey, customerKey);
        paymentWidgetRef.current = paymentWidget;

        const paymentMethodsWidget = paymentWidget.renderPaymentMethods(
          "#payment-methods-root",
          { value: amount },
          { variantKey: "DEFAULT" }
        );
        paymentMethodsWidgetRef.current = paymentMethodsWidget; // 필요하다면

        const agreementWidget = paymentWidget.renderAgreement(
          "#agreement-root",
          { variantKey: "DEFAULT" }
        );
        agreementWidgetRef.current = agreementWidget; // 필요하다면

        // 📌 2. 모든 렌더링 완료 후 상태 변경
        setIsPaymentWidgetLoaded(true);
      } catch (error) {
        console.error("결제위젯 초기화 오류:", error);
        // 초기화 실패 시에도 버튼을 활성화하지 않음
      }
    }

    initializePaymentWidget();
  }, [clientKey, customerKey, amount]);

  const handlePayment = useCallback(async () => {
    try {
      const paymentWidget = paymentWidgetRef.current;

      if (!paymentWidget) {
        // 이미 버튼이 비활성화 되어있겠지만, 혹시 모를 상황 대비
        console.error("결제위젯이 아직 로드되지 않았습니다.");
        alert("결제 시스템을 로드 중입니다. 잠시 후 다시 시도해주세요.");
        return;
      }

      await paymentWidget.requestPayment({
        orderId: orderId,
        orderName: orderName,
        successUrl: `${window.location.origin}/api/payments/confirm`,
        failUrl: `${window.location.origin}/fail`,
      });
    } catch (error) {
      console.error("결제 요청 오류:", error);
      alert("결제 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    }
  }, [orderId, orderName]);

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h1>주문/결제</h1>

      <div
        id="payment-methods-root"
        style={{
          border: "1px solid #eee",
          padding: "15px",
          borderRadius: "5px",
          marginBottom: "20px",
        }}
      ></div>
      <div
        id="agreement-root"
        style={{
          border: "1px solid #eee",
          padding: "15px",
          borderRadius: "5px",
          marginBottom: "20px",
        }}
      ></div>

      <button
        onClick={handlePayment}
        // 📌 3. 위젯 준비 상태에 따라 버튼 활성화/비활성화
        disabled={!isPaymentWidgetLoaded}
        style={{
          width: "100%",
          padding: "15px",
          backgroundColor: "#0070f3",
          color: "white",
          border: "none",
          borderRadius: "5px",
          fontSize: "18px",
          cursor: isPaymentWidgetLoaded ? "pointer" : "not-allowed", // 커서 스타일도 변경
          opacity: isPaymentWidgetLoaded ? 1 : 0.6, // 비활성화 시 흐리게
        }}
      >
        {isPaymentWidgetLoaded
          ? `${amount.toLocaleString()}원 결제하기`
          : "결제 시스템 로드 중..."}
      </button>
    </div>
  );
}
