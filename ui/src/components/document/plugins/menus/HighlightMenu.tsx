import { toggleMark, wrapIn } from "prosemirror-commands";
import { MarkType, NodeRange } from "prosemirror-model";
import { findWrapping } from "prosemirror-transform";
import schema from "../../build/schema.ts";
import { extendMark } from "../shortcuts.ts";
import { useState, useEffect } from "react";

function HighlightMenu(props) {
  // toggle basic marks
  function toggleBold() {
    toggleMark(schema.marks["strong"])(
      props.view.state,
      props.view.dispatch,
      props.view
    );
    props.view.focus();
  }
  function toggleItalic() {
    toggleMark(schema.marks["italic"])(
      props.view.state,
      props.view.dispatch,
      props.view
    );
    props.view.focus();
  }
  function toggleUnderline() {
    toggleMark(schema.marks["underline"])(
      props.view.state,
      props.view.dispatch,
      props.view
    );
    props.view.focus();
  }
  function toggleStrike() {
    toggleMark(schema.marks["strike"])(
      props.view.state,
      props.view.dispatch,
      props.view
    );
    props.view.focus();
  }
  function toggleCode() {
    toggleMark(schema.marks["code"])(
      props.view.state,
      props.view.dispatch,
      props.view
    );
    props.view.focus();
  }

  // manage links
  useEffect(() => {
    const hyperlink = props.view.state.selection.$head
      .marks()
      .find((mark) => mark.type.name == "hyperlink");
    if (hyperlink) {
      setLink(hyperlink.attrs.href);
    }
  }, [props.menu.to, props.menu.from]);

  function toggleLink() {
    toggleMark(schema.marks["hyperlink"])(
      props.view.state,
      props.view.dispatch,
      props.view
    );
    props.view.focus();
  }
  const [link, setLink] = useState("");

  function handleLinkChange(event) {
    setLink(event.target.value);
  }

  function implementLinkChange() {
    const res = extendMark(
      props.view.state,
      props.view.state.selection.from,
      props.view.state.selection.to,
      schema.marks["hyperlink"]
    );
    if (res == null) return;
    const tr = props.view.state.tr.removeMark(
      res.from,
      res.to,
      schema.marks["hyperlink"]
    );
    tr.addMark(
      res.from,
      res.to,
      schema.marks["hyperlink"].create({ href: link })
    );
    props.view.dispatch(tr);
    console.log(res);
  }

  // manage comments
  function addComment() {
    const sel = props.view.state.selection;
    const range = new NodeRange(sel.$anchor, sel.$head, 1);
    console.log(schema.nodes["paragraph"]);
    console.log(schema.nodes["comment"]);
    console.log(findWrapping(range, schema.nodes["comment"]));
    const tr = props.view.state.tr.addMark(
      sel.from,
      sel.to,
      schema.marks["comment"].create({
        conversation: "[]",
      })
    );

    console.log(tr);
    props.view.dispatch(tr);
    props.view.focus();
  }

  // helpers

  function hasMark(mark: string): boolean {
    const sel = props.view.state.selection;
    return props.view.state.doc.rangeHasMark(
      sel.from,
      sel.to,
      schema.marks[mark]
    );
  }

  return (
    <menu
      className="highlightmenu context-menu"
      style={{
        left: `${props.menu.left}px`,
        top: `calc(${props.menu.top}px - ${
          hasMark("hyperlink") ? "4em - 6px" : "2em - 2px"
        })`,
      }}
    >
      {hasMark("hyperlink") ? (
        <input
          type="text"
          value={link}
          onChange={handleLinkChange}
          className="px-3 py-2"
          onBlur={implementLinkChange}
        />
      ) : (
        ""
      )}
      <div className="flex">
        <li
          onClick={toggleBold}
          style={
            hasMark("strong")
              ? { backgroundColor: "var(--type-glass-color)" }
              : {}
          }
        >
          {/* Bold */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 384 512"
            width="16"
            height="16"
            style={{ fill: "var(--type-color)" }}
          >
            <path d="M321.1 242.4C340.1 220.1 352 191.6 352 160c0-70.59-57.42-128-128-128L32 32.01c-17.67 0-32 14.31-32 32s14.33 32 32 32h16v320H32c-17.67 0-32 14.31-32 32s14.33 32 32 32h224c70.58 0 128-57.41 128-128C384 305.3 358.6 264.8 321.1 242.4zM112 96.01H224c35.3 0 64 28.72 64 64s-28.7 64-64 64H112V96.01zM256 416H112v-128H256c35.3 0 64 28.71 64 63.1S291.3 416 256 416z" />
          </svg>
        </li>
        <li
          onClick={toggleItalic}
          style={
            hasMark("italic")
              ? { backgroundColor: "var(--type-glass-color)" }
              : {}
          }
        >
          {/* Italic */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 384 512"
            width="16"
            height="16"
            style={{ fill: "var(--type-color)" }}
          >
            <path d="M384 56c0 13.25-10.75 24-24 24h-67.98l-146.9 352H232c13.25 0 24 10.75 24 24S245.3 480 232 480h-208C10.75 480 0 469.3 0 456s10.75-24 24-24h70.6l146.9-352H152C138.8 80 128 69.25 128 56S138.8 32 152 32h208C373.3 32 384 42.75 384 56z" />
          </svg>
        </li>
        <li
          onClick={toggleUnderline}
          style={
            hasMark("underline")
              ? { backgroundColor: "var(--type-glass-color)" }
              : {}
          }
        >
          {/* Underline */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
            width="16"
            height="16"
            style={{ fill: "var(--type-color)" }}
          >
            <path d="M40 48H64v192c0 88.22 71.78 160 160 160s160-71.78 160-160v-192h24c13.25 0 24-10.75 24-24S421.3 0 408 0h-96C298.8 0 288 10.75 288 24s10.75 24 24 24h24v192c0 61.75-50.25 112-112 112S112 301.8 112 240v-192h24C149.3 48 160 37.25 160 24S149.3 0 136 0h-96C26.75 0 16 10.75 16 24S26.75 48 40 48zM424 464H24C10.75 464 0 474.8 0 488S10.75 512 24 512h400c13.25 0 24-10.75 24-24S437.3 464 424 464z" />
          </svg>
        </li>
        <li
          onClick={toggleStrike}
          style={
            hasMark("strike")
              ? { backgroundColor: "var(--type-glass-color)" }
              : {}
          }
        >
          {/* Strike */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            width="16"
            height="16"
            style={{ fill: "var(--type-color)" }}
          >
            <path d="M488 239.9L287.2 240c-8.262-2.459-42.31-12.21-42.31-12.21C161.5 203.7 138.4 182.8 146.2 138.5c9.719-55.4 81.72-64.51 140.5-55.43c16.77 2.564 36.75 7.908 62.84 16.8c12.69 4.344 26.62-2.299 31.03-14.82c4.414-12.53-2.336-26.21-15.06-30.54c-28.93-9.861-51.58-15.86-71.29-18.89C189.7 19.57 110.9 57.61 98.15 130.3C88.41 185.7 113 218.8 146.5 240L24 239.9c-13.25 0-24 10.75-24 23.1s10.75 23.1 24 23.1h464c13.25 0 24-10.75 24-23.1S501.3 239.9 488 239.9zM361.7 336c5.1 10.26 6.734 22.25 4.059 37.47c-9.719 55.38-81.69 64.48-140.7 55.42c-25.89-3.83-56.08-14.53-82.72-23.97L128.6 400.1c-12.72-4.438-26.63 2.111-31.14 14.61c-4.494 12.5 2.16 26.22 14.85 30.64l13.47 4.75c28.76 10.19 61.36 21.75 91.86 26.27C233.6 478.8 249 480 263.7 480c81.09 0 139.3-36.74 150.1-98.34c3.047-17.35 2.619-32.35-.2246-45.66H361.7z" />
          </svg>
        </li>
        <li
          onClick={toggleCode}
          style={
            hasMark("code")
              ? { backgroundColor: "var(--type-glass-color)" }
              : {}
          }
        >
          {/* Code */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 576 512"
            width="16"
            height="16"
            style={{ fill: "var(--type-color)" }}
          >
            <path d="M58.76 256L216.6 406.6C226.2 415.8 226.5 430.1 217.4 440.6C208.2 450.2 193 450.5 183.4 441.4L7.428 273.4C2.684 268.8 0 262.6 0 256C0 249.4 2.684 243.2 7.428 238.6L183.4 70.64C193 61.49 208.2 61.84 217.4 71.43C226.5 81.02 226.2 96.21 216.6 105.4L58.76 256zM359.4 105.4C349.8 96.21 349.5 81.02 358.6 71.43C367.8 61.84 382.1 61.49 392.6 70.64L568.6 238.6C573.3 243.2 576 249.4 576 256C576 262.6 573.3 268.8 568.6 273.4L392.6 441.4C382.1 450.5 367.8 450.2 358.6 440.6C349.5 430.1 349.8 415.8 359.4 406.6L517.2 256L359.4 105.4z" />
          </svg>
        </li>
        <li
          onClick={toggleLink}
          style={
            hasMark("hyperlink")
              ? { backgroundColor: "var(--type-glass-color)" }
              : {}
          }
        >
          {/* Link */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 640 512"
            width="16"
            height="16"
            style={{ fill: "var(--type-color)" }}
          >
            <path d="M0 256C0 167.6 71.63 96 160 96H264C277.3 96 288 106.7 288 120C288 133.3 277.3 144 264 144H160C98.14 144 48 194.1 48 256C48 317.9 98.14 368 160 368H264C277.3 368 288 378.7 288 392C288 405.3 277.3 416 264 416H160C71.63 416 0 344.4 0 256zM480 416H376C362.7 416 352 405.3 352 392C352 378.7 362.7 368 376 368H480C541.9 368 592 317.9 592 256C592 194.1 541.9 144 480 144H376C362.7 144 352 133.3 352 120C352 106.7 362.7 96 376 96H480C568.4 96 640 167.6 640 256C640 344.4 568.4 416 480 416zM424 232C437.3 232 448 242.7 448 256C448 269.3 437.3 280 424 280H216C202.7 280 192 269.3 192 256C192 242.7 202.7 232 216 232H424z" />
          </svg>
        </li>
        <li>
          {/* Urbit Link */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 513 224"
            width="16"
            height="16"
            style={{ fill: "var(--type-glass-color)" }}
          >
            <path d="M361.77 223.848C453.641 223.848 493.899 127.848 512.48 25.6542L449.512 11.2026C434.028 74.1704 418.545 154.686 362.803 154.686C327.706 154.686 298.803 108.235 268.867 73.1381C237.899 35.9768 203.835 0.880005 151.19 0.880005C58.2864 0.880005 19.0606 96.88 0.47998 199.074L63.4477 213.525C78.9316 150.557 94.4155 70.0413 150.157 70.0413C185.254 70.0413 214.157 116.493 244.093 151.59C275.061 188.751 309.125 223.848 361.77 223.848Z" />
          </svg>
        </li>
        <li>
          {/* Label */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
            width="16"
            height="16"
            style={{ fill: "var(--type-glass-color)" }}
          >
            <path d="M417.1 368c-4.437 7.688-12.5 12-20.81 12c-4.062 0-8.188-1.031-11.97-3.219L248 297.6V456c0 13.25-10.75 24-23.1 24S200 469.3 200 456V297.6l-137.2 79.22C59 378.1 54.88 380 50.81 380c-8.312 0-16.37-4.312-20.81-12c-6.625-11.47-2.687-26.16 8.781-32.78L176 256l-137.2-79.22C27.31 170.2 23.38 155.5 29.1 144C36.59 132.6 51.28 128.5 62.78 135.2L200 214.4V56C200 42.75 210.8 32 224 32S248 42.75 248 56v158.4l137.2-79.22C396.8 128.5 411.4 132.6 417.1 144c6.625 11.47 2.688 26.16-8.781 32.78L271.1 256l137.2 79.22C420.7 341.8 424.6 356.5 417.1 368z" />
          </svg>
        </li>
        <li onClick={addComment}>
          {/* Comment */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            width="16"
            height="16"
            style={{ fill: "var(--type-color)" }}
          >
            <path d="M264 272h-112C138.8 272 128 282.8 128 296S138.8 320 152 320h112C277.3 320 288 309.3 288 296S277.3 272 264 272zM360 176h-208C138.8 176 128 186.8 128 200S138.8 224 152 224h208C373.3 224 384 213.3 384 200S373.3 176 360 176zM256 31.1c-141.4 0-255.1 93.13-255.1 208c0 47.62 19.91 91.25 52.91 126.3c-14.87 39.5-45.87 72.88-46.37 73.25c-6.623 7-8.373 17.25-4.623 26C5.816 474.3 14.38 480 24 480c61.49 0 109.1-25.75 139.1-46.25c28.87 9 60.16 14.25 92.9 14.25c141.4 0 255.1-93.13 255.1-207.1S397.4 31.1 256 31.1zM256 400c-26.75 0-53.12-4.125-78.36-12.12l-22.75-7.125L135.4 394.5c-14.25 10.12-33.87 21.38-57.49 29c7.373-12.12 14.37-25.75 19.87-40.25l10.62-28l-20.62-21.88C69.81 314.1 48.06 282.3 48.06 240c0-88.25 93.24-160 207.1-160c114.7 0 207.1 71.75 207.1 160S370.8 400 256 400z" />
          </svg>
        </li>
      </div>
    </menu>
  );
}

export default HighlightMenu;

/* Helpers */
