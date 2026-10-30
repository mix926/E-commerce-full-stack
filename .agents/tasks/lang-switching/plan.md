# Implementation Plan: EN/KM Language Switching for Remaining Pages

## Investigation Findings

**Translation system** (`src/context/LanguageContext.tsx`):
- Exports `useLanguage()` → `{ lang, setLang, t }`. `t(key)` returns `translations[lang][key] ?? translations['en'][key] ?? key`, so a missing key falls back to English then to the literal key (safe).
- Translations live in two flat objects, `en` and `km`, keyed by dotted strings (e.g. `'cart.title'`). New keys are added inline to BOTH objects.
- `LanguageProvider` wraps the app in `src/components/Providers.tsx`; `LanguageSwitcher` (in Navbar) already toggles `lang` between `'en'` and `'km'`. No wiring work needed.

**Established server→client pattern** (already converted `cart/page.tsx` → `CartContent.tsx`, `products/page.tsx` → `ProductsContent.tsx`, `products/[id]/page.tsx` → `ProductDetailContent.tsx`):
- Server `page.tsx` is a thin async data fetcher: `getSession()` + `redirect()` guard, fetch via `prisma` or an `actions/*` function, then render `<XxxContent ...props />`.
- Client `XxxContent.tsx` has `'use client'`, imports `useLanguage`, destructures `{ t }`, defines its own plain `interface` types mirroring only the fields it uses, and replaces hardcoded English with `t('key')`.
- `ProductDetailContent.tsx` types `createdAt: Date` and formats with `new Date(review.createdAt).toLocaleDateString(...)`. The Prisma object is passed directly and Next.js serializes Dates across the RSC boundary.

**Decision on Date serialization (deviates from ProductDetailContent, per task spec):** The task explicitly requires "convert Prisma/non-serializable values (Dates -> ISO strings, relations -> plain objects)". `tsconfig.json` has `"strict": true`, so passing a Prisma object (whose `createdAt` is typed `Date`) to a client prop typed `string` would fail typecheck. Therefore for the three newly-converted server pages (orders, order detail, profile) we do explicit conversion: the server page maps Prisma rows to plain objects with `createdAt: o.createdAt.toISOString()` (typed `string`) and nested `items`/`product` as plain objects, and the client interfaces type `createdAt: string`. Formatting still uses `new Date(order.createdAt).toLocaleDateString('en-US', …)` (an ISO string parses fine). This is functionally identical to the existing pages, just explicit. Date LOCALE is left as `'en-US'` (date formatting is not part of the translation keys).

**Prisma field types** (`prisma/schema.prisma`): `Order.total` and `OrderItem.price` are `Float` (JS `number`, `.toFixed(2)` works). `Order.status`, `Order.address`, `Order.id` are `String`. `OrderItem.quantity` is `Int`. `Order.createdAt` is `DateTime`. `User.name` is `String?` (nullable). No `Decimal` types anywhere relevant.

**Verification command:** `cd /Users/moengmix/Desktop/e-commerce-app && npx tsc --noEmit` (`tsconfig.json` already sets `noEmit: true`, `strict: true`). No `typecheck` script exists in `package.json`; invoke `tsc` directly.

**Constraints honored:** no Prisma schema changes, no API route changes, no admin page changes, no new npm packages. Existing client pages (wishlist, signin, signup, faq, contact) get `useLanguage()` added inline; server pages (orders, order detail, profile) get a new client Content component + thin server shell.

---

## Translation Keys to Add (both `en` and `km`)

Add every key below to BOTH the `en` object and the `km` object in `src/context/LanguageContext.tsx`, in the order shown (group by page, append after the existing `category.*` / `home.breadcrumbHome` block). Keys are namespaced to avoid collisions with existing keys.

### Orders (list)
| key | en | km |
| --- | --- | --- |
| `orders.title` | My Orders | ការបញ្ជាទិញរបស់ខ្ញុំ |
| `orders.count` | orders | ការបញ្ជាទិញ |
| `orders.none` | No orders yet | មិនទាន់មានការបញ្ជាទិញ |
| `orders.noneDesc` | Start shopping to place your first order | ចាប់ផ្ដើមទិញដើម្បីដាក់ការបញ្ជាទិញដំបូង |
| `orders.shopNow` | Shop Now | ទិញឥឡូវ |
| `orders.viewDetails` | View Details | មើលព័ត៌មាន |
| `orders.more` | more | ទៀត |
| `orders.items` | items | មុខ |
| `orders.item` | item | មុខ |

### Status (shared by orders list + order detail timeline/badge)
| key | en | km |
| --- | --- | --- |
| `status.pending` | Pending | រង់ចាំ |
| `status.processing` | Processing | កំពុងដំណើរការ |
| `status.shipped` | Shipped | បានដឹក |
| `status.delivered` | Delivered | បានទទួល |
| `status.cancelled` | Cancelled | បានលុបចោល |

