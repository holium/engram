<template>
    <div class="flex items-stretch text-body">
      <div class="dock-grip" draggable="true" @dragstart="handleDragStart">
  
      </div>
      <div id="dock" :style="{width: `${dockWidth}px`}">
        <div class="toolbar">
            <div class="flex-grow heading-1">
              {{ space.name }}
            </div>
            <div @click="closeDock" class="px-2 rounded-2 clickable">
              close
            </div>
        </div>
        <div class="dock-body scrollbar-small">
          <div class="py-2 heading-2 opacity-50 flex">
            <div class="flex-grow">
              Permissions 
            </div>
            <div class="opacity-50" v-if="isAdmin">
              admin view
            </div>
          </div>
          <div class="flex flex-col gap-2">
            <div class="input" v-if="isAdmin">
              <div class="flex-grow-0 mr-2">%</div>
              <input 
                  @keydown="addPermission"
                  type="text" 
                  placeholder="add role"
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
            <RolePermission 
              :editable="isAdmin"
              :key="item" 
              :role="roles[item].role" 
              :level="roles[item].level" 
              v-for="item in Object.keys(roles)" 
              @level="(event: any) => { handleLevel(item, event, 'roles'); }"
            />
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
  import type { Space } from "@/store/space";

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

        newPermission: "",
        newPermissionLevel: "",
      }
    },
    computed: {
      roles: function() {
        return store.getters['space/roles'];
      },
      space: function(): Space {
        return store.getters['space/get'];
      },
      isAdmin: function(): boolean {
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
      handleLevel: function(item: string, level: string, type: string) {
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
      addPermission: function(event: KeyboardEvent) {
        if(event.key == "Enter" && this.newPermission.length > 0 && this.newPermissionLevel.length > 0) {
          store.dispatch('space/addrole', { 
            id: this.$route.query.spaceId, 
            perm: this.newPermission,
            level: this.newPermissionLevel,
          });
          this.newPermission = "";
          this.newPermissionLevel = "";
        } else {
          if(event.key != "ArrowLeft" && event.key != "ArrowRight" && event.key != "Backspace" && event.key != "Delete" && event.key != "Tab") {
              if(!"abcdefghijklmnopqrstuvwxyz-0123456789".includes(event.key)) event.preventDefault();
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
  