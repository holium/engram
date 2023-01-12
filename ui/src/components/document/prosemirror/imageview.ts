import { Plugin, PluginKey } from "prosemirror-state";
import type { EditorView } from "prosemirror-view";
import { dropPoint } from "prosemirror-transform";
import { Slice, Fragment } from "prosemirror-model"
import schema from "./schema";

export const ImageViewPluginKey = new PluginKey("imageview");

export const imageview = new Plugin({
  key: ImageViewPluginKey,
  props: {
    handleDOMEvents: {
      drop: (view, event) => {
        if (!event.dataTransfer) return false;
        const files = event.dataTransfer.files;
        if (files.length == 0) return false;

        const sel = view.state.selection;

        event.preventDefault();
        Array.from(files).forEach((file) => {
          if (["image/png", "image/jpg", "image/jpeg"].includes(file.type)) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (res) => {
                const node = Fragment.from(schema.nodes["image"].create({ src: reader.result }));
                const pos = view.posAtCoords({ left: event.clientX, top: event.clientY });
                if(pos) {
                    const point = dropPoint(view.state.doc, pos.pos, new Slice(node, 0, 0));
                    if(point) {
                        const tr = view.state.tr.insert(
                            point,
                            node
                          );
                          view.dispatch(tr);
                    } else {
                        console.warn("no valid drop point");
                    }
                } else {
                    console.warn("no valid pos @ coords: ", { left: event.clientX, top: event.clientY });
                }
                
            };
          }
        });
        return true;
      },
    },
    nodeViews: {
      image: (node: any, view: EditorView, getPos: any) => {
        const dom = document.createElement("div");
        dom.style.overflow = "hidden";
        dom.style.display = "block";
        dom.style.height = `${node.attrs.height}px`;
        const contentDOM = document.createElement("div");
        dom.appendChild(contentDOM);
        if (node.attrs.src.length > 0) {
          dom.style.resize = "vertical";
          const img = document.createElement("img");
          img.style.width = "100%";
          img.style.height = "100%";
          img.style.objectFit = "contain";
          img.setAttribute("src", node.attrs.src);
          dom.appendChild(img);

          dom.addEventListener("mouseup", (event) => {
            const box = (event.target as any).getBoundingClientRect();
            if (box) {
              const tr = view.state.tr.setNodeMarkup(
                getPos(),
                schema.nodes["image"],
                { src: node.attrs.src, height: box.height }
              );
              view.dispatch(tr);
            }
          });
        } else {
          dom.className = "rounded-3 px-4 py-3 border";
          dom.style.borderColor = "var(--type-color)";
          dom.addEventListener("drop", (event) => {
            if (!event.dataTransfer) return;
            const files = event.dataTransfer.files;
            if (files.length == 0) return;

            event.preventDefault();
            const sel = view.state.selection;

            if (
              ["image/png", "image/jpg", "image/jpeg"].includes(
                Array.from(files)[0].type
              )
            ) {
              const reader = new FileReader();
              reader.readAsDataURL(Array.from(files)[0]);
              reader.onload = (res) => {
                const tr = view.state.tr.setNodeMarkup(
                  getPos(),
                  schema.nodes["image"],
                  { src: reader.result, height: "auto" }
                );
                view.dispatch(tr);
              };
            }
          });
          const guard = document.createElement("doc");
          guard.contentEditable = "false";
          guard.style.display = "flex";
          const input = document.createElement("input");
          input.placeholder = "Drop or link an image";
          input.className = "outline-none bg-none flex-grow";
          input.addEventListener("focus", (event) => {
            event.stopPropagation();
          });
          input.addEventListener("click", (event) => {
            event.stopPropagation();
          });
          input.addEventListener("keydown", (event: any) => {
            event.stopPropagation();
            if (event.key == "Enter") {
              event.preventDefault();
              event.stopPropagation();
              const tr = view.state.tr.setNodeMarkup(
                getPos(),
                schema.nodes["image"],
                { src: event.target.value, height: "auto" }
              );
              view.dispatch(tr);
            }
          });
          guard.appendChild(input);
          dom.appendChild(guard);
        }

        return {
          dom,
          contentDOM,
          stopEvent: () => {
            return true;
          },
        };
      },
    },
  },
});

export default imageview;
