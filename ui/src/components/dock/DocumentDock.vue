<template>
  <div class="flex items-stretch text-body">
    <div class="dock-grip" draggable="true" @dragstart="handleDragStart">

    </div>
    <div id="dock" :style="{width: `${dockWidth}px`}">
      <div class="toolbar">
          <div class="heading-1 flex-grow">
            Document Settings
          </div>
          <!-- Sharing -->
          <svg
            class="icon clickable"
            viewBox="0 0 16 16"
            fill="rgba(var(--rlm-icon-rgba, 51, 51, 51, .7))"
            xmlns="http://www.w3.org/2000/svg"
            @click="() => {
              open = 'sharing'
            }"
          >
            <g clip-path="url(#clip0_527_14779)">
              <path
                d="M11.6667 15H10.3333V13.6667C10.3333 13.1362 10.1226 12.6275 9.74755 12.2525C9.37247 11.8774 8.86377 11.6667 8.33333 11.6667H4.33333C3.8029 11.6667 3.29419 11.8774 2.91912 12.2525C2.54405 12.6275 2.33333 13.1362 2.33333 13.6667V15H1V13.6667C1 12.7826 1.35119 11.9348 1.97631 11.3096C2.60143 10.6845 3.44928 10.3333 4.33333 10.3333H8.33333C9.21739 10.3333 10.0652 10.6845 10.6904 11.3096C11.3155 11.9348 11.6667 12.7826 11.6667 13.6667V15ZM6.33333 9C5.80805 9 5.2879 8.89654 4.8026 8.69552C4.3173 8.4945 3.87634 8.19986 3.50491 7.82843C3.13347 7.45699 2.83883 7.01604 2.63782 6.53073C2.4368 6.04543 2.33333 5.52529 2.33333 5C2.33333 4.47471 2.4368 3.95457 2.63782 3.46927C2.83883 2.98396 3.13347 2.54301 3.50491 2.17157C3.87634 1.80014 4.3173 1.5055 4.8026 1.30448C5.2879 1.10346 5.80805 1 6.33333 1C7.3942 1 8.41162 1.42143 9.16176 2.17157C9.91191 2.92172 10.3333 3.93913 10.3333 5C10.3333 6.06087 9.91191 7.07828 9.16176 7.82843C8.41162 8.57857 7.3942 9 6.33333 9ZM6.33333 7.66667C7.04058 7.66667 7.71885 7.38572 8.21895 6.88562C8.71905 6.38552 9 5.70724 9 5C9 4.29276 8.71905 3.61448 8.21895 3.11438C7.71885 2.61428 7.04058 2.33333 6.33333 2.33333C5.62609 2.33333 4.94781 2.61428 4.44772 3.11438C3.94762 3.61448 3.66667 4.29276 3.66667 5C3.66667 5.70724 3.94762 6.38552 4.44772 6.88562C4.94781 7.38572 5.62609 7.66667 6.33333 7.66667Z"
              />
              <path
                d="M15 15H13.8V13.8C13.8 13.3226 13.6104 12.8648 13.2728 12.5272C12.9895 12.244 12.6216 12.0649 12.2284 12.0146C12.0825 11.7589 11.9022 11.5215 11.6903 11.3097C11.4921 11.1114 11.2714 10.9407 11.0343 10.8H12C12.7956 10.8 13.5587 11.1161 14.1213 11.6787C14.6839 12.2413 15 13.0044 15 13.8V15Z"
              />
              <path
                d="M10.2 9.60002C9.72724 9.60002 9.25911 9.5069 8.82233 9.32599C8.56709 9.22026 8.32548 9.08576 8.10202 8.92551C8.62725 8.82265 9.12673 8.61533 9.57044 8.31599C9.77391 8.3713 9.98547 8.40002 10.2 8.40002C10.8365 8.40002 11.447 8.14716 11.8971 7.69708C12.3471 7.24699 12.6 6.63654 12.6 6.00002C12.6 5.3635 12.3471 4.75305 11.8971 4.30296C11.6796 4.08549 11.4247 3.91407 11.1475 3.79496C10.9871 3.28738 10.7261 2.81389 10.3767 2.40436C11.2672 2.44809 12.1122 2.82108 12.7456 3.45444C13.4207 4.12957 13.8 5.04524 13.8 6.00002C13.8 6.9548 13.4207 7.87047 12.7456 8.54561C12.0704 9.22074 11.1548 9.60002 10.2 9.60002Z"
              />
            </g>
            <defs>
              <clipPath id="clip0_527_14779">
                <rect width="16" height="16" fill="white"/>
              </clipPath>
            </defs>
          </svg>
          <!-- Versions -->
          <svg
            class="icon clickable"
            viewBox="0 0 16 16"
            fill="rgba(var(--rlm-icon-rgba, 51, 51, 51, .7))"
            xmlns="http://www.w3.org/2000/svg"
            @click="() => {
              open = 'revisions'
            }"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M3.0625 10.0623C1.88722 10.3219 1 11.3749 1 12.625C1 14.0681 2.18192 15.25 3.625 15.25C5.06809 15.25 6.25 14.0681 6.25 12.625C6.25 11.3749 5.36279 10.3219 4.1875 10.0623C4.1875 10.0623 4.92188 8.69025 6.57 8.685L9.68 8.69025C13.1875 8.69025 13.1875 6.18774 13.1875 6.18774C14.3628 5.92814 15.25 4.87507 15.25 3.625C15.25 2.18191 14.0681 1 12.625 1C11.1819 1 10 2.18192 10 3.625C10 4.87507 10.8872 5.92814 12.0625 6.18774C12.0625 6.18774 12 7.565 9.68 7.565L6.57 7.56C5.5 7.56 4.75 8 4.1875 8.5L4.1875 6.18774C5.36278 5.92814 6.25 4.87507 6.25 3.625C6.25 2.18191 5.06809 1 3.625 1C2.18192 1 1 2.18192 1 3.625C1 4.87507 1.88722 5.92814 3.0625 6.18774L3.0625 10.0623ZM3.625 11.125C2.78991 11.125 2.125 11.7899 2.125 12.625C2.125 13.4601 2.78991 14.125 3.625 14.125C4.46009 14.125 5.125 13.4601 5.125 12.625C5.125 11.7899 4.46009 11.125 3.625 11.125ZM12.625 5.125C11.7899 5.125 11.125 4.46009 11.125 3.625C11.125 2.78991 11.7899 2.125 12.625 2.125C13.4601 2.125 14.125 2.78991 14.125 3.625C14.125 4.46009 13.4601 5.125 12.625 5.125ZM3.625 5.125C2.78991 5.125 2.125 4.46009 2.125 3.625C2.125 2.78991 2.78991 2.125 3.625 2.125C4.46009 2.125 5.125 2.78991 5.125 3.625C5.125 4.46009 4.46009 5.125 3.625 5.125Z"
            />
          </svg>
          <!-- Close -->
          <div @click="closeDock" class="px-2 rounded-2 clickable">
            close
          </div>
      </div>
        <SharingDock class="dock-body scrollbar-small" v-if="open == 'sharing'" />
        <VersionDock class="dock-body scrollbar-small" v-if="open == 'revisions'" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import SharingDock from "./SharingDock.vue";
