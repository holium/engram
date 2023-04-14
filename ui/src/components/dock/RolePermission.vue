<template>
    <div class="flex justify-between items-center py-2">
        <div class="azimuth px-3 py-2 whitespace-nowrap overflow-hidden overflow-ellipsis">
            %{{ role }}
        </div>
        <select 
            v-model="lvl"
            :disabled="!editable"
            @change="handleLevel"
            class="whitespace-nowrap text-azimuth px-3 py-2 clickable rounded-1" 
        >
            <option value="editor">editor</option>
            <option value="viewer">viewer</option>
            <option value="admin">admin</option>
        </select>
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