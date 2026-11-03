# E-Commerce UI/UX Design System & Component Library Strategy

## Executive Summary

This design system establishes a cohesive, production-ready UI foundation for the E-Shop e-commerce platform built on Next.js 16, React 19, Tailwind CSS 4, and shadcn/ui. The system balances modern aesthetic appeal with accessibility, performance, and developer ergonomics. It defines a complete spectrum from foundational design tokens (color, typography, spacing) through component architecture, page layouts, interaction patterns, and accessibility compliance.

The design approach prioritizes:
- **Semantic consistency**: All visual and interactive patterns follow predictable rules
- **Accessibility first**: WCAG 2.1 AA compliance baked into component design
- **Performance optimization**: Lazy loading, skeleton screens, and optimized animations
- **Mobile-first responsive design**: Graceful scaling from mobile (320px) to desktop (1920px+)
- **Developer velocity**: Clear component APIs, composition patterns, and usage guidelines

---

## 1. Design System Foundation

### 1.1 Color Palette

The color system uses OKLch color space for perceptually uniform, accessible colors. All color pairs maintain a minimum 4.5:1 contrast ratio for text/interactive elements and 3:1 for graphics.

#### Primary Colors
```
Primary (Brand Blue):
  - 50:  #eff6ff   (ultra-light, hover backgrounds)
  - 100: #dbeafe   (light backgrounds)
  - 500: #3b82f6   (primary action button, links, focus states)
  - 600: #2563eb   (primary button hover, brand)
  - 700: #1d4ed8   (primary button active, bold text)
  
Primary Foreground: #ffffff / #f8fafc (on dark/light)
```

#### Secondary Colors
```
Secondary (Neutral Slate):
  - 50:  #f8fafc   (page background)
  - 100: #f1f5f9   (card backgrounds, borders)
  - 200: #e2e8f0   (subtle borders, dividers)
  - 500: #64748b   (secondary text)
  - 900: #0f172a   (primary text, headings)

Foreground: #0f172a / #f8fafc
```

#### Semantic Colors
```
Success (Emerald):
  - 50:  #f0fdf4
  - 500: #10b981
  - 600: #059669   (confirmed orders, positive feedback)
  
Warning (Amber):
  - 50:  #fffbeb
  - 500: #f59e0b   (low stock indicator)
  - 600: #d97706   (hover state)
  
Error (Red):
  - 50:  #fef2f2
  - 500: #ef4444
  - 600: #dc2626   (out of stock, errors)
  - 700: #b91c1c   (destructive button active)
  
Accent (Violet):
  - 50:  #faf5ff
  - 500: #a78bfa   (premium/featured badges)
  - 600: #9333ea   (hover)
```

#### Usage Rules
- **Backgrounds**: Use 50-100 shades for container backgrounds
- **Borders**: Use 100-200 shades for subtle borders and dividers
- **Text**: Use 500-900 for interactive text; 700-900 for body/headers
- **Interactive**: Use 500-600 range with proper contrast; 600-700 for hover/active
- **Dark mode**: Invert luminosity (50 ↔ 900) while maintaining semantic meaning

### 1.2 Typography System

#### Font Stack
```
Primary (Sans-serif, body & UI):
  font-family: 'Plus Jakarta Sans', 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif
  
Heading (Display):
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif
  letter-spacing: -0.025em
  
Monospace (Code):
  font-family: 'Monaco', 'Courier New', monospace
  letter-spacing: 0
```

#### Type Scale (Responsive)
```
Display XL (Hero title):
  Desktop: 48px / 56px (1.167x line height)
  Mobile:  32px / 40px
  Weight:  800 (extrabold)
  Usage:   Hero section titles, page headers

Display L (Section title):
  Desktop: 36px / 44px
  Mobile:  28px / 36px
  Weight:  700 (bold)
  Usage:   Section headings

Display M (Subsection):
  Desktop: 28px / 36px
  Mobile:  24px / 32px
  Weight:  700 (bold)
  Usage:   Category headers, card titles

Body XL:
  Size: 20px / 28px
  Weight: 600 (semibold)
  Usage: Large emphasis text, important labels

Body L:
  Size: 18px / 28px
  Weight: 500 (medium)
  Usage: Primary body text, form labels

Body M (Default):
  Size: 16px / 24px
  Weight: 400 (regular)
  Usage: Standard body text, descriptions

Body S:
  Size: 14px / 20px
  Weight: 500 (medium)
  Usage: Secondary text, helper text

Caption:
  Size: 12px / 18px
  Weight: 500 (medium)
  Usage: Badges, tags, timestamps

Label (All caps):
  Size: 10px / 16px
  Weight: 700 (bold)
  Letter-spacing: 0.15em
  Usage: Form labels, category badges
```

#### Font Weight Usage
```
400: Regular body text, descriptions, form inputs
500: Medium emphasis (labels, secondary text, buttons)
600: Semibold (card titles, input labels, secondary headers)
700: Bold (section titles, main headers, emphasis)
800: Extrabold (hero titles, display text)
```

### 1.3 Spacing System

A modular 4px base unit ensures consistent rhythm and alignment.

```
Spacing Scale:
  0:    0px      (no gap)
  0.5:  2px      (hairline spacing)
  1:    4px      (micro spacing between icons/text)
  1.5:  6px      (small gap)
  2:    8px      (small padding/gap)
  2.5:  10px     (button padding, small margins)
  3:    12px     (card padding, badge padding)
  3.5:  14px     (form field padding)
  4:    16px     (standard padding, component gaps)
  5:    20px     (large padding, section gaps)
  6:    24px     (section spacing)
  8:    32px     (section margins)
  10:   40px     (large section margins)
  12:   48px     (page-level margins)
  16:   64px     (container margins)
```

#### Application Guidelines
- **Component internal padding**: 3-4 (12-16px)
- **Component gap**: 2-3 (8-12px)
- **Section vertical spacing**: 8-12 (32-48px)
- **Container padding**: 4-6 (16-24px) on mobile, 6-8 (24-32px) on desktop
- **Page margins**: 12-16 (48-64px) symmetrical on large screens

### 1.4 Border Radius System

All border radii follow a consistent curve scale for visual harmony.

```
Radius Scale:
  sm:   calc(var(--radius) * 0.6) = ~3.75px   (small interactive elements, tags)
  md:   calc(var(--radius) * 0.8) = ~5px      (form inputs, small cards)
  lg:   var(--radius)              = ~6.25px  (cards, popovers)
  xl:   calc(var(--radius) * 1.4) = ~8.75px  (larger cards, modals)
  2xl:  calc(var(--radius) * 1.8) = ~11.25px (hero sections, featured areas)
  3xl:  calc(var(--radius) * 2.2) = ~13.75px (large containers)
  4xl:  calc(var(--radius) * 2.6) = ~16.25px (full-width sections)
  full: 9999px                     (pills, rounded buttons)

Base value (--radius): 0.625rem = 10px
```

#### Usage
- **Button**: `rounded-lg` (6.25px)
- **Input/Select**: `rounded-md` (5px)
- **Card**: `rounded-2xl` (11.25px)
- **Modal/Popover**: `rounded-xl` (8.75px)
- **Hero sections**: `rounded-3xl` (13.75px)
- **Pill badges**: `rounded-full`
- **Icon buttons**: `rounded-lg`

### 1.5 Shadow System

Shadows create depth hierarchy and guide visual attention. All shadows use semi-transparent black with carefully calibrated blur and spread.

```
Shadow Scale:
  None:  none
  sm:    0 1px 2px 0 rgba(0,0,0,0.05)
         (subtle depth for badges, icons)
  
  Base:  0 1px 3px 0 rgba(0,0,0,0.1),
         0 1px 2px 0 rgba(0,0,0,0.06)
         (default card shadow, interactive elements)
  
  md:    0 4px 6px -1px rgba(0,0,0,0.1),
         0 2px 4px -1px rgba(0,0,0,0.06)
         (product cards, elevated containers)
  
  lg:    0 10px 15px -3px rgba(0,0,0,0.1),
         0 4px 6px -2px rgba(0,0,0,0.05)
         (modals, dropdowns, overlays)
  
  xl:    0 20px 25px -5px rgba(0,0,0,0.1),
         0 10px 10px -5px rgba(0,0,0,0.04)
         (full-screen modals, hero sections)

Focus shadow:
  0 0 0 3px rgba(59,130,246,0.1),
  0 0 0 6px rgba(59,130,246,0.25)
  (keyboard focus ring)

Color brand shadow (blue glow):
  0 0 20px 4px rgba(59,130,246,0.15)
  (brand accent elements, CTAs)
```

