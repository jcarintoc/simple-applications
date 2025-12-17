import db from "./database.js";

const hotels = [
  {
    name: "Grand Plaza Hotel",
    description:
      "Experience luxury in the heart of Manhattan. Our 5-star hotel offers stunning city views, world-class dining, and exceptional service. Perfect for business travelers and tourists alike.",
    location: "Manhattan",
    city: "New York",
    country: "USA",
    address: "768 Fifth Avenue, New York, NY 10019",
    price_per_night: 450,
    amenities: JSON.stringify([
      "Free WiFi",
      "Pool",
      "Spa",
      "Gym",
      "Restaurant",
      "Bar",
      "Room Service",
      "Concierge",
    ]),
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800",
    ]),
    rooms_available: 15,
  },
  {
    name: "Seaside Resort & Spa",
    description:
      "A tropical paradise on the beautiful shores of Miami Beach. Enjoy pristine beaches, rejuvenating spa treatments, and gourmet oceanfront dining.",
    location: "Miami Beach",
    city: "Miami",
    country: "USA",
    address: "4525 Collins Avenue, Miami Beach, FL 33140",
    price_per_night: 320,
    amenities: JSON.stringify([
      "Free WiFi",
      "Beach Access",
      "Pool",
      "Spa",
      "Gym",
      "Restaurant",
      "Bar",
      "Water Sports",
    ]),
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800",
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
    ]),
    rooms_available: 25,
  },
  {
    name: "Mountain View Lodge",
    description:
      "Escape to the Rocky Mountains for an unforgettable retreat. Cozy cabins, breathtaking views, and endless outdoor adventures await.",
    location: "Aspen",
    city: "Aspen",
    country: "USA",
    address: "315 E Dean Street, Aspen, CO 81611",
    price_per_night: 280,
    amenities: JSON.stringify([
      "Free WiFi",
      "Fireplace",
      "Ski Storage",
      "Hot Tub",
      "Restaurant",
      "Bar",
      "Hiking Trails",
    ]),
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1586375300773-8384e3e4916f?w=800",
      "https://images.unsplash.com/photo-1518602164578-cd0074062767?w=800",
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800",
    ]),
    rooms_available: 12,
  },
  {
    name: "The Ritz London",
    description:
      "Iconic luxury in the heart of London. Experience British elegance, afternoon tea, and impeccable service in our historic Mayfair location.",
    location: "Mayfair",
    city: "London",
    country: "UK",
    address: "150 Piccadilly, London W1J 9BR",
    price_per_night: 520,
    amenities: JSON.stringify([
      "Free WiFi",
      "Spa",
      "Gym",
      "Restaurant",
      "Bar",
      "Room Service",
      "Concierge",
      "Afternoon Tea",
    ]),
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800",
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800",
    ]),
    rooms_available: 20,
  },
  {
    name: "Tokyo Imperial Hotel",
    description:
      "Where tradition meets modernity. Discover authentic Japanese hospitality with cutting-edge amenities in the vibrant Ginza district.",
    location: "Ginza",
    city: "Tokyo",
    country: "Japan",
    address: "1-1-1 Uchisaiwaicho, Chiyoda-ku, Tokyo",
    price_per_night: 380,
    amenities: JSON.stringify([
      "Free WiFi",
      "Onsen",
      "Gym",
      "Restaurant",
      "Bar",
      "Tea Ceremony",
      "Concierge",
    ]),
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?w=800",
      "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800",
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800",
    ]),
    rooms_available: 18,
  },
  {
    name: "Parisian Boutique Hotel",
    description:
      "Charming boutique hotel in the artistic Le Marais district. Walk to the Louvre, Notre-Dame, and the best cafés in Paris.",
    location: "Le Marais",
    city: "Paris",
    country: "France",
    address: "20 Rue du Temple, 75004 Paris",
    price_per_night: 290,
    amenities: JSON.stringify([
      "Free WiFi",
      "Breakfast",
      "Bar",
      "Concierge",
      "Bicycle Rental",
    ]),
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1549294413-26f195200c16?w=800",
      "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800",
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800",
    ]),
    rooms_available: 8,
  },
  {
    name: "Barcelona Beach Hotel",
    description:
      "Modern beachfront hotel on the famous Barceloneta beach. Perfect for sun, sea, and exploring the vibrant Catalan culture.",
    location: "Barceloneta",
    city: "Barcelona",
    country: "Spain",
    address: "Passeig del Mare Nostrum, 19-21, 08039 Barcelona",
    price_per_night: 220,
    amenities: JSON.stringify([
      "Free WiFi",
      "Beach Access",
      "Pool",
      "Gym",
      "Restaurant",
      "Bar",
      "Rooftop Terrace",
    ]),
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800",
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
    ]),
    rooms_available: 22,
  },
  {
    name: "Sydney Harbour Hotel",
    description:
      "Wake up to stunning views of the Sydney Opera House and Harbour Bridge. Located in the historic Rocks district.",
    location: "The Rocks",
    city: "Sydney",
    country: "Australia",
    address: "176 Cumberland Street, The Rocks, NSW 2000",
    price_per_night: 340,
    amenities: JSON.stringify([
      "Free WiFi",
      "Pool",
      "Gym",
      "Restaurant",
      "Bar",
      "Harbor Views",
      "Concierge",
    ]),
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800",
    ]),
    rooms_available: 16,
  },
  {
    name: "Dubai Luxury Resort",
    description:
      "Opulent beachfront resort with private beach, world-class dining, and unparalleled luxury on the Palm Jumeirah.",
    location: "Palm Jumeirah",
    city: "Dubai",
    country: "UAE",
    address: "Palm Jumeirah, Dubai",
    price_per_night: 650,
    amenities: JSON.stringify([
      "Free WiFi",
      "Private Beach",
      "Pool",
      "Spa",
      "Gym",
      "Restaurant",
      "Bar",
      "Butler Service",
    ]),
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800",
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
    ]),
    rooms_available: 30,
  },
  {
    name: "Amsterdam Canal House",
    description:
      "Historic canal house hotel in the heart of Amsterdam. Experience Dutch charm with modern comfort.",
    location: "Canal Belt",
    city: "Amsterdam",
    country: "Netherlands",
    address: "Herengracht 341, 1016 AZ Amsterdam",
    price_per_night: 195,
    amenities: JSON.stringify([
      "Free WiFi",
      "Breakfast",
      "Bar",
      "Garden",
      "Bicycle Rental",
    ]),
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1549294413-26f195200c16?w=800",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800",
    ]),
    rooms_available: 10,
  },
  {
    name: "Santorini Sunset Villa",
    description:
      "Stunning cliff-side villa with infinity pool and breathtaking caldera views. The perfect romantic getaway in Greece.",
    location: "Oia",
    city: "Santorini",
    country: "Greece",
    address: "Oia, Santorini 847 02",
    price_per_night: 480,
    amenities: JSON.stringify([
      "Free WiFi",
      "Infinity Pool",
      "Breakfast",
      "Restaurant",
      "Bar",
      "Sunset Views",
      "Airport Transfer",
    ]),
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800",
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
    ]),
    rooms_available: 6,
  },
  {
    name: "Budget Inn Downtown",
    description:
      "Affordable and comfortable accommodation in downtown LA. Perfect for budget travelers exploring the city.",
    location: "Downtown",
    city: "Los Angeles",
    country: "USA",
    address: "930 Wilshire Blvd, Los Angeles, CA 90017",
    price_per_night: 89,
    amenities: JSON.stringify(["Free WiFi", "Breakfast", "Parking"]),
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800",
    ]),
    rooms_available: 40,
  },
];

function seed() {
  console.log("Seeding database with sample hotels...");

  const insertStmt = db.prepare(`
    INSERT INTO hotels (name, description, location, city, country, address, price_per_night, amenities, images, rooms_available)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const existingCount = (
    db.prepare("SELECT COUNT(*) as count FROM hotels").get() as { count: number }
  ).count;

  if (existingCount > 0) {
    console.log(`Database already has ${existingCount} hotels. Skipping seed.`);
    return;
  }

  for (const hotel of hotels) {
    insertStmt.run(
      hotel.name,
      hotel.description,
      hotel.location,
      hotel.city,
      hotel.country,
      hotel.address,
      hotel.price_per_night,
      hotel.amenities,
      hotel.images,
      hotel.rooms_available
    );
  }

  console.log(`Seeded ${hotels.length} hotels successfully!`);
}

seed();
