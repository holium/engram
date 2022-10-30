import type { Module, GetterTree, MutationTree, ActionTree } from "vuex"
import type { Patp } from "@urbit/http-api"
import type {
  RootState,
  RevisionState,
  DocumentVersion,
} from "./types"

const state: RevisionState = [];

const getters: GetterTree<RevisionState, RootState> = {
  versions: (state): Array<{ author: Patp, date: Date}> => {
    return state.map((version) => {
      return { author: version.author, date: version.date }
    })
  },
  version: (state) => (index: number) => {
    return state[index]
  }
}

const mutations: MutationTree<RevisionState> = {
  load(state, payload: Array<DocumentVersion>) {
    state = payload;
  },
  add(state, payload: DocumentVersion) {
      state.push(payload);
      state.sort((a, b) => {
        return a.timestamp > b.timestamp ? 1 : -1;
      })
  },
  remove(state, payload: number) {
    state.splice(payload, 1);
  },
}

export default {
  namespace: true,
  state,
  getters,
  mutations
}
