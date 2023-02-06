import type { GetterTree, MutationTree, ActionTree, Module, Getter } from "vuex"
import type { Snapshot } from "yjs";
import { encodeSnapshot, decodeSnapshot } from "yjs";
import type { Patp } from "@urbit/http-api"
import type { RootState } from "./index"
import schema from "@/components/document/prosemirror/schema";
import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import * as Y from "yjs";
import { ySyncPlugin } from "y-prosemirror";

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

export interface VersionMeta {
  author: Patp;
  date: Date;
}

export interface DocumentUpdate {
  timestamp: string,
  author: Patp,
  content: string
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
  },

  export: (state) => (id: string): Promise<string> => {
    return new Promise((resolve) => {
      (window as any).urbit.scry({ 
        app: "engram", 
        path: `/document${id}/get`
      }).then((res: any) => {
        const doc = new Y.Doc();
        doc.clientID = 0;
        doc.gc = false;
        const content = new Uint8Array(JSON.parse(res.content));
        if(content.length > 0) {
          Y.applyUpdate(doc, content);
        }
        const type = doc.getXmlFragment("prosemirror");
        const state = EditorState.create({
          schema: schema,
          plugins: [
            // CRDT
            ySyncPlugin(type, {}),
          ],
        });
        const el = document.createElement("body");
        const view = new EditorView(el, {
          state,
        });
        setTimeout(() => {
          resolve(el.outerHTML);
        }, 80);
      })
    })
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
    save({ dispatch }, payload: { id: string, content: Uint8Array, version: Uint8Array }): Promise<void> {
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
          Object.keys(response).sort((a, b) => { return response[b].timestamp - response[a].timestamp}).forEach((timestamp: string) => {
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
    snap({ state, commit }, payload: { id: string, snapshot: Snapshot, author?: Patp }): Promise<void> {
        return new Promise((resolve, reject) => {
          let novel = true;
          const timestamp = Date.now();
          state.revisions.forEach((version: DocumentVersion) => {
            if(novel && version.author == `~${(window as any).ship}`) {
              novel = timestamp > version.timestamp + 1000 * 60 * 60;
            }
          })
          if(novel) {
            const version: DocumentVersion = {
              author: payload.author ? payload.author : `~${(window as any).ship}`,
              timestamp: timestamp,
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
          }
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