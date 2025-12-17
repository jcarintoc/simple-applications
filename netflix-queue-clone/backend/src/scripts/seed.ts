/**
 * Manual seed script to populate the database with titles
 * 
 * Usage:
 *   npm run seed          - Seed if database is empty
 *   npm run seed:force    - Force reseed (delete existing titles and reseed)
 */

import { db } from "../db/database.js";

const seedTitles = [
  // Using Lorem Picsum for better placeholder images with consistent IDs for each title
  ["Stranger Things", "show", "A group of kids uncover supernatural mysteries in their small town.", "Sci-Fi", 2016, null, 4, "https://picsum.photos/seed/stranger-things/300/450"],
  ["The Witcher", "show", "A mutated monster hunter struggles to find his place in a world.", "Fantasy", 2019, null, 3, "https://picsum.photos/seed/the-witcher/300/450"],
  ["Breaking Bad", "show", "A chemistry teacher turns to cooking meth to secure his family's future.", "Drama", 2008, null, 5, "https://picsum.photos/seed/breaking-bad/300/450"],
  ["The Crown", "show", "The reign of Queen Elizabeth II from her wedding to the present day.", "Drama", 2016, null, 6, "https://picsum.photos/seed/the-crown/300/450"],
  ["Squid Game", "show", "Contestants play deadly children's games for a chance at a huge cash prize.", "Thriller", 2021, null, 2, "https://picsum.photos/seed/squid-game/300/450"],
  ["Inception", "movie", "A thief who enters people's dreams takes on one last job.", "Sci-Fi", 2010, 148, null, "https://picsum.photos/seed/inception/300/450"],
  ["The Shawshank Redemption", "movie", "Two imprisoned men bond over several years, finding solace and redemption.", "Drama", 1994, 142, null, "https://picsum.photos/seed/shawshank/300/450"],
  ["Pulp Fiction", "movie", "Various interconnected stories of criminals in Los Angeles.", "Crime", 1994, 154, null, "https://picsum.photos/seed/pulp-fiction/300/450"],
  ["The Dark Knight", "movie", "Batman faces the Joker, a criminal mastermind who wants chaos.", "Action", 2008, 152, null, "https://picsum.photos/seed/dark-knight/300/450"],
  ["Interstellar", "movie", "A team of explorers travel through a wormhole in search of a new home.", "Sci-Fi", 2014, 169, null, "https://picsum.photos/seed/interstellar/300/450"],
  ["Parasite", "movie", "A poor family schemes to become employed by a wealthy family.", "Thriller", 2019, 132, null, "https://picsum.photos/seed/parasite/300/450"],
  ["Wednesday", "show", "Wednesday Addams attends a new school and solves a mystery.", "Comedy", 2022, null, 1, "https://picsum.photos/seed/wednesday/300/450"],
];

function seedDatabase(force: boolean = false) {
  const titleCount = db.prepare("SELECT COUNT(*) as count FROM titles").get() as { count: number };
  
  if (force) {
    console.log("Force reseeding: Deleting all existing titles...");
    db.prepare("DELETE FROM titles").run();
    console.log("All titles deleted.");
  } else if (titleCount.count > 0) {
    console.log(`Database already contains ${titleCount.count} titles. Skipping seed.`);
    console.log("To force reseed, run: npm run seed:force");
    return;
  }

  console.log("Seeding database with titles...");
  const insertTitle = db.prepare(`
    INSERT INTO titles (title, type, description, genre, release_year, duration_minutes, seasons, thumbnail_url)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const title of seedTitles) {
    insertTitle.run(...title);
  }

  console.log(`✅ Successfully seeded ${seedTitles.length} titles!`);
}

// Check if --force flag is passed
const force = process.argv.includes("--force") || process.argv.includes("-f");
seedDatabase(force);