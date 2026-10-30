# Implementation Plan: Language Switching for All Pages

## Summary of Findings

The `LanguageContext` and `useLanguage()` hook exist and work. The `LanguageSwitcher` component in the Navbar correctly sets `lang`. The problem is every page (`page.tsx`) is an `async` server component that calls `prisma` directly — server components cannot call `useLanguage()` or any React hook.

**Fix pattern:** Each page becomes a thin data-fetching shell that passes data as props to a new `'use client'` content component. The content component renders all visible text using `t()`.

**Shared components that already use `'use client'`** (`AddToCartButton`, `SortSelect`, `QuantitySelector`, `CartItemRow`) hardcode English strings — these also need `useLanguage()`.

**Navbar:** Already a server component, but it doesn't render any translatable page content — it just renders `<LanguageSwitcher />` (already a client component). No change needed.

---

## Missing Translation Keys

These keys are not yet in `LanguageContext.tsx` and must be added to BOTH `en` and `km`:

| Key | EN | KM |
|-----|----|----|
| `cart.remove` | Remove | លុប |
| `cart.quantity` | Quantity: | បរិមាណ: |
| `cart.max` | Max: | អតិបរមា: |
| `cart.addedToCart` | Added to Cart! | បានបន្ថែម! |
| `cart.adding` | Adding... | កំពុងបន្ថែម... |
| `cart.continueShopping` | ← Continue Shopping | ← បន្តការទិញ |
| `cart.itemCount` | items | មុខទំនិញ |
| `cart.addMoreForFreeShipping` | more for free shipping! | ទៀតដើម្បីដឹកជញ្ជូនឥតគិតថ្លៃ! |
| `cart.add` | Add $ | បន្ថែម $ |
| `product.adding` | Adding... | កំពុងបន្ថែម... |
| `product.reviews` | reviews | មតិ |
| `product.only` | Only | តែ |
| `product.leftInStock` | left in stock! | នៅក្នុងស្តុក! |
| `product.inStockAvailable` | In Stock | មានស្តុក |
| `product.available` | available | ដែលមាន |
| `product.writeReview` | Write a Review | សរសេរមតិ |
| `product.yourRating` | Your Rating | ការវាយតម្លៃរបស់អ្នក |
| `product.selectRating` | Select rating... | ជ្រើសរើសការវាយតម្លៃ... |
| `product.yourComment` | Your Comment | មតិរបស់អ្នក |
| `product.commentPlaceholder` | Share your experience with this product... | ចែករំលែកបទពិសោធន៍របស់អ្នក... |
| `product.submitReview` | Submit Review | ដាក់ស្នើមតិ |
| `product.noReviews` | No reviews yet. Be the first to review! | មិនទាន់មានមតិ។ ក្លាយជាអ្នកដំបូង! |
| `product.signInToReview` | Sign in | ចូលគណនី |
| `product.toWriteReview` | to write a review. | ដើម្បីសរសេរមតិ។ |
| `product.customerReviews` | Customer Reviews | មតិអតិថិជន |
| `product.relatedProducts` | Related Products | ផលិតផលពាក់ព័ន្ធ |
| `product.freeShipping` | Free Shipping | ដឹកជញ្ជូនឥតគិតថ្លៃ |
| `product.over` | Over $50 | លើស $50 |
| `product.easyReturns` | Easy Returns | ប្តូរទំនិញងាយ |
| `product.days` | 30 days | ៣០ ថ្ងៃ |
| `product.securePay` | Secure Pay | ការទូទាត់ប្រកបដោយសុវត្ថិភាព |
| `product.safe` | 100% safe | ១០០% ប្រកបដោយសុវត្ថិភាព |
| `sort.newest` | Newest First | ថ្មីបំផុត |
| `sort.priceAsc` | Price: Low → High | តម្លៃ: ទាប → ខ្ពស់ |
| `sort.priceDesc` | Price: High → Low | តម្លៃ: ខ្ពស់ → ទាប |
| `sort.rating` | Top Rated | ការវាយតម្លៃខ្ពស់ |

**Already present** (confirmed in LanguageContext.tsx): `product.addToCart`, `product.addedToCart`, `product.outOfStock`, `product.inStock`, `cart.title`, `cart.empty`, `cart.emptyDesc`, `cart.startShopping`, `cart.orderSummary`, `cart.subtotal`, `cart.shipping`, `cart.free`, `cart.total`, `cart.checkout`, all `home.*` keys, all `products.*` keys.

---

## New Client Content Components

| File to Create | Props | Purpose |
|---|---|---|
| `src/components/HomeContent.tsx` | `{ products: Product[], featuredProducts: Product[], searchQuery: string }` | Renders entire home page UI |
| `src/components/ProductsContent.tsx` | `{ products: Product[], totalCount: number, search: string, category: string, sort: string }` | Renders products listing UI |
| `src/components/ProductDetailContent.tsx` | `{ product: ProductWithReviews, relatedProducts: Product[], userHasReviewed: boolean, isSignedIn: boolean }` | Renders product detail UI |
| `src/components/CartContent.tsx` | `{ cart: { items: CartItem[] } }` | Renders cart UI, computes subtotal/total |

