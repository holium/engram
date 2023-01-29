import type { GetterTree, MutationTree, ActionTree, Module } from "vuex"
import type {
    RootState,
} from "./types"
import * as Y from "yjs";

export interface SysRecord {
    id: string,
    type: "document" | "folder"
}

export interface SysItem {
    id: string,
    type: "document" | "folder",
    name: string,
    children?: {
        [id: string]: SysRecord
    }
}

export interface FileSysState {
    [key: string] : SysItem,
    ".": {
        id: string,
        type: "folder",
        name: "root",
        children: { [id: string]: SysRecord },
    },
}

const state: FileSysState = {
    ".": {
        id: ".",
        type: "folder",
        name: "root",
        children: {},
    }
}

const getters: GetterTree<FileSysState, RootState> = {

    root: (state) => {
        return state["."];
    },

    // Fields
    get: (state) => (id: string): undefined | SysItem => {
        return state[id];
    },
    type: (state) => (id: string): undefined | string => {
        return state[id].type;
    },
    name: (state) => (id: string): undefined | string => {
        return state[id].name;
    },
    children: (state) => (id: string): undefined | {[id: string]: SysRecord} => {
        return state[id].children;
    },

    // Scries

    last: () => (): Promise<string> => {
        return (window as any).urbit.scry({ app: "engram", path: "/history"});
    }
}

const mutations: MutationTree<FileSysState> = {
    load(state, payload: SysItem) {
        state[payload.id] = payload;
        let root = true;
        Object.keys(state).forEach((key: string) => {
            if(state[key].children && root) {
                if(Object.keys((state[key].children as any)).map((item: string) => { 
                    return (state[key].children as any)[item].id;
                }).includes(payload.id))
                    root = false;
            }
        });
        if(root) state["."].children[payload.id] = payload;
        if(payload.type == "folder")
            Object.keys((payload.children as any)).forEach((child: string) => {
                delete state["."].children[(payload.children as any)[child].id];
            })
    },
    reset(state) {
        Object.keys(state).forEach((key: string) => {
            delete state[key];
        });
        state["."] = {
            id: ".",
            type: "folder",
            name: "root",
            children: {},
        }
    },
    delete(state, payload: SysRecord) {
        delete state[payload.id];
    },
    add(state, payload: { to: string, item: SysRecord, index: string}) {
        (state[payload.to].children as any)[payload.index] = payload.item;
    },
    remove(state, payload: { from: "string", index: string}) {
        delete (state[payload.from].children as any)[payload.index];
    }
}

