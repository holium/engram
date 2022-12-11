<template>
    <div
        class="bg-paper flex absolute outline-none shadow-menu overflow-auto rounded-2 scrollbar-small flex-col"
        tabIndex="0"
        style="max-height: 240px"
        :style="contextmenu.location"
    >
        <div 
            :key="i" 
            v-for="(item, i) in contextmenu.items" 
            @click="() => { contextmenu.clearSearch(); item.command(); close() }" 
            class="px-3 py-1 clickable"
            :class="{'bg-border': i == contextmenu.selected % items.length}"
        >
            {{ item.display }}
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { MenuItem } from './types';

export default defineComponent({
    name: "EngramMenu",
    props: {
        contextmenu: {
            required: true,
            type: Object
        }
    },
    inject: ['closeMenu'],
    computed: {
        height: function() {
            return window.innerHeight;
        },
        items: function() {
            return this.contextmenu.items.filter((item: MenuItem) => { 
                return item.display.toLowerCase().search(this.contextmenu.search) > -1;
            })
        }
    },
    methods: {
        close: function() {
           (this as any).closeMenu();
        }
    }
})
</script>