<template>
  <div class="flex flex-row items-stretch overflow-hidden">
    <div class="flex flex-col flex-1 relative" :class="{'loading-document': loading}" :style="`width: calc(100% - ${dockWidth}px)`">
      <Toolbar />
      <Finder 
        :show="finder && !missing"
        :querier="querier"
        @close="closeFinder"
      />
      <DocumentSkeleton v-if="loading || missing" class="flex-grow" />
      <div class="overflow-hidden flex-grow flex-col items-stretch" id="main-wrapper" :style="{'display': (loading || missing ? 'none' : 'flex')}">
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
    </div>
    <DocumentDock v-if="got" @updateWidth="handleWidthUpdate"/>
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

import DocumentSkeleton from "../skeletons/DocumentSkeleton.vue";

export default defineComponent({
  name: "Document",
  components: {
    Toolbar,
    Finder,
    DocumentDock,
    Cover,
    DocumentSkeleton
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
      dockWidth: 0,
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
    handleWidthUpdate: function(newWidth: number) {
      this.dockWidth = newWidth;
    },
    open: function(docId: string, snapshot: null | DocumentVersion = null) {
      this.loading = true;
      store.dispatch("filesys/protectedget", {id: docId, type: "document"}).then(() => {
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
      })
    },
    updateCover: function (cover: CoverUpdate) {
      this.cover = { ...this.cover, ...cover };
    },
    openFinder: function(querier: (query: string) => void) {
      this.finder = true;
      this.querier = querier;
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
      const roles = store.getters['space/roles'];
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

#main-wrapper {
  margin-top: calc(1.25rem + 32px);
}

#main {
  @apply relative;
  overflow: auto;
  overflow: overlay;
}

#document {
  @apply flex flex-col flex-grow items-center overflow-hidden relative;
  padding: 0px 188px 0px 8px;
  width: 100%;
  min-height: calc(100% - 32vh);
  z-index: 1;
}

.no-cover #document {
  min-height: calc(100% - calc(1.25rem + 32px));
}

</style>
