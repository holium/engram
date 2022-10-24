<template>
  <div class="flex items-stretch text-body">
    <div class="dock-grip">

    </div>
    <div id="dock">
      <div class="toolbar">
        <div class="">
          styling
        </div>
      </div>

      <StylingDock :styling="styling" v-if="open == 'styling'" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import StylingDock from "./StylingDock.vue"
export default defineComponent({
  name: "Dock",
  components: {
    StylingDock
  },
  props: {
    styling: {
      type: Object,
      required: true,
    }
  },
  data() {
    return {
      open: "styling" as "styling"
    }
  }
});
</script>

<style lang="css" scoped>

#dock {
  @apply flex flex-col;
  min-width: 180px;
}

</style>
