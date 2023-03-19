<template>
<div class="flex justify-center items-stretch flex-grow">
  <div class="flex items-stretch text-body">
    <div class="nav" :style="{width: `240px`}">
      <div class="relative flex flex-col">
        <div class="flex gap-4">
          <div class="rounded-2 flex-grow skeleton" :style="{
            'height': '40px'
          }">
          </div>
        </div>
      </div>
      <div class="input relative skeleton">
        <div class="min-w-0 flex-1">
          search
        </div>
      </div>
      <div class="flex-grow">
        <div class="flex flex-col gap-2">
        <div class="px-3 py-2 flex items-center" id="workspace-heading">
            <div class="flex-grow heading-1 opacity-0" style="user-select: none">
                workspace
            </div>         
        </div>
        <div class="flex flex-col gap-2">
          <div class="flex py-1 items-center gap-2">
              <div class="flex-1 text-sm px-2 py-2 rounded-2 skeleton">item</div>
          </div>
          <div class="flex py-1 items-center gap-2">
              <div class="flex-1 text-sm px-2 py-2 rounded-2 skeleton">item</div>
          </div>
          <div class="flex py-1 items-center gap-2">
              <div class="flex-1 text-sm px-2 py-2 rounded-2 skeleton">item</div>
          </div>
          <div class="flex py-1 items-center gap-2">
              <div class="flex-1 text-sm px-2 py-2 rounded-2 skeleton">item</div>
          </div>
        </div>
    </div>
      </div>
      
    </div>
    <div class="dock-grip">

    </div>
  </div>
  <div class="flex flex-row items-stretch overflow-hidden flex-grow">
    <div class="flex flex-col flex-grow relative" style="width: 100%">
      <div class="toolbar" id="toolbar">
        <div class="flex flex-grow px-3 gap-2 items-center">
          <div class="rounded-2 skeleton" style="width: 180px">id</div>
          <div style="opacity: 0">
            :
          </div>
          <div class="flex-grow rounded-2 skeleton">title</div>
        </div>
      </div>
      <DocumentSkeleton />
    </div>
  </div>
</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import DocumentSkeleton from "./DocumentSkeleton.vue"

export default defineComponent({
  name: "SpaceSkeleton",
  components: {
    DocumentSkeleton
  }
})
</script>

<style scoped>

.nav {
  @apply flex flex-col p-4 gap-4;
  min-width: 180px;
  max-width: 24vw;
  transition: max-width 200ms ease, padding 200ms ease;
}

#toolbar {
  @apply bg-window;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 3;
}

.skeleton {
  background-color: #000000;
  color: #000000;
  user-select: none;
  animation: blinker 1s linear infinite;
}

@keyframes blinker {
  0% {
    opacity: 20%;
  }
  50% {
    opacity: 0%;
  }
  100% {
    opacity: 20%;
  }
}


</style>