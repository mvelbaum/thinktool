import * as React from "react";
import {Context} from "../context";
import {ExternalLink} from "./ExternalLink";

import * as A from "../app";
import * as E from "../editing";
import * as Sh from "../shortcuts";
import * as Ac from "../actions";

export function useTopBarProps(
  context: Context,
  args: {isToolbarShown: boolean; setIsToolbarShown(b: boolean): void; username?: string},
): Parameters<typeof TopBar>[0] {
  const [action, description] = (() => {
    const editor = A.focusedEditor(context);
    if (editor === null) {
      return ["find", "search"] as ["find", string];
    } else if (E.isEmpty(editor)) {
      return ["replace", "connect an existing item"] as ["replace", string];
    } else {
      console.log("not empty");
      return ["insert-link", "insert a link"] as ["insert-link", string];
    }
  })();

  return {
    isToolbarShown: args.isToolbarShown,
    login:
      args.username === undefined || context.server === undefined
        ? null
        : {
            username: args.username,
            logOutUrl: context.server.logOutUrl,
          },
    onToggleToolbar: () => args.setIsToolbarShown(!args.isToolbarShown),
    searchBar: {
      shortcut: Sh.format(Ac.shortcut(action)),
      action: description,
      onActivate() {
        context.send("action", {action});
      },
    },
  };
}

function SearchBar(props: {shortcut: string; action: string; onActivate(): void}) {
  return (
    <div className="search-bar" onClick={() => props.onActivate()}>
      Press <kbd>{props.shortcut}</kbd> to {props.action}.
    </div>
  );
}

export function TopBar(props: {
  isToolbarShown: boolean;
  login: null | {username: string; logOutUrl: string};

  onToggleToolbar(): void;

  searchBar: Parameters<typeof SearchBar>[0];
}) {
  return (
    <div className="top-bar">
      <div className="left">
        <ExternalLink className="logo" href="/">
          Thinktool
        </ExternalLink>
        <button onClick={() => props.onToggleToolbar()}>
          <i className="icon fas fa-bars" />
          {props.isToolbarShown ? "Hide" : "Show"} Menu
        </button>
      </div>
      <div className="middle">
        <SearchBar {...props.searchBar} />
      </div>
      <div className="right">
        {props.login && (
          <div id="current-user">
            <ExternalLink className="username" href="/user.html">
              {props.login.username}
            </ExternalLink>
            <a className="log-out" href={props.login.logOutUrl}>
              Log Out
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
