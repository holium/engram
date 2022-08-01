import { Plugin, PluginKey } from "prosemirror-state";
import { Mark } from "prosemirror-model";
import { EditorView } from "prosemirror-view";
import schema from "../build/schema.ts";
import { extendMark } from "./shortcuts.ts";

export const CommentsPluginKey = new PluginKey("comment");

export interface Comment {
  author: string;
  timestamp: number;
  content: string;
}

const prettifyTimestamp = (timestamp: number) => {
  const date = new Date(timestamp);
  const now = Date.now();
  if (timestamp / 1000 / 60 / 60 / 24 - now / 1000 / 60 / 60 / 24 > 7) {
    return `${
      [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ][date.getMonth()]
    }, ${date.getDate()}`;
  }
  if (timestamp / 1000 / 60 / 60 - now / 1000 / 60 / 60 > 24) {
    return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][date.getDay()];
  }
  return `${date.getHours()}:${date.getMinutes()}`;
};

export const comments = new Plugin({
  props: {
    markViews: {
      comment: (
        mark: Mark,
        view: EditorView,
        inline: boolean
      ): { dom: HTMLElement; contentDOM?: HTMLElement } => {
        console.log(mark);
        const dom = document.createElement("span");

        const contentDOM = document.createElement("mark");
        dom.appendChild(contentDOM);
        let toolbar;

        const viewPortal = document.createElement("aside");
        viewPortal.className = "context-menu";
        viewPortal.addEventListener("keydown", (event) => {
          event.stopPropagation();
        });
        viewPortal.addEventListener("mouseover", (event) => {
          event.stopPropagation();
        });

        // get existing conversation
        const comment = JSON.parse(mark.attrs.comment);

        // render existing comments
        const renderComment = (data: Comment) => {
          const commentHeading = document.createElement("li");
          const author = document.createElement("address");
          author.innerHTML = data.author;
          const timestamp = document.createElement("time");
          timestamp.innerHTML = prettifyTimestamp(data.timestamp);
          timestamp.style.flexGrow = "1";
          commentHeading.appendChild(author);
          commentHeading.appendChild(timestamp);
          const commentContent = document.createElement("li");
          const commentValue = document.createElement("blockquote");
          commentValue.textContent = data.content;
          commentContent.appendChild(commentValue);
          viewPortal.appendChild(commentHeading);
          viewPortal.appendChild(commentContent);
        };

        // new comment
        const addComment = () => {
          toolbar.removeChild(toolbar.childNodes[0]);

          const newCommentHeading = document.createElement("li");
          const author = document.createElement("address");
          author.innerHTML = "~dalsyr-diglyn";
          const timestamp = document.createElement("time");
          timestamp.innerHTML = "editing...";
          timestamp.style.flexGrow = "1";
          const sendButton = document.createElement("div");
          sendButton.className = "icon";
          sendButton.innerHTML = `
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              width="16"
              height="16"
              style="fill: 'var(--type-color)'"
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

          viewPortal.insertBefore(newCommentHeading, toolbar);
          viewPortal.insertBefore(commentContent, toolbar);

          // Send the comment
          sendButton.addEventListener("click", () => {
            const sel = view.state.selection;
            const newComment = {
              author: "~dalsyr-diglyn",
              timestamp: Date.now(),
              content: comment.value,
            };
            console.log(view.state.doc.textBetween(sel.from - 1, sel.to));

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
        };

        // assemble toolbar
        const renderToolbar = () => {
          toolbar = document.createElement("li");
          toolbar.style.justifyContent = "end";
          const add = document.createElement("div");
          add.className = "icon";
          add.innerHTML = `
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
              width="16"
              height="16"
              style="fill: 'var(--type-color)'"
            >
              <path d="M200 344V280H136C122.7 280 112 269.3 112 256C112 242.7 122.7 232 136 232H200V168C200 154.7 210.7 144 224 144C237.3 144 248 154.7 248 168V232H312C325.3 232 336 242.7 336 256C336 269.3 325.3 280 312 280H248V344C248 357.3 237.3 368 224 368C210.7 368 200 357.3 200 344zM0 96C0 60.65 28.65 32 64 32H384C419.3 32 448 60.65 448 96V416C448 451.3 419.3 480 384 480H64C28.65 480 0 451.3 0 416V96zM48 96V416C48 424.8 55.16 432 64 432H384C392.8 432 400 424.8 400 416V96C400 87.16 392.8 80 384 80H64C55.16 80 48 87.16 48 96z"/>
            </svg>
          `;
          add.addEventListener("click", () => {
            const sel = view.state.selection;
            const res = extendMark(
              view.state,
              sel.from - 1,
              sel.to,
              schema.marks["comment"]
            );
            console.log(res);
            if (res == null) return;
            const tr = view.state.tr.addMark(
              res.from,
              res.to,
              schema.marks["comment"].create({
                comment: "{}",
              })
            );
            view.dispatch(tr);
          });
          toolbar.appendChild(add);

          const resolve = document.createElement("div");
          resolve.className = "icon";
          resolve.innerHTML = `
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
              width="16"
              height="16"
              style="fill: 'var(--type-color)'"
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
          toolbar.appendChild(resolve);
          viewPortal.appendChild(toolbar);
        };

        if (comment.author) renderComment(comment);
        renderToolbar();
        if (!comment.author) addComment();

        dom.appendChild(viewPortal);

        return { dom, contentDOM };
      },
    },
  },
});
