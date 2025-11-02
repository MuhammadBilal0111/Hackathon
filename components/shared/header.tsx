
"use client";

import { useLanguage } from "@/context/LanguageContext";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

export default function Header() {
  const { language, changeLanguage } = useLanguage();
  const { t } = useTranslation();

  return (
    <header className="bg-primary text-primary-foreground py-4 px-6 flex justify-between items-center">
      <h1 className="text-xl font-bold">{t("title")}</h1>
      <div className="flex items-center space-x-4">
        <Button
          variant={language === "en" ? "secondary" : "ghost"}
          onClick={() => changeLanguage("en")}
        >
          English
        </Button>
        <Button
          variant={language === "ur" ? "secondary" : "ghost"}
          onClick={() => changeLanguage("ur")}
        >
          Urdu
        </Button>
      </div>
    </header>
  );
}
