import { db } from "./database.js";

export function seedDatabase(): void {
  // Check if properties already exist
  const existingProperties = db.prepare("SELECT COUNT(*) as count FROM properties").get() as { count: number };
  if (existingProperties.count > 0) {
    return; // Already seeded
  }

  // Get or create a default user for properties
  let defaultUser = db.prepare("SELECT id FROM users LIMIT 1").get() as { id: number } | undefined;
  
  if (!defaultUser) {
    // Create a default user if none exists
    const hashedPassword = "$2b$10$rK9X8J5YqH8vN2mZ3pL5qeKLmNpQrS7tUvWxYzAbCdEfGhIjKlMnO"; // "password"
    const result = db
      .prepare("INSERT INTO users (email, password, name) VALUES (?, ?, ?)")
      .run("host@example.com", hashedPassword, "Property Host");
    defaultUser = { id: result.lastInsertRowid as number };
  }

  const ownerId = defaultUser.id;

  const properties = [
    {
      owner_id: ownerId,
      title: "Cozy Downtown Apartment",
      description: "Beautiful modern apartment in the heart of the city. Perfect for couples and solo travelers.",
      location: "New York, NY",
      price_per_night: 120,
      max_guests: 2,
      bedrooms: 1,
      bathrooms: 1,
      amenities: JSON.stringify(["WiFi", "Kitchen", "TV", "Air Conditioning"]),
      image_url: "https://picsum.photos/seed/property1/800/600",
    },
    {
      owner_id: ownerId,
      title: "Beachfront Villa",
      description: "Stunning beachfront villa with ocean views. Private pool and direct beach access.",
      location: "Miami, FL",
      price_per_night: 350,
      max_guests: 6,
      bedrooms: 3,
      bathrooms: 2,
      amenities: JSON.stringify(["WiFi", "Pool", "Kitchen", "Parking", "Beach Access"]),
      image_url: "https://picsum.photos/seed/property2/800/600",
    },
    {
      owner_id: ownerId,
      title: "Mountain Cabin Retreat",
      description: "Peaceful cabin surrounded by nature. Perfect for a relaxing getaway.",
      location: "Aspen, CO",
      price_per_night: 200,
      max_guests: 4,
      bedrooms: 2,
      bathrooms: 1,
      amenities: JSON.stringify(["WiFi", "Fireplace", "Kitchen", "Mountain View"]),
      image_url: "https://picsum.photos/seed/property3/800/600",
    },
    {
      owner_id: ownerId,
      title: "Luxury Penthouse Suite",
      description: "Elegant penthouse with panoramic city views. High-end amenities included.",
      location: "Los Angeles, CA",
      price_per_night: 500,
      max_guests: 4,
      bedrooms: 2,
      bathrooms: 2,
      amenities: JSON.stringify(["WiFi", "Pool", "Gym", "Concierge", "Parking", "City View"]),
      image_url: "https://picsum.photos/seed/property4/800/600",
    },
    {
      owner_id: ownerId,
      title: "Charming Cottage",
      description: "Quaint cottage with garden. Ideal for a romantic weekend or family stay.",
      location: "Portland, OR",
      price_per_night: 150,
      max_guests: 3,
      bedrooms: 2,
      bathrooms: 1,
      amenities: JSON.stringify(["WiFi", "Kitchen", "Garden", "Pet Friendly"]),
      image_url: "https://picsum.photos/seed/property5/800/600",
    },
    {
      owner_id: ownerId,
      title: "Modern Studio Loft",
      description: "Stylish studio loft in trendy neighborhood. Walkable to restaurants and shops.",
      location: "San Francisco, CA",
      price_per_night: 180,
      max_guests: 2,
      bedrooms: 0,
      bathrooms: 1,
      amenities: JSON.stringify(["WiFi", "Kitchen", "TV", "Central Location"]),
      image_url: "https://picsum.photos/seed/property6/800/600",
    },
    {
      owner_id: ownerId,
      title: "Family-Friendly House",
      description: "Spacious family home with backyard. Great for extended stays.",
      location: "Austin, TX",
      price_per_night: 220,
      max_guests: 8,
      bedrooms: 4,
      bathrooms: 3,
      amenities: JSON.stringify(["WiFi", "Kitchen", "TV", "Backyard", "Parking", "Washer/Dryer"]),
      image_url: "https://picsum.photos/seed/property7/800/600",
    },
    {
      owner_id: ownerId,
      title: "Riverside Bungalow",
      description: "Peaceful bungalow by the river. Perfect for nature lovers.",
      location: "Seattle, WA",
      price_per_night: 170,
      max_guests: 4,
      bedrooms: 2,
      bathrooms: 1,
      amenities: JSON.stringify(["WiFi", "Kitchen", "River View", "Fishing Access"]),
      image_url: "https://picsum.photos/seed/property8/800/600",
    },
    {
      owner_id: ownerId,
      title: "Historic Townhouse",
      description: "Beautifully restored historic townhouse with original features.",
      location: "Boston, MA",
      price_per_night: 250,
      max_guests: 5,
      bedrooms: 3,
      bathrooms: 2,
      amenities: JSON.stringify(["WiFi", "Kitchen", "Historic Charm", "Central Heating"]),
      image_url: "https://picsum.photos/seed/property9/800/600",
    },
    {
      owner_id: ownerId,
      title: "Desert Oasis",
      description: "Unique desert retreat with pool and stunning sunset views.",
      location: "Phoenix, AZ",
      price_per_night: 300,
      max_guests: 6,
      bedrooms: 3,
      bathrooms: 2,
      amenities: JSON.stringify(["WiFi", "Pool", "Kitchen", "Desert View", "Outdoor Shower"]),
      image_url: "https://picsum.photos/seed/property10/800/600",
    },
  ];

  const insertProperty = db.prepare(`
    INSERT INTO properties (
      owner_id, title, description, location, price_per_night,
      max_guests, bedrooms, bathrooms, amenities, image_url
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertMany = db.transaction((props) => {
    for (const prop of props) {
      insertProperty.run(
        prop.owner_id,
        prop.title,
        prop.description,
        prop.location,
        prop.price_per_night,
        prop.max_guests,
        prop.bedrooms,
        prop.bathrooms,
        prop.amenities,
        prop.image_url
      );
    }
  });

  insertMany(properties);
  console.log("Database seeded with sample properties");
}
