<template>
  <div class="flex items-stretch text-body" v-if="folder.length > 0">
    <div class="dock-grip" draggable="true" @dragstart="handleDragStart">

    </div>
    <div id="dock" :style="{width: `${dockWidth}px`}">
      <div class="toolbar" >
          <div class="flex-grow"></div>
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
              :ship="ships[item].perm" 
              :level="ships[item].level" 
              @level="(event: any) => { handleLevel(item, event, 'ships'); }"
              v-for="item in Object.keys(ships)" 
            />
            <RolePermission 
              :editable="isAdmin"
              :key="item" 
              :role="roles[item].perm" 
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
      roles: { } as { [key: string]: { perm: string, level: string} },
      ships: { } as { [key: string]: { perm: string, level: string} },

      newPermission: "",
      newPermissionLevel: "",
    }
  },
  watch: {
    folder: function() {
      this.loadSettings();
    }
  },
  computed: {
    isAdmin: function(): boolean {
      const item = store.getters["folders/meta"](this.folder);
      const myroles = store.getters['space/roles'];

      const perms = Object.keys(this.roles).map((key: string) => {
        return myroles.includes(this.roles[key].perm) ? (this.roles[key].level == "admin") : false;
      })
      Object.keys(this.ships).forEach((key: string) => {
        perms.push(this.ships[key].perm == `~${(window as any).ship}` ? (this.ships[key].level == "admin") : false);
      })

      return `~${(window as any).ship}` == item.owner || perms.reduce((a: boolean, acc: boolean) => {
          return acc || a;
      }, false);
    },
    isOwner: function(): boolean {
      return store.getters['folders/meta'](this.folder).owner == `~${(window as any).ship}`
    }
  },
  methods: {
    loadSettings: function() {
      if(this.folder.length > 0) {
        (window as any).urbit.scry({ app: "engram", path: `/folder${this.folder}/get/settings`}).then((res: any) => {
          this.roles = res.roles;
          this.ships = res.ships;
        });
      }
    },
    handleLevel: function(item: string, level: string, type: string) {
      if(level == "-") {
        console.log("space settings: ", this.roles, this.ships);
        store.dispatch("folders/removeperm", { 
          id: this.folder,
          timestamp: item,
          type: type,
          perm: (this as any)[type][item].perm,
          level: (this as any)[type][item].level
        }).then(() => {
          this.loadSettings();
        })
      } else {
        const perm = (this as any)[type][item];
        store.dispatch("folders/removeperm", { 
          id: this.folder,
          timestamp: item,
          type: type,
          perm: perm.perm,
          level: perm.level
        }).then(() => {
          store.dispatch('folders/addperm', { 
            id: this.folder, 
            perm: perm.perm, 
            level: level,
            type: type
          }).then(() => {
            this.loadSettings();
          })
        })
      }
    },
    addPermission: function(event: KeyboardEvent) {
      if(event.key == "Enter" && this.newPermission.length > 0 && this.newPermissionLevel.length > 0) {
        const ship = this.newPermission.charAt(0) == "~";
        store.dispatch('folders/addperm', { 
          id: this.folder, 
          perm: ship ? this.newPermission : this.newPermission.substring(1),
          level: this.newPermissionLevel,
          type: ship ? "ships" : "roles"
        });
        this.newPermission = "";
        this.newPermissionLevel = "";
        this.loadSettings();
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
