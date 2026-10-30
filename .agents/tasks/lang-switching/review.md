# EN/KM language switching for orders, profile, wishlist, auth, FAQ, and contact

The change extends EN/KM translation to the remaining customer-facing pages. Orders, order detail, and profile — previously server components with hardcoded English — are split into thin server data fetchers that pass serializable props (Dates as ISO strings, items flattened to plain objects) to new client `*Content` components. Wishlist, signin, signup, faq, and contact get `useLanguage()` wired in inline, and the FAQ entries were restructured from inline English strings into `qKey`/`aKey` pairs so they re-render on language change. A large batch of translation keys was added to both the `en` and `km` objects in `LanguageContext.tsx`, and a light design pass adds a gradient band to the orders header and borders to the status badges. The Prisma schema, API routes, admin pages, and `package.json` are untouched, and the earlier-converted pages (cart, products, product detail) were not redone.

Watch for: one translation-key parity gap — `product.onlyLeft` and `product.price` were added to the `km` object but not the `en` object, so the two language tables are asymmetric. The keys are unreferenced at this commit so the gap is latent, but `product.price` is already consumed by the in-progress ProductCard translation in the working tree, so English users would see the raw key string as a label once that work lands.

**Verdict**: NEEDS_CHANGES

## High-level view

The three server pages follow the established cart/products pattern: a thin async shell keeps the session guard and data fetch, then maps each Prisma row to a plain object with `createdAt: o.createdAt.toISOString()` (typed `string` on the client interface) and nested `items`/`product` flattened to only the fields the UI needs. No raw Prisma object crosses the server/client boundary, which is what `strict` mode in `tsconfig.json` demands; the recorded `npx tsc --noEmit` run exited clean. The render moves wholesale into `OrdersContent`, `OrderDetailContent`, and `ProfileContent`, with every visible English string replaced by a `t('...')` lookup.

The five remaining client pages (wishlist, signin, signup, faq, contact) get `useLanguage()` added in place rather than a new Content component, since they were already client components. FAQ is the one structural change: the module-level `FAQS` array of full English strings became an in-component array of `{ category, qKey, aKey }`, with the raw English `category` string retained for the filter comparison so the `===` matching keeps working unchanged while the displayed text translates.

Translation fidelity is solid for the plan's scope: every plan-enumerated key (orders, status, order detail, profile, wishlist, signin, signup, faq, contact) is present in both `en` and `km`, and spot-checked Khmer values (`orders.title`, `status.cancelled`, `profile.anonymous`, `faq.title`, `contact.toastSuccess`) match the plan spec verbatim. The defect is outside that scope: two extra `product.*` keys landed in `km` only.

The design polish is confined to the orders list — a gradient behind the header and a border on each status badge; order detail and profile layouts are structurally unchanged.

<details>
<summary>Issues (1)</summary>

1. **Translation key parity gap (`product.onlyLeft`, `product.price`)** — these two keys were added to the `km` object but are absent from the `en` object; every other new key (and all plan-specified keys) is present in both. The `t()` fallback renders the raw key string when an entry is missing, so once `product.price` is used by the in-progress ProductCard translation, English users would see the literal `product.price` instead of a label. Add the two missing `en` entries (e.g. `'product.price': 'Price'`, `'product.onlyLeft': 'Only {n} left'`) — or drop the orphaned `km` entries — so the two objects stay in parity.

</details>

<details><summary>Details</summary>

### Server-to-client split for orders, order detail, and profile

Each of the three server pages keeps only the session guard and data fetch, then hands a plain serializable object to a new client component. `orders/page.tsx` keeps `export const dynamic = 'force-dynamic'`, the `getSession()` + `redirect('/signin?redirect=/orders')` guard, and `getUserOrders()`, then maps each order to `{ id, status, total, createdAt: o.createdAt.toISOString(), items: [{ id, quantity, product: { id, name, image } }] }` and renders `<OrdersContent orders={mapped} />`. The order detail page keeps its `params: Promise<{ id: string }>`, the `notFound()` path, and `getOrderById(id)`, maps `address` and `price` through as well, and passes `customerName={session.name}` / `customerEmail={session.email}` so the client component owns the `Valued Customer` fallback via `t('order.valuedCustomer')`. The profile page keeps its `Promise.all` of `user`, `orderCount`, `reviewCount`, the `if (!user) redirect('/signin')` guard, and maps only `user.createdAt.toISOString()` plus `name`/`email`.

On the client side, date locale stays `en-US` by the plan's explicit decision, so dates render identically in both languages (`new Date(order.createdAt)` parses the ISO string fine). The order detail client recomputes `currentStep`, `canCancel`, `orderDate`, and the `+3 day` estimated delivery locally from the ISO string rather than receiving them pre-computed, since those are presentation derivations.

### Inline translation wiring and the FAQ restructure

