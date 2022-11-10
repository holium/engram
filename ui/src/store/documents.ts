import type {
  RootState,
  DocumentState,
  Document,
  DocumentMeta,
  DocumentVersion,
  ItemMeta,
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
    return {
      id: id,
      name: state[id].name,
      owner: state[id].owner,
    }
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
    console.log("loading folder: ", payload);
    return new Promise<void>((resolve, reject) => {
      commit("load", {
        id: payload.id,
        name: payload.name,
        owner: payload.owner,
      });
      resolve();
    })
  },
  clear({ commit }) {
    commit("clear");
  },

  make({ commit }, payload: { name: string }): Promise<Document> {
    return new Promise((resolve, reject) => {
      console.log("making document")
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
          space: `/${router.currentRoute.value.params.station}/${router.currentRoute.value.params.space}`,
          content: "[]",
          version: "[]",
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
      console.log("saving content:", payload);
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
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
  } as Module<DocumentState, RootState>
