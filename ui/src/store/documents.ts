import type {
  RootState,
  DocumentState,
  Document,
  DocumentMeta,
  DocumentVersion
} from "./types"
import type { Module, GetterTree, MutationTree, ActionTree } from "vuex"

const state: DocumentState = {
  
}

const getters: GetterTree<DocumentState, RootState> = {
  list: (state): Array<DocumentMeta> => {
    return Object.keys(state).map((id: string) => {
      return {id: id, name: state[id].name, owner: state[id].owner}
    })
  },
  document: (state) => (id: string): Document => {
    return state[id];
  },
}

const mutations: MutationTree<DocumentState> = {

  // Management ----------------------------------------------------------------
  load(state, payload: Document) {
    state[payload.id] = payload;
  },
  delete(state, payload: string) {
    delete state[payload]
  },


  // Metadata
  setName(state, payload: { id: string, name: string}) {
    state[payload.id].name = payload.name;
  },
  setOwner(state, payload: { id: string, owner: string }) {
    state[payload.id].owner = payload.owner;
  },
}

const actions: ActionTree<DocumentState, RootState> = {

}

export default {
    namespace: true,
    state,
    getters,
    mutations,
    actions,
  } as Module<DocumentState, RootState>
