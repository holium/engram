<template>
  <div id="space">
    <Navbar />
    <router-view class="flex-grow"></router-view>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { RouterLink, RouterView } from "vue-router";
import Navbar from "@/components/navbar/Navbar.vue";
export default defineComponent({
  name: "Space",
  components: {
    RouterView,
    Navbar,
  },
});
</script>

<style lang="css" scoped>

#space {
  @apply flex items-stretch;
  height: 100vh;
}

</style>
