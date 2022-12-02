import type { Patp } from "@urbit/http-api"
import type * as Y from "yjs";

export interface RootState {
  documents: DocumentState,
  folders: FolderState,
  workspace: WorkspaceState
}

export interface Space {
  path: string;
  name: string;
  image: string;
  color: string;
}

export interface SpaceState {
  path: string,
  name: string,
  image: string,
  color: string,
}

// File Management -------------------------------------------------------------

export interface DocumentState {
  [key: string]: Document
}

export interface ItemMeta {
  id: string;
  name: string;
  owner: string;
  content?: { [key: string]: {id: string, type: string} }
}

export interface Document {
  id: string;
  name: string;
  owner: Patp;
}

export interface DocumentContent {
  content: Uint8Array;
  version: Uint8Array;
}

export interface DocumentMeta {
  id: string,
  name: string,
  owner: Patp,
}

export interface FolderState {
  [key: string]: Folder,
}

export interface FolderMeta {
  id: string;
  name: string;
}

export interface Folder {
  id: string,
  name: string,
  owner: string,
  content: { [key:string]: { id: string, type: string } },
}

// Workspace ------------------------------------------------------------------

export interface WorkspaceState {
  snapshot: null | DocumentVersion;
  version: null | Uint8Array;
  content: null | Uint8Array;
}

export interface DocumentUpdate {
  timestamp: string,
  author: Patp,
  content: Uint8Array
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

export interface VersionMeta {
  author: Patp;
  date: Date;
}

export interface DocumentVersion {
  timestamp: number;
  author: Patp;
  snapshot: Y.Snapshot;
  date: Date;
}
