import { sendableSteps } from "prosemirror-collab";
import { Transaction } from "prosemirror-state";
import { EditorView } from "prosemirror-view";

function dispatchTransaction(this: EditorView, transaction: Transaction) {
  const newState = this.state.apply(transaction);
  this.updateState(newState);
  const sendable = sendableSteps(newState);
  if (sendable)
    console.log({
      version: sendable.version,
      steps: sendable.steps,
      author: sendable.clientID,
    });
}

export default dispatchTransaction;
