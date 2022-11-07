<template>
  <div>
    <ContextMenu :contextmenu="contextmenu" v-if="contextmenu != null"/>
    <router-view></router-view>
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
    }
  },
  methods: {
    pushMenu: function(menu: Menu) {
      this.contextmenu = menu;
    },
    closeMenu: function() {
      this.contextmenu = null;
    }
  }
});
</script>

<style scoped></style>
