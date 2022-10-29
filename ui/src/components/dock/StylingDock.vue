<template>
  <div class="flex flex-col">
    <!-- Typography -->
    <div class="px-3 py-2 heading">
      typography
    </div>

    <div class="px-3 flex gap-3">
      <div class="dock-label">Font Size:</div>
      <input type="number" min="8" max="48" class="px-3 py-2 bg-window flex-1 min-w-0 outline-none" v-model="mirror['root-size']"
        @blur="(event) => {
          changeStyle('root-size', `${parseInt(event.target.value) / 16}em`)
        }"
      />
    </div>
    <div class="px-3 flex gap-3">
      <div class="dock-label">Scale:</div>
      <input type="number" min="1" max="4" step=".01" class="px-3 py-2 bg-window flex-1 min-w-0 outline-none" v-model="mirror['ratio']"
        @blur="(event) => {
          changeStyle('ratio', `${Math.pow(parseFloat(event.target.value), 1 / 3)}`)
        }"
      />
    </div>

    <div class="px-3 flex gap-3">
      <div class="dock-label">Body Font Family:</div>
      <select class="px-3 py-2 bg-window flex-1 min-w-0 outline-none mr-3" v-model="mirror['body-font-family']"
        @change="(event) => {
          changeStyle('body-font-family', `${event.target.value}`)
        }"
      >
        <option value="Rubik">sans-serif</option>
        <option value="serif">serif</option>
        <option value="monospace">monospace</option>
      </select>
    </div>
    <div class="px-3 flex gap-3">
      <div class="dock-label">Heading Font Family:</div>
      <select class="px-3 py-2 bg-window flex-1 min-w-0 outline-none mr-3" v-model="mirror['heading-font-family']"
        @change="(event) => {
          changeStyle('heading-font-family', `${event.target.value}`)
        }"
      >
        <option value="Rubik">sans-serif</option>
        <option value="serif">serif</option>
        <option value="monospace">monospace</option>
      </select>
    </div>
    <div class="px-3 flex gap-3">
      <div class="dock-label">Heading Weight:</div>
      <input type="number" min="200" max="900" class="px-3 py-2 bg-window flex-1 min-w-0 outline-none" v-model="mirror['heading-weight']"
        @blur="(event) => {
          changeStyle('heading-weight', `${parseInt(event.target.value)}`)
        }"
      />
    </div>

    <div class="px-3 py-2 heading">
      document structure
    </div>

    <!-- Document -->
    <div class="px-3 flex gap-3">
      <div class="dock-label">Width:</div>
      <input type="number" min="40" max="120" class="px-3 py-2 bg-window flex-1 min-w-0 outline-none" v-model="mirror['document-width']"
        @blur="(event) => {
          changeStyle('document-width', `${event.target.value}ch`)
        }"
      />
    </div>
    <div class="px-3 flex gap-3">
      <div class="dock-label">Margin:</div>
      <input type="number" min="0" max="8" class="px-3 py-2 bg-window flex-1 min-w-0 outline-none" v-model="mirror['document-margin']"
        @blur="(event) => {
          changeStyle('document-margin', `${event.target.value}rem`)
        }"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import type { Styling } from "../document/prosemirror/styling"
import { setProperty } from "../document/prosemirror/commands"
import { view } from "../document/prosemirror/render";

export default defineComponent({
  name: "StylingDock",
  props: {
    styling: {
      type: Object,
      required: true,
    }
  },
  watch: {
    styling: function(newStyling: Styling) {
      console.log("2em".match(/\d+/));
      this.mirror = {
        "root-size": newStyling["root-size"].value == null ? 16 : parseInt(newStyling["root-size"].value.match(/\d+em/)[0]) * 16,
        "ratio": newStyling["ratio"].value == null ? 2 : Math.pow(parseInt(newStyling["ratio"].value), 3),

        "body-font-family": newStyling["body-font-family"].value == null ? "Rubik" : newStyling["body-font-family"].value,
        "heading-font-family": newStyling["heading-font-family"].value == null ? "Rubik" : newStyling["heading-font-family"].value,
        "heading-weight": newStyling["heading-weight"].value == null ? 800 : parseInt(newStyling["heading-weight"].value),

        "document-width": newStyling["document-width"].value == null ? 60 : parseInt(newStyling["document-width"].value.match(/\d+ch/)[0]),
        "document-margin": newStyling["document-margin"].value == null ? 4 : parseInt(newStyling["document-margin"].value.match(/\d+rem/)[0]),
      };
    },
  },
  data() {
    return {
      mirror: {
        "root-size": null,
        "ratio": null,

        "body-font-family": null,
        "heading-font-family": null,
        "heading-weight": null,

        "document-width": null,
        "document-margin": null,
      }
    }
  },
  methods: {
    changeStyle: function(key: string, value: string) {
      console.log("changing style: ", key);
      (document.querySelector(":root") as any).style.setProperty(`---${key}`, value);
      setProperty(this.styling[key].pos, key, value)(view.state, view.dispatch);
    }
  }
});
</script>

<style lang="css" scoped>

</style>
