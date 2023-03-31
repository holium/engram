<template>
    <div class="relative cover opacity-0">
        <img class="cover-image" src="">
        <div class="image-toolbar rounded-2">
          <div class="bg-paper px-3 py-2 cursor-pointer">
            add cover
          </div>
          <div class="bg-paper px-3 py-2 cursor-grab">
            reposition
          </div>
        </div>
      </div>
      <div class="relative items-center scrollbar-small flex-grow flex flex-col" id="skeleton-main">
        <div id="document" ref="document">
          <div class="ProseMirror">
            <header class="">
              <h1 class="rounded-2 skeleton">Header</h1>
            </header>
            <p class="rounded-2 skeleton">paragraph</p>
            <p class="rounded-2 skeleton">paragraph paragraph paragraph paragraph paragraph paragraph paragraph paragraph paragraph paragraph paragraph paragraph paragraph paragraph paragraph paragraph paragraph paragraph paragraph paragraph</p>
          </div>
        </div>
      </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    name: "DocumentSkeleton"
})

</script>

<style scoped>

.skeleton {
  background-color: var(--rlm-icon-color, #333333);
  color: var(--rlm-icon-color, #333333);
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

.skeleton::before {
  content: "" !important;
}

header::before {
  content: "" !important;
}

#skeleton-main {
  @apply relative overflow-auto;
  padding-top: calc(1.25rem + 16px);
}

#document {
  @apply flex flex-col flex-grow items-center overflow-hidden relative;
  width: 100%;
  min-height: calc(100% - calc(1.25em + 32px));
  z-index: 1;
}

.ProseMirror {
  animation: blinker 1s linear infinite;
}
</style>