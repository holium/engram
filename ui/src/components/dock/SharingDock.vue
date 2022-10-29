<template>
  <div class="flex flex-col">

    <!-- Auto uUdate -->
    <div class="px-3 flex gap-3 items-center">
      <div class="dock-label">Auto-sync with other ships:</div>
      <!-- toggle -->
      <Toggle :value="autoSync" @change="(event) => { autoSync = event }" class="px-3"/>
    </div>

    <div class="px-3 heading">
      permissions
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Toggle from "./Toggle.vue"
export default defineComponent({
  name: "SharingDock",
  components: {
    Toggle
  },
  data() {
    return {
      autoSync: false,
    }
  },
});
</script>

<style lang="css" scoped>
</style>
