import type { Module, GetterTree, MutationTree, ActionTree, Action } from "vuex"
import type {
    RootState,
  } from "./index"
import type { RolePermission, ShipPermission } from "./filesystem";
import router from "@/router/index";


export interface Space {
  path: string;
  name: string;
  picture: string;
  color: string;
  myroles: Array<string>,
  roles: { [key: string]: RolePermission },
  ships: { [key: string]: ShipPermission },
  members: Array<string>
}

export interface SpaceState {
  path: string,
  name: string,
  picture: string,
  color: string,
  myroles: Array<string>,
  roles: { [key: string]: RolePermission },
  ships: { [key: string]: ShipPermission },
  members: Array<any>
}

export const nullspace = {
  path: `/~${(window as any).ship}/our`, 
  name: "Local", 
  color: "#262626",
  picture: "",
  myroles: ["admin"],
  ships: {},
  roles: {},
  members: []
}

const state: SpaceState = {
    name: "",
    path: "",
    picture: "",
    color: "",
    myroles: [],
    ships: {},
    roles: {},
    members: []
}



const getters: GetterTree<SpaceState, RootState> = {
    get(state) {
        return state;
    },
    path(state) {
        return state.path;
    },
    name(state) {
        return state.name;
    },
    color(state) {
        return state.color;
    },
    myroles(state) {
      return state.myroles;
    },
    ships(state) {
      return state.ships;
    },
    roles(state) {
      return state.roles;
    },
}

const mutations: MutationTree<SpaceState> = {
    load(state, payload: Space) {
        state.path = payload.path;
        state.name = payload.name;
        state.picture = payload.picture;
        state.color = payload.color;
        

        state.myroles = payload.myroles;
        if(payload.myroles.includes("owner")) state.myroles.push("admin");
        if( payload.myroles.includes("admin")) state.myroles.push("member");
        if(payload.myroles.includes("member")) state.myroles.push("visitor")
    },
    loadperms(state, payload: { roles: { [key: string]: RolePermission }, ships: { [key: string]: ShipPermission }}) {
      state.ships = payload.ships;
      state.roles = payload.roles;
    },
}

const actions: ActionTree<SpaceState, RootState> = {
    load({ commit, dispatch }, payload: string): Promise<Space> {
        return new Promise((resolve, reject) => {
          (window as any).urbit.scry({ app: "spaces", path: `${payload}/members/~${(window as any).ship}` }).then((member: any) => {
            (window as any).urbit.scry({ app: "spaces", path: `${payload}` }).then((response: any) => {
                commit("load", { ...response.space, myroles: member.member.roles});
                resolve(response.space);
              });

              (window as any).urbit.scry({ app: "engram", path: `/space${payload}/perms`}).then((res: any) => {
                commit("loadperms", res);
              }).catch(() => {
                console.warn("space missing... retrying");
                setTimeout(() => {
                  dispatch("load", payload).then((res) => { resolve(res); });
                }, 200);
              })
            }).catch((err: any) => {
              console.warn("space missing!!", err);
              commit("load", nullspace)
              resolve(nullspace);
            })
        })
    },
    perms({ commit }, payload: string): Promise<void> {
      return new Promise((resolve) => {
        (window as any).urbit.scry({ app: "engram", path: `/space${payload}/perms` }).then((response: any) => {
            commit("loadperms", response);
        });
      })
    },
    addperm({ dispatch, state }, payload: { id: string, perm: string, level: string, type: string}): Promise<void> {
      return new Promise((resolve) => {
        (window as any).urbit.poke({
          app: "engram",
          mark: "post",
          json: {
            space: { addperm: {
              space: payload.id,
              perm: payload.perm,
              level: payload.level,
              type: payload.type
            }}
          }
        }).then(() => {
          dispatch("perms", payload.id);
          (window as any).urbit.scry({app: "engram", path: `/space${payload.id}/list`}).then((res: any) => {
            Promise.all(Object.keys(res).map((item: string) => {
              dispatch("filesys/addperm", {
                item: res[item], 
                perm: payload.perm, 
                level: payload.level, 
                type: payload.type},
              { root: true });
            })).then(() => { 
              resolve();
            });
          })
        })
      })
    },
    removeperm({ state, dispatch }, payload: { id: string, timestamp: string, type: "roles" | "ships" }): Promise<void> {
      return new Promise((resolve) => {
        const perm = (state as any)[payload.type][payload.timestamp];
        (window as any).urbit.poke({
          app: "engram",
          mark: "post",
          json: {
            space: { removeperm: {
              space: payload.id,
              timestamp: payload.timestamp,
              type: payload.type
            }}
          }
        }).then(() => {
          dispatch("perms", payload.id);
          (window as any).urbit.scry({app: "engram", path: `/space${payload.id}/list`}).then((res: any) => {
            Promise.all(Object.keys(res).map((item: string) => {
              dispatch("filesys/findremoveperm", { 
                item: res[item], 
                perm: perm[payload.type == "ships" ? "ship":"role"], 
                level: perm.level, 
                type: payload.type
              }, { root: true });
            })).then(() => { 
              resolve();
            });
          })
        })
      })
    },
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
} as Module<SpaceState, RootState>