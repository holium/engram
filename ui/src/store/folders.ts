import type { Module, GetterTree, MutationTree, ActionTree } from "vuex"
import router from "@/router/index";
import type {
  RootState,
  FolderState,
  Folder,
  ItemMeta
} from "./types"
import { Item } from "yjs";
import store from ".";

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
    return state["."].content;
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
  loadcontent(state, payload: { id: string, content: { [key:string]: { id: string, type: string }} }) {
    state[payload.id].content = payload.content;
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

  make({ commit, rootGetters }, payload: { name: string }): Promise<string> {
    return new Promise((resolve, reject) => {
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
          commit("load", {
            id: path,
            name: payload.name,
            owner: `~${(window as any).ship}`,
            content: {},
          });
          resolve(path);
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

  add({ commit, dispatch }, payload: { to: string, item: { index: string, id: string, type: string}}): Promise<void> {
    return new Promise((resolve, reject) => {
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
        }).then(() => {
          (window as any).urbit.scry({ app: "engram", path: `/folder${payload.to}/get`}).then((res: any) => {
            const content = {} as any;
            Object.keys(res).forEach((timestamp: string) => {
              content[timestamp] = { id: timestamp, ...res[timestamp] };
            });
            commit("loadcontent", { id: payload.to, content: content });
          });
          (window as any).urbit.scry({ app: "engram", path: `/folder${payload.to}/get/settings`}).then((res: any) => {
            Object.keys(res.roles).forEach((role: string) => {
              dispatch(`${payload.item.type}s/addperm`, {
                id: payload.item.id,
                type: "roles",
                perm: res.roles[role].perm,
                level: res.roles[role].level
              }, { root: true})
            });
            Object.keys(res.ships).forEach((ship: string) => {
              dispatch(`${payload.item.type}s/addperm`, {
                id: payload.item.id,
                type: "ships",
                perm: res.ships[ship].perm,
                level: res.ships[ship].level
              }, { root: true})
            });
          });
        })
      }
    })
  },
  softremove({ commit, state }, payload: { from: string, index: string}): Promise<void> {
    return new Promise((resolve, reject) => {
      console.log("soft removing: ", payload);
      console.log("from: ", state[payload.from]);
      console.log("content: ", state[payload.from].content);
      commit("remove", payload);
      resolve();
    });
  },
  remove({ commit, dispatch, state }, payload: { from: string, index: string}): Promise<void> {
    return new Promise((resolve, reject) => {
      const item = state[payload.from].content[payload.index]
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
          (window as any).urbit.scry({ app: "engram", path: `/folder${payload.from}/get/settings`}).then((res: any) => {
            Object.keys(res.roles).forEach((role: string) => {
              dispatch(`${item.type}s/findremoveperm`, {
                id: item.id,
                type: "roles",
                perm: res.roles[role].perm,
                level: res.roles[role].level
              }, { root: true})
            });
            Object.keys(res.ships).forEach((ship: string) => {
              dispatch(`${item.type}s/findremoveperm`, {
                id: item.id,
                type: "ships",
                perm: res.ships[ship].perm,
                level: res.ships[ship].level
              }, { root: true})
            });
          });
          resolve();
        })
      }
    })
  },
  addperm({ dispatch, state }, payload: { id: string, perm: string, level: string, type: string}): Promise<void> {
    return new Promise((resolve) => {
      (window as any).urbit.poke({
        app: "engram",
        mark: "post",
        json: {
          folder: { addperm: {
            id: payload.id,
            perm: payload.perm,
            level: payload.level,
            type: payload.type
          }}
        }
      }).then(() => {
        Promise.all(Object.keys(state[payload.id].content).map((item: string) => {
          dispatch(`${state[payload.id].content[item].type}s/addperm`, { 
            id: state[payload.id].content[item].id, 
            perm: payload.perm, 
            level: payload.level, 
            type: payload.type
          }, { root: true })
        })).then(() => { 
          resolve();
        });
      })
    })
  },
  removeperm({ dispatch, state }, payload: { id: string, timestamp: string, type: string, perm: string, level: string }): Promise<void> {
    return new Promise((resolve) => {
      (window as any).urbit.poke({
        app: "engram",
        mark: "post",
        json: {
          folder: { removeperm: {
            id: payload.id,
            timestamp: payload.timestamp,
            type: payload.type
          }}
        }
      }).then(() => {
        Promise.all(Object.keys(state[payload.id].content).map((item: string) => {
          dispatch(`${state[payload.id].content[item].type}s/findremoveperm`, { 
            id: state[payload.id].content[item].id, 
            perm: payload.perm, 
            level: payload.level, 
            type: payload.type
          }, { root: true })
        })).then(() => { 
          resolve();
        });
        resolve();
      })
    })
  },
  findremoveperm({ dispatch }, payload: { id: string, type: string, perm: string, level: string }): Promise<void> {
    return new Promise((resolve) => {
      (window as any).urbit.scry({
        app: "engram",
        path: `/folder${payload.id}/get/settings`
      }).then((res: any) => {
        const closeenough = Object.keys(res[payload.type]).find((key: string) => {
          return res[payload.type][key].perm == payload.perm && res[payload.type][key].level == payload.level;
        });
        dispatch("removeperm", {
          id: payload.id,
          timestamp: closeenough,
          type: payload.type,
          perm: payload.perm,
          level: payload.level,
        }).then(() => {
          resolve();
        })
      })
      
    })
  },

  getupdate({ commit }, payload: string) {
    (window as any).urbit.scry({
      app: "engram",
      path: `/folder${payload}/get/settings`
    }).then((res: any) => {
      console.log("get settings res: ", res);
      (window as any).urbit.scry({
        app: "engram",
        path: `/folder${payload}/list`
      }).then((content: any) => {
        console.log("get res: ", content);
        commit("load", {
          id: payload,
          name: res.name,
          owner: res.owner,
          content: content,
        });
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
}