#### Application
- **Cards**: `shadow-md` when static, `hover:shadow-lg` on interaction
- **Buttons**: No shadow by default, `shadow` on hover for depth
- **Modals**: `shadow-xl`
- **Dropdowns/Popovers**: `shadow-lg`
- **Focus states**: Combine `outline` and `focus-shadow`

### 1.6 Animation & Transition Principles

Animations enhance usability by providing feedback and guiding attention. All animations follow a consistent easing curve (cubic-bezier(0.22, 1, 0.36, 1)) for a responsive, snappy feel.

#### Easing Curves
```
Responsive (default): cubic-bezier(0.22, 1, 0.36, 1)
  Best for: UI interactions, state changes, component transitions
  Feeling: Quick, bouncy, modern

Smooth Entry: cubic-bezier(0.34, 1.56, 0.64, 1)
  Best for: Page entries, reveals, stagger animations
  Feeling: Smooth, controlled deceleration

Linear: linear
  Best for: Continuous motion (loaders, spinners)
  Feeling: Neutral, mechanical
```

#### Duration Palette
```
Micro interactions (state feedback): 150ms
  Examples: button press, icon toggle, focus change
  
Standard transitions (UI changes): 200-300ms
  Examples: dropdown open, tooltip appear, color change
  
Reveal animations (page enter): 350-500ms
  Examples: hero text, card appear, section slide
  
Lazy load feedback: 600-1000ms
  Examples: skeleton fade, image reveal, progress animation
  
Continuous motion: 3-5s
  Examples: marquee scroll, float animations, infinite rotations
```

#### Animation Library

**Fade animations** (opacity changes)
```css
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
/* Use: Page entries, section reveals */

@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}
/* Use: Overlays, modals, subtle reveals */
```

**Transform animations** (movement)
```css
@keyframes slideInRight {
  from { opacity: 0; transform: translateX(-24px); }
  to   { opacity: 1; transform: translateX(0); }
}
/* Use: Sidebar expand, content slide */

@keyframes slideInDown {
  from { opacity: 0; transform: translateY(-12px); }
  to   { opacity: 1; transform: translateY(0); }
}
/* Use: Dropdown appearance */
```

**Emphasis animations** (draw attention)
```css
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50%      { opacity: 0.5; }
}
/* Use: Active states, loading indicators */

@keyframes shimmer {
  from { background-position: -200% 0; }
  to   { background-position: 200% 0; }
}
/* Use: Skeleton screens, placeholder loading */
```

**Micro interactions** (component feedback)
```css
@keyframes buttonPress {
  to { transform: scale(0.98); }
}
/* Use: Button press feedback (50ms) */

@keyframes checkmark {
  0%   { transform: scale(0) rotate(-45deg); opacity: 0; }
  50%  { opacity: 1; }
  100% { transform: scale(1) rotate(0); opacity: 1; }
}
/* Use: Successful state indicator (200ms) */
```

#### Transition Classes (Tailwind)
- `transition-all duration-200`: General UI changes
- `transition-colors duration-300`: Color/background shifts
- `transition-transform duration-300`: Scale/translate movements
- `transition-opacity duration-200`: Fade effects

---

## 2. Component Library Strategy

### 2.1 Existing Component Audit

Current components in `/src/components/`:

#### Layout & Navigation
- **Navbar.tsx** (82 lines): Header with logo, search, actions, user menu. Status: ✅ Solid
- **MobileNav.tsx** (285 lines): Mobile drawer navigation. Status: ✅ Complete
- **NavSearchBar.tsx** (23 lines): Search input. Status: ✅ Minimal but functional
- **NavCategoryBar.tsx** (62 lines): Category filter bar below header. Status: ✅ Solid
- **AnnouncementBar.tsx** (58 lines): Top banner (promotions/info). Status: ✅ Solid
- **Footer.tsx** (145 lines): Footer with links, contact, newsletter signup. Status: ✅ Solid

#### Product Display
- **ProductCard.tsx** (85 lines): Product grid card with image, price, rating, add-to-cart. Status: ✅ Excellent
- **ProductsContent.tsx** (141 lines): Products page grid with filters/sorting. Status: ⚠️ Needs refactor (filtering logic)
- **ProductDetailContent.tsx** (453 lines): Product detail page. Status: ⚠️ Large component, needs extraction

#### Shopping Cart & Checkout
- **CartContent.tsx** (197 lines): Cart display and summary. Status: ⚠️ Needs extraction (pricing calc)
- **CartItemRow.tsx** (130 lines): Individual cart item row. Status: ✅ Solid
- **QuantitySelector.tsx** (110 lines): Quantity increment/decrement. Status: ✅ Solid
- **AddToCartButton.tsx** (69 lines): Add to cart action button. Status: ✅ Solid

#### User Interface
- **UserMenu.tsx** (105 lines): User profile dropdown menu. Status: ✅ Solid
- **WishlistButton.tsx** (49 lines): Heart icon toggle. Status: ✅ Minimal but functional
- **WishlistNavButton.tsx** (29 lines): Wishlist nav icon. Status: ✅ Minimal
- **SortSelect.tsx** (43 lines): Product sort dropdown. Status: ✅ Minimal
- **LanguageSwitcher.tsx** (33 lines): Language toggle. Status: ✅ Minimal
- **NavAuthButtons.tsx** (20 lines): Sign in/up nav buttons. Status: ✅ Minimal

#### Utilities
- **Providers.tsx** (9 lines): Context providers wrapper. Status: ✅ Clean
- **HomeContent.tsx** (550 lines): Homepage with hero, carousels, features. Status: ⚠️ Large component, carousel logic needs extraction

#### shadcn/ui Components
Current ui/ directory is minimal. Need to expand with:
- Button variations (primary, secondary, danger, ghost)
- Form components (Input, Select, Checkbox, Radio, Textarea)
- Feedback (Toast, Alert, Badge)
- Structure (Card, Tabs, Accordion)
- Data Display (Table, Pagination)
- Modals (Dialog, Popover, Sheet)

### 2.2 Component Refactoring & Creation Plan

#### High Priority Refactors

**ProductDetailContent.tsx (453 → 250 lines)**
Extract into:
- `ProductImageGallery.tsx` - Image carousel/gallery
- `ProductInfoPanel.tsx` - Title, price, rating, description
- `ProductOptionsSelector.tsx` - Size/color variants
- `ProductReviewsSection.tsx` - Reviews list and form

**HomeContent.tsx (550 → 300 lines)**
Extract into:
- `HeroSection.tsx` - Hero banner with CTA
- `ProductCarousel.tsx` - Rotating featured products
- `FeaturedProductGrid.tsx` - Static featured grid
- `FeaturesHighlight.tsx` - Feature cards (shipping, returns, etc.)

**ProductsContent.tsx (141 → 100 lines)**
Extract into:
- `FilterSidebar.tsx` - Category/price/rating filters
- `ProductGrid.tsx` - Grid layout container
- `SortAndViewToggle.tsx` - Sort dropdown + grid/list view toggle

**CartContent.tsx (197 → 120 lines)**
Extract into:
- `CartItemsList.tsx` - Items list container
- `CartSummary.tsx` - Price breakdown + checkout CTA
- `ShippingProgressBar.tsx` - Free shipping progress indicator

#### New Components to Create

