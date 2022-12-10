<template>
    <div
    class="bauble px-3 py-2 gap-3"
    :class="bauble.on ? 'bauble-on' : ''"
    :style="{
      left: `${left}px`,
      top: `${bauble.top - 4}px`,
    }"
    draggable="true"
      @dragstart="handleDragStart"
      @drag="handleDrag"
      @dragend="handleDragEnd"
  >
    <!-- Grip -->
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="var(--rlm-icon-color, #333333)"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5.83499 4.96497C6.5527 4.96497 7.13498 4.38268 7.13498 3.66498C7.13498 2.94728 6.5527 2.36499 5.83499 2.36499C5.11729 2.36499 4.535 2.94728 4.535 3.66498C4.535 4.38268 5.11729 4.96497 5.83499 4.96497ZM5.83499 9.29827C6.5527 9.29827 7.13498 8.71598 7.13498 7.99828C7.13498 7.28058 6.5527 6.69829 5.83499 6.69829C5.11729 6.69829 4.535 7.28058 4.535 7.99828C4.535 8.71598 5.11729 9.29827 5.83499 9.29827ZM7.13498 12.3316C7.13498 11.6139 6.5527 11.0316 5.83499 11.0316C5.11729 11.0316 4.535 11.6139 4.535 12.3316C4.535 13.0493 5.11729 13.6316 5.83499 13.6316C6.5527 13.6316 7.13498 13.0493 7.13498 12.3316ZM10.1683 4.96497C10.886 4.96497 11.4683 4.38268 11.4683 3.66498C11.4683 2.94728 10.886 2.36499 10.1683 2.36499C9.45059 2.36499 8.8683 2.94728 8.8683 3.66498C8.8683 4.38268 9.45059 4.96497 10.1683 4.96497ZM11.4683 7.99828C11.4683 7.28058 10.886 6.69829 10.1683 6.69829C9.45059 6.69829 8.8683 7.28058 8.8683 7.99828C8.8683 8.71598 9.45059 9.29827 10.1683 9.29827C10.886 9.29827 11.4683 8.71598 11.4683 7.99828ZM10.1683 13.6316C10.886 13.6316 11.4683 13.0493 11.4683 12.3316C11.4683 11.6139 10.886 11.0316 10.1683 11.0316C9.45059 11.0316 8.8683 11.6139 8.8683 12.3316C8.8683 13.0493 9.45059 13.6316 10.1683 13.6316Z"
      />
    </svg>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import type { Bauble as IBauble } from "./prosemirror/bauble";
import { view } from "./prosemirror/render"
import { dropPoint } from "prosemirror-transform";

export default defineComponent({
  name: "Bauble",
  props: {
    bauble: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      left: 0,
    }
  },
  created: function() {
    const prosemirror = document.querySelector(".ProseMirror");
    const parent = document.querySelector("#document");
    if(prosemirror && parent) this.left = prosemirror.getBoundingClientRect().left - parent.getBoundingClientRect().left + 36;
  },
  watch: {
    bauble: function() {
      const prosemirror = document.querySelector(".ProseMirror");
      const parent = document.querySelector("#document");
      if(prosemirror && parent) this.left = prosemirror.getBoundingClientRect().left - parent.getBoundingClientRect().left + 36;
    }
  },
  methods: {
    handleDragStart: function(event: DragEvent) {
      console.log("drag starting");
      (event as any).dataTransfer.setDragImage(this.bauble.el, 0, 0);
    },

  handleDrag: function(event: DragEvent) {
    //
  },
  handleDragEnd: function(event: DragEvent) {
    const cursor = view.posAtCoords({
      left: event.clientX,
      top: event.clientY,
    });
    console.log("cursor", cursor);
    if (cursor && cursor.pos != this.bauble.pos) {
      console.log("finding dropoint for: ", this.bauble.node, " @ ", cursor.pos)
      const target = dropPoint(
        view.state.doc,
        cursor.pos,
        this.bauble.node
      );
      console.log("drop point target", target);
      let inserted = false;
      let finalPos;
      let finalTr = null;
      view.state.doc.descendants((childNode, childPos, parentNode) => {
        if (!inserted && target && childPos >= target) {
          const tr = view.state.tr.insert(childPos, this.bauble.node);
          if (tr.docChanged) {
            inserted = true;
            view.dispatch(tr);
            finalPos = childPos;
            finalTr = tr;
          }
        }
        return false;
      });
      if (!inserted) {
        const tr = view.state.tr.insert(
          view.state.doc.nodeSize - 2,
          this.bauble.node
        );
        view.dispatch(tr);
        finalPos = view.state.doc.nodeSize - 1;
        finalTr = tr;
      }

      if (finalTr != null) {
        const prev = finalTr.mapping.map(this.bauble.pos);
        //const cleanup = props.view.state.tr.setSelection(new TextSelection(props.view.state.doc.resolve(prev + 1), props.view.state.doc.resolve(prev + props.menu.node.nodeSize - 1)))
        const cleanup = view.state.tr.deleteRange(
          prev,
          prev + this.bauble.node.nodeSize
        );
        view.dispatch(cleanup);
        //toggleMark(schema.marks["strong"])(props.view.state, props.view.dispatch, props.view)
      }
    }
  }
  }
});
</script>

<style lang="css" scoped>
.bauble {
  @apply flex;
  position: absolute;
  opacity: 0;
  z-index: 2;
  transition: opacity 80ms ease, top 80ms ease-out;
}

.bauble-on {
  opacity: 1;
  transition: opacity 80ms ease 120ms, top 80ms ease-out;
}
</style>