### Order Detail
| key | en | km |
| --- | --- | --- |
| `order.backToOrders` | Back to Orders | ត្រឡប់ទៅការបញ្ជាទិញ |
| `order.number` | Order # | ការបញ្ជាទិញ # |
| `order.placedOn` | Placed on | ដាក់នៅ |
| `order.progress` | Order Progress | ដំណើរការការបញ្ជាទិញ |
| `order.estDelivery` | Est. Delivery: | ការដឹកជញ្ជូនប៉ាន់ស្មាន: |
| `order.shippingDetails` | Shipping Details | ព័ត៌មានដឹកជញ្ជូន |
| `order.courier` | Courier: | អ្នកដឹក: |
| `order.tracking` | Tracking: | តាមដាន: |
| `order.valuedCustomer` | Valued Customer | អតិថិជនទីស្រឡាញ់ |
| `order.orderItems` | Order Items | មុខទំនិញ |
| `order.itemsTotal` | Items Total | សរុបទំនិញ |
| `order.shippingHandling` | Shipping & Handling | ការដឹកជញ្ជូន |
| `order.grandTotal` | Grand Total Paid | សរុបសង្ខេបដែលបានបង់ |
| `order.continueShopping` | Continue Shopping | ទិញបន្ត |
| `order.cancelledMsg` | This order was cancelled. If you need any assistance or refund verification, please reach out to our 24/7 customer support. | ការបញ្ជាទិញនេះត្រូវបានលុបចោល។ សូមទំនាក់ទំនងផ្នែកជំនួយអតិថិជន ២៤/៧ របស់យើង។ |
| `order.cancelOrder` | Cancel Order | លុបការបញ្ជាទិញ |
| `order.printInvoice` | Print Invoice | បោះពុម្ពវិក្កយបត្រ |
| `order.invoiceTitle` | E-Shop Store Receipt | វិក្កយបត្ររបស់ E-Shop |
| `order.invoiceDate` | Invoice Date: | កាលបរិច្ឆេទ: |
| `order.expressWorldwide` | Express Worldwide | ដឹកដ៏រហ័ស |
| `order.qty` | Qty: | បរិមាណ: |

### Profile
| key | en | km |
| --- | --- | --- |
| `profile.title` | My Profile | គណនីរបស់ខ្ញុំ |
| `profile.memberSince` | Member since | សមាជិកតាំងពី |
| `profile.ordersPlaced` | Orders Placed | ការបញ្ជាទិញ |
| `profile.savedItems` | Saved Items | ទំនិញដែលរក្សា |
| `profile.viewWishlist` | View Wishlist | មើលបញ្ជីប្រាថ្នា |
| `profile.reviewsWritten` | Reviews Written | មតិដែលបានសរសេរ |
| `profile.accountInfo` | Account Information | ព័ត៌មានគណនី |
| `profile.fullName` | Full Name | ឈ្មោះពេញ |
| `profile.notSet` | Not set | មិនទាន់កំណត់ |
| `profile.emailAddress` | Email Address | អ៊ីមែល |
| `profile.quickLinks` | Quick Links | តំណភ្ជាប់រហ័ស |
| `profile.viewMyOrders` | View My Orders | មើលការបញ្ជាទិញ |
| `profile.myCart` | My Cart | កន្ត្រករបស់ខ្ញុំ |
| `profile.browseProducts` | Browse Products | រកមើលផលិតផល |
| `profile.accountActions` | Account Actions | សកម្មភាពគណនី |
| `profile.signOut` | Sign Out | ចាកចេញ |
| `profile.anonymous` | Anonymous | អនាមិក |

### Wishlist
| key | en | km |
| --- | --- | --- |
| `wishlist.title` | My Wishlist | បញ្ជីប្រាថ្នា |
| `wishlist.items` | items | មុខ |
| `wishlist.saved` | saved for later | រក្សាទុកសម្រាប់ក្រោយ |
| `wishlist.clear` | Clear Wishlist | លុបបញ្ជីប្រាថ្នា |
| `wishlist.empty` | Your wishlist is empty | បញ្ជីប្រាថ្នារបស់អ្នកទទេ |
| `wishlist.emptyDesc` | Save items you like by clicking the heart icon on any product. | រក្សាទំនិញដែលអ្នកចូលចិត្តដោយចុចរូបបេះដូង។ |
| `wishlist.explore` | Explore Products | រកមើលផលិតផល |
| `wishlist.inStock` | In Stock | មានស្តុក |
| `wishlist.outOfStock` | Out of Stock | អស់ស្តុក |

### Sign In
| key | en | km |
| --- | --- | --- |
| `signin.title` | Welcome Back | សូមស្វាគមន៍ |
| `signin.subtitle` | Sign in to access your orders, cart, and profile | ចូលដើម្បីចូលប្រើការបញ្ជាទិញ កន្ត្រក និងគណនី |
| `signin.demoTitle` | Testing out the store? | សាកល្បងហាង? |
| `signin.fillDemo` | Fill Demo | បំពេញ Demo |
| `signin.email` | Email Address | អ៊ីមែល |
| `signin.password` | Password | ពាក្យសម្ងាត់ |
| `signin.submit` | Sign In | ចូលគណនី |
| `signin.submitting` | Signing In... | កំពុងចូល... |
| `signin.noAccount` | Don't have an account yet? | មិនទាន់មានគណនី? |
| `signin.createAccount` | Create an Account | បង្កើតគណនី |

