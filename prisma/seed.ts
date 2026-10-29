import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Cleaning old database records...');
  await prisma.review.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  console.log('👤 Seeding demo users...');
  const hashedPassword = await bcrypt.hash('password123', 10);

  const demoUser = await prisma.user.create({
    data: {
      name: 'Demo Shopper',
      email: 'demo@example.com',
      password: hashedPassword,
      role: 'user',
    },
  });

  const sophiaUser = await prisma.user.create({
    data: {
      name: 'Sophia Chen',
      email: 'sophia@example.com',
      password: hashedPassword,
      role: 'user',
    },
  });

  const alexUser = await prisma.user.create({
    data: {
      name: 'Alex Morgan',
      email: 'alex@example.com',
      password: hashedPassword,
      role: 'user',
    },
  });

  console.log('📦 Seeding products...');
  const productsData = [
    // Electronics
    {
      name: 'Modern Wireless Headphones',
      description: 'High-quality active noise-canceling wireless headphones with deep bass and 40-hour battery life. Perfect for music lovers and remote workers.',
      price: 129.99,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
      category: 'Electronics',
      rating: 4.8,
      stock: 50,
    },
    {
      name: 'Ergonomic Mechanical Keyboard',
      description: 'RGB backlit mechanical keyboard designed for ultimate coding comfort. Features Cherry MX switches and customizable lighting.',
      price: 89.99,
      image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&q=80',
      category: 'Electronics',
      rating: 4.9,
      stock: 30,
    },
    {
      name: 'Wireless Gaming Mouse',
      description: 'Ultra-precise wireless gaming mouse with 25,600 DPI sensor, 70-hour battery, and ergonomic design for long gaming sessions.',
      price: 69.99,
      image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=500&q=80',
      category: 'Electronics',
      rating: 4.7,
      stock: 40,
    },
    {
      name: 'USB-C Hub 7-in-1',
      description: 'Expand your laptop ports with 4K HDMI, USB 3.0, SD card reader, and 100W PD charging. Compatible with all USB-C laptops.',
      price: 49.99,
      image: 'https://images.unsplash.com/photo-1625314996978-1fc8d3c6b3c0?w=500&q=80',
      category: 'Electronics',
      rating: 4.5,
      stock: 60,
    },
    {
      name: '4K Webcam Pro',
      description: 'Crystal clear 4K webcam with autofocus, built-in ring light, and noise-canceling microphone. Perfect for video calls and streaming.',
      price: 119.99,
      image: 'https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=500&q=80',
      category: 'Electronics',
      rating: 4.6,
      stock: 25,
    },

    // Accessories
    {
      name: 'Minimalist Smart Watch',
      description: 'Track your health, fitness, and notifications with a sleek minimalist design. Features heart rate monitoring and 7-day battery life.',
      price: 199.99,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80',
      category: 'Accessories',
      rating: 4.6,
      stock: 35,
    },
    {
      name: 'Leather Wallet - Slim RFID',
      description: 'Premium genuine leather slim wallet with RFID blocking technology. Holds up to 8 cards with quick-access cash slot.',
      price: 39.99,
      image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&q=80',
      category: 'Accessories',
      rating: 4.4,
      stock: 80,
    },
    {
      name: 'Sunglasses Polarized UV400',
      description: 'Classic aviator sunglasses with polarized UV400 lenses, stainless steel frame, and scratch-resistant coating.',
      price: 59.99,
      image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&q=80',
      category: 'Accessories',
      rating: 4.3,
      stock: 45,
    },

    // Clothing
    {
      name: 'Premium Hoodie - Black',
      description: 'Ultra-soft 100% organic cotton hoodie with kangaroo pocket. Pre-shrunk fabric that stays soft wash after wash.',
      price: 59.99,
      image: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=500&q=80',
      category: 'Clothing',
      rating: 4.7,
      stock: 100,
    },
    {
      name: 'Classic White T-Shirt',
      description: 'Essential white crewneck t-shirt made from premium Supima cotton. Heavyweight 200gsm fabric with a relaxed fit.',
      price: 29.99,
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80',
      category: 'Clothing',
      rating: 4.5,
      stock: 150,
    },
    {
      name: 'Running Sneakers - White',
      description: 'Lightweight performance running shoes with responsive foam cushioning, breathable mesh upper, and rubber outsole.',
      price: 109.99,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80',
      category: 'Clothing',
      rating: 4.8,
      stock: 60,
    },

    // Home
    {
      name: 'Minimalist Desk Lamp LED',
      description: 'Eye-care LED desk lamp with 5 color temperatures, 10 brightness levels, and USB charging port. Perfect for work and study.',
      price: 44.99,
      image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&q=80',
      category: 'Home',
      rating: 4.6,
      stock: 70,
    },
    {
      name: 'Bamboo Desk Organizer',
      description: 'Eco-friendly bamboo desk organizer with 6 compartments. Keep your workspace tidy with this natural and stylish organizer.',
      price: 34.99,
      image: 'https://images.unsplash.com/photo-1583845112203-29329902332e?w=500&q=80',
      category: 'Home',
      rating: 4.4,
      stock: 55,
    },
    {
      name: 'Scented Soy Candle Set',
      description: 'Set of 3 hand-poured soy wax candles with relaxing lavender, vanilla, and eucalyptus scents. 40-hour burn time each.',
      price: 39.99,
      image: 'https://images.unsplash.com/photo-1602607144729-a7b39d41f8a5?w=500&q=80',
      category: 'Home',
      rating: 4.7,
      stock: 90,
    },

    // Sports
    {
      name: 'Yoga Mat Premium Non-Slip',
      description: 'Extra thick 6mm non-slip yoga mat with alignment lines, carrying strap, and eco-friendly natural rubber material.',
      price: 49.99,
      image: 'https://images.unsplash.com/photo-1601925228736-4a6a97c2ba84?w=500&q=80',
      category: 'Sports',
      rating: 4.8,
      stock: 65,
    },
    {
      name: 'Insulated Water Bottle 1L',
      description: '1-liter double-wall vacuum insulated stainless steel bottle. Keeps drinks cold 24hrs, hot 12hrs. BPA-free and leak-proof.',
      price: 34.99,
      image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&q=80',
      category: 'Sports',
      rating: 4.9,
      stock: 120,
    },

    // Books
    {
      name: 'Atomic Habits - James Clear',
      description: 'The #1 New York Times bestseller. Learn how tiny changes can lead to remarkable results with a proven system for building good habits.',
      price: 18.99,
      image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&q=80',
      category: 'Books',
      rating: 4.9,
      stock: 200,
    },
    {
      name: 'Deep Work - Cal Newport',
      description: 'Rules for focused success in a distracted world. Learn how to cultivate the ability to focus without distraction.',
      price: 16.99,
      image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&q=80',
      category: 'Books',
      rating: 4.7,
      stock: 150,
    },
  ];

  const createdProducts = [];
  for (const item of productsData) {
    const p = await prisma.product.create({ data: item });
    createdProducts.push(p);
  }

  console.log('💬 Seeding realistic customer reviews...');
  // Add reviews to headphones
  await prisma.review.create({
    data: {
      userId: sophiaUser.id,
      productId: createdProducts[0].id,
      rating: 5,
      comment: 'Best wireless headphones I have ever used! The active noise canceling blocks out all office chatter and the soundstage is deep and punchy.',
    },
  });
  await prisma.review.create({
    data: {
      userId: alexUser.id,
      productId: createdProducts[0].id,
      rating: 5,
      comment: 'Super fast delivery and great build quality. Comfortable for 8-hour workdays without any ear fatigue.',
    },
  });

  // Add reviews to mechanical keyboard
  await prisma.review.create({
    data: {
      userId: demoUser.id,
      productId: createdProducts[1].id,
      rating: 5,
      comment: 'Typing on this keyboard is pure joy. The tactile click is crisp, RGB colors look premium, and it feels built like a tank.',
    },
  });
  await prisma.review.create({
    data: {
      userId: sophiaUser.id,
      productId: createdProducts[1].id,
      rating: 5,
      comment: 'Must-have for developers and gamers alike. Excellent layout and wrist angle.',
    },
  });

  // Add reviews to Atomic Habits
  await prisma.review.create({
    data: {
      userId: alexUser.id,
      productId: createdProducts[16].id,
      rating: 5,
      comment: 'Life changing book! The concepts are practical, easy to apply, and deliver immediate improvements in productivity.',
    },
  });

  console.log('🛍️ Seeding sample orders for Demo User...');
  await prisma.order.create({
    data: {
      userId: demoUser.id,
      total: 199.98,
      address: 'Monivong Blvd, Phnom Penh, 12000, Cambodia • Method: Credit Card',
      status: 'delivered',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      items: {
        create: [
          {
            productId: createdProducts[0].id,
            quantity: 1,
            price: createdProducts[0].price,
          },
          {
            productId: createdProducts[2].id,
            quantity: 1,
            price: createdProducts[2].price,
          },
        ],
      },
    },
  });

  console.log('✅ Database seeded successfully with demo user, products, reviews, and order history!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
