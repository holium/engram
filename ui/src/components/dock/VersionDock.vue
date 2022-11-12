<template>
    <div class="flex flex-col">
        {{ ships }}
        <div :key="i" v-for="(snapshot, i) in snapshots">
            {{ i }} : {{ snapshot.author }} @ {{ snapshot.date.getTime() }}
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import store from "@/store/index";
import type { Patp } from "@urbit/http-api"
import type { VersionMeta } from '@/store/types';
export default defineComponent({
    name: "VersionDock",
    data() {
        return {
            ships: [] as Array<{patp: string, color: string}>
        }
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