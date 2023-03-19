import {createStore, storeKey} from 'vuex'
import type { GetterTree, ActionTree } from "vuex"
import type { Space } from "./space"
import { nullspace } from "./space"
import space from "./space"
import filesys from "./filesystem"
import document from "./document"
import { loadS3 } from "./images"
import router from '@/router/index'

import { pushUpdate } from "@/components/document/prosemirror/render";

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
    loadS3();
    return new Promise((resolve) => {
      let delay = 1;
      (window as any).urbit.poke({
        app: "engram",
        mark: "post",
        json: { leave: { self: `~${(window as any).ship}` } }
      }).then(() => {
        dispatch("filesys/reset", {}, { root: true });
        dispatch("filesys/boot", payload, { root: true }).then(() => {
          dispatch("space/load", payload, { root: true });
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
                //console.warn("update message received: ", event);
                if((event.type == "document" || event.type == "folder") && event.space == payload) 
                  dispatch("filesys/getupdate", event, { root: true });
                else if(event.type == "space") dispatch("filesys/boot", payload, { root: true })

                if(event.type == "document") {
                  if(event.id == `/${router.currentRoute.value.params.author}/${router.currentRoute.value.params.clock}`) {
                      (window as any).urbit.scry({ app: "engram", path: `/document${event.id}/content`}).then((res: any) => {
                          Object.keys(res).map((key: string) => { return res[key] }).forEach((update: any) => {
                              pushUpdate(event.id, update, true);
                          });
                      })
                  }
              }
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
  }
})
