<template>
  <div id="space" :class="{'hide-nav': !nav, 'hide-doc-dock': !dock}">
    <Navbar v-if="!loading"/>
    <router-view class="flex-grow" v-if="!loading"></router-view>
    <SpaceDock :open="(spacedock.length == 0)" :class="{'hide-space-dock': spacedock.length == 0}" @close="closeSpaceDock" v-if="!loading"/>
    <SpaceSkeleton v-if="loading"/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import store from "@/store/index";
import { RouterLink, RouterView } from "vue-router";
import Navbar from "@/components/navbar/Navbar.vue";
import SpaceDock from "@/components/dock/SpaceDock.vue";
import SpaceSkeleton from "@/components/skeletons/SpaceSkeleton.vue";

export default defineComponent({
  name: "Space",
  components: {
    RouterView,
    Navbar,
    SpaceDock,
    SpaceSkeleton
  },
  data() {
    return {
      loading: false,
      nav: true,
      dock: false,
      spacedock: "",
    }
  },
  provide() {
    return {
      toggleNav: this.toggleNav,
      toggleDock: this.toggleDock,
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
        this.loading = false;
      })
    },
    toggleNav: function() {
      this.nav = !this.nav;
    },
    toggleDock: function() {
      this.dock = !this.dock;
      if(this.dock) {
        this.spacedock = "";
      }
    },
    pushSpaceDock: function() {
      this.spacedock = this.$route.query.spaceId as string;
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
