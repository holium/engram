<template>
    <div 
        style="item.location"
        class="bg-paper flex absolute" 
        :class="{'flex-col': !contextmenu.horizontal}"
        :style="contextmenu.location"
    >
        <div :key="i" v-for="(item, i) in contextmenu.items" @click="item.run">
            {{ item.display }}
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
export default defineComponent({
    name: "ContextMenu",
    props: {
        contextmenu: {
            required: true,
            type: Object
        }
    }
})
</script>