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
        :ship="ships[item].ship" 
        :level="ships[item].level" 
        v-for="item in Object.keys(ships)" 
        @level="(event: string) => { handleLevel(item, event, 'ships') }"
      />
    </div>
    <div class="input" v-if="isAdmin">
      ~
      <input 
        @keydown="addPermission"
        type="text" 
        placeholder="dev"
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
import type { ShipPermission as ShipPerm } from "@/store/filesystem";
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
      return store.getters['space/roles'];
    },
    ships: function() {
      return store.getters['filesys/ships'](this.docId);
    },
    space: function() {
      return store.getters['filesys/space'](this.docId);
    },
    isAdmin: function(): boolean {
      const myroles = store.getters['space/myroles'];
      const owner = store.getters['filesys/owner'](this.docId);
      

      return owner == `~${(window as any).ship}` || 
          Object.keys(this.ships)
              .map((timestamp: string) => { 
                return this.ships[timestamp].ship == `~${(window as any).ship}` && this.ships[timestamp].level == "admin" 
              }).reduce((a: boolean, acc: boolean) => {
                      return acc || a;
                  }, false) || 
          (
            this.space == this.$route.query.spaceId &&
            Object.keys(this.roles)
              .map((timestamp: string) => { return myroles.includes(this.roles[timestamp].role) && this.roles[timestamp].level == "admin" })
                  .reduce((a: boolean, acc: boolean) => {
                      return acc || a;
                  }, false)
          ); 
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
        store.dispatch("filesys/removeship", { 
          item: {id: this.docId, type: "document"},
          timestamp: item,
        })
      } else {
        const perm = this.ships.ship;
        store.dispatch("filesys/removeship", { 
          item: {id: this.docId, type: "document"},
          timestamp: item,
        }).then(() => {
          store.dispatch('filesys/addship', { 
            item: {id: this.docId, type: "document"}, 
            perm: perm, 
            level: level,
          })
        })
      }
    },
    addPermission: function(event: KeyboardEvent) {
      if(event.key == "Enter" && this.newPermission.length > 0 && this.newPermissionLevel.length > 0) {
        store.dispatch('filesys/addship', { 
          item: {id: this.docId, type: "document"}, 
          perm: `~${this.newPermission}`,
          level: this.newPermissionLevel,
        });
        this.newPermission = "";
        this.newPermissionLevel = "";
      } else {
        if(event.key != "ArrowLeft" && event.key != "ArrowRight" && event.key != "Backspace" && event.key != "Delete" && event.key != "Tab") {
          if(!"abcdefghijklmnopqrstuvwxyz-".includes(event.key)) event.preventDefault();
        }
      }
    }
  }
});
</script>

<style lang="css" scoped>
</style>
