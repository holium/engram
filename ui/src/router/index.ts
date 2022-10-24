import { createRouter, createWebHistory } from "vue-router";
import Document from "@/components/document/Document.vue";
import Empty from "@/views/Empty.vue";
import Space from "@/views/Space.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/apps/engram",
      name: "Space",
      component: Space,
      children: [
        { path: ":id", name: "Document", component: Document },
        { path: "", name: "empty", component: Empty },
      ],
    },
  ],
});

export default router;
