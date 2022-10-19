<template>
  <div
    class="bauble px-3 py-2"
    :class="bauble.on ? 'bauble-on' : ''"
    :style="{
      right: `calc(var(--document-width) + var(--document-margin) + calc(100% - var(--document-width)) / 2)`,
      top: `${bauble.top}px`,
    }"
  >
    Bauble
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import type { Bauble as IBauble } from "./prosemirror/bauble";
export default defineComponent({
  name: "Bauble",
  props: {
    bauble: {
      type: Object,
      required: true,
    },
  },
});
</script>

<style lang="css" scoped>
.bauble {
  position: fixed;
  opacity: 0;
  transition: opacity 120ms ease 80ms, top 120ms ease-out;
}

.bauble-on {
  opacity: 1;
  transition: opacity 120ms ease 80ms, top 120ms ease-out;
}
</style>
