<template>
  <div class="relative" id="workspace" ref="workspace">
    <Toolbar id="toolbar" />
    <Bauble :bauble="bauble" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import render from "@/components/workspace/prosemirror/render";
import Toolbar from "@/components/workspace/Toolbar.vue";
import Bauble from "@/components/workspace/Bauble.vue";
import type {
  BaubleUpdate,
  Bauble as IBauble,
} from "@/components/workspace/prosemirror/bauble";

export default defineComponent({
  name: "Workspace",
  components: {
    Toolbar,
    Bauble,
  },
  data() {
    return {
      bauble: {
        on: false,
        top: 0,
        node: null,
      } as IBauble,
    };
  },
  mounted: function () {
    //render document
    render(this.$refs["workspace"] as any, this.updateBauble);
  },
  methods: {
    updateBauble: function (bauble: BaubleUpdate) {
      this.bauble = { ...this.bauble, ...bauble };
    },
  },
});
</script>

<style lang="css" scoped>
#workspace {
  @apply relative;
  height: 100vh;
}
#toolbar {
  position: sticky;
  height: 0;
  top: 0;
  width: 100%;
}
</style>
