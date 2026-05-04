# `.opencode/` — OpenCode workspace

Configuración local de OpenCode para Sofia Mosquera. Convive con `.cursor/rules/`.

## Estructura

```
.opencode/
├── README.md           ← este archivo
├── commands/           ← comandos custom (slash commands del TUI)
│   ├── audit.md
│   ├── deploy-prod.md
│   ├── deploy-preview.md
│   ├── db-push.md
│   ├── tests.md
│   ├── i18n-check.md
│   ├── brand-audit.md
│   └── save-progress.md
└── agents/             ← agents custom (no usado todavía)
```

## Convivencia con Cursor

- **Fuente única de verdad**: `AGENTS.md` (raíz). OpenCode lo lee automáticamente; Cursor también si está
  como base de las reglas.
- `.cursor/rules/*.mdc` se carga vía `opencode.json > instructions` para que OpenCode también las respete.
- `CLAUDE.md` apunta a `AGENTS.md` (compatibilidad con Claude Code).
- Si Cursor y OpenCode editan en paralelo, hacer commits chicos y registrar WIP en `docs/STATE.md`.

## Cache local

`.opencode/cache/` y `.opencode/sessions/` están en `.gitignore`.
