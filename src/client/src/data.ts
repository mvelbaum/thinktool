export {State, Connection} from "./data/representation";

export {
  empty,
  allThings,
  connectionParent,
  connectionChild,
  childConnections,
  content,
  setContent,
  insertChild,
  removeChild,
  create,
  forget,
  exists,
  parents,
  children,
  hasChildren,
  hasChildrenOrReferences,
  addChild,
  remove,
  otherParents,
  transformFullStateResponseIntoState,
  transformStateIntoFullStateResponse,
  diff,
} from "./data/core";

export {Content, references, backreferences, contentText, contentEq} from "./data/content";

import {State} from "./data/representation";

export function root(state: State): string {
  return "0";
}