**Form Components**
```
src/components/form/
  ├── FormField.tsx        (wrapper for field + label + error)
  ├── FormInput.tsx        (text input with validation styling)
  ├── FormSelect.tsx       (select dropdown)
  ├── FormCheckbox.tsx     (checkbox with label)
  ├── FormRadioGroup.tsx   (radio button group)
  └── FormTextarea.tsx     (multi-line text input)
```

**Feedback Components**
```
src/components/feedback/
  ├── Toast.tsx            (notification popup)
  ├── Alert.tsx            (inline alert box)
  ├── Badge.tsx            (pill-shaped label)
  ├── LoadingSpinner.tsx   (animated loader)
  └── SkeletonCard.tsx     (placeholder shimmer)
```

**Overlay Components**
```
src/components/overlay/
  ├── Modal.tsx            (centered dialog)
  ├── Drawer.tsx           (side sheet/panel)
  ├── Popover.tsx          (floating popover)
  └── Tooltip.tsx          (hover hint)
```

**Data Display**
```
src/components/data/
  ├── DataTable.tsx        (products, orders, users tables)
  ├── Pagination.tsx       (page numbers, prev/next)
  └── EmptyState.tsx       (empty data illustration + message)
```

**Feature Components**
```
src/components/features/
  ├── ImageUpload.tsx      (product/avatar image picker)
  ├── PriceFilter.tsx      (range slider for prices)
  ├── ReviewCard.tsx       (individual review display)
  ├── RatingInput.tsx      (5-star rating picker)
  └── SearchResults.tsx    (search results layout)
```

### 2.3 Component Composition Patterns

#### Pattern 1: Prop-based Variants (CVA)
```typescript
// Using class-variance-authority
import { cva } from 'class-variance-authority';

const buttonVariants = cva(
  'px-4 py-2 rounded-lg font-medium transition-all duration-200',
  {
    variants: {
      intent: {
        primary: 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95',
        secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
        danger: 'bg-red-600 text-white hover:bg-red-700',
        ghost: 'text-blue-600 hover:bg-blue-50',
      },
      size: {
        sm: 'text-sm px-3 py-1.5',
        md: 'text-base px-4 py-2',
        lg: 'text-lg px-6 py-3',
      },
    },
    defaultVariants: {
      intent: 'primary',
      size: 'md',
    },
  }
);

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  intent?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({ intent, size, ...props }: ButtonProps) {
  return <button className={buttonVariants({ intent, size })} {...props} />;
}
```

#### Pattern 2: Compound Components
```typescript
// Dialog with header/body/footer parts
export function Dialog({ children, ...props }: DialogProps) {
  return <div className="fixed inset-0 bg-black/50" {...props}>{children}</div>;
}

Dialog.Content = function DialogContent({ children }) {
  return <div className="bg-white rounded-xl shadow-xl p-6">{children}</div>;
};

Dialog.Header = function DialogHeader({ children }) {
  return <h2 className="text-2xl font-bold mb-4">{children}</h2>;
};

Dialog.Body = function DialogBody({ children }) {
  return <div className="my-4">{children}</div>;
};

Dialog.Footer = function DialogFooter({ children }) {
  return <div className="flex gap-2 justify-end mt-6">{children}</div>;
};

// Usage:
<Dialog>
  <Dialog.Content>
    <Dialog.Header>Confirm Action</Dialog.Header>
    <Dialog.Body>Are you sure?</Dialog.Body>
    <Dialog.Footer>
      <Button intent="ghost">Cancel</Button>
      <Button>Confirm</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog>
```

#### Pattern 3: Render Props / Controlled Components
```typescript
// For complex state management (filters, modals)
interface FilterProps {
  value: FilterState;
  onChange: (value: FilterState) => void;
  render: (state: { filters: FilterState; setFilter: (key, val) => void }) => React.ReactNode;
}

export function FilterContainer({ value, onChange, render }: FilterProps) {
  const setFilter = (key: string, val: any) => {
    onChange({ ...value, [key]: val });
  };

  return render({ filters: value, setFilter });
}

// Usage in ProductsContent
<FilterContainer
  value={filters}
  onChange={setFilters}
  render={({ filters, setFilter }) => (
    <div>
      <input onChange={(e) => setFilter('search', e.target.value)} />
      <select onChange={(e) => setFilter('category', e.target.value)}>
        {categories.map(c => <option key={c}>{c}</option>)}
      </select>
    </div>
  )}
/>
```

### 2.4 State Management Patterns

#### Context-based (Current)
- `LanguageContext.tsx`: Language/i18n
- `WishlistContext.tsx`: Wishlist items persistence
- `ToastContext.tsx`: Toast notifications

**Extend with:**
- `CartContext.tsx`: Cart state (optimize from multiple API calls)
- `AuthContext.tsx`: User session and permissions
- `ThemeContext.tsx`: Dark mode toggle

#### Server Actions (Preferred for mutations)
- Use Next.js Server Actions for: add-to-cart, remove-from-cart, checkout
- Benefit: Type-safe, automatic CSRF protection, no API routing needed

#### Query/Cache Strategy (Future optimization)
- Consider React Query or SWR for data fetching
- Cache strategy: products list (1 hour), user data (5 min), cart (immediate)

### 2.5 Loading, Error, and Empty States

Every component with async data must support three states:

#### Loading State: Skeleton Screens
```typescript
// SkeletonCard.tsx
export function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl p-4 animate-pulse">
      <div className="aspect-square bg-gray-200 rounded-lg mb-3"></div>
      <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
    </div>
  );
}

// ProductCard with skeleton fallback
export function ProductCardWithSuspense({ productId }: { productId: string }) {
  return (
    <Suspense fallback={<SkeletonCard />}>
      <ProductCard productId={productId} />
    </Suspense>
  );
}
```

#### Error State: Alert + Retry
```typescript
interface ErrorBoundaryProps {
  error: Error;
  reset: () => void;
}

export function ErrorFallback({ error, reset }: ErrorBoundaryProps) {
  return (
    <div className="p-6 bg-red-50 border border-red-200 rounded-xl text-center">
      <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
      <h3 className="font-bold text-red-900 mb-2">Something went wrong</h3>
      <p className="text-sm text-red-700 mb-4">{error.message}</p>
      <Button intent="danger" onClick={reset}>Try Again</Button>
    </div>
  );
}
```

#### Empty State: Illustration + CTA
```typescript
export function EmptyCart() {
  return (
    <div className="text-center py-16">
      <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
      <h3 className="text-lg font-bold text-gray-900 mb-2">Your cart is empty</h3>
      <p className="text-sm text-gray-500 mb-6 max-w-xs mx-auto">
        Explore our collection and find something you love
      </p>
      <Link href="/products" className={buttonVariants({ intent: 'primary' })}>
        Continue Shopping →
      </Link>
    </div>
  );
}
```

---

## 3. Page-by-Page UI Principles

### 3.1 Layout System

All pages follow this structure:
```
┌─────────────────────────────────┐
│       Announcement Bar          │
├─────────────────────────────────┤
│ Logo │ Search │ Cart │ Account │
│    Category Navigation          │
├─────────────────────────────────┤
│                                 │
│      Page Content               │
│      max-w-7xl container        │
│      px-4 sm:px-6 lg:px-8      │
│                                 │
├─────────────────────────────────┤
│          Footer                 │
└─────────────────────────────────┘
```

Responsive breakpoints:
```
Mobile (320px):  Single column, hamburger nav, stacked layout
Tablet (768px):  Two-column where applicable, full nav
Desktop (1024px): Full three-column, sidebar layouts
Large (1280px):  Four-column grids, expanded whitespace
```

### 3.2 Home Page Architecture

**Sections (in order):**

1. **Announcement Bar** (optional)
   - Background: Info or warning color
   - Content: Centered text + icon
   - Animation: Static, sticky top

2. **Hero Section**
   - Background: Gradient or image with overlay
   - Content: Badge → Title → Subtitle → CTA buttons
   - Layout: 60/40 text | image split (desktop), stacked (mobile)
   - Animations: Staggered text reveal, floating image
   - Height: 500-600px on desktop, 350-400px on mobile

