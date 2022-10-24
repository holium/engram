<template>
  <div class="text-body">
    <div class="flex px-3 py-2">toolbar</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "Toolbar",
});
</script>

<style lang="css" scoped>
#toolbar {
  position: sticky;
  height: 0;
  top: 0;
  width: 100%;
  z-index: 1;
  opacity: 0;
  transition: opacity 80ms ease;
}
#toolbar:hover {
  opacity: 1;
}

</style>
