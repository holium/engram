import { Patp } from "@urbit/http-api";
import * as Y from "yjs";
import {
  DocumentId,
  DocumentSettings,
  FolderMeta,
  DocumentUpdate,
  Snap,
} from "../document/types";

export type Folder = Array<DocumentMeta | FolderMeta>;

export const pathParser = new RegExp(
  "(?<owner>[^/]+)/(?<id>[^/]+)/(?<name>[^/]+)"
);

export function checkUrbitWindow(reject?: (message?: any) => void) {
  if (
    typeof (window as any).ship == "undefined" ||
    typeof (window as any).urbit == "undefined"
  ) {
    if (typeof reject != "undefined")
      reject("couldn't find urbit on the window");
    throw "couldn't find urbit on the window";
  }
}

/* Scries ------------------------------------------------------------------- */

export function listDocuments(): Promise<Array<DocumentMeta>> {
  return new Promise((resolve, reject) => {
    checkUrbitWindow(reject);
    (window as any).urbit.scry({ app: "engram", path: "/docinfo" }).then(
      (response: any) => {
        console.log(response);
        resolve(response);
      },
      (err: any) => {
        console.log("list documents error: ", err);
      }
    );
  });
}

export function listFolders(): Promise<Array<FolderMeta>> {
  return new Promise((resolve, reject) => {
    checkUrbitWindow(reject);
    (window as any).urbit.scry({ app: "engram", path: "/gfolders" }).then(
      (response: any) => {
        console.log(response);
        resolve(response);
      },
      (err: any) => {
        console.log("list folders error: ", err);
      }
    );
  });
}

export function getDocument(meta: DocumentMeta): Promise<Document> {
  return new Promise((resolve, reject) => {
    checkUrbitWindow(reject);
    console.log("calling get document", meta);
    (window as any).urbit
      .scry({
        app: "engram",
        path: `/gdoc/${meta.owner}/${meta.id}/${meta.name}`,
      })
      .then((response: any) => {
        console.log(response);
        resolve(response);
      });
  });
}

export function getDocumentSettings(meta: DocumentMeta): Promise<Document> {
  return new Promise((resolve, reject) => {
    checkUrbitWindow(reject);
    (window as any).urbit
      .scry({
        app: "engram",
        path: `/gsetting/${meta.owner}/${meta.id}/${meta.name}`,
      })
      .then((response: any) => {
        resolve(response);
      });
  });
}

export function getAvailibleUpdates(
  meta: DocumentMeta
): Promise<Array<DocumentUpdate>> {
  return new Promise((resolve, reject) => {
    checkUrbitWindow(reject);
    (window as any).urbit
      .scry({
        app: "engram",
        path: `/pull/${meta.owner}/${meta.id}/${meta.name}`,
      })
      .then((response: any) => {
        console.log(response);
        resolve(response);
      });
  });
}

export function getSnapshots(meta: DocumentMeta) {
  return new Promise((resolve, reject) => {
    checkUrbitWindow(reject);
    (window as any).urbit
      .scry({
        app: "engram",
        path: `/getsnaps/${meta.owner}/${meta.id}/${meta.name}`,
      })
      .then((response: any) => {
        resolve(
          Object.values(response).map((snap: any) => {
            return {
              timestamp: new Date(snap.date),
              ship: `~${snap.ship}`,
              snapshot: Y.decodeSnapshotV2(
                Uint8Array.from(Object.values(snap.data))
              ),
            };
          })
        );
      });
  });
}

/* Pokes -------------------------------------------------------------------- */

