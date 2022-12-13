<template>
  <div class="flex flex-col">
    <div class="py-2 heading-2 opacity-50 flex">
      <div class="flex-grow">
        Permission Rules 
      </div>
      <div class="opacity-50" v-if="isAdmin">
        admin view
      </div>
    </div>
    <div class="flex flex-col gap-1">
      <ShipPermission 
        :editable="isAdmin" 
        :key="item" 
        :ship="ships[item].perm" 
        :level="ships[item].level" 
        v-for="item in Object.keys(ships)" 
        @level="(event: string) => { handleLevel(item, event, 'ships') }"
      />
      <RolePermission 
        :editable="isAdmin" 
        :key="item" 
        :role="roles[item].perm" 
        :level="roles[item].level" 
        v-for="item in Object.keys(roles)" 
        @level="(event: string) => { handleLevel(item, event, 'roles') }"
      />
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
      newPermission: "",
      newPermissionLevel: "",
    }
  },
  computed: {
    ships: function(): { [key: string]: { perm: string, level: string } } {
      return store.getters['workspace/settings/ships'];
    },
    roles: function(): { [key: string]: { perm: string, level: string } } {
      return store.getters['workspace/settings/roles'];
    },
    isAdmin: function(): boolean {
      return store.getters['space/owner'] == `~${(window as any).ship}`
      || store.getters['documents/meta'](`/${this.$route.params.author}/${this.$route.params.clock}`).owner == `~${(window as any).ship}`
      || store.getters['space/roles'].reduce((role: string, acc: boolean) => {
        return acc || Object.keys(this.roles).find(role => this.roles[role].perm == role && this.roles[role].level == 'admin');
      }, false)
      || Object.keys(this.ships).find(ship => this.ships[ship].perm == `~${(window as any).ship}` && this.ships[ship].level == 'admin');
    },
    isOwner: function(): boolean {
      return store.getters['documents/meta'](`/${this.$route.params.author}/${this.$route.params.clock}`).owner == `~${(window as any).ship}`
    }
  },
  methods: {
    handleLevel: function(item: string, level: string, type: string) {
      if(level == "-") {
        store.dispatch("documents/removeperm", { 
          id: `/${this.$route.params.author}/${this.$route.params.clock}`,
          timestamp: item,
          type: type
        });
      }
      const perm = (this as any)[type][item].perm;
      store.dispatch("documents/removeperm", { 
        id: `/${this.$route.params.author}/${this.$route.params.clock}`,
        timestamp: item,
        type: type
      }).then(() => {
        store.dispatch('documents/addperm', { 
          id: `/${this.$route.params.author}/${this.$route.params.clock}`, 
          perm: perm, 
          level: level,
          type: type
        }).then(() => {
          store.dispatch("workspace/settings/open", `/${this.$route.params.author}/${this.$route.params.clock}`);
        })
      })
    },
    addPermission: function(event: KeyboardEvent) {
      if(event.key == "Enter" && this.newPermission.length > 0 && this.newPermissionLevel.length > 0) {
        const ship = this.newPermission.charAt(0) == "~";
        store.dispatch('documents/addperm', { 
          id: `/${this.$route.params.author}/${this.$route.params.clock}`, 
          perm: ship ? this.newPermission : this.newPermission.substring(1),
          level: this.newPermissionLevel,
          type: ship ? "ships" : "roles"
        });
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
