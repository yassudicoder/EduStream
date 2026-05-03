"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { LanguageCode, TRANSLATIONS, t as translateKey } from "./languages";

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string) => string;
  mounted: boolean;
}

const LanguageCtx = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  t: (key) => key,
  mounted: false,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Load language from localStorage
    const saved = (localStorage.getItem("edu-language") as LanguageCode) || "en";
    setLanguageState(saved);
    setMounted(true);
  }, []);

  function setLanguage(lang: LanguageCode) {
    setLanguageState(lang);
    localStorage.setItem("edu-language", lang);
    // Apply language to HTML element for RTL support
    if (lang === "ar") {
      document.documentElement.setAttribute("dir", "rtl");
      document.documentElement.setAttribute("lang", lang);
    } else {
      document.documentElement.setAttribute("dir", "ltr");
      document.documentElement.setAttribute("lang", lang);
    }
  }

  function t(key: string): string {
    return TRANSLATIONS[language]?.[key] ?? TRANSLATIONS.en[key] ?? key;
  }

  return (
    <LanguageCtx.Provider value={{ language, setLanguage, t, mounted }}>
      {children}
    </LanguageCtx.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageCtx);
  if (!ctx) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return ctx;
}
