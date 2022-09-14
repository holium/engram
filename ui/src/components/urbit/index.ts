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

export function getDocument(meta: DocumentId): Promise<Document> {
  console.log("calling get document", meta);
  return new Promise((resolve, reject) => {
    checkUrbitWindow(reject);

    (window as any).urbit
      .scry({
        app: "engram",
        path: `/gdoc/${meta.id}/${meta.timestamp}`,
      })
      .then((response: any) => {
        console.log(response);
        resolve(response);
      });
  });
}

export function getDocumentSettings(meta: DocumentId): Promise<Document> {
  console.log("calling get document settings");
  return new Promise((resolve, reject) => {
    checkUrbitWindow(reject);
    (window as any).urbit
      .scry({
        app: "engram",
        path: `/gsetting/${meta.id}/${meta.timestamp}`,
      })
      .then((response: any) => {
        resolve(response);
      });
  });
}

export function getDocumentUpdates(meta: DocumentId): Promise {
  return new Promise((resolve, reject) => {
    checkUrbitWindow(reject);
    (window as any).urbit
      .scry({
        app: "engram",
        path: `/gupdates/${meta.id}/${meta.timestamp}`,
      })
      .then((response: any) => {
        resolve(response);
      });
  });
}

export function getSnapshots(meta: DocumentId) {
  return new Promise((resolve, reject) => {
    checkUrbitWindow(reject);
    (window as any).urbit
      .scry({
        app: "engram",
        path: `/getsnaps/${meta.id}/${meta.timestamp}`,
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
  doc: { version: Array<number>; content: string },
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
      name: name,
      owner: owner ? owner : "~" + (window as any).ship,
      perms: owner
        ? [owner, (window as any).ship]
        : ["~" + (window as any).ship],
    };
    setDocumentSettings(id, settings).then(() => {
      (window as any).urbit.poke({
        app: "engram",
        mark: "post",
        json: {
          docsetup: {
            dmeta: id,
            doc: doc,
            stg: settings,
          },
        },
        onSuccess: () => {
          resolve({
            id: id,
            settings: {
              name: settings.name,
              owner: settings.owner,
              perms: settings.perms,
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
  meta: DocumentId,
  doc: { version: Array<number>; content: string }
) {
  return new Promise<void>((resolve, reject) => {
    console.log("saving: ", doc);
    checkUrbitWindow(reject);
    (window as any).urbit.poke({
      app: "engram",
      mark: "post",
      json: {
        save: {
          dmeta: meta,
          doc: doc,
        },
      },
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

export function deleteDocument(id: DocumentId) {
  return new Promise<void>((resolve, reject) => {
    checkUrbitWindow(reject);
    (window as any).urbit.poke({
      app: "engram",
      mark: "post",
      json: { delete: { dmeta: id } },
      onSuccess: () => {
        //delete document
        resolve();
      },
      onError: (e: any) => {
        console.warn("Error deleting document: ", id, e);
        reject("Error deleting document");
      },
    });
    (window as any).urbit.poke({
      app: "engram",
      mark: "post",
      json: { dsettings: { dmeta: id } },
      onSuccess: () => {
        //delete document settings
        resolve();
      },
      onError: (e: any) => {
        console.warn("Error deleting document settings: ", id, e);
        reject("Error deleting document settings");
      },
    });
    (window as any).urbit.poke({
      app: "engram",
      mark: "post",
      json: { dupdates: { dmeta: id } },
      onSuccess: () => {
        //delete document updates
        resolve();
      },
      onError: (e: any) => {
        console.error("Error deleting document: ", id, e);
        reject("Error deleting document");
      },
    });
    (window as any).urbit.poke({
      app: "engram",
      mark: "post",
      json: { dsnaps: { dmeta: id } },
      onSuccess: () => {
        //delete document snapshots
        resolve();
      },
      onError: (e: any) => {
        console.error("Error deleting document: ", id, e);
        reject("Error deleting document");
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

export function renameDocument(id: DocumentId, newName: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    console.log("renaming document: ", id, " to: ", newName);
    getDocumentSettings(id).then((stg) => {
      const newStg = {
        name: newName,
        owner: "~" + stg.owner,
        perms: Object.values(stg.whitelist).map((ship) => "~" + ship),
      };
      console.log(newStg);
      setDocumentSettings(id, newStg).then((res) => {
        console.log("rename document result: ", res);
        resolve();
      });
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

export function renameFolder(
  folder: FolderMeta,
  newName: string
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const fmeta = {
      id: folder.id,
      name: newName.replaceAll(" ", "-"),
    };
    checkUrbitWindow(reject);
    (window as any).urbit.poke({
      app: "engram",
      mark: "post",
      json: { renamefolder: { old: folder, new: fmeta } },
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

export function addToFolder(
  meta: FolderMeta,
  doc: FolderMeta | DocumentId,
  isDoc: boolean
) {
  if (isDoc) doc = doc.id;

  return new Promise<void>((resolve, reject) => {
    checkUrbitWindow(reject);
    (window as any).urbit.poke({
      app: "engram",
      mark: "post",
      json: {
        foldoc: {
          fmeta: meta,
          fldr: { [isDoc ? "doc" : "folder"]: doc },
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
  doc: FolderMeta | DocumentId,
  isDoc: boolean
) {
  if (isDoc) doc = doc.id;
  return new Promise<void>((resolve, reject) => {
    checkUrbitWindow(reject);
    (window as any).urbit.poke({
      app: "engram",
      mark: "post",
      json: {
        remfoldoc: { fmeta: meta, fldr: { [isDoc ? "doc" : "folder"]: doc } },
      },
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
      json: {
        snap: {
          dmeta: meta,
          snap: {
            date: snap.date,
            ship: snap.ship,
            data: Array.from(snap.data),
          },
        },
      },
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

export function recordUpdate(doc: DocumentId, update: DocumentUpdate) {
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

export function sendUpdate(doc: DocumentId, update: DocumentUpdate) {
  return new Promise<void>((resolve, reject) => {
    checkUrbitWindow(reject);
    (window as any).urbit.poke({
      app: "engram",
      mark: "post",
      json: { "update-live": { dmeta: doc, update: update } },
      onSuccess: () => {
        resolve();
      },
      onError: (e: any) => {
        console.error(
          "Error pushing update ",
          update,
          " for document: ",
          doc,
          e
        );
        reject("Error pushing update");
      },
    });
  });
}

export function acknowledgeUpdate(dmeta: DocumentId, update: any) {
  return new Promise<void>((resolve, reject) => {
    checkUrbitWindow(reject);
    (window as any).urbit.poke({
      app: "engram",
      mark: "post",
      json: {
        merge: {
          dmeta: dmeta,
          update: {
            author: "~" + update.author,
            content: JSON.stringify(Array.from(update.content)),
            time: update.timestamp.getTime(),
          },
        },
      },
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

export function addRemoteDocument(path: string): Promise<DocumentMeta> {
  return new Promise(async (resolve, reject) => {
    const urlParser = new RegExp("(?<from>[^/]+)/(?<id>.+)");
    const parsed = path.match(urlParser);
    const parsedId = parsed.groups.id.match(
      new RegExp("(?<id>[^/]+)/(?<timestamp>.+)")
    );
    const docId = {
      id: parsedId.groups.id,
      timestamp: parseInt(parsedId.groups.timestamp),
    };
    subscribeToRemoteDocument(parsed.groups.from, docId).then((res) => {
      console.log("adding remote doc, path:", path);
      /*
      setTimeout(() => {
        unsubscribeFromRemoteDocument(parsed.groups.from);
      }, 12000);
      */
      resolve(docId);
    });
  });
}

// both whitelist and blacklist just modify the settings
export function setWhitelist(
  id: DocumentId,
  whitelist: Array<Patp>
): Promise<Array<Patp>> {
  return new Promise((resolve, reject) => {
    (window as any).urbit.poke({
      app: "engram",
      mark: "post",
      json: { settings: { dmeta: id, stg: whitelist } },
      onSuccess: () => {
        resolve(whitelist);
      },
      onError: (e: any) => {
        console.error(
          "Error setting whitelist ",
          update,
          " for document: ",
          id,
          e
        );
        reject("Error acknowleding update");
      },
    });
  });
}

/* Subscriptions */
let subs = [];

export function subscribeToRemoteDocument(
  from: Patp,
  id: DocumentId
): Promise<string> {
  return new Promise((resolve, reject) => {
    checkUrbitWindow(reject);
    console.log("subing to remote document: ", id, " from ship: ", from);
    (window as any).urbit.poke({
      app: "engram",
      mark: "post",
      json: { unsub: { ship: "~" + from } },
      onSuccess: () => {
        (window as any).urbit.poke({
          app: "engram",
          mark: "post",
          json: { sub: { dmeta: id, ship: "~" + from } },
          onSuccess: () => {
            subs.push(from);
            resolve(from);
          },
          onError: (e: any) => {
            console.warn(
              "Error subscribing to document ",
              id,
              " from ship: ",
              from,
              e
            );
            reject("Error acknowleding update");
          },
        });
      },
      onError: (e: any) => {
        console.warn(
          "Error subscribing to document ",
          id,
          " from ship: ",
          from,
          e
        );
        reject("Error acknowleding update");
      },
    });
  });
}

export function unsubscribeFromRemoteDocument(from: Patp): Promise<string> {
  return new Promise((resolve, reject) => {
    checkUrbitWindow(reject);
    console.log("unsubing from ship: ", from);
    subs.splice(subs.indexOf(from), 1);
    (window as any).urbit.poke({
      app: "engram",
      mark: "post",
      json: { unsub: { ship: "~" + from } },
      onSuccess: () => {
        resolve();
      },
      onError: (e: any) => {
        console.error("Error unsibscribing from ship ", from, e);
        reject("Error acknowleding update");
      },
    });
  });
}

export function clearSubscriptions() {
  subs.forEach((ship) => {
    unsubscribeFromRemoteDocument(ship);
  });
}
