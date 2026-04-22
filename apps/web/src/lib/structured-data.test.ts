/**
 * Structured-data (JSON-LD) validation.
 * Run with: tsx apps/web/src/lib/structured-data.test.ts
 */
import {
  organizationSchema,
  localBusinessSchema,
  projectCreativeWorkSchema,
  artworkVisualArtworkSchema,
  jsonLdScript,
} from "./structured-data";

let passed = 0;
let failed = 0;

function assert(condition: boolean, msg: string) {
  if (condition) {
    passed++;
    console.log(`  \u2713 ${msg}`);
  } else {
    failed++;
    console.error(`  \u2717 FAIL: ${msg}`);
  }
}

console.log("JSON-LD schemas\n");

console.log("organizationSchema():");
const org = organizationSchema();
assert(org["@context"] === "https://schema.org", '@context is schema.org');
assert(org["@type"] === "Organization", '@type is Organization');
assert(typeof org.name === "string" && (org.name as string).length > 0, "has name");
assert(typeof org.url === "string", "has url");
assert(Array.isArray(org.sameAs), "has sameAs[]");

console.log("\nlocalBusinessSchema():");
const lb = localBusinessSchema();
assert(lb["@type"] === "LocalBusiness", '@type is LocalBusiness');
assert(typeof lb.telephone === "string", "has telephone");
assert(
  (lb.telephone as string).startsWith("+"),
  "telephone is E.164 (starts with +)"
);
const addr = lb.address as { addressCountry?: string };
assert(addr?.addressCountry === "AR", "address country is AR");
assert(Array.isArray(lb.areaServed), "areaServed is an array");
const countries = (lb.areaServed as Array<{ name: string }>).map(
  (a) => a.name
);
assert(
  countries.includes("Argentina") && countries.includes("Chile"),
  "areaServed includes Argentina and Chile"
);

console.log("\nprojectCreativeWorkSchema():");
const proj = projectCreativeWorkSchema({
  title: "Casa Susel",
  slug: "casa-susel",
  summary: "A beautiful home",
  year: 2021,
  location: "Mendoza",
  category: "residencial",
  coverImageUrl: "https://cdn/example.jpg",
});
assert(proj["@type"] === "CreativeWork", '@type is CreativeWork');
assert(proj.name === "Casa Susel", "name matches title");
assert(
  typeof proj.url === "string" &&
    (proj.url as string).includes("/proyectos/casa-susel"),
  "url contains /proyectos/{slug}"
);
assert(proj.dateCreated === "2021", "dateCreated is year string");
assert(
  typeof proj.description === "string",
  "description present when summary given"
);
assert(
  JSON.stringify(proj).includes("Mendoza"),
  "location appears somewhere in schema"
);

console.log("\nprojectCreativeWorkSchema() — partial data:");
const projMin = projectCreativeWorkSchema({
  title: "Minimal",
  slug: "minimal",
});
assert(projMin["@type"] === "CreativeWork", "still a CreativeWork");
assert(!("dateCreated" in projMin), "omits dateCreated when year missing");
assert(!("description" in projMin), "omits description when summary missing");
assert(!("locationCreated" in projMin), "omits locationCreated when absent");

console.log("\nartworkVisualArtworkSchema():");
const art = artworkVisualArtworkSchema({
  title: "Mountains",
  slug: "mountains",
  technique: "Oleo sobre lienzo",
  year: 2024,
  widthCm: 80,
  heightCm: 100,
  priceArs: 500000,
  status: "disponible",
  coverImageUrl: "https://cdn/mountains.jpg",
});
assert(art["@type"] === "VisualArtwork", '@type is VisualArtwork');
assert(art.name === "Mountains", "name matches title");
assert(art.width === "80 cm", "width formatted as '80 cm'");
assert(art.height === "100 cm", "height formatted as '100 cm'");
const offers = art.offers as { price: string; availability: string };
assert(offers?.price === "500000", "offer price is stringified");
assert(
  offers?.availability === "https://schema.org/InStock",
  "InStock when status disponible"
);

const soldArt = artworkVisualArtworkSchema({
  title: "Triptico Mapa",
  slug: "triptico-mapa",
  priceArs: 700000,
  status: "vendido",
});
const soldOffers = soldArt.offers as { availability: string };
assert(
  soldOffers?.availability === "https://schema.org/SoldOut",
  "SoldOut when status vendido"
);

console.log("\njsonLdScript() safety:");
const safe = jsonLdScript({ test: "</script><xss>" });
assert(
  !safe.__html.includes("</script>"),
  "escapes </script> closing tags"
);
assert(
  safe.__html.includes("\\u003c"),
  "escapes '<' as unicode escape"
);
const parsedBack = JSON.parse(safe.__html.replace(/\\u003c/g, "<"));
assert(
  parsedBack.test === "</script><xss>",
  "round-trips the original payload"
);

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
