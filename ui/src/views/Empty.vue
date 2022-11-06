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
      console.log(store);
      console.log(store.dispatch)
      store.dispatch("documents/make", { name: "Untitled"});
      //.then((result) => {
      //  console.log("make untitled result", result);
      //  //this.$router.push(`/apps/engram/${this.$route.params.space}/document`);
      //})
      
    },
  },
});
</script>

<style lang="css" scoped></style>
