import type { Module, GetterTree, MutationTree, ActionTree } from "vuex"
import type {
  RootState,
  WorkspaceState,
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

export default {
  namespace: true,
  state,
  getters,
  mutations,
  modules: {
    settings,
    revisions
  }
} as Module<WorkspaceState, RootState>