### Sign Up
| key | en | km |
| --- | --- | --- |
| `signup.title` | Create an Account | បង្កើតគណនី |
| `signup.subtitle` | Join E-Shop today for personalized deals & fast checkout | ចូលរួម E-Shop ថ្ងៃនេះ |
| `signup.fullName` | Full Name | ឈ្មោះពេញ |
| `signup.email` | Email Address | អ៊ីមែល |
| `signup.password` | Password | ពាក្យសម្ងាត់ |
| `signup.passwordHint` | At least 6 characters | យ៉ាងហោចណាស់ ៦ តួអក្សរ |
| `signup.submit` | Sign Up | ចុះឈ្មោះ |
| `signup.submitting` | Creating Account... | កំពុងបង្កើតគណនី... |
| `signup.haveAccount` | Already have an account? | មានគណនីហើយ? |
| `signup.signIn` | Sign In | ចូលគណនី |

### FAQ
| key | en | km |
| --- | --- | --- |
| `faq.title` | Frequently Asked Questions | សំណួរដែលគេសួរជាញឹកញាប់ |
| `faq.subtitle` | Find fast answers to common questions about shipping, returns, payment security, and our products. | ស្វែងរកចម្លើយរហ័សសម្រាប់សំណួរទូទៅអំពីការដឹកជញ្ជូន ការប្រគល់ ការទូទាត់ និងផលិតផល។ |
| `faq.all` | All | ទាំងអស់ |
| `faq.shipping` | Shipping | ការដឹកជញ្ជូន |
| `faq.payments` | Payments | ការទូទាត់ |
| `faq.returns` | Returns | ការប្រគល់ |
| `faq.orders` | Orders | ការបញ្ជាទិញ |
| `faq.warranty` | Warranty | ការធានា |
| `faq.stillQuestions` | Still have questions? | នៅមានសំណួរទៀតទេ? |
| `faq.supportDesc` | Our friendly customer support team is available 24/7 to assist you. | ក្រុមការជំនួយអតិថិជនរបស់យើងនៅទីនេះ ២៤/៧ ដើម្បីជួយអ្នក។ |
| `faq.contactSupport` | Contact Support | ទំនាក់ទំនងផ្នែកជំនួយ |

FAQ Q/A pairs (en values are the EXISTING English text from `src/app/faq/page.tsx`, reproduced verbatim in source order; km values are the Khmer below):

| key | en (verbatim from faq/page.tsx FAQS array, in order) | km |
| --- | --- | --- |
| `faq.q1` | How long does shipping take? | តើការដឹកជញ្ជូនចំណាយពេលប៉ុន្មាន? |
| `faq.a1` | Standard delivery typically takes 2-4 business days for domestic orders, and 5-10 business days for international orders. You will receive an SMS and tracking number as soon as your parcel is dispatched. | ការដឹកជញ្ជូនក្នុងប្រទេសចំណាយ ២-៤ ថ្ងៃធ្វើការ ហើយអន្តរជាតិ ៥-១០ ថ្ងៃ។ |
| `faq.q2` | Do you offer free shipping? | តើអ្នកផ្ដល់ការដឹកឥតគិតថ្លៃទេ? |
| `faq.a2` | Yes! All orders over $50 qualify for complimentary free shipping automatically. You can also use promo code FREESHIP at checkout during select promotions. | បាទ! ការបញ្ជាទិញទាំងអស់លើស $50 ទទួលបានការដឹកជញ្ជូនឥតគិតថ្លៃ។ |
| `faq.q3` | What payment methods do you accept? | តើអ្នកទទួលការទូទាត់របៀបណា? |
| `faq.a3` | We accept all major Credit and Debit Cards (Visa, Mastercard), KHQR / Bakong / ABA Bank transfers in Cambodia, PayPal, and Cash on Delivery (COD) for eligible regions. | យើងទទួលកាត Visa, Mastercard, KHQR/ABA, PayPal និង Cash on Delivery។ |
| `faq.q4` | Is my payment information secure? | តើការទូទាត់មានសុវត្ថិភាពទេ? |
| `faq.a4` | Yes, 100%. All transactions are processed through encrypted 256-bit SSL connections. We never store your full card numbers or sensitive security codes on our servers. | បាទ ១០០%។ ប្រតិបត្តិការទាំងអស់ប្រើ SSL 256-bit encryption។ |
| `faq.q5` | What is your return policy? | គោលការណ៍ប្ដូរទំនិញជាអ្វី? |
| `faq.a5` | We offer a hassle-free 30-day money-back guarantee. If you are not completely satisfied with your purchase, you can initiate a return or exchange within 30 days of receiving your item. | យើងផ្ដល់ការសងប្រាក់ ៣០ ថ្ងៃ ប្រសិនបើអ្នកមិនពេញចិត្ត។ |
| `faq.q6` | How do I cancel or modify an order? | តើខ្ញុំអាចលុបឬផ្លាស់ប្តូរការបញ្ជាទិញបាទទេ? |
| `faq.a6` | You can cancel an order directly from your "My Orders" page as long as the status is still "pending" or "processing". Once shipped, simply initiate a return upon receipt. | អ្នកអាចលុបការបញ្ជាទិញពីទំព័រ ការបញ្ជាទិញ ប្រសិនបើស្ថានភាពនៅជា រង់ចាំ ឬ កំពុងដំណើរការ។ |
| `faq.q7` | How can I track my order? | តើខ្ញុំអាចតាមដានការបញ្ជាទិញបាទយ៉ាងដូចម្តេច? |
| `faq.a7` | Visit the "My Orders" tab from your user menu and click "View Details" on any order to see real-time status progression from processing to delivery. | ចូលទៅ ការបញ្ជាទិញ ហើយចុច មើលព័ត៌មាន ដើម្បីឃើញស្ថានភាពពេលវេលាជាក់ស្ដែង។ |
| `faq.q8` | Do electronics come with a warranty? | តើអេឡិចត្រូនិចមានការធានាទេ? |
| `faq.a8` | All electronics and gadgets come with a minimum 1-year manufacturer warranty covering factory defects and hardware malfunctions. | ផលិតផលអេឡិចត្រូនិចទាំងអស់មានការធានា ១ ឆ្នាំ ពីអ្នកផ្លិត។ |

