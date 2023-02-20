<template>
    <div class="flex flex-col">
        <div class="flex cursor-pointer" @click="closePreview">
            <svg
                width="25"
                height="25"
                viewBox="0 0 25 25"
                xmlns="http://www.w3.org/2000/svg"
                :style="{'transform': 'rotate(180deg)'}"
            >
                <path
                    d="M11.5 18.6797C8.52734 18.2266 6.25 15.6328 6.25 12.5C6.25 9.36719 8.52734 6.77344 11.5 6.32031V6.78003e-06C11.5 6.78003e-06 11.9805 0 12.5 0C13.0195 0 13.5 6.78003e-06 13.5 6.78003e-06V6.32031C16.5078 6.77344 18.75 9.36719 18.75 12.5C18.75 15.6328 16.5078 18.2266 13.5 18.6797C13.5 18.6797 13.0195 18.75 12.5 18.75C11.9805 18.75 11.5 18.6797 11.5 18.6797ZM8.2 12.5C8.2 14.918 10.082 16.875 12.5 16.875C14.918 16.875 16.8 14.918 16.8 12.5C16.8 10.082 14.918 8.125 12.5 8.125C10.082 8.125 8.2 10.082 8.2 12.5Z"
                    fill="var(--rlm-text-color, #261f1f)"
                />
                <path 
                    v-if="previewing == null"
                    d="M16.8 12.5C16.8 10.082 14.918 8.125 12.5 8.125C10.082 8.125 8.2 10.082 8.2 12.5C8.2 14.918 10.082 16.875 12.5 16.875C14.918 16.875 16.8 14.918 16.8 12.5Z" 
                    fill="var(--rlm-text-color, #261f1f)"
                />
            </svg>
            <!-- Other Ships -->
            <svg
                :key="j"
                v-for="(dim, j) in ships"
                width="25"
                height="25"
                viewBox="0 0 25 25"
                xmlns="http://www.w3.org/2000/svg"
            ></svg>
            <div class="flex items-center text-right flex-grow font-mono">
                ~{{ ship }}
            </div>
        </div>
        <VersionShipLabel :ship="ship" :ships="ships" :i="i" :key="ship" v-for="(ship, i) in ships" />
        <VersionItem :meta="snapshot" :ships="ships" :index="i" :firstIndecies="firstIndecies" :key="i" v-for="(snapshot, i) in snapshots" />
        <div class="flex" :style="{ 'position': 'relative' }">
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
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import store from "@/store/index";
import type { Patp } from "@urbit/http-api"
import type { VersionMeta } from '@/store/document';
import VersionItem from "./VersionItem.vue";
import VersionShipLabel from './VersionShipLabel.vue';
export default defineComponent({
    name: "VersionDock",
    components: {
        VersionItem,
        VersionShipLabel,
    },
    created: function() {
        store.dispatch("document/versions", this.docId);
    },
    watch: {
        docId: function(newId: string) {
            store.dispatch("document/versions", newId);
        }
    },
    computed: {
        previewing: function() {
            return store.getters['document/previewing'];
        },
        snapshots: function(): Array<VersionMeta> {
            return store.getters['document/versions'];
        },
        ships: function(): Array<Patp> {
            return Array.from(
                new Set(
                    store.getters['document/versions'].map((revision: VersionMeta) => revision.author)
                    .filter((ship: string) => ship != `~${(window as any).ship}`)
                )
            )
        },
        ship: function(): string {
            return (window as any).ship
        },
        firstIndecies: function(): Array<number> {
            return this.ships.map((ship: string) => {
                return this.snapshots.findIndex((snapshot: VersionMeta) => snapshot.author == ship);
            })
        },
        docId: function(): string {
            return `/${this.$route.params.author}/${this.$route.params.clock}`;
        }
    },
    methods: {
        closePreview: function() {
            store.dispatch("document/preview", null);
        }
    }
})
</script>