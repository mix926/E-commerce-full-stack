# Admin and Customer Roles Implementation

The change introduces a two-tier role system (`admin` / `customer`) into the e-commerce app. The schema adds `role String @default("customer")` on the User model. The seed produces one admin account (`admin@eshop.com`) and keeps all demo users as `customer`. A `requireAdmin()` guard sits in front of every mutating server action. The admin section is an entire Next.js route segment under `/admin` with a layout-level redirect that blocks non-admins before any page content renders. The `UserMenu` dropdown gains a conditional "Admin Dashboard" link visible only when `role === 'admin'`.

Watch for: the role stored in the JWT at login time is never re-checked against the database on subsequent requests — a user whose role is demoted in the DB retains admin access until their 7-day token expires (**confirmed**). The `updateOrderStatus` action accepts an arbitrary string as the new status with no allowlist validation, so any value — including garbage — can be written to the database (**confirmed**).

**Verdict**: NEEDS_CHANGES

---

## High-level view

The layout guard in `AdminLayout` (`getSession()` + `session.role !== 'admin'` → `redirect('/')`) is the correct place for route-level enforcement, and it covers every page under `/admin` by Next.js segment inheritance. All four server actions — `createProduct`, `updateProduct`, `deleteProduct`, `updateOrderStatus` — delegate to a shared `requireAdmin()` helper before touching the database, so there is no action-level gap even if the layout were somehow bypassed.

The role value embedded in the JWT at login time is the sole source of truth for `getSession()`. The database is never consulted after the session cookie is issued. This means a role change in the DB has no effect on active sessions for up to seven days.

The `updateOrderStatus` action writes whatever string arrives in the `status` argument directly to the `Order.status` column. There is no allowlist check against the known status values (`pending`, `processing`, `shipped`, `delivered`, `cancelled`). The client-side select widget constrains input visually, but because this is a server action callable by any authenticated request, that constraint does not hold.

The admin pages themselves (`/admin/page.tsx`, `/admin/users/page.tsx`) do their own Prisma queries without a second session check, which is intentional and safe because the layout already redirected. The users page exposes password hashes in the Prisma query result object — they are not rendered in the table, but they are present in the React tree's server-side data. This is a minor hygiene concern rather than a runtime exposure.

---

<details>
<summary>Issues (3)</summary>

1. **Stale role in JWT** — A user's role is baked into the JWT at login and never re-validated against the database on subsequent requests. If an admin account is compromised and the role is demoted in the DB, the session remains privileged for up to 7 days. Either add a short expiry to the JWT (e.g. 15 minutes with a refresh mechanism), or re-fetch the user's role from the DB in `requireAdmin()` on each call.

2. **No status allowlist in `updateOrderStatus`** — The action writes the caller-supplied `status` string directly to the database with no validation. Constrain it to the known set: `['pending', 'processing', 'shipped', 'delivered', 'cancelled']` and throw (or return an error) on anything else.

3. **Password hash exposed in users page query** — `AdminUsersPage` fetches all user rows including the `password` field (it selects the full model). The hash is not rendered, but it is unnecessarily present in the server component's data. Add a `select` clause to the `prisma.user.findMany` call that excludes `password`.

</details>

---

<details>
<summary>Details</summary>

### Stale role in JWT

`getSession()` in `session.ts` calls `jwtVerify` and returns the decoded payload directly — there is no database lookup. The role embedded at `loginUser` or `registerUser` time is what every subsequent request sees for the full 7-day token lifetime. The layout guard and `requireAdmin()` both call `getSession()`, so both inherit this limitation.

The practical risk: if an admin account needs to be revoked (compromised credential, employee departure), setting `role = 'customer'` in the database has no effect on any existing session. The window is the full token TTL of 7 days.

A straightforward fix is to re-query the user in `requireAdmin()`:

```ts
async function requireAdmin() {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');
  const user = await prisma.user.findUnique({ where: { id: session.userId }, select: { role: true } });
  if (!user || user.role !== 'admin') throw new Error('Unauthorized');
  return session;
}
```

This adds one indexed DB read per admin action, which is acceptable. The layout guard could do the same, or the JWT TTL could be shortened with a refresh token strategy if a full DB check on every page render is undesirable.

### No status allowlist in `updateOrderStatus`

```ts
export async function updateOrderStatus(orderId: string, status: string) {
  await requireAdmin();
  await prisma.order.update({
    where: { id: orderId },
    data: { status },  // ← unconstrained string
  });
  ...
}
```

The client renders a `<select>` with five options, but a direct call to this server action bypasses that. An admin user (or anyone who can forge a valid admin session) can write an arbitrary value to the status column. Downstream code that branch-tests `order.status` against known strings (the `statusColors` map in the orders page, any email-triggered logic) will silently hit the `?? 'bg-gray-100 text-gray-700'` fallback rather than error, making bad data hard to detect.

Fix: validate before writing.

```ts
const VALID_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'] as const;
if (!VALID_STATUSES.includes(status as any)) throw new Error('Invalid status');
```

### Password hash exposed in users page

`AdminUsersPage` calls `prisma.user.findMany` with only `include: { _count: ... }` — no `select`, so the `password` field is present in every returned object. It is never accessed in the JSX, but it is serialized as part of the server component's data payload. Adding an explicit `select` excludes the field from the wire entirely:

```ts
const users = await prisma.user.findMany({
  orderBy: { createdAt: 'desc' },
  select: {
    id: true, name: true, email: true, role: true, createdAt: true,
    _count: { select: { orders: true } },
  },
});
```

### Admin route topology

```
/admin/*
  └── layout.tsx  ← getSession() + role check → redirect('/') if not admin
        ├── page.tsx            (dashboard stats)
        ├── products/page.tsx   (list + delete)
        ├── products/new/page.tsx
        ├── products/[id]/edit/page.tsx
        ├── orders/page.tsx     (list with status tabs)
        ├── orders/[id]/page.tsx
        └── users/page.tsx
```

Every route in the segment is covered by a single layout guard. Server actions are separately guarded by `requireAdmin()`, providing defense in depth if the layout were somehow bypassed (direct action invocation, middleware misconfiguration).

</details>

---

<details>
<summary>File map</summary>

| File | What changed |
|---|---|
| `prisma/schema.prisma` | `role String @default("customer")` added to User model |
| `prisma/seed.ts` | Admin user seeded with `role: 'admin'`; all demo users get `role: 'customer'` |
| `src/actions/admin.ts` | New file: `createProduct`, `updateProduct`, `deleteProduct`, `updateOrderStatus`, all gated by `requireAdmin()` |
| `src/app/admin/layout.tsx` | New: role-checked layout wrapping all admin pages |
| `src/app/admin/page.tsx` | New: dashboard with product/order/user/revenue stats |
| `src/app/admin/products/page.tsx` | New: product list with edit/delete actions |
| `src/app/admin/products/new/page.tsx` | New: create product form |
| `src/app/admin/products/[id]/edit/page.tsx` | New: edit product page |
| `src/app/admin/products/[id]/edit/EditProductForm.tsx` | New: client form for editing a product |
| `src/app/admin/orders/page.tsx` | New: order list with status filter tabs |
| `src/app/admin/orders/[id]/page.tsx` | New: order detail view |
| `src/app/admin/orders/[id]/OrderStatusUpdater.tsx` | New: client component for updating order status |
| `src/app/admin/users/page.tsx` | New: user list with role badge |
| `src/app/admin/AdminSidebarNav.tsx` | New: client sidebar nav with active-path highlighting |
| `src/components/UserMenu.tsx` | `role` prop added; Admin Dashboard link conditionally rendered |
| `src/components/Navbar.tsx` | Passes `session.role` to `UserMenu` |

</details>