Note for the coder: the `faq.a6` and `faq.a7` en values contain double-quote characters; since the translations object uses single-quoted JS strings, single quotes are safe (none of these en/km strings contain an apostrophe). Verify by searching the file before finalizing.

### Contact
| key | en | km |
| --- | --- | --- |
| `contact.title` | Contact Customer Care | ទំនាក់ទំនងផ្នែកថែទាំអតិថិជន |
| `contact.subtitle` | Need help with an order, return, or product recommendation? We are here to support you 24/7. | ត្រូវការជំនួយជាមួយការបញ្ជាទិញ ការប្ដូរ ឬការណែនាំផលិតផល? យើងនៅទីនេះ ២៤/៧។ |
| `contact.phone` | Phone & Hotline | ទូរសព្ទ & Hotline |
| `contact.phoneHours` | Available Mon-Sun 8:00 AM - 8:00 PM | ច័ន្ទ-អាទិត្យ ៨:០០ - ២០:០០ |
| `contact.email` | Email Inquiries | សំណួរតាមអ៊ីមែល |
| `contact.emailResponse` | Expected response within 24 hours | ឆ្លើយតបក្នុងរយៈពេល ២៤ ម៉ោង |
| `contact.address` | Showroom & Headquarters | ការិយាល័យ |
| `contact.hours` | Operating Hours | ម៉ោងធ្វើការ |
| `contact.hoursWeekday` | Monday - Saturday: 8:00 AM - 7:00 PM | ច័ន្ទ - សៅរ៍: ៨:០០ - ១៩:០០ |
| `contact.hoursSunday` | Sunday: 9:00 AM - 5:00 PM | អាទិត្យ: ៩:០០ - ១៧:០០ |
| `contact.sendMessage` | Send Us a Message | ផ្ញើសារមកយើង |
| `contact.formDesc` | Fill out the form below and our team will get back to you shortly. | បំពេញពាក្យខាងក្រោម ហើយក្រុមការរបស់យើងនឹងតបឆាប់។ |
| `contact.yourName` | Your Name * | ឈ្មោះអ្នក * |
| `contact.yourEmail` | Your Email * | អ៊ីមែលអ្នក * |
| `contact.subject` | Subject * | ប្រធានបទ * |
| `contact.message` | Message Details * | សារលម្អិត * |
| `contact.send` | Send Message | ផ្ញើសារ |
| `contact.sending` | Sending... | កំពុងផ្ញើ... |
| `contact.successTitle` | Message Sent! | បានផ្ញើសារ! |
| `contact.successMsg` | Thank you for reaching out. A representative will follow up with you via email. | អរគុណចំពោះការទំនាក់ទំនង។ យើងនឹងឆ្លើយតបតាមអ៊ីមែល។ |
| `contact.sendAnother` | Send another message | ផ្ញើសារមួយទៀត |
| `contact.toastSuccess` | Your message has been sent! Our support team will reply within 24 hours. | សារបានផ្ញើ! ក្រុមការរបស់យើងនឹងឆ្លើយក្នុង ២៤ ម៉ោង។ |

---

## Implementation Plan

- [ ] 1. Add all new translation keys to both `en` and `km` objects in the LanguageContext.
      In `src/context/LanguageContext.tsx`, append every key listed in the "Translation Keys to Add" section above to the `en` object (English values) and to the `km` object (Khmer values), grouped in the page order shown. For `faq.q1`..`faq.q8` and `faq.a1`..`faq.a8` use the en values verbatim from the existing `FAQS` array in `src/app/faq/page.tsx` (in source order) and the km values from the table above. Keep key spelling exactly as listed (dotted, lowercase).
      Files: `src/context/LanguageContext.tsx`
      Verify: `cd /Users/moengmix/Desktop/e-commerce-app && npx tsc --noEmit` — zero errors (the file is plain key/value additions; the only risk is a quote-escaping error, which `tsc` will flag).