export function createDocument(
  name: string,
  doc: { version: Array<number>; content: Array<number> },
  owner?: Patp
): Promise<{ id: DocumentId; settings: DocumentSettings }> {
  return new Promise(async (resolve, reject) => {
    checkUrbitWindow(reject);
    const id: DocumentId = {
      id: Array.from(
        new Uint8Array(
          await crypto.subtle.digest(
            "SHA-256",
            new TextEncoder().encode(`~${window.ship}-${crypto.randomUUID()}`)
          )
        )
      )
        .map((a) => {
          return a.toString(16).padStart(2, "0");
        })
        .join(""),
      timestamp: Date.now(),
    };
    const settings: DocumentSettings = {
      name: name.replaceAll(" ", "-"),
      owner: owner ? owner : "~" + (window as any).ship,
      perms: owner
        ? [owner, (window as any).ship]
        : ["~" + (window as any).ship],
    };
    console.log(id, settings);
    setDocumentSettings(id, settings).then(() => {
      (window as any).urbit.poke({
        app: "engram",
        mark: "post",
        json: {
          make: {
            dmeta: id,
            doc: doc,
          },
        },
        onSuccess: () => {
          (window as any).urbit.poke({
            app: "engram",
            mark: "post",
            json: { createsnap: { dmeta: id } },
            onSuccess: () => {
              resolve({ id: id, settings: settings });
            },
            onError: (e: any) => {
              console.error("Error initializing version history: ", meta, e);
              reject("Error initializing version history");
            },
          });
        },
        onError: (e: any) => {
          console.error("Error creating document: ", meta, e);
          reject("Error creating document");
        },
      });
    });
  });
}

