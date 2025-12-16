import "dotenv/config.js";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import routes from "./routes/index.js";
import { config } from "./config/index.js";
import { swaggerDocument } from "./config/swagger.js";
import { setCsrfToken } from "./middleware/csrf.middleware.js";
import { uploadsPath } from "./middleware/upload.middleware.js";

const app = express();

// Middleware
app.use(cors(config.cors));
app.use(express.json());
app.use(cookieParser());

// Set CSRF token cookie on all requests
app.use(setCsrfToken);

// Serve uploaded files
app.use("/uploads", express.static(uploadsPath));

// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.use("/api", routes);

// Start server
app.listen(config.port, () => {
  console.log(`Server running on http://localhost:${config.port}`);
  console.log(`Swagger UI available at http://localhost:${config.port}/api-docs`);
});