3. **Product Carousel (Featured)**
   - 6 rotating featured products (auto-cycle every 4s)
   - Navigation: Dot indicators + prev/next arrows
   - Layout: Centered single product (desktop), mobile carousel
   - Interaction: Click dots to jump, hover to pause

4. **Featured Products Grid**
   - 8-12 best-selling products in 4-column grid (desktop), 2-column (mobile)
   - Card design: Image + title + price + rating + add-to-cart
   - Hover state: Lift shadow, scale image, show wishlist button
   - Animation: Staggered card pop on scroll reveal

5. **Feature Highlights**
   - 4 feature cards: shipping, returns, security, quality
   - Each card: icon + title + description
   - Layout: 4-column (desktop), 2-column (mobile)
   - Styling: Subtle background color, large icons

6. **Statistics Section** (optional)
   - Metrics: Total products, happy customers, orders shipped, support rating
   - Visual: Large numbers with icons, animated counters
   - Layout: 4-column grid

7. **Call-to-Action Section**
   - Background: Brand gradient
   - Text: "Don't miss out" messaging
   - CTA: Primary button (Sign Up / Shop Now)
   - Animation: Subtle pulse glow on button

8. **Footer**
   - Links: Categories, Company, Support
   - Contact: Address, phone, email
   - Newsletter: Email signup form
   - Legal: Privacy, Terms, Copyright

### 3.3 Products Page Architecture

**Layout: Sidebar + Main**

**Left Sidebar (Filters, 280px)**
- Category filter: Checkbox list (collapsible if >6 items)
- Price range: Dual-handle range slider ($0-$500)
- Rating: Star rating checkbox group
- Availability: In stock / Out of stock toggle
- Clear filters: Link to reset all
- Mobile: Bottom sheet drawer instead of sidebar

**Main Content Area**

Header (sticky):
- Product count: "Showing 48 products"
- Sort dropdown: Newest, Best sellers, Price (asc/desc), Top rated
- View toggle: Grid (3/4 col) vs List view
- Search clear: If search term active

Content:
- Grid: 3 columns (desktop), 2 (tablet), 1 (mobile)
- Cards: ProductCard component with hover effects
- Spacing: 20px gap, 24px vertical margin

Footer:
- Pagination: Page numbers (1-10), Prev/Next buttons
- Alternative: Infinite scroll with loading indicator
- Row selector: "Show 12 / 24 / 48 per page"

### 3.4 Product Detail Page Architecture

**Layout: Image Gallery (50%) | Info Panel (50%)**

**Left: Image Gallery**
- Main image: Large, center, 1:1 aspect ratio
- Thumbnail strip: 4-5 small images below (mobile: horizontal scroll)
- Interactions:
  - Click thumbnail to swap main image
  - Hover to zoom (magnifying glass icon)
  - Arrow keys to navigate
- Zoom modal: Full-screen magnified view on image click

**Right: Product Info Panel**

Header:
- Breadcrumb: Home > Category > Product name
- Rating: 5-star display + review count link
- Title: Large, bold, 2-3 lines max

Details:
- Price: Large, bold (strikethrough if on sale)
- Stock status: In stock / Low stock (N left) / Out of stock
- Description: 2-3 sentences, expandable
- SKU: Small text if applicable

Variants:
- Size selector: Buttons or dropdown (grayed if unavailable)
- Color selector: Color swatches (show color name on hover)
- Help text: "Available in: 3 sizes, 5 colors"

Actions:
- Quantity selector: - | N | + buttons (disable if stock < 1)
- Add to cart: Primary button, full width
- Add to wishlist: Heart icon, secondary button

Trust Signals:
- Free shipping badge
- Return policy: "30-day returns"
- Secure checkout icon

**Below: Additional Content (Tabs or Sections)**

Tabs: Description | Reviews | Shipping | Returns

Details tab:
- Full description with bullets
- Specifications table (if applicable)
- Material/dimensions info

Reviews tab:
- Review list: Avatar + name + rating + date + comment
- Review form: "Write a review" collapsed form
- Filter: Show all / with photos / verified purchases
- Sorting: Helpful / Recent / High to low rating

Related Products:
- 4-6 related products carousel below
- Title: "Customers also viewed" or "Similar products"
- Same card design as home page

### 3.5 Cart Page Architecture

**Layout: Items (65%) | Summary (35%)**

**Left: Cart Items**

Empty state (if no items):
- Illustration (package icon)
- Message: "Your cart is empty"
- CTA: "Continue Shopping" button
- Suggestions: "Explore our bestsellers"

Item rows (if items):
- Each row: Image (80px) | Details | Quantity | Price
  - Image: Clickable to product detail
  - Details: Product name, size/color variant, category tag
  - Quantity: - | N | + with stock check
  - Price: Unit price × quantity
  - Remove: X icon or "Remove" link
- Divider between rows
- Hover: Subtle background highlight

Free shipping progress:
- Progress bar: "Add $XX more for free shipping"
- Show % completed
- Hidden if already qualified

**Right: Summary Card**

Pricing breakdown:
- Subtotal: $XXX.XX
- Shipping: FREE or $X.XX
- Tax: Estimated (if applicable)
- **Total: Large, bold, $XXX.XX**

Coupon code (optional):
- Input field: "Enter coupon code"
- Apply button

CTA buttons:
- Primary: "Proceed to Checkout" (full width)
- Secondary: "Continue Shopping" (full width)

Trust badges:
- Secure checkout icon
- Money-back guarantee
- Live support chat link

**Mobile: Stacked layout**
- Items list takes full width
- Summary card below items
- Sticky summary footer at bottom with "Checkout" button

### 3.6 Checkout Page Architecture

**Multi-step form layout:**

Progress indicator:
- Step 1: Shipping (filled)
- Step 2: Payment (current or disabled)
- Step 3: Review (current or disabled)
- Step 4: Confirmation (current or disabled)

**Step 1: Shipping Information**
Fields:
- Full name (required)
- Email (required)
- Phone (required)
- Address (required)
- City (required)
- State/Province (required)
- ZIP/Postal code (required)
- Country (required, with flag icon)

Validation:
- Real-time feedback on blur
- Error message below each field
- Disable "Next" button until valid

Address book (if logged in):
- "Use saved address" radio buttons
- "Add new address" checkbox to reveal form

Shipping method:
- Standard (5-7 days, FREE)
- Express (2-3 days, $19.99)
- Overnight (1 day, $49.99)
- Radio buttons with icons, show estimated delivery date

**Step 2: Payment Method**
Payment options:
- Credit card (Visa/MC/Amex icons)
- PayPal button
- Apple Pay / Google Pay buttons
- Additional methods as needed

Credit card form:
- Card number (formatted input)
- Expiry (MM/YY)
- CVV (3-4 digits)
- Cardholder name
- Billing address same as shipping checkbox

Save card (if logged in):
- "Save this card for future purchases" checkbox

**Step 3: Order Review**
Summary:
- Items table: Product | Qty | Price | Subtotal
- Shipping method + cost
- Tax (if applicable)
- Total (large, bold)

Links to edit:
- "Edit shipping" → back to step 1
- "Edit payment" → back to step 2

Final CTA:
- "Place Order" button (large, primary)
- "Back" button (secondary)

Security message:
- "Your payment is secure and encrypted"
- SSL badge

**Step 4: Confirmation** (shown after success)
Confirmation card:
- Checkmark icon (animated)
- "Order Confirmed" heading
- Order number: Easy to copy
- Email confirmation message
- Expected delivery date

Next steps:
- Track order link / button
- Continue shopping link
- Customer service link

### 3.7 Orders & Order History Page

**Layout: Order List (main) or Order Detail (sub-page)**

Order list:
- Table or card view toggle
- Columns: Order ID | Date | Status | Total | Actions
- Status badges: Pending (orange), Processing (blue), Shipped (blue), Delivered (green), Cancelled (gray)
- Sorting: Recent first (default), oldest first
- Pagination: 10/25/50 per page

Filters:
- Date range picker
- Status filter: All / Pending / Shipped / Delivered
- Search by order ID

