import type { Patp } from "@urbit/http-api"
import type * as Y from "yjs";

export interface RootState {
  documents: DocumentState,
  folders: FolderState,
  workspace: WorkspaceState
}

// File Management -------------------------------------------------------------

export interface DocumentState {
  [key: string]: Document
}

export interface Document {
  id: string;
  name: string;
  owner: Patp;
}

export interface DocumentMeta {
  id: string,
  name: string,
  owner: Patp,
}

export interface FolderState {
  [key: string]: Folder,
}

export interface Folder {
  id: string,
  name: string,
  documents: Array<string>,
  folders: Array<string>,
}

// Workspace ------------------------------------------------------------------

export interface WorkspaceState {
  snapshot: null | number;
  version: null | Uint8Array;
  content: null | Uint8Array;
}

// Settings
export interface SettingsState {
  autosync: boolean;
  roleperms: { [key: string]: DocumnetPermission };
  shipperms: { [key: Patp]: DocumnetPermission };
}

export type DocumnetPermission = 'write' | 'read'

// Revisions
export type RevisionState = Array<DocumentVersion>

export interface DocumentVersion {
  timestamp: number;
  author: Patp;
  Snapshot: Y.Snapshot;
  date: Date;
}
