import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/index";

import "./assets/app.css";
import "./assets/styles.css";

import "@/components/workspace/styles/styles.css";
import "@/components/workspace/styles/prosemirror.css";
import "@/components/workspace/styles/document.css";

const app = createApp(App);

app.use(router);

app.mount("#app");