Order detail modal/page:
- Order ID + Date + Status
- Items table: Product | Qty | Price
- Shipping address
- Tracking number (clickable link if available)
- Timeline: Order placed → Processing → Shipped → Delivered (with dates)
- CTA: Track shipment / Return item / Contact support

### 3.8 User Profile Page

**Tabs or sidebar navigation:**

- Account Settings
- Addresses
- Payment Methods
- Orders (links to order history)
- Wishlist
- Notifications
- Privacy & Security
- Logout

**Account Settings tab:**
- Profile picture upload (circular, 120px)
- Name input
- Email display (read-only if email login)
- Phone number
- Bio / About me (optional)
- Save button

**Addresses tab:**
- Address cards: Default indicator | Full address | Edit | Delete buttons
- Add new address button
- Empty state if none: "No saved addresses. Add one for faster checkout."

**Payment Methods tab:**
- Card preview: Last 4 digits + brand logo + expiry
- Set as default radio
- Remove button
- Add new card button

**Notifications tab:**
- Email preferences: Order updates, promotions, newsletters (toggles)
- Frequency: Real-time, daily digest, weekly digest

### 3.9 Admin Pages

**Dashboard Overview:**
- KPIs: Total revenue, orders today, active users, conversion rate (large cards with icons)
- Charts: Revenue trend (line), category breakdown (pie), top products (bar)
- Recent orders table (5-10 rows)

**Product Management:**
- Product table: Name | Category | Price | Stock | Rating | Actions
- Edit / Delete buttons
- Add product button
- Bulk actions: Select multiple → bulk delete / categorize
- Search / filter by category / price range / stock status

**User Management:**
- User table: Name | Email | Role | Join date | Actions
- Edit / Ban buttons
- Change role dropdown
- Search / filter by role

**Order Management:**
- Order table: ID | Customer | Date | Total | Status | Actions
- Filter by status
- Update status dropdown
- View details modal
- Refund button

**Styling:** Minimal, data-focused, high contrast for readability
- Use tables for data, not cards
- Density options: Compact / Comfortable / Spacious
- Dark mode suitable

### 3.10 Authentication Pages (Sign In / Sign Up)

**Sign In Page Layout:**

- Card layout, centered, max-width 420px
- Header: Logo + "Welcome back"
- Form:
  - Email input (with validation)
  - Password input (with show/hide toggle)
  - Remember me checkbox (optional)
  - Sign in button (full width, primary)
- Social login:
  - "Or sign in with:" divider
  - Google / GitHub / Apple buttons (icon buttons, social colors)
- Footer: "Don't have an account? Sign up" link

**Sign Up Page Layout:**

- Same card design as sign in
- Header: Logo + "Create account"
- Form:
  - Full name input
  - Email input
  - Password input (show strength indicator)
  - Confirm password input
  - Agree to terms checkbox (required)
  - Sign up button (full width, primary)
- Footer: "Already have an account? Sign in" link

**Error states:**
- Invalid email: "Please enter a valid email"
- Password mismatch: "Passwords don't match"
- Account exists: "This email is already registered"
- Server error: "Something went wrong. Please try again."

**Success state (sign up):**
- Confirmation message
- Email verification prompt (if applicable)
- Redirect to home or sign in after 3 seconds

### 3.11 Secondary Pages (Wishlist, FAQ, Contact)

**Wishlist Page:**
- Similar to products page but showing only saved items
- Empty state with icon
- Option to share wishlist (copy link)
- Remove from wishlist button on each card

**FAQ Page:**
- Accordion layout, each question expandable
- Search input to filter FAQs
- Categories sidebar: General / Orders / Shipping / Returns
- Contact support link at bottom

**Contact Page:**
- Contact form: Name | Email | Subject | Message
- Success toast after submission
- Contact info card: Phone, email, address
- Hours of operation
- Social links (if applicable)

---

## 4. Micro-interactions and UX Enhancements

### 4.1 Form Interactions

**Input focus state:**
```css
/* Base Tailwind: focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 */
input:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1), 0 0 0 6px rgba(59, 130, 246, 0.25);
  border-color: #2563eb;
}
```

**Real-time validation feedback:**
```typescript
export function FormInput({ 
  value, 
  error, 
  valid,
  onChange 
}: FormInputProps) {
  return (
    <div>
      <input
        value={value}
        onChange={onChange}
        className={`border rounded-lg px-4 py-2 ${
          error ? 'border-red-500 bg-red-50' : 
          valid ? 'border-green-500 bg-green-50' : 
          'border-gray-200'
        }`}
      />
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
      {valid && <p className="text-xs text-green-600 mt-1">✓ Looks good</p>}
    </div>
  );
}
```

**Field-level validation (on blur):**
- Email: Regex + DNS check (optional, server-side)
- Password: Min 8 chars, numbers, uppercase (show requirements as checklist)
- Phone: Country-specific format validation
- Postal code: Regex for country format

### 4.2 Loading States with Skeleton Screens

**Product card skeleton:**
```typescript
export function SkeletonProductCard() {
  return (
    <div className="bg-white rounded-2xl p-4 border border-gray-100">
      {/* Image skeleton */}
      <div className="w-full aspect-square bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-lg mb-3 animate-shimmer"></div>
      
      {/* Category badge skeleton */}
      <div className="h-3 w-12 bg-gray-200 rounded-full mb-2 animate-pulse"></div>
      
      {/* Title skeleton */}
      <div className="h-4 bg-gray-200 rounded mb-2 w-3/4 animate-pulse"></div>
      <div className="h-3 bg-gray-200 rounded mb-3 w-1/2 animate-pulse"></div>
      
      {/* Price skeleton */}
      <div className="h-5 bg-gray-200 rounded w-1/3 animate-pulse"></div>
    </div>
  );
}
```

**Page-level skeleton:**
- Match exact layout of loaded state
- Use grid layout with skeleton cards
- Fade out after 3-5 seconds max, show error state

**Progressive loading:**
- Load headers/navigation first (critical content)
- Then hero/banner
- Then product grids
- Then footer

### 4.3 Empty States

**Zero data empty states:**
- Icon (sad face, empty box, magnifying glass)
- Heading: "No products found"
- Description: "Try adjusting your filters or search terms"
- CTA: Button to clear filters or go back

**Illustration style:** 
- Consistent icon pack (Lucide React)
- Muted colors (gray-300 or category-specific soft color)
- Size: 64-80px

### 4.4 Success / Error Notifications

**Toast notifications:**
```typescript
export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const add = (message: string, type: 'success' | 'error' | 'info' = 'info', duration = 4000) => {
    const id = Date.now();
    const toast = { id, message, type };
    setToasts(prev => [...prev, toast]);
    
    if (duration) {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, duration);
    }
    
    return id;
  };

  return { add, toasts };
}

// Toast component
export function Toast({ message, type }: ToastProps) {
  const config = {
    success: { bg: 'bg-emerald-50 border-emerald-200', icon: '✓', color: 'text-emerald-700' },
    error: { bg: 'bg-red-50 border-red-200', icon: '✕', color: 'text-red-700' },
    info: { bg: 'bg-blue-50 border-blue-200', icon: 'ℹ', color: 'text-blue-700' },
  };
  
  const { bg, icon, color } = config[type];
  
  return (
    <div className={`${bg} border ${color} rounded-lg p-4 flex gap-3`}>
      <span className="font-bold">{icon}</span>
      <p>{message}</p>
    </div>
  );
}
```

**Position:** Bottom-right corner (stacked vertically)
**Animation:** Slide in from right, fade out
**Action:** Auto-dismiss after 4-5s or manual close button

### 4.5 Page Transitions

**Smooth page enter:**
```css
main {
  animation: fadeUp 0.25s ease-out both;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

**Category/filter change:**
- Fade out current grid (100ms)
- Scroll to top
- Load new content with skeleton
- Fade in new content (200ms)

**Carousel transitions:**
- Slide out (left/right): 300ms with scale
- Fade in new slide: 200ms after previous fully out

### 4.6 Hover and Active States

**Button states:**
```css
/* Default */
.btn { transition: all 0.2s ease; }

