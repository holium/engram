import { createRouter, createWebHistory } from "vue-router";
import Document from "@/components/document/Document.vue";
import Empty from "@/views/Empty.vue";
import Space from "@/views/Space.vue";
import Fallback from "@/views/Fallback.vue"

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/apps/engram/",
      name: "Space",
      component: Space,
      children: [
        { path: ":author/:clock", name: "Document", component: Document },
        { path: "", name: "empty", component: Empty },
      ],
    },
    {
      path: "/:pathMatch(.*)*",
      component: Fallback,
    }
  ],
});

router.beforeEach((to, from, next) => {
  if(to.query.spaceId == undefined) {
    next(`${to.path}?spaceId=/null/space`);
  } else {
    next();
  }
})

export default router;
