export const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Bookmark Manager API",
    version: "1.0.0",
    description: "Bookmark Manager API with authentication and CSRF protection",
  },
  servers: [
    {
      url: "/api",
      description: "API Server",
    },
  ],
  tags: [
    { name: "Auth", description: "Authentication endpoints" },
    { name: "Bookmarks", description: "Bookmark management endpoints" },
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
    "/bookmarks/csrf-token": {
      get: {
        tags: ["Bookmarks"],
        summary: "Get CSRF token",
        description: "Returns a CSRF token required for create/update/delete operations. Requires authentication.",
        responses: {
          200: {
            description: "CSRF token generated",
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
    "/bookmarks": {
      get: {
        tags: ["Bookmarks"],
        summary: "Get all bookmarks",
        description: "Returns paginated bookmarks for the authenticated user with optional filtering",
        parameters: [
          {
            name: "search",
            in: "query",
            schema: { type: "string" },
            description: "Search in title, description, and URL",
          },
          {
            name: "tags",
            in: "query",
            schema: { type: "string" },
            description: "Comma-separated list of tag names to filter by",
          },
          {
            name: "page",
            in: "query",
            schema: { type: "integer", default: 1 },
            description: "Page number for pagination",
          },
          {
            name: "limit",
            in: "query",
            schema: { type: "integer", default: 10 },
            description: "Number of items per page",
          },
        ],
        responses: {
          200: {
            description: "Paginated list of bookmarks",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/BookmarkWithTags" },
                    },
                    pagination: {
                      type: "object",
                      properties: {
                        page: { type: "integer", example: 1 },
                        limit: { type: "integer", example: 10 },
                        total: { type: "integer", example: 42 },
                        totalPages: { type: "integer", example: 5 },
                      },
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
        tags: ["Bookmarks"],
        summary: "Create a new bookmark",
        description: "Creates a new bookmark. Requires CSRF token in x-csrf-token header.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateBookmarkRequest" },
              example: {
                url: "https://example.com",
                title: "Example Website",
                description: "A helpful website",
                tags: ["web", "tutorial"],
              },
            },
          },
        },
        parameters: [
          {
            name: "x-csrf-token",
            in: "header",
            required: true,
            schema: { type: "string" },
            description: "CSRF token from /bookmarks/csrf-token",
          },
        ],
        responses: {
          201: {
            description: "Bookmark created successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string" },
                    bookmark: { $ref: "#/components/schemas/BookmarkWithTags" },
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
            description: "Invalid CSRF token",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
    "/bookmarks/tags": {
      get: {
        tags: ["Bookmarks"],
        summary: "Get all tags",
        description: "Returns all available tags",
        responses: {
          200: {
            description: "List of tags",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    tags: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Tag" },
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
    },
    "/bookmarks/{id}": {
      get: {
        tags: ["Bookmarks"],
        summary: "Get a single bookmark",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
            description: "Bookmark ID",
          },
        ],
        responses: {
          200: {
            description: "Bookmark details",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    bookmark: { $ref: "#/components/schemas/BookmarkWithTags" },
                  },
                },
              },
            },
          },
          404: {
            description: "Bookmark not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
      put: {
        tags: ["Bookmarks"],
        summary: "Update a bookmark",
        description: "Updates an existing bookmark. Requires CSRF token in x-csrf-token header.",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
            description: "Bookmark ID",
          },
          {
            name: "x-csrf-token",
            in: "header",
            required: true,
            schema: { type: "string" },
            description: "CSRF token from /bookmarks/csrf-token",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateBookmarkRequest" },
            },
          },
        },
        responses: {
          200: {
            description: "Bookmark updated successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string" },
                    bookmark: { $ref: "#/components/schemas/BookmarkWithTags" },
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
          403: {
            description: "Invalid CSRF token",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          404: {
            description: "Bookmark not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
      delete: {
        tags: ["Bookmarks"],
        summary: "Delete a bookmark",
        description: "Deletes a bookmark. Requires CSRF token in x-csrf-token header.",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
            description: "Bookmark ID",
          },
          {
            name: "x-csrf-token",
            in: "header",
            required: true,
            schema: { type: "string" },
            description: "CSRF token from /bookmarks/csrf-token",
          },
        ],
        responses: {
          200: {
            description: "Bookmark deleted successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Bookmark deleted successfully" },
                  },
                },
              },
            },
          },
          403: {
            description: "Invalid CSRF token",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          404: {
            description: "Bookmark not found",
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
      Tag: {
        type: "object",
        properties: {
          id: { type: "integer" },
          name: { type: "string" },
          created_at: { type: "string", format: "date-time" },
        },
      },
      Bookmark: {
        type: "object",
        properties: {
          id: { type: "integer" },
          user_id: { type: "integer" },
          url: { type: "string", format: "uri" },
          title: { type: "string" },
          description: { type: "string", nullable: true },
          created_at: { type: "string", format: "date-time" },
          updated_at: { type: "string", format: "date-time" },
        },
      },
      BookmarkWithTags: {
        allOf: [
          { $ref: "#/components/schemas/Bookmark" },
          {
            type: "object",
            properties: {
              tags: {
                type: "array",
                items: { $ref: "#/components/schemas/Tag" },
              },
            },
          },
        ],
      },
      CreateBookmarkRequest: {
        type: "object",
        required: ["url", "title"],
        properties: {
          url: { type: "string", format: "uri" },
          title: { type: "string", minLength: 1, maxLength: 255 },
          description: { type: "string" },
          tags: {
            type: "array",
            items: { type: "string" },
            description: "Array of tag names",
          },
        },
      },
      UpdateBookmarkRequest: {
        type: "object",
        properties: {
          url: { type: "string", format: "uri" },
          title: { type: "string", minLength: 1, maxLength: 255 },
          description: { type: "string" },
          tags: {
            type: "array",
            items: { type: "string" },
            description: "Array of tag names (replaces all existing tags)",
          },
        },
      },
    },
  },
};
