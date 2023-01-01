import type {
  RootState,
  DocumentState,
  DocumentMeta,
  DocumentVersion,
  ItemMeta,
  DocumentUpdate,
} from "./types"
import type { Module, GetterTree, MutationTree, ActionTree } from "vuex"
import type { Snapshot } from "yjs"
import * as Y from "yjs"
import router from "@/router/index";
import { version } from "vue"

const state: DocumentState = {

}

const getters: GetterTree<DocumentState, RootState> = {
  list: (state): Array<DocumentMeta> => {
    return Object.keys(state).map((id: string) => {
      return {id: id, name: state[id].name, owner: state[id].owner}
    })
  },
  meta: (state) => (id: string): ItemMeta => {
    if(!state[id]) return { id: "missing document", name: "missing document", owner: "missing document"};
    return {
      id: id,
      name: state[id].name,
      owner: state[id].owner,
    }
  },
  document: (state) => (id: string): DocumentMeta => {
    return state[id];
  },
  updates: (state) => (id: string): Promise<Array<DocumentUpdate>> => {
    return new Promise((resolve, reject) => {
      (window as any).urbit.scry({
        app: "engram",
        path: `/document${id}/get/updates`
      }).then((response: any) => {
        resolve(Object.keys(response).map((timestamp: string) => {
          return {
            timestamp: timestamp,
            author: response[timestamp].author,
            content: new Uint8Array(JSON.parse(response[timestamp].content))
          }
        }));
      })
    })
    
  }
}

const mutations: MutationTree<DocumentState> = {

  // Management ----------------------------------------------------------------
  clear(state) {
    Object.keys(state).forEach((key: string) => {
      delete state[key];
    })
  },
  load(state, payload: DocumentMeta) {
    state[payload.id] = payload;
  },
  delete(state, payload: string) {
    delete state[payload]
  },


  // Metadata
  rename(state, payload: { id: string, name: string}) {
    state[payload.id].name = payload.name;
  },
  setOwner(state, payload: { id: string, owner: string }) {
    state[payload.id].owner = payload.owner;
  },
}

const actions: ActionTree<DocumentState, RootState> = {

  // Management
  load({ commit, dispatch }, payload): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      commit("load", {
        id: payload.id,
        name: payload.name,
        owner: payload.owner,
      });
      dispatch("folders/add", { item: { index: payload.id, id: payload.id, type: "document" }, to: "." }, { root: true });
      resolve();
    })
  },
  clear({ commit }) {
    commit("clear");
  },

  make({ commit, dispatch, rootGetters }, payload: { name: string }): Promise<string> {
    return new Promise((resolve, reject) => {
      const doc = new Y.Doc();
      doc.clientID = 0;
      doc.gc = false;
      const type = doc.getXmlFragment("prosemirror");
      const version = Y.encodeStateVector(doc);
      const content = Y.encodeStateAsUpdate(doc);
      const clock = 0;
      (window as any).urbit.poke({
        app: "engram",
        mark: "post",
        json: { "document": { "make": {
          owner: `~${(window as any).ship}`,
          name: payload.name,
          space: `${router.currentRoute.value.query.spaceId == null ? "/~/-" : router.currentRoute.value.query.spaceId}`,
          content: "[]",
          version: "[]",
          roles: {},
          ships: {},
        }}}
      }).then(() => {
        rootGetters['lastOrganism']().then((path: string) => {
          commit("load", {
            id: path,
            name: payload.name,
            owner: `~${(window as any).ship}`,
          });
          dispatch("folders/add", { item: { index: path, id: path, type: "document" }, to: "." }, { root: true });
          resolve(path);
        });
      })
    })
  },
  delete({ commit, dispatch }, payload: string): Promise<void> {
    return new Promise((resolve, reject) => {
      commit('delete', payload);
      (window as any).urbit.poke({
        app: "engram",
        mark: "post",
        json: {
          document: { delete: {
            id: payload
          }}
        }
      }).then(() => {
        resolve();
      })
    })
  },
  save({}, payload: { id: string, content: string, version: string }): Promise<void> {
    return new Promise((resolve, reject) => {
      (window as any).urbit.poke({
        app: "engram",
        mark: "post",
        json: { "document": { "save": {
          id: payload.id,
          content: JSON.stringify(Array.from(payload.content)),
          version: JSON.stringify(Array.from(payload.version))
        }}}
      }).then(() => {
        resolve();
      })
    })
  },
  rename({ commit }, payload: { id: string, name: string }): Promise<void> {
    return new Promise((resolve, reject) => {
      commit("rename", payload);
      (window as any).urbit.poke({
        app: "engram",
        mark: "post",
        json: {
          document: {
            rename: {
              id: payload.id,
              name: payload.name
            }
          }
        }
      })
    })
  },

  addperm({ }, payload: { id: string, perm: string, level: string, type: string}): Promise<void> {
    return new Promise((resolve) => {
      (window as any).urbit.poke({
        app: "engram",
        mark: "post",
        json: {
          document: { addperm: {
            id: payload.id,
            perm: payload.perm,
            level: payload.level,
            type: payload.type
          }}
        }
      }).then(() => {
        resolve();
      })
    })
  },
  removeperm({ }, payload: { id: string, timestamp: string, type: string}): Promise<void> {
    return new Promise((resolve) => {
      (window as any).urbit.poke({
        app: "engram",
        mark: "post",
        json: {
          document: { addperm: {
            id: payload.id,
            timestamp: payload.timestamp,
            type: payload.type
          }}
        }
      }).then(() => {
        resolve();
      })
    })
  },
  findremoveperm({ }, payload: { id: string, type: string, perm: string, level: string }): Promise<void> {
    return new Promise((resolve) => {
      (window as any).urbit.scry({
        app: "engram",
        path: `/document${payload.id}/get/settings`
      }).then((res: any) => {
        const closeenough = Object.keys(res[payload.type]).find((key: string) => {
          return res[payload.type][key].perm == payload.perm && res[payload.type][key].level == payload.level;
        });
        (window as any).urbit.poke({
          app: "engram",
          mark: "post",
          json: {
            document: { removeperm: {
              id: payload.id,
              timestamp: closeenough,
              type: payload.type
            }}
          }
        }).then(() => {
          resolve();
        })
      })
      
    })
  },

  getupdate({ commit }, payload: string) {
      (window as any).urbit.scry({
        app: "engram",
        path: `/document${payload}/get/settings`
      }).then((res: any) => {
        commit("load", {
          id: payload,
          name: res.name,
          owner: res.owner
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
  } as Module<DocumentState, RootState>
