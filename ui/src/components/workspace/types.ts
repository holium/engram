/* App ---------------------------------------------------------------------- */
export function OpenDocumentEvent(meta: DocumentMeta): Event {
  return new CustomEvent("open-document", {
    detail: `${meta.owner}/${meta.id}/${meta.name}`,
  });
}

/* State -------------------------------------------------------------------- */
export interface Update {
  author: string;
  content: Uint8Array;
  time: Date;
}

export interface DocumentMeta {
  owner: string;
  id: string;
  name: string;
}

export interface DocumentUpdate {
  author: string;
  content: Array<number>;
  time: Date;
}

export interface FolderMeta {
  id: any;
  name: string;
}
