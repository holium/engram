import { createRouter, createWebHistory } from "vue-router";
import Workspace from "@/views/Workspace.vue";
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
        { path: ":id", name: "Workspace", component: Workspace },
        { path: "", name: "empty", component: Empty },
      ],
    },
  ],
});

export default router;
