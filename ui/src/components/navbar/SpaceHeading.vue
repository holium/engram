<template>
  <div class="relative flex flex-col">
    <div class="flex gap-4" @click="openSelection">
      <div 
        class="rounded-2" 
        :style="{ 
          width: '40px', 
          height: '40px', 
          'min-width': '40px', 
          'min-height': '40px',
          'background-size': 'cover',
          'background-repeat': 'norepeat',
          'background-position': 'center',
          ...(space.picture.length > 0 ? { 'background-image': `url(${space.picture})` } : { 'background-color': space.color })
        }"
      >

      </div>
      <div class="flex flex-col gap-2 flex-1 overflow-hidden">
        <div class="heading-1 overflow-hidden overflow-ellipsis whitespace-nowrap">
          {{ space.name }}
        </div>
        <div class="opacity-60 text-sm font-azimuth overflow-hidden overflow-ellipsis whitespace-nowrap">
          ~{{ ship }}
        </div>
      </div>
      <!-- Sharing -->
      <svg
        class="icon clickable"
        viewBox="0 0 16 16"
        fill="rgba(var(--rlm-icon-rgba, 51, 51, 51, .7))"
        xmlns="http://www.w3.org/2000/svg"
        @click="openSettings"
      >
        <g clip-path="url(#clip0_527_14779)">
          <path
            d="M11.6667 15H10.3333V13.6667C10.3333 13.1362 10.1226 12.6275 9.74755 12.2525C9.37247 11.8774 8.86377 11.6667 8.33333 11.6667H4.33333C3.8029 11.6667 3.29419 11.8774 2.91912 12.2525C2.54405 12.6275 2.33333 13.1362 2.33333 13.6667V15H1V13.6667C1 12.7826 1.35119 11.9348 1.97631 11.3096C2.60143 10.6845 3.44928 10.3333 4.33333 10.3333H8.33333C9.21739 10.3333 10.0652 10.6845 10.6904 11.3096C11.3155 11.9348 11.6667 12.7826 11.6667 13.6667V15ZM6.33333 9C5.80805 9 5.2879 8.89654 4.8026 8.69552C4.3173 8.4945 3.87634 8.19986 3.50491 7.82843C3.13347 7.45699 2.83883 7.01604 2.63782 6.53073C2.4368 6.04543 2.33333 5.52529 2.33333 5C2.33333 4.47471 2.4368 3.95457 2.63782 3.46927C2.83883 2.98396 3.13347 2.54301 3.50491 2.17157C3.87634 1.80014 4.3173 1.5055 4.8026 1.30448C5.2879 1.10346 5.80805 1 6.33333 1C7.3942 1 8.41162 1.42143 9.16176 2.17157C9.91191 2.92172 10.3333 3.93913 10.3333 5C10.3333 6.06087 9.91191 7.07828 9.16176 7.82843C8.41162 8.57857 7.3942 9 6.33333 9ZM6.33333 7.66667C7.04058 7.66667 7.71885 7.38572 8.21895 6.88562C8.71905 6.38552 9 5.70724 9 5C9 4.29276 8.71905 3.61448 8.21895 3.11438C7.71885 2.61428 7.04058 2.33333 6.33333 2.33333C5.62609 2.33333 4.94781 2.61428 4.44772 3.11438C3.94762 3.61448 3.66667 4.29276 3.66667 5C3.66667 5.70724 3.94762 6.38552 4.44772 6.88562C4.94781 7.38572 5.62609 7.66667 6.33333 7.66667Z"
          />
          <path
            d="M15 15H13.8V13.8C13.8 13.3226 13.6104 12.8648 13.2728 12.5272C12.9895 12.244 12.6216 12.0649 12.2284 12.0146C12.0825 11.7589 11.9022 11.5215 11.6903 11.3097C11.4921 11.1114 11.2714 10.9407 11.0343 10.8H12C12.7956 10.8 13.5587 11.1161 14.1213 11.6787C14.6839 12.2413 15 13.0044 15 13.8V15Z"
          />
          <path
            d="M10.2 9.60002C9.72724 9.60002 9.25911 9.5069 8.82233 9.32599C8.56709 9.22026 8.32548 9.08576 8.10202 8.92551C8.62725 8.82265 9.12673 8.61533 9.57044 8.31599C9.77391 8.3713 9.98547 8.40002 10.2 8.40002C10.8365 8.40002 11.447 8.14716 11.8971 7.69708C12.3471 7.24699 12.6 6.63654 12.6 6.00002C12.6 5.3635 12.3471 4.75305 11.8971 4.30296C11.6796 4.08549 11.4247 3.91407 11.1475 3.79496C10.9871 3.28738 10.7261 2.81389 10.3767 2.40436C11.2672 2.44809 12.1122 2.82108 12.7456 3.45444C13.4207 4.12957 13.8 5.04524 13.8 6.00002C13.8 6.9548 13.4207 7.87047 12.7456 8.54561C12.0704 9.22074 11.1548 9.60002 10.2 9.60002Z"
          />
        </g>
        <defs>
          <clipPath id="clip0_527_14779">
            <rect width="16" height="16" fill="white"/>
          </clipPath>
        </defs>
      </svg>

    </div>

    <!-- Select -->
    <div 
      class="flex flex-col outline-none bg-window relative overflow-auto scrollbar-small"
      :style="{width: '100%', display: expand ? 'flex' : 'none', left: '-8px', 'max-height': '40vh'}" 
      ref="select-space" 
      @blur="() => { expand = false }" 
      tabindex="0"
    >
      <div 
        class="flex gap-4 px-3 py-2 cursor-pointer" 
        :key="option.path" 
          v-for="option in spaces.filter(option => true || option.path != space.path)" 
          @click="() => { openSpace(option.path) }"
      >
        <div 
          class="rounded-2" 
          :style="{ 
            width: '40px', 
            height: '40px', 
            'background-size': 'cover',
            'background-repeat': 'norepeat',
            'background-position': 'center',
            ...(option.picture.length > 0 ? { 'background-image': `url(${option.picture})` } : { 'background-color': option.color })
          }"
        >

        </div>
        <div class="flex flex-col gap-2 overflow-hidden flex-1">
          <div class="heading-1 whitespace-nowrap overflow-ellipsis overflow-hidden">
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
import type { Space } from "@/store/space"

export default defineComponent({
  name: "SpaceHeading",
  inject: ["pushSpaceDock"],
  data() {
    return {
      expand: false,
      spaces: [] as Array<Space>,
      ship: "~dev",
    }
  },
  created: function() {
    this.ship = (window as any).ship;
    this.loadSpaces();
  },
  computed: {
    space: function(): Space {
      return store.getters['space/get'];
    },
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
    openSettings: function(event: MouseEvent) {
      event.stopPropagation();
      (this as any).pushSpaceDock();
    },
    openSpace: function(path: string) {
      this.$router.push(`/apps/engram/?spaceId=${path}`);
      this.expand = false;
    },
    loadSpaces: async function() {
      const spacesRes = await store.getters["spaces"];
      this.spaces = Object.keys(spacesRes).map((space) => {
        return { path: space, ...(spacesRes[space]) } as Space;
      })
    },
  }
});
</script>

<style lang="css" scoped>
</style>
