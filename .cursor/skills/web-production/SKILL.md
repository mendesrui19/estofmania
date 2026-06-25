---
name: web-production
description: >-
  Production checklist for shipping Estofmania to the web. Use before marking
  UI work complete, before deploy, or when fixing SEO, performance, or a11y.
---

# Web Production Checklist — Estofmania

Run this list before calling any page or deploy “ready”.

## Performance

- [ ] Lighthouse Performance ≥ 90 on mobile (or explain trade-off)
- [ ] LCP image preloaded or prioritized; no layout shift (CLS < 0.1)
- [ ] Fonts: `display=swap`, subset weights actually used
- [ ] JS bundle reasonable; route-level code split if multi-page
- [ ] Images compressed; hero ≠ full-res original

## Accessibility

- [ ] Color contrast ≥ 4.5:1 body text (see `MASTER.md` palette)
- [ ] Keyboard: all CTAs and nav reachable; focus visible
- [ ] `prefers-reduced-motion`: disable or simplify Motion animations
- [ ] Semantic landmarks: `header`, `main`, `footer`, heading hierarchy h1→h2
- [ ] Form labels associated; errors announced

## SEO & sharing

- [ ] `<title>` ≤ 60 chars, description ≤ 160 chars, unique per route
- [ ] `og:title`, `og:description`, `og:image` (1200×630)
- [ ] `robots.txt` + `sitemap.xml` for production domain
- [ ] JSON-LD LocalBusiness / ProfessionalService
- [ ] WhatsApp & tel links use correct `href` (`tel:`, `https://wa.me/...`)

## Mobile & browsers

- [ ] 375px: no horizontal scroll, tap targets ≥ 44px
- [ ] Sticky header does not cover anchored sections
- [ ] iOS Safari: safe areas, no zoom trap on inputs (font-size ≥ 16px)

## Verification workflow

1. `npm run build && npm run preview`
2. Browser MCP: navigate to preview URL, snapshot + screenshot hero, services, contact
3. Playwright MCP (if enabled): run smoke — page loads, CTA visible, contact links work
4. Fix issues; re-check until checklist passes

## Deploy

- [ ] Production env vars (if any) documented
- [ ] Custom domain + HTTPS
- [ ] 404 page for SPA if client-side routing
- [ ] Analytics only after consent if required (RGPD)
