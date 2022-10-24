import { Plugin, PluginKey } from "prosemirror-state";

export const PropertyPluginKey = new PluginKey("property");



export const property = new Plugin({
  key: PropertyPluginKey,

})


export interface Property {
  key: string;
  value: any;
  pos: number;
}
