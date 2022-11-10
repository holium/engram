<template>
    <div class="flex flex-col" @drop="handleDrop" @dragover="handleDragOver">
        <div 
            class="flex px-3 py-2 hover:underline cursor-pointer gap-3" 
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
            <div flex="">
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
            else this.$router.push(`/apps/engram/${this.$route.params.station}/${this.$route.params.space}${this.item}`); 
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
                    display: "delete", 
                    icon: "", 
                    run: () => {
                        console.log("delete document")
                    }
                },
                { 
                    display: "link", 
                    icon: "", 
                    run: () => {
                        console.log("link document")
                    }
                },
            ]
            ));
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
                    store.dispatch("folders/add", { item: data.item, to: this.item });
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