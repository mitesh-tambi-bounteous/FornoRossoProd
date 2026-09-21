summary: |
  This is the first story to add application code to an otherwise empty repository (only
  `design-system/` tokens/CSS and design artifacts exist today — no `package.json`, no
  framework, no tests). This plan bootstraps a Vite + React + TypeScript SPA and implements
  ONLY the app shell scope described by FORNOROSSO-STORY-001: a shared `AppHeader` (logo, Home /
  Our Menu / Cart nav links, a static delivery-ETA status, and a cart icon with a live
  item-count badge), a shared `Footer` (brand blurb, social links, kitchen hours, location/
  contact), client-side routing via `react-router-dom` for the Home/Menu/Cart routes with Home
  as the `/` default, and a `CartContext` that both the badge and (in later stories) the Menu/
  Cart pages will read from and mutate. The Home/Menu/Cart page bodies themselves are left as
  minimal placeholders — the full Home page content shown in the approved Figma frame (hero,
  delivery banner, menu grid, brand-story section) belongs to separate, not-yet-planned stories
  and is explicitly out of scope here per the acceptance criteria, which only test header/
  footer/routing/badge behavior. Two design-token changes recorded as resolved (not just
  proposed) in the approved design context are implemented because the header/footer literally
  cannot be built without them: a new `color-surface-inverse` token (#151212, decision
  `missing-dark-surface-token` → `new-token`) for the header/footer dark background, and
  `color-primary` updated from `#b3261e` to `#C82D25` (decision `primary-red-hex-mismatch` →
  `match-figma`). Other resolved-but-unused-here decisions (the dark button variant, the
  outline-on-dark button) are left for whichever future story builds the hero/menu-grid UI that
  actually needs them.

