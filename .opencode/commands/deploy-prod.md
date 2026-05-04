---
description: Deploy a producción del web (sofimosquera.com)
agent: build
---

Antes de deployar, verificá el estado:

Estado actual del repo:
!`git status --short`

Branch + último commit:
!`git log -1 --oneline; git rev-parse --abbrev-ref HEAD`

Pasos a ejecutar (preguntale al usuario antes de cada uno si vale la pena confirmar):

1. Confirmar que estás en `main` y todo committed/pusheado.
2. Verificar que el proyecto Vercel linkeado es `sofi-mosquera` (web):
   !`Get-Content .vercel/project.json`
3. Ejecutar deploy producción:
   `vercel --prod --yes`
4. Esperar a que termine y confirmar URL final + dominio.
5. Verificar que sofimosquera.com responde 200:
   `curl -I https://sofimosquera.com`

Reportá la URL del deployment y cualquier error.

> ⚠️ Si el push a `main` ya disparó el auto-deploy de Vercel, NO hace falta `vercel --prod`.
> En ese caso, solo correr `vercel ls sofi-mosquera | Select-Object -First 5` para ver el último.
