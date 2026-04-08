export interface SnippetFile {
  id: string;
  filename: string;
  code: string;
  language: string;
}

export interface Snippet {
  id: string;
  title: string;
  files: SnippetFile[];
  tags: string[];
  isTemplate?: boolean;
  isFavorite?: boolean;
}

export interface AppSettings {
  theme: 'dark' | 'light';
  hotkey: string;
  locale: 'en' | 'ru';
}

export const SUPPORTED_LANGUAGES = [
  { label: 'JavaScript', value: 'javascript' },
  { label: 'TypeScript', value: 'typescript' },
  { label: 'JSX/TSX', value: 'jsx' },
  { label: 'Bash / Shell', value: 'bash' },
  { label: 'Python', value: 'python' },
  { label: 'Rust', value: 'rust' },
  { label: 'CSS', value: 'css' },
  { label: 'HTML', value: 'html' },
  { label: 'Java', value: 'java' },
  { label: 'C / C++', value: 'cpp' },
  { label: 'PHP', value: 'php' },
  { label: 'SQL', value: 'sql' },
  { label: 'JSON', value: 'json' },
  { label: 'Markdown', value: 'markdown' },
  { label: 'Plain Text', value: 'text' },
];
