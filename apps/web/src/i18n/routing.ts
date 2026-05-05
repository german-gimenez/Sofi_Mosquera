import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["es", "en"],
  defaultLocale: "es",
  localePrefix: "always",
  pathnames: {
    "/": "/",
    "/proyectos": {
      es: "/proyectos",
      en: "/projects",
    },
    "/proyectos/[slug]": {
      es: "/proyectos/[slug]",
      en: "/projects/[slug]",
    },
    "/estudio": {
      es: "/estudio",
      en: "/studio",
    },
    "/servicios": {
      es: "/servicios",
      en: "/services",
    },
    "/muebles": {
      es: "/muebles",
      en: "/furniture",
    },
    "/muebles/[slug]": {
      es: "/muebles/[slug]",
      en: "/furniture/[slug]",
    },
    "/arte": {
      es: "/arte",
      en: "/art",
    },
    "/arte/[slug]": {
      es: "/arte/[slug]",
      en: "/art/[slug]",
    },
    "/contacto": {
      es: "/contacto",
      en: "/contact",
    },
    "/privacidad": {
      es: "/privacidad",
      en: "/privacy-policy",
    },
    "/terminos": {
      es: "/terminos",
      en: "/terms",
    },
  },
});

export type Locale = (typeof routing.locales)[number];
