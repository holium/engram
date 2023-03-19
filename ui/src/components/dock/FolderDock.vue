<template>
  <div class="flex items-stretch text-body" v-if="folder.length > 0">
    <div class="dock-grip" draggable="true" @dragstart="handleDragStart">

    </div>
    <div id="dock" :style="{width: `${dockWidth}px`}">
      <div class="toolbar" >
          <div class="flex-grow heading-1">
            Folder Settings
          </div>
          <div @click="closeDock" class="px-2 rounded-2 clickable">
            close
          </div>
      </div>
      <div class="dock-body scrollbar-small">

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
              :ship="ships[item].ship" 
              :level="ships[item].level" 
              @level="(event: any) => { handleLevel(item, event, 'ships'); }"
              v-for="item in Object.keys(ships)" 
            />
            <RolePermission 
              :editable="isAdmin"
              :key="item" 
              :role="roles[item].role" 
              :level="roles[item].level" 
              v-for="item in Object.keys(roles)" 
              @level="(event: any) => { handleLevel(item, event, 'roles'); }"
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
          </div>
      </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import store from "@/store/index"
import ShipPermission from "./ShipPermission.vue";
import RolePermission from "./RolePermission.vue";
import type { ShipPermission as ShipPerm, RolePermission as RolePerm } from "@/store/filesystem";
export default defineComponent({
  name: "Dock",
  components: {
    ShipPermission,
    RolePermission
  },
  props: {
    folder: {
      type: String,
      required: true,
    }
  },
  data() {
    return {
      dockWidth: 420,
      dragStart: 0,

      newPermission: "",
      newPermissionLevel: "",
    }
  },
  computed: {
    roles: function() {
      return store.getters['filesys/roles'](this.folder);
    },
    ships: function() {
      return store.getters['filesys/ships'](this.folder);
    },
    isAdmin: function(): boolean {
      const myroles = store.getters['space/myroles'];
      const owner = store.getters['filesys/owner'](this.folder);

      return owner == `~${(window as any).ship}` || 
          Object.keys(this.ships)
              .map((timestamp: string) => { 
                return this.ships[timestamp].ship == `~${(window as any).ship}` && this.ships[timestamp].level == "admin" 
              }).reduce((a: boolean, acc: boolean) => {
                      return acc || a;
                  }, false) || 
          Object.keys(this.roles)
              .map((timestamp: string) => { return myroles.includes(this.roles[timestamp].role) && this.roles[timestamp].level == "admin" })
                  .reduce((a: boolean, acc: boolean) => {
                      return acc || a;
                  }, false);
    },
  },
  methods: {
    handleLevel: function(item: string, level: string, type: string) {
      if(level == "-") {
        store.dispatch("filesys/removeperm", { 
          item: { id: this.folder, type: "folder" },
          timestamp: item,
          type: type,
        })
      } else {
        const perm = (this as any)[type][item];
        store.dispatch("filesys/removeperm", { 
          id: this.folder,
          timestamp: item,
          type: type,
        }).then(() => {
          store.dispatch('filesys/addperm', { 
            id: this.folder, 
            perm: perm[type == "ships" ? "ship" : "role"], 
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
          item: { id: this.folder, type: "folder" }, 
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
    },
    handleDragStart: function(event: any) {
      this.dragStart = event.clientX;
      event.preventDefault();
      document.addEventListener("mousemove", this.handleDrag);
      const cleanup = () => {
        document.removeEventListener("mouseup", cleanup);
        document.removeEventListener("mousemove", this.handleDrag);
      };
      document.addEventListener("mouseup", cleanup);
    },
    handleDrag: function(event: MouseEvent) {
      this.dockWidth = this.dockWidth - (event.clientX - this.dragStart);
      this.dragStart = event.clientX;
    },
    closeDock: function() {
      this.$emit('close');
    }
  }
});
</script>

<style lang="css" scoped>

.dock-body {
@apply bg-paper flex-grow px-4 py-3;
border-radius: 8px 0px 0px 0px;
border-width: 1px 0px 0px 1px;
border-style: solid;
border-color: theme(colors.border);
}

.hide-space-dock #dock {
overflow: hidden;
min-width: 0;
max-width: 0;
}

.hide-space-dock .dock-grip {
opacity: 0;
}

</style>
