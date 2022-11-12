<template>
  <div class="flex justify-center items-center" :style="{ height: '100vh'}">
    <div class="">
      engram...
    </div>
    <div>
      path: {{ $route.query }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import store from "@/store/index"
export default defineComponent({
  name: "Fallback",
  beforeRouteEnter: function(to, from, next) {
    next(`/apps/engram?spaceId=${to.query.spaceId}`);
  }
});
</script>

<style lang="css" scoped>
</style>
