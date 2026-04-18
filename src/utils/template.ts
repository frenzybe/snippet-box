/**
 * Extracts variable names from double-bracket templates: {{variableName}}
 */
export function extractVars(code: string): string[] {
  const matches = [...code.matchAll(/\{\{([^}]+)\}\}/g)];
  return [...new Set(matches.map(m => m[1].trim()))];
}

/**
 * Replaces template variables with provided values.
 */
export function resolveTemplate(code: string, values: Record<string, string>): string {
  let result = code;
  for (const [key, val] of Object.entries(values)) {
    result = result.split(`{{${key}}}`).join(val || `{{${key}}}`);
  }
  return result;
}
