<template>
  <div class="flex flex-row items-stretch">
    <div class="flex flex-col flex-grow">
      <Toolbar />
      <div class="relative items-center scrollbar-small flex-grow" id="document" ref="document">
        <Bauble :bauble="bauble" />
        <Cover :cover="cover" />
      </div>
    </div>
    <Dock :styling="styling" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import Toolbar from "@/components/Toolbar.vue";
import Dock from "@/components/dock/Dock.vue";

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
import type {
  StylingUpdate,
  Styling as IStyling
} from "./prosemirror/styling";

export default defineComponent({
  name: "Document",
  components: {
    Toolbar,
    Dock,
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
      styling: {
        "root-size": { key: "root-size", value: null, pos: 0 },
        "ratio": { key: "ratio", value: null, pos: 0 },
        "document-width": { key: "document-width", value: null, pos: 0 },
        "document-margin": { key: "document-margin", value: null, pos: 0 },

        "body-font-family": { key: "body-font-family", value: null, pos: 0 },
        "heading-font-family": { key: "heading-font-family", value: null, pos: 0 },
        "heading-weight": { key: "heading-weight", value: null, pos: 0 },
      } as IStyling,
    };
  },
  mounted: function () {
    //render document
    render(this.$refs["document"] as any, this.updateBauble, this.updateCover, this.updateStyling);
  },
  methods: {
    updateBauble: function (bauble: BaubleUpdate) {
      this.bauble = { ...this.bauble, ...bauble };
    },
    updateCover: function (cover: CoverUpdate) {
      this.cover = { ...this.cover, ...cover };
    },
    updateStyling: function(styling: StylingUpdate) {
      this.styling = { ...this.styling, ...styling };
    }
  },
});
</script>

<style lang="css" scoped>
#document {
  @apply relative flex flex-col overflow-auto;
}
</style>
