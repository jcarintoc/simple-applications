import type Database from "better-sqlite3";

export function seedDatabase(db: Database.Database): void {
  // Check if job_posts table is empty
  const existingJobs = db.prepare("SELECT COUNT(*) as count FROM job_posts").get() as { count: number };

  if (existingJobs.count > 0) {
    // Already seeded
    return;
  }

  // Seed job posts
  const jobPosts = [
    {
      company_name: "TechCorp",
      job_title: "Senior Software Engineer",
      description: "We are looking for a Senior Software Engineer to join our team. You will be responsible for designing and developing scalable web applications using modern technologies. Must have 5+ years of experience with JavaScript, TypeScript, and React.",
      location: "San Francisco, CA",
      employment_type: "full-time",
      experience_level: "senior"
    },
    {
      company_name: "DataSystems Inc",
      job_title: "Data Analyst",
      description: "Seeking a Data Analyst to help drive business decisions through data insights. You will work with SQL, Python, and BI tools to analyze large datasets and create reports for stakeholders.",
      location: "New York, NY",
      employment_type: "full-time",
      experience_level: "mid"
    },
    {
      company_name: "StartupHub",
      job_title: "Frontend Developer",
      description: "Join our fast-growing startup as a Frontend Developer. You'll build beautiful, responsive user interfaces using React, TypeScript, and modern CSS frameworks. Experience with UI/UX design principles is a plus.",
      location: "Austin, TX",
      employment_type: "full-time",
      experience_level: "mid"
    },
    {
      company_name: "Cloud Solutions",
      job_title: "DevOps Engineer",
      description: "We're hiring a DevOps Engineer to manage our cloud infrastructure. You'll work with AWS, Docker, Kubernetes, and CI/CD pipelines to ensure reliable and scalable deployments.",
      location: "Seattle, WA",
      employment_type: "full-time",
      experience_level: "senior"
    },
    {
      company_name: "Mobile First",
      job_title: "iOS Developer",
      description: "Looking for an iOS Developer to build native mobile applications. Must have strong Swift skills and experience with UIKit, SwiftUI, and RESTful APIs.",
      location: "Los Angeles, CA",
      employment_type: "full-time",
      experience_level: "mid"
    },
    {
      company_name: "FinTech Solutions",
      job_title: "Backend Developer",
      description: "Join our FinTech team as a Backend Developer. You'll design and implement secure, scalable APIs using Node.js, Express, and PostgreSQL. Experience with payment processing systems is a plus.",
      location: "Chicago, IL",
      employment_type: "full-time",
      experience_level: "mid"
    },
    {
      company_name: "GameStudio",
      job_title: "Game Developer Intern",
      description: "Internship opportunity for aspiring game developers. You'll work with Unity or Unreal Engine to build engaging gameplay experiences. No prior experience required, but passion for gaming is a must!",
      location: "Remote",
      employment_type: "internship",
      experience_level: "entry"
    },
    {
      company_name: "AI Research Lab",
      job_title: "Machine Learning Engineer",
      description: "We're seeking a Machine Learning Engineer to develop AI models for computer vision and NLP tasks. Strong Python skills and experience with TensorFlow or PyTorch required.",
      location: "Boston, MA",
      employment_type: "full-time",
      experience_level: "senior"
    },
    {
      company_name: "E-Commerce Giant",
      job_title: "Product Manager",
      description: "Looking for a Product Manager to lead our e-commerce platform initiatives. You'll work with cross-functional teams to define product roadmaps and deliver features that drive customer satisfaction.",
      location: "San Jose, CA",
      employment_type: "full-time",
      experience_level: "executive"
    },
    {
      company_name: "DesignStudio",
      job_title: "UI/UX Designer",
      description: "Join our design team to create beautiful and intuitive user experiences. You'll work on web and mobile applications using Figma, conducting user research, and collaborating with developers.",
      location: "Portland, OR",
      employment_type: "full-time",
      experience_level: "mid"
    },
    {
      company_name: "Consulting Group",
      job_title: "IT Consultant",
      description: "We're hiring IT Consultants to work with clients on digital transformation projects. You'll provide technical guidance, implement solutions, and ensure successful project delivery.",
      location: "Washington, DC",
      employment_type: "contract",
      experience_level: "senior"
    },
    {
      company_name: "Cybersecurity Experts",
      job_title: "Security Analyst",
      description: "Seeking a Security Analyst to protect our systems from cyber threats. You'll monitor networks, conduct vulnerability assessments, and respond to security incidents.",
      location: "Dallas, TX",
      employment_type: "full-time",
      experience_level: "mid"
    },
    {
      company_name: "Web Agency",
      job_title: "Full Stack Developer",
      description: "Join our web agency as a Full Stack Developer. You'll work on diverse client projects using JavaScript, React, Node.js, and various databases. Experience with Agile methodologies preferred.",
      location: "Denver, CO",
      employment_type: "full-time",
      experience_level: "mid"
    },
    {
      company_name: "HealthTech Innovators",
      job_title: "Software Engineer - Healthcare",
      description: "Looking for a Software Engineer to build healthcare applications that improve patient outcomes. You'll work with HIPAA-compliant systems, HL7/FHIR standards, and modern web technologies.",
      location: "Philadelphia, PA",
      employment_type: "full-time",
      experience_level: "senior"
    },
    {
      company_name: "Educational Platform",
      job_title: "Junior Developer",
      description: "Entry-level opportunity for recent graduates or bootcamp completers. You'll work on our educational platform using React, Node.js, and MongoDB. We provide mentorship and training.",
      location: "Remote",
      employment_type: "full-time",
      experience_level: "entry"
    }
  ];

  const insertJob = db.prepare(`
    INSERT INTO job_posts (company_name, job_title, description, location, employment_type, experience_level)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  for (const job of jobPosts) {
    insertJob.run(
      job.company_name,
      job.job_title,
      job.description,
      job.location,
      job.employment_type,
      job.experience_level
    );
  }

  console.log(`Seeded ${jobPosts.length} job posts`);
}
