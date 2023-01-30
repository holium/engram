import type { Module, GetterTree, MutationTree, ActionTree } from "vuex"
import type { Patp } from "@urbit/http-api"
import * as Y from "yjs"
import type { Snapshot } from "yjs"
import type {
  RootState,
  RevisionState,
  DocumentVersion,
  DocumentUpdate,
} from "./types"

const state: RevisionState = [];

const getters: GetterTree<RevisionState, RootState> = {
  versions: (state): Array<{ author: Patp, date: Date}> => {
    return state.map((version) => {
      return { author: version.author, date: version.date }
    }).filter((version, i, arr) => {
      if(i == 0) return true;
      return arr[i - 1].date.getTime() - version.date.getTime() > 1000 * 60 * 20;
    })
  },
  version: (state) => (index: number) => {
    return state.filter((version, i, arr) => {
      if(i == 0) return true;
      return arr[i - 1].date.getTime() - version.date.getTime() > 1000 * 60 * 20;
    })[index]
  }
}

const mutations: MutationTree<RevisionState> = {
  // Management
  open(state, payload: Array<DocumentVersion>) {
    state.splice(0, state.length);
    payload.sort((a, b) => {
      return a.timestamp > b.timestamp ? -1 : 1;
    }).forEach((version) => {
      state.push(version);
    })
  },
  close(state) {
    state.splice(0, state.length);
  },

  add(state, payload: DocumentVersion) {
      state.push(payload);
      state.sort((a, b) => {
        return a.timestamp > b.timestamp ? -1 : 1;
      });
  },
  remove(state, payload: number) {
    state.splice(payload, 1);
  },
}

const actions: ActionTree<RevisionState, RootState> = {
  open({ commit }, payload: string) {
    (window as any).urbit.scry({ app: "engram", path: `/document/${payload}/get/snapshots`}).then((response: any) => {
      commit("open", Object.keys(response).map((timestamp: string) => {
        return {
          author: response[timestamp].author,
          snapshot: Y.decodeSnapshot(new Uint8Array(JSON.parse(response[timestamp].content))),
          timestamp: response[timestamp].timestamp,
          date: new Date(response[timestamp].timestamp),
        }
      }))
    });
  },
  close({ commit }) {
    commit("close");
  },
  
  snap({ commit }, payload: { id: string, snapshot: Snapshot, author?: Patp }): Promise<void> {
    return new Promise((resolve, reject) => {
      const version = {
        author: payload.author ? payload.author : `~${(window as any).ship}`,
        timestamp: Date.now(),
        snpashot: payload.snapshot,
        date: new Date()
      }
      commit("add", version);
      (window as any).urbit.poke({
        app: "engram",
        mark: "post",
        json: { "document": { "snap": {
          id: payload.id,
          snapshot: {
            author: version.author,
            timestamp: version.timestamp,
            data: JSON.stringify(Array.from(Y.encodeSnapshot(payload.snapshot)))
          }
        }}}
      }).then(() => {
        resolve();
      })
    })
  },
  
  accept({}, payload: { id: string, update: DocumentUpdate }): Promise<void> {
    return new Promise((resolve, reject) => {
      (window as any).urbit.poke({
        app: "engram",
        mark: "post",
        json: { "document": { "accept": {
          id: payload.id,
          update: {
            author: payload.update.author,
            timestamp: payload.update.timestamp,
            content: JSON.stringify(Array.from(payload.update.content))
          }
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