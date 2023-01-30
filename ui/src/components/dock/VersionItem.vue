<template>
    <div class="flex" :style="{ 'position': 'relative', top: '25px' }" >
      <div
        :style="{
          width: '25px',
          height: '25px',
          top: '-25px',
          position: 'relative',
          'z-index': 2
        }"
      >
        <!-- Branch -->
        <svg
            v-if="(me == meta.author)"
            :style="{ position: 'absolute', top: '19px', left: '0' }"
            :width="`${50 + 25 * shipIndex}`"
            height="12.5"
            :viewBox="`0 0 ${50 + 25 * shipIndex} 12.5`"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                :d="`M12.5 0 C12.5 12.5 ${37.5 + 25 * shipIndex} 0 ${
                    37.5 + 25 * shipIndex
                } 12.5`"
                fill="none"
                :stroke="pallet(meta.author)"
                stroke-width="2px"
            />
        </svg>
        <!-- Local Node -->
        <svg
            @click="preview"
            width="25"
            height="25"
            viewBox="0 0 25 25"
            xmlns="http://www.w3.org/2000/svg"
            class="cursor-pointer"
            :style="{'z-index': 3}"
        >
            <path
                v-if="viewing"
                d="M13.5 6.32031C16.4727 6.77344 18.75 9.36719 18.75 12.5C18.75 15.6328 16.4727 18.2266 13.5 18.6797V25C13.5 25 13.0195 25 12.5 25C11.9805 25 11.5 25 11.5 25V18.6797C8.49219 18.2266 6.25 15.6328 6.25 12.5C6.25 9.36719 8.49219 6.77344 11.5 6.32031L11.5 0C11.5 0 11.9805 0 12.5 0C13.0195 0 13.5 0 13.5 0L13.5 6.32031Z"
                fill="var(--rlm-text-color, #261f1f)"
            />
            <path
                v-else
                d="M13.5 6.32031C16.4727 6.77344 18.75 9.36719 18.75 12.5C18.75 15.6328 16.4727 18.2266 13.5 18.6797V25C13.5 25 13.0195 25 12.5 25C11.9805 25 11.5 25 11.5 25V18.6797C8.49219 18.2266 6.25 15.6328 6.25 12.5C6.25 9.36719 8.49219 6.77344 11.5 6.32031L11.5 0C11.5 0 11.9805 0 12.5 0C13.0195 0 13.5 0 13.5 0L13.5 6.32031ZM16.8 12.5C16.8 10.082 14.918 8.125 12.5 8.125C10.082 8.125 8.2 10.082 8.2 12.5C8.2 14.918 10.082 16.875 12.5 16.875C14.918 16.875 16.8 14.918 16.8 12.5Z"
                fill="var(--rlm-text-color, #261f1f)"
            />
        </svg>
    </div>
    <div :key="ship" v-for="(ship, i) in ships">
        <!-- No Node-->
        <svg
            v-if="false"
            width="25"
            height="25"
            viewBox="0 0 25 25"
            xmlns="http://www.w3.org/2000/svg"
        ></svg>
        <!--  First Commit Node -->
        <svg
            v-else-if="ship == meta.author && index == firstIndecies[ships.indexOf(ship)]"
            width="25"
            height="25"
            viewBox="0 0 25 25"
            xmlns="http://www.w3.org/2000/svg"
            :style="{'transform': 'rotate(180deg)'}"
        >
            <path
                d="M11.5 18.6797C8.52734 18.2266 6.25 15.6328 6.25 12.5C6.25 9.36719 8.52734 6.77344 11.5 6.32031V6.78003e-06C11.5 6.78003e-06 11.9805 0 12.5 0C13.0195 0 13.5 6.78003e-06 13.5 6.78003e-06V6.32031C16.5078 6.77344 18.75 9.36719 18.75 12.5C18.75 15.6328 16.5078 18.2266 13.5 18.6797C13.5 18.6797 13.0195 18.75 12.5 18.75C11.9805 18.75 11.5 18.6797 11.5 18.6797ZM8.2 12.5C8.2 14.918 10.082 16.875 12.5 16.875C14.918 16.875 16.8 14.918 16.8 12.5C16.8 10.082 14.918 8.125 12.5 8.125C10.082 8.125 8.2 10.082 8.2 12.5Z"
                :fill="pallet(ship)"
            />
        </svg>
        <!-- Commit Node -->
        <svg
            v-else-if="ship == meta.author"
            width="25"
            height="25"
            viewBox="0 0 25 25"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                fill-rule="nonzero"
                d="M13.5 6.32031C16.4727 6.77344 18.75 9.36719 18.75 12.5C18.75 15.6328 16.4727 18.2266 13.5 18.6797V25C13.5 25 13.0195 25 12.5 25C11.9805 25 11.5 25 11.5 25V18.6797C8.49219 18.2266 6.25 15.6328 6.25 12.5C6.25 9.36719 8.49219 6.77344 11.5 6.32031L11.5 0C11.5 0 11.9805 0 12.5 0C13.0195 0 13.5 0 13.5 0L13.5 6.32031ZM16.8 12.5C16.8 10.082 14.918 8.125 12.5 8.125C10.082 8.125 8.2 10.082 8.2 12.5C8.2 14.918 10.082 16.875 12.5 16.875C14.918 16.875 16.8 14.918 16.8 12.5Z"
                :fill="pallet(ship)"
            />
        </svg>
        <!-- No Node Yet -->
        <svg
            v-else-if="index < firstIndecies[ships.indexOf(ship)]"
            width="25"
            height="25"
            viewBox="0 0 25 25"
            xmlns="http://www.w3.org/2000/svg"
        >
        </svg>
        <!-- Empty Node -->
        <svg
            v-else
            width="25"
            height="25"
            viewBox="0 0 25 25"
            xmlns="http://www.w3.org/2000/svg"
        >
            <line
              x1="12.5"
              x2="12.5"
              y2="25"
              :stroke="pallet(ship)"
              stroke-width="2px"
            />
        </svg>
    </div>
        
      <div class="flex items-center text-right flex-grow font-mono">
        {{ formattedTimestamp }}
      </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import store from "@/store/index"
export default defineComponent({
    name: "VersionItem",
    props: {
        meta: {
            type: Object,
            required: true,
        },
        ships: {
            type: Array<string>,
            required: true,
        },
        index: {
            type: Number,
            required: true,
        },
        firstIndecies: {
            type: Array<number>,
            required: true,
        }
    },
    methods: {
        preview: function() {
            store.dispatch('document/preview', store.getters['document/version'](this.index))
        },
        pallet: function(ship: string) {
            let sum = 0;
            Array.from(ship).forEach((char: string) => {
                sum = sum + char.charCodeAt(0);
            });
            return [
                "#ef4444",
                "#f97316",
                "#f59e0b",
                "#ca8a04",
                "#84cc16",
                "#22c55e",
                "#10b981",
                "#14b8a6",
                "#06b6d4",
                "#0ea5e9",
                "#3b82f6",
                "#6366f1",
                "#8b5cf6",
                "#a855f7",
                "#d946ef",
                "#ec4899",
                "#f43f5e",
            ][sum % 16];
        },
    },
    computed: {
        viewing: function() {
            const previewing = store.getters['workspace/previewing'];
            return previewing != null && previewing.date.getTime() == this.meta.date.getTime()
        },
        me: function() {
            return (window as any).ship
        },
        shipIndex: function() {
            return Array.from(this.ships).indexOf(this.meta.author);
        },
        formattedTimestamp: function() {
            const months = [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
            ];
            return `
                ${this.meta.date
                .getHours()
                .toString()
                .padStart(2, "0")}:${this.meta.date
                .getMinutes()
                .toString()
                .padStart(2, "0")} ${
                months[this.meta.date.getMonth()]
                } ${this.meta.date
                .getDate()
                .toString()
                .padStart(2, "0")}, ${this.meta.date.getFullYear()}
            `;
        }
    }
})
</script>