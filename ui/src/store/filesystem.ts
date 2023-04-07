import type { GetterTree, MutationTree, ActionTree, Module } from "vuex"
import type {
    RootState,
} from "./index"
import * as Y from "yjs";
import router from "@/router/index"

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

    owner: string,
    space?: string,
    ships: { [key: string]: ShipPermission },

    hidden?: boolean //whether to inject into a folder or not
}

export interface FileSysState {
    [key: string] : SysItem,
    ".": {
        id: string,
        type: "folder",
        name: "root",
        children: { [id: string]: SysRecord },
        space: undefined,
        owner: "",
        ships: {},
    },
}

export interface ShipPermission {
    ship: string,
    level: string,
}

export interface RolePermission {
    role: string,
    level: string,
}

const state: FileSysState = {
    ".": {
        id: ".",
        type: "folder",
        name: "root",
        children: {},
        space: undefined,
        owner: "",
        ships: {},
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

    // Permissions
    space: (state) => (id: string): undefined | string => {
        return state[id].space;
    },
    owner: (state) => (id: string): undefined | string => {
        return state[id].owner;
    },
    ships: (state) => (id: string): undefined | { [key: string]: ShipPermission } => {
        if(state[id].type == "document") {
            return state[id].ships;
        }
    },

    // Scries

    last: () => (): Promise<string> => {
        return (window as any).urbit.scry({ app: "engram", path: "/history"});
    },
    search: () => (): Promise<Array<{ id: string, name: string }>> => {
        return new Promise((resolve, reject) => {
            (window as any).urbit.scry({ app: "engram", path: "/document/list"}).then((res: any) => {
                resolve(Object.keys(res).map((item: string) => { return { id: item, name: res[item]}}))
            })
        })
    }
}

const mutations: MutationTree<FileSysState> = {
    load(state, payload: SysItem) {
        if(state[payload.id]) state[payload.id] = {...state[payload.id], ...payload};
        else state[payload.id] = payload;

        if(!payload.hidden) {
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
                Object.keys((state[payload.id].children as any)).forEach((child: string) => {
                    delete state["."].children[(state[payload.id].children as any)[child].id];
                })
        }
        
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
            space: undefined,
            owner: "",
            ships: {},
        }
    },
    delete(state, payload: SysRecord) {
        delete state[payload.id];
    },
    rename(state, payload: { item: SysRecord, name: string}) {
        state[payload.item.id].name = payload.name;
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
            (window as any).urbit.scry({ app: "engram", path: `/space${payload}/content` }).then((res: any) => {
                if(res == "Missing Space") {
                    console.warn("trying again");
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
                            // & try loading again
                            dispatch("boot", payload).then(() => {
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
    ships({ commit, state }, payload: SysRecord): Promise<SysItem> {
        return new Promise((resolve, reject) => {
            if(state[payload.id].type == "document") {
                (window as any).urbit.scry({ app: "engram", path: `/${payload.type}${payload.id}/perms` }).then((res: any) => {
                    commit('load', { ...res, type: payload.type, id: payload.id });
                    resolve(res);
                })
            }
        })
    },
    get({ commit, state }, payload: SysRecord): Promise<SysItem> {
        return new Promise((resolve) => {
            console.warn("get: ", payload);
            (window as any).urbit.scry({ app: "engram", path: `/${payload.type}${payload.id}/meta` }).then((meta: any) => {
                if(payload.type == "document") {
                    (window as any).urbit.scry({ app: "engram", path: `/${payload.type}${payload.id}/perms` }).then((perms: any) => {
                        commit('load', { ...meta, ...perms, type: payload.type, id: payload.id });
                        resolve(state[payload.id]);
                    })
                } else {
                    commit('load', { ...meta, type: payload.type, id: payload.id });
                    resolve(state[payload.id]);
                }
            })
        });
    },
    // get like the getter but it loads the item if it's not already loaded 
    protectedget({ state, commit }, payload: SysRecord): Promise<SysItem> {
        return typeof state[payload.id] == "undefined" ?
            new Promise((resolve) => {
                (window as any).urbit.scry({ app: "engram", path: `/${payload.type}${payload.id}/meta` }).then((meta: any) => {
                    (window as any).urbit.scry({ app: "engram", path: `/${payload.type}${payload.id}/perms` }).then((perms: any) => {
                        console.log("proetected getting: ", { ...meta, ...perms, type: payload.type, id: payload.id, hidden: true });
                        commit('load', { ...meta, ...perms, type: payload.type, id: payload.id, hidden: true });
                        resolve(state[payload.id]);
                    })
                });
            }) : new Promise((resolve) => { 
                resolve(state[payload.id]); 
            }); 
    },

    // Modifications

    rename({ commit, dispatch }, payload: { item: SysRecord, name: string}): Promise<void> {
        return new Promise((resolve) => {
            commit("rename", payload);
            (window as any).urbit.poke({
                app: "engram",
                mark: "post",
                json: {
                    [payload.item.type]: {
                        rename: { id: payload.item.id, name: payload.name }
                    }
                }
            }).then(() => {
                dispatch("load", payload.item).then(() => { resolve() });
            })
        });
    },

    make({ getters, rootGetters, dispatch }, payload: { type: "document" | "folder", name: string, spaceId: string }): Promise<SysItem> {
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
                        }}}
                    });
                    return;
                }
            })().then(() => {
                getters['last']().then((path: string) => {
                    dispatch("get", {
                      id: path,
                      type: payload.type
                    }).then((res: any) => {
                        console.log("res");
                        resolve(res);
                    })
                  });
            })
            
        });
    },
    delete({ state, commit, dispatch }, payload: SysRecord): Promise<void> {
        if(`/${router.currentRoute.value.params.author}/${router.currentRoute.value.params.clock}` == payload.id) {
            router.push(`/apps/engram?spaceId=${router.currentRoute.value.query.spaceId}`);
        }
        return new Promise((resolve) => {
            const children = state[payload.id].children;
            commit('delete', payload);
            if(payload.type == "document") {
                (window as any).urbit.scry({
                    app: "engram",
                    path: `/document${payload.id}/images`
                }).then((res: any) => {
                    console.log("images res: ", res);
                    Object.keys(res).forEach((key: string) => {
                        fetch(`https://engram-images.0xtimmy.workers.dev`, { method: "DELETE", body: res[key] });
                    })
                })
            }
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
            if(children) {
                Object.keys(children).forEach((child: string) => {
                    dispatch("delete", children[child]);
                });
            }
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
                            dispatch("load", state[payload.to]);
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
                commit("remove", payload);
                if(payload.soft) {
                    resolve();
                } else {
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
                            dispatch("load", state[payload.from]);
                            resolve();
                        })
                      }
                } 
            }
          })
    },

    //add perm
    addship({ dispatch, state }, payload: { item: SysRecord, perm: string, level: string }): Promise<void> {
        return new Promise((resolve) => {
            if(state[payload.item.id].type == "document") {
                (window as any).urbit.poke({
                    app: "engram",
                    mark: "post",
                    json: {
                      [payload.item.type]: { addperm: {
                        id: payload.item.id,
                        perm: payload.perm,
                        level: payload.level,
                      }}
                    }
                  }).then(() => {
                    dispatch("ships", payload.item);
                  })
            } else {
                console.error("can only permission documents");
            }
        })
    },

    //remove perm
    removeship({ state, commit, dispatch }, payload: { item: SysRecord, timestamp: string }): Promise<void> {
        return new Promise((resolve) => {
            if(payload.item.type == "document") {
                (window as any).urbit.poke({
                    app: "engram",
                    mark: "post",
                    json: {
                    [payload.item.type]: { removeperm: {
                        id: payload.item.id,
                        timestamp: payload.timestamp,
                    }}
                    }
                }).then(() => {
                    const temp = state[payload.item.id].ships;
                    delete temp[payload.timestamp];
                    commit("load", { id: payload.item.id, ships: temp })
                    dispatch("ships", payload.item);
                    resolve();
                })
            } else {
                console.error("Can only persmission documents");
            }
        })
      },

    //find remove perm
    findremoveperm({  }, payload: { item: SysRecord, type: string, perm: string, level: string }): Promise<void> {
        return new Promise((resolve) => {
            console.error("SHOULD NOT BE CALLING THIS");
            resolve();
        });
    },
    getupdate({ dispatch }, payload: SysItem) {
        dispatch("load", payload);
        dispatch("ships", payload);
    }
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
} as Module<FileSysState, RootState>