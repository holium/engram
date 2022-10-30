<template>
  <div class="flex flex-col justify-center items-center">
    <div class="">empty workspace</div>
    <div class="cursor-pointer" @click="openDocument">open document</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "Empty",
  methods: {
    openDocument: function () {
      this.$router.push(`/apps/engram/${this.$route.params.space}/document`);
    },
  },
});
</script>

<style lang="css" scoped></style>
