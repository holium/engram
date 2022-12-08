<template>
  <div class="flex flex-col">

    <!-- Auto Update -->
    <div class="dock-item" v-if="!private">
      <div class="dock-label">Take Private:</div>
      <!-- toggle -->
      <Toggle :value="private" @change="handlePrivate" class="px-3"/>
    </div>

    <div class="py-2 heading-2 opacity-50">
      Permission Rules
    </div>
    <div class="flex flex-col gap-1">
      <ShipPermission :editable="isAdmin" :key="item" :ship="ships[item].ship" :level="ships[item].level" v-for="item in Object.keys(ships)" />
      <RolePermission :editable="isAdmin" :key="item" :role="roles[item].role" :level="roles[item].level" v-for="item in Object.keys(roles)" />
    </div>
    <div class="input">
      <input 
        @keydown="addPermission"
        type="text" 
        :editable="isAdmin"
        placeholder="add role or ship"
        v-model="newPermission"
        class="whitespace-nowrap overflow-hidden overflow-ellipsis realm-cursor-text-cursor text-azimuth" 
      >
      <select 
        v-model="newPermissionLevel"
        :editable="isAdmin"
        class="whitespace-nowrap overflow-hidden overflow-ellipsis text-azimuth" 
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
import ShipPermission from "./ShipPermission.vue";
import RolePermission from "./RolePermission.vue";
export default defineComponent({
  name: "SharingDock",
  components: {
    Toggle,
    ShipPermission,
    RolePermission
  },
  data() {
    return {
      isAdmin: false,

      newPermission: "",
      newPermissionLevel: "",
    }
  },
  computed: {
    ships: function(): { [key: string]: { ship: string, level: string } } {
      return store.getters['workspace/settings/ships'];
    },
    roles: function(): { [key: string]: { role: string, level: string } } {
      return store.getters['workspace/settings/roles'];
    },
    private: function(): boolean {
      return typeof(
        Object.keys(this.ships).find(ship => 
          this.ships[ship].ship == `~${(window as any).ship}` 
          && 
          this.ships[ship].level == "admin"
        )) != 'undefined';
    },
    isAdmin: function(): boolean {
      return store.getters['documents/meta'](`/${this.$route.params.author}/${this.$route.params.clock}`).owner == `~${(window as any).ship}`
      || store.getters['space/roles'].reduce((role: string, acc: boolean) => {
        return acc || Object.keys(this.roles).find(role => this.roles[role].role == role && this.roles[role].level == 'admin');
      }, false)
      || Object.keys(this.ships).find(ship => this.ships[ship].ship == `~${(window as any).ship}` && this.ships[ship].level == 'admin');
    }
  },
  methods: {
    handlePrivate: function(event: boolean) {
      console.log("taking private? ", event);
      if(store.getters['documents/meta'](`/${this.$route.params.author}/${this.$route.params.clock}`).owner == `~${(window as any).ship}`) {
        store.dispatch('workspace/settings/addship', { 
            id: `/${this.$route.params.author}/${this.$route.params.clock}`, 
            ship: `~${(window as any).ship}`, 
            level: "admin" 
          });
      }
    },
    addPermission: function(event: KeyboardEvent) {
      console.log("input: ", this.newPermission, event.key, " @ ", (event.target as any).selectionStart);
      if(event.key == "Enter" && this.newPermission.length > 0 && this.newPermissionLevel.length > 0) {
        if(this.newPermission.charAt(0) == "~") {
          store.dispatch('workspace/settings/addship', { 
            id: `/${this.$route.params.author}/${this.$route.params.clock}`, 
            ship: this.newPermission, 
            level: this.newPermissionLevel 
          });
        } else {
          store.dispatch('workspace/settings/addrole', { 
            id: `/${this.$route.params.author}/${this.$route.params.clock}`, 
            role: this.newPermission.substring(1), 
            level: this.newPermissionLevel
          });
        }
        this.newPermission = "";
        this.newPermissionLevel = "";
      } else {
        if(event.key != "ArrowLeft" && event.key != "ArrowRight" && event.key != "Backspace" && event.key != "Delete") {
          if(this.newPermission.length == 0) {
            if(event.key != '~' && event.key != '%') event.preventDefault();
          } else {
            if((event.target as any).selectionStart == 0) event.preventDefault();
            else if(this.newPermission.charAt(0) == '~') {
              if(!"abcdefghijklmnopqrstuvwxyz-".includes(event.key)) event.preventDefault();
            } else if(this.newPermission.charAt(0) == "%") {
              if(!"abcdefghijklmnopqrstuvwxyz-0123456789".includes(event.key)) event.preventDefault();
            }
          }
        }
      }
    }
  }
});
</script>

<style lang="css" scoped>
</style>
