<template>
  <div class="relative items-center scrollbar-small" id="document" ref="document">
    <Bauble :bauble="bauble" />
    <Cover :cover="cover" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { EditorView } from "prosemirror-view";
import render from "./prosemirror/render";
import Bauble from "./Bauble.vue";
import type {
  BaubleUpdate,
  Bauble as IBauble,
} from "./prosemirror/bauble";
import Cover from "./Cover.vue"
import type {
  CoverUpdate,
  Cover as ICover,
} from "./prosemirror/cover";

export default defineComponent({
  name: "Document",
  components: {
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
    render(this.$refs["document"] as any, this.updateBauble, this.updateCover);
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
#document {
  @apply relative flex flex-col overflow-auto;
}
</style>
