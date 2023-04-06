<template>
    <div class="flex flex-col gap-2" @drop="handleDrop" @dragover="handleDragOver">
        <div 
            class="flex py-1 items-center gap-2 rounded-2" 
            :class="{'clickable': !rename}"
            @click="open" 
            @contextmenu="openMenu" 
            :draggable="editable" 
            dropzone="true"
            @dragstart="handleDragStart"
        >
            <!-- Document Icon -->
            <svg 
                v-if="item.type == 'document'"
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24"
                fill="var(--rlm-icon-color, #333333)"
                class="icon"
            >
                <path fill="none" d="M0 0h24v24H0z"/>
                <path d="M21 9v11.993A1 1 0 0 1 20.007 22H3.993A.993.993 0 0 1 3 21.008V2.992C3 2.455 3.447 2 3.998 2H14v6a1 1 0 0 0 1 1h6zm0-2h-5V2.003L21 7z"/>
            </svg>
            <!-- Folder Icon -->
            <svg 
                v-if="item.type == 'folder'"
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="var(--rlm-icon-color, #333333)"
                class="icon"
            >
                <path fill="none" d="M0 0h24v24H0z"/>
                <path d="M22 8v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7h19a1 1 0 0 1 1 1zm-9.586-3H2V4a1 1 0 0 1 1-1h7.414l2 2z"/></svg>
            <input 
                type="text" 
                v-if="rename" 
                v-model="newname" 
                class="text-sm px-2 py-2 bg-none min-w-0 flex-1 whitespace-nowrap overflow-hidden overflow-ellipsis outline-none border-type realm-cursor-text-cursor" 
                :style="{'padding-bottom': '3px', 'border-bottom-width': '1px'}"
                @blur="renameItem" 
                @keydown="handleRenameKey"
                @click.stop
                ref="rename"
            />
            <div class="flex-1 whitespace-nowrap overflow-hidden overflow-ellipsis text-sm px-2 py-2" v-else>
                {{ itemname }}
            </div>
             <!-- Folder Icon -->
             <svg 
                v-if="item.type == 'folder'"
                viewBox="0 0 16 16" 
                fill="var(--rlm-icon-color, #333333)"
                xmlns="http://www.w3.org/2000/svg"
                class="folder-caret icon"
                :class="{'expanded': expand}"
            >
                <path d="M6 3.99995L9.99998 7.99245L5.99997 11.9999C5.49995 12.4999 6.07812 13.2999 6.70718 12.6712L10.7072 8.69933C11.0978 8.3087 11.0978 7.67589 10.7072 7.28527L6.70718 3.31341C6.07812 2.65716 5.5 3.50005 6 3.99995Z" fill="#333333"/>
            </svg>
        </div>
        <SystemItem 
            class="pl-4" 
            :parent="item.id"
            :item="(children as any)[i]" 
            :index="i"
            :key="i" 
            :editable="canEdit"
            v-for="i in expand ? Object.keys(children) : []"
        />
    </div>
    
</template>

<script lang="ts">
import { defineComponent } from "vue";
import store from "@/store/index";
import type { SysRecord } from "@/store/filesystem"
import { Menu } from "@/components/menus/types";

export default defineComponent({
    name: "SystemItem",
    props: {
        parent: {
            required: false,
            type: String,
        },
        index: {
            required: false,
            type: String,
        },
        item: {
            required: true,
            type: Object,
        },
        editable: {
            required: true,
            type: Boolean
        }
    },
    inject: ["pushMenu", "pushFolderDock"],
    data() {
        return {
            expand: false,
            rename: false,
            newname: "",
        }
    },
    computed: {
        itemname: function(): string {
            return store.getters['filesys/name'](this.item.id);
        },
        owner: function(): boolean {
            return store.getters['filesys/owner'](this.item.id) == `~${(window as any).ship}`
        },
        children: function(): { [key: string]: SysRecord } {
            const children = store.getters['filesys/children'](this.item.id);
            return children ? children : {};
        },
        canEdit: function(): boolean {
            const myroles = store.getters['space/myroles'];
            const owner = store.getters['filesys/owner'](this.item.id);
            const roles = store.getters['space/roles'];

            return owner == `~${(window as any).ship}` || 
                Object.keys(roles)
                    .map((timestamp: string) => { 
                        return myroles.includes(roles[timestamp].role) && (roles[timestamp].level == "editor" || roles[timestamp].level == "admin") 
                    }).reduce((a: boolean, acc: boolean) => {
                            return acc || a;
                        }, false);
        },
    },
    methods: {
        open: function() {
            if(this.item.type == "folder") this.expand = !this.expand;
            else this.$router.push(`/apps/engram${this.item.id}?spaceId=${this.$route.query.spaceId}`); 
        },
        canView: function(id: string): boolean {
            const myroles = store.getters['space/myroles'];
            const owner = store.getters['filesys/owner'](id);
            const roles = store.getters['space/roles'];
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
        openMenu: function(event: MouseEvent) {
            event.preventDefault();
            event.stopPropagation();
            (this as any).pushMenu(new Menu({
                top: event.clientY,
                left: event.clientX
            }, 
            [
                { 
                    display: "Delete", 
                    icon: "", 
                    command: () => {
                        store.dispatch("filesys/remove", { from: this.parent, index: this.index, soft: true });
                        store.dispatch("filesys/delete", this.item);
                    }
                },
                ...(this.owner ? [{
                    display: "Rename",
                    icon: "",
                    command: () => {
                        this.newname = this.itemname;
                        this.rename = true;
                        setTimeout(() => {
                            (this.$refs["rename"] as any).focus();
                        }, 10);
                    }
                }] : []),
                ...(this.item.type == 'folder' ? [{
                    display: "Settings",
                    icon: "",
                    command: () => {
                        (this as any).pushFolderDock(this.item.id);
                    }
                }]: [])
            ]
            ));
        },
        handleRenameKey: function(event: KeyboardEvent) {
            if(event.key == 'Enter') {
                (event.target as any).blur();
            }
            if(event.key == "Escape") {
                (event.target as any).value = this.itemname;
                (event.target as any).blur();
            }
        },
        renameItem: function(event: FocusEvent) {
            store.dispatch("filesys/rename", { item: this.item, name: (event.target as any).value});
            this.rename = false;
        },
        handleDragStart: function(event: DragEvent) {
            if(this.editable) {
                event.dataTransfer?.setData("text/plain", JSON.stringify({ item: this.item, index: this.index ? this.index : ".", from: this.parent ? this.parent : "." }));
            }
        },
        handleDrop: function(event: DragEvent) {
            if(this.item.type == "folder" && this.canEdit) {
                event.stopPropagation();
                event.preventDefault();
                const raw = event.dataTransfer?.getData("text/plain");
                if(raw) {
                    const data = JSON.parse(raw);
                    if(this.item != data.from) {
                        store.dispatch("filesys/remove", { index: data.index, from: data.from });
                        store.dispatch("filesys/add", { item: data.item, to: this.item.id });
                    }
                }
            }
        },
        handleDragOver: function(event: DragEvent) {
            if(this.item.type == "folder" && this.canEdit) {
                event?.preventDefault();
            } 
        },
    }
})
</script>

<style>

.folder-caret {
    transform: rotate(0deg);
    transition: background-color 80ms ease, transform 80ms ease;
}

.folder-caret.expanded {
    transform: rotate(90deg);
}

</style>