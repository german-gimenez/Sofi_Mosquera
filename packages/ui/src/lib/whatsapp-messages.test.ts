import { describe, it, expect } from "vitest";
import {
  WHATSAPP_PHONE,
  WHATSAPP_MESSAGES,
  WHATSAPP_MESSAGES_I18N,
  artworkMessage,
  furnitureMessage,
  projectMessage,
  messageForPath,
  buildWhatsAppUrl,
} from "./whatsapp-messages";

describe("whatsapp-messages constants", () => {
  it("exports the canonical Sofia phone number", () => {
    expect(WHATSAPP_PHONE).toBe("5492615456913");
  });

  it("provides a message for every WhatsAppContext", () => {
    const keys: Array<keyof typeof WHATSAPP_MESSAGES> = [
      "default",
      "home",
      "asesoria",
      "contacto",
      "sobre",
      "studio",
      "interiorismo",
      "arte-index",
      "muebles-index",
      "proyectos-index",
      "muebles-custom",
      "muebles-personalize",
    ];
    for (const key of keys) {
      expect(WHATSAPP_MESSAGES[key]).toBeTruthy();
      expect(WHATSAPP_MESSAGES[key]).toMatch(/^Hola Sofi!/);
    }
  });

  it("all messages use voseo tone (no 'Sofia,' greeting, no 'usted' form)", () => {
    for (const value of Object.values(WHATSAPP_MESSAGES)) {
      expect(value).not.toMatch(/Hola Sofia,/);
      expect(value).not.toMatch(/\busted\b/i);
    }
  });
});

describe("artworkMessage", () => {
  it("builds a personalized message without series", () => {
    const result = artworkMessage("Mountains");
    expect(result).toContain('"Mountains"');
    expect(result).not.toContain("de la serie");
    expect(result).toMatch(/^Hola Sofi!/);
    expect(result).toContain("precio");
  });

  it("includes the series when provided", () => {
    const result = artworkMessage("Isla Gris", "Emociones");
    expect(result).toContain('"Isla Gris"');
    expect(result).toContain("de la serie Emociones");
  });

  it("treats null or empty series as absent", () => {
    expect(artworkMessage("X", null)).not.toContain("serie");
    expect(artworkMessage("X", "")).not.toContain("serie");
  });
});

describe("furnitureMessage", () => {
  it("references the piece title verbatim", () => {
    const result = furnitureMessage("Mesa Norte");
    expect(result).toContain('"Mesa Norte"');
    expect(result).toContain("Muebles");
    expect(result).toMatch(/medidas|terminaciones|entrega/);
  });
});

describe("projectMessage", () => {
  it("references the project title and asks for more info", () => {
    const result = projectMessage("Casa Laura");
    expect(result).toContain("Casa Laura");
    expect(result).toMatch(/saber m[aá]s/i);
  });
});

describe("messageForPath", () => {
  it("maps home exactly", () => {
    expect(messageForPath("/")).toBe(WHATSAPP_MESSAGES.home);
  });

  it("maps top-level routes", () => {
    expect(messageForPath("/asesoria")).toBe(WHATSAPP_MESSAGES.asesoria);
    expect(messageForPath("/contacto")).toBe(WHATSAPP_MESSAGES.contacto);
    expect(messageForPath("/sobre")).toBe(WHATSAPP_MESSAGES.sobre);
    expect(messageForPath("/studio")).toBe(WHATSAPP_MESSAGES.studio);
    expect(messageForPath("/studio#proceso")).toBe(WHATSAPP_MESSAGES.studio);
    expect(messageForPath("/interiorismo")).toBe(
      WHATSAPP_MESSAGES.interiorismo
    );
    expect(messageForPath("/arte")).toBe(WHATSAPP_MESSAGES["arte-index"]);
    expect(messageForPath("/muebles")).toBe(WHATSAPP_MESSAGES["muebles-index"]);
    expect(messageForPath("/proyectos")).toBe(
      WHATSAPP_MESSAGES["proyectos-index"]
    );
  });

  it("maps dynamic slug routes to their section index message", () => {
    expect(messageForPath("/arte/mountains")).toBe(
      WHATSAPP_MESSAGES["arte-index"]
    );
    expect(messageForPath("/muebles/mesa-norte")).toBe(
      WHATSAPP_MESSAGES["muebles-index"]
    );
    expect(messageForPath("/proyectos/casa-laura")).toBe(
      WHATSAPP_MESSAGES["proyectos-index"]
    );
  });

  it("falls back to default for unknown routes", () => {
    expect(messageForPath("/unknown")).toBe(WHATSAPP_MESSAGES.default);
    expect(messageForPath("/foo/bar/baz")).toBe(WHATSAPP_MESSAGES.default);
  });
});

