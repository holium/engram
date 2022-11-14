import type { Patp } from "@urbit/http-api";
import type {
  RootState,
  SettingsState,
  DocumnetPermission
} from "./types"
import type { Module, GetterTree, MutationTree, ActionTree } from "vuex"
import { ID } from "yjs";

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
    return state.roleperms;
  },
  ships(state) {
    return state.shipperms;
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
    state.autosync = payload.autosync;
    state.shipperms = payload.shipperms;
    state.roleperms = payload.roleperms;
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
  setRole(state, payload: { role: string, level: DocumnetPermission}) {
    state.roleperms[payload.role] = payload.level;
  },
  deleteRole(state, payload: string) {
    delete state.roleperms[payload];
  },

  // Ship Management -----------------------------------------------------------
  setShip(state, payload: { ship: Patp, level: DocumnetPermission}) {
    state.shipperms[payload.ship] = payload.level;
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
        shipperms: response.ships
      })
    })
  },
  close({ commit }) {
    commit("close");
  },

  addship({ commit }, payload: { id: string, ship: string, level: string }): Promise<void> {
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
          document: { addrole: {
            id: payload.id,
            role: payload.role,
            level: payload.level,
          }}
        }
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
