"use client";
import i18next from "i18next";

export default function LanguageToggle() {
  return (
    <select
      onChange={(e) => i18next.changeLanguage(e.target.value)}
      className="px-3 py-2 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-white"
      defaultValue={i18next.language}
    >
      <option value="en">English</option>
      <option value="hi">हिन्दी</option>
      <option value="bn">বাংলা</option>
      <option value="es">Español</option>
      <option value="fr">Français</option>
      <option value="de">Deutsch</option>
      <option value="ja">日本語</option>
    </select>
  );
}