import type { Patp } from "@urbit/http-api";
import type {
  RootState,
  SettingsState,
  DocumnetPermission
} from "./types"
import type { Module, GetterTree, MutationTree, ActionTree } from "vuex"

const state: SettingsState = {
  autosync: false,
  roleperms: {},
  shipperms: {},
}

const getters: GetterTree<SettingsState, RootState> = {
  autosync(state): boolean {
    return state.autosync;
  },
  roles(state) {
    return Object.keys(state.roleperms);
  },
  ships(state) {
    return Object.keys(state.shipperms);
  },
  "role-permission": (state) => (role: string) => {
    return state.roleperms[role];
  },
  "ship-permission": (state) => (ship: Patp) => {
    return state.shipperms[ship];
  }
}

const mutations: MutationTree<SettingsState> = {
  open(state, payload: SettingsState) {
    state = payload;
  },
  close(state) {
    state.autosync = false;
    state.roleperms = {};
    state.shipperms = {};
  },

  setAutosync(state, payload: boolean) {
    state.autosync = payload;
  },

  // Role Management -----------------------------------------------------------
  setRole(state, payload: { role: string, permissions: DocumnetPermission}) {
    state.roleperms[payload.role] = payload.permissions;
  },
  deleteRole(state, payload: string) {
    delete state.roleperms[payload];
  },

  // Ship Management -----------------------------------------------------------
  setShip(state, payload: { ship: Patp, permissions: DocumnetPermission}) {
    state.shipperms[payload.ship] = payload.permissions;
  },
  deleteShip(state, payload: string) {
    delete state.shipperms[payload];
  },
}

const actions: ActionTree<SettingsState, RootState> = {
  open({ commit }, payload: string) {
    (window as any).urbit.scry({ app: "engram", path: `/document/${payload}/get/settings`}).then((response: any) => {
      console.log("settings response", response);
      commit("open", {
        autosync: response.autosync,
        roleperms: response.roles,
        shipperms: response.shipperms
      })
    })
  },
  close({ commit }) {
    commit("close");
  }
}

export default {
  namespace: true,
  state,
  getters,
  mutations,
  actions,
} as Module<SettingsState, RootState>
