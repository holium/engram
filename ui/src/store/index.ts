import {createStore, storeKey} from 'vuex'
import type { GetterTree, ActionTree } from "vuex"
import router from "@/router/index"
import type { RootState, Space } from "./types"
import space from "./space"
import documents from './documents';
import folders from "./folders";
import workspace from "./workspace"
import engram from '@/components/document/prosemirror/engramview'

export const nullspace = {
  path: `/~${(window as any).ship}/our`, 
  name: "Local", 
  color: "#262626",
  picture: "",
  roles: [],
}

const getters: GetterTree<RootState, RootState> = {
  spaces: (): Promise<Array<Space>> => {
    return new Promise((resolve, reject) => {
      (window as any).urbit.scry({ app: "spaces", path: `/all` }).then((response: any) => {
        resolve({...response.spaces});
      }).catch((err: any) => {
        console.warn("spaces agent missing !!", err);
        resolve([nullspace]);
      })
    })
  },
  lastOrganism: () => (): Promise<string> => {
    return (window as any).urbit.scry({ app: "engram", path: "/history"});
  }
}

const actions: ActionTree<RootState, RootState> = {
  load({ dispatch, state }): Promise<void> {
    return new Promise((resolve) => {
      let delay = 1;
      dispatch("workspace/close", {}, { root: true });
      dispatch("space/load", router.currentRoute.value.query.spaceId, { root: true });
      (window as any).urbit.scry({ app: "engram", path: `/space${router.currentRoute.value.query.spaceId}/list`}).then((response: any) => {
        if(response == "Missing Space") {
          console.log("making space...");
          (window as any).urbit.poke({
            app: "engram",
            mark: "post",
            json: {
              space: { "make": { "space": router.currentRoute.value.query.spaceId }}
            }
          }).then(() => {
            (window as any).urbit.poke({
              app: "engram",
              mark: "post",
              json: {
                space: { "gatherall": { "space": router.currentRoute.value.query.spaceId }}
              }
            }).then(() => {
              dispatch("load").then(() => {
                resolve();
              })
            })
          });
        } else {
          (window as any).urbit.poke({
            app: "engram",
            mark: "post",
            json: { leave: { self: `~${(window as any).ship}` } }
          }).then(() => {
            dispatch("folders/clear", {}, { root: true });
            dispatch("documents/clear", {}, { root: true });
            Promise.all(
              [
                ...Object.keys(response).map((item: any) => {
                  return new Promise<void>((res) => {
                    if(response[item].type == "document") {
                      dispatch("documents/load", {id: item, ...response[item]}, { root: true }).then(() => {
                        res();
                      })
                    } else {
                      res();
                    }
                  })
                }),
                ...Object.keys(response).map((item: any) => {
                  return new Promise<void>((res) => {
                    if(response[item].type == "folder") {
                      dispatch("folders/load", {id: item, ...response[item]}, { root: true }).then(() => {
                        res()
                      })
                    } else {
                      res();
                    }
                  })
                })
              ]
            ).then(() => {
              (window as any).urbit.subscribe({
                app: "engram",
                path: "/updates",
                event: (event: any) => {
                  console.log("received event: ", event);
                  if(event.type == "document") {
                    if(state.documents[event.id]) {
                      dispatch("documents/getupdate", event.id, { root: true });
                    }
                  } else if(event.type == "folder") {
                    if(state.folders[event.id]) {
                      dispatch("folders/getupdate", event.id, { root: true });
                    }
                  } else if(event.type == "space") {
                    if(event.id == router.currentRoute.value.query.spaceId) {
                      dispatch("load");
                    }
                  }
                }
              })
              resolve();
            })
          });
        }
      }).catch((err: any) => {
        console.warn("caught error: ", err);
        setTimeout(() => {
          delay = delay * 2;
          if(delay < 10) delay = 10;
          dispatch("load");
        }, delay);
      })
    })
  }
}

export default createStore({
  getters,
  actions,
  modules: {
    space,
    documents,
    folders,
    workspace,
  }
})
