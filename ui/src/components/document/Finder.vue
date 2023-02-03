<template>
    <div class="search-bar input" :style="show ? { 'top': 'calc(1.25rem + 32px)'} : {}">
        <input 
          :disabled="!show"
          ref="finder"
          type="text" 
          placeholder="find in document..." 
          v-model="search"
          @keydown="handleFinderKey"
        />
        <svg 
          @click="handleFinderDown"
          viewBox="0 0 16 16" 
          fill="var(--rlm-icon-color, #333333)"
          xmlns="http://www.w3.org/2000/svg"
          class="icon clickable"
          style="transform: rotate(90deg);"
        >
          <path d="M6 3.99995L9.99998 7.99245L5.99997 11.9999C5.49995 12.4999 6.07812 13.2999 6.70718 12.6712L10.7072 8.69933C11.0978 8.3087 11.0978 7.67589 10.7072 7.28527L6.70718 3.31341C6.07812 2.65716 5.5 3.50005 6 3.99995Z" fill="#333333"/>
        </svg>
        <svg 
          @click="handleFinderUp"
          viewBox="0 0 16 16" 
          fill="var(--rlm-icon-color, #333333)"
          xmlns="http://www.w3.org/2000/svg"
          class="icon clickable"
          style="transform: rotate(-90deg);"
        >
          <path d="M6 3.99995L9.99998 7.99245L5.99997 11.9999C5.49995 12.4999 6.07812 13.2999 6.70718 12.6712L10.7072 8.69933C11.0978 8.3087 11.0978 7.67589 10.7072 7.28527L6.70718 3.31341C6.07812 2.65716 5.5 3.50005 6 3.99995Z" fill="#333333"/>
        </svg>
      </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
    name: "Finder",
    props: {
        show: {
            type: Boolean,
            required: true,
        },
        querier: {
            type: Function,
            required: true,
        }
    },
    data() {
        return {
            search: "",
            foundNodes: [] as any,
            foundIndex: 0,
        }
    },
    watch: {
        show: function(newvalue: boolean) {
            console.log("show is changing!", newvalue);
            if(newvalue) {
                this.querier(this.search);
                setTimeout(() => {
                    (this.$refs['finder'] as any).focus();
                }, 80);
            } else {
                this.search = "";
                this.foundNodes = [];
                this.foundIndex = 0;
            }
        },
        search: function(nowFinding: string) {
            if(this.querier !== null) {
                this.querier(nowFinding);
                this.foundNodes = document.querySelector(".ProseMirror")?.querySelectorAll(".found-text");
                this.foundIndex = this.foundIndex % this.foundNodes.length;
            }
        }
    },
    methods: {
        handleFinderKey: function(event: KeyboardEvent) {
            if(event.key == "Escape") this.close();
            else if(event.key == "Enter" && event.shiftKey) this.handleFinderUp();
            else if(event.key == "Enter") this.handleFinderDown();
        },
        handleFinderUp: function() {
            this.foundIndex = (this.foundIndex == 0 ? this.foundNodes.length : this.foundIndex) - 1;
            this.foundNodes[this.foundIndex].scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
        },
        handleFinderDown: function() {
            this.foundIndex = (this.foundIndex + 1) % this.foundNodes.length;
            this.foundNodes[this.foundIndex].scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
        },
        close: function() {
            this.$emit("close");
        }
    }
})
</script>

<style>
.search-bar {
  @apply bg-paper rounded-2 gap-2;
  position: absolute;
  z-index: 2;
  left: 50%;
  transform: translate(-50%);
  top: calc(-1.68rem - 16px);
  transition: top 200ms ease;
}
</style>