const actions: ActionTree<FileSysState, RootState> = {

    // Loading...

    // Load the full lifesystem of a space
    boot({ commit, dispatch }, payload: string): Promise<void> {
        return new Promise((resolve, reject) => {
            (window as any).urbit.scry({ app: "engram", path: `/space${payload}/list` }).then((res: any) => {
                if(res == "Missing Space") {
                    // handle if the space is missing
                    (window as any).urbit.poke({
                        app: "engram",
                        mark: "post",
                        json: {
                            space: { "make": { "space": payload }}
                        }
                    }).then(() => {
                        // Gather updates
                        (window as any).urbit.poke({
                            app: "engram",
                            mark: "post",
                            json: {
                                space: { "gatherall": { "space": payload }}
                            }
                        }).then(() => {
                            // & try loading agains
                            dispatch("boot").then(() => {
                                resolve();
                            })
                        })
                    });
                } else {
                    Object.keys((res)).forEach((item: string) => {
                        commit('load', res[item]);
                    });
                    resolve();
                }
            })
        })
    },
    // Reset state
    reset({ commit }) {
        commit("reset");
    },
    // Load an individual item 
    load({ commit }, payload: SysRecord): Promise<SysItem> {
        return new Promise((resolve, reject) => {
            (window as any).urbit.scry({ app: "engram", path: `/${payload.type}${payload.id}/meta` }).then((res: any) => {
                commit('load', { ...res, type: payload.type});
                resolve(res);
            })
        })
    },
    // get like the getter but it loads the item if it's not already loaded 
    protectedget({ state, dispatch }, payload: SysRecord): Promise<SysItem> {
        return typeof state[payload.id] == "undefined" ?
            dispatch("load", payload) : new Promise((resolve) => { resolve(state[payload.id]); }); 
    },

    // Modifications

    rename({ commit, dispatch }, payload: { item: SysRecord, name: string}): Promise<void> {
        return new Promise((resolve) => {
            commit("rename", payload);
            (window as any).poke({
                app: "engram",
                mark: "post",
                json: {
                    [payload.item.type]: {
                        rename: { id: payload.item.id, name: name }
                    }
                }
            }).then(() => {
                dispatch("load", payload.item).then(() => { resolve() });
            })
        });
    },

    make({ getters, dispatch }, payload: { type: "document" | "folder", name: string, spaceId: string }): Promise<SysItem> {
        return new Promise((resolve) => {
            (async () => {
                if(payload.type == "document") {
                    const doc = new Y.Doc();
                    doc.clientID = 0;
                    doc.gc = false;
                    const type = doc.getXmlFragment("prosemirror");
                    const version = Y.encodeStateVector(doc);
                    const content = Y.encodeStateAsUpdate(doc);
                    const clock = 0;
                    await (window as any).urbit.poke({
                        app: "engram",
                        mark: "post",
                        json: { "document": { "make": {
                            owner: `~${(window as any).ship}`,
                            name: payload.name,
                            space: `${payload.spaceId}`,
                            content: "[]",
                            version: "[]",
                            roles: {},
                            ships: {},
                        }}}
                    });
                    return;
                } else if(payload.type == "folder") {
                    await (window as any).urbit.poke({
                        app: "engram",
                        mark: "post",
                        json: { "folder": { "make": {
                          owner: `~${(window as any).ship}`,
                          name: payload.name,
                          space: payload.spaceId,
                          roles: {},
                          ships: {},
                        }}}
                    });
                    return;
                }
            })().then(() => {
                getters['last']().then((path: string) => {
                    dispatch("load", {
                      id: path,
                      type: payload.type
                    }).then((res: any) => {
                        dispatch("add", { item: { id: res.id, type: res.type }, to: "." }, { root: true });
                        resolve(res);
                    })
                  });
            })
            
        });
    },
    delete({ commit, dispatch }, payload: SysRecord): Promise<void> {
        return new Promise((resolve) => {
            commit('delete', payload);
            (window as any).urbit.poke({
                app: "engram",
                mark: "post",
                json: {
                [payload.type]: { delete: {
                    id: payload.id
                }}
                }
            }).then(() => {
                resolve();
            });
        });
    },

    // add an item to a folder
    add({ state, commit, dispatch }, payload: { to: string, item: SysRecord, index?: string }): Promise<void> {
        return new Promise((resolve, reject) => {
            // reject if it's not being added to a folder
            if(state[payload.to].type != "folder") {
                console.error("can only add to a folder");
                reject();
            } else {
                // if it already has an index that means it does not need to be added in the agent
                if(payload.index) {
                    commit("add", payload);
                    resolve();
                } else {
                    // if it's not being added to the root... add it
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
                            dispatch("load", { id: payload.to, type: "folder"});
                            // handle this in perms
                            /*
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
                            */
                            resolve();
                        })
                    }
                }
            }
          })
    },

    // remove an item from a folder
    remove({ state, commit, dispatch }, payload: { from: string, index: string, soft?: boolean}): Promise<void> {
        return new Promise((resolve, reject) => {
            if(state[payload.from].type != "folder") {
                // reject 
                reject();
            } else {
                // if it's only a soft remove we don't have to modify the agent
                if(payload.soft) {
                    commit("remove", payload);
                    resolve();
                } else {
                    const item = (state[payload.from].children as any)[payload.index];
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
                            dispatch("load", { id: payload.from, type: "folder"});
                            // handle in perms
                            /*
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
                            */
                          resolve();
                        })
                      }
                } 
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
} as Module<FileSysState, RootState>