import type { Module, GetterTree, MutationTree, ActionTree, Action } from "vuex"
import type {
    RootState,
  } from "./index"
import type { RolePermission } from "./filesystem";

export interface Space {
  path: string;
  name: string;
  picture: string;
  color: string;
  myroles: Array<string>,
  roles: { [key: string]: RolePermission },
  members: Array<string>
}

export interface SpaceState {
  path: string,
  name: string,
  picture: string,
  color: string,
  myroles: Array<string>,
  roles: { [key: string]: RolePermission },
  members: Array<any>
}

export const nullspace = {
  path: `/~${(window as any).ship}/our`, 
  name: "Local", 
  color: "#262626",
  picture: "",
  myroles: ["owner"],
  roles: {},
  members: []
}

const state: SpaceState = {
    name: "",
    path: "",
    picture: "",
    color: "",
    myroles: [],
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
    loadroles(state, payload: { roles: { [key: string]: RolePermission }}) {
      console.log("loading roles: ", payload);
      state.roles = payload.roles;
    },
}

const actions: ActionTree<SpaceState, RootState> = {
    load({ commit, dispatch }, payload: string): Promise<Space> {
        return new Promise<Space>((resolve) => {
          const loadroles = () => {
            (window as any).urbit.scry({ app: "engram", path: `/space${payload}/perms`}).then((res: any) => {
              commit("loadroles", res);
              resolve(res as Space);
            }).catch(() => {
              console.warn("space missing... retrying");
              setTimeout(() => {
                dispatch("load", payload).then((res) => { resolve(res); });
              }, 200);
            });
          };

          (window as any).urbit.scry({ app: "spaces", path: `${payload}/members/~${(window as any).ship}` }).then((member: any) => {
            (window as any).urbit.scry({ app: "spaces", path: `${payload}` }).then((response: any) => {
                commit("load", { ...response.space, myroles: member.member.roles});
                resolve(response.space);
              });

              loadroles();
            }).catch((err: any) => {
              console.warn("space missing!!", err);
              commit("load", nullspace);

              loadroles();
            })
        })
    },
    roles({ commit }, payload: string): Promise<void> {
      return new Promise((resolve) => {
        (window as any).urbit.scry({ app: "engram", path: `/space${payload}/perms` }).then((response: any) => {
            commit("loadroles", response);
        });
      })
    },
    perms({}) {
      console.error("SHOULD NOT BE CALLING space/perms");
    },
    addrole({ dispatch, state }, payload: { id: string, perm: string, level: string, type: string}): Promise<void> {
      return new Promise((resolve) => {
        (window as any).urbit.poke({
          app: "engram",
          mark: "post",
          json: {
            space: { addperm: {
              space: payload.id,
              perm: payload.perm,
              level: payload.level,
            }}
          }
        }).then(() => {
          dispatch("roles", payload.id);
        })
      })
    },
    removerole({ state, dispatch }, payload: { id: string, timestamp: string}): Promise<void> {
      return new Promise((resolve) => {
        const perm = state.roles[payload.timestamp];
        (window as any).urbit.poke({
          app: "engram",
          mark: "post",
          json: {
            space: { removeperm: {
              space: payload.id,
              timestamp: payload.timestamp,
            }}
          }
        }).then(() => {
          dispatch("roles", payload.id);
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