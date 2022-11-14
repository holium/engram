<template>
  <div class="flex flex-col">

    <!-- Auto Update -->
    <div class="px-3 flex gap-3 items-center">
      <div class="dock-label">Auto-sync with other ships:</div>
      <!-- toggle -->
      <Toggle :value="autoSync" @change="(event) => { autoSync = event }" class="px-3"/>
    </div>

    <div class="px-3 heading">
      permissions
    </div>
    <div class="flex flex-col px-3">
      <div>
        {{ ships }}
      </div>
    </div>
    <div class="flex px-3">
      <input 
        @keydown="addPermission"
        type="text" 
        placeholder="add role or ship"
        v-model="newPermission"
        class="px-2 py-2 bg-none min-w-0 flex-1 whitespace-nowrap overflow-hidden overflow-ellipsis outline-none border-type realm-cursor-text-cursor" 
      >
      <select 
        v-model="newPermissionLevel"
        class="px-2 py-2 bg-none whitespace-nowrap overflow-hidden overflow-ellipsis outline-none border-type" 
      >
        <option value="editor">editor</option>
        <option value="viewer">viewer</option>
        <option value="admin">admin</option>
      </select>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import type { Patp } from "@urbit/http-api";
import store from "@/store/index";
import Toggle from "./Toggle.vue"
export default defineComponent({
  name: "SharingDock",
  components: {
    Toggle
  },
  data() {
    return {
      autoSync: false,

      newPermission: "",
      newPermissionLevel: "",
    }
  },
  computed: {
    ships: function(): Array<Patp> {
      return store.getters['workspace/settings/ships'];
    }
  },
  methods: {
    addPermission: function(event: KeyboardEvent) {
      if(event.key == "Enter") {
        if(this.newPermission.charAt(0) == "~") {
          store.dispatch('workspace/settings/addship', { 
            id: `/${this.$route.params.author}/${this.$route.params.clock}`, 
            ship: this.newPermission, 
            level: this.newPermissionLevel 
          });
        } else {
          store.dispatch('workspace/settings/addrole', { 
            id: `/${this.$route.params.author}/${this.$route.params.clock}`, 
            role: this.newPermission, 
            level: this.newPermissionLevel 
          });
        }
        this.newPermission = "";
        this.newPermissionLevel = "";
      }
    }
  }
});
</script>

<style lang="css" scoped>
</style>
