<template>
  <div class="flex items-stretch text-body">
    <div id="nav" :style="{width: `${navWidth}px`}">
      <SpaceHeading />
      <Search />
      <FileSystem class="flex-grow" />
    </div>
    <div class="dock-grip" draggable="true" @dragstart="handleDragStart">

    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import SpaceHeading from "./SpaceHeading.vue";
import Search from "./Search.vue";
import FileSystem from "./FileSystem.vue";
export default defineComponent({
  name: "Navbar",
  components: {
    SpaceHeading,
    Search,
    FileSystem,
  },
  data() {
    return {
      navWidth: 240,
      dragStart: 0,
    }
  },
  methods: {
    handleDragStart: function(event: any) {
      this.dragStart = event.clientX;
      event.preventDefault();
      document.addEventListener("mousemove", this.handleDrag);
      const cleanup = () => {
        document.removeEventListener("mouseup", cleanup);
        document.removeEventListener("mousemove", this.handleDrag);
      };
      document.addEventListener("mouseup", cleanup);
    },
    handleDrag: function(event: MouseEvent) {
      this.navWidth = this.navWidth + (event.clientX - this.dragStart);
      this.dragStart = event.clientX;
    },
  }
});
</script>

<style lang="css" scoped>

#nav {
  @apply flex flex-col p-4 gap-4;
  min-width: 180px;
  max-width: 24vw;
  transition: max-width 200ms ease, padding 200ms ease;
}

.hide-nav #nav {
  overflow: hidden;
  min-width: 0;
  max-width: 0;
  padding: 16px 0;
}

.hide-nav .dock-grip {
  opacity: 0;
}

</style>
