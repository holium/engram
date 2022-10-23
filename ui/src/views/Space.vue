<template>
  <div id="space">
    <Navbar />
    <div class="flex flex-col flex-grow">
      <Toolbar />
      <router-view class="flex-grow"></router-view>
    </div>
    <Dock />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { RouterLink, RouterView } from "vue-router";
import Toolbar from "@/components/Toolbar.vue";
import Navbar from "@/components/navbar/Navbar.vue";
import Dock from "@/components/dock/Dock.vue";
export default defineComponent({
  name: "Space",
  components: {
    RouterView,
    Toolbar,
    Navbar,
    Dock
  },
});
</script>

<style lang="css" scoped>

#space {
  @apply flex items-stretch;
  height: 100vh;
}

</style>
