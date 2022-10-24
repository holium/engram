import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/index";
import store from "./store"

import "./assets/app.css";
import "./assets/styles.css";

import "@/components/document/styles/styles.css";
import "@/components/document/styles/prosemirror.css";
import "@/components/document/styles/document.css";

const app = createApp(App);

app.use(store);

app.use(router);

app.mount("#app");
