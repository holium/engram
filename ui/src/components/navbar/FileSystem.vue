<template>
    <div class="flex flex-col">
        <div class="heading px-3 py-2 flex" @contextmenu="openMenu">
            <div class="flex-grow">
                workspace
            </div>
            <svg 
                @click="openMenu"
                class="icon clickable new-item-button"
                viewBox="0 0 16 16" 
                fill="var(--rlm-icon-color, #333333)"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path d="M2.66667 2H13.3333C13.5101 2 13.6797 2.07024 13.8047 2.19526C13.9298 2.32029 14 2.48986 14 2.66667V13.3333C14 13.5101 13.9298 13.6797 13.8047 13.8047C13.6797 13.9298 13.5101 14 13.3333 14H2.66667C2.48986 14 2.32029 13.9298 2.19526 13.8047C2.07024 13.6797 2 13.5101 2 13.3333V2.66667C2 2.48986 2.07024 2.32029 2.19526 2.19526C2.32029 2.07024 2.48986 2 2.66667 2ZM3.33333 3.33333V12.6667H12.6667V3.33333H3.33333ZM7.33333 7.33333V4.66667H8.66667V7.33333H11.3333V8.66667H8.66667V11.3333H7.33333V8.66667H4.66667V7.33333H7.33333Z" />
            </svg>            
        </div>
        <SystemItem :item="item.id" :type="'folder'" :key="item.id" v-for="item in items.filter((item) => item.type == 'folder')" />
        <SystemItem :item="item.id" :type="'document'" :key="item.id" v-for="item in items.filter((item) => item.type == 'document')" />
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import store from "@/store/index";
import SystemItem from "./SystemItem.vue";
import type { DocumentMeta, FolderMeta } from "@/store/types";
import { Menu } from "@/components/menus/types";
export default defineComponent({
    name: "FileSystem",
    components: {
        SystemItem,
    },
    inject: ["pushMenu"],
    computed: {
        items: function(): Array<{ id: string, type: string}> {
            return store.getters['folders/root'];
        },
    },
    methods: {
        openMenu: function(event: MouseEvent) {
            event.preventDefault();
            (this as any).pushMenu(new Menu({ top: event.clientY, left: event.clientX}, [
                {
                    display: "New Document",
                    icon: "",
                    run: () => {
                        store.dispatch("documents/make", { name: "Untitled Document" })
                    }
                },
                {
                    display: "New Folder",
                    icon: "",
                    run: () => {
                        store.dispatch("folders/make", { name: "Untitled Folder" })
                    }

                }
            ]))
        }
    }
})
</script>

<style>

.new-item-button {
    opacity: 0;
    transition: opacity 80ms ease;
}

.heading:hover .new-item-button {
    opacity: 1;
}

</style>