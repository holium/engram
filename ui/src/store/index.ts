import {createStore} from 'vuex'
import type { ActionTree } from "vuex"
import type { RootState } from "./types"
import documents from './documents';
import folders from "./folders";
import workspace from "./workspace"


const actions: ActionTree<RootState, RootState> = {
  loadSpace({ dispatch }, payload: string) {
    dispatch("workspace/clear");
    dispatch("documents/load", payload);
    dispatch("folders/load", payload);
  }
}

export default createStore({
  actions,
  modules: {
    documents,
    folders,
    workspace,
  }
})