export function saveDocument(
  meta: DocumentMeta,
  doc: { version: Array<number>; content: Array<number> }
) {
  return new Promise<void>((resolve, reject) => {
    checkUrbitWindow(reject);
    (window as any).urbit.poke({
      app: "engram",
      mark: "post",
      json: { save: { dmeta: meta, doc: doc } },
      onSuccess: () => {
        resolve();
      },
      onError: (e: any) => {
        console.error("Error sending update:", doc, " to document: ", meta, e);
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
      mark: "post",
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

export function createFolder(folder: FolderMeta): Promise<FolderMeta> {
  return new Promise<FolderMeta>((resolve, reject) => {
    checkUrbitWindow(reject);
    const fmeta = {
      id: folder.id,
      name: folder.name.replaceAll(" ", "-"),
    };
    (window as any).urbit.poke({
      app: "engram",
      mark: "post",
      json: { mfolder: { fmeta: fmeta } },
      onSuccess: () => {
        resolve(fmeta);
      },
      onError: (e: any) => {
        console.error("Error creating folder: ", folder);
      },
    });
  });
}

export function deleteFolder(folder: FolderMeta) {
  return new Promise<void>((resolve, reject) => {
    checkUrbitWindow(reject);
    (window as any).urbit.poke({
      app: "engram",
      mark: "post",
      json: { dfolder: { fmeta: folder } },
      onSuccess: () => {
        resolve();
      },
      onError: (e: any) => {
        console.error("Error deleting folder: ", folder);
      },
    });
  });
}

export function setDocumentSettings(
  id: DocumentId,
  settings: DocumentSettings
) {
  return new Promise<void>((resolve, reject) => {
    checkUrbitWindow(reject);
    (window as any).urbit.poke({
      app: "engram",
      mark: "post",
      json: { settings: { dmeta: id, stg: settings } },
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

export function addToFolder(meta: FolderMeta, doc: FolderMeta | DocumentMeta) {
  return new Promise<void>((resolve, reject) => {
    checkUrbitWindow(reject);
    (window as any).urbit.poke({
      app: "engram",
      mark: "post",
      json: {
        foldoc: {
          fmeta: meta,
          fldr: { [(doc as any).owner ? "doc" : "folder"]: doc },
        },
      },
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
      mark: "post",
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

export function recordSnapshot(
  meta: DocumentMeta,
  snap: { date: number; ship: Patp; data: Array<number> }
) {
  return new Promise<void>((resolve, reject) => {
    checkUrbitWindow(reject);
    (window as any).urbit.poke({
      app: "engram",
      mark: "post",
      json: { snap: { dmeta: meta, snap: snap } },
      onSuccess: () => {
        resolve();
      },
      onError: (e: any) => {
        console.error(
          "Error recording snap:",
          snap,
          " for document: ",
          meta,
          e
        );
        reject("Error recording snap");
      },
    });
  });
}

export function sendUpdate(doc: string, update: DocumentUpdate) {
  return new Promise<void>((resolve, reject) => {
    checkUrbitWindow(reject);
    (window as any).urbit.poke({
      app: "engram",
      mark: "post",
      json: { sendUpdate: { doc: doc, update: update } },
      onSuccess: () => {
        resolve();
      },
      onError: (e: any) => {
        console.error(
          "Error sending update ",
          update,
          " for document: ",
          doc,
          e
        );
        reject("Error sending update");
      },
    });
  });
}

export function recordUpdate(doc: string, update: DocumentUpdate) {
  return new Promise<void>((resolve, reject) => {
    checkUrbitWindow(reject);
    (window as any).urbit.poke({
      app: "engram",
      mark: "post",
      json: { record: { doc: doc, update: update } },
      onSuccess: () => {
        resolve();
      },
      onError: (e: any) => {
        console.error(
          "Error recording update ",
          update,
          " for document: ",
          doc,
          e
        );
        reject("Error recording update");
      },
    });
  });
}

export function acknowledgeUpdate(doc: string, update: number) {
  return new Promise<void>((resolve, reject) => {
    checkUrbitWindow(reject);
    (window as any).urbit.poke({
      app: "engram",
      mark: "post",
      json: { merge: { doc: doc, update: update } },
      onSuccess: () => {
        resolve();
      },
      onError: (e: any) => {
        console.error(
          "Error acknowleding update ",
          update,
          " for document: ",
          doc,
          e
        );
        reject("Error acknowleding update");
      },
    });
  });
}

export function addRemoteDocument(
  from: Patp,
  path: string
): Promise<DocumentMeta> {
  return new Promise((resolve, reject) => {
    const subId = (window as any).urbit.subscribeToRemoteDocument(
      from,
      path,
      (event: any) => {
        console.log("adding remote doc, event: ", event);
        /*
        createDocument().then((meta) => {
          resolve(meta);
          subId.then((id) => {
            unsubscribe(id);
          })
        });
        */
      }
    );
  });
}

// both whitelist and blacklist just modify the settings
export function setWhitelist(
  dmeta: DocumentMeta,
  whitelist: Array<Patp>
): Promise<Array<Patp>> {
  return new Promise((resolve, reject) => {
    if ((window as any) == dmeta.owner) {
      (window as any).urbit.poke({
        app: "engram",
        mark: "post",
        json: { settings: { dmeta: dmeta, stg: whitelist } },
        onSuccess: () => {
          resolve(whitelist);
        },
        onError: (e: any) => {
          console.error(
            "Error setting whitelist ",
            update,
            " for document: ",
            dmeta,
            e
          );
          reject("Error acknowleding update");
        },
      });
    } else {
      reject();
    }
  });
}

// simply a caller function
export async function collectUpdates() {
  /*
  (await listDocuments()).forEach(async (doc) => {
    const members = await getDocumentSettings(doc);
    members.forEach((member) => {
      const subId = subscribeToRemoteDocument(member, doc, (event) => {
        recordUpdate(doc, event);
        subId.then((id) => unsubscribe(id))
    });
    })
  });
  */
}

/* Subscriptions */
export function subscribeToRemoteDocument(
  from: Patp,
  doc: string,
  handler: (event: any) => void,
  handleQuit?: (event: any) => void,
  handleError?: (e: any) => void
): Promise<string> {
  return new Promise((resolve, reject) => {
    checkUrbitWindow(reject);
    (window as any).urbit
      .subscribe({
        app: "engram",
        path: `/${doc}`,
        ship: from,
        event: (event) => {
          console.log("received event from subscription: ", doc, ": ", event);
          //recordUpdate()
          handler(event);
        },
        quit: (event: any) => {
          console.log(
            "remote document subscription quit to:" + doc + " quit:",
            event
          );
          if (typeof handleQuit != "undefined") handleQuit(event);
        },
        err: (err: AnimationPlayState) => {
          console.warn("error wiht subscription to document", doc, err);
          if (typeof handleError != "undefined") handleError(err);
        },
      })
      .then((subId) => {
        console.log(subId);
        resolve(subId);
      });
  });
}

export function unsubscribe(subscriptionId: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    (window as any).urbit.unsubscribe(subscriptionId).then(() => {
      resolve();
    });
  });
}
