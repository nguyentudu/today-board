import type { Language } from "./i18n";

interface LanguageRoot {
  lang: string;
}

export function applyDocumentLanguage(
  language: Language,
  root: LanguageRoot = document.documentElement,
): void {
  root.lang = language;
}
