<template>
    <div class="px-3 py-2">
        {{ item.name }} ; {{ item.id }}
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
    name: "SystemItem",
    props: {
        item: {
            required: true,
            type: Object,
        },
        type: {
            required: true,
            type: String
        }
    }
})
</script>