Wishlist, signin, signup, and contact were already `'use client'`, so the change just adds `import { useLanguage }` and `const { t } = useLanguage()` and swaps each visible English string for a `t('...')` call. The sign-in/sign-up demo-credential line, input placeholders, and Suspense fallbacks stay English by design (no keys were specified for them), and `OrderActions` translates only the `Print Invoice` / `Cancel Order` button labels while leaving its `confirm(...)` dialog and `toast.success(...)` text English, exactly as the plan scoped it. One intentional copy change to note: the contact success message's English text was tightened from "A representative has received your ticket and will follow up with you via email." to "A representative will follow up with you via email." — this matches the plan's `contact.successMsg` spec value, not an accidental edit.

FAQ is the only structural conversion among the inline pages. The module-level `FAQS` array of full English question/answer strings became an in-component array of `{ category: string; qKey: string; aKey: string }`, with `category` kept as the raw English string (`'Shipping'`, `'Payments'`, …) and `activeCategory` still seeded from the raw-English `categories` list. The filter `activeCategory === 'All' ? all : FAQS.filter(f => f.category === activeCategory)` is therefore unchanged — only the rendered pill labels (`t('faq.' + cat.toLowerCase())`) and the question/answer bodies (`t(faq.qKey)` / `t(faq.aKey)`) translate. The `faq.a6` and `faq.a7` English values contain double quotes inside single-quoted JS strings (valid, no escaping needed).

### Translation key parity gap

The diff adds a block of extra shared-component keys beyond the plan's enumerated list (star-rating options, toast messages, category names, `product.onlyLeft`, `product.price`, `home.breadcrumbHome`). Most are symmetric across `en` and `km`, but `product.onlyLeft` and `product.price` appear only in the `km` object — confirmed: the `km` block has `'product.onlyLeft': 'តែ {n} នៅសល់'` and `'product.price': 'តម្លៃ'`, while the `en` block (between `en: {` and `km: {`) has neither.

Neither key is referenced via `t(...)` at this commit, so the gap causes no runtime breakage in the committed state — the asymmetry is latent. The reason it still matters: the working tree's in-progress `ProductCard.tsx` already calls `t('product.price')` (and `t('product.only')` / `t('product.leftInStock')` rather than `product.onlyLeft`). Once that sibling work lands, English users hit the `t()` fallback `translations['en']['product.price'] ?? translations['en']['product.price'] ?? key`, which yields the literal string `product.price` as the price label. `product.onlyLeft` looks orphaned entirely — the sibling work splits that concept into `product.only` + `product.leftInStock` — so it can be dropped rather than backfilled. The fix is one or two lines either way; `en` and `km` should stay mirror images.

### Scope and untouched surfaces

The working tree does carry a separate uncommitted effort — a Navbar split into `NavAuthButtons` / `NavCategoryBar` / `NavSearchBar` plus edits to `ProductCard`, `AddToCartButton`, `Footer`, `QuantitySelector`, `ProductDetailContent`, and `globals.css` — that is outside this review's scope; it's noted only because the `product.price` parity gap becomes live when that work merges.

</details>

<details><summary>File map</summary>

Diff reviewed: commit `643c228` vs its parent `ef678a1` (`git show 643c228`).

- `src/context/LanguageContext.tsx` — added all plan translation keys to `en` and `km`, plus extra shared-component keys (star ratings, toasts, categories); `product.onlyLeft` and `product.price` added to `km` only (parity gap).
- `src/app/orders/OrdersContent.tsx` (new) — client component rendering the orders list with `useLanguage()`, gradient header, and bordered status badges.
- `src/app/orders/page.tsx` — rewritten as a thin server shell mapping Prisma orders to plain serializable objects (`createdAt.toISOString()`).
- `src/app/orders/[id]/OrderDetailContent.tsx` (new) — client component rendering order detail (timeline, shipping, items, pricing) with `useLanguage()` and `OrderActions`.
- `src/app/orders/[id]/page.tsx` — rewritten as a thin server shell mapping the order to a plain serializable object.
- `src/app/orders/[id]/OrderActions.tsx` — added `useLanguage()`; translated `Print Invoice` and `Cancel Order` button labels.
- `src/app/profile/ProfileContent.tsx` (new) — client component rendering profile (banner, stats, account info, sign-out) with `useLanguage()`.
- `src/app/profile/page.tsx` — rewritten as a thin server shell mapping the user to a plain serializable object.
- `src/app/wishlist/page.tsx` — added `useLanguage()` inline; translated wishlist strings.
- `src/app/signin/page.tsx` — added `useLanguage()` inline; translated sign-in strings.
- `src/app/signup/page.tsx` — added `useLanguage()` inline; translated sign-up strings.
- `src/app/faq/page.tsx` — restructured `FAQS` into `qKey`/`aKey` pairs; added `useLanguage()`; filter comparison stays raw English.
- `src/app/contact/page.tsx` — added `useLanguage()` inline; translated contact strings and toast.

</details>