/* Hover: lift + shadow */
.btn:hover { 
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0,0,0,0.1);
}

/* Active: press down */
.btn:active { 
  transform: scale(0.98);
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

/* Focus (keyboard): ring */
.btn:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px rgba(59,130,246,0.1), 0 0 0 6px rgba(59,130,246,0.25);
}
```

**Product card hover:**
- Image scales 110% over 300ms
- Card shadow lifts (shadow-lg)
- Wishlist button appears (opacity 0 → 1)
- Slight upward translate (-2px)

**Link hover:**
- Color change to brand blue
- Optional underline (if not already)
- No scale transformation (preserve alignment)

---

## 5. Accessibility Considerations (WCAG 2.1 AA)

### 5.1 Semantic HTML Usage

**Correct structure:**
```typescript
// ✓ Semantic
<header>...</header>
<nav>...</nav>
<main role="main">
  <section>
    <article>...</article>
  </section>
</main>
<footer>...</footer>

// ✓ Not <div> soup
// Use <button> for buttons, not <div onClick={}>
// Use <form> and <input> for forms, not custom inputs without labels
```

**Heading hierarchy:**
```typescript
// ✓ Correct
<h1>Home</h1>      {/* Page title, once per page */}
<h2>Featured Products</h2>
<h3>Product Details</h3>

// ✗ Never skip levels
// Never: <h1> then <h3>
// Always: h1 → h2 → h3 → h4
```

### 5.2 ARIA Labels and Descriptions

**Icons without text:**
```typescript
// ✓ Icon button
<button aria-label="Add to wishlist" className="...">
  <Heart className="w-5 h-5" />
</button>

// ✓ Icon with tooltip/title
<ShoppingCart title="View cart" aria-label="Shopping cart" />

// ✗ Never orphaned icon
// <Heart /> without label
```

**Form labels:**
```typescript
// ✓ Associated label
<label htmlFor="email">Email address</label>
<input id="email" type="email" />

// ✓ If label text not visible, use aria-label
<input aria-label="Search products" type="search" placeholder="Search..." />

// ✗ Never: <input type="email" /> alone
```

**Complex regions:**
```typescript
// ✓ Landmark regions for screen readers
<nav aria-label="Main navigation">...</nav>
<aside aria-label="Product filters">...</aside>
<main role="main">...</main>

// ✓ Announce dynamic changes
<div role="status" aria-live="polite" aria-atomic="true">
  {loadingMessage}
</div>
```

### 5.3 Keyboard Navigation Support

**Tab order:**
```typescript
// ✓ Natural tab order (source order)
// Don't rearrange with CSS, use source HTML order

// ✓ Skip links for keyboard users
<a href="#main" className="sr-only focus:not-sr-only">Skip to content</a>

// ✓ Trap focus in modals
// When modal opens, move focus to modal
// When closed, return focus to trigger
<Dialog onOpenChange={(open) => {
  if (open) dialogRef.current?.focus();
}}>
```

**Keyboard shortcuts:**
```typescript
// ✓ Provide keyboard shortcuts info
// Escape: Close modal
// Arrow keys: Navigate carousel

// ✗ Don't use single letters that conflict with browser shortcuts
// (Ctrl+S, Ctrl+A, etc.)
```

**Focus indicators:**
```css
/* Visible focus ring for all interactive elements */
*:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

/* Never: outline: none; without replacement */
```

### 5.4 Color Contrast Requirements

**Text contrast (WCAG AA):**
- Normal text: 4.5:1 ratio (black on white: ✓)
- Large text (18pt+): 3:1 ratio
- Graphics/UI components: 3:1 ratio

**Testing:**
- Use WebAIM Contrast Checker tool
- Verify all text colors in both light and dark modes
- Check colored badges/links (must pass without relying on color alone)

**Examples (pass WCAG AA):**
```
✓ #000000 on #FFFFFF (21:1 - excellent)
✓ #2563eb on #FFFFFF (4.5:1 - exact minimum)
✓ #64748b on #F8FAFC (7.4:1 - good)

✗ #8B8B8B on #FFFFFF (5.4:1 - fails)
✗ #6366f1 on #ffffff (6.3:1 - but too purple)
```

### 5.5 Alternative Text for Images

**Product images:**
```typescript
// ✓ Descriptive
<img 
  src="product.jpg" 
  alt="Blue cotton T-shirt, size M, fits true to size"
/>

// ✓ For icons/decorative
<img src="icon.svg" alt="" role="presentation" />

// ✗ Avoid generic
// alt="Image" or alt="Photo"

// ✗ Never include "Image of" or "Picture of"
```

### 5.6 Motion and Animation

**Respect prefers-reduced-motion:**
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Or per-component */
@media (prefers-reduced-motion: reduce) {
  .fadeUp {
    animation: none;
    opacity: 1;
    transform: none;
  }
}
```

**Autoplay:**
- Don't auto-play video/audio
- If necessary, provide clear pause button
- Carousels: Auto-cycle OK if play/pause controls available

### 5.7 Mobile Accessibility

**Touch targets (minimum 44×44px):**
```css
/* Button minimum size */
button {
  min-width: 44px;
  min-height: 44px;
  padding: 12px 16px; /* Ensures 44px minimum */
}

/* Icon button */
button[aria-label] {
  min-width: 44px;
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

**Font size (minimum 16px):**
```css
/* Prevents zoom on focus in iOS Safari */
input, select, textarea {
  font-size: 16px;
}
```

**Zoom support:**
- Don't set `user-select: none` on actionable elements
- Allow 200% zoom without horizontal scrolling
- Test at 200% zoom level

---

## 6. Responsive Design Breakpoints and Strategies

### 6.1 Breakpoint System

```
Mobile-first approach: Style for mobile, then add media queries for larger screens

Breakpoints (Tailwind standard):
  sm:  640px   (small phones landscape)
  md:  768px   (tablets)
  lg:  1024px  (small desktops)
  xl:  1280px  (desktops)
  2xl: 1536px  (large monitors)
  
Custom: 480px for "mobile" (vs small phone)
```

### 6.2 Layout Strategies

**Grid columns (responsive):**
```typescript
// Mobile-first pattern
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
  {items.map(item => <Item key={item.id} {...item} />)}
</div>

// Mobile: 1 column
// Tablet: 2 columns
// Desktop: 3-4 columns
```

**Container sizing:**
```typescript
// Max-width container
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  {/* 
    Content area takes 100% up to 80rem (1280px)
    With responsive side padding
    Mobile: px-4 (16px each side, 32px total)
    Tablet: px-6 (24px each side, 48px total)
    Desktop: px-8 (32px each side, 64px total)
  */}
</div>
```

**Sidebar collapse:**
```typescript
// On small screens: Drawer/bottom sheet
// On large screens: Sticky sidebar

<div className="flex gap-6">
  {/* Mobile drawer, desktop sidebar */}
  <aside className="hidden lg:block w-64 sticky top-16">
    {/* Filters sidebar */}
  </aside>
  
  <main className="flex-1">
    {/* Mobile drawer trigger */}
    <button className="lg:hidden">Open filters</button>
    {/* Main content */}
  </main>
</div>
```

### 6.3 Typography Scaling

```typescript
// Responsive headings
<h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold">
  Responsive Title
</h1>

// Responsive body text
<p className="text-sm md:text-base lg:text-lg">
  Body text scales with viewport
</p>
```

### 6.4 Image Responsiveness

```typescript
// Next.js Image component (optimized)
import Image from 'next/image';

<Image
  src="/product.jpg"
  alt="Product"
  width={800}
  height={800}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  className="w-full h-auto rounded-lg"
/>

// For CSS background images
<div 
  className="bg-cover bg-center w-full h-96 md:h-full"
  style={{
    backgroundImage: 'url(/hero-mobile.jpg)',
    backgroundImage: 'image-set(url(/hero-mobile.jpg) 1x, url(/hero-mobile-2x.jpg) 2x)'
  }}
