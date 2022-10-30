<template>
  <div id="space" :class="{'hide-nav': !nav, 'hide-dock': !dock}">
    <Navbar />
    <router-view class="flex-grow"></router-view>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import store from "@/store/index";
import { RouterLink, RouterView } from "vue-router";
import Navbar from "@/components/navbar/Navbar.vue";

export default defineComponent({
  name: "Space",
  components: {
    RouterView,
    Navbar,
  },
  data() {
    return {
      nav: true,
      dock: false,
    }
  },
  provide() {
    return {
      toggleNav: this.toggleNav,
      toggleDock: this.toggleDock,
    }
  },
  created: function() {
    this.loadSpace(this.$route.params.space as string);
  },
  beforeRouteUpdate: function(to) {
    this.loadSpace(to.params.space as string);
  },
  methods: {
    loadSpace: function(to: string) {
      store.dispatch('load', to);
    },
    toggleNav: function() {
      this.nav = !this.nav;
    },
    toggleDock: function() {
      this.dock = !this.dock;
    }
  }
});
</script>

<style lang="css" scoped>

#space {
  @apply flex items-stretch;
  height: 100vh;
}

</style>
