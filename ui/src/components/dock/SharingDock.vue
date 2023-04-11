<template>
  <div class="flex flex-col">
    <div class="flex">
      <div class="flex-grow py-2 heading-2">
        Permissions 
      </div>
      <div class="rounded-1 py-2 px-3 border clickable" @click="exportDocument">
        export
      </div>
    </div>
    <div class="heading-2 opacity-50 py-2">{{ space.name }}</div>
    <div class="flex flex-col gap-2">
      <div class="input" v-if="isSpaceAdmin">
        <div class="flex-grow-0 mr-2">%</div>
        <input 
            @keydown="addRole"
            type="text" 
            placeholder="add role"
            v-model="newRole"
            class="whitespace-nowrap overflow-hidden overflow-ellipsis realm-cursor-text-cursor text-azimuth" 
        >
        <select 
          v-model="newRoleLevel"
          class="whitespace-nowrap overflow-hidden overflow-ellipsis text-azimuth" 
        >
            <option value="editor">editor</option>
            <option value="viewer">viewer</option>
            <option value="admin">admin</option>
        </select>
      </div>
      <RolePermission 
        :editable="isSpaceAdmin"
        :key="item" 
        :role="roles[item].role" 
        :level="roles[item].level" 
        v-for="item in Object.keys(roles)" 
        @level="(event: any) => { handleRoleLevel(item, event); }"
      />
    </div>
    <div class="heading-2 opacity-50 py-2">Collaborators</div>
    <div class="flex flex-col gap-2">
      <div class="input" v-if="isDocAdmin">
        <div class="flex-grow-0 mr-2">~</div>
        <input 
          @keydown="addShip"
          type="text" 
          placeholder="dev"
          v-model="newShip"
          class="whitespace-nowrap overflow-hidden overflow-ellipsis realm-cursor-text-cursor text-azimuth" 
        >
        <select 
          v-model="newShipLevel"
          class="whitespace-nowrap overflow-hidden overflow-ellipsis text-azimuth bg-window" 
        >
          <option class="" value="editor">editor</option>
          <option class="" value="viewer">viewer</option>
          <option class="" value="admin">admin</option>
        </select>
      </div>
      <ShipPermission 
        :editable="isDocAdmin" 
        :key="item" 
        :ship="ships[item].ship" 
        :level="ships[item].level" 
        v-for="item in Object.keys(ships)" 
        @level="(event: string) => { handleShipLevel(item, event) }"
      />
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
      newShip: "",
      newShipLevel: "",
      newRole: "",
      newRoleLevel: ""
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
      return store.getters['space/get'];
    },
    isDocAdmin: function(): boolean {
      const myroles = store.getters['space/myroles'];
      const owner = store.getters['filesys/owner'](this.docId);

      return owner == `~${(window as any).ship}` || 
          myroles.inclueds("owner") ||
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
    isSpaceAdmin: function(): boolean {
      const myroles = store.getters['space/myroles'];

      const perms = Object.keys(this.roles).map((key: string) => {
        return myroles.includes(this.roles[key].perm) ? (this.roles[key].level == "admin") : false;
      })

      return myroles.includes("owner") || perms.reduce((a: boolean, acc: boolean) => {
          return acc || a;
      }, false);
    }
  },
  methods: {
    exportDocument: async function() {
      const content = await store.getters['document/export'](this.docId);
      const dummy = document.createElement("a");
      dummy.setAttribute("href", "data:text/html;charset=utf-8," + encodeURIComponent(content));
      dummy.setAttribute("download", `${this.$route.params.author}_${this.$route.params.clock}`);
      dummy.click();
    },
    handleShipLevel: function(item: string, level: string) {
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
    handleRoleLevel: function(item: string, level: string) {
      if(level == "-") {
          store.dispatch("space/removerole", { 
            id: this.$route.query.spaceId,
            timestamp: item,
          });
        } else {
          const perm = this.roles[item];
          store.dispatch("space/removerole", { 
            id: this.$route.query.spaceId,
            timestamp: item,
          }).then(() => {
            store.dispatch('space/addrole', { 
              id: this.$route.query.spaceId, 
              perm: perm.role, 
              level: level,
            });
          })
        }
    },
    addShip: function(event: KeyboardEvent) {
      if(event.key == "Enter" && this.newShip.length > 0 && this.newRoleLevel.length > 0) {
        store.dispatch('filesys/addship', { 
          item: {id: this.docId, type: "document"}, 
          perm: `~${this.newShip}`,
          level: this.newRoleLevel,
        });
        this.newShip = "";
        this.newRoleLevel = "";
      } else {
        if(event.key != "ArrowLeft" && event.key != "ArrowRight" && event.key != "Backspace" && event.key != "Delete" && event.key != "Tab") {
          if(!"abcdefghijklmnopqrstuvwxyz-".includes(event.key)) event.preventDefault();
        }
      }
    },
    addRole: function(event: KeyboardEvent) {
        if(event.key == "Enter" && this.newRole.length > 0 && this.newRoleLevel.length > 0) {
          store.dispatch('space/addrole', { 
            id: this.$route.query.spaceId, 
            perm: this.newRole,
            level: this.newRoleLevel,
          });
          this.newRole = "";
          this.newRoleLevel = "";
        } else {
          if(event.key != "ArrowLeft" && event.key != "ArrowRight" && event.key != "Backspace" && event.key != "Delete" && event.key != "Tab") {
              if(!"abcdefghijklmnopqrstuvwxyz-0123456789".includes(event.key)) event.preventDefault();
          }
        }
      },
  }
});
</script>

<style lang="css" scoped>
</style>
