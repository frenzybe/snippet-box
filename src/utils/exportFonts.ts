export interface ExportFont {
  id: string;
  name: string;
  family: string;
}

export const EXPORT_FONTS: ExportFont[] = [
  { 
    id: 'jetbrains-mono', 
    name: 'JetBrains Mono', 
    family: '"JetBrains Mono", monospace' 
  },
  { 
    id: 'fira-code', 
    name: 'Fira Code', 
    family: '"Fira Code", monospace' 
  },
  { 
    id: 'roboto-mono', 
    name: 'Roboto Mono', 
    family: '"Roboto Mono", monospace' 
  },
  { 
    id: 'source-code-pro', 
    name: 'Source Code Pro', 
    family: '"Source Code Pro", monospace' 
  },
  { 
    id: 'ibm-plex-mono', 
    name: 'IBM Plex Mono', 
    family: '"IBM Plex Mono", monospace' 
  },
  { 
    id: 'cascadia-code', 
    name: 'Cascadia Code', 
    family: '"Cascadia Code", Consolas, monospace' 
  },
  { 
    id: 'system', 
    name: 'System Monospace', 
    family: 'ui-monospace, SFMono-Regular, SF Mono, Menlo, Monaco, Consolas, monospace' 
  }
];
