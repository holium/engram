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
            <div class="py-2 heading-2 opacity-50">
                Permission Rules
            </div>
                <div class="flex flex-col gap-1">
                  <ShipPermission 
                    :editable="isAdmin"
                    :key="item" 
                    :ship="ships[item].ship" 
                    :level="ships[item].level" 
                    @level="(event: any) => { handleLevel(item, event, 'ship'); }"
                    v-for="item in Object.keys(ships)" 
                  />
                  <RolePermission 
                    :editable="isAdmin"
                    :key="item" 
                    :role="roles[item].role" 
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
        roles: { } as { [key: string]: { role: string, level: string} },
        ships: { } as { [key: string]: { ship: string, level: string} },

        newPermission: "",
        newPermissionLevel: "",
      }
    },
    watch: {
      open: function() {
        (window as any).urbit.scry({ app: "engram", path: `/space${this.$route.query.spaceId}/settings`}).then((res: any) => {
            console.log("space settings response", res);
            this.roles = res.roles;
            this.ships = res.ships;
        });
      }
    },
    computed: {
      isAdmin: function(): boolean {
        return store.getters['space/owner'] == `~${(window as any).ship}`
        || store.getters['space/roles'].reduce((role: string, acc: boolean) => {
          return acc || Object.keys(this.roles).find(role => this.roles[role].role == role && this.roles[role].level == 'admin');
        }, false) 
        || Object.keys(this.ships).find(ship => this.ships[ship].ship == `~${(window as any).ship}` && this.ships[ship].level == 'admin');
      }
    },
    methods: {
        handleLevel: function(item: string, level: string, type: string) {
          if(level == "-") this.removePermission(item, type);
          else if(type == "ship") {
            this.ships[item].level = level;
          } else {
            this.roles[item].level = level;
          }
        },
        removePermission: function(timestamp: string, type: string) {
            if(type == "ship") {
              this.spanningremove(this.ships[timestamp].ship, this.ships[timestamp].level, type);
              delete this.ships[timestamp];
            } else {
              this.spanningremove(this.roles[timestamp].role, this.roles[timestamp].level, type);
              delete this.roles[timestamp];
            }
            (window as any).urbit.poke({
                app: "engram",
                mark: "post",
                json: { space: { removeperms: {
                    id: this.$route.query.spaceId,
                    item: timestamp,
                    type: type,
                }}}
            });
        },
        addPermission: function(event: KeyboardEvent) {
            console.log("input: ", this.newPermission, event.key, " @ ", (event.target as any).selectionStart);
            if(event.key == "Enter" && this.newPermission.length > 0 && this.newPermissionLevel.length > 0) {
                if(this.newPermission.charAt(0) == "~") {
                  this.spanningadd(this.newPermission, this.newPermissionLevel, "ship");
                    (window as any).urbit.scry({
                      app: "engram",
                      path: ""
                    });
                    this.ships[`${Date.now()}`] = { ship: this.newPermission, level: this.newPermissionLevel };
                    (window as any).urbit.poke({
                        app: "engram",
                        mark: "post",
                        json: { space: { addship: {
                            id: this.$route.query.spaceId,
                            ship: this.newPermission,
                            level: this.newPermissionLevel
                        }}}
                    })
                } else {
                  this.spanningadd(this.newPermission.substring(1), this.newPermissionLevel, "role");
                  this.roles[`${Date.now()}`] = { role: this.newPermission.substring(1), level: this.newPermissionLevel };
                  (window as any).urbit.poke({
                    app: "engram",
                    mark: "post",
                    json: { space: { addrole: {
                      id: this.$route.query.spaceId,
                      role: this.newPermission.substring(1),
                      level: this.newPermissionLevel
                    }}}
                  })
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
        },
        spanningadd: function(perm: string, level: string, type: string) {
          (window as any).urbit.scry({
            app: "engram", path: `/space${this.$route.query.spaceId}/list`
          }).then((items: any) => {
            console.log("spannign add: ", items);
            Object.keys(items).forEach((item: string) => {
              (window as any).urbit.scry({ app: "engram", path: `/${items[item].type}${item}/get/settings`})
              .then((stg: any) => {
                console.log("adding ?", perm);
                if(!stg.ships[items[item].owner] || stg.ships[items[item].owner].level != 'admin') {
                  (window as any).urbit.poke({
                    app: "engram",
                    mark: "post",
                    json: { [items[item].type]: { [`add${type}`]: {
                      id: item,
                      [type]: perm,
                      level: level
                    }}}
                  })
                }
              })
            })
          })
        },
        spanningremove: function(perm: string, level: string, type: string) {
          (window as any).urbit.scry({
            app: "engram", path: `/space${this.$route.query.spaceId}/list`
          }).then((items: any) => {
            console.log("spannign add: ", items);
            Object.keys(items).forEach((item: string) => {
              (window as any).urbit.scry({ app: "engram", path: `/${items[item].type}${item}/get/settings`})
              .then((stg: any) => {
                console.log("settings: ", stg);
                if(!stg.ships[items[item].owner] || stg.ships[items[item].owner].level != 'admin') {
                  let timestamp = "";
                  Object.keys(stg[`${type}s`]).forEach((id: string) => {
                    if(stg[`${type}s`][id][type] == perm && stg[`${type}s`][id].level == level) {
                      timestamp = id;
                    }
                  });
                  console.log("timestamp: ", timestamp);
                  (window as any).urbit.poke({
                    app: "engram",
                    mark: "post",
                    json: { [items[item].type]: { removeperms: {
                      id: item,
                      item: timestamp,
                      type: type
                    }}}
                  })
                }
              })
            })
          })
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
  