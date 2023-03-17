<template>
<div class="flex justify-center items-center flex-grow">
    <div class="flex items-stretch text-body">
    <div class="nav" :style="{width: `240px`}">
      <div class="relative flex flex-col">
        <div class="flex gap-4">
          <div class="rounded-2 flex-grow" :style="{
            'background-color': '#000000',
            'height': '40px'
          }">
          </div>
        </div>
      </div>
      <div class="input relative">
        <div class="min-w-0 flex-1" style="background-color: #000000">

        </div>
      </div>
      <div class="flex-grow">
        <div class="flex flex-col gap-2">
        <div class="px-3 py-2 flex items-center" id="workspace-heading">
            <div class="flex-grow heading-1 opacity-0">
                workspace
            </div>         
        </div>
        <div class="flex flex-col gap-2">
          <div class="flex py-1 items-center gap-2">
              <div class="flex-1 text-sm px-2 py-2 rounded-2" style="background-color: #000000; height: 29px"> </div>
          </div>
          <div class="flex py-1 items-center gap-2">
              <div class="flex-1 text-sm px-2 py-2 rounded-2" style="background-color: #000000; height: 29px"> </div>
          </div>
          <div class="flex py-1 items-center gap-2">
              <div class="flex-1 text-sm px-2 py-2 rounded-2" style="background-color: #000000; height: 29px"> </div>
          </div>
          <div class="flex py-1 items-center gap-2">
              <div class="flex-1 text-sm px-2 py-2 rounded-2" style="background-color: #000000; height: 29px"> </div>
          </div>
        </div>
    </div>
      </div>
      
    </div>
    <div class="dock-grip">

    </div>
  </div>
  <!-- <router-view class="flex-grow" v-if="!loading"></router-view> -->
</div>
</template>

<style>
.nav {
  @apply flex flex-col p-4 gap-4;
  min-width: 180px;
  max-width: 24vw;
  transition: max-width 200ms ease, padding 200ms ease;
}
</style>