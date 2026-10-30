# Implementation Plan: Admin Roles & Dashboard

## Investigation Findings

**Codebase state:**
- `prisma/schema.prisma`: `User.role` is `String @default("user")` — needs changing to `"customer"`.
- `prisma/seed.ts`: Seeds 3 users all with `role: 'user'`. No admin user exists.
- `src/lib/session.ts`: `SessionPayload` already has `role: string`. `getSession()` returns it. `createSession()` stores it in JWT. ✅ No changes needed to session infrastructure.
- `src/actions/auth.ts`: `loginUser` and `registerUser` both call `createSession({ ..., role: user.role })`. ✅ Role is already passed into the JWT on login.
- `src/components/UserMenu.tsx`: Props interface is `{ name: string | null; email: string }` — no `role` prop yet.
- `src/components/Navbar.tsx`: Calls `<UserMenu name={session.name} email={session.email} />` — no role passed yet.
- `src/lib/prisma.ts`: Exports `prisma` as a singleton `PrismaClient`. Used by all server components and actions.
- `src/actions/` contains: `auth.ts`, `cart.ts`, `orders.ts`. No `admin.ts` yet.
- `src/app/admin/` does not exist yet.
- Packages already installed: `lucide-react`, `bcryptjs`, `@prisma/client`, `jose`. No new packages needed.
- Build/verify command: `npx tsc --noEmit` (from tsconfig.json `"noEmit": true`).
- Migration command: `npx prisma migrate dev --name change_role_default_to_customer`
- DB: MySQL at `mysql://root:1362@localhost:3306/ecommerce_db`.
- `tsconfig.json` path alias `@/*` → `./src/*`.

**Key patterns observed:**
- Server components: import `prisma` from `@/lib/prisma`, import `getSession` from `@/lib/session`, use `redirect()` from `next/navigation`.
- Client components: `'use client'` at top, use `useState`/hooks, receive data as props.
- Actions: `'use server'` at top, import `prisma` and `getSession`, call `revalidatePath` and/or `redirect`.
- Dynamic pages use `export const dynamic = 'force-dynamic'`.
- Lucide icons used throughout — same imports apply to admin pages.
- `params` in dynamic routes is typed as `Promise<{ id: string }>` and awaited (Next.js 15 pattern).

---

## Implementation Plan

- [ ] 1. Update schema role default and run migration.
      In `prisma/schema.prisma`, change `role String @default("user")` to `role String @default("customer")`.
      Then run `cd /Users/moengmix/Desktop/e-commerce-app && npx prisma migrate dev --name change_role_default_to_customer`.
      Files: `prisma/schema.prisma`
      Verify: The migration completes without error and a new folder appears under `prisma/migrations/` with `change_role_default_to_customer` in the name.

- [ ] 2. Update seed to add admin user and change existing users to role "customer".
      In `prisma/seed.ts`, add a new `prisma.user.create` call BEFORE the three demo users — email: `admin@eshop.com`, password: `await bcrypt.hash('admin123', 10)`, name: `Admin`, role: `'admin'`. Change all three existing user `create` calls from `role: 'user'` to `role: 'customer'`. No other seed changes.
      Files: `prisma/seed.ts`
      Verify: `cd /Users/moengmix/Desktop/e-commerce-app && npx prisma db seed` completes successfully and prints the success message.

- [ ] 3. Create admin server actions file.
      Create `src/actions/admin.ts` with `'use server'` directive. Import `prisma` from `@/lib/prisma`, `getSession` from `@/lib/session`, `revalidatePath` from `next/cache`, `redirect` from `next/navigation`.
      Implement four functions:
      - `createProduct(formData: FormData)`: verify `session.role === 'admin'` (throw `Error('Unauthorized')` if not), extract `name`, `description`, `price` (parseFloat), `image` (field name `imageUrl`), `category`, `stock` (parseInt) from formData, call `prisma.product.create({ data: { name, description, price, image, category, stock } })`, call `revalidatePath('/admin/products')`, then `redirect('/admin/products')`.
      - `updateProduct(id: string, formData: FormData)`: same admin check, extract same fields, call `prisma.product.update({ where: { id }, data: { ... } })`, call `revalidatePath('/admin/products')`, then `redirect('/admin/products')`.
      - `deleteProduct(id: string)`: admin check, call `prisma.product.delete({ where: { id } })`, call `revalidatePath('/admin/products')`.
      - `updateOrderStatus(orderId: string, status: string)`: admin check, call `prisma.order.update({ where: { id: orderId }, data: { status } })`, call `revalidatePath('/admin/orders')`, call `revalidatePath(`/admin/orders/${orderId}`)`.
      Files: `src/actions/admin.ts`
      Verify: `npx tsc --noEmit` — zero errors.

