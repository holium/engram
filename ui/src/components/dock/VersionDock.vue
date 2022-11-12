<template>
    <div class="flex flex-col">
        {{ ships }}
        <VersionItem :meta="snapshot" :ships="ships" :index="i" :key="i" v-for="(snapshot, i) in snapshots" />
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
import type { VersionMeta } from '@/store/types';
import VersionItem from "./VersionItem.vue";
export default defineComponent({
    name: "VersionDock",
    components: {
        VersionItem,
    },
    computed: {
        snapshots: function(): Array<VersionMeta> {
            console.log("versions:", store.getters['workspace/revisions/versions']);
            return store.getters['workspace/revisions/versions'];
        },
        ships: function(): Set<Patp> {
            return new Set(store.getters['workspace/revisions/versions'].map((revision: VersionMeta) => revision.author));
        }
    }
})
</script>