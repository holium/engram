import type { Module, GetterTree, MutationTree, ActionTree } from "vuex"
import router from "@/router/index";
import type {
  RootState,
  FolderState,
  Folder,
  ItemMeta
} from "./types"

const notRoot: { [key: string]: true } = {

}

const state: FolderState = {

}

const getters: GetterTree<FolderState, RootState> = {
  name: (state) => (id: string): string => {
    return state[id].name;
  },
  meta: (state) => (id: string): ItemMeta => {
    return {
      id: id,
      name: state[id].name,
      owner: state[id].owner,
      content: state[id].content
    }
  },
  content: (state) => (id: string): Array<string> => {
    return Object.keys(state[id].content);
  },
  documents: (state) => (id: string): Array<string> => {
    return Object.keys(state[id].content).filter((id) => (state[id].content[id] == "document"))
  },
  folders: (state) => (id: string): Array<string> => {
    return Object.keys(state[id].content).filter((id) => (state[id].content[id] == "folder"))
  },

  rootDocuments: (state, getters, rootState) => {
    return Object.keys(rootState.documents).filter(key => !notRoot[key]);
  },
  rootFolders: (state) => {
    return Object.keys(state).filter(key => !notRoot[key]);
  }
}

const mutations: MutationTree<FolderState> = {
  // Management ----------------------------------------------------------------
  load(state, payload: Folder) {
    state[payload.id] = payload;
    Object.keys(payload.content).forEach((item) => {
      notRoot[item] = true;
    })
  },
  clear(state) {
    state = {};
  },

  delete(state, payload: string) {
    const content = state[payload].content;
    delete state[payload];
    Object.keys(content).forEach((item) => {
      delete notRoot[item];
    })
  },

  setName(state, payload: { id: string, name: string }) {
    state[payload.id].name = payload.name;
  }
}

const actions: ActionTree<FolderState, RootState> = {
  load({ commit }, payload): Promise<void> {
    console.log("loading folder: ", payload);
    return new Promise<void>((resolve, reject) => {
      commit("load", {
        id: payload.id,
        name: payload.name,
        owner: payload.owner,
        content: payload.content
      });
      resolve();
    })
  },
  clear({ commit }) {
    commit("clear");
  },

  make({ commit }, payload: { name: string }): Promise<Document> {
    return new Promise((resolve, reject) => {
      console.log("making folder");
      (window as any).urbit.poke({
        app: "engram",
        mark: "post",
        json: { "folder": { "make": {
          owner: `~${(window as any).ship}`,
          name: payload.name,
          space: `/${router.currentRoute.value.params.station}/${router.currentRoute.value.params.space}`,
          roles: {},
          ships: {},
        }}}
      }).then(() => {
        //
      })
    })
  },

  add({ commit }, payload: { to: string, id: string}): Promise<void> {
    return new Promise((resolve, reject) => {
      console.log("adding item to folder: ", payload);
    })
  },
  remove({ commit }, payload: { from: string, id: string}): Promise<void> {
    return new Promise((resolve, reject) => {
      console.log("removing item from folder: ", payload);
    })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}
