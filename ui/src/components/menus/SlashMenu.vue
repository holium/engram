<template>
    <div
        class="bg-paper flex absolute outline-none shadow-menu overflow-auto rounded-2 scrollbar-small"
        tabIndex="0"
        ref="menu"
        @blur="close"
        style="max-height: 240px"
        :class="{'flex-col': !contextmenu.horizontal}"
        :style="contextmenu.location"
    >
        <div 
            class="clickable flex"
            :key="suggestion.key" 
            v-for="suggestion in contextmenu.items" 
            @click="() => { suggestion.command(); close(); }"
        >
            <div>

            </div>
            <div class="">
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

export default defineComponent({
    name: "SlashMenu",
    props: {
        contextmenu: {
            required: true,
            type: Object
        }
    },
    inject: ['closeMenu'],
    mounted: function() {
        (this.$refs["menu"] as any).focus();
    },
    computed: {
        height: function() {
            return window.innerHeight;
        }
    },
    methods: {
        close: function() {
            (this as any).closeMenu();
        }
    }
})
</script>