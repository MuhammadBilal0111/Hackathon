
"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-primary text-primary-foreground py-12 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-bold mb-4">{t("aboutSmartKissan")}</h3>
            <p className="text-sm opacity-90">{t("aboutText")}</p>
          </div>
          <div>
            <h3 className="font-bold mb-4">{t("quickLinks")}</h3>
            <ul className="text-sm space-y-2 opacity-90">
              <li>
                <Link href="#" className="hover:opacity-100">
                  {t("browseProducts")}
                </Link>
              </li>
              <li>
                <a href="#" className="hover:opacity-100">
                  {t("becomeAVendor")}
                </a>
              </li>
              <li>
                <a href="#" className="hover:opacity-100">
                  {t("trackOrder")}
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">{t("support")}</h3>
            <ul className="text-sm space-y-2 opacity-90">
              <li>
                <a href="#" className="hover:opacity-100">
                  {t("helpCenter")}
                </a>
              </li>
              <li>
                <a href="#" className="hover:opacity-100">
                  {t("contactUs")}
                </a>
              </li>
              <li>
                <a href="#" className="hover:opacity-100">
                  {t("faqs")}
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">{t("legal")}</h3>
            <ul className="text-sm space-y-2 opacity-90">
              <li>
                <a href="#" className="hover:opacity-100">
                  {t("privacyPolicy")}
                </a>
              </li>
              <li>
                <a href="#" className="hover:opacity-100">
                  {t("termsOfService")}
                </a>
              </li>
              <li>
                <a href="#" className="hover:opacity-100">
                  {t("cookiePolicy")}
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-primary-foreground border-opacity-20 pt-8 text-center text-sm">
          <p className="opacity-90">{t("copyright")}</p>
        </div>
      </div>
    </footer>
  );
}
