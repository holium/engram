import type { GetterTree, MutationTree, ActionTree, Module } from "vuex"
import type {
    RootState,
} from "./index"
import * as Y from "yjs";
import { pushUpdate } from "@/components/document/prosemirror/render";
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
    ships: { [key: string]: ShipPermission },
    roles: { [key: string]: RolePermission },

    hidden?: boolean //whether to inject into a folder or not
}

export interface FileSysState {
    [key: string] : SysItem,
    ".": {
        id: string,
        type: "folder",
        name: "root",
        children: { [id: string]: SysRecord },
        owner: "",
        ships: {},
        roles: {},
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
        owner: "",
        ships: {},
        roles: {},
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
    owner: (state) => (id: string): undefined | string => {
        return state[id].owner;
    },
    ships: (state) => (id: string): undefined | { [key: string]: ShipPermission } => {
        return state[id].ships;
    },
    roles: (state) => (id: string): undefined | { [key: string]: RolePermission } => {
        return state[id].roles;
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
            owner: "",
            ships: {},
            roles: {}
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
                console.log("space res: ", res);
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
    perms({ commit }, payload: SysRecord): Promise<SysItem> {
        return new Promise((resolve, reject) => {
            (window as any).urbit.scry({ app: "engram", path: `/${payload.type}${payload.id}/perms` }).then((res: any) => {
                commit('load', { ...res, type: payload.type, id: payload.id });
                resolve(res);
            })
        })
    },
    get({ commit, state }, payload: SysRecord): Promise<SysItem> {
        return new Promise((resolve) => {
            (window as any).urbit.scry({ app: "engram", path: `/${payload.type}${payload.id}/meta` }).then((meta: any) => {
                (window as any).urbit.scry({ app: "engram", path: `/${payload.type}${payload.id}/perms` }).then((perms: any) => {
                    commit('load', { ...meta, ...perms, type: payload.type, id: payload.id });
                    resolve(state[payload.id]);
                })
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
                dispatch("update", payload.item);
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
                    dispatch("get", {
                      id: path,
                      type: payload.type
                    }).then((res: any) => {
                        resolve(res);
                    })
                  });
            })
            
        });
    },
    delete({ commit, dispatch }, payload: SysRecord): Promise<void> {
        if(`/${router.currentRoute.value.params.author}/${router.currentRoute.value.params.clock}` == payload.id) {
            router.push(`/apps/engram?spaceId=${router.currentRoute.value.query.spaceId}`);
        }
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
    update({ state, rootGetters }, payload: SysRecord): Promise<void> {
        return new Promise((resolve) => {
            console.warn("try to send update: ", payload);
            const ships = [
                ...rootGetters["space/members"],
                ...Array.from(new Set(Object.keys(state[payload.id].ships).map((timestamp: string) => {
                    return state[payload.id].ships[timestamp].ship;
                })))
            ];
            ships.forEach((ship) => {
                try {
                    console.warn("sending update ", { [payload.type]: { "update": { id: payload.id } } }, " to: ", ship.substring(1));
                    (window as any).urbit.poke({
                        app: "engram",
                        mark: "post",
                        json: { [payload.type]: { "update": { id: payload.id } } },
                        ship: ship.substring(1),
                    }).then(() => {
                        //console.log("successfully updated: ", ship);
                    }).catch((err: any) => {
                        //console.warn("caught error one: ", err);
                    })
                } catch(err) {
                    // oh well
                    //console.warn("caught error two: ", err);
                }
                
            })
            resolve();
        })
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
                            dispatch("load", { id: payload.to, type: "folder"}).then(() => {
                                Object.keys(state[payload.to].roles).forEach((role: string) => {
                                    dispatch("addperm", {
                                        item: payload.item,
                                        type: "roles",
                                        perm: state[payload.to].roles[role].role,
                                        level: state[payload.to].roles[role].level
                                    })
                                });
                                Object.keys(state[payload.to].ships).forEach((ship: string) => {
                                    dispatch("addperm", {
                                        item: payload.item,
                                        type: "ships",
                                        perm: state[payload.to].ships[ship].ship,
                                        level: state[payload.to].ships[ship].level
                                    })
                                });
                            });
                            dispatch("update", { id: payload.to, type: "folder" });
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
                const item = (state[payload.from].children as any)[payload.index];
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
                            dispatch("load", { id: payload.from, type: "folder"}).then(() => {
                                const roles = Object.keys(state[payload.from].roles);
                                const ships = Object.keys(state[payload.from].ships);
                                (async () => {
                                    for(let i = 0; i < roles.length; i++) {
                                        await dispatch("findremoveperm", {
                                            item: item,
                                            type: "roles",
                                            perm: state[payload.from].roles[roles[i]].role,
                                            level: state[payload.from].roles[roles[i]].level
                                        })
                                    }
                                    for(let i = 0; i < ships.length; i++) {
                                        await dispatch("findremoveperm", {
                                            item: item,
                                            type: "ships",
                                            perm: state[payload.from].ships[ships[i]].ship,
                                            level: state[payload.from].ships[ships[i]].level
                                        })
                                    }
                                })();
                            })
                            dispatch("update", { id: payload.from, type: "folder" });
                          resolve();
                        })
                      }
                } 
            }
          })
    },

    //add perm
    addperm({ dispatch }, payload: { item: SysRecord, perm: string, level: string, type: string}): Promise<void> {
        return new Promise((resolve) => {
          (window as any).urbit.poke({
            app: "engram",
            mark: "post",
            json: {
              [payload.item.type]: { addperm: {
                id: payload.item.id,
                perm: payload.perm,
                level: payload.level,
                type: payload.type
              }}
            }
          }).then(() => {
            dispatch("perms", payload.item);
            if(payload.item.type == "folder") {
                Promise.all(Object.keys((state[payload.item.id].children as any)).map((item: string) => {
                    dispatch("addperm", { 
                      item: (state[payload.item.id].children as any)[item], 
                      perm: payload.perm, 
                      level: payload.level, 
                      type: payload.type
                    })
                  })).then(() => { 
                    resolve();
                  });
            } else {
                resolve();
            }
            dispatch("update", payload.item);
          })
        })
    },

    //remove perm
    removeperm({ state, commit, dispatch }, payload: { item: SysRecord, timestamp: string, type: "ships" | "roles"}): Promise<void> {
        return new Promise((resolve) => {
            const perm = state[payload.item.id][payload.type];
            (window as any).urbit.poke({
                app: "engram",
                mark: "post",
                json: {
                [payload.item.type]: { removeperm: {
                    id: payload.item.id,
                    timestamp: payload.timestamp,
                    type: payload.type
                }}
                }
            }).then(() => {
                const temp = state[payload.item.id][payload.type];
                delete temp[payload.timestamp];
                commit("load", { id: payload.item.id, [payload.type]: temp })
                dispatch("perms", payload.item);
                if(payload.item.type == "folder") {
                    Promise.all(Object.keys((state[payload.item.id].children as any)).map((item: string) => {
                        dispatch("findremoveperm", { 
                            item: (state[payload.item.id].children as any)[item], 
                            perm: perm[payload.type == "ships" ? "ship" : "role"], 
                            level: perm.level, 
                            type: payload.type
                        });
                    })).then(() => { 
                        resolve();
                    });
                } else {
                    resolve();
                }
                dispatch("update", payload.item);
            })
        })
      },

    //find remove perm
    findremoveperm({ dispatch }, payload: { item: SysRecord, type: string, perm: string, level: string }): Promise<void> {
        return new Promise((resolve) => {
          dispatch("protectedget", payload.item).then((res: any) => {
            const closeenough = Object.keys(res[payload.type]).find((key: string) => {
              return res[payload.type][key][payload.type == "ships" ? "ship" : "role"] == payload.perm && res[payload.type][key].level == payload.level;
            });
            if(closeenough) {
                dispatch("removeperm", {
                    item: payload.item,
                    timestamp: closeenough,
                    type: payload.type,
                  }).then(() => {
                    resolve();
                  })
            } else {
                resolve();
            }
          })
        })
    },
    getupdate({ dispatch }, payload: SysItem) {
        dispatch("load", payload);
        dispatch("perms", payload);
        if(payload.type == "document") {
            if(payload.id == `/${router.currentRoute.value.params.author}/${router.currentRoute.value.params.clock}`) {
                (window as any).urbit.scry({ app: "engram", path: `/document${payload.id}/updates`}).then((res: any) => {
                    Object.keys(res).map((key: string) => { return res[key] }).forEach((update: any) => {
                        pushUpdate(payload.id, update, true);
                    });
                })
            }
        }
    }
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
} as Module<FileSysState, RootState>