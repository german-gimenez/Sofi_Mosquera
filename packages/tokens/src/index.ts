export const colors = {
  negro: {
    base: "#111111",
    suave: "#1A1A1A",
  },
  gris: {
    nav: "#B5B0A8",
    border: "#D5D1CA",
  },
  crema: "#EAE7E0",
  blanco: {
    calido: "#F5F3EE",
  },
} as const;

export const fonts = {
  heading: "'Instrument Serif', serif",
  body: "'Jost', sans-serif",
} as const;

export const fontWeight = {
  thin: "200",
  light: "300",
  regular: "400",
  medium: "500",
  semibold: "600",
} as const;

export const spacing = {
  section: "96px",
  sectionMobile: "64px",
  card: "40px",
  cardMobile: "24px",
  gap: "24px",
  gapSmall: "12px",
} as const;

export const radius = {
  card: "12px",
  image: "16px",
  pill: "500px",
  button: "8px",
} as const;

export const breakpoints = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
} as const;

/** Tailwind theme extension — import in tailwind.config.ts */
export const tailwindTheme = {
  colors: {
    brand: {
      negro: colors.negro.base,
      "negro-suave": colors.negro.suave,
      "gris-nav": colors.gris.nav,
      "gris-border": colors.gris.border,
      crema: colors.crema,
      "blanco-calido": colors.blanco.calido,
    },
  },
  fontFamily: {
    heading: [fonts.heading],
    body: [fonts.body],
  },
  borderRadius: {
    card: radius.card,
    image: radius.image,
    pill: radius.pill,
  },
} as const;
