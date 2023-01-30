import type { GetterTree, MutationTree, ActionTree, Module, Getter } from "vuex"
import type { Snapshot } from "yjs";
import { encodeSnapshot } from "yjs";
import type { Patp } from "@urbit/http-api"
import type { RootState } from "./types"

export interface DocumentState {
    revisions: Array<DocumentVersion>
}

export interface DocumentVersion {
    author: string,
    snapshot: Snapshot,
    timestamp: number,
    date: Date
}

const state: DocumentState = {
    revisions: [],
}

export interface DocumentContent {
  content: string,
  updates: string,
}

const getters: GetterTree<DocumentState, RootState> = {
  get: () => (docId: string): Promise<DocumentContent> => {
    return (window as any).urbit.scry({ app: "engram", path: `/document${docId}/content`})
  },
}

const mutations: MutationTree<DocumentState> = {
  reset(state) {
      state.revisions = [];
  },
  snap(state, payload: DocumentVersion) {
      state.revisions.push(payload);
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

}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
} as Module<DocumentState, RootState>