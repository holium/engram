import type { GetterTree, MutationTree, ActionTree, Module, Getter } from "vuex"
import type { Snapshot } from "yjs";
import { encodeSnapshot, decodeSnapshot } from "yjs";
import type { Patp } from "@urbit/http-api"
import type { RootState } from "./types"

export interface DocumentState {
    revisions: Array<DocumentVersion>,
    snapshot: DocumentVersion | null,
}

export interface DocumentVersion {
    author: string,
    snapshot: Snapshot,
    timestamp: number,
    date: Date
}

const state: DocumentState = {
    revisions: [],
    snapshot: null,
}

export interface DocumentContent {
  content: string,
  updates: string,
}

const getters: GetterTree<DocumentState, RootState> = {
  get: () => (docId: string): Promise<DocumentContent> => {
    return (window as any).urbit.scry({ app: "engram", path: `/document${docId}/content`})
  },
  versions: (state): Array<DocumentVersion> => {
    return state.revisions;
  },
  version: (state) => (i: number): DocumentVersion => {
    return state.revisions[i];
  },
  previewing: (state): DocumentVersion | null => {
    return state.snapshot
  }
}

const mutations: MutationTree<DocumentState> = {
  reset(state) {
      state.revisions = [];
      state.snapshot = null;
  },
  snap(state, payload: DocumentVersion) {
      state.revisions.push(payload);
  },
  preview(state, payload: DocumentVersion | null) {
    state.snapshot = payload;
  }
}

const actions: ActionTree<DocumentState, RootState> = {
    acceptupdates({ }, payload: string) {
        (window as any).urbit.poke({
            app: "engram",
            mark: "post",
            json: { "document": { "accept": {
              id: payload,
            }}}
          })
    },
    save({}, payload: { id: string, content: Uint8Array, version: Uint8Array }): Promise<void> {
      return new Promise((resolve) => {
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
      });
    },

    versions({ commit }, payload: string): Promise<void> {
      return new Promise((resolve) => {
        commit("reset");
        (window as any).urbit.scry({ app: "engram", path: `/document${payload}/snapshots`}).then((response: any) => {
          Object.keys(response).forEach((timestamp: string) => {
            commit("snap", {
              author: response[timestamp].author,
              snapshot: decodeSnapshot(new Uint8Array(JSON.parse(response[timestamp].content))),
              timestamp: response[timestamp].timestamp,
              date: new Date(response[timestamp].timestamp),
            });
          })
        });
      })
    },
    snap({ commit }, payload: { id: string, snapshot: Snapshot, author?: Patp }): Promise<void> {
        return new Promise((resolve, reject) => {
          const version: DocumentVersion = {
            author: payload.author ? payload.author : `~${(window as any).ship}`,
            timestamp: Date.now(),
            snapshot: payload.snapshot,
            date: new Date()
          }
          commit("snap", version);
          (window as any).urbit.poke({
            app: "engram",
            mark: "post",
            json: { "document": { "snap": {
              id: payload.id,
              snapshot: {
                author: version.author,
                timestamp: version.timestamp,
                content: JSON.stringify(Array.from(encodeSnapshot(payload.snapshot)))
              }
            }}}
          }).then(() => {
            resolve();
          })
        })
    },
    preview({ commit }, payload: DocumentVersion | null): Promise<void> {
      return new Promise((resolve, reject) => {
        commit("preview", payload);
        resolve();
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