import VersionDock from "./VersionDock.vue";
export default defineComponent({
  name: "Dock",
  components: {
  //  StylingDock,
    SharingDock,
    VersionDock,
  },
  inject: ["toggleDock"],
  data() {
    return {
      open: "sharing" as "sharing" | "revisions",
      dockWidth: 420,
      dragStart: 0,
    }
  },
  mounted: function() {
    this.$emit("updateWidth", this.dockWidth);
  },
  methods: {
    handleDragStart: function(event: any) {
      this.dragStart = event.clientX;
      event.preventDefault();
      document.addEventListener("mousemove", this.handleDrag);
      const cleanup = () => {
        document.removeEventListener("mouseup", cleanup);
        document.removeEventListener("mousemove", this.handleDrag);
      };
      document.addEventListener("mouseup", cleanup);
    },
    handleDrag: function(event: MouseEvent) {
      this.dockWidth = this.dockWidth - (event.clientX - this.dragStart);
      this.dragStart = event.clientX;
      this.$emit("updateWidth", this.dockWidth);
    },
    closeDock: function() {
      (this as any).toggleDock();
      this.open = "sharing";
    }
  }
});
</script>

<style lang="css" scoped>
.dock-body {
  @apply bg-paper flex-grow px-4 py-3 overflow-auto;
  border-radius: 8px 8px 0px 0px;
  border-width: 1px 1px 0px 1px;
  border-style: solid;
  border-color: theme(colors.border);
}

.hide-doc-dock #dock {
  overflow: hidden;
  min-width: 0;
  max-width: 0;
}

.hide-doc-dock .dock-grip {
  opacity: 0;
}

</style>
