"use client";
import type React from "react";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

type Language = "en" | "ur";

interface LanguageContextType {
  language: Language;
  changeLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [language, setLanguage] = useState<Language>("en");
  const [translations, setTranslations] = useState<any>({});

  useEffect(() => {
    const loadTranslations = async () => {
      try {
        const localeData = await import(`../locales/${language}/common.json`);
        setTranslations(localeData.default);
      } catch (error) {
        console.error(`Could not load translations for ${language}`, error);
        // Fallback to English if translations are missing
        if (language !== "en") {
          const enLocaleData = await import(`../locales/en/common.json`);
          setTranslations(enLocaleData.default);
        }
      }
    };

    loadTranslations();
  }, [language]);

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
  };

  const t = useCallback(
    (key: string) => {
      return translations[key] || key;
    },
    [translations]
  );

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLocalization() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLocalization must be used within a LanguageProvider");
  }
  return context;
}