/* App ---------------------------------------------------------------------- */
export function OpenDocumentEvent(meta: DocumentMeta): Event {
  return new CustomEvent("open-document", {
    detail: `${meta.owner}/${meta.id}/${meta.name}`,
  });
}

/* State -------------------------------------------------------------------- */
export interface DocumentMeta {
  owner: number;
  id: string;
  name: string;
}

export interface DocumentUpdate {
  author: number;
  content: Array<number>;
  time: Date;
}

export interface FolderMeta {
  id: any;
  name: string;
}
