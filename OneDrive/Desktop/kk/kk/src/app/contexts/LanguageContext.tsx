"use client";
import { createContext, useState, ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";

type LanguageContextProps = {
  language: string;
  changeLanguage: (lang: string) => void;
};

export const LanguageContext = createContext<LanguageContextProps>({
  language: "en",  // Default fallback language
  changeLanguage: () => {},
});

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [language, setLanguage] = useState<string | null>("en");  // Initialize with fallback language "en"
  const [isLoading, setIsLoading] = useState(true);  // Track loading state

  useEffect(() => {
    // Check if router.locale exists, otherwise default to "en"
    if (router.locale) {
      setLanguage(router.locale);  // Set language based on router locale
    } else {
      setLanguage("en");  // Fallback to "en" if locale is not available
    }
    setIsLoading(false);  // Stop loading
  }, [router]);

  const changeLanguage = (lang: string) => {
    setLanguage(lang);
    router.push(router.pathname, router.asPath, { locale: lang });  // Navigate with the selected locale
  };

  if (isLoading || language === null) {
    return <div>Loading...</div>;  // Show loading while waiting for the language to load
  }

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
