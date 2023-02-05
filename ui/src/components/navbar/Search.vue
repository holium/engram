<template>
    <div class="input relative">
        <input 
            type="text" 
            placeholder="Search Documents..." 
            v-model="search" 
            @focus="() => { on = true; refresh(); }" 
            @blur="handleBlur" 
            @keydown="handleKeypress"
        >
        <div id="results" class="flex flex-col bg-paper outline-none shadow-menu overflow-auto rounded-2 scrollbar-small" v-if="on">
            <div 
                class="clickable px-3 py-1"
                :key="item.id" 
                v-for="(item, i) in items"
                :class="{'bg-border': i == selected}"
                @click="() => { open(item.id) }"
            >
                {{ item.name }}
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import store from "@/store/index";

export default defineComponent({
    name: "Search",
    data() {
        return {
            search: "",
            on: false,
            selected: 0,
            all: [] as Array<{id: string, name: string}>
        }
    },
    computed: {
        items: function() {
            if(this.search.trim().length == 0) return [];
            return this.all.filter((item: any) => {
                return item.name.search(this.search) > -1 || item.id.search(this.search) > -1 
            });
        }
    },
    created: function() {
        this.refresh();
    },
    methods: {
        refresh: async function() {
            this.all = await store.getters['filesys/search']();
        },
        open: function(id: string) {
            this.$router.push(`/apps/engram${id}?spaceId=${this.$route.query.spaceId}`); 
            this.selected = 0;
            this.search = "";
        },
        handleKeypress: function(event: KeyboardEvent) {
            if(event.key == "Enter") {
                console.log("enter");
                if(this.items.length == 0) {
                    const fullpath = this.search.match(/^\/(~[\w-]+)\/(\d+)$/);
                    console.log("search path: ", fullpath);
                    if(fullpath) {
                        (window as any).urbit.poke({
                            app: "engram",
                            mark: "post",
                            json: {
                                document: { gather: { id: this.search, peer: fullpath["1"] }}
                            }
                        })
                        this.open(this.search);
                    }
                } else {
                    this.open(this.items[this.selected].id);
                }
            } else if(event.key == "ArrowDown") {
                this.selected = (this.selected + 1) % this.items.length;
            } else if(event.key == "ArrowUp") {
                this.selected = this.selected - 1;
                if(this.selected < 0) this.selected = this.items.length - 1;
            }
        },
        handleBlur: function() {
            setTimeout(() => {
                this.on = false;
            }, 200);
        }
    }
})

</script>

<style scoped>

#results {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    max-height: 360px;
    z-index: 2;
}

</style>