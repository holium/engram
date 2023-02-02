<template>
    <div class="flex">
        <svg
            width="25"
            height="25"
            viewBox="0 0 25 25"
            xmlns="http://www.w3.org/2000/svg"
        >
            <line
            x1="12.5"
            x2="12.5"
            y2="25"
            stroke="var(--rlm-text-color, #261f1f)"
            stroke-width="2px"
            />
        </svg>
        <!-- Before -->
        <svg
            :key="j"
            v-for="(dim, j) in ships.slice(0, i)"
            width="25"
            height="25"
            viewBox="0 0 25 25"
            xmlns="http://www.w3.org/2000/svg"
        ></svg>
        <!-- This Ship -->
        <svg 
            width="25" 
            height="25" 
            viewBox="0 0 25 25" 
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M13.1875 6.06272C16.1602 6.51584 18.5 9.10959 18.5 12.2424C18.5 15.3752 16.1602 17.969 13.1875 18.4221C13.1875 18.4221 12.25 18.5633 11.3125 18.4221C8.30469 17.969 6 15.3752 6 12.2424C6 9.10959 8.30469 6.51584 11.3125 6.06272C12.25 5.92148 13.1875 6.06272 13.1875 6.06272ZM12.25 7.8674C14.668 7.8674 16.625 9.82444 16.625 12.2424C16.625 14.6604 14.668 16.6174 12.25 16.6174C9.83203 16.6174 7.875 14.6604 7.875 12.2424C7.875 9.82444 9.83203 7.8674 12.25 7.8674Z" 
                :fill="pallet(ship)"
            />
        </svg>
        <!-- After -->
        <svg
            :key="j"
            v-for="(dim, j) in ships.slice(i + 1)"
            width="25"
            height="25"
            viewBox="0 0 25 25"
            xmlns="http://www.w3.org/2000/svg"
        ></svg>
        <div class="flex items-center text-right flex-1 font-mono relative">
            <div class="whitespace-nowrap overflow-hidden overflow-ellipsis" style="max-width: 100%;">{{ ship }}</div>
        </div>
        
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
    name: "VersionShipLabel",
    props: {
        ship: {
            type: String,
            required: true,
        },
        ships: {
            type: Array<string>,
            required: true
        },
        i: {
            type: Number,
            required: true
        }
    },
    methods: {
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
    }
})
</script>