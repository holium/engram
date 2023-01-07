<template>
    <div class="flex flex-col gap-2" @drop="handleDrop" @dragover="handleDragOver">
        <div class="px-3 py-2 flex items-center" id="workspace-heading" @contextmenu="openMenu">
            <div class="flex-grow heading-1">
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
        <SystemItem 
            :parent="'.'" 
            :item="items[i].id" 
            :index="i"
            :type="'folder'" 
            :key="i" 
            v-for="i in Object.keys(items).filter((i: string) => items[i].type == 'folder')"
        />
        <SystemItem 
            :parent="'.'" 
            :item="items[i].id" 
            :index="i"
            :type="'document'" 
            :key="i" 
            v-for="i in Object.keys(items).filter((i: string) => items[i].type == 'document')"
        />
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
        items: function(): { [key: string]: { id: string, type: string }} {
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
                    command: () => {
                        store.dispatch("documents/make", { name: "Untitled Document" }).then((path: string) => {
                            (window as any).urbit.scry({ app: "engram", path: `/space${this.$route.query.spaceId}/settings`}).then((res: any) => {
                                Object.keys(res.roles).forEach((role: string) => {
                                    store.dispatch(`documents/addperm`, {
                                    id: path,
                                    type: "roles",
                                    perm: res.roles[role].perm,
                                    level: res.roles[role].level
                                    }, { root: true})
                                });
                                Object.keys(res.ships).forEach((ship: string) => {
                                    store.dispatch(`documents/addperm`, {
                                    id: path,
                                    type: "ships",
                                    perm: res.ships[ship].perm,
                                    level: res.ships[ship].level
                                    }, { root: true})
                                });
                            });
                        })
                    }
                },
                {
                    display: "New Folder",
                    icon: "",
                    command: () => {
                        store.dispatch("folders/make", { name: "Untitled Folder" }).then((path: string) => {
                            (window as any).urbit.scry({ app: "engram", path: `/space${this.$route.query.spaceId}/settings`}).then((res: any) => {
                                Object.keys(res.roles).forEach((role: string) => {
                                    store.dispatch(`folders/addperm`, {
                                    id: path,
                                    type: "roles",
                                    perm: res.roles[role].perm,
                                    level: res.roles[role].level
                                    }, { root: true})
                                });
                                Object.keys(res.ships).forEach((ship: string) => {
                                    store.dispatch(`folders/addperm`, {
                                    id: path,
                                    type: "ships",
                                    perm: res.ships[ship].perm,
                                    level: res.ships[ship].level
                                    }, { root: true})
                                });
                            });
                        })
                    }
                }
            ]))
        },
        handleDrop: function(event: DragEvent) {
            event.preventDefault();
            event.stopPropagation();
            const raw = event.dataTransfer?.getData("text/plain");
                if(raw) {
                    const data = JSON.parse(raw);
                    if(data.from != ".") {
                        store.dispatch("folders/remove", { index: data.index, from: data.from });
                        store.dispatch("folders/add", { item: { id: data.item.id, type: data.item.type, index: data.item.id }, to: "." });
                    }
                }
        }, 
        handleDragOver: function(event: DragEvent) {
            event.preventDefault();
        }
    }
})
</script>

<style>

.new-item-button {
    opacity: 0;
    transition: opacity 80ms ease;
}

#workspace-heading:hover .new-item-button {
    opacity: 1;
}

</style>