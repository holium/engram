<template>
  <div class="flex flex-col">
    <div class="flex">
      <div class="flex-grow py-2 heading-2 opacity-50">
        Permission Rules 
      </div>
      <div class="rounded-1 py-2 px-3 border clickable" @click="exportDocument">
        export
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
    <div class="input" v-if="isAdmin">
      <input 
        @keydown="addPermission"
        type="text" 
        placeholder="add role or ship"
        v-model="newPermission"
        class="whitespace-nowrap overflow-hidden overflow-ellipsis realm-cursor-text-cursor text-azimuth" 
      >
      <select 
        v-model="newPermissionLevel"
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
import type { ShipPermission as ShipPerm, RolePermission as RolePerm } from "@/store/filesystem";
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
    docId: function() {
      return `/${this.$route.params.author}/${this.$route.params.clock}`;
    },
    roles: function() {
      return store.getters['filesys/roles'](this.docId);
    },
    ships: function() {
      return store.getters['filesys/ships'](this.docId);
    },
    isAdmin: function(): boolean {
      const myroles = store.getters['space/roles'];
      const owner = store.getters['filesys/owner'](this.docId);

      return owner == `~${(window as any).ship}` || 
          Object.keys(this.ships)
              .map((timestamp: string) => { return this.ships[timestamp] })
                  .reduce((a: ShipPerm, acc: boolean) => {
                      return acc || (a.ship == `~${(window as any).ship}` && a.level == "admin");
                  }, false) || 
          Object.keys(this.roles)
              .map((timestamp: string) => { return this.roles[timestamp].role })
                  .reduce((a: RolePerm, acc: boolean) => {
                      return acc || (myroles.includes(a.role) && a.level == "admin");
                  }, false);
    },
  },
  methods: {
    exportDocument: async function() {
      const content = await store.getters['document/export'](this.docId);
      const dummy = document.createElement("a");
      dummy.setAttribute("href", "data:text/html;charset=utf-8," + encodeURIComponent(content));
      dummy.setAttribute("download", `${this.$route.params.author}_${this.$route.params.clock}`);
      dummy.click();
    },
    handleLevel: function(item: string, level: string, type: string) {
      if(level == "-") {
        store.dispatch("filesys/removeperm", { 
          item: {id: this.docId, type: "document"},
          timestamp: item,
          type: type
        })
      } else {
        const perm = (this as any)[type][item].perm;
        store.dispatch("filesys/removeperm", { 
          item: {id: this.docId, type: "document"},
          timestamp: item,
          type: type
        }).then(() => {
          store.dispatch('filesys/addperm', { 
            item: {id: this.docId, type: "document"}, 
            perm: perm, 
            level: level,
            type: type
          })
        })
      }
    },
    addPermission: function(event: KeyboardEvent) {
      if(event.key == "Enter" && this.newPermission.length > 0 && this.newPermissionLevel.length > 0) {
        const ship = this.newPermission.charAt(0) == "~";
        store.dispatch('filesys/addperm', { 
          item: {id: this.docId, type: "document"}, 
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
            console.log((event.target as any).selectionStart);
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
