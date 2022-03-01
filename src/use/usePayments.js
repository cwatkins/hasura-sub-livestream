import { ref } from "vue";

// by convention, composable function names start with "use"
export function usePayments() {
  // state encapsulated and managed by the composable
  const amount = ref(2000);
  const paymentIntentId = ref(null);
  const captureResult = ref(null);

  async function createPayment() {
    const response = await fetch("/api/create-payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: amount.value,
        currency: "usd",
        capture_method: "manual",
        payment_method_types: ["card_present"],
      }),
    }).then((r) => r.json());
    paymentIntentId.value = response.id;
  }

  async function capturePayment() {
    const response = await fetch("/api/capture-payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        paymentIntentId: paymentIntentId.value,
      }),
    }).then((r) => r.json());
    captureResult.value = response;
    return response;
  }

  return {
    amount,
    paymentIntentId,
    captureResult,
    createPayment,
    capturePayment,
  };
}
