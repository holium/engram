import { Plugin } from "prosemirror-state"

export default new Plugin({
  nodeViews: {
    "portal": (node, view, getPos, decos, innerDecos) => {
      const article = document.createElement("article");
      const input = document.createElement("input")
      input.setAttribute("type", "string")
      input.setAttribute("value", node.attrs.url)
      const thumbnail = document.createElement("img");
      article.appendChild(input)
      article.appendChild(thumbnail)
      return article;
    }
  }
})
