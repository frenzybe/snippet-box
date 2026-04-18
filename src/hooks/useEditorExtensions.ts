import { useMemo } from 'react';
import { EditorView } from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import { indentUnit } from "@codemirror/language";
import { getLangExtension } from '../utils/langExtension';

interface EditorExtensionsOptions {
  fontSize: number;
  tabSize: number;
  lineWrapping: boolean;
  language: string;
}

export function useEditorExtensions({
  fontSize,
  tabSize,
  lineWrapping,
  language
}: EditorExtensionsOptions) {
  const fontSizeExtension = useMemo(() => {
    return EditorView.theme({
      ".cm-content, .cm-gutters": {
        fontSize: `${fontSize}px`,
      },
      ".cm-scroller": {
        fontFamily: 'var(--font-mono)',
      }
    });
  }, [fontSize]);

  const tabSizeExtension = useMemo(() => {
    return [
      indentUnit.of(" ".repeat(tabSize)),
      EditorState.tabSize.of(tabSize)
    ];
  }, [tabSize]);

  const extensions = useMemo(() => [
    ...getLangExtension(language || ''),
    ...(lineWrapping ? [EditorView.lineWrapping] : []),
    fontSizeExtension,
    tabSizeExtension
  ], [language, lineWrapping, fontSizeExtension, tabSizeExtension]);

  return extensions;
}
