<template>
  <div class="flex flex-row items-stretch overflow-hidden">
    <div class="flex flex-col flex-grow relative" :class="{'loading-document': loading}" style="width: 100%">
      <Toolbar :doc="doc"/>
      <div class="search-bar input" :style="finder ? { 'top': '0'} : {}" v-if="!missing">
        <input 
          :disables="!finder"
          ref="finder"
          type="text" 
          placeholder="find in document..." 
          v-model="finding"
          @keydown="closeFinder"
        />
        <svg 
          @click="handleFinderDown"
          viewBox="0 0 16 16" 
          fill="var(--rlm-icon-color, #333333)"
          xmlns="http://www.w3.org/2000/svg"
          class="icon clickable"
          style="transform: rotate(90deg);"
        >
          <path d="M6 3.99995L9.99998 7.99245L5.99997 11.9999C5.49995 12.4999 6.07812 13.2999 6.70718 12.6712L10.7072 8.69933C11.0978 8.3087 11.0978 7.67589 10.7072 7.28527L6.70718 3.31341C6.07812 2.65716 5.5 3.50005 6 3.99995Z" fill="#333333"/>
        </svg>
        <svg 
          @click="handleFinderUp"
          viewBox="0 0 16 16" 
          fill="var(--rlm-icon-color, #333333)"
          xmlns="http://www.w3.org/2000/svg"
          class="icon clickable"
          style="transform: rotate(-90deg);"
        >
          <path d="M6 3.99995L9.99998 7.99245L5.99997 11.9999C5.49995 12.4999 6.07812 13.2999 6.70718 12.6712L10.7072 8.69933C11.0978 8.3087 11.0978 7.67589 10.7072 7.28527L6.70718 3.31341C6.07812 2.65716 5.5 3.50005 6 3.99995Z" fill="#333333"/>
        </svg>
      </div>
      <div class="flex flex-col gap-3 justify-center items-center flex-grow" v-if="loading || missing">
        <img class="loading-animation" src="@/assets/engram.svg" />
        <div v-if="missing">Can't find this document</div>
      </div>
      <div class="relative items-center scrollbar-small flex-grow" id="main" :class="{'no-cover': cover.src.length == 0}" v-if="!missing">
        <Cover :cover="cover" />
        <div id="document" ref="document"> </div>
      </div>
    </div>
    <DocumentDock :styling="styling" :doc="doc" v-if="!missing"/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import store from "@/store/index";
import type { DocumentContent, DocumentVersion, ItemMeta } from "@/store/types"

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
      missing: false,
      doc: {
        id: "",
        owner: "",
        name: "",
        ships: {},
        roles: {},
      },
      loaded: null as null | Promise<DocumentContent>,
      loading: false,
      finder: false,
      finding: "",
      queirier: null as any,
      foundNodes: [] as any,
      foundIndex: 0,
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
        console.log("loaded res: ", res);
        if(res == "missing document") {
          this.missing = true;
        } else {
          this.missing = false;
          this.doc = res;
          render(
            this.$refs["document"] as any, 
            res.content, 
            (this as any).pushMenu, 
            this.updateCover, 
            this.updateStyling, 
            this.openFinder,
            null, 
            this.editable(this.doc)
          );
          this.loading = false;
        }
      }).catch(() => {
        this.missing = true;
      })
  },
  mounted: function () {
    //render document
    if(this.loaded == null) console.warn("no document");
    else {
      console.log("need to render document");
      this.loaded.then((res: any) => {
        if(res == "missing document") {
          this.missing = true;
        } else {
          this.missing = false;
          this.doc = res;
          render(
            this.$refs["document"] as any, 
            res.content, 
            (this as any).pushMenu, 
            this.updateCover, 
            this.updateStyling, 
            this.openFinder,
            null, 
            this.editable(this.doc)
          );
          this.loading = false;
          /*
          (async () => {
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
          });
          */
        }
      }).catch(() => {
        this.missing = true;
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
            this.openFinder,
            newRender, 
            this.editable(this.doc)
          );
        });
      }
    },
    finding: function(nowFinding: string) {
      if(this.queirier !== null) {
        this.queirier(this.finding);
        this.foundNodes = document.querySelector(".ProseMirror")?.querySelectorAll(".found-text");
        this.foundIndex = this.foundIndex % this.foundNodes.length;
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
    openFinder: function(querier: (query: string) => void) {
      this.finder = true;
      this.queirier = querier;
      querier(this.finding);
      setTimeout(() => {
        (this.$refs['finder'] as any).focus();
      }, 80);
    },
    handleFinderUp: function() {
      this.foundIndex = (this.foundIndex == 0 ? this.foundNodes.length : this.foundIndex) - 1;
      this.foundNodes[this.foundIndex].scrollIntoView({
        behavior: "smooth",
        block: "center",
      })
    },
    handleFinderDown: function() {
      this.foundIndex = (this.foundIndex + 1) % this.foundNodes.length;
      this.foundNodes[this.foundIndex].scrollIntoView({
        behavior: "smooth",
        block: "center",
      })
    },
    closeFinder: function(event: KeyboardEvent) {
      if(event.key == "Escape") {
        this.finder = false;
        this.finding = "";
        this.foundIndex = 0;
        this.queirier("");
        this.queirier = null;
      } else if(event.key == "Enter") {
        this.handleFinderDown();
      }
    },
    editable: function(doc: ItemMeta): boolean {
        const myroles = store.getters['space/roles'];
        const owner = doc.owner;
        const ships = doc.ships;
        const roles = doc.roles;
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
  @apply flex flex-col flex-grow items-center overflow-hidden relative;
  width: 100%;
  min-height: calc(100% - 32vh);
  z-index: 1;
}

.no-cover #document {
  min-height: calc(100% - calc(2.5em + 32px));
}

.search-bar {
  @apply bg-paper rounded-2 gap-2;
  position: absolute;
  z-index: 2;
  left: 50%;
  transform: translate(-50%);
  top: calc(-1.68rem - 16px);
  transition: top 200ms ease;
}

</style>
