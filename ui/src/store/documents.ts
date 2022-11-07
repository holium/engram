import type {
  RootState,
  DocumentState,
  Document,
  DocumentMeta,
  DocumentVersion
} from "./types"
import type { Module, GetterTree, MutationTree, ActionTree } from "vuex"
import type { Snapshot } from "yjs"
import { encodeSnapshot } from "yjs"
import { version } from "vue"

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
  clear(state) {
    state = {};
  },
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

  // Management
  load({ commit }, payload): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      commit("clear");
      (window as any).urbit.scry({ app: "engram", path: "/document/list"}).then((response: any) => {
        console.log("list response", response);
        Object.keys(response).forEach((doc: any) => {
          commit("load", {
            id: doc,
            name: response[doc].name,
            owner: response[doc].owner,
          })
        })
      })
    })
  },
  clear({ commit }) {
    commit("clear");
  },

  make({ commit }, payload: { name: string }): Promise<Document> {
    return new Promise((resolve, reject) => {
      console.log("making document")
      const clock = 0;
      (window as any).urbit.poke({
        app: "engram",
        mark: "post",
        json: { "document": { "make": {
          owner: `~${(window as any).ship}`,
          name: payload.name,
          content: "",
          version: "",
          roles: {},
          ships: {},
        }}}
      }).then(() => {
        (window as any).urbit.scry({ app: "engram", path: `/document/~${(window as any).ship}/${clock}/get`}).then((response: any) => {
          console.log("create response:", response);
          //commit("load", response)
          resolve(response);
        })
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
  snapshot({ dispatch }, payload: { id: string, snapshot: Snapshot }): Promise<void> {
    return new Promise((resolve, reject) => {
      (window as any).urbit.poke({
        app: "engram",
        mark: "post",
        json: { "document": { "snap": {
          id: payload.id,
          snapshot: JSON.stringify(Array.from(encodeSnapshot(payload.snapshot)))
        }}}
      }).then(() => {
        dispatch("revisions/snapshot", payload.snapshot, { root: true});
        resolve();
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
  } as Module<DocumentState, RootState>
