<template>
    <div class="flex justify-between items-center py-2">
        <div class="azimuth px-3 py-2 whitespace-nowrap overflow-hidden overflow-ellipsis">
            {{ ship }}
        </div>
        <select 
            v-model="lvl"
            :editable="editable"
            @change="handleLevel"
            class="whitespace-nowrap text-azimuth px-3 py-2 clickable" 
        >
            <option value="editor">editor</option>
            <option value="viewer">viewer</option>
            <option value="admin">admin</option>
            <option value="-">delete</option>
        </select>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
export default defineComponent({
    name: "ShipPermission",
    props: {
        ship: {
            type: String,
            required: true
        },
        level: {
            type: String,
            required: true,
        },
        editable: {
            type: Boolean,
            required: false,
            default: () => { return false; }
        }
    },
    data() {
        return {
            lvl: "",
        }
    },
    created: function() {
        this.lvl = this.level;
    },
    methods: {
        handleLevel: function(event: any) {
            this.$emit("level", event.target.value);
        }
    }
})
</script>