- [ ] 4. Update UserMenu to accept and render admin link.
      In `src/components/UserMenu.tsx`, add `role?: string` to the `UserMenuProps` interface. Add `import { LayoutDashboard } from 'lucide-react'` to the existing lucide-react import line. Inside the dropdown `<div className="py-1">` block, after the `signed in as` header div and BEFORE the `My Orders` link, add a conditional block: `{role === 'admin' && (<Link href="/admin" onClick={() => setOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600"><LayoutDashboard className="w-4 h-4" />Admin Dashboard</Link>)}`.
      Files: `src/components/UserMenu.tsx`
      Verify: `npx tsc --noEmit` — zero errors.

- [ ] 5. Update Navbar to pass role to UserMenu.
      In `src/components/Navbar.tsx`, change the `<UserMenu>` call from `<UserMenu name={session.name} email={session.email} />` to `<UserMenu name={session.name} email={session.email} role={session.role} />`.
      Files: `src/components/Navbar.tsx`
      Verify: `npx tsc --noEmit` — zero errors.

- [ ] 6. Create admin layout with sidebar and role guard.
      Create `src/app/admin/layout.tsx` as a server component (no `'use client'`).
      Import: `getSession` from `@/lib/session`, `redirect` from `next/navigation`, `Link` from `next/link`, `LayoutDashboard`, `Package`, `ShoppingBag`, `Users` from `lucide-react`.
      Logic: call `const session = await getSession()`. If `!session || session.role !== 'admin'` then `redirect('/')`.
      Render: an outer `<div className="flex min-h-screen">`. Left sidebar: `<aside className="w-64 bg-gray-900 text-white flex flex-col shrink-0">`. Inside sidebar: logo section with `<div className="h-16 flex items-center px-6 border-b border-gray-700/50">` containing the E-Shop logo (ShoppingBag icon in blue-600 square + text). Then `<nav className="flex-1 p-4 space-y-1">` with four `<Link>` items:
      - Dashboard → `/admin` — icon: `LayoutDashboard`
      - Products → `/admin/products` — icon: `Package`
      - Orders → `/admin/orders` — icon: `ShoppingBag`
      - Users → `/admin/users` — icon: `Users`
      Each nav link styled: `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-colors`. Active state cannot be detected in a server layout without usePathname (client hook), so use static styling for now — all links use the same hover style (the dashboard overview page can refine later if needed).
      Right side: `<main className="flex-1 bg-gray-50 overflow-auto">{children}</main>`.
      Files: `src/app/admin/layout.tsx`
      Verify: `npx tsc --noEmit` — zero errors.

- [ ] 7. Create admin dashboard overview page.
      Create `src/app/admin/page.tsx` as a server component. Add `export const dynamic = 'force-dynamic'`.
      Import: `prisma` from `@/lib/prisma`.
      Fetch in parallel with `Promise.all`:
      - `prisma.product.count()`
      - `prisma.order.count()`
      - `prisma.user.count()`
      - `prisma.order.aggregate({ _sum: { total: true } })` → revenue
      - `prisma.order.findMany({ take: 5, orderBy: { createdAt: 'desc' }, include: { user: { select: { email: true } } } })`
      Render:
      - Page heading `<h1>Dashboard</h1>`.
      - Stats grid (4 cards, `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6`): Total Products, Total Orders, Total Users, Total Revenue (`$X.XX`). Each card: white bg, `rounded-2xl`, `shadow-sm`, `border border-gray-200`, `p-6`, big number + label.
      - Recent Orders table below: `<table>` with columns: Order ID (last 8 chars uppercased), Customer (user.email), Total (`$X.XX`), Status (plain text), Date (`.toLocaleDateString()`). Table styled with `bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden`.
      Files: `src/app/admin/page.tsx`
      Verify: `npx tsc --noEmit` — zero errors.

