<template>
  <div id="space" :class="{'hide-nav': !nav, 'hide-doc-dock': !dock}">
    <Navbar v-if="!loading"/>
    <router-view class="flex-grow" v-if="!loading"></router-view>
    <FolderDock :folder="folderdock" :class="{'hide-folder-dock': folderdock.length == 0}" @close="closeFolderDock" v-if="!loading"/>
    <SpaceDock :open="(spacedock.length == 0)" :class="{'hide-space-dock': spacedock.length == 0}" @close="closeSpaceDock" v-if="!loading"/>
    <!--
    <div class="flex justify-center items-center flex-grow" v-if="loading">
      <img class="loading-animation" src="@/assets/engram.svg" />
    </div>
    -->
    <SpaceSkeleton v-if="loading"/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import store from "@/store/index";
import { RouterLink, RouterView } from "vue-router";
import Navbar from "@/components/navbar/Navbar.vue";
import FolderDock from "@/components/dock/FolderDock.vue";
import SpaceDock from "@/components/dock/SpaceDock.vue";
import SpaceSkeleton from "@/components/skeletons/SpaceSkeleton.vue";

export default defineComponent({
  name: "Space",
  components: {
    RouterView,
    Navbar,
    FolderDock,
    SpaceDock,
    SpaceSkeleton
  },
  data() {
    return {
      loading: false,
      nav: true,
      dock: false,
      folderdock: "",
      spacedock: "",
    }
  },
  provide() {
    return {
      toggleNav: this.toggleNav,
      toggleDock: this.toggleDock,
      pushFolderDock: this.pushFolderDock,
      closeFolderDock: this.closeFolderDock,
      pushSpaceDock: this.pushSpaceDock,
      closeSpaceDock: this.closeSpaceDock
    }
  },
  created: function() {
    this.loadSpace(this.$route.query.spaceId as string);
  },
  watch: {
    spaceId: function() {
      this.loadSpace(this.$route.query.spaceId as string);
    }
  },
  computed: {
    spaceId: function(): string {
      return this.$route.query.spaceId as string;
    }
  },
  methods: {
    loadSpace: function(to: string) {
      this.loading = true;
      store.dispatch("load", to as string).then(() => {
        //this.loading = false;
      })
    },
    toggleNav: function() {
      this.nav = !this.nav;
    },
    toggleDock: function() {
      this.dock = !this.dock;
      if(this.dock) {
        this.folderdock = "";
        this.spacedock = "";
      }
    },
    pushFolderDock: function(id: string) {
      this.folderdock = id;
      this.dock = false;
      this.spacedock = "";
    },
    closeFolderDock: function() {
      this.folderdock = "";
    },
    pushSpaceDock: function() {
      this.spacedock = this.$route.query.spaceId as string;
      this.folderdock = "";
      this.dock = false;
    },
    closeSpaceDock: function() {
      this.spacedock = "";
    }
  }
});
</script>

<style lang="css" scoped>

#space {
  @apply flex items-stretch;
  height: 100vh;
  overflow: hidden;
}

</style>
