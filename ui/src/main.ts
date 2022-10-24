import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/index";

import "./assets/app.css";
import "./assets/styles.css";

import "@/components/document/styles/styles.css";
import "@/components/document/styles/prosemirror.css";
import "@/components/document/styles/document.css";

const app = createApp(App);

app.use(router);

app.mount("#app");
