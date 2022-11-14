<template>
    <div class="flex justify-between items-center">
        <div class="azimuth">
            {{ role }}
        </div>
        <div class="px-2 py-1 clickable">
            {{ level }}
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
export default defineComponent({
    name: "ShipPermission",
    props: {
        role: {
            type: String,
            required: true
        },
        level: {
            type: String,
            required: true,
        }
    }
})
</script>