<template>
  <div class="relative flex flex-col">
    <div class="flex gap-4" @click="openSelection">
      <div class="rounded-2" :style="{ width: '40px', height: '40px', 'background-color': space.color }">

      </div>
      <div class="flex flex-col gap-2">
        <div class="heading-1">
          {{ space.path }}
        </div>
        <div class="opacity-60 text-sm font-azimuth">
          ~{{ ship }}
        </div>
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
        class="flex gap-4 px-3 py-2" 
        :key="option.path" 
          v-for="option in spaces.filter(option => true || option.path != space.path)" 
          @click="() => { openSpace(option.path) }"
      >
        <div class="rounded-2" :style="{ width: '40px', height: '40px', 'background-color': option.color }">

        </div>
        <div class="flex flex-col gap-2">
          <div class="heading-1">
            {{ option.name }}
          </div>
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
      spaces: [] as Array<Space>,
      ship: "~dev",
    }
  },
  created: function() {
    store.dispatch("space/load", this.$route);
    this.ship = (window as any).ship;
    this.gatherall();
    this.loadSpaces(this.$route);
  },
  onRouteUpdate: function(to: any) {
    store.dispatch("space/load", to);
  },
  computed: {
    space: function(): Space {
      return store.getters['space/get'];
    }
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
      const spacesRes = await store.getters["spaces"];
      this.spaces = Object.keys(spacesRes).map((space) => {
        return { path: space, ...spacesRes } as Space;
      })
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
        setTimeout(() => {
          store.dispatch("load", this.$route.query.spaceId as string);
        }, 2000);
      }
    }
  }
});
</script>

<style lang="css" scoped>
</style>
