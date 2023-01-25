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
      return store.getters['documents/ships'](`/${this.$route.params.author}/${this.$route.params.clock}`);
    },
    roles: function(): { [key: string]: { perm: string, level: string } } {
      return store.getters['documents/roles'](`/${this.$route.params.author}/${this.$route.params.clock}`);
    },
    isAdmin: function(): boolean {
      const myroles = store.getters['space/roles'];
      const owner = store.getters['documents/owner'](`/${this.$route.params.author}/${this.$route.params.clock}`);
      const ships = store.getters['documents/ships'](`/${this.$route.params.author}/${this.$route.params.clock}`);
      const roles = store.getters['documents/roles'](`/${this.$route.params.author}/${this.$route.params.clock}`);
      const perms = Object.keys(roles).map((key: string) => {
        return myroles.includes(roles[key].perm) ? (roles[key].level == "admin") : false;
      })
      Object.keys(ships).forEach((key: string) => {
        perms.push(ships[key].perm == `~${(window as any).ship}` ? (ships[key].level == "editor" || ships[key].level == "admin") : false);
      })

      return `~${(window as any).ship}` == owner || perms.reduce((a: boolean, acc: boolean) => {
          return acc || a;
      }, false);
    },
    isOwner: function(): boolean {
      return store.getters['documents/meta'](`/${this.$route.params.author}/${this.$route.params.clock}`).owner == `~${(window as any).ship}`
    }
  },
  methods: {
    exportDocument: async function() {
      const content = await store.getters['documents/export'](`/${this.$route.params.author}/${this.$route.params.clock}`);
      const dummy = document.createElement("a");
      dummy.setAttribute("href", "data:text/html;charset=utf-8," + encodeURIComponent(content));
      dummy.setAttribute("download", `_${this.$route.params.author}_${this.$route.params.clock}`);
      dummy.click();
    },
    handleLevel: function(item: string, level: string, type: string) {
      console.log("handling level: ", level);
      if(level == "-") {
        store.dispatch("documents/removeperm", { 
          id: `/${this.$route.params.author}/${this.$route.params.clock}`,
          timestamp: item,
          type: type
        });
      } else {
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
      }
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
