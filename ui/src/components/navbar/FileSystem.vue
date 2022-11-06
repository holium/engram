<template>
    <div class="flex flex-col">
        <div class="heading px-3 py-2">
            workspace
        </div>
        <SystemItem :item="item" :type="'document'" :key="item.id" v-for="item in documents" />
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import store from "@/store/index";
import SystemItem from "./SystemItem.vue";
import type { DocumentMeta, FolderMeta } from "@/store/types";
export default defineComponent({
    name: "FileSystem",
    components: {
        SystemItem,
    },
    created: function() {
        store.dispatch("documents/load");
    },
    computed: {
        documents: function(): Array<DocumentMeta> {
            return store.getters['documents/list'];
        },
        folders: function(): Array<FolderMeta> {
            //return store.getters['folder/list'];
            return [];
        }
    }
})
</script>