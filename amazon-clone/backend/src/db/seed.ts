import { db } from "./database.js";

const products = [
  {
    name: "Wireless Bluetooth Headphones",
    description: "Premium noise-cancelling headphones with 30-hour battery life and crystal-clear sound quality.",
    price: 79.99,
    image_url: "https://picsum.photos/seed/wireless-headphones/400/400",
    category: "Electronics",
    stock: 50,
  },
  {
    name: "Smart Watch Series 8",
    description: "Track your fitness, receive notifications, and stay connected with this advanced smartwatch.",
    price: 249.99,
    image_url: "https://picsum.photos/seed/smartwatch/400/400",
    category: "Electronics",
    stock: 30,
  },
  {
    name: "Laptop Stand Adjustable",
    description: "Ergonomic aluminum laptop stand with adjustable height for improved posture and workspace.",
    price: 34.99,
    image_url: "https://picsum.photos/seed/laptop-stand/400/400",
    category: "Office",
    stock: 75,
  },
  {
    name: "Mechanical Gaming Keyboard",
    description: "RGB backlit mechanical keyboard with Cherry MX switches for gamers and professionals.",
    price: 129.99,
    image_url: "https://picsum.photos/seed/keyboard/400/400",
    category: "Electronics",
    stock: 40,
  },
  {
    name: "Wireless Mouse Ergonomic",
    description: "Comfortable wireless mouse with precision tracking and long battery life.",
    price: 24.99,
    image_url: "https://picsum.photos/seed/mouse/400/400",
    category: "Electronics",
    stock: 100,
  },
  {
    name: "Standing Desk Converter",
    description: "Convert your sitting desk to a standing desk with this adjustable converter.",
    price: 199.99,
    image_url: "https://picsum.photos/seed/desk-converter/400/400",
    category: "Office",
    stock: 25,
  },
  {
    name: "USB-C Hub Multiport",
    description: "7-in-1 USB-C hub with HDMI, USB 3.0, SD card reader, and power delivery.",
    price: 39.99,
    image_url: "https://picsum.photos/seed/usb-hub/400/400",
    category: "Electronics",
    stock: 60,
  },
  {
    name: "Desk Organizer Set",
    description: "Keep your workspace tidy with this bamboo desk organizer set.",
    price: 19.99,
    image_url: "https://picsum.photos/seed/desk-organizer/400/400",
    category: "Office",
    stock: 80,
  },
  {
    name: "Monitor Arm Dual",
    description: "Dual monitor mount arm with gas spring for smooth adjustment and space saving.",
    price: 89.99,
    image_url: "https://picsum.photos/seed/monitor-arm/400/400",
    category: "Office",
    stock: 35,
  },
  {
    name: "Webcam HD 1080p",
    description: "Crystal clear 1080p webcam with autofocus and built-in microphone for video calls.",
    price: 59.99,
    image_url: "https://picsum.photos/seed/webcam/400/400",
    category: "Electronics",
    stock: 45,
  },
  {
    name: "Cable Management Sleeve",
    description: "Organize and hide cables with this expandable cable management sleeve.",
    price: 12.99,
    image_url: "https://picsum.photos/seed/cable-sleeve/400/400",
    category: "Office",
    stock: 120,
  },
  {
    name: "Ergonomic Office Chair",
    description: "Comfortable mesh office chair with lumbar support and adjustable armrests.",
    price: 179.99,
    image_url: "https://picsum.photos/seed/office-chair/400/400",
    category: "Office",
    stock: 20,
  },
  {
    name: "Wireless Charging Pad",
    description: "Fast wireless charging pad compatible with all Qi-enabled devices.",
    price: 29.99,
    image_url: "https://picsum.photos/seed/wireless-charger/400/400",
    category: "Electronics",
    stock: 70,
  },
  {
    name: "Portable External SSD",
    description: "1TB portable SSD with USB-C connection for fast data transfer and backup.",
    price: 89.99,
    image_url: "https://picsum.photos/seed/external-ssd/400/400",
    category: "Electronics",
    stock: 55,
  },
  {
    name: "Desk Mat Large",
    description: "Waterproof desk mat with stitched edges, perfect for protecting your desk surface.",
    price: 22.99,
    image_url: "https://picsum.photos/seed/desk-mat/400/400",
    category: "Office",
    stock: 90,
  },
];

