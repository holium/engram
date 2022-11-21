import type { Module, GetterTree, MutationTree, ActionTree, Action } from "vuex"
import type {
    RootState,
    SpaceState,
    Space,
  } from "./types"


const state: SpaceState = {
    name: "",
    path: "",
    image: "",
    color: ""
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
    }
}

const mutations: MutationTree<SpaceState> = {
    load(state, payload: Space) {
        state.path = payload.path;
        state.name = payload.name;
        state.image = payload.image;
        state.color = payload.color;
    }
}

const actions: ActionTree<SpaceState, RootState> = {
    load({ commit }, payload: string): Promise<Space> {
        return new Promise((resolve, reject) => {
            (window as any).urbit.scry({ app: "spaces", path: `${payload}` }).then((response: any) => {
                console.log("load space res:", response);
                commit("load", { path: payload, ...response.space})
                resolve(response.space);
              }).catch((err: any) => {
                console.warn("spaces agent missing!!", err);
                const nullspace = {
                    path: (window as any).ship, 
                    name: (window as any).ship, 
                    color: "#262626",
                    image: ""
                }
                commit("load", nullspace)
                reject(nullspace);
              })
        })
    }
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
} as Module<SpaceState, RootState>