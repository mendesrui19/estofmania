---
name: connectors
description: >-
  MCP connectors available for Estofmania (project-scoped). Use when testing,
  deploying, scraping references, or pulling design assets.
---

# Connectors — Estofmania (só este projeto)

## Ativos agora

| Connector | Scope | Uso |
|-----------|-------|-----|
| **cursor-ide-browser** | Cursor (built-in) | Preview local, screenshots, cliques, validação visual |
| **playwright** | `.cursor/mcp.json` | E2E, snapshots a11y, testes automatizados no browser |

Reiniciar o Cursor após alterar `mcp.json`.

## Opcionais (precisam de API key — adicionar a `.cursor/mcp.json`)

### Vercel — deploy e previews

```json
"vercel": {
  "url": "https://mcp.vercel.com"
}
```

Autenticar em Cursor → MCP → Vercel. Útil para `deploy`, env vars, logs.

### Firecrawl — pesquisa e referências

```json
"firecrawl": {
  "command": "npx",
  "args": ["-y", "firecrawl-mcp"],
  "env": { "FIRECRAWL_API_KEY": "<key>" }
}
```

Útil para analisar sites de concorrentes (estofos, limpeza de estofos) e extrair estrutura de conteúdo.

### Figma — design-to-code

```json
"figma": {
  "command": "npx",
  "args": ["-y", "figma-developer-mcp", "--stdio"],
  "env": { "FIGMA_API_KEY": "<key>" }
}
```

Útil se existir mockup Figma da marca.

## Quando usar o quê

- **Construir UI** → `ui-ux-pro-max` + `design-system/estofmania/`
- **Validar no browser** → `cursor-ide-browser` (rápido) ou `playwright` (testes)
- **Publicar** → Vercel MCP ou `vercel deploy` CLI
- **Inspiração / concorrência** → Firecrawl (com key)

Não instalar conectores globais — manter tudo em `.cursor/mcp.json` deste repo.
