import "dotenv/config.js";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import routes from "./routes/index.js";
import { config } from "./config/index.js";
import { swaggerDocument } from "./config/swagger.js";
import { setCsrfToken } from "./middleware/csrf.middleware.js";
import { setSessionId } from "./middleware/session.middleware.js";

const app = express();

// Middleware
app.use(cors(config.cors));
app.use(express.json());
app.use(cookieParser());

// Set session ID for cart tracking
app.use(setSessionId);

// Set CSRF token for all requests
app.use(setCsrfToken);

// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.use("/api", routes);

// Start server
app.listen(config.port, () => {
  console.log(`Server running on http://localhost:${config.port}`);
  console.log(`Swagger UI available at http://localhost:${config.port}/api-docs`);
});
