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
  const adminPassword = await bcrypt.hash('admin123', 10);

  await prisma.user.create({
    data: {
      name: 'Admin',
      email: 'admin@eshop.com',
      password: adminPassword,
      role: 'admin',
    },
  });

  const demoUser = await prisma.user.create({
    data: {
      name: 'Demo Shopper',
      email: 'demo@example.com',
      password: hashedPassword,
      role: 'customer',
    },
  });

  const sophiaUser = await prisma.user.create({
    data: {
      name: 'Sophia Chen',
      email: 'sophia@example.com',
      password: hashedPassword,
      role: 'customer',
    },
  });

  const alexUser = await prisma.user.create({
    data: {
      name: 'Alex Morgan',
      email: 'alex@example.com',
      password: hashedPassword,
      role: 'customer',
    },
  });

  console.log('📦 Seeding products...');
  const productsData = [
    // Electronics - Clean Product Shots
    {
      name: 'Pro Studio Headphones',
      description: 'Professional-grade studio headphones with 40mm drivers, closed-back design, and detachable cables. Ideal for music production and critical listening.',
      price: 249.99,
      image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?w=500&q=80',
      category: 'Electronics',
      rating: 4.9,
      stock: 25,
    },
    {
      name: 'Portable SSD 2TB',
      description: 'Ultra-fast NVMe SSD with 1050MB/s read speeds, shock resistance, and compact design. Perfect for content creators and data backup.',
      price: 199.99,
      image: 'https://images.pexels.com/photos/8566486/pexels-photo-8566486.jpeg?w=500&q=80',
      category: 'Electronics',
      rating: 4.8,
      stock: 45,
    },
    {
      name: 'Smart Standing Desk',
      description: 'Dual-motor electric standing desk with memory presets, anti-collision sensor, and app control. Promotes healthier work habits.',
      price: 399.99,
      image: 'https://images.pexels.com/photos/1496181/pexels-photo-1496181.jpeg?w=500&q=80',
      category: 'Electronics',
      rating: 4.7,
      stock: 15,
    },
    {
      name: 'Wireless Charging Pad Pro',
      description: 'Fast wireless charger supporting up to 30W charging for compatible devices. Non-slip rubber surface and aluminum construction.',
      price: 79.99,
      image: 'https://images.pexels.com/photos/4195325/pexels-photo-4195325.jpeg?w=500&q=80',
      category: 'Electronics',
      rating: 4.6,
      stock: 55,
    },
    {
      name: 'Portable Power Bank 25000mAh',
      description: 'High-capacity power bank with dual USB-C ports and display. Charges phones and laptops with 100W fast charging support.',
      price: 89.99,
      image: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?w=500&q=80',
      category: 'Electronics',
      rating: 4.8,
      stock: 70,
    },

    // Accessories - Clean Product Shots
    {
      name: 'Premium Backpack Pro',
      description: 'Anti-theft laptop backpack with USB charging port, multiple compartments, and ergonomic design. Holds up to 17-inch laptops.',
      price: 149.99,
      image: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?w=500&q=80',
      category: 'Accessories',
      rating: 4.8,
      stock: 40,
    },
    {
      name: 'Stainless Steel Watch',
      description: 'Elegant analog watch with stainless steel case, mineral crystal, and water-resistant design. Perfect for any occasion.',
      price: 129.99,
      image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?w=500&q=80',
      category: 'Accessories',
      rating: 4.7,
      stock: 50,
    },
    {
      name: 'Leather Wallet',
      description: 'Premium genuine leather wallet with RFID blocking technology. Minimalist design that fits perfectly in any pocket.',
      price: 49.99,
      image: 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?w=500&q=80',
      category: 'Accessories',
      rating: 4.5,
      stock: 100,
    },

    // Clothing - Clean Product Shots
    {
      name: 'Merino Wool Sweater',
      description: '100% merino wool sweater with moisture-wicking properties and natural temperature regulation. Extremely soft and breathable.',
      price: 89.99,
      image: 'https://images.pexels.com/photos/3622608/pexels-photo-3622608.jpeg?w=500&q=80',
      category: 'Clothing',
      rating: 4.8,
      stock: 60,
    },
    {
      name: 'Denim Jeans - Classic Blue',
      description: 'Premium raw denim jeans with perfect fit and fade potential. Made from 100% organic cotton for comfort and durability.',
      price: 129.99,
      image: 'https://images.pexels.com/photos/2220294/pexels-photo-2220294.jpeg?w=500&q=80',
      category: 'Clothing',
      rating: 4.7,
      stock: 80,
    },
    {
      name: 'Running Shoes White',
      description: 'Lightweight performance running shoes with responsive foam cushioning, breathable mesh upper, and durable rubber outsole.',
      price: 129.99,
      image: 'https://images.pexels.com/photos/3625517/pexels-photo-3625517.jpeg?w=500&q=80',
      category: 'Clothing',
      rating: 4.9,
      stock: 75,
    },

    // Home & Living - Clean Product Shots
    {
      name: 'Smart Humidifier 4L',
      description: 'Ultrasonic smart humidifier with app control, essential oil diffuser, and auto humidity adjustment. Whisper-quiet operation.',
      price: 94.99,
      image: 'https://images.pexels.com/photos/4202771/pexels-photo-4202771.jpeg?w=500&q=80',
      category: 'Home',
      rating: 4.7,
      stock: 35,
    },
    {
      name: 'Coffee Maker Set',
      description: 'Premium pour-over coffee set with thermal carafe and reusable filter. Perfect for coffee enthusiasts and morning rituals.',
      price: 64.99,
      image: 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?w=500&q=80',
      category: 'Home',
      rating: 4.8,
      stock: 45,
    },
    {
      name: 'LED Desk Lamp',
      description: 'Modern LED desk lamp with adjustable brightness, touch control, and USB charging port. Perfect for any workspace.',
      price: 49.99,
      image: 'https://images.pexels.com/photos/207896/pexels-photo-207896.jpeg?w=500&q=80',
      category: 'Home',
      rating: 4.6,
      stock: 55,
    },

    // Sports & Fitness - Clean Product Shots
    {
      name: 'Resistance Bands Set',
      description: 'Complete set of 5 resistance bands with varying tension levels, carrying pouch, and exercise guide. Full-body workouts made easy.',
      price: 29.99,
      image: 'https://images.pexels.com/photos/4397820/pexels-photo-4397820.jpeg?w=500&q=80',
      category: 'Sports',
      rating: 4.7,
      stock: 120,
    },
    {
      name: 'Yoga Mat Premium',
      description: 'Extra thick 6mm non-slip yoga mat with alignment lines and carrying strap. Made from eco-friendly natural rubber.',
      price: 49.99,
      image: 'https://images.pexels.com/photos/3807517/pexels-photo-3807517.jpeg?w=500&q=80',
      category: 'Sports',
      rating: 4.8,
      stock: 40,
    },

    // Books & Learning - Clean Product Shots
    {
      name: 'The Lean Startup',
      description: 'Groundbreaking guide to building successful startups with minimum viable products and rapid experimentation cycles.',
      price: 17.99,
      image: 'https://images.pexels.com/photos/159775/open-book-pages-book-education-159775.jpeg?w=500&q=80',
      category: 'Books',
      rating: 4.8,
      stock: 180,
    },
    {
      name: 'Thinking Fast and Slow',
      description: 'Revolutionary insights into human decision-making, psychology, and behavioral economics by a Nobel Prize laureate.',
      price: 19.99,
      image: 'https://images.pexels.com/photos/3692132/pexels-photo-3692132.jpeg?w=500&q=80',
      category: 'Books',
      rating: 4.9,
      stock: 150,
    },
    {
      name: 'Atomic Habits',
      description: 'The #1 New York Times bestseller. Learn how tiny changes can lead to remarkable results with proven habit systems.',
      price: 18.99,
      image: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?w=500&q=80',
      category: 'Books',
      rating: 4.9,
      stock: 140,
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
      comment: 'Best headphones for studio work! Crystal clear sound and extremely comfortable.',
    },
  });
  await prisma.review.create({
    data: {
      userId: alexUser.id,
      productId: createdProducts[0].id,
      rating: 5,
      comment: 'Professional quality at an affordable price. Highly recommended!',
    },
  });

  // Add reviews to denim jeans
  await prisma.review.create({
    data: {
      userId: demoUser.id,
      productId: createdProducts[9].id,
      rating: 5,
      comment: 'Great fit and amazing quality. Love how they fade naturally.',
    },
  });
  await prisma.review.create({
    data: {
      userId: sophiaUser.id,
      productId: createdProducts[9].id,
      rating: 5,
      comment: 'Perfect for everyday wear. Super comfortable and durable!',
    },
  });

  // Add reviews to Atomic Habits
  await prisma.review.create({
    data: {
      userId: alexUser.id,
      productId: createdProducts[17].id,
      rating: 5,
      comment: 'Life-changing book! The concepts are practical and easy to apply.',
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
            productId: createdProducts[8].id,
            quantity: 1,
            price: createdProducts[8].price,
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
