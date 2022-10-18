import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store"

import "./assets/app.css";
import "./assets/styles.css";

const app = createApp(App);

app.use(store);

app.use(router);

app.mount("#app");
