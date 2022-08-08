import { Plugin, PluginKey } from "prosemirror-state";
import schema from "../build/schema";

export const HandleImagePluginKey = new PluginKey("handle-image");

export const handleImage = new Plugin({
  key: HandleImagePluginKey,
  props: {
    handleDOMEvents: {
      drop: (view, event) => {
        const files = event.dataTransfer.files;
        if (files.length == 0) return;

        const sel = view.state.selection;

        if (event.preventDefault != undefined) {
          event.preventDefault();
        } else {
          window.event.returnValue = false;
        }

        console.log(files);
        Array.from(files).forEach((file) => {
          if (["image/png", "image/jpg", "image/jpeg"].includes(file.type)) {
            console.log("dropping", file);
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (res) => {
              console.log(res);
              console.log(reader.result);
              const tr = view.state.tr.insert(
                sel.anchor,
                schema.nodes["image"].create({ src: reader.result })
              );
              view.dispatch(tr);
            };
          }
        });
      },
    },
    nodeViews: {
      image: (node, view, getPos) => {
        const dom = document.createElement("div");
        dom.style.resize = "vertical";
        dom.style.overflow = "hidden";
        dom.style.display = "block";
        console.log(node.attrs);
        dom.style.height = `${node.attrs.height}px`;
        const img = document.createElement("img");
        img.style.width = "100%";
        img.style.height = "100%";
        img.style.objectFit = "contain";
        img.setAttribute("src", node.attrs.src);
        dom.appendChild(img);

        dom.addEventListener("mouseup", (event) => {
          console.log(event);
          const box = (event.target as any).getBoundingClientRect();
          if (box) {
            console.log(box);
            const tr = view.state.tr.setNodeMarkup(
              getPos(),
              schema.nodes["image"],
              { src: node.attrs.src, height: box.height }
            );
            view.dispatch(tr);
          }
        });

        return { dom };
      },
    },
  },
});
