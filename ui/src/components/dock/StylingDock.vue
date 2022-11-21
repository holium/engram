<template>
  <div class="flex flex-col gap-2">
    <!-- Typography -->
    <div class="px-3 py-2 heading-2 opacity-50">
      Typography
    </div>

    <div class="dock-item">
      <div class="dock-label flex-1">Font Size:</div>
      <div class="input flex-1">
        <input type="number" min="8" max="48" class="" v-model="mirror['root-size']"
          @blur="(event: any) => {
            changeStyle('root-size', `${parseInt(event.target.value) / 16}em`)
          }"
        />
        <div class="unit">px</div>
      </div>
      
    </div>
    <div class="dock-item">
      <div class="dock-label flex-1">Scale:</div>
      <div class="input flex-1">
        <input type="number" min="1" max="4" step=".01" v-model="mirror['ratio']"
          @blur="(event: any) => {
            changeStyle('ratio', `${Math.pow(parseFloat(event.target.value), 1 / 3)}`)
          }"
        />
        <div class="unit">
          x
        </div>
      </div>
    </div>

    <div class="dock-item">
      <div class="dock-label flex-1">Body Font Family:</div>
      <div class="input flex-1">
        <select v-model="mirror['body-font-family']"
          @change="(event: any) => {
            changeStyle('body-font-family', `${event.target.value}`)
          }"
        >
          <option value="Rubik">sans-serif</option>
          <option value="serif">serif</option>
          <option value="monospace">monospace</option>
        </select>
      </div>
    </div>
    <div class="dock-item">
      <div class="dock-label flex-1">Heading Font Family:</div>
      <div class="input flex-1">
        <select v-model="mirror['heading-font-family']"
          @change="(event: any) => {
            changeStyle('heading-font-family', `${event.target.value}`)
          }"
        >
          <option value="Rubik">sans-serif</option>
          <option value="serif">serif</option>
          <option value="monospace">monospace</option>
        </select>
      </div>
    </div>
    <div class="dock-item">
      <div class="dock-label flex-1">Heading Weight:</div>
      <div class="input flex-1">
        <input type="number" min="200" max="900" v-model="mirror['heading-weight']"
          @blur="(event: any) => {
            changeStyle('heading-weight', `${parseInt(event.target.value)}`)
          }"
        />
      </div>
      
    </div>

    <div class="px-3 py-2 heading-2 opacity-50">
      Document Structure
    </div>

    <!-- Document -->
    <div class="dock-item">
      <div class="dock-label flex-1">Width:</div>
      <div class="input flex-1">
        <input type="number" min="40" max="120" v-model="mirror['document-width']"
          @blur="(event: any) => {
            changeStyle('document-width', `${event.target.value}ch`)
          }"
        />
        <div class="unit">
          ch
        </div>
      </div>
    </div>
    <div class="dock-item">
      <div class="dock-label flex-1">Margin:</div>
      <div class="input flex-1">
        <input type="number" min="0" max="8" v-model="mirror['document-margin']"
          @blur="(event: any) => {
            changeStyle('document-margin', `${event.target.value}rem`)
          }"
        />
        <div class="unit">
          em
        </div>
      </div>
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
      } as any
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

.input {
  width: calc(6 * 16px);
}

</style>
