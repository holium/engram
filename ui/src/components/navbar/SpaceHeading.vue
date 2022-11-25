<template>
  <div class="relative flex flex-col">
    <div class="flex gap-3 px-3 py-2" @click="openSelection">
      <div class="rounded-2" :style="{ width: '32px', height: '32px', 'background-color': space.color }">

      </div>
      <div class="">
        {{ space.name }}
      </div>

    </div>

    <!-- Select -->
    <div 
      class="flex flex-col border-t border-border outline-none" 
      :style="{top: '100%', width: '100%', display: expand ? 'flex' : 'none'}" 
      ref="select-space" 
      @blur="() => { expand = false }" 
      tabindex="0"
    >
      <div 
        class="flex gap-3 px-3 py-2" 
        :key="option.path" 
        v-for="option in spaces.filter(option => true || option.path != space.path)" 
        @click="() => { openSpace(option.path) }"
      >
        <div class="rounded-2" :style="{ width: '32px', height: '32px', 'background-color': option.color }">

        </div>
        <div class="">
          {{ option.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import store from "@/store/index";
import type { Space } from "@/store/types"

export default defineComponent({
  name: "SpaceHeading",
  data() {
    return {
      expand: false,
      space: { path: "", name: "", color: "" } as Space,
      spaces: [] as Array<Space>,
    }
  },
  created: function() {
    this.gatherall();
    this.loadSpaces(this.$route);
  },
  onRouteUpdate: function(to: any) {
    this.loadSpaces(to);
  },
  methods: {
    openSelection: function() {
      if(this.expand) {
        this.expand = false;
      } else {
        this.expand = true;
        setTimeout(() => {
          (this.$refs["select-space"] as any).focus();
        }, 10);

      }
    },
    openSpace: function(path: string) {
      this.$router.push(`apps/engram${path}`);
      this.expand = false;
    },
    loadSpaces: async function(route: any) {
      const path = route.query.spaceId;
      if(path == "/null/space") {
        this.space = { path: "", name: (window as any).ship, color: "#262626"}
        this.spaces = [];
      } else {
        const spaceRes = await store.getters["space"](path);
        this.space = {
          path: path,
          name: spaceRes.name,
          color: spaceRes.color,
        } as Space;

        const spacesRes = await store.getters["spaces"];
        this.spaces = Object.keys(spacesRes).map((space) => {
          return {
            path: space,
            name: spacesRes[space].name,
            color: spacesRes[space].color
          }
        })
      }
    },
    gatherall: function() {
      if(this.$route.query.spaceId != "/null/space") {
        (window as any).urbit.poke({ 
          app: "engram", 
          mark: "post",
          json: {
            space: {
              gatherall: {
                space: this.$route.query.spaceId
              }
            }
          }
        })
      }
    }
  }
});
</script>

<style lang="css" scoped>
</style>
