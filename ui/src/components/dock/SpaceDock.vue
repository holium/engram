<template>
    <div class="flex items-stretch text-body">
      <div class="dock-grip" draggable="true" @dragstart="handleDragStart">
  
      </div>
      <div id="dock" :style="{width: `${dockWidth}px`}">
        <div class="toolbar">
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
              @level="(event: any) => { handleLevel(item, event, 'ship'); }"
              v-for="item in Object.keys(ships)" 
            />
            <RolePermission 
              :editable="isAdmin"
              :key="item" 
              :role="roles[item].perm" 
              :level="roles[item].level" 
              v-for="item in Object.keys(roles)" 
              @level="(event: any) => { handleLevel(item, event, 'role'); }"
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
                :editable="isAdmin"
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
      open: {
        type: Boolean,
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
      open: function() {
        this.loadSettings();
      }
    },
    computed: {
      isAdmin: function(): boolean {
        return store.getters['space/owner'] == `~${(window as any).ship}`
        || store.getters['space/roles'].reduce((role: string, acc: boolean) => {
          return acc || Object.keys(this.roles).find(role => this.roles[role].perm == role && this.roles[role].level == 'admin');
        }, false) 
        || Object.keys(this.ships).find(ship => this.ships[ship].perm == `~${(window as any).ship}` && this.ships[ship].level == 'admin');
      }
    },
    methods: {
      loadSettings: function() {
        (window as any).urbit.scry({ app: "engram", path: `/space${this.$route.query.spaceId}/settings`}).then((res: any) => {
            console.log("space settings response", res);
            this.roles = res.roles;
            this.ships = res.ships;
        });
      },
      handleLevel: function(item: string, level: string, type: string) {
        if(level == "-") {
          store.dispatch("folders/removeperm", { 
            id: this.$route.query.spaceId,
            timestamp: item,
            type: type,
            perm: (this as any)[type][item].perm,
            level: (this as any)[type][item].level
          });
        }
        const perm = (this as any)[type][item];
        store.dispatch("folders/removeperm", { 
          id: this.$route.query.spaceId,
          timestamp: item,
          type: type,
          perm: perm.perm,
          level: perm.level
        }).then(() => {
          store.dispatch('folders/addperm', { 
            id: this.$route.query.spaceId, 
            perm: perm.perm, 
            level: level,
            type: type
          }).then(() => {
            this.loadSettings();
          })
        })
      },
      addPermission: function(event: KeyboardEvent) {
        if(event.key == "Enter" && this.newPermission.length > 0 && this.newPermissionLevel.length > 0) {
          const ship = this.newPermission.charAt(0) == "~";
          store.dispatch('space/addperm', { 
            id: this.$route.query.spaceId, 
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
  