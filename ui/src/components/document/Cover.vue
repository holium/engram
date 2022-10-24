<template>
  <div class="relative cover" @drop="handleDrop">
    <img class="cover-image" :src="cover.src" alt="" :style="{ 'object-position': `${xpositioning}% ${ypositioning}%`}">
    <div class="image-toolbar rounded-2" :style="changingCover ? { opacity: '1' } : {}">
      <div class="bg-paper px-3 py-2 cursor-pointer" @click="() => { changingCover = true }" v-if="!changingCover">
        {{ cover.src == "" ? "add cover" : "change cover" }}
      </div>
      <input class="bg-paper px-3 py-2" style="width: 480px" v-model="newSrc" @drop="handleDrop" @keydown="handleKeys" v-if="changingCover" placeholder="Type the image URL or drop one from your machine"/>
      <div class="bg-paper px-3 py-2 cursor-grab" draggable="true" @dragstart="handleDragStart" @drag="handleDrag">
        reposition
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import { view } from "./prosemirror/render";
import { setCover, handleImageDrop } from "./prosemirror/commands"
import type { Cover as ICover } from "./prosemirror/cover"

export default defineComponent({
  name: "Cover",
  props: {
    cover: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      // positioning
      xpositioning: 50,
      ypositioning: 50,

      // change cover
      changingCover: false,
      newSrc: "",

      // dragging
      dragStartX: 0,
      dragStartY: 0,
      dragActiveX: 0,
      dragActiveY: 0,
    }
  },
  watch: {
    cover: function(newCover: ICover) {
      this.xpositioning = newCover.xpositioning;
      this.ypositioning = newCover.ypositioning;
    }
  },
  methods: {
    // prosemirror interactions
    changeCover: function(newSrc: string) {
      console.log("changing cover", newSrc);
      setCover({ ...this.cover, src: newSrc})(view.state, view.dispatch);
    },
    changePositioning: function() {
      console.log("changing positioning", view);
      setCover({ ...this.cover, xpositioning: this.xpositioning, ypositioning: this.ypositioning})(view.state, view.dispatch);
    },

    // ux
    handleKeys: function(event: KeyboardEvent) {
      if(event.key == "Escape") {
        this.changingCover = false;
        this.newSrc = "";
      } else if(event.key == "Enter") {
        this.changingCover = false;
        this.changeCover(this.newSrc);
        this.newSrc = "";
      }
    },
    handleDragStart: function(event) {
      this.dragStartX = event.clientX;
      this.dragStartY = event.clientY;
      event.preventDefault();
      document.addEventListener("mousemove", this.handleDrag);
      const cleanup = () => {
        this.changePositioning();
        document.removeEventListener("mouseup", cleanup);
        document.removeEventListener("mousemove", this.handleDrag);
      };
      document.addEventListener("mouseup", cleanup);
    },
    handleDrag: function(event: MouseEvent) {
      this.dragActiveX = event.clientX;
      this.dragActiveY = event.clientY;
      const newX = this.cover.xpositioning - (this.dragActiveX - this.dragStartX) / 2;
      this.xpositioning = newX < 0 ? 0 : newX > 100 ? 100 : newX;
      const newY = this.cover.ypositioning - (this.dragActiveY - this.dragStartY) / 2;
      this.ypositioning = newY < 0 ? 0 : newY > 100 ? 100 : newY;
    },
    handleDrop: function(event: DragEvent) {
      console.log("handling drop: ", event);
      event.preventDefault();
      event.stopPropagation();
      handleImageDrop(event).then((image: string) => {
        this.changeCover(image);
        this.changingCover = false;
      }).catch(() => {
        // do nothing
      })
    }
  },
});
</script>

<style lang="css" scoped>

.cover {
  position: absolute;
  top: 0;
  left: 0;
  height: 30vh;
  width: 100%;
  margin-bottom: calc(-2 * var(--document-margin));
  opacity: 1;
}

.cover-image {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  object-fit: cover;
  opacity: 1;
}

.cover-image[src=""] {
  margin: 0;
  opacity: 0;
}

.image-toolbar {
  @apply absolute top-3 right-4 bg-border gap-1 flex;
  overflow: hidden;
  z-index: 2;
  opacity: 0;
  transition: opacity 80ms ease;
}

.cover:hover .image-toolbar {
  opacity: 1;
}

</style>
