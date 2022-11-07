import type { Module, GetterTree, MutationTree, ActionTree } from "vuex"
import type {
  RootState,
  WorkspaceState,
  DocumentContent,
} from "./types"
import settings from "./settings";
import revisions from "./revisions"

const state: WorkspaceState = {
  snapshot: null,
  version: null,
  content: null,
}

const getters: GetterTree<WorkspaceState, RootState> = {
  viewing(state) {
    return state.snapshot
  },
}

const mutations: MutationTree<WorkspaceState> = {
  // Editor
  open(state, payload: { version: Uint8Array, content: Uint8Array }) {
    state.version = payload.version;
    state.content = payload.content;
  },
  close(state) {
    state.snapshot = null;
    state.version = null;
    state.content = null;
  },

  // Snapshot
  setViewing(state, payload: number) {
    state.snapshot = payload;
  },
  closeViewing(state) {
    state.snapshot = null;
  }
}

const actions: ActionTree<WorkspaceState, RootState> = {
  // Management
  close({ commit, dispatch }): Promise<void> {
    return new Promise((resolve, reject) => {
      commit("close");
      Promise.all([
        dispatch("settings/close"),
        dispatch("revisions/close")
      ]).then(() => {
        resolve();
      }).catch(() => {
        reject();
      })
    })

  },

  open({ commit, dispatch }, payload: string): Promise<DocumentContent> {
    console.log("opening document: ", payload);
    return new Promise((resolve, reject) => {
      (window as any).urbit.scry({ app: "engram", path: `/document/${payload}/get`}).then((response: any) => {
        console.log("open workspace response:", response)
        const content = {
          version: Uint8Array.from(JSON.parse(response.version)),
          content: Uint8Array.from(JSON.parse(response.content))
        }
        commit('open', content)
        resolve(content);
        //dispatch("settings/open", payload);
        //dispatch("revisions/open", payload);
      });
    })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
  modules: {
    settings,
    revisions
  }
} as Module<WorkspaceState, RootState>