- [ ] 8. Create admin products list page.
      Create `src/app/admin/products/page.tsx` as a server component. Add `export const dynamic = 'force-dynamic'`.
      Import: `prisma` from `@/lib/prisma`, `Link` from `next/link`.
      Fetch: `const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } })`.
      Render:
      - Header row: heading "Products" + `<Link href="/admin/products/new">` button labeled "Add Product" styled with `bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700`.
      - Table: columns: Image (thumbnail `w-12 h-12 object-cover rounded-lg`), Name, Category, Price (`$X.XX`), Stock, Actions.
      - Actions column: `<Link href={`/admin/products/${product.id}/edit`}>Edit</Link>` (blue text) and a delete form `<form action={...}>` — the delete action must be imported from `@/actions/admin` (`deleteProduct`). Use a hidden input for the id and a submit button labeled "Delete" in red text. The form's action should be a wrapper: since `deleteProduct` takes an `id: string` (not FormData), bind it: `deleteProduct.bind(null, product.id)`.
      Files: `src/app/admin/products/page.tsx`
      Verify: `npx tsc --noEmit` — zero errors.

- [ ] 9. Create admin new product page.
      Create `src/app/admin/products/new/page.tsx` as a client component (`'use client'`).
      Import: `useState` from `react`, `useRouter` from `next/navigation`, `createProduct` from `@/actions/admin`.
      Render a form with controlled or uncontrolled inputs: `name`, `description` (textarea), `price` (number), `imageUrl`, `category` (select with options: Electronics, Clothing, Books, Home, Sports, Beauty), `stock` (number).
      On submit (`<form action={createProduct}>`): since `createProduct` is a server action, use it directly as the `action` prop — Next.js handles the FormData. Show a loading state via `useTransition` or a simple `<button disabled>` during submission if desired, but keep it straightforward.
      Style: white card, `max-w-2xl mx-auto`, labels + inputs with `border border-gray-300 rounded-lg px-3 py-2 w-full`, submit button `bg-blue-600 text-white`.
      Files: `src/app/admin/products/new/page.tsx`
      Verify: `npx tsc --noEmit` — zero errors.

- [ ] 10. Create admin edit product page.
      Create `src/app/admin/products/[id]/edit/page.tsx`. This file contains both the server shell and an inline client form component.
      - Server component (default export) typed with `{ params: Promise<{ id: string }> }`: await params, fetch `prisma.product.findUnique({ where: { id } })`, call `notFound()` if null, render `<EditProductForm product={product} />`.
      - Client component `EditProductForm` (defined in the same file, exported separately or just locally): `'use client'` at file top. Props: `{ product: Product }` (type `Product` from `@prisma/client`). Import `updateProduct` from `@/actions/admin`. Use `updateProduct.bind(null, product.id)` as the form action. Pre-fill all fields with `defaultValue={product.fieldName}`. Same fields as new product form. Same styling.
      Since the file has `'use client'` at the top (needed for `EditProductForm`), the server fetching needs to be in a separate parent. Solution: put `'use client'` only on `EditProductForm` by splitting it into two files: `src/app/admin/products/[id]/edit/page.tsx` (server, no directive) and `src/app/admin/products/[id]/edit/EditProductForm.tsx` (client, `'use client'`). The server page imports and renders `<EditProductForm product={product} />`.
      Files: `src/app/admin/products/[id]/edit/page.tsx`, `src/app/admin/products/[id]/edit/EditProductForm.tsx`
      Verify: `npx tsc --noEmit` — zero errors.

- [ ] 11. Create admin orders list page.
      Create `src/app/admin/orders/page.tsx` as a server component. Add `export const dynamic = 'force-dynamic'`.
      Props: `{ searchParams: Promise<{ status?: string }> }`.
      Fetch: `prisma.order.findMany` with `where: statusFilter ? { status: statusFilter } : {}`, `include: { user: { select: { email: true } } }`, `orderBy: { createdAt: 'desc' }`.
      Render:
      - Status filter tabs (plain `<Link>` elements with `?status=...` query params): All, Pending, Processing, Shipped, Delivered, Cancelled. Active tab (matching current `status` param) styled with `bg-blue-600 text-white`, others with `bg-white text-gray-600 border`. Use `flex gap-2 mb-6`.
      - Table columns: Order ID (last 8 chars), Customer (user.email), Total (`$X.XX`), Status badge, Date.
      - Status badge colors: `pending` → `bg-yellow-100 text-yellow-800`, `processing` → `bg-blue-100 text-blue-800`, `shipped` → `bg-purple-100 text-purple-800`, `delivered` → `bg-green-100 text-green-800`, `cancelled` → `bg-red-100 text-red-800`. Each badge: `text-xs font-semibold px-2.5 py-0.5 rounded-full`.
      - Order ID links to `/admin/orders/${order.id}`.
      Files: `src/app/admin/orders/page.tsx`
      Verify: `npx tsc --noEmit` — zero errors.

