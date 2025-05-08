import { createContext, useContext, useEffect, useState } from "react";

const UIContext = createContext(null);

export function UIProvider({ children }) {
  const [fontIndex, setFontIndex] = useState(2); // 16-24 px
  const [language, setLanguage] = useState("es");
  const [darkMode, setDarkMode] = useState(false);
  const [daltonic, setDaltonic] = useState(false);

  /* ───── Persistencia localStorage ───── */
  useEffect(() => {
    const cfg = JSON.parse(localStorage.getItem("uiCfg") || "{}");
    if (cfg.fontIndex !== undefined) setFontIndex(cfg.fontIndex);
    if (cfg.language !== undefined) setLanguage(cfg.language);
    if (cfg.darkMode !== undefined) setDarkMode(cfg.darkMode);
    if (cfg.daltonic !== undefined) setDaltonic(cfg.daltonic);
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "uiCfg",
      JSON.stringify({ fontIndex, language, darkMode, daltonic })
    );
  }, [fontIndex, language, darkMode, daltonic]);

  /* ───── Efectos visuales globales ───── */
  useEffect(() => {
    document.documentElement.style.setProperty(
      "--base-font",
      `${[16, 18, 20, 22, 24][fontIndex]}px`
    );
  }, [fontIndex]);

  const value = {
    fontIndex, setFontIndex,
    language, setLanguage,
    darkMode, setDarkMode,
    daltonic, setDaltonic
  };

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function useUI() {
  return useContext(UIContext);
}
