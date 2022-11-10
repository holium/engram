<template>
    <div class="flex px-3 py-2 hover:underline cursor-pointer" @click="open" @contextmenu="openMenu">
        <div flex="">
            {{ item.name }} ; {{ item.id }}
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Menu } from "@/components/menus/types";

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
    inject: ["pushMenu"],
    methods: {
        open: function() {
            console.log("openeing document");
            this.$router.push(`/apps/engram/${this.$route.params.station}/${this.$route.params.space}${this.item.id}`);
        },
        openMenu: function(event: MouseEvent) {
            event.preventDefault();
            event.stopPropagation();
            (this as any).pushMenu(new Menu({
                top: event.clientY,
                left: event.clientX
            }, 
            [
                { 
                    display: "delete", 
                    icon: "", 
                    run: () => {
                        console.log("delete document")
                    }
                },
                { 
                    display: "link", 
                    icon: "", 
                    run: () => {
                        console.log("link document")
                    }
                },
            ]
            ));
        }
    }
})
</script>