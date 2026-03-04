"use client"

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ListNode, ListItemNode } from "@lexical/list";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect } from "react";
import { $getRoot } from "lexical";
import { $generateNodesFromDOM } from "@lexical/html";
import { FC, ReactNode } from "react";

interface ReadTextProps {
  value: string;
}

// Custom error boundary for Lexical
const ErrorBoundary: FC<{ children: ReactNode }> = ({ children }) => {
  return <div>{children}</div>;
};

const TextRenderer = ({ html }: { html: string }) => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    editor.update(() => {
      const parser = new DOMParser();
      const dom = parser.parseFromString(html, "text/html");
      const nodes = $generateNodesFromDOM(editor, dom);
      const root = $getRoot();
      root.clear();
      root.append(...nodes);
    });
  }, [html, editor]);

  return (
    <RichTextPlugin
      contentEditable={
        <ContentEditable
          className="py-4 px-4 outline-none"
          readOnly
        />
      }
      placeholder={null}
      ErrorBoundary={ErrorBoundary}
    />
  );
};

const ReadText = ({ value }: ReadTextProps) => {
  const initialConfig = {
    namespace: "ReadText",
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

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <TextRenderer html={value} />
    </LexicalComposer>
  );
};

export default ReadText;
