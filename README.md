# Portfolio site

Personal site for Ashin Berish. React + Vite, prerendered to static HTML for SEO.

## Scripts

- `npm run dev` – local dev server (client-rendered)
- `npm run build` – type-check, build the client, render the app to `dist/index.html`, and write `robots.txt` + `sitemap.xml`
- `npm run preview` – serve the production build
- `npm run lint`

## Configuration

- `.env` → `VITE_SITE_URL` is the public URL used for the canonical link, Open Graph/Twitter tags, JSON-LD and the sitemap. Set it to the real domain before deploying.
- `src/site.ts` holds all page content (role, skills, experience, links).
- `public/og-image.png` is the 1200×630 social preview image.

## Motion

All animation is CSS or small vanilla hooks (no animation library): staged hero load, halftone build-up that dissolves into the portrait photo, subtitle-style caption, skills marquee, scroll-scrubbed About statement, scroll-driven reveals, magnetic links and a reading progress bar. Everything respects `prefers-reduced-motion`.
