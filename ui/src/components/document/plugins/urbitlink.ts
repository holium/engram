import { Plugin, PluginKey } from "prosemirror-state";
import { OpenDocumentEvent, pathParser } from "../types";

export const UrbitLinkPluginKey = new PluginKey("urbitlink");

export const urbitlink = new Plugin({
  key: UrbitLinkPluginKey,
  props: {
    markViews: {
      urbitlink: (mark: Mark, view: EditorView, inline: boolean) => {
        console.log(mark);
        const link = document.createElement("abbr");
        link.addEventListener("click", (event) => {
          // open docuemtn | add document
          const parsed = mark.attrs.href.match(pathParser);
          if (
            parsed.groups.ship &&
            parsed.groups.id &&
            parsed.groups.timestamp
          ) {
            document.dispatchEvent(
              OpenDocumentEvent(parsed.groups.ship, {
                id: parsed.groups.id,
                timestamp: parsed.groups.timestamp,
              })
            );
          }
        });
        console.log(link);
        return { dom: link };
      },
    },
  },
});
