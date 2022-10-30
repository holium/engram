import {createStore} from 'vuex'
import type { GetterTree, ActionTree } from "vuex"
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
      })
    })
  },
  space: () => (id: string): Promise<Space> => {
    return new Promise((resolve, reject) => {
      (window as any).urbit.scry({ app: "spaces", path: `/${id}` }).then((response: any) => {
        resolve(response.space);
      })
    })
  }
}

const actions: ActionTree<RootState, RootState> = {
  load({ dispatch }, payload: string) {
    console.log("load space: ", payload);
    dispatch("workspace/close");
    dispatch("documents/load", payload);
    dispatch("folders/load", payload);
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