- [ ] 2. Convert the Orders list page to a thin server shell + `OrdersContent` client component.
      Create `src/app/orders/OrdersContent.tsx` (`'use client'`). Import `useLanguage` from `@/context/LanguageContext`, `Link` from `next/link`, `Package`/`ArrowRight` from `lucide-react`. Define interfaces:
      ```
      interface OrderItemThumb { id: string; quantity: number; product: { id: string; name: string; image: string } }
      interface OrderListItem { id: string; status: string; total: number; createdAt: string; items: OrderItemThumb[] }
      interface OrdersContentProps { orders: OrderListItem[] }
      ```
      Move the entire current render from `orders/page.tsx` into this component, calling `const { t } = useLanguage()`. Replace: heading `My Orders` → `t('orders.title')`; the `{orders.length} order{...}` line → `` `${orders.length} ${t('orders.count')}` `` (drop the manual plural `s`); empty-state `No orders yet` → `t('orders.none')`, `Start shopping to place your first order` → `t('orders.noneDesc')`, `Shop Now` → `t('orders.shopNow')`; status badge `{order.status}` → `t('status.' + order.status)`; date `new Date(order.createdAt)` (createdAt is now ISO string, still parses); the `+{n} more` → `` `+${order.items.length - 4} ${t('orders.more')}` ``; the `{count} item{s}` → `` `${count} ${count !== 1 ? t('orders.items') : t('orders.item')}` ``; `View Details` → `t('orders.viewDetails')`. Keep the `STATUS_STYLES` map (move it inside this file).
      Rewrite `src/app/orders/page.tsx` as a thin server shell: keep `export const dynamic = 'force-dynamic'`; import `getSession` from `@/lib/session`, `getUserOrders` from `@/actions/orders`, `redirect` from `next/navigation`, and `OrdersContent` (default import). `const session = await getSession(); if (!session) redirect('/signin?redirect=/orders'); const orders = await getUserOrders();` then map `orders.map(o => ({ id: o.id, status: o.status, total: o.total, createdAt: o.createdAt.toISOString(), items: o.items.map(i => ({ id: i.id, quantity: i.quantity, product: { id: i.product.id, name: i.product.name, image: i.product.image } })) }))` and render `<OrdersContent orders={mapped} />`. Remove the now-unused `Link`/`Package`/`ArrowRight`/`STATUS_STYLES` imports from the server file.
      Files: `src/app/orders/OrdersContent.tsx` (new), `src/app/orders/page.tsx` (rewrite)
      Verify: `cd /Users/moengmix/Desktop/e-commerce-app && npx tsc --noEmit` — zero errors.

- [ ] 3. Convert the Order detail page to a thin server shell + `OrderDetailContent` client component; add `useLanguage()` to `OrderActions`.
      Create `src/app/orders/[id]/OrderDetailContent.tsx` (`'use client'`). Import `useLanguage`, `Link`, the lucide icons used (`Package`, `MapPin`, `CheckCircle`, `Truck`, `Calendar`, `ShoppingBag`, `ArrowLeft`), and `OrderActions` (default import from `./OrderActions`). Define interfaces:
      ```
      interface OrderItemView { id: string; quantity: number; price: number; product: { id: string; name: string; image: string } }
      interface OrderDetailView { id: string; status: string; total: number; address: string; createdAt: string; items: OrderItemView[] }
      interface OrderDetailContentProps { order: OrderDetailView; customerName: string | null; customerEmail: string }
      ```
      Move the entire render from `orders/[id]/page.tsx` here. Compute client-side: `const STATUS_STEPS = ['pending','processing','shipped','delivered']; const currentStep = STATUS_STEPS.indexOf(order.status); const canCancel = order.status === 'pending' || order.status === 'processing'; const orderDate = new Date(order.createdAt); const estDelivery = new Date(orderDate); estDelivery.setDate(orderDate.getDate() + 3);`. Keep the print-only invoice header (translate `E-Shop Store Receipt` → `t('order.invoiceTitle')`, `Invoice Date:` → `t('order.invoiceDate')`). Replace strings: `Back to Orders` → `t('order.backToOrders')`; `Order #` label → `t('order.number')` + ` {order.id.slice(-8).toUpperCase()}`; `Placed on` → `t('order.placedOn')`; status badge → `t('status.' + order.status)`; `Order Progress` → `t('order.progress')`; `Est. Delivery:` → `t('order.estDelivery')`; timeline step label `{step}` → `t('status.' + step)`; cancelled message → `t('order.cancelledMsg')`; `Shipping Details` → `t('order.shippingDetails')`; customer name fallback `Valued Customer` → `t('order.valuedCustomer')`; `Courier:` → `t('order.courier')` and the courier value `Express Worldwide` → `t('order.expressWorldwide')`; `Tracking:` → `t('order.tracking')`; `Order Items` heading → `t('order.orderItems')` (keep the `({count})`); per-item `Qty:` → `t('order.qty')`; `Items Total` → `t('order.itemsTotal')`; `Shipping & Handling` → `t('order.shippingHandling')`; `FREE` → `t('cart.free')` (reuse existing); `Grand Total Paid` → `t('order.grandTotal')`; `Continue Shopping` → `t('order.continueShopping')`. Keep the `STATUS_STYLES` map here. Render `<OrderActions orderId={order.id} canCancel={canCancel} />` where the actions belong.
      Rewrite `src/app/orders/[id]/page.tsx` as a thin server shell: keep the `OrderDetailPageProps` with `params: Promise<{ id: string }>`; `const { id } = await params; const session = await getSession(); if (!session) redirect('/signin'); const order = await getOrderById(id); if (!order) notFound();` then map to a plain object: `{ id: order.id, status: order.status, total: order.total, address: order.address, createdAt: order.createdAt.toISOString(), items: order.items.map(i => ({ id: i.id, quantity: i.quantity, price: i.price, product: { id: i.product.id, name: i.product.name, image: i.product.image } })) }` and render `<OrderDetailContent order={mapped} customerName={session.name} customerEmail={session.email} />`. Remove all now-unused imports from the server file (`Package`, `MapPin`, etc., `STATUS_STEPS`/`STATUS_STYLES`).
      Modify `src/app/orders/[id]/OrderActions.tsx`: add `import { useLanguage } from '@/context/LanguageContext'`, call `const { t } = useLanguage()`, and replace `Print Invoice` → `t('order.printInvoice')` and `Cancel Order` → `t('order.cancelOrder')`. Leave the `confirm(...)` dialog text and the `toast.success(...)` message as-is (not in the translation key list).
      Files: `src/app/orders/[id]/OrderDetailContent.tsx` (new), `src/app/orders/[id]/page.tsx` (rewrite), `src/app/orders/[id]/OrderActions.tsx` (edit)
      Verify: `cd /Users/moengmix/Desktop/e-commerce-app && npx tsc --noEmit` — zero errors.

