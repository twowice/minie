"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { loadPaymentWidget } from "@tosspayments/payment-widget-sdk";
import type { PaymentWidgetInstance } from "@tosspayments/payment-widget-sdk";
import { nanoid } from "nanoid";
import { useRouter, useSearchParams } from "next/navigation";

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 🚨🚨🚨 이 useEffect 블록을 제거하거나 주석 처리합니다! 🚨🚨🚨
  // useEffect(() => {
  //   if (!searchParams.get("someRequiredParam")) {
  //     router.push("/error-page"); // 이 코드가 현재 샘플 동작을 방해하고 있습니다.
  //   }
  // }, [router, searchParams]); // searchParams를 의존성에 추가하는 게 올바릅니다!

  const paymentWidgetRef = useRef<PaymentWidgetInstance | null>(null);
  const paymentMethodsWidgetRef = useRef<any>(null);
  const agreementWidgetRef = useRef<any>(null);

  const [isPaymentWidgetLoaded, setIsPaymentWidgetLoaded] = useState(false);

  const clientKey = "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm";
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

    initializePaymentWidget();
  }, [clientKey, customerKey, amount]);

  const handlePayment = useCallback(async () => {
    try {
      const paymentWidget = paymentWidgetRef.current;

      if (!paymentWidget) {
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
        disabled={!isPaymentWidgetLoaded}
        style={{
          width: "100%",
          padding: "15px",
          backgroundColor: "#0070f3",
          color: "white",
          border: "none",
          borderRadius: "5px",
          fontSize: "18px",
          cursor: isPaymentWidgetLoaded ? "pointer" : "not-allowed",
          opacity: isPaymentWidgetLoaded ? 1 : 0.6,
        }}
      >
        {isPaymentWidgetLoaded
          ? `${amount.toLocaleString()}원 결제하기`
          : "결제 시스템 로드 중..."}
      </button>
    </div>
  );
}
