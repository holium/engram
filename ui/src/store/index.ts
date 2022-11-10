import {createStore} from 'vuex'
import type { GetterTree, ActionTree } from "vuex"
import router from "@/router/index"
import type { RootState, Space } from "./types"
import documents from './documents';
import folders from "./folders";
import workspace from "./workspace"

const getters: GetterTree<RootState, RootState> = {
  spaces: (): Promise<Array<Space>> => {
    return new Promise((resolve, reject) => {
      (window as any).urbit.scry({ app: "spaces", path: `/all` }).then((response: any) => {
        console.log("got spaces: ", response);
        resolve(response.spaces);
      }).catch((err: any) => {
        console.warn("spaces agent missing !!", err);
        reject([]);
      })
    })
  },
  space: () => (id: string): Promise<Space> => {
    return new Promise((resolve, reject) => {
      (window as any).urbit.scry({ app: "spaces", path: `/${id}` }).then((response: any) => {
        resolve(response.space);
      }).catch((err: any) => {
        console.warn("spaces agent missing!!", err);
        reject({ path: "", name: "our", color: "#262626"});
      })
    })
  }
}

const actions: ActionTree<RootState, RootState> = {
  load({ dispatch }, payload: string) {
    console.log("load space: ", payload);
    dispatch("workspace/close", {}, { root: true });

    (window as any).urbit.scry({ app: "engram", path: `/space/${router.currentRoute.value.params.station}/${router.currentRoute.value.params.space}/list`}).then((response: any) => {
      dispatch("documents/clear", {}, { root: true });
      dispatch("folders/clear", {}, { root: true });
      Object.keys(response).forEach((item: any) => {
        console.log("loaded item: ", response[item]);
        if(response[item].type == "document") {
          dispatch("documents/load", response[item], { root: true });
        } else if(response[item].type == "folder") {
          dispatch("folders/load", response[item], { root: true });
        }
      })
    })
  }
}

export default createStore({
  getters,
  actions,
  modules: {
    documents,
    folders,
    workspace,
  }
})