const reviews = [
  { product_id: 1, reviewer_name: "Sarah Johnson", rating: 5, comment: "Amazing sound quality! The noise cancellation works perfectly." },
  { product_id: 1, reviewer_name: "Mike Chen", rating: 4, comment: "Great headphones, battery life is excellent as advertised." },
  { product_id: 1, reviewer_name: "Emily Davis", rating: 5, comment: "Very comfortable for long listening sessions." },
  { product_id: 2, reviewer_name: "David Wilson", rating: 5, comment: "Best smartwatch I've owned. Fitness tracking is spot on." },
  { product_id: 2, reviewer_name: "Lisa Anderson", rating: 4, comment: "Love the design and features. Battery could be better though." },
  { product_id: 3, reviewer_name: "Robert Taylor", rating: 5, comment: "Exactly what I needed for my home office setup." },
  { product_id: 3, reviewer_name: "Jennifer Lee", rating: 4, comment: "Sturdy and adjustable. Great value for money." },
  { product_id: 4, reviewer_name: "James Brown", rating: 5, comment: "Typing feels amazing with these mechanical switches!" },
  { product_id: 4, reviewer_name: "Maria Garcia", rating: 4, comment: "RGB lighting is beautiful. Great for gaming." },
  { product_id: 5, reviewer_name: "Chris Martinez", rating: 5, comment: "Comfortable and responsive. Battery lasts forever." },
  { product_id: 6, reviewer_name: "Amanda White", rating: 5, comment: "Game changer for my productivity. Love standing while working." },
  { product_id: 7, reviewer_name: "Kevin Johnson", rating: 4, comment: "Works perfectly with my MacBook. No complaints." },
  { product_id: 8, reviewer_name: "Rachel Green", rating: 5, comment: "My desk looks so organized now! Beautiful bamboo design." },
  { product_id: 9, reviewer_name: "Tom Hanks", rating: 5, comment: "Smooth adjustment, holds both monitors perfectly." },
  { product_id: 10, reviewer_name: "Jessica Parker", rating: 4, comment: "Clear video quality for Zoom calls. Easy to set up." },
  { product_id: 11, reviewer_name: "Michael Scott", rating: 5, comment: "Made my desk look so much cleaner. Highly recommend!" },
  { product_id: 12, reviewer_name: "Pam Beesly", rating: 4, comment: "Very comfortable chair. Good for long work hours." },
  { product_id: 13, reviewer_name: "Dwight Schrute", rating: 5, comment: "Fast charging, works great with my phone." },
  { product_id: 14, reviewer_name: "Jim Halpert", rating: 5, comment: "Super fast transfers. Essential for my workflow." },
  { product_id: 15, reviewer_name: "Angela Martin", rating: 4, comment: "Nice quality mat. Protects my desk well." },
];

export function seedDatabase(): void {
  // Check if products already exist
  const existingProducts = db.prepare("SELECT COUNT(*) as count FROM products").get() as { count: number };
  
  if (existingProducts.count > 0) {
    console.log("Database already seeded. Skipping...");
    return;
  }

  console.log("Seeding database...");

  // Insert products
  const insertProduct = db.prepare(`
    INSERT INTO products (name, description, price, image_url, category, stock)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const insertManyProducts = db.transaction((items) => {
    for (const item of items) {
      insertProduct.run(item.name, item.description, item.price, item.image_url, item.category, item.stock);
    }
  });

  insertManyProducts(products);
  console.log(`Inserted ${products.length} products`);

  // Insert reviews
  const insertReview = db.prepare(`
    INSERT INTO reviews (product_id, reviewer_name, rating, comment)
    VALUES (?, ?, ?, ?)
  `);

  const insertManyReviews = db.transaction((items) => {
    for (const item of items) {
      insertReview.run(item.product_id, item.reviewer_name, item.rating, item.comment);
    }
  });

  insertManyReviews(reviews);
  console.log(`Inserted ${reviews.length} reviews`);

  console.log("Database seeding completed!");
}

// Run seed if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase();
}