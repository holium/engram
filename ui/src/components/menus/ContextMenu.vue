<template>
    <div 
        style="item.location"
        class="bg-card flex absolute" 
        :class="{'flex-col': !contextmenu.horizontal}"
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