import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          welcome: "Welcome to Memozi",
        },
      },
      hi: {
        translation: {
          welcome: "Memozi में आपका स्वागत है",
        },
      },
      bn: {
        translation: {
          welcome: "Memozi তে আপনাকে স্বাগতম",
        },
      },
    },
    lng: "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;