<template>
  <div @mousemove="handleMouse">
    <component :is="contextmenu.dom" :contextmenu="contextmenu" v-if="contextmenu != null" style="z-index: 10"/>
    <router-view></router-view>
    <div 
      class="brand" 
    >
      <div 
        ref="brand" 
        class="brand-content font-azimuth" 
        :style="{ 'background-image': `radial-gradient(circle at ${mouseX}px ${mouseY}px, rgba(var(--rlm-text-rgba, 51, 51, 51)) 0px, transparent 24px)`}"
      >
        deus vult
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { RouterLink, RouterView } from "vue-router";
import type { Menu } from "@/components/menus/types"
import ContextMenu from "@/components/menus/ContextMenu.vue";


export default defineComponent({
  name: "App",
  components: {
    RouterView,
    ContextMenu
  },
  provide() {
    return {
      contextmenu: this.contextmenu,
      pushMenu: this.pushMenu,
      closeMenu: this.closeMenu
    }
  },
  data() {
    return {
      contextmenu: null as any,
      mouseX: 0,
      mouseY: 0,
    }
  },
  methods: {
    pushMenu: function(menu: Menu) {
      this.contextmenu = menu;
    },
    closeMenu: function() {
      this.contextmenu = null;
    },
    handleMouse: function(event: MouseEvent) {
      if(this.$refs['brand']) {
        const box = (this.$refs['brand'] as any).getBoundingClientRect();
        this.mouseX = event.clientY - box.top;
        this.mouseY = box.width - event.clientX + box.left;
      }
    }
  }
});
</script>

<style scoped>

.brand-content {
  font-weight: bold;
  user-select: none;
  color: transparent;
  background-clip: text;
}

.brand {
  font-size: 18px;
  white-space: nowrap;
  opacity: .5;
  position: fixed;
  bottom: 0px;
  left: 0px;
  transform-origin: bottom left;
  transform: rotate(90deg) translateX(-100%);
  padding: 8px 24px;
}

</style>