describe("bilingual messages (V3)", () => {
  it("WHATSAPP_MESSAGES_I18N has both es + en for every context", () => {
    for (const key of Object.keys(WHATSAPP_MESSAGES_I18N) as Array<
      keyof typeof WHATSAPP_MESSAGES_I18N
    >) {
      expect(WHATSAPP_MESSAGES_I18N[key].es).toBeTruthy();
      expect(WHATSAPP_MESSAGES_I18N[key].en).toBeTruthy();
      expect(WHATSAPP_MESSAGES_I18N[key].es).toMatch(/^Hola Sofi!|^Hola Sofía/);
      expect(WHATSAPP_MESSAGES_I18N[key].en).toMatch(/^Hi Sofi!|^Hi Sofía/);
    }
  });

  it("messageForPath strips locale prefix", () => {
    expect(messageForPath("/es/")).toBe(WHATSAPP_MESSAGES_I18N.home.es);
    expect(messageForPath("/en/")).toBe(WHATSAPP_MESSAGES_I18N.home.en);
    expect(messageForPath("/es/arte")).toBe(
      WHATSAPP_MESSAGES_I18N["arte-index"].es
    );
    expect(messageForPath("/en/art")).toBe(
      WHATSAPP_MESSAGES_I18N["arte-index"].en
    );
  });

  it("messageForPath maps localized estudio/services/contact", () => {
    expect(messageForPath("/en/studio")).toBe(WHATSAPP_MESSAGES_I18N.studio.en);
    expect(messageForPath("/en/services")).toBe(
      WHATSAPP_MESSAGES_I18N.servicios.en
    );
    expect(messageForPath("/en/contact")).toBe(
      WHATSAPP_MESSAGES_I18N.contacto.en
    );
    expect(messageForPath("/en/projects/foo")).toBe(
      WHATSAPP_MESSAGES_I18N["proyectos-index"].en
    );
  });

  it("messageForPath honours explicit locale arg", () => {
    expect(messageForPath("/", "en")).toBe(WHATSAPP_MESSAGES_I18N.home.en);
    expect(messageForPath("/contacto", "en")).toBe(
      WHATSAPP_MESSAGES_I18N.contacto.en
    );
  });
});

describe("artworkMessage enriched (V3)", () => {
  it("includes dimensions when provided", () => {
    const msg = artworkMessage("La Libertad", {
      series: "Emociones",
      widthCm: 80,
      heightCm: 100,
      technique: "Acrílico sobre lienzo",
      priceArs: 300000,
    });
    expect(msg).toContain("La Libertad");
    expect(msg).toContain("Emociones");
    expect(msg).toContain("80×100 cm");
    expect(msg).toContain("Acrílico sobre lienzo");
    expect(msg).toContain("$300.000");
  });

  it("supports english locale", () => {
    const msg = artworkMessage("Mountains", {
      series: "Emociones",
      widthCm: 60,
      heightCm: 50,
      locale: "en",
    });
    expect(msg).toMatch(/^Hi Sofi!/);
    expect(msg).toContain("Mountains");
    expect(msg).toContain("from the Emociones series");
    expect(msg).toContain("60×50 cm");
  });

  it("backward compatible with old (title, series) signature", () => {
    const msg = artworkMessage("Isla Gris", "Emociones");
    expect(msg).toContain("Isla Gris");
    expect(msg).toContain("de la serie Emociones");
  });
});

describe("buildWhatsAppUrl", () => {
  it("builds a valid wa.me URL with encoded message", () => {
    const url = buildWhatsAppUrl("Hola Sofi! ¿Cómo estás?");
    expect(url).toContain("https://wa.me/5492615456913");
    expect(url).toContain("text=");
    expect(url).toContain("%C2%BFC%C3%B3mo");
  });

  it("honors a custom phone number", () => {
    const url = buildWhatsAppUrl("test", "549999");
    expect(url).toContain("https://wa.me/549999");
  });

  it("encodes special characters (line breaks, emojis, quotes)", () => {
    const url = buildWhatsAppUrl('Line1\nLine2 "quoted"');
    expect(url).toContain("%0A");
    expect(url).toContain("%22");
  });

  it("round-trips to a decodable message", () => {
    const msg = artworkMessage("Isla Gris", "Emociones");
    const url = buildWhatsAppUrl(msg);
    const decoded = decodeURIComponent(
      url.split("text=")[1] ?? ""
    );
    expect(decoded).toBe(msg);
  });
});
