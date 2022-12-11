<template>
    <div
        class="bg-paper flex absolute outline-none shadow-menu overflow-auto rounded-2 scrollbar-small flex-col"
        tabIndex="0"
        style="max-height: 240px"
        :style="contextmenu.location"
    >
        <div 
            class="clickable flex"
            :key="suggestion.display" 
            v-for="(suggestion, i) in items" 
            @click="() => { contextmenu.clearSearch(); suggestion.command(); close(); }"
        >
            <div>

            </div>
            <div class="flex-grow" :class="{'bg-border': i == contextmenu.selected % items.length}">
                <div class="heading-1 px-3 py-2">
                    {{ suggestion.display }}
                </div>
                <div class="opacity-50 px-3 py-2">
                    {{ suggestion.description }}
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { SuggestionItem } from '../document/prosemirror/suggestions';

export default defineComponent({
    name: "SlashMenu",
    props: {
        contextmenu: {
            required: true,
            type: Object
        }
    },
    inject: ['closeMenu'],
    created: function() {
        console.log("created slashmenu");
    },
    beforeUnmount: function() {
        console.log("unmounting");
    },
    computed: {
        height: function() {
            return window.innerHeight;
        },
        items: function() {
            return this.contextmenu.items.filter((item: SuggestionItem) => { 
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