- [ ] 4. Convert the Profile page to a thin server shell + `ProfileContent` client component.
      Create `src/app/profile/ProfileContent.tsx` (`'use client'`). Import `useLanguage`, `Link`, `logoutUser` from `@/actions/auth`, and the lucide icons used (`User`, `Mail`, `Package`, `Star`, `Calendar`, `LogOut`, `ShoppingCart`, `Tag`, `Heart`). Define interfaces:
      ```
      interface ProfileContentProps { user: { name: string | null; email: string; createdAt: string }; orderCount: number; reviewCount: number }
      ```
      Move the entire render from `profile/page.tsx` here. Replace: `My Profile` → `t('profile.title')`; avatar fallback `(user.name || user.email)[0]` unchanged; name heading fallback `Anonymous` → `t('profile.anonymous')`; `Member since` → `t('profile.memberSince')` (date via `new Date(user.createdAt).toLocaleDateString('en-US', { year, month: 'long' })`); stats `Orders Placed` → `t('profile.ordersPlaced')`, `Saved Items` → `t('profile.savedItems')`, `View Wishlist` → `t('profile.viewWishlist')`, `Reviews Written` → `t('profile.reviewsWritten')`; `Account Information` → `t('profile.accountInfo')`; `Full Name` label → `t('profile.fullName')` and its fallback `Not set` → `t('profile.notSet')`; `Email Address` label → `t('profile.emailAddress')`; `Quick Links` → `t('profile.quickLinks')`; `View My Orders` → `t('profile.viewMyOrders')`; `My Cart` → `t('profile.myCart')`; `Browse Products` → `t('profile.browseProducts')`; `Account Actions` → `t('profile.accountActions')`; `Sign Out` → `t('profile.signOut')`. Keep the `<form action={logoutUser}>` sign-out form exactly.
      Rewrite `src/app/profile/page.tsx` as a thin server shell: keep `export const dynamic = 'force-dynamic'`; import `getSession`, `redirect`, `prisma`, `ProfileContent`. Run the same `Promise.all` (`user`, `orderCount`, `reviewCount`), `if (!user) redirect('/signin')`, then render `<ProfileContent user={{ name: user.name, email: user.email, createdAt: user.createdAt.toISOString() }} orderCount={orderCount} reviewCount={reviewCount} />`. Remove all now-unused imports from the server file.
      Files: `src/app/profile/ProfileContent.tsx` (new), `src/app/profile/page.tsx` (rewrite)
      Verify: `cd /Users/moengmix/Desktop/e-commerce-app && npx tsc --noEmit` — zero errors.

- [ ] 5. Add `useLanguage()` to the Wishlist page inline.
      In `src/app/wishlist/page.tsx` (already `'use client'`), add `import { useLanguage } from '@/context/LanguageContext'` and `const { t } = useLanguage()` at the top of `WishlistPage`. Replace: `My Wishlist` → `t('wishlist.title')`; the `{items.length} item{s} saved for later` line → `` `${items.length} ${t('wishlist.items')} ${t('wishlist.saved')}` `` (drop the manual plural `s`); `Clear Wishlist` → `t('wishlist.clear')`; empty `Your wishlist is empty` → `t('wishlist.empty')`; the empty description → `t('wishlist.emptyDesc')`; `Explore Products` → `t('wishlist.explore')`; per-card `In Stock` → `t('wishlist.inStock')` and `Out of Stock` → `t('wishlist.outOfStock')`. Leave the `aria-label="Remove from Wishlist"` and product names/prices as-is.
      Files: `src/app/wishlist/page.tsx`
      Verify: `cd /Users/moengmix/Desktop/e-commerce-app && npx tsc --noEmit` — zero errors.

