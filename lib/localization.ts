"use client";

import { useLanguage } from "@/context/LanguageContext";
import en from "../locales/en/common.json";
import ur from "../locales/ur/common.json";

const translations = {
  en,
  ur,
};

type TranslationKey = keyof typeof en;

export function useLocalization() {
  const { language } = useLanguage();

  const t = (key: TranslationKey): string => {
    const lang = language === "en" || language === "ur" ? language : "en";
    // @ts-ignore
    // return translations[lang][key] || key.toUpperCase(); // last resort
    return translations[lang][key] || key.toUpperCase();
  };

  return { t };
}
