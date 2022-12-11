<template>
  <div class="flex flex-row items-stretch">
    <div class="flex flex-col flex-grow relative">
      <Toolbar />
      <div class="relative items-center scrollbar-small flex-grow" id="main" :class="{'no-cover': cover.src.length == 0}">
        <Cover :cover="cover" />
        <div id="document" ref="document" >
        </div>
      </div>
    </div>
    <DocumentDock :styling="styling" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import store from "@/store/index";
import type { DocumentContent, DocumentVersion } from "@/store/types"

import Toolbar from "@/components/Toolbar.vue";
import DocumentDock from "@/components/dock/DocumentDock.vue";

import { EditorView } from "prosemirror-view";
import render from "./prosemirror/render";
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
    DocumentDock,
    Cover,
  },
  props: {
    allowDock: {
      type: Boolean,
      required: true,
    }
  },
  inject: ['pushMenu'],
  data() {
    return {
      loaded: null as null | Promise<DocumentContent>,
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
  created: function() {
    this.loaded = store.dispatch("workspace/open", `${this.$route.params.author}/${this.$route.params.clock}`);
  },
  beforeRouteUpdate: function(to) {
    this.loaded = store.dispatch("workspace/open", `${to.params.author}/${to.params.clock}`);
    this.loaded.then((res: any) => {
        render(this.$refs["document"] as any, res.content, (this as any).pushMenu, this.updateCover, this.updateStyling, null);
      })
  },
  mounted: function () {
    //render document
    if(this.loaded == null) console.warn("no document");
    else {
      this.loaded.then((res: any) => {
        render(this.$refs["document"] as any, res.content, (this as any).pushMenu, this.updateCover, this.updateStyling, null);
      })
    }
  },
  watch: {
    previewing: function(newRender: null | DocumentVersion) {
      console.log("previewing changed:", newRender)
      if(this.loaded != null) {
        this.loaded.then((res: any) => {
          render(this.$refs["document"] as any, res.content, (this as any).pushMenu, this.updateCover, this.updateStyling, newRender);
        });
      }
    }
  },
  methods: {
    loadDocument: function(document: string) {
      store.dispatch("workspace/load", document);
    },
    updateCover: function (cover: CoverUpdate) {
      this.cover = { ...this.cover, ...cover };
    },
    updateStyling: function(styling: StylingUpdate) {
      this.styling = { ...this.styling, ...styling };
    }
  },
  computed: {
    previewing: function() {
      return store.getters['workspace/previewing'];
    }
  }
});
</script>

<style lang="css" scoped>
#main {
  @apply relative overflow-auto;
}

#document {
  @apply bg-paper flex flex-col flex-grow items-center overflow-hidden relative;
  width: 100%;
  min-height: calc(100% - 32vh);
  border-width: 1px 1px 0px 1px;
  border-style: solid;
  border-color: theme(colors.border);
  border-radius: 16px 16px 0px 0px;
  z-index: 1;
}

.no-cover #document {
  min-height: calc(100% - calc(2.5em + 32px));
}

</style>