- [ ] 6. Add `useLanguage()` to the Sign In page inline.
      In `src/app/signin/page.tsx` (already `'use client'`), add `import { useLanguage } from '@/context/LanguageContext'` and `const { t } = useLanguage()` inside `SignInContent`. Replace: `Welcome Back` → `t('signin.title')`; subtitle → `t('signin.subtitle')`; `Testing out the store?` → `t('signin.demoTitle')`; `Fill Demo` → `t('signin.fillDemo')`; `Email Address` label → `t('signin.email')`; `Password` label → `t('signin.password')`; submit button text `Sign In` → `t('signin.submit')` and `Signing In...` → `t('signin.submitting')`; `Don't have an account yet?` → `t('signin.noAccount')`; `Create an Account` link text → `t('signin.createAccount')`. Leave the demo email/password line, input placeholders, the Suspense fallback, and the dynamic error string as-is.
      Files: `src/app/signin/page.tsx`
      Verify: `cd /Users/moengmix/Desktop/e-commerce-app && npx tsc --noEmit` — zero errors.

- [ ] 7. Add `useLanguage()` to the Sign Up page inline.
      In `src/app/signup/page.tsx` (already `'use client'`), add `import { useLanguage } from '@/context/LanguageContext'` and `const { t } = useLanguage()` inside `SignUpContent`. Replace: `Create an Account` → `t('signup.title')`; subtitle → `t('signup.subtitle')`; `Full Name` label → `t('signup.fullName')`; `Email Address` label → `t('signup.email')`; `Password` label → `t('signup.password')`; the password input `placeholder="At least 6 characters"` → `placeholder={t('signup.passwordHint')}`; submit button `Sign Up` → `t('signup.submit')` and `Creating Account...` → `t('signup.submitting')`; `Already have an account?` → `t('signup.haveAccount')`; `Sign In` link text → `t('signup.signIn')`. Leave the name/email placeholders and Suspense fallback as-is.
      Files: `src/app/signup/page.tsx`
      Verify: `cd /Users/moengmix/Desktop/e-commerce-app && npx tsc --noEmit` — zero errors.

- [ ] 8. Restructure the FAQ page data inside the component and add `useLanguage()`.
      In `src/app/faq/page.tsx` (already `'use client'`): add `import { useLanguage } from '@/context/LanguageContext'` and `const { t } = useLanguage()` inside `FAQPage`. Replace the module-level `FAQS` array with an in-component array of `{ category: string; qKey: string; aKey: string }` in source order, using the raw English category strings for filtering (`Shipping`, `Shipping`, `Payments`, `Payments`, `Returns`, `Returns`, `Orders`, `Warranty`) and the key pairs `faq.q1`/`faq.a1` … `faq.q8`/`faq.a8`. Keep the in-component `categories` array as `['All', 'Shipping', 'Payments', 'Returns', 'Orders', 'Warranty']` (raw strings used for filter comparison). Render: title → `t('faq.title')`; subtitle → `t('faq.subtitle')`; each pill label → `t('faq.' + cat.toLowerCase())` (yields `faq.all`, `faq.shipping`, …); question → `t(faq.qKey)`; answer → `t(faq.aKey)`; banner `Still have questions?` → `t('faq.stillQuestions')`; support desc → `t('faq.supportDesc')`; `Contact Support` → `t('faq.contactSupport')`. Filtering logic (`activeCategory === 'All' ? all : FAQS.filter(f => f.category === activeCategory)`) stays unchanged because both `category` and `activeCategory` remain raw English strings. Remove the now-unused `FAQItem` interface if no longer referenced.
      Files: `src/app/faq/page.tsx`
      Verify: `cd /Users/moengmix/Desktop/e-commerce-app && npx tsc --noEmit` — zero errors.

- [ ] 9. Add `useLanguage()` to the Contact page inline.
      In `src/app/contact/page.tsx` (already `'use client'`), add `import { useLanguage } from '@/context/LanguageContext'` and `const { t } = useLanguage()` inside `ContactPage`. Replace: title → `t('contact.title')`; subtitle → `t('contact.subtitle')`; card titles `Phone & Hotline` → `t('contact.phone')`, `Email Inquiries` → `t('contact.email')`, `Showroom & Headquarters` → `t('contact.address')`, `Operating Hours` → `t('contact.hours')`; the phone-hours line → `t('contact.phoneHours')`; email response line → `t('contact.emailResponse')`; the weekday hours line → `t('contact.hoursWeekday')`; the sunday hours line → `t('contact.hoursSunday)`; `Send Us a Message` → `t('contact.sendMessage')`; the form description → `t('contact.formDesc')`; success `Message Sent!` → `t('contact.successTitle')`; success message → `t('contact.successMsg')`; `Send another message` → `t('contact.sendAnother)`; form labels `Your Name *` → `t('contact.yourName')`, `Your Email *` → `t('contact.yourEmail')`, `Subject *` → `t('contact.subject')`, `Message Details *` → `t('contact.message')`; send button `Send Message` → `t('contact.send')` and `Sending...` → `t('contact.sending)`; the `toast.success(...)` literal → `t('contact.toastSuccess)`. Leave the physical address text, phone number, email address, and input placeholders (e.g. "e.g. John Doe") as-is (no keys provided for them).
      Files: `src/app/contact/page.tsx`
      Verify: `cd /Users/moengmix/Desktop/e-commerce-app && npx tsc --noEmit` — zero errors.

