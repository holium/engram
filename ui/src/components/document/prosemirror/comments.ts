import { Plugin, PluginKey } from "prosemirror-state";
import type { Mark } from "prosemirror-model";
import type { EditorView } from "prosemirror-view";
import schema from "./schema";
import { extendMark } from "./shortcuts";

export const CommentsPluginKey = new PluginKey("comment");

function formatTimestamp(timestamp: Date) {
  return `${(timestamp
    .getHours()
    .toString() as any)
    .padStart(2, 0)}:${(timestamp.getMinutes().toString() as any).padStart(2, 0)}
    ${((timestamp.getMonth() + 1)
      .toString() as any)
      .padStart(2, 0)}/${(timestamp.getDate().toString() as any).padStart(2, 0)}`;
}

export interface Comment {
  author: string;
  timestamp: number;
  content: string;
}

export const comments = new Plugin({
  props: {
    markViews: {
      comment: (
        mark: Mark,
        view: EditorView,
        inline: boolean
      ): { dom: HTMLElement; contentDOM?: HTMLElement } => {
        const dom = document.createElement("span");

        const contentDOM = document.createElement("mark");
        dom.appendChild(contentDOM);

        const viewPortal = document.createElement("aside");
        viewPortal.addEventListener("click", (event) => {
          event.stopPropagation();
        });
        viewPortal.addEventListener("keydown", (event) => {
          event.stopPropagation();
        });
        viewPortal.addEventListener("mouseover", (event) => {
          event.stopPropagation();
        });

        const portalContent = document.createElement("div");
        portalContent.className = "context-menu comment";
        viewPortal.appendChild(portalContent);

        // get existing conversation
        const comment = JSON.parse(mark.attrs.comment);

        // render existing comments
        const renderComment = (data: Comment) => {
          viewPortal.contentEditable = "false";
          const commentHeading = document.createElement("li");
          commentHeading.className = "flex items-center gap-3";
          const author = document.createElement("div");
          author.className = "azimuth";
          author.innerHTML = "~" + data.author;
          const timestamp = document.createElement("div");
          timestamp.style.textAlign = "right";
          timestamp.innerHTML = formatTimestamp(new Date(data.timestamp));
          timestamp.style.flexGrow = "1";
          timestamp.style.opacity = ".6";
          const resolve = document.createElement("div");
          resolve.innerHTML = `
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
              fill="var(--type-color)"
              class="icon clickable"
            >
              <path d="M211.8 339.8C200.9 350.7 183.1 350.7 172.2 339.8L108.2 275.8C97.27 264.9 97.27 247.1 108.2 236.2C119.1 225.3 136.9 225.3 147.8 236.2L192 280.4L300.2 172.2C311.1 161.3 328.9 161.3 339.8 172.2C350.7 183.1 350.7 200.9 339.8 211.8L211.8 339.8zM0 96C0 60.65 28.65 32 64 32H384C419.3 32 448 60.65 448 96V416C448 451.3 419.3 480 384 480H64C28.65 480 0 451.3 0 416V96zM48 96V416C48 424.8 55.16 432 64 432H384C392.8 432 400 424.8 400 416V96C400 87.16 392.8 80 384 80H64C55.16 80 48 87.16 48 96z"/>
            </svg>
          `;
          resolve.addEventListener("click", () => {
            const sel = view.state.selection;
            const res = extendMark(
              view.state,
              sel.from - 1,
              sel.to,
              schema.marks["comment"]
            );
            if (res == null) return;
            const tr = view.state.tr.removeMark(res.from, res.to, mark);
            view.dispatch(tr);
          });
          commentHeading.appendChild(author);
          commentHeading.appendChild(timestamp);
          commentHeading.appendChild(resolve);
          const commentContent = document.createElement("li");
          const commentValue = document.createElement("blockquote");
          commentValue.textContent = data.content;
          commentContent.appendChild(commentValue);
          portalContent.appendChild(commentHeading);
          portalContent.appendChild(commentContent);
        };

        // new comment
        const addComment = () => {
          const newCommentHeading = document.createElement("li");
          newCommentHeading.className = "flex items-center gap-3";
          const author = document.createElement("div");
          author.className = "azimuth";
          author.innerHTML = "~" + (window as any).ship;
          const timestamp = document.createElement("div");
          timestamp.innerHTML = "editing...";
          timestamp.style.flexGrow = "1";
          timestamp.style.opacity = ".6";
          const sendButton = document.createElement("div");
          sendButton.innerHTML = `
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              fill="var(--type-color)"
              class="icon clickable"
            >
              <path d="M492.6 226.6L44.6 34.59C40.54 32.85 36.26 31.1 32.02 31.1c-8.623 0-17.1 3.499-23.3 10.05C-.4983 51.81-2.623 66.3 3.377 78.31L96 256l-92.62 177.7c-6 12.02-3.875 26.5 5.344 36.27c6.188 6.547 14.66 10.05 23.28 10.05c4.25 0 8.531-.8438 12.59-2.594L492.6 285.4c11.78-5.031 19.41-16.61 19.41-29.41C511.1 243.2 504.4 231.6 492.6 226.6zM66.92 96.38L383.4 232H137.6L66.92 96.38zM137.6 280h245.7l-316.4 135.6L137.6 280z"/>
            </svg>
          `;
          newCommentHeading.appendChild(author);
          newCommentHeading.appendChild(timestamp);
          newCommentHeading.appendChild(sendButton);

          const commentContent = document.createElement("li");
          const comment = document.createElement("textarea");
          commentContent.appendChild(comment);

          // Send the comment
          sendButton.addEventListener("click", () => {
            const sel = view.state.selection;
            const newComment = {
              author: (window as any).ship,
              timestamp: Date.now(),
              content: comment.value,
            };

            const res = extendMark(
              view.state,
              sel.from - 1,
              sel.to,
              schema.marks["comment"]
            );
            if (res == null) return;

            const tr = view.state.tr.removeMark(res.from, res.to, mark);
            tr.addMark(
              res.from,
              res.to,
              schema.marks["comment"].create({
                comment: JSON.stringify(newComment),
              })
            );
            view.dispatch(tr);
          });

          portalContent.appendChild(newCommentHeading);
          portalContent.appendChild(commentContent);
        };

        if (comment.author) renderComment(comment);
        if (!comment.author) addComment();

        dom.appendChild(viewPortal);

        return { dom, contentDOM };
      },
    },
  },
});

export default comments;