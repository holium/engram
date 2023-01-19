<template>
  <div class="flex flex-row items-stretch">
    <div class="flex flex-col flex-grow relative" :class="{'loading-document': loading}">
      <Toolbar />
      <div class="flex justify-center items-center flex-grow" v-if="loading">
        <img class="loading-animation" src="@/assets/engram.svg" />
      </div>
      <div class="relative items-center scrollbar-small flex-grow" id="main" :class="{'no-cover': cover.src.length == 0}">
        <Cover :cover="cover" />
        <div id="document" ref="document"> </div>
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
      loading: false,
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
    this.loading = true;
  },
  beforeRouteUpdate: function(to) {
    this.loaded = store.dispatch("workspace/open", `${to.params.author}/${to.params.clock}`);
    this.loading = true;
    this.loaded.then((res: any) => {
        render(
          this.$refs["document"] as any, 
          res.content, 
          (this as any).pushMenu, 
          this.updateCover, 
          this.updateStyling, 
          null, 
          this.editable(`/${to.params.author}/${to.params.clock}`)
        );
        this.loading = false;
      })
  },
  mounted: function () {
    //render document
    if(this.loaded == null) console.warn("no document");
    else {
      console.log("need to render document");
      this.loaded.then((res: any) => {
        console.log("loadded");
        render(
          this.$refs["document"] as any, 
          res.content, 
          (this as any).pushMenu, 
          this.updateCover, 
          this.updateStyling, 
          null, 
          this.editable(`/${this.$route.params.author}/${this.$route.params.clock}`)
        );
        this.loading = false;
        (window as any).urbit.poke({
          app: "engram", 
          mark: "post",
          json: {
            document: {
              gatherall: {
                id: `/${this.$route.params.author}/${this.$route.params.clock}`
              }
            }
          }
        })
      })
    }
  },
  watch: {
    previewing: function(newRender: null | DocumentVersion) {
      if(this.loaded != null) {
        this.loaded.then((res: any) => {
          render(
            this.$refs["document"] as any, 
            res.content, 
            (this as any).pushMenu, 
            this.updateCover, 
            this.updateStyling, 
            newRender, 
            this.editable(`/${this.$route.params.author}/${this.$route.params.clock}`)
          );
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
    },
    editable: function(path: string): boolean {
        const myroles = store.getters['space/roles'];
        const owner = store.getters['documents/owner'](path);
        const ships = store.getters['documents/ships'](path);
        const roles = store.getters['documents/roles'](path);
        const perms = Object.keys(roles).map((key: string) => {
          return myroles.includes(roles[key].perm) ? (roles[key].level == "editor" || roles[key].level == "admin") : false;
        })
        Object.keys(ships).forEach((key: string) => {
          perms.push(ships[key].perm == `~${(window as any).ship}` ? (ships[key].level == "editor" || ships[key].level == "admin") : false);
        })

        return `~${(window as any).ship}` == owner || perms.reduce((a: boolean, acc: boolean) => {
            return acc || a;
        }, false);
    }
  },
  computed: {
    previewing: function() {
      return store.getters['workspace/previewing'];
    },
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
