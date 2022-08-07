import {} from "@urbit/http-api";

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

export type Folder = Array<DocumentMeta | FolderMeta>;

export function checkUrbitWindow(reject?) {
  if (
    typeof (window as any).ship != "undefined" &&
    typeof (window as any).urbit != "undefined"
  ) {
    throw "couldn't find urbit on the window";
    if (typeof reject != "undefined")
      reject("couldn't find urbit on the window");
  }
}

/* Scries ------------------------------------------------------------------- */

export function listDocuments(): Promise<Array<DocumentMeta>> {
  return new Promise((resolve, reject) => {
    checkUrbitWindow(reject);
    (window as any).urbit
      .scry({ app: "engram", path: "/docinfo" })
      .then((response: any) => {
        console.log(response);
        resolve(response);
      });
  });
}

export function getDocument(meta: any): Promise<Document> {
  return new Promise((resolve, reject) => {
    checkUrbitWindow(reject);
    (window as any).urbit
      .scry({ app: "engram", path: "/gdoc", body: meta })
      .then((response: any) => {
        console.log(response);
        resolve(response);
      });
  });
}

export function getDocumentSettings(meta: any): Promise<Document> {
  return new Promise((resolve, reject) => {
    checkUrbitWindow(reject);
    (window as any).urbit
      .scry({ app: "engram", path: "/gsettings", body: meta })
      .then((response: any) => {
        console.log(response);
        resolve(response);
      });
  });
}

export function getAvailibleUpdates(meta: any): Promise<Array<DocumentUpdate>> {
  return new Promise((resolve, reject) => {
    checkUrbitWindow(reject);
    (window as any).urbit
      .scry({ app: "engram", path: "/pull", body: meta })
      .then((response: any) => {
        console.log(response);
        resolve(response);
      });
  });
}

/* Pokes -------------------------------------------------------------------- */

export function createDocument(
  meta: DocumentMeta,
  doc: Array<number>
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    checkUrbitWindow(reject);
    (window as any).urbit.poke({
      app: "engram",
      mark: "engram-do",
      json: { make: { dmeta: meta, doc: doc } },
      onSuccess: () => {
        resolve();
      },
      onError: (e: any) => {
        console.error("Error creating document: ", meta, e);
        reject("Error creating document");
      },
    });
  });
}

export function updateDocument(
  meta: DocumentMeta,
  doc: Array<number>,
  update: Array<number>
) {
  return new Promise<void>((resolve, reject) => {
    checkUrbitWindow(reject);
    (window as any).urbit.poke({
      app: "engram",
      mark: "engram-do",
      json: { update: { dmeta: meta, doc: doc, updt: update } },
      onSuccess: () => {
        resolve();
      },
      onError: (e: any) => {
        console.error(
          "Error sending update:",
          update,
          " to document: ",
          meta,
          e
        );
        reject("Error updating document");
      },
    });
  });
}

export function deleteDocument(meta: DocumentMeta) {
  return new Promise<void>((resolve, reject) => {
    checkUrbitWindow(reject);
    (window as any).urbit.poke({
      app: "engram",
      mark: "engram-do",
      json: { delete: { dmeta: meta } },
      onSuccess: () => {
        resolve();
      },
      onError: (e: any) => {
        console.error("Error deleting document: ", meta, e);
        reject("Error deleting document");
      },
    });
  });
}

export function setDocumentSettings(doc: any, settings: any) {
  return new Promise<void>((resolve, reject) => {
    checkUrbitWindow(reject);
    (window as any).urbit.poke({
      app: "engram",
      mark: "engram-do",
      json: { settings: { doc: doc, stg: settings } },
      onSuccess: () => {
        resolve();
      },
      onError: (e: any) => {
        console.error(
          "Error setting settings of doc: ",
          doc,
          " to: ",
          settings,
          e
        );
        reject("Error setting settings");
      },
    });
  });
}

export function createFolder(meta: FolderMeta) {
  return new Promise<void>((resolve, reject) => {
    checkUrbitWindow(reject);
    (window as any).urbit.poke({
      app: "engram",
      mark: "engram-do",
      json: { mfolder: { fmeta: meta } },
      onSuccess: () => {
        resolve();
      },
      onError: (e: any) => {
        console.error("Error creating folder: ", meta, e);
        reject("Error creating folder");
      },
    });
  });
}

export function deleteFolder(meta: FolderMeta) {
  return new Promise<void>((resolve, reject) => {
    checkUrbitWindow(reject);
    (window as any).urbit.poke({
      app: "engram",
      mark: "engram-do",
      json: { dfolder: { fmeta: meta } },
      onSuccess: () => {
        resolve();
      },
      onError: (e: any) => {
        console.error("Error deleteing folder: ", meta, e);
        reject("Error deleteing folder");
      },
    });
  });
}

export function addToFolder(meta: FolderMeta, doc: FolderMeta | DocumentMeta) {
  return new Promise<void>((resolve, reject) => {
    checkUrbitWindow(reject);
    (window as any).urbit.poke({
      app: "engram",
      mark: "engram-do",
      json: { foldoc: { fmeta: meta, fldr: doc } },
      onSuccess: () => {
        resolve();
      },
      onError: (e: any) => {
        console.error("Error adding document ", doc, " to folder ", meta, e);
        reject("Error deleteing folder");
      },
    });
  });
}

export function removeFromFolder(
  meta: FolderMeta,
  doc: FolderMeta | DocumentMeta
) {
  return new Promise<void>((resolve, reject) => {
    checkUrbitWindow(reject);
    (window as any).urbit.poke({
      app: "engram",
      mark: "engram-do",
      json: { remfoldoc: { fmeta: meta, fldr: doc } },
      onSuccess: () => {
        resolve();
      },
      onError: (e: any) => {
        console.error("Error removing document ", doc, " to folder ", meta, e);
        reject("Error deleteing folder");
      },
    });
  });
}

export function acknowledgeUpdate(meta: DocumentMeta, update: number) {
  return new Promise<void>((resolve, reject) => {
    checkUrbitWindow(reject);
    (window as any).urbit.poke({
      app: "engram",
      mark: "engram-do",
      json: { merge: { demta: meta, update: update } },
      onSuccess: () => {
        resolve();
      },
      onError: (e: any) => {
        console.error(
          "Error acknowleding update ",
          update,
          " for document: ",
          meta,
          e
        );
        reject("Error acknowleding update");
      },
    });
  });
}

/* Subscriptions */
export function subscribeUpdateStream(
  handler: (event: any) => void,
  quit: (event: any) => void,
  err: (e: any) => void
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    checkUrbitWindow(reject);
    (window as any).urbit
      .subscribe({
        app: "engram",
        path: "/updateupt",
        event: handler,
        quit: quit,
        err: err,
      })
      .then((response) => {
        console.log(response);
        resolve();
      });
  });
}
