<template>
  <div class="relative" id="workspace" ref="workspace">
    <Toolbar id="toolbar" />
    <Bauble :bauble="bauble" v-if="bauble" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import render from "@/components/workspace/prosemirror/render";
import Toolbar from "@/components/workspace/Toolbar.vue";
import Bauble from "@/components/workspace/Bauble.vue";
export default defineComponent({
  name: "Workspace",
  components: {
    Toolbar,
    Bauble,
  },
  data() {
    return {
      bauble: null,
    };
  },
  mounted: function () {
    //render document
    render(this, this.$refs["workspace"] as any);
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