scope:
  - description: |
      Bootstrap the Vite + React + TypeScript project skeleton (no app code exists yet in this
      repo). Add `package.json` with `dev`/`build`/`test` scripts, `tsconfig.json` /
      `tsconfig.node.json`, `vite.config.ts` (with a `test` block for Vitest: `environment:
      'jsdom'`, `setupFiles: ['./src/test/setup.ts']`, `globals: true`), `index.html`, and the
      React entry point `src/main.tsx` that mounts `<BrowserRouter><CartProvider><App /></
      CartProvider></BrowserRouter>` and imports `design-system/tokens.css` and
      `design-system/prototype-utils.css`. Add `src/test/setup.ts` importing
      `@testing-library/jest-dom`.
    files:
      - package.json
      - tsconfig.json
      - tsconfig.node.json
      - vite.config.ts
      - index.html
      - src/main.tsx
      - src/vite-env.d.ts
      - src/test/setup.ts
      - .gitignore
    rationale: |
      Nothing in the repo currently runs — `Glob` for `**/package.json` returns no results and
      the only committed files are `design-system/*` and design/plan artifacts under `.arc/`.
      Every other scope item in this plan depends on this skeleton existing first.

  - description: |
      Add the two design-token changes the header/footer require, per the resolved (not
      "assumed") decisions in the approved design context: a new inverse-surface color token and
      an updated primary red. Add to `design-system/tokens.json`:
      ```json
      "color-surface-inverse": {
        "$type": "color",
        "$value": { "colorSpace": "srgb", "components": [0.0824, 0.0706, 0.0706], "hex": "#151212" },
        "$description": "Near-black inverse surface for the header, footer, and other dark sections."
      }
      ```
      and change `color-primary`'s `$value.hex`/`components` from `#b3261e` to `#C82D25` (per
      decision `primary-red-hex-mismatch`, resolution `match-figma`). Mirror both changes by hand
      into `design-system/tokens.css` (`--color-surface-inverse: #151212; ...` and updating
      `--color-primary: #C82D25;`), matching the existing generated-file formatting exactly.
    files:
      - design-system/tokens.json
      - design-system/tokens.css
    rationale: |
      `missing-dark-surface-token` resolved to `new-token` (add `#151212` exactly) and
      `primary-red-hex-mismatch` resolved to `match-figma` (`#C82D25`) — both are recorded as
      `"decision": "overridden"` in the design context, not open assumptions, and the header/
      footer/logo cannot be built to spec without them. `tokens.css` is marked "Do not edit
      directly, this file was auto-generated" but no generator script exists anywhere in this
      repo (checked via glob for `*.js`/build scripts), so hand-editing both files in lockstep is
      the only available path; flagged in `assumptions_or_open_questions` below. Other resolved
      decisions in the same context (`button-dark-variant-missing`, `hero-secondary-button-on-
      dark`) style CTAs that only appear in the hero/menu-grid sections, which are out of scope
      for this story, so their tokens are deliberately not added here.

  - description: |
      Add the cart state module: a pure reducer plus a `CartContext`/`useCart` hook that the
      header badge (this story) and the Menu/Cart pages (future stories) will share.
      `src/state/cart/cartReducer.ts`:
      ```ts
      export type CartItem = { id: string; name: string; price: number; quantity: number };
      export type CartState = { items: CartItem[] };
      export type CartAction =
        | { type: 'ADD_ITEM'; item: CartItem }
        | { type: 'REMOVE_ITEM'; id: string }
        | { type: 'UPDATE_QUANTITY'; id: string; quantity: number };

      export const initialCartState: CartState = { items: [] };

      export function cartReducer(state: CartState, action: CartAction): CartState { /* ... */ }
      export function selectTotalItemCount(state: CartState): number {
        return state.items.reduce((sum, item) => sum + item.quantity, 0);
      }
      ```
      `src/state/cart/CartContext.tsx` exposes `CartProvider({ children, initialItems = [] })` and
      `useCart()` returning `{ items, totalItemCount, addItem, removeItem, updateQuantity }`.
    files:
      - src/state/cart/cartReducer.ts
      - src/state/cart/CartContext.tsx
      - src/state/cart/cartReducer.test.ts
    rationale: |
      AC4/AC5 require the header badge to reflect live cart state and update when items are
      added/removed/re-quantified. A plain `useReducer` + Context is the minimal option that
      needs zero new runtime dependencies (React is already being added) and gives the Menu/Cart
      pages (built in later stories) a single shared store to dispatch into. `initialItems` is
      accepted by the provider purely so tests (and, later, a persisted-cart restore) can seed
      state without reaching into reducer internals.

  - description: |
      Add a small inline-SVG icon module used by the header's cart icon and the footer's social
      links (avoids adding an icon-package dependency for four glyphs).
      `src/components/icons/Icon.tsx` exports `ShoppingCartIcon`, `InstagramIcon`,
      `FacebookIcon`, and `TwitterIcon` as `(props: React.SVGProps<SVGSVGElement>) => JSX.Element`.
    files:
      - src/components/icons/Icon.tsx
    rationale: |
      The design calls for a shopping-cart glyph (`CartButton`, node 6:22) and three social
      glyphs (`SocialIconLink`, nodes 6:145/6:147/6:149). No icon library is installed anywhere
      in this greenfield repo; four static glyphs don't justify a new dependency.

  - description: |
      Implement the header: `Logo` (reused by the footer too), `AppHeaderNavLink` (thin wrapper
      around `react-router-dom`'s `NavLink`, reused for Home/Our Menu/Cart), `CartButton` (reads
      `useCart().totalItemCount`), and `AppHeader` composing them plus an inline delivery-ETA
      status. Add matching classes to `design-system/prototype-utils.css` (`.app-header`,
      `.app-header__nav`, `.app-header__link`, `.app-header__link--active`, `.app-header__eta`,
      `.app-header__eta-value`, `.app-header__cart-button`, `.app-header__cart-badge`) using
      `var(--color-surface-inverse)` for the header background, `var(--color-primary)` for the
      active-link underline and logo badge, `var(--color-secondary)` for the ETA value, and
      `color-mix(in srgb, var(--color-fg-inverse) 12%, transparent)` for the translucent cart-
      button pill (matches the ~12.5% white-on-dark translucency the design context measured for
      this same pattern on `IconBadge`/hero `Chip`; no dedicated opacity token exists yet).
      `AppHeaderNavLink` signature:
      ```ts
      function AppHeaderNavLink(props: { to: string; label: string }): JSX.Element
      ```
    files:
      - src/components/layout/Logo.tsx
      - src/components/layout/AppHeaderNavLink.tsx
      - src/components/layout/CartButton.tsx
      - src/components/layout/AppHeader.tsx
      - src/components/layout/AppHeader.test.tsx
      - design-system/prototype-utils.css
    rationale: |
      Directly implements AC1 and AC4. `DeliveryEtaStatus` (node 6:21) is rendered inline inside
      `AppHeader.tsx` rather than as its own file — it is single-use, static markup with no
      reuse or independent logic, unlike `Logo` (reused in the footer) and `CartButton` (owns
      cart-context wiring and needs its own focused test).

  - description: |
      Implement the footer: `Footer.tsx` containing the brand blurb + reused `Logo` + social
      links row, a "Kitchen Hours" column (3 day/hours rows), a "Pizzeria Location" column
      (address/phone/email), a divider, and a copyright bar with Privacy Policy / Delivery Terms
      links. Add `.app-footer`, `.app-footer__column`, `.app-footer__schedule-row`,
      `.app-footer__social-link`, `.app-footer__divider`, `.app-footer__bottom` classes to
      `design-system/prototype-utils.css`, reusing `var(--color-surface-inverse)` for the
      background and the same translucent-circle treatment as the header's cart button for the
      social icon buttons.
    files:
      - src/components/layout/Footer.tsx
      - src/components/layout/Footer.test.tsx
      - design-system/prototype-utils.css
    rationale: |
      Directly implements AC2. The design context lists `FooterColumn`, `ScheduleRow`,
      `SocialIconLink`, `Divider`, `FooterBottom`, and `FooterLink` as separate proposed
      components, but every one of them is used only once or twice, only inside this footer, and
      each renders trivial markup — collocating them as small unexported helpers inside
      `Footer.tsx` avoids five near-empty files for content that has no reuse or independent
      test surface beyond what `Footer.test.tsx` already covers. Flagged for the reviewer in
      case a stricter 1:1 file-per-component mapping is preferred.

  - description: |
      Wire up routing: `src/App.tsx` defines the route tree (no own `<BrowserRouter>`, so tests
      can supply `<MemoryRouter>`), `src/components/layout/AppShell.tsx` renders
      `<AppHeader /><main><Outlet /></main><Footer />` once per layout, and
      `src/pages/HomePage.tsx` / `MenuPage.tsx` / `CartPage.tsx` are minimal placeholders (each a
      `<section data-testid="...">` with a heading identifying the page) satisfying AC6's default
      route without building the full Home page content from the Figma frame.
      ```tsx
      export function App() {
        return (
          <Routes>
            <Route element={<AppShell />}>
              <Route index element={<HomePage />} />
              <Route path="menu" element={<MenuPage />} />
              <Route path="cart" element={<CartPage />} />
            </Route>
          </Routes>
        );
      }
      ```
    files:
      - src/App.tsx
      - src/components/layout/AppShell.tsx
      - src/pages/HomePage.tsx
      - src/pages/MenuPage.tsx
      - src/pages/CartPage.tsx
      - src/App.test.tsx
    rationale: |
      Directly implements AC3 and AC6. Nesting the three routes under a single `AppShell`
      layout route is what makes AC1/AC2 ("WHEN any page is displayed THEN the header/footer
      shows...") true without re-rendering the header/footer per page. Full Home/Menu/Cart page
      content is intentionally out of scope — none of the six acceptance criteria for this story
      test hero/menu-grid/story-section/cart-line-item content, only the shell and navigation.

tests:
  - |
    AC1 — `src/components/layout/AppHeader.test.tsx`, rendered inside `<MemoryRouter><CartProvider><AppHeader /></CartProvider></MemoryRouter>`:
    ```tsx
    test('renders logo, nav links, delivery ETA, and a cart icon', () => {
      expect(screen.getByText('Forno Rosso')).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
      expect(screen.getByRole('link', { name: 'Our Menu' })).toHaveAttribute('href', '/menu');
      expect(screen.getByRole('link', { name: 'Cart' })).toHaveAttribute('href', '/cart');
      expect(screen.getByText(/Estimated delivery/i)).toBeInTheDocument();
      expect(screen.getByText('30 mins')).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /view cart/i })).toHaveAttribute('href', '/cart');
    });
    ```
    Write this test first against a not-yet-existing `AppHeader` (fails on import) then build
    `Logo`/`AppHeaderNavLink`/`CartButton`/`AppHeader` to pass it.
  - |
    AC2 — `src/components/layout/Footer.test.tsx`, rendered inside plain `render(<Footer />)`:
    ```tsx
    test('renders brand blurb, social icons, kitchen hours, and location/contact', () => {
      expect(screen.getByText(/Artisanal wood-fired sourdough pizzas/i)).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /instagram/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /facebook/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /twitter/i })).toBeInTheDocument();
      expect(screen.getByText('Kitchen Hours')).toBeInTheDocument();
      expect(screen.getByText('Monday - Thursday')).toBeInTheDocument();
      expect(screen.getByText('12:00 PM - 10:00 PM')).toBeInTheDocument();
      expect(screen.getByText('Pizzeria Location')).toBeInTheDocument();
      expect(screen.getByText('(555) 392-7677')).toBeInTheDocument();
      expect(screen.getByText('ciao@fornorosso.pizza')).toBeInTheDocument();
    });
    ```
  - |
    AC3 — `src/App.test.tsx`, rendered inside `<MemoryRouter initialEntries={['/']}><CartProvider><App /></CartProvider></MemoryRouter>`:
    ```tsx
    test('nav links and the cart icon navigate client-side without remounting the shell', async () => {
      const user = userEvent.setup();
      const headerBefore = screen.getByRole('banner');
      await user.click(screen.getByRole('link', { name: 'Our Menu' }));
      expect(screen.getByTestId('menu-page')).toBeInTheDocument();
      expect(screen.queryByTestId('home-page')).not.toBeInTheDocument();
      expect(screen.getByRole('banner')).toBe(headerBefore); // same DOM node -> no full reload
      await user.click(screen.getByRole('link', { name: /view cart/i }));
      expect(screen.getByTestId('cart-page')).toBeInTheDocument();
    });
    ```
    `AppHeader`'s root element must render as `<header>` (implicit `banner` role) for the
    `getByRole('banner')` identity check to work.
  - |
    AC4 — appended to `AppHeader.test.tsx`, `CartProvider` seeded via its `initialItems` prop:
    ```tsx
    test('cart badge shows the total item count from cart state', () => {
      render(
        <MemoryRouter>
          <CartProvider initialItems={[
            { id: 'margherita', name: 'Margherita', price: 14.5, quantity: 2 },
            { id: 'diavola', name: 'Diavola', price: 16.5, quantity: 1 },
          ]}>
            <AppHeader />
          </CartProvider>
        </MemoryRouter>
      );
      expect(screen.getByTestId('cart-badge')).toHaveTextContent('3');
    });
    ```
  - |
    AC5 — `src/state/cart/cartReducer.test.ts` (pure reducer, no rendering needed):
    ```ts
    test('recalculates total item count after removal and quantity change', () => {
      let state = cartReducer(initialCartState, { type: 'ADD_ITEM', item: { id: 'a', name: 'A', price: 10, quantity: 2 } });
      state = cartReducer(state, { type: 'ADD_ITEM', item: { id: 'b', name: 'B', price: 8, quantity: 1 } });
      expect(selectTotalItemCount(state)).toBe(3);
      state = cartReducer(state, { type: 'UPDATE_QUANTITY', id: 'a', quantity: 5 });
      expect(selectTotalItemCount(state)).toBe(6);
      state = cartReducer(state, { type: 'REMOVE_ITEM', id: 'b' });
      expect(selectTotalItemCount(state)).toBe(5);
    });
    ```
    Plus an integration check in `AppHeader.test.tsx` using a small in-test harness component
    that calls `useCart().addItem`/`removeItem` from button clicks, asserting the badge
    (`data-testid="cart-badge"`) appears/updates/disappears (count 0 renders no badge, per the
    non-blocking `cart-count-placeholder` resolution):
    ```tsx
    function Harness() {
      const { addItem, removeItem } = useCart();
      return (<><AppHeader />
        <button onClick={() => addItem({ id: 'a', name: 'A', price: 10, quantity: 2 })}>add</button>
        <button onClick={() => removeItem('a')}>remove</button>
      </>);
    }
    test('badge updates live as items are added and removed', async () => {
      const user = userEvent.setup();
      render(<MemoryRouter><CartProvider><Harness /></CartProvider></MemoryRouter>);
      expect(screen.queryByTestId('cart-badge')).not.toBeInTheDocument();
      await user.click(screen.getByText('add'));
      expect(screen.getByTestId('cart-badge')).toHaveTextContent('2');
      await user.click(screen.getByText('remove'));
      expect(screen.queryByTestId('cart-badge')).not.toBeInTheDocument();
    });
    ```
  - |
    AC6 — `src/App.test.tsx`:
    ```tsx
    test('shows the home page by default at the root URL', () => {
      render(<MemoryRouter initialEntries={['/']}><CartProvider><App /></CartProvider></MemoryRouter>);
      expect(screen.getByTestId('home-page')).toBeInTheDocument();
      expect(screen.queryByTestId('menu-page')).not.toBeInTheDocument();
      expect(screen.queryByTestId('cart-page')).not.toBeInTheDocument();
    });
    ```

assumptions_or_open_questions:
  - "This repo has zero application code today (no package.json, no src/ — confirmed via Glob), so this plan also bootstraps the Vite/React/TypeScript/Vitest toolchain itself; there was no existing stack convention to follow."
  - "Home/Menu/Cart page bodies are minimal placeholders in this story. The full Home page content shown in the approved Figma frame (hero, delivery banner, 4-card menu grid, brand-story section) and any Menu/Cart page designs are treated as out of scope, since none of the six acceptance criteria reference that content — only the shared header, footer, routing, and cart badge."
  - "design-system/tokens.css carries a \"Do not edit directly, this file was auto-generated\" header comment, but no generator script exists anywhere in this repository. This plan hand-edits tokens.css to mirror the tokens.json changes; if a generator is introduced later it should be rerun instead."
  - "The translucent-white-on-dark treatment for the header's cart-button pill and the footer's social-icon circles has no dedicated design token (only an approximate opacity noted in the design context, ~7-12.5%). This plan implements it as `color-mix(in srgb, var(--color-fg-inverse) 12%, transparent)` rather than adding a new token, since only two elements need it in this story."
  - "Resolved token decisions that only affect hero/menu-grid UI outside this story's scope (button-dark-variant-missing, hero-secondary-button-on-dark) are intentionally NOT implemented here; they belong to whichever future story builds that section."
  - "react-router-dom v6 (not v7) is used for stability/familiarity of the data-less <Routes>/<Route>/<Outlet> API this plan relies on; no reviewer preference was stated either way."
  - "No icon package is added; four glyphs (shopping-cart, instagram, facebook, twitter) are hand-written inline SVGs in src/components/icons/Icon.tsx."

package_dependencies:
  - name: react
    version: ^18.3.1
    ecosystem: npm
    rationale: Core UI library; nothing in this repo uses React yet.
  - name: react-dom
    version: ^18.3.1
    ecosystem: npm
    rationale: React's DOM renderer, required alongside react.
  - name: react-router-dom
    version: ^6.28.0
    ecosystem: npm
    rationale: AC3/AC6 require client-side routing between Home/Menu/Cart without a full page reload.
  - name: typescript
    version: ^5.6.2
    ecosystem: npm
    rationale: Project is authored in TypeScript per the .tsx/.ts file plan; no compiler exists yet.
  - name: vite
    version: ^5.4.8
    ecosystem: npm
    rationale: Dev server and build tool for the new SPA; also hosts the Vitest test config.
  - name: "@vitejs/plugin-react"
    version: ^4.3.2
    ecosystem: npm
    rationale: Enables JSX/Fast Refresh support for React inside the Vite build.
  - name: vitest
    version: ^2.1.2
    ecosystem: npm
    rationale: Test runner for the failing-test-first suite this plan specifies.
  - name: "@testing-library/react"
    version: ^16.0.1
    ecosystem: npm
    rationale: Renders components and queries by role/text for every test in this plan.
  - name: "@testing-library/jest-dom"
    version: ^6.5.0
    ecosystem: npm
    rationale: Provides toBeInTheDocument/toHaveTextContent/toHaveAttribute matchers used throughout the tests.
  - name: "@testing-library/user-event"
    version: ^14.5.2
    ecosystem: npm
    rationale: Simulates real click interactions for the AC3/AC5 navigation and cart-mutation tests.
  - name: jsdom
    version: ^25.0.1
    ecosystem: npm
    rationale: DOM environment Vitest runs the component tests in.
  - name: "@types/react"
    version: ^18.3.10
    ecosystem: npm
    rationale: TypeScript types for React APIs used across all new components.
  - name: "@types/react-dom"
    version: ^18.3.0
    ecosystem: npm
    rationale: TypeScript types for react-dom's createRoot API used in src/main.tsx.

notes: |
  This is a greenfield app-shell story: every file this plan touches is newly created except
  `design-system/tokens.json`, `design-system/tokens.css`, and `design-system/prototype-utils.css`,
  which already exist from the FORNOROSSO-CHORE-005 design-system-bootstrap commit and are
  extended (not replaced) here.

  ```mermaid
  flowchart TD
    main[src/main.tsx]:::touched --> CartProvider[src/state/cart/CartContext.tsx]:::touched
    main --> App[src/App.tsx]:::touched
    CartProvider --> App
    App --> AppShell[src/components/layout/AppShell.tsx]:::touched
    AppShell --> AppHeader[src/components/layout/AppHeader.tsx]:::touched
    AppShell --> Outlet[react-router Outlet]
    AppShell --> Footer[src/components/layout/Footer.tsx]:::touched
    AppHeader --> Logo[src/components/layout/Logo.tsx]:::touched
    AppHeader --> AppHeaderNavLink[src/components/layout/AppHeaderNavLink.tsx]:::touched
    AppHeader --> CartButton[src/components/layout/CartButton.tsx]:::touched
    Footer --> Logo
    CartButton -- reads totalItemCount --> useCart[useCart hook in CartContext.tsx]:::touched
    Outlet --> HomePage[src/pages/HomePage.tsx]:::touched
    Outlet --> MenuPage[src/pages/MenuPage.tsx]:::touched
    Outlet --> CartPage[src/pages/CartPage.tsx]:::touched
    AppHeader -. uses var color-surface-inverse/color-primary .-> tokens[design-system/tokens.css]:::touched
    Footer -. uses var color-surface-inverse .-> tokens
    AppHeader -. classes .-> proto[design-system/prototype-utils.css]:::touched
    Footer -. classes .-> proto
    classDef touched fill:#f96,color:#000
  ```

  Rationale recap for the diagram: `CartContext` fans out to both `CartButton` (this story's
  badge) and, structurally, to the future Menu/Cart page implementations that will dispatch
  `ADD_ITEM`/`REMOVE_ITEM`/`UPDATE_QUANTITY` — this story only wires the read side (badge) and
  the reducer/provider, not any producer UI, since Menu/Cart page content is out of scope.