/>
```

### 6.5 Spacing Responsiveness

```typescript
// Responsive padding
<section className="px-4 sm:px-6 lg:px-8 py-6 md:py-12 lg:py-20">
  {/* 
    Mobile: px-4 py-6
    Tablet: sm:px-6 md:py-12
    Desktop: lg:px-8 lg:py-20
  */}
</section>

// Responsive gap
<div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
  {/* Tighter grid on mobile, roomier on desktop */}
</div>
```

### 6.6 Touch-Friendly Design

**Mobile-specific patterns:**
```typescript
// Larger touch targets on mobile
<button className="px-4 py-2 md:px-3 md:py-1.5">
  {/* 44×44px on mobile, smaller on desktop */}
</button>

// Bottom action bar on mobile (within thumb reach)
<div className="fixed md:static bottom-0 left-0 right-0 bg-white border-t">
  <button className="w-full py-4">{/* Full width checkout button */}</button>
</div>

// Horizontal scroll carousel on mobile
<div className="overflow-x-auto md:grid">
  {/* Swipeable on mobile, grid on desktop */}
</div>
```

### 6.7 Print Styles

```css
@media print {
  header, footer, nav {
    display: none;
  }
  
  body {
    background: white;
    color: black;
  }
  
  a {
    color: inherit;
    text-decoration: none;
  }
  
  a[href]:after {
    content: " (" attr(href) ")";
  }
  
  .no-print {
    display: none;
  }
}
```

---

## 7. Implementation Guidelines

### 7.1 File Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── AnnouncementBar.tsx
│   ├── product/
│   │   ├── ProductCard.tsx
│   │   ├── ProductGrid.tsx
│   │   ├── ProductImageGallery.tsx
│   │   └── ProductDetailPanel.tsx
│   ├── cart/
│   │   ├── CartItemRow.tsx
│   │   ├── CartSummary.tsx
│   │   └── AddToCartButton.tsx
│   ├── form/
│   │   ├── FormField.tsx
│   │   ├── FormInput.tsx
│   │   └── FormSelect.tsx
│   ├── feedback/
│   │   ├── Toast.tsx
│   │   ├── Alert.tsx
│   │   ├── LoadingSpinner.tsx
│   │   └── SkeletonCard.tsx
│   ├── overlay/
│   │   ├── Modal.tsx
│   │   ├── Drawer.tsx
│   │   └── Popover.tsx
│   ├── ui/
│   │   └── [shadcn components]
│   └── Providers.tsx
├── app/
│   ├── layout.tsx
│   ├── page.tsx (home)
│   ├── products/
│   │   ├── page.tsx
│   │   └── [id]/page.tsx
│   ├── cart/page.tsx
│   ├── checkout/page.tsx
│   ├── profile/page.tsx
│   ├── orders/page.tsx
│   ├── signin/page.tsx
│   ├── signup/page.tsx
│   ├── admin/
│   │   ├── page.tsx (dashboard)
│   │   ├── products/page.tsx
│   │   ├── users/page.tsx
│   │   └── orders/page.tsx
│   └── globals.css
├── context/
│   ├── AuthContext.tsx (new)
│   ├── CartContext.tsx (new)
│   ├── ToastContext.tsx (existing)
│   ├── WishlistContext.tsx (existing)
│   └── LanguageContext.tsx (existing)
├── lib/
│   ├── utils.ts
│   ├── cn.ts (classname merger)
│   ├── prisma.ts
│   ├── session.ts
│   ├── categories.ts
│   └── validation.ts (new - form validators)
├── actions/
│   ├── cart.ts
│   ├── products.ts
│   ├── checkout.ts (new)
│   ├── auth.ts (new)
│   └── admin.ts (new)
└── styles/
    └── globals.css (existing)
```

### 7.2 Component API Conventions

```typescript
// All props interfaces end with Props
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
}

// Use children for React elements, not content
export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("rounded-lg shadow-md", className)}>{children}</div>;
}

// Use render functions or compound components for complex layouts
export function Dialog({ children }: DialogProps) {
  return <div role="dialog">{children}</div>;
}
Dialog.Header = ({ children }) => <h2>{children}</h2>;
Dialog.Body = ({ children }) => <div>{children}</div>;

// Events follow React naming: on[Event]
export function Input({ onChange, onFocus, onBlur, ...props }) {
  return <input onChange={onChange} onFocus={onFocus} onBlur={onBlur} {...props} />;
}
```

### 7.3 CSS-in-JS Pattern (with Tailwind)

```typescript
// Prefer Tailwind utilities over CSS-in-JS
// When custom styling needed, use globals.css or Tailwind @layer

import { cva } from 'class-variance-authority';

const buttonVariants = cva(
  'px-4 py-2 rounded-lg font-medium transition-all duration-200',
  {
    variants: {
      variant: {
        primary: 'bg-blue-600 text-white hover:bg-blue-700',
        secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
      },
      size: {
        sm: 'text-sm px-3 py-1',
        md: 'text-base px-4 py-2',
        lg: 'text-lg px-6 py-3',
      },
    },
  }
);

export function Button({ variant = 'primary', size = 'md', ...props }) {
  return <button className={buttonVariants({ variant, size })} {...props} />;
}
```

### 7.4 Performance Optimizations

**Image optimization:**
- Use Next.js `<Image>` component (auto-optimization, responsive sizes)
- Lazy load images outside viewport
- Compress product images to <50KB each

**Code splitting:**
- Dynamic imports for modals/heavy components
- `React.lazy()` for route-based splitting
- Load admin dashboard only for admin role

**Memoization:**
- `useMemo` for expensive calculations (product filters, pricing)
- `useCallback` for event handlers passed to children
- `React.memo` for pure presentational components

**Caching strategy:**
- Products list: Cache 1 hour (ISR or SWR)
- User data: Cache 5 minutes
- Cart: No caching (always fresh)
- Categories: Cache 24 hours (rarely changes)

### 7.5 Testing Strategy

**Unit tests:** Component rendering, prop variations, event handling
```typescript
// Button.test.tsx
describe('Button', () => {
  it('renders with primary variant', () => {
    render(<Button variant="primary">Click me</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-blue-600');
  });
  
  it('handles click events', () => {
    const onClick = jest.fn();
    render(<Button onClick={onClick}>Click</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalled();
  });
});
```

**Integration tests:** Component interaction, data flow
```typescript
// ProductCard.test.tsx
describe('ProductCard', () => {
  it('adds product to cart when button clicked', async () => {
    const { getByText } = render(<ProductCard product={mockProduct} />);
    fireEvent.click(getByText('Add to cart'));
    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith('Added to cart');
    });
  });
});
```

**E2E tests:** User workflows (checkout, filtering, authentication)
```
// e2e/checkout.spec.ts
test('complete checkout flow', async ({ page }) => {
  await page.goto('/products');
  await page.click('button:has-text("Add to cart")');
  await page.goto('/cart');
  await page.click('button:has-text("Checkout")');
  // Continue through checkout steps
});
```

---

## 8. Design System Maintenance

### 8.1 Updates and Versioning

- Version design tokens (colors, spacing, shadows)
- Changelog: Track breaking changes, deprecations, additions
- Deprecation period: 2 releases before removing old variants

### 8.2 Component Review Checklist

Before merging any component:
- [ ] Semantic HTML (no div soup)
- [ ] WCAG AA compliant (contrast, keyboard, labels)
- [ ] Responsive (mobile/tablet/desktop tested)
- [ ] Accessibility labels (aria-label, role)
- [ ] Error state design
- [ ] Loading state design
- [ ] Prop types documented
- [ ] Story/example in Storybook (if available)
- [ ] Unit tests (>80% coverage)
- [ ] Performance audited (Lighthouse)

### 8.3 Accessibility Audit Checklist

- [ ] Color contrast ≥4.5:1 for text
- [ ] Focus visible on all interactive elements
- [ ] Keyboard navigation working (Tab, Enter, Escape)
- [ ] Screen reader friendly (semantic HTML, aria labels)
- [ ] Touch targets ≥44×44px on mobile
- [ ] Font size ≥16px on inputs (prevents iOS zoom)
- [ ] Respects prefers-reduced-motion
- [ ] No auto-playing media
- [ ] Form labels associated with inputs
- [ ] Images have alt text

