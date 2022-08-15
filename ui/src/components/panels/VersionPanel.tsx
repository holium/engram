function VersionPanel(props: { show: boolean }) {
  return (
    <div className="panel" style={props.show ? {} : { display: "none" }}>
      version panel
    </div>
  );
}

export default VersionPanel;
