export interface SnippetFile {
  id: string;
  filename: string;
  code: string;
  language: string;
}

export interface Snippet {
  id: string;
  title: string;
  description?: string;
  files: SnippetFile[];
  tags: string[];
  isTemplate?: boolean;
  isFavorite?: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface Folder {
  id: string;
  name: string;
  color: string;
  createdAt: number;
  updatedAt: number;
}

export type AppTheme = 'dark' | 'light' | 'dracula' | 'onedark' | 'nord';

export type IconPack = 'brand' | 'classic' | 'minimal';

export interface AppSettings {
  theme: AppTheme;
  hotkey: string;
  locale: 'en' | 'ru';
  lineWrapping: boolean;
  hideOnCopy: boolean;
  iconPack: IconPack;
  fontSize: number;
  sidebarWidth: number;
  showLineNumbers: boolean;
  tabSize: number;
  highlightActiveLine: boolean;
}

export const SUPPORTED_LANGUAGES = [
  { label: 'JavaScript', value: 'javascript' },
  { label: 'TypeScript', value: 'typescript' },
  { label: 'JSX/TSX', value: 'jsx' },
  { label: 'Go', value: 'go' },
  { label: 'Ruby', value: 'ruby' },
  { label: 'Swift', value: 'swift' },
  { label: 'Kotlin', value: 'kotlin' },
  { label: 'C#', value: 'csharp' },
  { label: 'Python', value: 'python' },
  { label: 'Rust', value: 'rust' },
  { label: 'Java', value: 'java' },
  { label: 'C / C++', value: 'cpp' },
  { label: 'PHP', value: 'php' },
  { label: 'SQL', value: 'sql' },
  { label: 'HTML', value: 'html' },
  { label: 'XML', value: 'xml' },
  { label: 'CSS', value: 'css' },
  { label: 'SCSS', value: 'scss' },
  { label: 'Vue', value: 'vue' },
  { label: 'Svelte', value: 'svelte' },
  { label: 'YAML', value: 'yaml' },
  { label: 'JSON', value: 'json' },
  { label: 'Dockerfile', value: 'dockerfile' },
  { label: 'Markdown', value: 'markdown' },
  { label: 'Bash / Shell', value: 'bash' },
  { label: 'Plain Text', value: 'text' },
];
