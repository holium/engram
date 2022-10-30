import { createApp } from "vue";
import { Urbit } from "@urbit/http-api";
import App from "./App.vue";
import router from "./router/index";
import store from "./store"

import "./assets/app.css";
import "./assets/styles.css";

import "@/components/document/styles/styles.css";
import "@/components/document/styles/prosemirror.css";
import "@/components/document/styles/document.css";

(window as any).urbit = new Urbit("");
(window as any).urbit.ship = (window as any).ship;

const app = createApp(App);

app.use(store);

app.use(router);

app.mount("#app");
