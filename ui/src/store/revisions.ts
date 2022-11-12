import type { Module, GetterTree, MutationTree, ActionTree } from "vuex"
import type { Patp } from "@urbit/http-api"
import * as Y from "yjs"
import type { Snapshot } from "yjs"
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
  // Management
  open(state, payload: Array<DocumentVersion>) {
    state = payload;
  },
  close(state) {
    state = [];
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

const actions: ActionTree<RevisionState, RootState> = {
  open({ commit }, payload: string) {
    (window as any).urbit.scry({ app: "engram", path: `/document/${payload}/get/snapshots`}).then((response: any) => {
      console.log("versions response: ", response);
      commit("open", Object.keys(response).map((timestamp: string) => {
        return {
          author: response[timestamp].author,
          snapshot: Y.decodeSnapshot(Uint8Array.from(Object.keys(response[timestamp].snapshot).map(key => response[timestamp].snapshot[key]))),
          timestamp: parseInt(timestamp),
          date: new Date(response[timestamp].timestamp),
        }
      }))
    })
  },
  close({ commit }) {
    commit("close");
  },

  snap({ commit }, payload: { id: string, snapshot: Snapshot }): Promise<void> {
    return new Promise((resolve, reject) => {
      const version = {
        author: (window as any).ship,
        timestamp: Date.now(),
        snpashot: payload.snapshot
      }
      console.log("saving snapshot: ", version);
      commit("add", version);
      (window as any).urbit.poke({
        app: "engram",
        mark: "post",
        json: { "document": { "snap": {
          id: payload.id,
          author: version.author,
          timestamp: version.timestamp,
          snpashot: JSON.stringify(Array.from(Y.encodeSnapshot(payload.snapshot)))
        }}}
      }).then(() => {
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
  actions
} as Module<RevisionState, RootState>