---

## SortSelect and Navbar Assessment

- **SortSelect**: Already `'use client'`. The SORT_OPTIONS array hardcodes English labels — must move inside the component and replace labels with `t()` calls. No wrapper needed.
- **Navbar**: Server component. It has no hardcoded page UI text — categories like "Electronics" are data values, not translatable UI strings. The `LanguageSwitcher` child is already a client component and works correctly. No change needed.

---

## Ordered Implementation Plan

- [ ] 1. Add all missing translation keys to `src/context/LanguageContext.tsx`.
      Add every key from the table above to both the `en` and `km` sections of the `translations` object. Verify `product.addToCart` and `product.addedToCart` already exist (they do — do not duplicate).
      Files: `src/context/LanguageContext.tsx`
      Verify: `npm run build` — zero errors.

- [ ] 2. Update `AddToCartButton` to use `useLanguage()`.
      Add `import { useLanguage } from '@/context/LanguageContext'` and call `const { t } = useLanguage()` inside the component. Replace: `'Added!'` → `t('product.addedToCart')`, `'Adding...'` → `t('product.adding')`, `'Out of Stock'` → `t('product.outOfStock')`, `'Add to Cart'` → `t('product.addToCart')`.
      Files: `src/components/AddToCartButton.tsx`
      Verify: `npm run build` — zero errors.

- [ ] 3. Update `SortSelect` to use `useLanguage()` for option labels.
      Add `import { useLanguage }` and call `const { t } = useLanguage()`. Move `SORT_OPTIONS` array inside the component function body (so it re-evaluates on language change). Replace labels: `'Newest First'` → `t('sort.newest')`, `'Price: Low → High'` → `t('sort.priceAsc')`, `'Price: High → Low'` → `t('sort.priceDesc')`, `'Top Rated'` → `t('sort.rating')`.
      Files: `src/components/SortSelect.tsx`
      Verify: `npm run build` — zero errors.

- [ ] 4. Update `QuantitySelector` to use `useLanguage()`.
      Add import and `const { t } = useLanguage()`. Replace: `'Quantity:'` → `t('cart.quantity')`, `(Max: {maxStock})` → `` `(${t('cart.max')} ${maxStock})` ``, `'Add to Cart'` → `t('product.addToCart')`, `'Added to Cart!'` → `t('cart.addedToCart')`, `'Adding...'` → `t('product.adding')`.
      Files: `src/components/QuantitySelector.tsx`
      Verify: `npm run build` — zero errors.

- [ ] 5. Update `CartItemRow` to use `useLanguage()`.
      Add import and `const { t } = useLanguage()`. Replace `'Remove'` → `t('cart.remove')`.
      Files: `src/components/CartItemRow.tsx`
      Verify: `npm run build` — zero errors.

- [ ] 6. Create `HomeContent.tsx` client component and update home `page.tsx`.
      Create `src/components/HomeContent.tsx` with `'use client'` directive. Props: `{ products: Product[], featuredProducts: Product[], searchQuery: string }` (import `Product` from `'@prisma/client'`). Move all JSX from the current `page.tsx` return into this component. Replace every English hardcoded string with the corresponding `t()` call (see the full key list above — every `home.*` key). The features strip array must be built from `t()` calls rather than object literals. Import `useLanguage`, `ProductCard`, `Link`, `ArrowRight`, `Star`, `ShieldCheck`, `Truck`, `RefreshCw`, `Zap`.
      Then update `src/app/page.tsx`: remove all JSX from the return, add `import HomeContent from '@/components/HomeContent'`, return `<HomeContent products={products} featuredProducts={featuredProducts} searchQuery={searchQuery} />`. Keep prisma fetches and `export const dynamic = 'force-dynamic'`. Remove now-unused icon/Link/ProductCard imports.
      Files: `src/components/HomeContent.tsx`, `src/app/page.tsx`
      Verify: `npm run build` — zero errors.

- [ ] 7. Create `ProductsContent.tsx` client component and update products `page.tsx`.
      Create `src/components/ProductsContent.tsx` with `'use client'`. Props: `{ products: Product[], totalCount: number, search: string, category: string, sort: string }`. Move all JSX from products `page.tsx` return here. Replace: the default heading `'All Products'` → `category || t('products.title')`, `'products found'` → `t('products.found')`, `'for'` → `t('products.for')`, `'No products found'` → `t('products.noFound')`, `'Try adjusting your search'` → `t('products.noFoundDesc')`, `'Clear Filters'` → `t('products.clearFilters')`, search placeholder `'Search...'` → `t('products.search')`. Keep `<Suspense>` wrapper and `<SortSelect>` (SortSelect now translates itself). Import `useLanguage`, `ProductCard`, `SortSelect`, `Link`, `Search`, `Suspense`.
      Then update `src/app/products/page.tsx`: keep all prisma/orderBy/where logic, return `<ProductsContent products={products} totalCount={totalCount} search={search} category={category} sort={sort} />`. Add import, remove unused imports.
      Files: `src/components/ProductsContent.tsx`, `src/app/products/page.tsx`
      Verify: `npm run build` — zero errors.

