import { Patp } from "@urbit/http-api";
import { Snapshot } from "yjs";

/* App ---------------------------------------------------------------------- */
export function OpenDocumentEvent(meta: DocumentMeta): Event {
  return new CustomEvent("open-document", {
    detail: `${meta.owner}/${meta.id}/${meta.name}`,
  });
}

export function getShipPallet(ship: Patp): string {
  let sum = 0;
  Array.from(ship).forEach((char: string) => {
    sum = sum + char.charCodeAt(0);
  });
  return [
    "#ef4444",
    "#f97316",
    "#f59e0b",
    "#ca8a04",
    "#84cc16",
    "#22c55e",
    "#10b981",
    "#14b8a6",
    "#06b6d4",
    "#0ea5e9",
    "#3b82f6",
    "#6366f1",
    "#8b5cf6",
    "#a855f7",
    "#d946ef",
    "#ec4899",
    "#f43f5e",
  ][sum % 16];
}

/* Urbit State -------------------------------------------------------------- */
export enum ConnectionStatus {
  Closed,
  Connected,
  Retrying,
  Errored,
}

export enum NotifStatus {
  None,
  Stage,
  Update,
  Both,
}

export interface VersionEncoded {
  timestamp: Date;
  ship: Patp;
  snapshot: Uint8Array;
}

export interface Version {
  timestamp: Date;
  ship: Patp;
  snapshot: Snapshot;
}

export interface Update {
  author: Patp;
  content: Uint8Array;
  time: Date;
}

export interface DocumentMeta {
  owner: Patp;
  id: string;
  name: string;
}

export interface DocumentUpdate {
  author: Patp;
  content: Array<number>;
  time: Date;
}

export interface FolderMeta {
  id: any;
  name: string;
}

export interface Snap {
  time: number;
  ship: Patp;
  data: Array<number>;
}
