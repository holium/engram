import type { Module, GetterTree, MutationTree, ActionTree, Action } from "vuex"
import type {
    RootState,
    SpaceState,
    Space,
  } from "./types"
 import router from "@/router/index";


const state: SpaceState = {
    name: "",
    path: "",
    image: "",
    color: "",
    roles: [],
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
    roles(state) {
      return state.roles;
    }
}

const mutations: MutationTree<SpaceState> = {
    load(state, payload: Space) {
        state.path = payload.path;
        state.name = payload.name;
        state.image = payload.image;
        state.color = payload.color;
        state.roles = payload.roles;
    }
}

const actions: ActionTree<SpaceState, RootState> = {
    load({ commit }, payload: string): Promise<Space> {
        return new Promise((resolve, reject) => {
          (window as any).urbit.scry({ app: "spaces", path: `${payload}/members/~${(window as any).ship}` }).then((member: any) => {
            (window as any).urbit.scry({ app: "spaces", path: `${payload}` }).then((response: any) => {
                console.log("load space res:", member, response);
                commit("load", { ...response.space, roles: member.member.roles});
                resolve(response.space);
              })
            }).catch((err: any) => {
              console.warn("spaces agent missing!!", err);
              const nullspace = {
                  path: `/~${(window as any).ship}/our`, 
                  name: "Local", 
                  color: "#262626",
                  image: "",
                  roles: []
              }
              commit("load", nullspace)
              resolve(nullspace);
            })
        })
    },
    addship({ commit }, payload: { id: string, ship: string, level: string }): Promise<void> {
        return new Promise((resolve, reject) => {
          commit("setShip", payload);
          (window as any).urbit.poke({
            app: "engram",
            mark: "post",
            json: {
              space: { addship: {
                id: payload.id,
                ship: payload.ship,
                level: payload.level,
              }}
            }
          })
        })
    },
    addrole({ commit }, payload: { id: string, role: string, level: string }): Promise<void> {
      return new Promise((resolve, reject) => {
        commit("setRole", payload);
        (window as any).urbit.poke({
          app: "engram",
          mark: "post",
          json: {
              space: { addrole: {
              id: payload.id,
              role: payload.role,
              level: payload.level,
            }}
          }
        })
      })
    },
    addperm({ dispatch, state }, payload: { id: string, perm: string, level: string, type: string}): Promise<void> {
      return new Promise((resolve) => {
        (window as any).urbit.poke({
          app: "engram",
          mark: "post",
          json: {
            space: { addperm: {
              id: payload.id,
              perm: payload.perm,
              level: payload.level,
              type: payload.type
            }}
          }
        }).then(() => {
          (window as any).urbit.scry({app: "engram", path: `/space${router.currentRoute.value.query.spaceId}/list`}).then((res: any) => {
            Promise.all(Object.keys(res).map((item: string) => {
              dispatch(`${res[item].type}s/addperm`, { id: item, perm: payload.perm, level: payload.level, type: res[item].type}, { root: true });
            })).then(() => { 
              resolve();
            });
          })
        })
      })
    },
    removeperm({ dispatch, state }, payload: { id: string, timestamp: string, type: string, perm: string, level: string }): Promise<void> {
      return new Promise((resolve) => {
        (window as any).urbit.poke({
          app: "engram",
          mark: "post",
          json: {
            space: { removeperm: {
              id: payload.id,
              timestamp: payload.timestamp,
              type: payload.type
            }}
          }
        }).then(() => {
          (window as any).urbit.scry({app: "engram", path: `/space${router.currentRoute.value.query.spaceId}/list`}).then((res: any) => {
            Promise.all(Object.keys(res).map((item: string) => {
              dispatch(`${res[item].type}s/findremoveperm`, { 
                id: item, 
                perm: payload.perm, 
                level: payload.level, 
                type: res[item].type
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