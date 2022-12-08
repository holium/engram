<template>
    <div 
        ref="menu"
        tabindex="0"
        @blur="close"
        class="bg-paper flex absolute outline-none shadow-menu overflow-hidden rounded-2" 
        :class="{'flex-col': !contextmenu.horizontal}"
        :style="contextmenu.location"
    >
        <div :key="i" v-for="(item, i) in contextmenu.items" @click="() => { item.command(); close() }" class="px-3 py-1 clickable">
            {{ item.display }}
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
export default defineComponent({
    name: "ContextMenu",
    inject: ["closeMenu"],
    props: {
        contextmenu: {
            required: true,
            type: Object
        }
    },
    mounted: function() {
        (this.$refs["menu"] as any).focus();
    },
    methods: {
        close: function() {
            (this as any).closeMenu();
        }
    }
})
</script>