- [ ] 12. Create admin order detail page with status update.
      This follows the same split pattern as the edit product page.
      Create `src/app/admin/orders/[id]/page.tsx` (server component, no directive):
      - `params: Promise<{ id: string }>`, await it.
      - Fetch `prisma.order.findUnique({ where: { id }, include: { user: { select: { name: true, email: true } }, items: { include: { product: true } } } })`.
      - If null, call `notFound()`.
      - Render: customer info card (name, email), order items list (product image thumbnail, name, qty, price, line total), order total, and `<OrderStatusUpdater orderId={order.id} currentStatus={order.status} />`.
      Create `src/app/admin/orders/[id]/OrderStatusUpdater.tsx` (client component, `'use client'`):
      - Props: `{ orderId: string; currentStatus: string }`.
      - State: `const [status, setStatus] = useState(currentStatus)`.
      - Import `updateOrderStatus` from `@/actions/admin`.
      - Render a `<select>` with options: pending, processing, shipped, delivered, cancelled. Bind `value={status}` and `onChange`.
      - A `<button>` labeled "Save Status" that calls `updateOrderStatus(orderId, status)` in an async handler.
      - Show a loading indicator while saving.
      Files: `src/app/admin/orders/[id]/page.tsx`, `src/app/admin/orders/[id]/OrderStatusUpdater.tsx`
      Verify: `npx tsc --noEmit` — zero errors.

- [ ] 13. Create admin users list page.
      Create `src/app/admin/users/page.tsx` as a server component. Add `export const dynamic = 'force-dynamic'`.
      Fetch: `prisma.user.findMany({ orderBy: { createdAt: 'desc' }, include: { _count: { select: { orders: true } } } })`.
      Render a table with columns: Name, Email, Role badge (`admin` → `bg-blue-100 text-blue-800`; `customer` → `bg-gray-100 text-gray-700`; badge style `text-xs font-semibold px-2.5 py-0.5 rounded-full`), Orders (count from `_count.orders`), Joined (`.toLocaleDateString()`).
      Files: `src/app/admin/users/page.tsx`
      Verify: `npx tsc --noEmit` — zero errors.

- [ ] 14. Final TypeScript verification.
      Run `cd /Users/moengmix/Desktop/e-commerce-app && npx tsc --noEmit`.
      Fix any type errors found (common pitfalls: `product.image` vs `imageUrl` field name mismatch — in the schema the field is `image`, so the form input should be named `image` not `imageUrl` and the action reads `formData.get('image')`; `params` typed as `Promise<{ id: string }>` must be awaited; `_count` on user query needs `include: { _count: { select: { orders: true } } }`).
      Files: any files with type errors
      Verify: `npx tsc --noEmit` exits with code 0 and zero error lines.

---

## Notes and Assumptions

1. **`imageUrl` vs `image`**: The Prisma schema field is named `image`. The task spec says "imageUrl" as the form field label, but the action must read `formData.get('image')` and write to `product.image`. The form input `name` attribute should be `image` (or `imageUrl` with the action reading `imageUrl` — either works as long as they match). Plan uses `image` as the field name throughout for consistency with the schema.

2. **Active nav highlighting in layout**: The admin layout is a server component. `usePathname()` is a client hook and cannot be used there. The simplest approach that avoids a `'use client'` layout is to skip active highlighting in the layout and let each page manage its own heading/breadcrumb. If active highlighting is required, the sidebar nav can be extracted into a client component `AdminSidebarNav` that uses `usePathname()`.

3. **`deleteProduct` as form action**: Server actions used as form actions receive a single `FormData` argument. `deleteProduct(id)` takes an `id` string. Use `.bind`: `const boundDelete = deleteProduct.bind(null, product.id)` then `<form action={boundDelete}>`. This is the standard Next.js pattern for passing extra args to server actions.

4. **Migration impact**: Changing the schema default does NOT retroactively update existing DB rows. Existing users in the DB will keep role `'user'`. Re-seeding (`npx prisma db seed`) will delete all rows and re-create them with correct roles. If the DB has real data that should not be wiped, a separate SQL UPDATE is needed — but given this is a dev project, re-seeding is the correct approach.
