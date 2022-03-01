import { createApp, provide, h } from "vue";
import { DefaultApolloClient } from "@vue/apollo-composable";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";
import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  split,
} from "@apollo/client/core";
import App from "./App.vue";
// import "./index.css";

const cache = new InMemoryCache();

const httpLink = new HttpLink({
  // You should use an absolute URL here
  uri: "https://hasura-stripe-demo.hasura.app/v1/graphql",
});

// Create the subscription websocket link
const wsLink = new WebSocketLink({
  uri: "wss://hasura-stripe-demo.hasura.app/v1/graphql",
  options: {
    reconnect: true,
  },
});

const link = split(
  // split based on operation type
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === "OperationDefinition" && operation === "subscription";
  },
  wsLink,
  httpLink
);

const apolloClient = new ApolloClient({
  link,
  cache: new InMemoryCache(),
  connectToDevTools: true,
});

const app = createApp({
  setup() {
    provide(DefaultApolloClient, apolloClient);
  },

  render: () => h(App),
});

app.mount("#app");
