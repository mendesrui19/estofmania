---
name: estofmania-web
description: >-
  Build the Estofmania marketing site for production. Use when scaffolding,
  implementing pages, components, content, animations, or deploying the site.
  Covers stack, design system, Portuguese copy, and patterns from sibling projects.
---

# Estofmania Web

## Stack (fixed)

- **Vite** + **React 19** + **TypeScript**
- **Tailwind CSS v4** (`@tailwindcss/vite`)
- **motion** (`import { motion } from "motion/react"`) — not `framer-motion`
- **lucide-react** for icons (never emoji as UI icons)
- **react-router-dom** if multi-page; single landing page is also valid

Scaffold inside `site/` (mirror `fmtec-site` and `dhamar/site` layout).

## Design system (mandatory)

Before UI work, read:

1. `design-system/estofmania/MASTER.md` — global tokens, typography, sections
2. `design-system/estofmania/pages/[page].md` — page overrides if present

Regenerate or refine via UI/UX Pro Max:

```bash
python3 .cursor/skills/ui-ux-pro-max/scripts/search.py "<query>" --design-system --persist -p "Estofmania"
```

For stack-specific guidance:

```bash
python3 .cursor/skills/ui-ux-pro-max/scripts/search.py "<topic>" --stack react
python3 .cursor/skills/ui-ux-pro-max/scripts/search.py "<topic>" --stack html-tailwind
```

## Site structure (default)

| Section | Purpose |
|---------|---------|
| Hero | Headline, subheadline, primary CTA (orçamento / contacto) |
| Serviços | Estofos, reparação, limpeza, automóvel, etc. |
| Galeria | Before/after, portfolio grid |
| Sobre | Confiança, anos de experiência, zona de atuação |
| Testemunhos | Reviews, ratings, social proof |
| Contacto | Formulário, telefone, WhatsApp, mapa |

- Images for the site come **only** from `assets/premium/` (curated). Never use raw `assets/social/thumbnails/` on the live site.
- Re-curate after new downloads: `python3 scripts/curate_premium_images.py`
- Hero: `recommended_use: hero` in `assets/premium/manifest.json`

## Component patterns

Reuse ideas from sibling repos (do not copy brand assets):

- `Reveal`, `Stagger`, `CtaButton`, `Marquee` — fmtec
- `FadeIn`, `ContactCta`, `PhotoGallery` — dhamar
- Animations: respect `prefers-reduced-motion`
- All interactive elements: `cursor-pointer`, visible focus, hover 150–300ms

## Portuguese & SEO

- UI copy in **European Portuguese (pt-PT)**
- `lang="pt"` on `<html>`
- Per-page: unique `<title>`, meta description, Open Graph, canonical
- JSON-LD `LocalBusiness` with NAP (name, address, phone)
- Images: `alt` descriptive, WebP/AVIF, `width`/`height`, lazy below fold

## Build & deploy

```bash
cd site && npm run build && npm run preview
```

Target: static hosting (Vercel, Netlify, or Cloudflare Pages). Verify `dist/` before ship.

## Quality gate (before “done”)

Run the **web-production** skill checklist. Test responsive at 375, 768, 1024, 1440px.
Use **cursor-ide-browser** or **playwright** MCP to open preview and screenshot key breakpoints.
