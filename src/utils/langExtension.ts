import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { rust } from "@codemirror/lang-rust";
import { css } from "@codemirror/lang-css";
import { html } from "@codemirror/lang-html";
import { java } from "@codemirror/lang-java";
import { cpp } from "@codemirror/lang-cpp";
import { php } from "@codemirror/lang-php";
import { sql } from "@codemirror/lang-sql";
import { json } from "@codemirror/lang-json";
import { markdown } from "@codemirror/lang-markdown";
import { Extension } from "@codemirror/state";

export function getLangExtension(lang: string): Extension[] {
  const l = lang.toLowerCase();
  switch (l) {
    case 'js':
    case 'javascript':
    case 'text/javascript':
      return [javascript()];
    case 'ts':
    case 'typescript':
      return [javascript({ typescript: true })];
    case 'jsx':
      return [javascript({ jsx: true, typescript: true })];
    case 'python':
      return [python()];
    case 'rust':
      return [rust()];
    case 'css':
      return [css()];
    case 'html':
      return [html()];
    case 'java':
      return [java()];
    case 'cpp':
      return [cpp()];
    case 'php':
      return [php()];
    case 'sql':
      return [sql()];
    case 'json':
      return [json()];
    case 'markdown':
    case 'yaml':
      return [markdown()];
    case 'scss':
      return [css()];
    case 'xml':
    case 'vue':
    case 'svelte':
      return [html()];
    case 'bash':
    case 'shell':
    case 'dockerfile':
      // Basic support for shell/docker via markdown code blocks or similar
      return []; 
    default:
      return [];
  }
}
