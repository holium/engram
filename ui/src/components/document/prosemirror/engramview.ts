import { Plugin, PluginKey } from "prosemirror-state";
import { diffUpdateV2 } from "yjs";
import store from "@/store/index";
import router from "@/router/index";

export const EngramPluginKey = new PluginKey("engram");

export const engram = new Plugin({
    key: EngramPluginKey,
    props: {
        nodeViews: {
            "engramlink": (node, view, getPos) => {
                const dom = document.createElement("div");
                dom.setAttribute("data-type", "engram-link")
                dom.setAttribute("href", node.attrs.href);
                dom.classList.add("engram-link");
                const meta = store.getters['filesys/get'](node.attrs.href);
                dom.addEventListener("click", () => {
                    router.push(`/apps/engram${node.attrs.href}?spaceId=${router.currentRoute.value.query.spaceId}`);
                });
                dom.innerHTML = `
                    <svg 
                        v-if="type == 'document'"
                        viewBox="0 0 16 16" 
                        class="icon"
                        fill="var(--rlm-icon-color, #333333)"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <circle cx="8" cy="8" r="3"/>
                    </svg>
                    <div class="heading-1">
                        ${(meta.name == "missing document" ? node.attrs.href : meta.name)}
                    </div>
                `
                return { dom };
            }
        }
    }
})

export default engram;