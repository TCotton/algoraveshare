## Frontend README

This directory contains the Next.js frontend. It MUST (per the project constitution) include and use the Catppuccin theme from `@webtui/theme-catppuccin`, and styling is composed with Tailwind CSS (v4) + the theme layer.

---
## 1. Tailwind + Next.js: Quick Start

From within `frontend/`:

```bash
npm install
npm run dev
```

Tailwind 4 introduces the `@tailwindcss/postcss` plugin (already configured in `postcss.config.mjs`). You do NOT need a classic `tailwind.config.js` for basic usage (it can be added later for customization).

Key files:
- `postcss.config.mjs` – enables Tailwind via `@tailwindcss/postcss`.
- `styles/globals.css` – global layer (inject Tailwind directives & theme CSS here or via a theme entry file).
- `src/theme.ts` – imports theme & Tailwind runtime CSS (currently just side‑effect imports).

---
## 2. Installing / Ensuring Dependencies

You should have (already present):
```jsonc
"dependencies": {
  "tailwindcss": "^4.x",
  "@tailwindcss/postcss": "^4.x",
  "@webtui/theme-catppuccin": "^0.0.3"
}
```
If any are missing:
```bash
npm install tailwindcss @tailwindcss/postcss @webtui/theme-catppuccin
```

---
## 3. Minimal Integration Pattern

Add the Tailwind layer + theme import in ONE of two ways:

Option A (recommended): import all CSS in `pages/_app.tsx` once.
```tsx
// pages/_app.tsx
import type { AppProps } from 'next/app';
import '@webtui/theme-catppuccin/dist/catppuccin.css';
import 'tailwindcss'; // Tailwind v4 runtime (postcss plugin processes it)
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
```

Option B: keep a dedicated theme entry (`src/theme.ts`) and just import that in `_app.tsx`:
```tsx
// src/theme.ts
import '@webtui/theme-catppuccin/dist/catppuccin.css';
import 'tailwindcss';
// custom overrides can follow

// pages/_app.tsx
import type { AppProps } from 'next/app';
import '../src/theme';
import '../styles/globals.css';
export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
```

Remove any unused placeholder like `import 'virtual:css-reset';` unless you intentionally add a plugin providing that virtual module.

---
## 4. Authoring Styles

Use Tailwind utility classes directly in your components:
```tsx
<button className="px-4 py-2 rounded-md bg-mauve text-base hover:bg-mauve/80 transition">Click</button>
```
Catppuccin exports CSS variables you can map to Tailwind via arbitrary values if needed:
```tsx
<div className="bg-[var(--ctp-base)] text-[var(--ctp-text)] p-4 rounded-lg" />
```

### Adding a Custom Layer
In `globals.css` you can still author traditional CSS:
```css
/* globals.css */
@layer base {
  :root { --app-nav-height: 56px; }
}
@layer components {
  .card { @apply rounded-lg p-4 bg-[var(--ctp-surface0)] shadow; }
}
```

---
## 5. Customization (Extending Tailwind)

Tailwind v4 can infer most usage on-the-fly. If you need to define theme extensions (custom colors, safelist, etc.) you can add a `tailwind.config.js`:
```js
// tailwind.config.js (optional)
export default {
  content: [
    './pages/**/*.{ts,tsx,js,jsx}',
    './components/**/*.{ts,tsx,js,jsx}',
    './src/**/*.{ts,tsx,js,jsx}'
  ],
  theme: {
    extend: {
      colors: {
        catppuccinAccent: 'var(--ctp-lavender)'
      }
    }
  }
};
```
If added, restart the dev server so Tailwind picks it up.

---
## 6. Dark / Variant Themes

Catppuccin supplies multiple flavor palettes (latte, frappe, macchiato, mocha). If the package exposes variants (e.g. classes like `theme-mocha`), wrap your app root:
```tsx
<html className="theme-mocha">
```
and toggle class names for user preference (persist in `localStorage`).

---
## 7. Production Build & Purging

Tailwind v4 automatically tree-shakes unused utilities based on scanned content. Ensure all template paths are covered either implicitly (on‑demand engine) or via `content` array (if you add a config). Avoid constructing class names purely at runtime without safelisting.

Smoke test suggestion (CI):
```bash
npm run build
grep -q "catppuccin" .next/static/css/*.css || { echo "Theme not present" >&2; exit 1; }
```

---
## 8. Overriding Theme Tokens

After importing Catppuccin you can override CSS variables:
```css
/* globals.css (after theme import) */
:root {
  --ctp-accent: #ff79c6; /* example override */
}
```
You can then reference them with Tailwind arbitrary values: `text-[var(--ctp-accent)]`.

---
## 9. Linting & Conventions

Use consistent utility ordering (consider adding `eslint-plugin-tailwindcss` later). Avoid duplicating long utility sequences—extract a component class in `@layer components` when reuse appears ≥3 times.

---
## 10. Testing UI With Tailwind

Tests (Vitest + Testing Library) should assert semantic output, not specific utility class strings (those are implementation details). Prefer role / text queries. Only snapshot critical layout wrappers if necessary.

---
## 11. Troubleshooting

| Problem | Likely Cause | Fix |
|---------|--------------|-----|
| Utilities not applying | CSS import order wrong | Ensure theme + `tailwindcss` imported before component overrides |
| Class works in dev, missing in prod | Dynamically built class name | Use a deterministic class or safelist in config |
| FOUC (flash of unstyled content) | Late CSS import | Move imports into `_app.tsx` earliest possible |
| Catppuccin vars undefined | Theme CSS not imported | Check `@webtui/theme-catppuccin/dist/catppuccin.css` path |

---
## 12. Future Enhancements

Planned (optional):
- Add `tailwind.config.js` with explicit palette mapping to Catppuccin tokens.
- Introduce `eslint-plugin-tailwindcss` for class validation.
- Provide a `ThemeSwitcher` component toggling Catppuccin flavors.

---
## 13. Constitution Reminder

All UI changes must retain usage of `@webtui/theme-catppuccin`. Removing it or substituting another base theme requires a Constitution Check & version bump.

---
## 14. Testing & Scripts

Run tests:
```bash
npm run test
```
Run lint (ensure ESLint is installed locally):
```bash
npm run lint
```

---
## 15. Summary

Tailwind (utility layer) + Catppuccin (design tokens) + Next.js (framework) form the styling stack. Keep imports deterministic, keep overrides minimal, and prefer semantic HTML with utility classes for rapid iteration.

