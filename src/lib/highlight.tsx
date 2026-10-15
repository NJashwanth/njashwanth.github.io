import type { ReactNode } from 'react';

// Tiny, dependency-free highlighter for the project previews. Monochrome on
// purpose: weight and brightness carry the syntax, not extra colours.
const KEYWORDS = new Set(
  'abstract async await class const extends final for if import mixin new null on override private protected public readonly return static super this true false void var let export interface implements throw try catch'.split(
    ' ',
  ),
);
const TOKEN = /(\/\/.*$)|('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*`)|(@\w+)|(\b[A-Z][A-Za-z0-9_]*\b)|(\b[a-z_]\w*\b)|(\b\d[\d_]*\b)/gm;

export function highlight(code: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  let key = 0;
  for (const m of code.matchAll(TOKEN)) {
    const [text, comment, str, anno, type, word, num] = m;
    if (m.index! > last) out.push(code.slice(last, m.index));
    const cls = comment
      ? 'tk-c'
      : str
        ? 'tk-s'
        : anno
          ? 'tk-a'
          : type
            ? 'tk-t'
            : word && KEYWORDS.has(word)
              ? 'tk-k'
              : num
                ? 'tk-n'
                : null;
    out.push(cls ? <span key={key++} className={cls}>{text}</span> : text);
    last = m.index! + text.length;
  }
  if (last < code.length) out.push(code.slice(last));
  return out;
}
