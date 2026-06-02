import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import de from "./locales/de/translation.json";
import en from "./locales/en/translation.json";
import uk from "./locales/uk/translation.json";
import pl from "./locales/pl/translation.json";

export const defaultNS = "translation" as const;

/**
 * Initialize i18next.
 *
 * Notes:
 * - We keep resources bundled (no HTTP backend) for simplicity.
 * - Language is detected (localStorage, navigator, htmlTag) and cached in localStorage.
 */
void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "pl",
    supportedLngs: ["pl", "en", "de", "uk"],
    interpolation: {
      escapeValue: false, // React already escapes
    },
    resources: {
      pl: { [defaultNS]: pl },
      en: { [defaultNS]: en },
      de: { [defaultNS]: de },
      uk: { [defaultNS]: uk },
    },
    detection: {
      order: ["localStorage", "navigator", "htmlTag"],
      caches: ["localStorage"],
    },
  });

export default i18n;
