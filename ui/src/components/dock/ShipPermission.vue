<template>
    <div class="flex justify-between items-center py-2" :style="lvl == '-' ? {'display': 'none'} : {}">
        <div class="azimuth px-3 py-2 whitespace-nowrap overflow-hidden overflow-ellipsis">
            {{ ship }}
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
            console.log("this level: ", this.lvl);
            this.$emit("level", event.target.value);
        }
    }
})
</script>