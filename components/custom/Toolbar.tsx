"use client"

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  FORMAT_TEXT_COMMAND,
  UNDO_COMMAND,
  REDO_COMMAND,
  $getSelection,
  $isRangeSelection,
  TextFormatType,
} from "lexical";
import {
  $createHeadingNode,
  $createQuoteNode,
} from "@lexical/rich-text";
import { $createListItemNode, $createListNode } from "@lexical/list";
import {
  Bold,
  Italic,
  Underline,
  Heading2,
  List,
  ListOrdered,
  Quote,
  Undo2,
  Redo2,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";

export default function Toolbar() {
  const [editor] = useLexicalComposerContext();
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);

  const updateToolbar = useCallback(() => {
    editor.read(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        setIsBold(selection.hasFormat("bold"));
        setIsItalic(selection.hasFormat("italic"));
        setIsUnderline(selection.hasFormat("underline"));
      }
    });
  }, [editor]);

  useEffect(() => {
    editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        updateToolbar();
      });
    });
  }, [editor, updateToolbar]);

  const toggleFormat = (format: TextFormatType) => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
  };

  const insertHeading = (level: "h1" | "h2" | "h3") => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const headingNode = $createHeadingNode(level);
        headingNode.append(...selection.extract());
        selection.insertNodes([headingNode]);
      }
    });
  };

  const insertBlockquote = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const quoteNode = $createQuoteNode();
        quoteNode.append(...selection.extract());
        selection.insertNodes([quoteNode]);
      }
    });
  };

  const insertBulletList = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const listNode = $createListNode("bullet");
        const nodes = selection.extract();
        for (const node of nodes) {
          listNode.append($createListItemNode());
        }
        if (listNode.getChildren().length === 0) {
          listNode.append($createListItemNode());
        }
        selection.insertNodes([listNode]);
      }
    });
  };

  const insertOrderedList = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const listNode = $createListNode("number");
        const nodes = selection.extract();
        for (const node of nodes) {
          listNode.append($createListItemNode());
        }
        if (listNode.getChildren().length === 0) {
          listNode.append($createListItemNode());
        }
        selection.insertNodes([listNode]);
      }
    });
  };

  const handleUndo = () => {
    editor.dispatchCommand(UNDO_COMMAND, undefined);
  };

  const handleRedo = () => {
    editor.dispatchCommand(REDO_COMMAND, undefined);
  };

  const buttonClass =
    "p-2 hover:bg-gray-200 rounded transition-colors flex items-center justify-center";
  const activeButtonClass = "bg-gray-300";

  return (
    <div className="flex flex-wrap gap-1 border-b border-gray-200 bg-gray-50 p-2">
      <button
        onClick={handleUndo}
        className={buttonClass}
        title="Undo"
        type="button"
      >
        <Undo2 size={18} />
      </button>
      <button
        onClick={handleRedo}
        className={buttonClass}
        title="Redo"
        type="button"
      >
        <Redo2 size={18} />
      </button>

      <div className="w-px bg-gray-300" />

      <button
        onClick={() => toggleFormat("bold" as TextFormatType)}
        className={`${buttonClass} ${isBold ? activeButtonClass : ""}`}
        title="Bold"
        type="button"
      >
        <Bold size={18} />
      </button>
      <button
        onClick={() => toggleFormat("italic" as TextFormatType)}
        className={`${buttonClass} ${isItalic ? activeButtonClass : ""}`}
        title="Italic"
        type="button"
      >
        <Italic size={18} />
      </button>
      <button
        onClick={() => toggleFormat("underline" as TextFormatType)}
        className={`${buttonClass} ${isUnderline ? activeButtonClass : ""}`}
        title="Underline"
        type="button"
      >
        <Underline size={18} />
      </button>

      <div className="w-px bg-gray-300" />

      <button
        onClick={() => insertHeading("h2")}
        className={buttonClass}
        title="Heading 2"
        type="button"
      >
        <Heading2 size={18} />
      </button>
      <button
        onClick={insertBulletList}
        className={buttonClass}
        title="Bullet List"
        type="button"
      >
        <List size={18} />
      </button>
      <button
        onClick={insertOrderedList}
        className={buttonClass}
        title="Ordered List"
        type="button"
      >
        <ListOrdered size={18} />
      </button>
      <button
        onClick={insertBlockquote}
        className={buttonClass}
        title="Quote"
        type="button"
      >
        <Quote size={18} />
      </button>
    </div>
  );
}
