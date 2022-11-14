<template>
    <div class="flex flex-col" @drop="handleDrop" @dragover="handleDragOver">
        <div 
            class="flex px-3 hover:underline cursor-pointer items-center" 
            @click="open" 
            @contextmenu="openMenu" 
            draggable="true" 
            dropzone="true"
            @dragstart="handleDragStart"
        >
            <!-- Document Icon -->
            <svg 
                v-if="type == 'document'"
                viewBox="0 0 16 16" 
                class="icon"
                fill="var(--rlm-icon-color, #333333)"
                xmlns="http://www.w3.org/2000/svg"
            >
                <circle cx="8" cy="8" r="3"/>
            </svg>
            <!-- Folder Icon -->
            <svg 
                v-if="type == 'folder'"
                viewBox="0 0 16 16" 
                fill="var(--rlm-icon-color, #333333)"
                xmlns="http://www.w3.org/2000/svg"
                class="folder-caret icon clickable"
                :class="{'expanded': expand}"
            >
                <path d="M6 3.99995L9.99998 7.99245L5.99997 11.9999C5.49995 12.4999 6.07812 13.2999 6.70718 12.6712L10.7072 8.69933C11.0978 8.3087 11.0978 7.67589 10.7072 7.28527L6.70718 3.31341C6.07812 2.65716 5.5 3.50005 6 3.99995Z" fill="#333333"/>
            </svg>
            <input 
                type="text" 
                v-if="rename" 
                v-model="name" 
                class="px-2 py-2 bg-none min-w-0 flex-1 whitespace-nowrap overflow-hidden overflow-ellipsis outline-none border-type realm-cursor-text-cursor" 
                :style="{'padding-bottom': '3px', 'border-bottom-width': '1px'}"
                @blur="renameItem" 
                @keydown="handleRenameKey"
                @click.stop
                ref="rename"
            />
            <div class="pl-2 py-2 flex-1 whitespace-nowrap overflow-hidden overflow-ellipsis" v-else>
                {{ meta.name }}
            </div>
        </div>
        <SystemItem 
            class="pl-2" 
            :parent="item"
            :item="(meta as any).content[i].id" 
            :index="i" 
            :type="(meta as any).content[i].type" 
            :key="i" 
            v-for="i in expand ? Object.keys(meta.content == null ? {} : meta.content) : []"
        />
    </div>
    
</template>

<script lang="ts">
import { defineComponent } from "vue";
import store from "@/store/index";
import type { ItemMeta } from "@/store/types"
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
            type: String,
        },
        type: {
            required: true,
            type: String
        }
    },
    inject: ["pushMenu"],
    data() {
        return {
            expand: false,
            rename: false,
            name: "",
        }
    },
    computed: {
        meta: function(): ItemMeta {
            if(this.type == "folder") {
                return store.getters["folders/meta"](this.item);
            } else {
                return store.getters['documents/meta'](this.item)
            }
        }
    },
    methods: {
        open: function() {
            if(this.type == "folder") this.expand = !this.expand;
            else this.$router.push(`/apps/engram${this.item}?spaceId=${this.$route.query.spaceId}`); 
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
                    run: () => {
                        console.log("delete document")
                    }
                },
                { 
                    display: "Link", 
                    icon: "", 
                    run: () => {
                        console.log("link document")
                    }
                },
                ...(`~${(window as any).ship}` == this.meta.owner ? [{
                    display: "Rename",
                    icon: "",
                    run: () => {
                        this.name = this.meta.name;
                        this.rename = true;
                        setTimeout(() => {
                            (this.$refs["rename"] as any).focus();
                        }, 10);
                    }
                }] : [])
            ]
            ));
        },
        handleRenameKey: function(event: KeyboardEvent) {
            if(event.key == 'Enter') {
                (event.target as any).blur();
            }
            if(event.key == "Escape") {
                this.name = this.meta.name;
                (event.target as any).value = this.meta.name;
                (event.target as any).blur();
            }
        },
        renameItem: function(event: FocusEvent) {
            if(this.type == "document") {
                store.dispatch("documents/rename", { id: this.item, name: (event.target as any).value});
            } else {
                store.dispatch("folders/rename", { id: this.item, name: (event.target as any).value});
            }
            this.rename = false;
        },
        handleDragStart: function(event: DragEvent) {
            event.dataTransfer?.setData("text/plain", JSON.stringify({ item: {id: this.item, type: this.type}, index: this.index ? this.index : ".", from: this.parent ? this.parent : "." }));
        },
        handleDrop: function(event: DragEvent) {
            if(this.type == "folder") {
                event.stopPropagation();
                event.preventDefault();
                const raw = event.dataTransfer?.getData("text/plain");
                if(raw) {
                    const data = JSON.parse(raw);
                    store.dispatch("folders/remove", { index: data.index, from: data.from });
                    store.dispatch("folders/add", { item: { id: data.item.id, type: data.item.type }, to: this.item });
                }
            }
        },
        handleDragOver: function(event: DragEvent) {
            if(this.type == "folder") {
                event?.preventDefault();
            } 
        }
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