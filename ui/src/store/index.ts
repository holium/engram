import {createStore, storeKey} from 'vuex'
import type { GetterTree, ActionTree } from "vuex"
import type { Space } from "./space"
import { nullspace } from "./space"
import space from "./space"
import filesys from "./filesystem"
import document from "./document"

export interface RootState { }

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
  },
}

const actions: ActionTree<RootState, RootState> = {
  load({ dispatch, state }, payload: string): Promise<void> {
    return new Promise((resolve) => {
      let delay = 1;
      dispatch("space/load", payload, { root: true });
      (window as any).urbit.poke({
        app: "engram",
        mark: "post",
        json: { leave: { self: `~${(window as any).ship}` } }
      }).then(() => {
        dispatch("filesys/reset", {}, { root: true });
        dispatch("filesys/boot", payload, { root: true }).then(() => {
          resolve();
          (window as any).urbit.poke({
            app: "engram",
            mark: "post",
            json: { leave: { self: `~${(window as any).ship}`}}
          }).then(() => {
            (window as any).urbit.subscribe({
              app: "engram",
              path: "/updates",
              event: (event: any) => {
                if((event.type == "document" || event.type == "folder") && event.space == payload) 
                  dispatch("filesys/getupdate", event, { root: true });
              }
            });
          })
        });
      })
    });
  }
}

export default createStore({
  getters,
  actions,
  modules: {
    space,
    filesys,
    document,
    //documents,
    //folders,
    //workspace,
  }
})
