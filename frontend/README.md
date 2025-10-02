# Frontend README

Styling requirement (Constitution):

The frontend MUST include and use the `theme-catppuccin` theme from the
`@webtui` NPM package for UI styling. This requirement is enforced by the
project constitution; deviations require a documented Constitution Check with
maintainer approval.

Quick start — install the theme

1. From the `frontend` folder, install the package:

```bash
npm install @webtui/theme-catppuccin
```

2. Example integration (vanilla JS/TS entry)

Create `frontend/src/theme.ts` (or import into your layout/root component):

```ts
// frontend/src/theme.ts
import 'virtual:css-reset'; // if your build supports virtual css imports
import '@webtui/theme-catppuccin/dist/catppuccin.css';

// If the package exposes JS utilities, import and initialize them here
// import { applyTheme } from '@webtui/theme-catppuccin'
// applyTheme()

export default {};
```

3. Ensure the theme is bundled by your build (Vite/webpack/Next.js)

- For Vite: confirm the CSS import is reachable from your app entry (e.g.
  `main.tsx` or `client.ts`) so the CSS is included in the compiled assets.
- For Next.js: import the theme CSS in `pages/_app.tsx` or `app/layout.tsx`.

CI / Verification

- Add a simple smoke test in CI to assert the built CSS contains `catppuccin`
  or a known class name produced by the theme. For example, after running a
  production build, use `grep` or a tiny node script to confirm the theme
  stylesheet exists in the output directory.

Example (bash snippet for CI):

```bash
# build
npm ci --prefix frontend
npm run build --prefix frontend

# verify
if ! grep -q "catppuccin" dist/assets/*.css; then
  echo "ERROR: theme-catppuccin not present in build" >&2
  exit 1
fi
```

Local development notes

- Keep the package listed in `frontend/package.json` dependencies so new
  contributors install it automatically.
- If the theme exposes configuration or tokens (colors/variables), place
  theme overrides in `frontend/src/theme.ts` or in CSS variables loaded after
  the theme import.

Accessibility & theming

- Ensure any color overrides maintain sufficient contrast.
- Document any theme token overrides in `frontend/README.md` or the main
  project docs so designers and developers can coordinate.

Need me to add these files?

- I can add `frontend/src/theme.ts` and patch `frontend/package.json` to add
  `@webtui/theme-catppuccin` now. I can also add a small CI job snippet in
  `.github/workflows/` that runs the build and checks for the theme. Tell me
  which you'd like and I'll implement it.
This is a minimal Next.js placeholder for the frontend. Run:

npm install
npm run dev

Testing
-------

All frontend code must include unit tests written with Vitest. Place tests next to the source files (e.g. `Component.test.jsx` or in `__tests__/`). CI will block PRs that add source files without tests.
