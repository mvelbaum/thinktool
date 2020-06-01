import * as React from "react";
import * as T from "../tree";
import * as Tutorial from "../tutorial";
import {Context} from "../context";
import {actionsWith} from "../actions";
import * as Sh from "../shortcuts";

function ToolbarGroup(props: {children: React.ReactNode; title?: string}) {
  if (props.title === undefined) {
    return (
      <div className="toolbar-group unnamed-toolbar-group">
        <div>{props.children}</div>
      </div>
    );
  } else {
    return (
      <div className="toolbar-group named-toolbar-group">
        <h6>{props.title}</h6>
        <div>{props.children}</div>
      </div>
    );
  }
}

function ToolbarButton(props: {
  action: () => void;
  description: string;
  shortcut?: string;
  icon: string;
  label: string;
  name: Tutorial.FunctionName;
  context: Context;
  alwaysEnabled?: true;
  disabled?: boolean;
}) {
  return (
    <button
      className={
        Tutorial.isRelevant(props.context.tutorialState, props.name)
          ? "tutorial-relevant"
          : Tutorial.isNotIntroduced(props.context.tutorialState, props.name)
          ? "tutorial-not-introduced"
          : ""
      }
      tabIndex={0}
      onFocus={(ev) => {
        console.log("Attempted focusing button %o", props.name);
      }}
      onMouseDown={(ev) => {
        console.log("Mouse down on button %o", props.name);
        // If we don't preventDefault, then we lose focus due to click on
        // background on macOS. This seems to happen in Safari, Firefox and
        // Chrome, but only on macOS for some reason.
        //
        // Last tested 2020-05-31. Don't remove this without testing on macOS.
        ev.preventDefault();
      }}
      onClick={(ev) => {
        console.log("Clicked button %o", props.name);
        props.action();
        ev.preventDefault();
      }}
      title={props.description + (props.shortcut === undefined ? "" : ` [${props.shortcut}]`)}
      disabled={(T.focused(props.context.tree) === null && !props.alwaysEnabled) || props.disabled}>
      <span className={`icon gg-${props.icon}`}></span>
      {props.label}
    </button>
  );
}

export default function Toolbar(props: {context: Context}) {
  function actions(noTargetRequired?: true) {
    if (T.focused(props.context.tree) === null && !noTargetRequired) {
      throw "No item focused, so cannot handle actions";
    }
    // Very ugly hack: focused item may be null, but we just force it anyway,
    // since it should only be null when actions don't actually require a
    // target.
    return actionsWith(props.context, T.focused(props.context.tree)!);
  }

  return (
    <div className="toolbar">
      <ToolbarGroup title="Navigate">
        <ToolbarButton
          action={() => {
            actions(true).showSearchPopup();
          }}
          description="Search for a specific item by its content."
          shortcut={Sh.format(Sh.standard.find)}
          icon="search"
          label="Find"
          alwaysEnabled
          context={props.context}
          name="find"
        />
        <ToolbarButton
          action={() => {
            actions().zoom();
          }}
          description="Zoom in on selected item"
          shortcut="Middle click bullet"
          icon="maximize-alt"
          label="Zoom"
          context={props.context}
          name="zoom"
        />
      </ToolbarGroup>
      <ToolbarGroup title="Item">
        <ToolbarButton
          action={() => {
            actions(true).createSiblingAfter();
          }}
          description="Create a new item as a sibling of the currently selected item"
          shortcut={`Enter/${Sh.format(Sh.standard.forceCreateSibling)}`}
          icon="add-r"
          label="New"
          context={props.context}
          alwaysEnabled
          name="new"
        />
        <ToolbarButton
          action={() => {
            actions().createChild();
          }}
          description="Create a new child of the selected item"
          shortcut={Sh.format(Sh.standard.createChild)}
          icon="arrow-bottom-right-r"
          label="New Child"
          context={props.context}
          name="new-child"
        />
        <ToolbarButton
          action={() => {
            actions().removeFromParent();
          }}
          description="Remove the selected item from its parent. This does not delete the item."
          shortcut={Sh.format(Sh.standard.removeFromParent)}
          icon="remove-r"
          label="Remove"
          context={props.context}
          name="remove"
        />
        <ToolbarButton
          action={() => {
            actions().delete();
          }}
          description="Permanently delete the selected item. If this item has other parents, it will be removed from *all* parents."
          shortcut={Sh.format(Sh.standard.delete)}
          icon="trash"
          label="Destroy"
          context={props.context}
          name="destroy"
        />
      </ToolbarGroup>
      <ToolbarGroup title="Move">
        <ToolbarButton
          action={() => {
            actions().unindent();
          }}
          description="Unindent the selected item"
          shortcut={Sh.format(Sh.standard.unindent)}
          icon="push-chevron-left"
          label="Unindent"
          context={props.context}
          name="unindent"
        />
        <ToolbarButton
          action={() => {
            actions().indent();
          }}
          description="Indent the selected item"
          shortcut={Sh.format(Sh.standard.indent)}
          icon="push-chevron-right"
          label="Indent"
          context={props.context}
          name="indent"
        />
        <ToolbarButton
          action={() => {
            actions().moveUp();
          }}
          description="Move the selected item up"
          shortcut={Sh.format(Sh.standard.moveUp)}
          icon="push-chevron-up"
          label="Up"
          context={props.context}
          name="up"
        />
        <ToolbarButton
          action={() => {
            actions().moveDown();
          }}
          description="Move the selected item down"
          shortcut={Sh.format(Sh.standard.moveDown)}
          icon="push-chevron-down"
          label="Down"
          context={props.context}
          name="down"
        />
      </ToolbarGroup>
      <ToolbarGroup title="Connect">
        <ToolbarButton
          action={() => {
            actions().showSiblingPopup();
          }}
          description="Insert an existing item as a sibling after the currently selected item."
          shortcut={Sh.format(Sh.standard.insertSibling)}
          icon="add"
          label="Sibling"
          context={props.context}
          name="insert-sibling"
        />
        <ToolbarButton
          action={() => {
            actions().showChildPopup();
          }}
          description="Insert an existing item as a child of the currently selected item."
          shortcut={Sh.format(Sh.standard.insertChild)}
          icon="arrow-bottom-right-o"
          label="Child"
          context={props.context}
          name="insert-child"
        />
        <ToolbarButton
          action={() => {
            actions().showParentPopup();
          }}
          description="Insert an existing item as a parent of the currently selected item."
          shortcut={Sh.format(Sh.standard.insertParent)}
          icon="arrow-top-left-o"
          label="Parent"
          context={props.context}
          name="insert-parent"
        />
        <ToolbarButton
          action={() => {
            actions().showLinkPopup();
          }}
          description="Insert a reference to an existing item at the position of the text."
          shortcut={Sh.format(Sh.standard.insertLink)}
          icon="file-document"
          label="Link"
          context={props.context}
          name="insert-link"
        />
      </ToolbarGroup>
      <ToolbarGroup title="Help">
        <ToolbarButton
          action={() => {
            actions(true).resetTutorial();
          }}
          disabled={Tutorial.isActive(props.context.tutorialState)}
          description="Go through the tutorial again."
          icon="info"
          label="Tutorial"
          alwaysEnabled
          context={props.context}
          name="tutorial"
        />
        <ToolbarButton
          action={() => {
            props.context.setChangelogShown(!props.context.changelogShown);
          }}
          description="Show list of updates to Thinktool."
          icon="list"
          label="Updates"
          alwaysEnabled
          context={props.context}
          name="changelog"
        />
      </ToolbarGroup>
    </div>
  );
}