- [ ] 8. Create `ProductDetailContent.tsx` client component and update product detail `page.tsx`.
      Create `src/components/ProductDetailContent.tsx` with `'use client'`. Define a `ProductWithReviews` type (copy the shape from the prisma query: product fields + `reviews: Array<{ id, rating, comment, createdAt, user: { name, email } }>`). Props: `{ product: ProductWithReviews, relatedProducts: Product[], userHasReviewed: boolean, isSignedIn: boolean }`. Move `StarRating` helper function into this file. Move all JSX from the current page. Replace hardcoded strings: out-of-stock overlay → `t('product.outOfStock')`, stock status lines → use `t('product.only')`, `t('product.leftInStock')`, `t('product.inStockAvailable')`, `t('product.available')`; trust badges → `t('product.freeShipping')`, `t('product.over')`, `t('product.easyReturns')`, `t('product.days')`, `t('product.securePay')`, `t('product.safe')`; reviews heading → `` `${t('product.customerReviews')} (${product.reviews.length})` ``; review count next to name → `` `${product.reviews.length} ${t('product.reviews')}` ``; form labels → `t('product.writeReview')`, `t('product.yourRating')`, `t('product.selectRating')`, `t('product.yourComment')`, `t('product.commentPlaceholder')`, `t('product.submitReview')`; no-reviews state → `t('product.noReviews')`; sign-in prompt → `` `${t('product.signInToReview')} ... ${t('product.toWriteReview')}` ``; related products → `t('product.relatedProducts')`. The `<form action={submitReview}>` stays as-is (server actions work fine in client components). Import `useLanguage`, `Link`, `QuantitySelector`, `WishlistButton`, `submitReview`, `Star`, `ShieldCheck`, `Truck`, `RefreshCw`, `Package`.
      Then update `src/app/products/[id]/page.tsx`: keep all prisma fetches, `getSession`, `notFound()`, `userHasReviewed`. Compute `isSignedIn = !!session`. Return `<ProductDetailContent product={product} relatedProducts={relatedProducts} userHasReviewed={userHasReviewed} isSignedIn={isSignedIn} />`. Remove unused imports.
      Files: `src/components/ProductDetailContent.tsx`, `src/app/products/[id]/page.tsx`
      Verify: `npm run build` — zero errors.

- [ ] 9. Create `CartContent.tsx` client component and update cart `page.tsx`.
      Create `src/components/CartContent.tsx` with `'use client'`. Define `CartItem` type (id, quantity, product: { id, name, price, image, category, stock }) and `Cart = { items: CartItem[] }`. Props: `{ cart: Cart }`. Move subtotal/shipping/total computation and all JSX here. Replace: `'Shopping Cart'` → `t('cart.title')`, items count → `` `(${total_items} ${t('cart.itemCount')})` ``, `'Your cart is empty'` → `t('cart.empty')`, `'Add some products to get started'` → `t('cart.emptyDesc')`, `'Start Shopping'` → `t('cart.startShopping')`, `'Order Summary'` → `t('cart.orderSummary')`, `'Subtotal'` → `t('cart.subtotal')`, `'Shipping'` → `t('cart.shipping')`, `'FREE'` → `t('cart.free')`, `'Total'` → `t('cart.total')`, `'Proceed to Checkout'` → `t('cart.checkout')`, `'← Continue Shopping'` → `t('cart.continueShopping')`, free-shipping upsell → `` `${t('cart.add')}${(50 - subtotal).toFixed(2)} ${t('cart.addMoreForFreeShipping')}` ``. Import `useLanguage`, `CartItemRow`, `Link`, `ShoppingBag`, `ArrowRight`.
      Then update `src/app/cart/page.tsx`: keep `getSession`, `getOrCreateCart`, `redirect`. Remove subtotal/shipping/total computation. Return `<CartContent cart={cart} />`. Add import, remove unused imports (`ShoppingBag`, `ArrowRight`, `Link`, `CartItemRow`).
      Files: `src/components/CartContent.tsx`, `src/app/cart/page.tsx`
      Verify: `npm run build` — zero errors.

- [ ] 10. Final build + manual smoke-test.
      Run `npm run build` one final time to confirm the entire app compiles clean. Then run `npm run dev` and verify:
      - On `/` → switch to ខ្មែរ → hero text, features strip, section headings, "products available" all update.
      - On `/products` → sort dropdown labels, page heading, search placeholder, count all update.
      - On any `/products/:id` → trust badges, stock text, reviews section, review form all update.
      - On `/cart` → all labels, summary, and checkout button update.
      - Switch back to EN → everything reverts correctly.
      Files: none
      Verify: `npm run build` exits 0; manual browser check passes.
