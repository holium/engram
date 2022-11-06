<template>
  <div class="flex justify-center items-center" :style="{ height: '100vh'}">
    <div class="">
      engram...
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import store from "@/store/index"
export default defineComponent({
  name: "Fallback",
  beforeRouteEnter: function(to, from, next) {
    const spaces = store.getters['spaces'];
    if(spaces.length > 0) {
      next(`/apps/engram/~${(window as any).ship}/our`);
    } else {
      next(`/apps/engram/~/-`);
    }
  }
});
</script>

<style lang="css" scoped>
</style>
