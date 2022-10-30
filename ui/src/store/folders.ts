import type { Module, GetterTree, MutationTree, ActionTree } from "vuex"
import type {
  RootState,
  FolderState,
  Folder,
} from "./types"

const notRoot: { [key: string]: true } = {

}

const state: FolderState = {

}

const getters: GetterTree<FolderState, RootState> = {
  name: (state) => (id: string): string => {
    return state[id].name;
  },
  documents: (state) => (id: string): Array<string> => {
    return state[id].documents
  },
  folders: (state) => (id: string): Array<string> => {
    return state[id].folders
  },

  rootFolders: (state, getters, rootState) => {
    return Object.keys(rootState.documents).filter(key => notRoot[key] != true);
  },
  rootDocuments: (state) => {
    Object.keys(state.folders).filter(key => notRoot[key] != true);
  }
}

const mutations: MutationTree<FolderState> = {
  // Management ----------------------------------------------------------------
  load(state, payload: Folder) {
    state[payload.id] = payload;
    payload.documents.forEach((doc) => {
      notRoot[doc] = true;
    })
    payload.folders.forEach((folder) => {
      notRoot[folder] = true;
    })
  },
  delete(state, payload: string) {
    const docs = state[payload].documents;
    const folders = state[payload].folders;
    delete state[payload];
    docs.forEach((doc) => {
      delete notRoot[doc]
    });
    folders.forEach((folder) => {
      delete notRoot[folder]
    })
  },

  setName(state, payload: { id: string, name: string }) {
    state[payload.id].name = payload.name;
  }
}

export default {
  namespace: true,
  state,
  getters,
  mutations,
}
