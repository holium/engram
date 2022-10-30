<template>
  <div class="flex justify-center items-center" :style="{ height: '100vh'}">
    <div class="">
      engram...
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
export default defineComponent({
  name: "Fallback",
  beforeRouteEnter: function(to, from, next) {
    next(`/apps/engram/~${(window as any).ship}/our`);
  }
});
</script>

<style lang="css" scoped>
</style>
