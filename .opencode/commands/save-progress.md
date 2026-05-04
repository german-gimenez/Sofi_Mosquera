---
description: Snapshot del estado actual antes de /compact o cerrar sesión
agent: build
---

Generá un resumen del estado actual del proyecto y actualizá `docs/STATE.md`:

1. Estado de git:
!`git status --short`

2. Último commit:
!`git log -1 --pretty=format:'%h %s (%cr)'`

3. Branch + tracking:
!`git rev-parse --abbrev-ref HEAD; git rev-parse --abbrev-ref @{upstream} 2>$null`

4. Diff stats vs HEAD:
!`git diff --stat HEAD`

5. Untracked files relevantes (sin temp/cache):
!`git ls-files --others --exclude-standard`

Con esa info:
- Actualizá `docs/STATE.md` agregando una entrada al inicio con fecha de hoy.
- Resumí en 3-5 bullets: qué se hizo en esta sesión, qué quedó WIP, próximos pasos.
- NO commitees automáticamente — solo escribí el archivo y mostralo al usuario para que confirme.