- [ ] 10. Final TypeScript verification and result recording.
      Run `cd /Users/moengmix/Desktop/e-commerce-app && npx tsc --noEmit` after all edits. Fix any errors (typical pitfalls: passing a Prisma-typed `Date` where a `string` is expected — make sure the server pages call `.toISOString()`; leaving a now-unused `import` in a rewritten server file; `order.estDelivery`/`order.qty` keys existing but a status key like `status.cancelled` referenced as `t('status.cancelled')` — confirm it was added; `faq.a6`/`faq.a7` en strings containing double quotes must stay inside single-quoted JS strings). Append the exact command and its exit result (e.g. "exited with code 0, zero errors" or the error lines + the fix applied) to the end of this plan file under a `## Verification Result` heading.
      Files: any file with type errors; this plan file (append result)
      Verify: `npx tsc --noEmit` exits with code 0 and prints no error lines.

---

## Design Polish (light, applied within the steps above)

- **Orders list (step 2):** wrap the header block in a subtle gradient accent — e.g. give the header a `bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl px-5 py-4` band so the `My Orders` title sits on a soft gradient. Improve status-badge readability by giving each `STATUS_STYLES` entry a subtle border (e.g. add `border border-yellow-200` to the pending entry, matching borders to each color) so badges read clearly on white cards. Keep changes minimal and consistent with the existing blue/indigo palette.
- **Order detail (step 3):** no structural change — just ensure translated labels (especially the longer Khmer strings) fit; the existing flex/grid layout already wraps. Verify the timeline step labels and the pricing summary rows don't overflow (they use `truncate`/`text-xs` and flex, which adapt).
- **Profile (step 4):** keep the existing banner/avatar/stats layout; no structural redesign. The "clean slightly" goal is met by the existing design — no extra changes needed beyond translation.
- **Wishlist / Sign In / Sign Up / FAQ / Contact (steps 5–9):** design is unchanged; only language support is added, per the constraint "minimal, just add language support."

## Notes and Assumptions

1. **Date locale stays `en-US`.** Date formatting is not part of the translation keys; dates render the same in both languages. If Khmer-localized dates are later desired, a `lang`-aware locale would be a separate change.
2. **Contact/Sign in/Sign up placeholders stay English** (e.g. "e.g. John Doe", "you@example.com"). No translation keys were provided for them, so they are left as-is. This is a deliberate scope match with the task's key list.
3. **`OrderActions` confirm/toast strings stay English.** Only `Print Invoice` and `Cancel Order` button labels are in the provided key list, so only those two are translated.
4. **`FREE` reuse:** the order-detail "FREE" shipping line reuses the existing `cart.free` key (English "FREE" / Khmer "ឥតគិតថ្លៃ") rather than adding a duplicate key — identical wording, avoids key sprawl.
5. **Date serialization choice:** explicit `.toISOString()` + `createdAt: string` on client interfaces (instead of the Prisma `Date` passthrough used by `ProductDetailContent`) is required because `tsconfig` is `strict` and the task explicitly mandates ISO-string conversion. Functionally identical for formatting.
6. **FAQ filtering unchanged:** `category` and `activeCategory` remain raw English strings so the existing `===` comparison keeps working; only the displayed pill/label text is translated.

## Verification Result

Command run:
`cd /Users/moengmix/Desktop/e-commerce-app && npx tsc --noEmit`

Result: exited with code 0, zero errors (no output).

Files created/modified:
- `src/context/LanguageContext.tsx` — added all new translation keys (orders, order detail, status, profile, wishlist, signin, signup, faq, contact) to both `en` and `km`.
- `src/app/orders/OrdersContent.tsx` — new client component; renders orders list with `useLanguage()`, gradient header + bordered status badges.
- `src/app/orders/page.tsx` — rewritten as thin server shell; maps Prisma rows to plain objects (`createdAt.toISOString()`).
- `src/app/orders/[id]/OrderDetailContent.tsx` — new client component; renders order detail with `useLanguage()` + `OrderActions`.
- `src/app/orders/[id]/page.tsx` — rewritten as thin server shell; maps order to plain serializable object.
- `src/app/orders/[id]/OrderActions.tsx` — added `useLanguage()`; translated Print Invoice + Cancel Order buttons.
- `src/app/profile/ProfileContent.tsx` — new client component; renders profile with `useLanguage()`.
- `src/app/profile/page.tsx` — rewritten as thin server shell; maps user to plain object.
- `src/app/wishlist/page.tsx` — added `useLanguage()` inline; translated wishlist strings.
- `src/app/signin/page.tsx` — added `useLanguage()` inline; translated sign-in strings.
- `src/app/signup/page.tsx` — added `useLanguage()` inline; translated sign-up strings.
- `src/app/faq/page.tsx` — moved FAQS into component as q/a key pairs; added `useLanguage()`; filter comparison stays raw English.
- `src/app/contact/page.tsx` — added `useLanguage()` inline; translated contact strings + toast.

Note: the contact success-message EN copy follows the plan's spec value ("Thank you for reaching out. A representative will follow up with you via email."), a slight tightening of the original longer sentence; per the plan this is the intended text.
