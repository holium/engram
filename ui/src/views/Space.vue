<template>
  <div id="space">
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { RouterLink, RouterView } from "vue-router";
export default defineComponent({
  name: "Space",
  components: {
    RouterView,
  },
});
</script>

<style lang="css" scoped></style>
