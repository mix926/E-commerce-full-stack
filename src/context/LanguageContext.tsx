'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

type Lang = 'en' | 'km';

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string) => string;
}

// Translations
const translations: Record<Lang, Record<string, string>> = {
  en: {
    // Navbar
    'nav.allProducts': 'All Products',
    'nav.signIn': 'Sign In',
    'nav.signUp': 'Sign Up',
    'nav.searchPlaceholder': 'Search products...',
    'nav.cart': 'Cart',
    'nav.wishlist': 'Wishlist',
    'nav.help': 'Help & FAQ',
    'nav.contact': 'Contact',
    // Home page
    'home.hero.badge': 'New Arrivals',
    'home.hero.title1': 'Shop the Latest',
    'home.hero.title2': 'Top Deals',
    'home.hero.subtitle': 'Discover thousands of products at unbeatable prices. Free shipping on orders over $50.',
    'home.hero.shopNow': 'Shop Now',
    'home.hero.viewElectronics': 'View Electronics',
    'home.products': 'Products',
    'home.customers': 'Customers',
    'home.rating': 'Rating',
    'home.features.freeShipping': 'Free Shipping',
    'home.features.freeShippingDesc': 'On orders over $50',
    'home.features.easyReturns': 'Easy Returns',
    'home.features.easyReturnsDesc': '30-day return policy',
    'home.features.securePayment': 'Secure Payment',
    'home.features.securePaymentDesc': '100% secure checkout',
    'home.features.topQuality': 'Top Quality',
    'home.features.topQualityDesc': 'Verified products',
    'home.allProducts': 'All Products',
    'home.productsAvailable': 'products available',
    'home.viewAll': 'View all',
    'home.noProductsFound': 'No products found',
    'home.noProductsDesc': 'Try a different search or category',
    'home.browseAll': 'Browse All Products',
    'home.topRated': 'Top Rated',
    'home.topRatedDesc': 'Our highest-rated products',
    'home.searchResults': 'Search results for',
    'home.productsFound': 'products found',
    'home.clearSearch': 'Clear search',
    // Products page
    'products.title': 'All Products',
    'products.found': 'products found',
    'products.for': 'for',
    'products.noFound': 'No products found',
    'products.noFoundDesc': 'Try adjusting your search',
    'products.clearFilters': 'Clear Filters',
    'products.sort': 'Sort',
    'products.search': 'Search...',
    // Announcement
    'announcement.offer': 'Special Offer',
    'announcement.text': 'Get 10% OFF your first order with code',
    'announcement.freeDelivery': 'Free delivery on orders over $50',
    'announcement.shopNow': 'Shop Now',
    // Footer
    'footer.tagline': 'Your trusted marketplace for premium electronics, fashion, lifestyle gear, and everyday essentials.',
    'footer.categories': 'Categories',
    'footer.customerCare': 'Customer Care',
    'footer.newsletter': 'Stay in the Loop',
    'footer.newsletterDesc': 'Subscribe to get exclusive discount codes, flash sales alerts, and weekly new arrivals.',
    'footer.emailPlaceholder': 'Enter your email',
    'footer.subscribed': 'Subscribed! Check your inbox for 10% off.',
    'footer.privacy': 'We value your privacy. No spam ever.',
    'footer.helpFaq': 'Help Center & FAQ',
    'footer.trackOrder': 'Track My Order',
    'footer.myWishlist': 'My Wishlist',
    'footer.shipping': 'Shipping & Delivery',
    'footer.returns': 'Returns & Refunds',
    'footer.contactSupport': 'Contact Support',
    'footer.securePayments': 'Secure Payments:',
    'footer.copyright': 'E-Shop Inc. All rights reserved.',
    'footer.crafted': 'Crafted with',
    'footer.forShoppers': 'for modern shoppers',
    // Cart
    'cart.title': 'Shopping Cart',
    'cart.empty': 'Your cart is empty',
    'cart.emptyDesc': 'Add some products to your cart to continue shopping',
    'cart.startShopping': 'Start Shopping',
    'cart.orderSummary': 'Order Summary',
    'cart.subtotal': 'Subtotal',
    'cart.shipping': 'Shipping',
    'cart.free': 'FREE',
    'cart.total': 'Total',
    'cart.checkout': 'Proceed to Checkout',
    // Product detail
    'product.addToCart': 'Add to Cart',
    'product.addedToCart': 'Added!',
    'product.outOfStock': 'Out of Stock',
    'product.inStock': 'In Stock',
    'product.category': 'Category',
    'product.rating': 'Rating',
  },
  km: {
    // Navbar
    'nav.allProducts': 'ផលិតផលទាំងអស់',
    'nav.signIn': 'ចូលគណនី',
    'nav.signUp': 'បង្កើតគណនី',
    'nav.searchPlaceholder': 'ស្វែងរកផលិតផល...',
    'nav.cart': 'កន្ត្រក',
    'nav.wishlist': 'បញ្ជីប្រាថ្នា',
    'nav.help': 'ជំនួយ & សំណួរ',
    'nav.contact': 'ទំនាក់ទំនង',
    // Home page
    'home.hero.badge': 'ទំនិញថ្មី',
    'home.hero.title1': 'ទិញទំនិញចុងក្រោយ',
    'home.hero.title2': 'ពិសេសបំផុត',
    'home.hero.subtitle': 'រកឃើញផលិតផលរាប់ពាន់ក្នុងតម្លៃដ៏ល្អ។ ដឹកជញ្ជូនឥតគិតថ្លៃសម្រាប់ការបញ្ជាទិញលើស $50។',
    'home.hero.shopNow': 'ទិញឥឡូវ',
    'home.hero.viewElectronics': 'មើលអេឡិចត្រូនិច',
    'home.products': 'ផលិតផល',
    'home.customers': 'អតិថិជន',
    'home.rating': 'ការវាយតម្លៃ',
    'home.features.freeShipping': 'ដឹកជញ្ជូនឥតគិតថ្លៃ',
    'home.features.freeShippingDesc': 'សម្រាប់ការបញ្ជាទិញលើស $50',
    'home.features.easyReturns': 'ប្តូរទំនិញងាយស្រួល',
    'home.features.easyReturnsDesc': 'គោលការណ៍ប្តូរ ៣០ ថ្ងៃ',
    'home.features.securePayment': 'ការទូទាត់ប្រកបដោយសុវត្ថិភាព',
    'home.features.securePaymentDesc': 'ការទូទាត់ ១០០% ប្រកបដោយសុវត្ថិភាព',
    'home.features.topQuality': 'គុណភាពខ្ពស់',
    'home.features.topQualityDesc': 'ផលិតផលដែលបានផ្ទៀងផ្ទាត់',
    'home.allProducts': 'ផលិតផលទាំងអស់',
    'home.productsAvailable': 'ផលិតផលដែលមាន',
    'home.viewAll': 'មើលទាំងអស់',
    'home.noProductsFound': 'រកមិនឃើញផលិតផល',
    'home.noProductsDesc': 'សាកល្បងស្វែងរកផ្សេង',
    'home.browseAll': 'រកមើលផលិតផលទាំងអស់',
    'home.topRated': 'ការវាយតម្លៃខ្ពស់',
    'home.topRatedDesc': 'ផលិតផលដែលបានវាយតម្លៃខ្ពស់បំផុត',
    'home.searchResults': 'លទ្ធផលស្វែងរកសម្រាប់',
    'home.productsFound': 'ផលិតផលបានរកឃើញ',
    'home.clearSearch': 'លុបការស្វែងរក',
    // Products page
    'products.title': 'ផលិតផលទាំងអស់',
    'products.found': 'ផលិតផលបានរកឃើញ',
    'products.for': 'សម្រាប់',
    'products.noFound': 'រកមិនឃើញផលិតផល',
    'products.noFoundDesc': 'សាកល្បងកែប្រែការស្វែងរក',
    'products.clearFilters': 'លុបតម្រង',
    'products.sort': 'តម្រៀប',
    'products.search': 'ស្វែងរក...',
    // Announcement
    'announcement.offer': 'ការផ្តល់ជូនពិសេស',
    'announcement.text': 'ទទួលបានការបញ្ចុះតម្លៃ ១០% ចំពោះការបញ្ជាទិញដំបូង ជាមួយកូដ',
    'announcement.freeDelivery': 'ដឹកជញ្ជូនឥតគិតថ្លៃ សម្រាប់ការបញ្ជាទិញលើស $50',
    'announcement.shopNow': 'ទិញឥឡូវ',
    // Footer
    'footer.tagline': 'ទីផ្សាររបស់អ្នកសម្រាប់ផលិតផលអេឡិចត្រូនិច ម៉ូត ការរស់នៅ និងផ្សេងៗទៀត។',
    'footer.categories': 'ប្រភេទ',
    'footer.customerCare': 'ការថែទាំអតិថិជន',
    'footer.newsletter': 'ទទួលព័ត៌មានថ្មី',
    'footer.newsletterDesc': 'ជាវដើម្បីទទួលលេខកូដបញ្ចុះតម្លៃ ការលក់ Flash និងទំនិញថ្មីប្រចាំសប្តាហ៍។',
    'footer.emailPlaceholder': 'បញ្ចូលអ៊ីមែលរបស់អ្នក',
    'footer.subscribed': 'បានជាវ! ពិនិត្យអ៊ីមែលរបស់អ្នកដើម្បីទទួល ១០% បញ្ចុះ។',
    'footer.privacy': 'យើងយកចិត្តទុកដាក់ភាពឯកជនរបស់អ្នក។ គ្មានការផ្ញើសារបន្ទប់ឡើយ។',
    'footer.helpFaq': 'មជ្ឈមណ្ឌលជំនួយ & សំណួរ',
    'footer.trackOrder': 'តាមដានការបញ្ជាទិញ',
    'footer.myWishlist': 'បញ្ជីប្រាថ្នារបស់ខ្ញុំ',
    'footer.shipping': 'ដឹកជញ្ជូន & ការប្រគល់',
    'footer.returns': 'ការប្រគល់ & ការសងប្រាក់',
    'footer.contactSupport': 'ទំនាក់ទំនងផ្នែកជំនួយ',
    'footer.securePayments': 'ការទូទាត់ប្រកបដោយសុវត្ថិភាព:',
    'footer.copyright': 'E-Shop Inc. រក្សាសិទ្ធគ្រប់យ៉ាង។',
    'footer.crafted': 'បង្កើតជាមួយ',
    'footer.forShoppers': 'សម្រាប់អ្នកទិញដ៏ទំនើប',
    // Cart
    'cart.title': 'កន្ត្រកទំនិញ',
    'cart.empty': 'កន្ត្រករបស់អ្នកទទេ',
    'cart.emptyDesc': 'បន្ថែមផលិតផលទៅក្នុងកន្ត្រករបស់អ្នក',
    'cart.startShopping': 'ចាប់ផ្ដើមទិញ',
    'cart.orderSummary': 'សង្ខេបការបញ្ជាទិញ',
    'cart.subtotal': 'សរុបរង',
    'cart.shipping': 'ការដឹកជញ្ជូន',
    'cart.free': 'ឥតគិតថ្លៃ',
    'cart.total': 'សរុប',
    'cart.checkout': 'ដំណើរការទូទាត់',
    // Product detail
    'product.addToCart': 'បន្ថែមទៅកន្ត្រក',
    'product.addedToCart': 'បានបន្ថែម!',
    'product.outOfStock': 'អស់ស្តុក',
    'product.inStock': 'មានស្តុក',
    'product.category': 'ប្រភេទ',
    'product.rating': 'ការវាយតម្លៃ',
  },
};

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('en');
  
  const t = (key: string): string => {
    return translations[lang][key] ?? translations['en'][key] ?? key;
  };

  return (
    <LanguageContext.Provider value={{lang, setLang, t}}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
