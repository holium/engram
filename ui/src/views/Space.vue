<template>
  <div id="space" :class="{'hide-nav': !nav, 'hide-doc-dock': !dock}">
    <Navbar />
    <router-view class="flex-grow"></router-view>
    <FolderDock :folder="folderdock" :class="{'hide-folder-dock': folderdock.length == 0}" @close="closeFolderDock"/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import store from "@/store/index";
import { RouterLink, RouterView } from "vue-router";
import Navbar from "@/components/navbar/Navbar.vue";
import FolderDock from "@/components/dock/FolderDock.vue"

export default defineComponent({
  name: "Space",
  components: {
    RouterView,
    Navbar,
    FolderDock,
  },
  data() {
    return {
      nav: true,
      dock: false,
      folderdock: "",
    }
  },
  provide() {
    return {
      toggleNav: this.toggleNav,
      toggleDock: this.toggleDock,
      pushFolderDock: this.pushFolderDock,
      closeFolderDock: this.closeFolderDock
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
      store.dispatch("load", to as string);
      if(to != "/null/space") {
        (window as any).urbit.poke({ 
          app: "engram", 
          mark: "post",
          json: {
            space: {
              gatherall: {
                space: to
              }
            }
          }
        })
        setTimeout(() => {
          store.dispatch("load", to as string);
      }, 2000);
      }
    },
    toggleNav: function() {
      this.nav = !this.nav;
    },
    toggleDock: function() {
      this.dock = !this.dock;
    },
    pushFolderDock: function(id: string) {
      this.folderdock = id;
    },
    closeFolderDock: function() {
      this.folderdock = "";
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
