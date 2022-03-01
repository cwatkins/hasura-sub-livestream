<script setup>
import gql from "graphql-tag";
import { ref } from "vue";
import { useSubscription } from "@vue/apollo-composable";

import SrReaders from "./components/SrReaders.vue";

const messages = ref([]);

const READER_SUBSCRIPTION = gql`
  subscription mySub {
    terminal_readers {
      id
      device_type
    }
  }
`;
const { result, loading, error, onResult } =
  useSubscription(READER_SUBSCRIPTION);

onResult((result) => {
  const terminalReaders = result.data.terminal_readers;
});
</script>

<template>
  <main>
    <sr-readers></sr-readers>
  </main>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  width: 75%;
  word-wrap: break-word;
}
</style>