---

## Appendix: Code Examples

### A.1 Complete ProductCard Component with Accessibility

```typescript
'use client';

import { Product } from '@prisma/client';
import Link from 'next/link';
import Image from 'next/image';
import AddToCartButton from './AddToCartButton';
import WishlistButton from './WishlistButton';
import { Star } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { cva } from 'class-variance-authority';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

const badgeVariants = cva('text-[10px] font-bold px-2 py-0.5 rounded-full', {
  variants: {
    type: {
      warning: 'bg-amber-500 text-white',
      danger: 'bg-red-500 text-white',
    },
  },
});

function StarRating({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-3 h-3 ${
              star <= Math.round(rating)
                ? 'fill-amber-400 text-amber-400'
                : 'fill-gray-200 text-gray-200'
            }`}
            aria-hidden="true"
          />
        ))}
      </div>
      <span 
        className="text-xs text-gray-500 font-medium"
        aria-label={`Rating: ${rating} out of 5 stars`}
      >
        {rating.toFixed(1)}
      </span>
      {count && (
        <span className="text-xs text-gray-400">({count})</span>
      )}
    </div>
  );
}

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  const { t } = useLanguage();
  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 10;

  return (
    <article 
      className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col group"
      aria-label={`${product.name} product card`}
    >
      {/* Image Container */}
      <div className="relative aspect-square w-full bg-gray-50 overflow-hidden">
        <Link 
          href={`/products/${product.id}`}
          className="block w-full h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-t-2xl"
          aria-label={`View details for ${product.name}`}
        >
          <Image
            src={product.image}
            alt={product.name}
            width={400}
            height={400}
            priority={priority}
            className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500 ease-out"
            loading={priority ? 'eager' : 'lazy'}
          />
        </Link>

        {/* Gradient Overlay */}
        <div 
          className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          aria-hidden="true"
        />

        {/* Stock Badge */}
        {isOutOfStock ? (
          <div 
            className={badgeVariants({ type: 'danger' })}
            role="status"
            aria-label="Out of stock"
          >
            {t('product.outOfStock')}
          </div>
        ) : isLowStock ? (
          <div 
            className={badgeVariants({ type: 'warning' })}
            role="status"
            aria-label={`Only ${product.stock} left in stock`}
          >
            {t('product.only')} {product.stock} {t('product.leftInStock')}
          </div>
        ) : null}

        {/* Wishlist Button */}
        <div className="absolute top-2.5 right-2.5 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <WishlistButton
            product={{
              id: product.id,
              name: product.name,
              price: product.price,
              image: product.image,
              category: product.category,
              rating: product.rating,
              stock: product.stock,
            }}
            size="sm"
          />
        </div>
      </div>

      {/* Details Section */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Category & Rating Row */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <span 
            className="text-[10px] font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded-full"
            aria-label={`Category: ${product.category}`}
          >
            {t(`category.${product.category.toLowerCase()}`) || product.category}
          </span>
          <StarRating rating={product.rating} count={0} />
        </div>

        {/* Product Name */}
        <Link href={`/products/${product.id}`}>
          <h3 className="text-sm font-bold text-gray-900 mb-1.5 hover:text-blue-600 transition-colors line-clamp-2 leading-snug focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded">
            {product.name}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-xs text-gray-400 line-clamp-2 mb-3 flex-grow leading-relaxed">
          {product.description}
        </p>

        {/* Price & Cart */}
        <div className="mt-auto pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider">
                {t('product.price')}
              </p>
              <p 
                className="text-lg font-extrabold text-gray-900 leading-none"
                aria-label={`Price: $${product.price.toFixed(2)}`}
              >
                ${product.price.toFixed(2)}
              </p>
            </div>
            <AddToCartButton
              productId={product.id}
              productName={product.name}
              disabled={isOutOfStock}
              className="text-xs px-3 py-1.5 rounded-lg"
              aria-disabled={isOutOfStock}
            />
          </div>
        </div>
      </div>
    </article>
  );
}
```

### A.2 Form Field Component with Validation

```typescript
'use client';

import React, { useState, useCallback } from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  value: string;
  error?: string;
  helperText?: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  validator?: (value: string) => string | undefined;
}

export function FormField({
  label,
  name,
  type = 'text',
  required = false,
  disabled = false,
  placeholder,
  value,
  error,
  helperText,
  onChange,
  onBlur,
  validator,
}: FormFieldProps) {
  const [touched, setTouched] = useState(false);
  const [valid, setValid] = useState(false);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      onChange(newValue);

      // Real-time validation
      if (validator && touched) {
        const validationError = validator(newValue);
        setValid(!validationError);
      }
    },
    [onChange, validator, touched]
  );

  const handleBlur = useCallback(() => {
    setTouched(true);
    if (validator) {
      const validationError = validator(value);
      setValid(!validationError);
    }
    onBlur?.();
  }, [value, validator, onBlur]);

  const hasError = error || (touched && validator && validator(value));
  const isValid = touched && valid && !error;

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={name}
        className="text-sm font-semibold text-gray-900"
      >
        {label}
        {required && <span className="text-red-600 ml-1">*</span>}
      </label>

      <div className="relative">
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={disabled}
          placeholder={placeholder}
          aria-label={label}
          aria-describedby={
            hasError ? `${name}-error` : helperText ? `${name}-helper` : undefined
          }
          aria-invalid={!!hasError}
          className={`
            w-full px-4 py-2.5 rounded-lg border transition-all duration-200
            font-medium text-gray-900 placeholder:text-gray-400
            focus:outline-none focus:ring-2 focus:ring-offset-2
            disabled:bg-gray-50 disabled:text-gray-500
            ${hasError
              ? 'border-red-500 bg-red-50 focus:ring-red-500 focus:border-red-500'
              : isValid
              ? 'border-green-500 bg-green-50 focus:ring-green-500 focus:border-green-500'
              : 'border-gray-200 bg-white focus:ring-blue-500 focus:border-blue-500'
            }
          `}
        />

        {/* Validation Icons */}
        {isValid && (
          <CheckCircle2
            className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-600 pointer-events-none"
            aria-hidden="true"
          />
        )}
        {hasError && (
          <AlertCircle
            className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-red-600 pointer-events-none"
            aria-hidden="true"
          />
        )}
      </div>

      {/* Error Message */}
      {hasError && (
        <p id={`${name}-error`} className="text-xs text-red-600 font-medium">
          {hasError}
        </p>
      )}

      {/* Helper Text */}
      {helperText && !hasError && (
        <p id={`${name}-helper`} className="text-xs text-gray-500">
          {helperText}
        </p>
      )}
    </div>
  );
}
```

---

## Final Summary

This design system establishes a comprehensive, production-ready foundation for the E-Shop e-commerce platform. It covers:

1. **Design Tokens**: OKLch color palette with semantic colors, modular spacing scale, typography hierarchy, shadow system, and animation library
2. **Component Architecture**: Refactoring plan for existing components, creation strategy for new components, composition patterns, and state management
3. **Page Layouts**: Detailed wireframes and interaction patterns for all 9 primary page types plus secondary pages
4. **Micro-interactions**: Form feedback, loading states, empty states, notifications, transitions, and hover effects
5. **Accessibility**: WCAG 2.1 AA compliance patterns including semantic HTML, ARIA labels, keyboard navigation, color contrast, and motion preferences
6. **Responsive Design**: Mobile-first breakpoints, layout strategies, typography scaling, and touch-friendly patterns

The system prioritizes semantic, accessible, high-performance UI with consistent visual language across all pages. All components follow clear composition patterns with type-safe APIs, and accessibility is baked into every component from inception rather than added later.

**Next steps for implementation:**
1. Create base component library (Button, Input, Card, Modal variations)
2. Extract large components (ProductDetailContent, HomeContent)
3. Build page templates using components
4. Comprehensive accessibility testing with screen readers
5. Performance optimization and Lighthouse audits
6. Document components in Storybook with accessibility checks

