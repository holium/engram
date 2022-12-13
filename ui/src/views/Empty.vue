<template>
  <div class="flex flex-col justify-center items-center">
    <div class="">empty workspace</div>
    <div class="cursor-pointer" @click="openDocument">open document</div>
  </div>
</template>

<script lang="ts">
import store from "@/store/index";
import { defineComponent } from "vue";
export default defineComponent({
  name: "Empty",
  methods: {
    openDocument: function () {
      store.dispatch("documents/make", { name: "Untitled"});
      
    },
  },
});
</script>

<style lang="css" scoped></style>
