<template>
  <div class="flex flex-row items-stretch overflow-hidden">
    <div class="flex flex-col flex-grow relative" :class="{'loading-document': loading}" style="width: 100%">
      <Toolbar />
      <Finder 
        :show="finder && !missing"
        :querier="querier"
        @close="closeFinder"
      />
      <div class="flex flex-col gap-3 justify-center items-center flex-grow" v-if="loading || missing">
        <img class="loading-animation" src="@/assets/engram.svg" />
        <div v-if="missing">Can't find this document</div>
      </div>
      <div 
        class="relative items-center scrollbar-small flex-grow" 
        id="main" 
        :class="{'no-cover': cover.src.length == 0}" 
        v-if="!missing"
      >
        <Cover :cover="cover" />
        <div id="document" ref="document"> </div>
      </div>
    </div>
    <DocumentDock v-if="got"/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import store from "@/store/index";
import type { ShipPermission, RolePermission } from "@/store/filesystem"
import type { DocumentVersion } from "@/store/document"

import Toolbar from "@/components/Toolbar.vue";
import Finder from "./Finder.vue"
import DocumentDock from "@/components/dock/DocumentDock.vue";

import render from "./prosemirror/render";
import type { EditorView } from "prosemirror-view";
import Cover from "./Cover.vue"
import type {
  CoverUpdate,
  Cover as ICover,
} from "./prosemirror/cover";

export default defineComponent({
  name: "Document",
  components: {
    Toolbar,
    Finder,
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
      loaded: null as null | Promise<EditorView>,
      loading: false,
      finder: false,
      querier: null as any,
      cover: {
        pos: 0,
        src: "",
        xpositioning: 50,
        ypositioning: 50,
      } as ICover,
    };
  },
  watch: {
    path: function(newpath: string) {
      this.open(newpath);
    },
    previewing: function(newRender: null | DocumentVersion) {
      this.loading = true;
      this.loaded = render(
              this.$refs["document"] as any, 
              this.path, 
              (this as any).pushMenu, 
              this.updateCover, 
              this.openFinder,
              newRender, 
              newRender == null ? this.editable(this.path) : false
            );
      this.loaded.then(() => {
        this.loading = false;
      })
    },
  },
  mounted: function() {
    this.open(this.path);
  },
  methods: {
    open: function(docId: string, snapshot: null | DocumentVersion = null) {
      this.loading = true;
      this.loaded = render(
              this.$refs["document"] as any, 
              docId, 
              (this as any).pushMenu, 
              this.updateCover, 
              this.openFinder,
              snapshot, 
              this.editable(this.path)
            );
      this.loaded.then(() => {
        this.loading = false;
      })
      this.loaded.catch(() => {
        console.error("problem loading document");
        this.missing = true;
      })

    },
    updateCover: function (cover: CoverUpdate) {
      this.cover = { ...this.cover, ...cover };
    },
    openFinder: function(querier: (query: string) => void) {
      this.finder = true;
      this.querier = querier;
      console.log("opening finder: ", this.finder, this.missing);
    },
    closeFinder: function() {
      this.finder = false;
      this.querier("");
      this.querier = null;
    },
    editable: function(id: string): boolean {
      const myroles = store.getters['space/myroles'];
      if(!store.getters['filesys/get'](id)) return false;
      const space = store.getters['filesys/space'](id);
      const owner = store.getters['filesys/owner'](id);
      const roles = store.getters['filesys/roles'](id);
      const ships = store.getters['filesys/ships'](id);

      return owner == `~${(window as any).ship}` || 
          Object.keys(ships)
              .map((timestamp: string) => { return ships[timestamp] })
                  .reduce((a: ShipPermission, acc: boolean) => {
                      return acc || (a.ship == `~${(window as any).ship}` && (a.level == "editor" || a.level == "admin"));
                  }, false) ||
          (
            space == this.$route.query.spaceId && 
            Object.keys(roles)
                .map((timestamp: string) => { return roles[timestamp] })
                    .reduce((a: RolePermission, acc: boolean) => {
                        return acc || (myroles.includes(a.role) && (a.level == "editor" || a.level == "admin"));
                    }, false)
          );
    }
  },
  computed: {
    path: function(): string {
      return `/${this.$route.params.author}/${this.$route.params.clock}`
    },
    got: function() {
      return store.getters['filesys/get'](this.path);
    },
    previewing: function() {
      return store.getters['document/previewing'];
    },
  }
});
</script>

<style lang="css" scoped>
#main {
  @apply relative overflow-auto;
  padding-top: calc(1.25rem + 16px);
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

</style>
