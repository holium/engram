function PublishPanel(props: { show: boolean }) {
  return (
    <div className="panel" style={props.show ? {} : { display: "none" }}>
      publish panel
    </div>
  );
}

export default PublishPanel;
