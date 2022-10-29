<template>
  <div class="relative cursor-pointer" :style="{width: '36px', height: '16px'}" @click="() => { onChange(!value) }">
    <div class="rounded-2 absolute toggle-slider" :class="{'bg-accent': value, 'bg-border': !value}" :style="{ left: '6px', top: '4px', width: '24px', height: '8px'}">

    </div>
    <div class="rounded-full bg-type absolute toggle-button" :style="{ width: '16px', height: '16px', ...(value ? { left: '24px' } : { left: '0px' })}">
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
export default defineComponent({
  name: "Toggle",
  props: {
    value: {
      type: Boolean,
      required: true,
    }
  },
  methods: {
    onChange: function(v: boolean) {
      this.$emit("change", v);
    }
  }
})
</script>

<style lang="css" scoped>

.toggle-button {
  transition: left 80ms ease;
}

.toggle-slider {
  transition: background-color 80ms ease;
}

</style>
