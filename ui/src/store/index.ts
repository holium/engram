import {createStore, storeKey} from 'vuex'
import type { GetterTree, ActionTree } from "vuex"
import router from "@/router/index"
import type { RootState, Space } from "./types"
import space from "./space"
import documents from './documents';
import folders from "./folders";
import workspace from "./workspace"

export const nullspace = {
  path: `/~${(window as any).ship}/our`, 
  name: "Local", 
  color: "#262626",
  image: "",
  roles: [],
}

const getters: GetterTree<RootState, RootState> = {
  spaces: (): Promise<Array<Space>> => {
    return new Promise((resolve, reject) => {
      (window as any).urbit.scry({ app: "spaces", path: `/all` }).then((response: any) => {
        console.log("got spaces: ", response);
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
  load({ dispatch }, payload: string) {
    console.log("loading space...")
    dispatch("workspace/close", {}, { root: true });
    dispatch("space/load", router.currentRoute.value.query.spaceId, { root: true });
    (window as any).urbit.scry({ app: "engram", path: `/space${router.currentRoute.value.query.spaceId}/list`}).then((response: any) => {
      console.log("spaces response: ", response);
      if(Object.keys(response).length == 0) {
        (dispatch("documents/make", { name: "Untitled Document"}, { root: true}) as any).then((path: string) => {
          (window as any).urbit.scry({ app: "engram", path: `/space${router.currentRoute.value.query.spaceId}/settings`}).then((res: any) => {
              console.log("space settings response", res);
              Object.keys(res.roles).forEach((role: string) => {
                dispatch(`documents/addperm`, {
                  id: path,
                  type: "roles",
                  perm: res.roles[role].perm,
                  level: res.roles[role].level
                }, { root: true})
              });
              Object.keys(res.ships).forEach((ship: string) => {
                dispatch(`documents/findremoveperm`, {
                  id: path,
                  type: "ships",
                  perm: res.ships[ship].perm,
                  level: res.ships[ship].level
                }, { root: true})
              });
          });
        });
      }
      dispatch("folders/clear", {}, { root: true });
      dispatch("documents/clear", {}, { root: true });
      Promise.all(Object.keys(response).map((item: any) => {
        return new Promise<void>((res) => {
          if(response[item].type == "document") {
            dispatch("documents/load", {id: item, ...response[item]}, { root: true }).then(() => {
              res();
            })
          } else {
            res();
          }
        })
      }))
      Promise.all(Object.keys(response).map((item: any) => {
        return new Promise<void>((res) => {
          if(response[item].type == "folder") {
            dispatch("folders/load", {id: item, ...response[item]}, { root: true }).then(() => {
              res()
            })
          } else {
            res();
          }
        })
      }))
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
