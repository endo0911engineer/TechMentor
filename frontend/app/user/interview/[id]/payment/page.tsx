"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createPaymentIntent } from "@/lib/payment";

export default function PaymentPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [amount, setAmount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    async function loadPayment() {
      try {
        const res = await createPaymentIntent(params.id); // 支払い情報を取得（金額）
        setAmount(res.amount);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadPayment();
  }, [params.id]);

  const handlePayment = async () => {
    setProcessing(true);
    try {
      const res = await createPaymentIntent(params.id); // Stripe Checkout セッション作成
      window.location.href = res.checkout_url; // Stripe Checkout に遷移
    } catch (err) {
      console.error(err);
      alert("支払いに失敗しました");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">支払い画面</h1>
      <p className="mt-4">支払金額: {amount}円</p>
      <button
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded"
        onClick={handlePayment}
        disabled={processing}
      >
        {processing ? "処理中..." : "支払う"}
      </button>
    </div>
  );
}
