import { useMemo } from 'react';
import { dracula } from "@uiw/codemirror-theme-dracula";
import { githubLight } from "@uiw/codemirror-theme-github";
import { Extension } from "@codemirror/state";
import { useSettingsStore } from '../store/useSettingsStore';
import { getLangExtension } from '../utils/langExtension';

export function useTheme(language: string) {
  const theme = useSettingsStore(state => state.theme);
  
  const themeExtension = useMemo<Extension>(() => {
    const baseTheme = theme === 'light' ? githubLight : dracula;
    const langExt = getLangExtension(language);
    
    return [baseTheme, ...langExt];
  }, [theme, language]);

  return {
    theme,
    themeExtension
  };
}
