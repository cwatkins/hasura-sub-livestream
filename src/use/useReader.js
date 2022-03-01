import { computed, ref, onMounted } from "vue";

export function useReader() {
  const reader = ref();

  async function listReaders() {
    const response = await fetch("/api/get-readers").then((r) => r.json());
    return response;
  }

  async function retrieveReader(readerId) {
    const response = await fetch(
      "/api/get-reader?" + new URLSearchParams({ readerId })
    ).then((r) => r.json());
    console.log("checking reader...");
    reader.value = response;
    return response;
  }

  async function processPayment(paymentIntentId) {
    const response = await fetch("/api/process-terminal-payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        paymentIntentId,
        readerId: reader.value.id,
      }),
    }).then((r) => r.json());
    reader.value = response;
    return response;
  }

  async function cancelReaderAction() {
    console.log("initial reader value: ", reader.value);
    const response = await fetch("/api/cancel-reader-action", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        readerId: reader.value.id,
      }),
    }).then((r) => r.json());
    console.log("canceling reader action...");
    console.log(response);
    reader.value = response;
    return response;
  }

  const readerAction = computed(() => {
    if (reader.value) {
      return reader.value.action;
    }
  });

  onMounted(async () => {
    const readersList = await listReaders();
    const { id: firstReaderId } = readersList[0];
    reader.value = await retrieveReader(firstReaderId);
  });

  return {
    reader,
    readerAction,
    retrieveReader,
    cancelReaderAction,
    processPayment,
  };
}
