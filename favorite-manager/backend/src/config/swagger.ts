export const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Favorite manager API",
    version: "1.0.0",
    description: "Favorite manager API with authentication and CSRF protection",
  },
  servers: [
    {
      url: "/api",
      description: "API Server",
    },
  ],
  tags: [
    { name: "Auth", description: "Authentication endpoints" },
    { name: "Favorites", description: "Favorites management endpoints" },
    { name: "CSRF", description: "CSRF token endpoint" },
    { name: "Health", description: "Health check" },
  ],
  paths: {
    "/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Register a new user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/RegisterRequest" },
              example: {
                email: "user@example.com",
                password: "password123",
                name: "John Doe",
              },
            },
          },
        },
        responses: {
          201: {
            description: "User created successfully",
            headers: {
              "Set-Cookie": {
                schema: { type: "string" },
                description: "Auth token cookie",
              },
            },
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/AuthResponse" },
              },
            },
          },
          400: {
            description: "Validation error or email already registered",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
    "/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LoginRequest" },
              example: {
                email: "user@example.com",
                password: "password123",
              },
            },
          },
        },
        responses: {
          200: {
            description: "Login successful",
            headers: {
              "Set-Cookie": {
                schema: { type: "string" },
                description: "Auth token cookie",
              },
            },
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/AuthResponse" },
              },
            },
          },
          401: {
            description: "Invalid credentials",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
    "/auth/me": {
      get: {
        tags: ["Auth"],
        summary: "Get current user",
        description: "Returns the authenticated user's info. Requires valid access token cookie.",
        responses: {
          200: {
            description: "Current user info",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    user: { $ref: "#/components/schemas/User" },
                  },
                },
              },
            },
          },
          401: {
            description: "Not authenticated or token expired",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
    "/auth/refresh": {
      post: {
        tags: ["Auth"],
        summary: "Refresh access token",
        description: "Uses the refresh token cookie to generate new access and refresh tokens",
        responses: {
          200: {
            description: "Tokens refreshed",
            headers: {
              "Set-Cookie": {
                schema: { type: "string" },
                description: "New access and refresh token cookies",
              },
            },
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Tokens refreshed" },
                  },
                },
              },
            },
          },
          401: {
            description: "No refresh token or invalid refresh token",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
    "/auth/logout": {
      post: {
        tags: ["Auth"],
        summary: "Logout user",
        description: "Clears both access and refresh token cookies",
        responses: {
          200: {
            description: "Logged out successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Logged out successfully" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/csrf-token": {
      get: {
        tags: ["CSRF"],
        summary: "Get CSRF token",
        description: "Returns a CSRF token for state-changing operations. Requires authentication.",
        security: [{ cookieAuth: [] }],
        responses: {
          200: {
            description: "CSRF token",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    csrfToken: { type: "string" },
                  },
                },
              },
            },
          },
          401: {
            description: "Not authenticated",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
    "/favorites": {
      get: {
        tags: ["Favorites"],
        summary: "Get all favorites",
        description: "Returns all favorites for the authenticated user. Requires authentication.",
        security: [{ cookieAuth: [] }],
        responses: {
          200: {
            description: "List of favorites",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    favorites: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Favorite" },
                    },
                  },
                },
              },
            },
          },
          401: {
            description: "Not authenticated",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
      post: {
        tags: ["Favorites"],
        summary: "Create a favorite",
        description: "Creates a new favorite item. Requires authentication and CSRF token.",
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateFavoriteRequest" },
              example: {
                name: "The Matrix",
                category: "Movie",
              },
            },
          },
        },
        responses: {
          201: {
            description: "Favorite created successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    favorite: { $ref: "#/components/schemas/Favorite" },
                  },
                },
              },
            },
          },
          400: {
            description: "Validation error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          401: {
            description: "Not authenticated",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          403: {
            description: "CSRF token required or invalid",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
    "/favorites/{id}": {
      put: {
        tags: ["Favorites"],
        summary: "Update a favorite",
        description: "Updates a favorite by ID. Requires authentication and CSRF token.",
        security: [{ cookieAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
            description: "Favorite ID",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateFavoriteRequest" },
              example: {
                name: "The Matrix Reloaded",
                category: "Movie",
              },
            },
          },
        },
        responses: {
          200: {
            description: "Favorite updated successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    favorite: { $ref: "#/components/schemas/Favorite" },
                  },
                },
              },
            },
          },
          400: {
            description: "Validation error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          401: {
            description: "Not authenticated",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          403: {
            description: "CSRF token required or invalid",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          404: {
            description: "Favorite not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
      delete: {
        tags: ["Favorites"],
        summary: "Delete a favorite",
        description: "Deletes a favorite by ID. Requires authentication and CSRF token.",
        security: [{ cookieAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
            description: "Favorite ID",
          },
        ],
        responses: {
          200: {
            description: "Favorite deleted successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Favorite deleted successfully" },
                  },
                },
              },
            },
          },
          401: {
            description: "Not authenticated",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          403: {
            description: "CSRF token required or invalid",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          404: {
            description: "Favorite not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
    "/health": {
      get: {
        tags: ["Health"],
        summary: "Health check",
        responses: {
          200: {
            description: "Server is healthy",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "ok" },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      RegisterRequest: {
        type: "object",
        required: ["email", "password", "name"],
        properties: {
          email: { type: "string", format: "email" },
          password: { type: "string", minLength: 1 },
          name: { type: "string", minLength: 1 },
        },
      },
      LoginRequest: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email" },
          password: { type: "string" },
        },
      },
      User: {
        type: "object",
        properties: {
          id: { type: "integer" },
          email: { type: "string" },
          name: { type: "string" },
        },
      },
      AuthResponse: {
        type: "object",
        properties: {
          message: { type: "string" },
          user: { $ref: "#/components/schemas/User" },
        },
      },
      Error: {
        type: "object",
        properties: {
          error: { type: "string" },
        },
      },
      Favorite: {
        type: "object",
        properties: {
          id: { type: "integer" },
          name: { type: "string" },
          category: {
            type: "string",
            enum: ["Movie", "Song", "Book", "Game", "Show", "Other"],
          },
          created_at: { type: "string", format: "date-time" },
        },
      },
      CreateFavoriteRequest: {
        type: "object",
        required: ["name", "category"],
        properties: {
          name: { type: "string", minLength: 1 },
          category: {
            type: "string",
            enum: ["Movie", "Song", "Book", "Game", "Show", "Other"],
          },
        },
      },
      UpdateFavoriteRequest: {
        type: "object",
        properties: {
          name: { type: "string", minLength: 1 },
          category: {
            type: "string",
            enum: ["Movie", "Song", "Book", "Game", "Show", "Other"],
          },
        },
      },
    },
    securitySchemes: {
      cookieAuth: {
        type: "apiKey",
        in: "cookie",
        name: "accessToken",
      },
    },
  },
};
