import { useState, useMemo, useEffect, useCallback } from 'react';
import { Snippet } from '../types';
import { extractVars, resolveTemplate } from '../utils/template';

export function useTemplateVariables(snippet: Snippet | null) {
  const [varValues, setVarValues] = useState<Record<string, string>>({});

  const templateVars = useMemo(
    () => snippet ? [...new Set(snippet.files.flatMap(f => extractVars(f.code)))] : [],
    [snippet]
  );

  const isTemplate = templateVars.length > 0;

  // Reset/Initialize vars when snippet or its vars change
  useEffect(() => {
    setVarValues(prev => {
      const next: Record<string, string> = {};
      templateVars.forEach(v => {
        next[v] = prev[v] || '';
      });
      return next;
    });
  }, [templateVars]);

  const handleVarChange = useCallback((key: string, val: string) => {
    setVarValues(prev => ({ ...prev, [key]: val }));
  }, []);

  const resolveSnippetCode = useCallback((code: string) => {
    if (!isTemplate) return code;
    return resolveTemplate(code, varValues);
  }, [isTemplate, varValues]);

  const allFilled = useMemo(() => 
    templateVars.length === 0 || templateVars.every(v => varValues[v]?.trim()),
    [templateVars, varValues]
  );

  return {
    templateVars,
    varValues,
    isTemplate,
    allFilled,
    handleVarChange,
    resolveSnippetCode
  };
}
