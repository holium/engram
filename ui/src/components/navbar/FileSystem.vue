<template>
    <div class="flex flex-col gap-2" @drop="handleDrop" @dragover="handleDragOver">
        <div class="px-3 py-2 flex items-center" id="workspace-heading" @contextmenu="openMenu">
            <div class="flex-grow heading-1">
                workspace
            </div>
            <svg 
                v-if="canEdit"
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
import type { ShipPermission, RolePermission, SysItem } from "@/store/filesystem";
import { Menu } from "@/components/menus/types";
export default defineComponent({
    name: "FileSystem",
    components: {
        SystemItem,
    },
    inject: ["pushMenu"],
    data() {
        return {
            ships: {} as any,
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
        canEdit: function(): boolean {
            const myroles = store.getters['space/myroles'];
            const roles = store.getters['space/roles'];
            const ships = store.getters['space/ships'];

            return myroles.includes("owner") || 
                Object.keys(ships)
                    .map((timestamp: string) => { 
                        return ships[timestamp].ship == `~${(window as any).ship}` && (ships[timestamp].level == "editor" || ships[timestamp].level == "admin") 
                    }).reduce((a: boolean, acc: boolean) => {
                            return acc || a;
                        }, false) || 
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
                        store.dispatch("filesys/make", { type: "document", name: "Untitled Document", spaceId: this.$route.query.spaceId }).then((path: SysItem) => {
                            const roles = store.getters['space/roles'];
                            const ships = store.getters['space/ships'];
                            Object.keys(roles).forEach((timestamp: string) => {
                                store.dispatch("filesys/addperm", {
                                    item: path,
                                    type: "roles",
                                    perm: roles[timestamp].role,
                                    level: roles[timestamp].level
                                })
                            });
                            Object.keys(ships).forEach((timestamp: string) => {
                                store.dispatch("filesys/addperm", {
                                    item: path,
                                    type: "ships",
                                    perm: ships[timestamp].ship,
                                    level: ships[timestamp].level
                                })
                            });
                        })
                    }
                },
                {
                    display: "New Folder",
                    icon: "",
                    command: () => {
                        store.dispatch("filesys/make", { type: "folder", name: "Untitled Folder", spaceId: this.$route.query.spaceId }).then((path: SysItem) => {
                            const roles = store.getters['space/roles'];
                            const ships = store.getters['space/ships'];
                            Object.keys(roles).forEach((timestamp: string) => {
                                store.dispatch("filesys/addperm", {
                                    item: { id: path.id, type: "folder" },
                                    type: "roles",
                                    perm: roles[timestamp].role,
                                    level: roles[timestamp].level
                                })
                            });
                            Object.keys(ships).forEach((timestamp: string) => {
                                store.dispatch("filesys/addperm", {
                                    item: { id: path.id, type: "folder"},
                                    type: "ships",
                                    perm: ships[timestamp].ship,
                                    level: ships[timestamp].level
                                })
                            });
                        })
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
            const myroles = store.getters['space/roles'];
            const owner = store.getters['filesys/owner'](id);
            const roles = store.getters['filesys/roles'](id);
            const ships = store.getters['filesys/ships'](id);

            return owner == `~${(window as any).ship}` || 
                Object.keys(ships)
                    .map((timestamp: string) => { 
                        return ships[timestamp].ship == `~${(window as any).ship}`;
                    }).reduce((a: boolean, acc: boolean) => {
                            return acc || a;
                        }, false) || 
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

.new-item-button {
    opacity: 0;
    transition: opacity 80ms ease;
}

#workspace-heading:hover .new-item-button {
    opacity: 1;
}

</style>