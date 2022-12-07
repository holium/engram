import type { Module, GetterTree, MutationTree, ActionTree } from "vuex"
import router from "@/router/index";
import type {
  RootState,
  FolderState,
  Folder,
  ItemMeta
} from "./types"
import { Item } from "yjs";

const state: FolderState = {
  ".": {
    id: ".",
    name: "root",
    owner: "",
    content: {}
  }
}

const getters: GetterTree<FolderState, RootState> = {
  name: (state) => (id: string): string => {
    return state[id].name;
  },
  meta: (state) => (id: string): ItemMeta => {
    console.log("getting meta: ", id);
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
    return Object.keys(state[id].content).filter((id) => (state[id].content[id].type == "document"))
  },
  folders: (state) => (id: string): Array<string> => {
    return Object.keys(state[id].content).filter((id) => (state[id].content[id].type == "folder"))
  },

  root: (state) => {
    return Object.keys(state["."].content).map((id) => state["."].content[id]);
  },
}

const mutations: MutationTree<FolderState> = {
  // Management ----------------------------------------------------------------
  load(state, payload: Folder) {
    state[payload.id] = payload;
    state["."].content[payload.id] = {id: payload.id, type: "folder" };
    Object.keys(payload.content).forEach((item) => {
      delete state["."].content[payload.content[item].id];
    })
  },
  clear(state) {
    Object.keys(state).forEach((key: string) => {
      delete state[key];
    });
    state["."] = {
      id: ".",
      name: "root",
      owner: "",
      content: {}
    }
  },

  delete(state, payload: string) {
    const content = state[payload].content;
    delete state[payload];
    Object.keys(content).forEach((item) => {
      state["."].content[item] = content[item];
    })
  },

  rename(state, payload: { id: string, name: string }) {
    state[payload.id].name = payload.name;
  },

  // Moving -------------------------------------------------------------------
  add(state, payload: { item: { index: string, id: string, type: string}, to: string }) {
    state[payload.to].content[payload.item.index] = { id: payload.item.id, type: payload.item.type };
  },
  remove(state, payload: { index: string, from: string }) {
    delete state[payload.from].content[payload.index]
  }
}

const actions: ActionTree<FolderState, RootState> = {
  load({ commit, state }, payload): Promise<void> {
    console.log("loading folder: ", payload, state);
    return new Promise<void>((resolve, reject) => {
      commit("load", {
        id: payload.id,
        name: payload.name,
        owner: payload.owner,
        content: payload.content
      });
      resolve();
      (window as any).urbit.poke({ 
        app: "engram", 
        mark: "post",
        json: {
          folder: {
            gatherall: {
              id: `${payload.id}`,
            }
          }
        }
      })
    })
  },
  clear({ commit }) {
    commit("clear");
  },

  make({ commit, rootGetters }, payload: { name: string }): Promise<Document> {
    return new Promise((resolve, reject) => {
      console.log("making folder");
      (window as any).urbit.poke({
        app: "engram",
        mark: "post",
        json: { "folder": { "make": {
          owner: `~${(window as any).ship}`,
          name: payload.name,
          space: `${router.currentRoute.value.query.spaceId == null ? "/~/-" : router.currentRoute.value.query.spaceId}`,
          roles: {},
          ships: {},
        }}}
      }).then(() => {
        rootGetters['lastOrganism']().then((path: string) => {
          console.log("last organism: ", path);
          commit("load", {
            id: path,
            name: payload.name,
            owner: `~${(window as any).ship}`,
            content: {},
          });
        });
      })
    })
  },
  delete({ commit, dispatch, state }, payload: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const content = state[payload].content;
      Object.keys(content).forEach((item: string) => {
        dispatch(`${content[item].type}s/delete`, content[item].id, { root: true });
      });
      commit('delete', payload);
      (window as any).urbit.poke({
        app: "engram",
        mark: "post",
        json: {
          folder: { delete: {
            id: payload
          }}
        }
      }).then(() => {
        resolve();
      })
    })
  },
  rename({ commit }, payload: { id: string, name: string}): Promise<void> {
    return new Promise((resolve, reject) => {
      commit("rename", payload);
      (window as any).urbit.poke({
        app: "engram",
        mark: "post",
        json: {
          folder: {
            rename: {
              id: payload.id,
              name: payload.name
            }
          }
        }
      })
    })
  },

  add({ commit }, payload: { to: string, item: { index: string, id: string, type: string}}): Promise<void> {
    return new Promise((resolve, reject) => {
      console.log("adding item to folder: ", payload);
      if(payload.item.index) commit("add", payload);
      if(payload.to != ".") {
        (window as any).urbit.poke({
          app: "engram",
          mark: "post",
          json: {
            "folder": {
              "add": {
                to: payload.to,
                id: payload.item.id,
                type: payload.item.type
              }
            }
          }
        })
      }
    })
  },
  remove({ commit }, payload: { from: string, index: string}): Promise<void> {
    return new Promise((resolve, reject) => {
      console.log("removing item from folder: ", payload);
      commit("remove", payload);
      if(payload.from != ".") {
        (window as any).urbit.poke({
          app: "engram",
          mark: "post",
          json: {
            "folder": {
              "remove": {
                from: payload.from,
                id: payload.index,
              }
            }
          }
        }).then(() => {
          resolve();
        })
      }
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
