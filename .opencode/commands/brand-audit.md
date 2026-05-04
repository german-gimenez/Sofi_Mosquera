---
description: Audita violaciones del Brand DNA (colores prohibidos, fonts bold, vocabulario)
agent: build
---

Buscá violaciones del Brand DNA en `apps/` y `packages/ui/`:

1. Blanco puro `#FFFFFF` o `#FFF` (excluir node_modules):
!`Get-ChildItem -Path apps,packages\ui -Recurse -Include *.tsx,*.css,*.ts | Select-String -Pattern '#FFFFFF|#FFF\b' -CaseSensitive | Select-Object -First 30`

2. Negro puro `#000000` o `#000`:
!`Get-ChildItem -Path apps,packages\ui -Recurse -Include *.tsx,*.css,*.ts | Select-String -Pattern '#000000|#000\b' -CaseSensitive | Select-Object -First 30`

3. Uso de `font-bold` o `font-extrabold` o weight 600+ en headings:
!`Get-ChildItem -Path apps,packages\ui -Recurse -Include *.tsx | Select-String -Pattern 'font-bold|font-extrabold|font-black' | Select-Object -First 20`

4. Vocabulario prohibido:
!`Get-ChildItem -Path apps,packages\ui,apps\web\messages -Recurse -Include *.tsx,*.json,*.md | Select-String -Pattern 'barato|oferta|económico|economico|decoración|decoracion' | Select-Object -First 20`

5. `<img>` raw (debería ser `next/image`):
!`Get-ChildItem -Path apps -Recurse -Include *.tsx | Select-String -Pattern '<img\s' | Select-Object -First 20`

Reportá:
- Cantidad de violaciones por categoría
- Archivos puntuales con violaciones críticas (1-3 por categoría)
- Sugerencia de fix (ej: cambiar `#fff` por `#F5F3EE`)

> Las galerías y lightboxes pueden usar `<img>` por razones específicas — no flagearlas como críticas.
