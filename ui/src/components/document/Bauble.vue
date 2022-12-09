<template>
  <div style="position: relative; left: 72px">
    <div
    class="bauble px-3 py-2 gap-3"
    :class="bauble.on ? 'bauble-on' : ''"
    :style="{
      right: `calc(var(--document-width) + var(--document-margin) + calc(100% - var(--document-width)) / 2)`,
      top: `${bauble.top - 4}px`,
    }"
  >
    <!-- Grip -->
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="var(--rlm-icon-color, #333333)"
      class="icon clickable"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5.83499 4.96497C6.5527 4.96497 7.13498 4.38268 7.13498 3.66498C7.13498 2.94728 6.5527 2.36499 5.83499 2.36499C5.11729 2.36499 4.535 2.94728 4.535 3.66498C4.535 4.38268 5.11729 4.96497 5.83499 4.96497ZM5.83499 9.29827C6.5527 9.29827 7.13498 8.71598 7.13498 7.99828C7.13498 7.28058 6.5527 6.69829 5.83499 6.69829C5.11729 6.69829 4.535 7.28058 4.535 7.99828C4.535 8.71598 5.11729 9.29827 5.83499 9.29827ZM7.13498 12.3316C7.13498 11.6139 6.5527 11.0316 5.83499 11.0316C5.11729 11.0316 4.535 11.6139 4.535 12.3316C4.535 13.0493 5.11729 13.6316 5.83499 13.6316C6.5527 13.6316 7.13498 13.0493 7.13498 12.3316ZM10.1683 4.96497C10.886 4.96497 11.4683 4.38268 11.4683 3.66498C11.4683 2.94728 10.886 2.36499 10.1683 2.36499C9.45059 2.36499 8.8683 2.94728 8.8683 3.66498C8.8683 4.38268 9.45059 4.96497 10.1683 4.96497ZM11.4683 7.99828C11.4683 7.28058 10.886 6.69829 10.1683 6.69829C9.45059 6.69829 8.8683 7.28058 8.8683 7.99828C8.8683 8.71598 9.45059 9.29827 10.1683 9.29827C10.886 9.29827 11.4683 8.71598 11.4683 7.99828ZM10.1683 13.6316C10.886 13.6316 11.4683 13.0493 11.4683 12.3316C11.4683 11.6139 10.886 11.0316 10.1683 11.0316C9.45059 11.0316 8.8683 11.6139 8.8683 12.3316C8.8683 13.0493 9.45059 13.6316 10.1683 13.6316Z"
      />
    </svg>
  </div>
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
  @apply flex;
  position: absolute;
  opacity: 0;
  z-index: 2;
  transition: opacity 80ms ease, top 80ms ease-out;
}

.bauble-on {
  opacity: 1;
  transition: opacity 80ms ease 120ms, top 80ms ease-out;
}
</style>
