"use client"

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { ListItemNode, ListNode } from "@lexical/list";
import {
  HeadingNode,
  QuoteNode,
} from "@lexical/rich-text";
import { $generateHtmlFromNodes } from "@lexical/html";
import { LexicalEditor } from "lexical";
import { FC, ReactNode } from "react";
import Toolbar from "./Toolbar";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect, useRef } from "react";
import { $getRoot } from "lexical";
import { $generateNodesFromDOM } from "@lexical/html";

interface RichEditorProps {
  placeholder: string;
  onChange: (value: string) => void;
  value?: string;
}

// Custom error boundary for Lexical
const ErrorBoundary: FC<{ children: ReactNode }> = ({ children }) => {
  return <div>{children}</div>;
};

// Inner component to handle editor initialization with HTML content
const EditorContent = ({ htmlValue }: { htmlValue?: string }) => {
  const [editor] = useLexicalComposerContext();
  const isInitialized = useRef(false);

  useEffect(() => {
    // Only initialize content once on mount
    if (htmlValue && !isInitialized.current) {
      isInitialized.current = true;
      editor.update(() => {
        const parser = new DOMParser();
        const dom = parser.parseFromString(htmlValue, "text/html");
        const nodes = $generateNodesFromDOM(editor, dom);
        const root = $getRoot();
        root.clear();
        root.append(...nodes);
      });
    }
  }, [editor]);

  return null;
};

const RichEditor = ({ placeholder, onChange, value }: RichEditorProps) => {
  const initialConfig = {
    namespace: "RichEditor",
    nodes: [HeadingNode, QuoteNode, ListNode, ListItemNode],
    theme: {
      paragraph: "mb-1",
      heading: {
        h1: "text-3xl font-bold mb-4",
        h2: "text-2xl font-bold mb-3",
        h3: "text-xl font-bold mb-2",
      },
      quote: "border-l-4 border-gray-300 pl-4 italic my-2",
      list: {
        nested: {
          listitem: "list-none",
        },
        ol: "list-decimal list-inside",
        ul: "list-disc list-inside",
        listitem: "mb-1",
      },
    },
    onError: (error: Error) => {
      console.error("Lexical error:", error);
    },
  };

  const handleChange = (_editorState: any, editor: LexicalEditor) => {
    editor.read(() => {
      const html = $generateHtmlFromNodes(editor);
      onChange(html);
    });
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <EditorContent htmlValue={value} />
      <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
        <Toolbar />
        <div
          className="relative"
          style={{ minHeight: "300px" }}
        >
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className="py-4 px-4 outline-none"
              />
            }
            placeholder={
              <div className="absolute top-4 left-4 text-gray-400 pointer-events-none">
                {placeholder}
              </div>
            }
            ErrorBoundary={ErrorBoundary}
          />
          <HistoryPlugin />
          <ListPlugin />
          <OnChangePlugin onChange={handleChange} />
        </div>
      </div>
    </LexicalComposer>
  );
};

export default RichEditor;
