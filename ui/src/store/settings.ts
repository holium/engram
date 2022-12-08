import type { Patp } from "@urbit/http-api";
import type {
  RootState,
  SettingsState,
} from "./types"
import type { Module, GetterTree, MutationTree, ActionTree } from "vuex"
import router from "@/router/index"

const state: SettingsState = {
  roles: {},
  ships: {},
}

const getters: GetterTree<SettingsState, RootState> = {
  roles(state) {
    return state.roles;
  },
  ships(state) {
    return state.ships;
  },
  "role-permission": (state) => (role: string) => {
    return state.roles[role];
  },
  "ship-permission": (state) => (ship: Patp) => {
    return state.ships[ship];
  }
}

const mutations: MutationTree<SettingsState> = {
  open(state, payload: SettingsState) {
    state.ships = payload.ships;
    state.roles = payload.roles;
  },
  close(state) {
    state.roles = {};
    state.ships = {};
  },

  // Role Management -----------------------------------------------------------
  setRole(state, payload: { role: string, level: string}) {
    state.roles[`${Date.now()}`] = { role: payload.role, level: payload.level};
  },
  deleteRole(state, payload: string) {
    delete state.roles[payload];
  },

  // Ship Management -----------------------------------------------------------
  setShip(state, payload: { ship: Patp, level: string}) {
    state.ships[`${Date.now()}`] = { ship: payload.ship, level: payload.level};
  },
  deleteShip(state, payload: string) {
    delete state.ships[payload];
  },
}

const actions: ActionTree<SettingsState, RootState> = {
  open({ commit }, payload: string) {
    (window as any).urbit.scry({ app: "engram", path: `/document/${payload}/get/settings`}).then((response: any) => {
      console.log("settings response", response);
      commit("open", {
        roles: response.roles,
        ships: response.ships
      })
    })
  },
  close({ commit }) {
    commit("close");
  },

  addship({ commit, dispatch }, payload: { id: string, ship: string, level: string }): Promise<void> {
    return new Promise((resolve, reject) => {
      commit("setShip", payload);
      (window as any).urbit.poke({
        app: "engram",
        mark: "post",
        json: {
          document: { addship: {
            id: payload.id,
            ship: payload.ship,
            level: payload.level,
          }}
        }
      }).then(() => {
        dispatch('open', `${router.currentRoute.value.params.author}/${router.currentRoute.value.params.clock}`)
      })
    })
  },
  addrole({ commit, dispatch }, payload: { id: string, role: string, level: string }): Promise<void> {
    return new Promise((resolve, reject) => {
      commit("setRole", payload);
      (window as any).urbit.poke({
        app: "engram",
        mark: "post",
        json: {
          document: { addrole: {
            id: payload.id,
            role: payload.role,
            level: payload.level,
          }}
        }
      }).then(() => {
        dispatch('open', `/${router.currentRoute.value.params.author}/${router.currentRoute.value.params.clock}`);
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
} as Module<SettingsState, RootState>
