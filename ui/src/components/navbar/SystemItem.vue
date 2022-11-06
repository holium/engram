<template>
    <div class="px-3 py-2 hover:underline cursor-pointer" @click="open">
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
    },
    methods: {
        open: function() {
            console.log("openeing document");
            this.$router.push(`/apps/engram/${this.$route.params.station}/${this.$route.params.space}${this.item.id}`);
        }
    }
})
</script>