function HighlightMenu(props) {
  return (
    <div className="highlightmenu" style={{
      left: `${props.menu.left}px`,
      top: `calc(${props.menu.top}px - 2em)`,
    }}>
      <div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 384 512"
          width="16"
          height="16"
          fill="474747"
        >
          <path d="M321.1 242.4C340.1 220.1 352 191.6 352 160c0-70.59-57.42-128-128-128L32 32.01c-17.67 0-32 14.31-32 32s14.33 32 32 32h16v320H32c-17.67 0-32 14.31-32 32s14.33 32 32 32h224c70.58 0 128-57.41 128-128C384 305.3 358.6 264.8 321.1 242.4zM112 96.01H224c35.3 0 64 28.72 64 64s-28.7 64-64 64H112V96.01zM256 416H112v-128H256c35.3 0 64 28.71 64 63.1S291.3 416 256 416z" />
        </svg>
      </div>
      <div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 384 512"
          width="16"
          height="16"
          fill="474747"
        >
          <path d="M384 56c0 13.25-10.75 24-24 24h-67.98l-146.9 352H232c13.25 0 24 10.75 24 24S245.3 480 232 480h-208C10.75 480 0 469.3 0 456s10.75-24 24-24h70.6l146.9-352H152C138.8 80 128 69.25 128 56S138.8 32 152 32h208C373.3 32 384 42.75 384 56z" />
        </svg>
      </div>
    </div>
  );
}

export default HighlightMenu;
