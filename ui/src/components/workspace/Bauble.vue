<template>
  <div class="">Bauble</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "Bauble",
  props: {
    bauble: {
      required: true,
    },
  },
});
</script>

<style lang="css" scoped></style>
