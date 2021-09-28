import * as A from "../app";
import {Content} from "../data";
import * as D from "./diff";

// Sketch of effect system. The idea is that we would write an interpreter for
// this that saves changes to storage (server, database, or both).
//
// We should write tests for this, and we should modify the Storage interface so
// it can return information about whether any errors occurred.

type Effect =
  | null
  | {launch: Effect[]}
  | {batched: Effect; label: string}
  | {updateLocalApp: (app: A.App) => A.App}
  | {deleteThing: string; then(response: "ok" | "error"): Effect}
  | {updateThings: D.Changes["updated"]; then(response: "ok" | "error"): Effect}
  | {setContent: Content; thing: string; then(response: "ok" | "error"): Effect}
  | {tutorialFinished: boolean; then(response: "ok" | "error"): Effect};

export function onUpdate(previous: A.App, current: A.App): Effect {
  const changes = D.changes(previous, current);

  const thenVerifyResponse: {then(response: "ok" | "error"): Effect} = {
    then(response: "ok" | "error") {
      if (response === "ok") return null;
      else return {updateLocalApp: (app: A.App) => A.serverDisconnected(app)};
    },
  };

  const deletedEffects = changes.deleted.map((deleted) => ({deleteThing: deleted, ...thenVerifyResponse}));
  const updatedEffect = changes.updated.length > 0 ? {updateThings: changes.updated, ...thenVerifyResponse} : null;
  const editedEffects = changes.edited.map((edited) => ({
    label: edited.thing,
    batched: {setContent: edited.content, thing: edited.thing, ...thenVerifyResponse},
  }));
  const tutorialFinishedEffect = changes.tutorialFinished
    ? {tutorialFinished: changes.tutorialFinished, ...thenVerifyResponse}
    : null;

  return {launch: [...deletedEffects, updatedEffect, ...editedEffects, tutorialFinishedEffect]};
}
