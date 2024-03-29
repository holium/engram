<template>
    <div class="flex flex-col gap-2" @drop="handleDrop" @dragover="handleDragOver">
        <div class="py-2 flex items-center opacity-50" style="color: rgba(var(--rlm-icon-rgba, 51, 51, 51, .7))" id="workspace-heading" @contextmenu="openMenu">
            <div class="heading-1 color-icon overflow-hidden overflow-ellipsis whitespace-nowrap">
                {{ space.name }}
            </div>
            <div class="flex-grow mx-3" style="border-top: 1px solid; height: 0px; border-color: rgba(var(--rlm-icon-rgba, 51, 51, 51, .7))">

            </div>
            <svg 
                v-if="canEdit"
                @click="openMenu"
                class="icon clickable"
                viewBox="0 0 16 16" 
                fill="rgba(var(--rlm-icon-rgba, 51, 51, 51, .7))"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path d="M2.66667 2H13.3333C13.5101 2 13.6797 2.07024 13.8047 2.19526C13.9298 2.32029 14 2.48986 14 2.66667V13.3333C14 13.5101 13.9298 13.6797 13.8047 13.8047C13.6797 13.9298 13.5101 14 13.3333 14H2.66667C2.48986 14 2.32029 13.9298 2.19526 13.8047C2.07024 13.6797 2 13.5101 2 13.3333V2.66667C2 2.48986 2.07024 2.32029 2.19526 2.19526C2.32029 2.07024 2.48986 2 2.66667 2ZM3.33333 3.33333V12.6667H12.6667V3.33333H3.33333ZM7.33333 7.33333V4.66667H8.66667V7.33333H11.3333V8.66667H8.66667V11.3333H7.33333V8.66667H4.66667V7.33333H7.33333Z" />
            </svg>            
        </div>
        <SystemItem 
            :parent="'.'" 
            :item="items[i]" 
            :index="i"
            :key="i" 
            :editable="canEdit"
            v-for="i in Object.keys(items).sort((a, b) => {
                return (items[a].type == 'document' ? (items[b].type == 'folder' ? 1 : -1) : -1)
            })"
        />
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import store from "@/store/index";
import SystemItem from "./SystemItem.vue";
import { Menu } from "@/components/menus/types";
import type { Space } from "@/store/space";
export default defineComponent({
    name: "FileSystem",
    components: {
        SystemItem,
    },
    inject: ["pushMenu"],
    data() {
        return {
            roles: {} as any,
        }
    },
    computed: {
        items: function(): { [key: string]: { id: string, type: string }} {
            return store.getters['filesys/root'].children;
        },
        spaceId: function(): string {
            return this.$route.params.spaceId as string;
        },
        space: function(): Space {
            return store.getters['space/get'];
        },
        canEdit: function(): boolean {
            const myroles = store.getters['space/myroles'];
            const roles = store.getters['space/roles'];

            return myroles.includes("owner") || 
                Object.keys(roles)
                    .map((timestamp: string) => { 
                        return myroles.includes(roles[timestamp].role) && (roles[timestamp].level == "editor" || roles[timestamp].level == "admin") 
                    }).reduce((a: boolean, acc: boolean) => {
                            return acc || a;
                        }, false);
      }
    },
    methods: {
        openMenu: function(event: MouseEvent) {
            event.preventDefault();
            (this as any).pushMenu(new Menu({ top: event.clientY, left: event.clientX}, [
                {
                    display: "New Document",
                    icon: "",
                    command: () => {
                        store.dispatch("filesys/make", { type: "document", name: "Untitled Document", spaceId: this.$route.query.spaceId });
                    }
                },
                {
                    display: "New Folder",
                    icon: "",
                    command: () => {
                        store.dispatch("filesys/make", { type: "folder", name: "Untitled Folder", spaceId: this.$route.query.spaceId });
                    }
                }
            ]))
        },
        handleDrop: function(event: DragEvent) {
            if(this.canEdit) {
                event.preventDefault();
                const raw = event.dataTransfer?.getData("text/plain");
                if(raw) {
                    const data = JSON.parse(raw);
                    if(data.from != ".") {
                        store.dispatch("filesys/remove", { index: data.index, from: data.from });
                        store.dispatch("filesys/add", { item: { id: data.item.id, type: data.item.type }, to: ".", index: data.item.id });
                    }
                }
            }
            
        }, 
        handleDragOver: function(event: DragEvent) {
            if(this.canEdit) {
                event.preventDefault();
            }
        },
        canView: function(id: string): boolean {
            const myroles = store.getters['space/myroles'];
            const owner = store.getters['filesys/owner'](id);
            const roles = store.getters['space/roles'];

            return owner == `~${(window as any).ship}` || 
                Object.keys(roles)
                    .map((timestamp: string) => { return myroles.includes(roles[timestamp].role) })
                        .reduce((a: boolean, acc: boolean) => {
                            return acc || a;
                        }, false);
        },
    }
})
</script>

<style>


</style>