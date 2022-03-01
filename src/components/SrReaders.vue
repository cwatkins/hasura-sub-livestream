<template>
  <section class="">
    <h1 class="">Reader</h1>
    <div class="">
      <span v-if="reader"
        ><strong>{{ reader.label }}</strong> ({{ reader.id }})
      </span>
      <button @click="retrieveReader(reader.id)" class="">Check Reader</button>
    </div>
    <div v-if="readerAction" class="">
      <p v-if="paymentIntentId">payment_intent_id: {{ paymentIntentId }}</p>
      <p>action: {{ readerAction.type }}</p>
      <p>status: {{ readerAction.status }}</p>
    </div>
  </section>
  <section>
    <h2>Submit Payment</h2>
    <div>
      <input id="" type="text" v-model="amount" />
    </div>
    <button @click="attemptPayment">Submit</button>
    <button @click="capturePayment">Capture</button>
    <button @click="cancelReaderHandler">Cancel</button>

    <div v-if="paymentIntentId" class="payment-intent-response">
      <span>PaymentIntent ID: {{ paymentIntentId }}</span>
      <div v-if="captureResult">
        <p v-if="captureResult.message">
          {{ captureResult.message }}
        </p>
        <code v-else>
          {{ JSON.stringify(captureResult, null, 2) }}
        </code>
      </div>
    </div>
  </section>
</template>
<script setup>
import { useReader } from "../use/useReader.js";
import { usePayments } from "../use/usePayments.js";

const {
  reader,
  readerAction,
  retrieveReader,
  cancelReaderAction,
  processPayment,
} = useReader();
const {
  paymentIntentId,
  amount,
  captureResult,
  createPayment,
  capturePayment,
} = usePayments();

const attemptPayment = async () => {
  await createPayment();
  await processPayment(paymentIntentId.value);
};

const cancelReaderHandler = async () => {
  await cancelReaderAction();
  captureResult.value = null;
};
</script>

<style>
code,
.payment-intent-response {
  width: 50%;
  margin: auto;
  text-align: left;
}
pre {
  font-family: "SF Mono", "IBM Plex Mono", "Menlo", monospace;
  font-size: 12px;
}
</style>
