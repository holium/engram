<template>
  <div class="toolbar" id="toolbar">
    <!-- Nav Show / hide -->
    <svg
      viewBox="0 0 16 16"
      fill="var(--rlm-icon-color, #333333)"
      class="icon clickable nav-toggle"
      xmlns="http://www.w3.org/2000/svg"
      @click="toggleHideNav"
    >
      <path d="M1 3.5C1 3.22375 1.22387 3 1.5 3H14.5C14.775 3 15 3.22375 15 3.5C15 3.77625 14.775 4 14.5 4H1.5C1.22387 4 1 3.77625 1 3.5ZM1 8.5C1 8.225 1.22387 8 1.5 8H14.5C14.775 8 15 8.225 15 8.5C15 8.775 14.775 9 14.5 9H1.5C1.22387 9 1 8.775 1 8.5ZM14.5 14H1.5C1.22387 14 1 13.775 1 13.5C1 13.225 1.22387 13 1.5 13H14.5C14.775 13 15 13.225 15 13.5C15 13.775 14.775 14 14.5 14Z" fill="#261F1F"/>
    </svg>

    <div class="flex flex-grow px-3 gap-2 items-center opacity-50">
      <div class="heading-2">
        {{ space.name }}
      </div>
      /
      <div class="">
        {{ doc.name }}
      </div>
    </div>

    <!-- Dock Show / hide -->
      <svg
        viewBox="0 0 16 16"
        fill="var(--rlm-icon-color, #333333)"
        class="icon clickable dock-toggle"
        xmlns="http://www.w3.org/2000/svg"
        @click="toggleHideDock"
      >
        <path d="M1 3.5C1 3.22375 1.22387 3 1.5 3H14.5C14.775 3 15 3.22375 15 3.5C15 3.77625 14.775 4 14.5 4H1.5C1.22387 4 1 3.77625 1 3.5ZM1 8.5C1 8.225 1.22387 8 1.5 8H14.5C14.775 8 15 8.225 15 8.5C15 8.775 14.775 9 14.5 9H1.5C1.22387 9 1 8.775 1 8.5ZM14.5 14H1.5C1.22387 14 1 13.775 1 13.5C1 13.225 1.22387 13 1.5 13H14.5C14.775 13 15 13.225 15 13.5C15 13.775 14.775 14 14.5 14Z" fill="#261F1F"/>
      </svg>

  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import store from "@/store/index"
import type { Space, Document } from "@/store/types"
export default defineComponent({
  name: "Toolbar",
  inject: ["toggleNav", "toggleDock"],
  methods: {
    toggleHideNav: function() {
      (this as any).toggleNav();
    },
    toggleHideDock: function() {
      (this as any).toggleDock();
    },
  },
  computed: {
    space: function(): Space {
      return store.getters["space/get"]
    },
    doc: function() {
      return store.getters['documents/meta'](`/${this.$route.params.author}/${this.$route.params.clock}`)
    }
  }
});
</script>

<style lang="css" scoped>
#toolbar {
  @apply bg-window;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1;
  opacity: 0;
  transition: opacity 80ms ease;
}
#toolbar:hover {
  opacity: 1;
}

.dock-toggle, .nav-toggle {
  @apply bg-none;
  transform: rotate(0);
  transition: transform 200ms ease, background-color 80ms ease;
}

.hide-dock .dock-toggle {
  transform: rotate(-90deg);
}

.hide-nav .nav-toggle {
  transform: rotate(90deg);
}

</style>
