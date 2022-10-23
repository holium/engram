<template>
  <div class="relative" id="workspace" ref="workspace">
    <Toolbar id="toolbar" />
    <Bauble :bauble="bauble" />
    <Cover :cover="cover" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { EditorView } from "prosemirror-view";
import render from "@/components/workspace/prosemirror/render";
import Toolbar from "@/components/workspace/Toolbar.vue";
import Bauble from "@/components/workspace/Bauble.vue";
import type {
  BaubleUpdate,
  Bauble as IBauble,
} from "@/components/workspace/prosemirror/bauble";
import Cover from "@/components/workspace/Cover.vue"
import type {
  CoverUpdate,
  Cover as ICover,
} from "@/components/workspace/prosemirror/cover";

export default defineComponent({
  name: "Workspace",
  components: {
    Toolbar,
    Bauble,
    Cover,
  },
  data() {
    return {
      bauble: {
        on: false,
        top: 0,
        node: null,
      } as IBauble,
      cover: {
        pos: 0,
        src: "",
        xpositioning: 50,
        ypositioning: 50,
      } as ICover,
    };
  },
  mounted: function () {
    //render document
    render(this.$refs["workspace"] as any, this.updateBauble, this.updateCover);
  },
  methods: {
    updateBauble: function (bauble: BaubleUpdate) {
      this.bauble = { ...this.bauble, ...bauble };
    },
    updateCover: function (cover: CoverUpdate) {
      this.cover = { ...this.cover, ...cover };
    }
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
  z-index: 1;
  opacity: 0;
  transition: opacity 80ms ease;
}
#toolbar:hover {
  opacity: 1;
}
</style>
