export const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Netflix Queue Clone API",
    version: "1.0.0",
    description: "Netflix Queue Clone API with authentication, CSRF protection, watchlist, ratings, and continue watching",
  },
  servers: [
    {
      url: "/api",
      description: "API Server",
    },
  ],
  tags: [
    { name: "Auth", description: "Authentication endpoints" },
    { name: "Titles", description: "Browse movies and shows" },
    { name: "Watchlist", description: "Manage watchlist" },
    { name: "Ratings", description: "Rate titles" },
    { name: "Continue Watching", description: "Track watch progress" },
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
            },
          },
        },
        responses: {
          201: {
            description: "User created successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/AuthResponse" },
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
            },
          },
        },
        responses: {
          200: {
            description: "Login successful",
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
    "/auth/refresh": {
      post: {
        tags: ["Auth"],
        summary: "Refresh access token",
        responses: {
          200: { description: "Tokens refreshed" },
          401: { description: "Invalid refresh token" },
        },
      },
    },
    "/auth/logout": {
      post: {
        tags: ["Auth"],
        summary: "Logout user",
        responses: {
          200: { description: "Logged out successfully" },
        },
      },
    },
    "/titles": {
      get: {
        tags: ["Titles"],
        summary: "Get all titles",
        description: "Returns all movies and shows. Optionally filter by type.",
        parameters: [
          {
            name: "type",
            in: "query",
            schema: { type: "string", enum: ["movie", "show"] },
            description: "Filter by title type",
          },
        ],
        responses: {
          200: {
            description: "List of titles",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    titles: {
                      type: "array",
                      items: { $ref: "#/components/schemas/TitleWithUserData" },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/titles/search": {
      get: {
        tags: ["Titles"],
        summary: "Search titles",
        parameters: [
          {
            name: "q",
            in: "query",
            required: true,
            schema: { type: "string" },
            description: "Search query",
          },
        ],
        responses: {
          200: {
            description: "Search results",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    titles: {
                      type: "array",
                      items: { $ref: "#/components/schemas/TitleWithUserData" },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/titles/genres": {
      get: {
        tags: ["Titles"],
        summary: "Get all genres",
        responses: {
          200: {
            description: "List of genres",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    genres: {
                      type: "array",
                      items: { type: "string" },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/watchlist": {
      get: {
        tags: ["Watchlist"],
        summary: "Get user's watchlist",
        description: "Requires authentication",
        responses: {
          200: {
            description: "Watchlist titles",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    titles: {
                      type: "array",
                      items: { $ref: "#/components/schemas/TitleWithUserData" },
                    },
                  },
                },
              },
            },
          },
          401: { description: "Not authenticated" },
        },
      },
    },
    "/watchlist/{titleId}": {
      post: {
        tags: ["Watchlist"],
        summary: "Toggle watchlist",
        description: "Add or remove title from watchlist. Requires CSRF token.",
        parameters: [
          {
            name: "titleId",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          200: {
            description: "Watchlist updated",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string" },
                    in_watchlist: { type: "boolean" },
                  },
                },
              },
            },
          },
        },
      },
      delete: {
        tags: ["Watchlist"],
        summary: "Remove from watchlist",
        description: "Requires CSRF token",
        parameters: [
          {
            name: "titleId",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          200: { description: "Removed from watchlist" },
        },
      },
    },
    "/ratings/{titleId}": {
      post: {
        tags: ["Ratings"],
        summary: "Rate a title",
        description: "Requires authentication and CSRF token",
        parameters: [
          {
            name: "titleId",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["rating"],
                properties: {
                  rating: { type: "integer", minimum: 1, maximum: 5 },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Rating saved",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string" },
                    rating: { type: "integer" },
                    avg_rating: { type: "number", nullable: true },
                  },
                },
              },
            },
          },
        },
      },
      delete: {
        tags: ["Ratings"],
        summary: "Remove rating",
        description: "Requires CSRF token",
        parameters: [
          {
            name: "titleId",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          200: { description: "Rating removed" },
        },
      },
    },
    "/continue-watching": {
      get: {
        tags: ["Continue Watching"],
        summary: "Get continue watching list",
        description: "Session-based, no authentication required",
        responses: {
          200: {
            description: "Continue watching items",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    items: {
                      type: "array",
                      items: { $ref: "#/components/schemas/ContinueWatchingItem" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      delete: {
        tags: ["Continue Watching"],
        summary: "Clear all continue watching",
        responses: {
          200: { description: "Cleared" },
        },
      },
    },
    "/continue-watching/{titleId}": {
      post: {
        tags: ["Continue Watching"],
        summary: "Update watch progress",
        parameters: [
          {
            name: "titleId",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["progress_percent"],
                properties: {
                  progress_percent: { type: "integer", minimum: 0, maximum: 100 },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Progress updated" },
        },
      },
      delete: {
        tags: ["Continue Watching"],
        summary: "Remove from continue watching",
        parameters: [
          {
            name: "titleId",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          200: { description: "Removed" },
        },
      },
    },
    "/health": {
      get: {
        tags: ["Health"],
        summary: "Health check",
        responses: {
          200: { description: "Server is healthy" },
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
          password: { type: "string" },
          name: { type: "string" },
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
      Title: {
        type: "object",
        properties: {
          id: { type: "integer" },
          title: { type: "string" },
          type: { type: "string", enum: ["movie", "show"] },
          description: { type: "string", nullable: true },
          genre: { type: "string" },
          release_year: { type: "integer" },
          duration_minutes: { type: "integer", nullable: true },
          seasons: { type: "integer", nullable: true },
          thumbnail_url: { type: "string", nullable: true },
          created_at: { type: "string", format: "date-time" },
        },
      },
      TitleWithUserData: {
        allOf: [
          { $ref: "#/components/schemas/Title" },
          {
            type: "object",
            properties: {
              in_watchlist: { type: "boolean" },
              user_rating: { type: "integer", nullable: true },
              avg_rating: { type: "number", nullable: true },
            },
          },
        ],
      },
      ContinueWatchingItem: {
        type: "object",
        properties: {
          id: { type: "integer" },
          session_id: { type: "string" },
          title_id: { type: "integer" },
          progress_percent: { type: "integer" },
          last_watched: { type: "string", format: "date-time" },
          title: { $ref: "#/components/schemas/Title" },
        },
      },
    },
  },
};
