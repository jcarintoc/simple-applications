export const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Event Manager API",
    version: "1.0.0",
    description: "Event Manager API with authentication and CSRF protection",
  },
  servers: [
    {
      url: "/api",
      description: "API Server",
    },
  ],
  tags: [
    { name: "Auth", description: "Authentication endpoints" },
    { name: "Events", description: "Event management endpoints" },
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
    "/events": {
      get: {
        tags: ["Events"],
        summary: "Get all events",
        description: "Get paginated list of events with optional filters. Requires authentication.",
        parameters: [
          {
            name: "search",
            in: "query",
            description: "Search by title",
            schema: { type: "string" },
          },
          {
            name: "filter",
            in: "query",
            description: "Filter by date range",
            schema: { type: "string", enum: ["today", "week", "all"] },
          },
          {
            name: "page",
            in: "query",
            description: "Page number (default: 1)",
            schema: { type: "integer", default: 1 },
          },
          {
            name: "limit",
            in: "query",
            description: "Items per page (default: 10)",
            schema: { type: "integer", default: 10 },
          },
        ],
        responses: {
          200: {
            description: "List of events",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/PaginatedEventsResponse" },
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
        tags: ["Events"],
        summary: "Create new event",
        description: "Create a new event. Requires authentication.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateEventRequest" },
              example: {
                title: "Team Meeting",
                date: "2025-12-15",
                time: "14:00",
                description: "Weekly sync",
                tag: "work",
              },
            },
          },
        },
        responses: {
          201: {
            description: "Event created",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string" },
                    event: { $ref: "#/components/schemas/Event" },
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
        },
      },
    },
    "/events/{id}": {
      get: {
        tags: ["Events"],
        summary: "Get event by ID",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          200: {
            description: "Event details",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    event: { $ref: "#/components/schemas/Event" },
                  },
                },
              },
            },
          },
          404: {
            description: "Event not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
      put: {
        tags: ["Events"],
        summary: "Update event",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateEventRequest" },
            },
          },
        },
        responses: {
          200: {
            description: "Event updated",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string" },
                    event: { $ref: "#/components/schemas/Event" },
                  },
                },
              },
            },
          },
          404: {
            description: "Event not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
      delete: {
        tags: ["Events"],
        summary: "Delete event",
        description: "Delete an event. Requires X-CSRF-Protection header.",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
          {
            name: "X-CSRF-Protection",
            in: "header",
            required: true,
            description: "CSRF protection header (must be '1')",
            schema: { type: "string", example: "1" },
          },
        ],
        responses: {
          200: {
            description: "Event deleted",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Event deleted successfully" },
                  },
                },
              },
            },
          },
          403: {
            description: "CSRF protection header missing",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          404: {
            description: "Event not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
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
      Event: {
        type: "object",
        properties: {
          id: { type: "integer" },
          title: { type: "string" },
          date: { type: "string", format: "date", example: "2025-12-15" },
          time: { type: "string", example: "14:00" },
          description: { type: "string", nullable: true },
          tag: { type: "string", enum: ["work", "personal", "urgent"] },
          created_at: { type: "string", format: "date-time" },
          updated_at: { type: "string", format: "date-time" },
        },
      },
      CreateEventRequest: {
        type: "object",
        required: ["title", "date", "time", "tag"],
        properties: {
          title: { type: "string", minLength: 1 },
          date: { type: "string", format: "date", example: "2025-12-15" },
          time: { type: "string", example: "14:00" },
          description: { type: "string" },
          tag: { type: "string", enum: ["work", "personal", "urgent"] },
        },
      },
      UpdateEventRequest: {
        type: "object",
        properties: {
          title: { type: "string" },
          date: { type: "string", format: "date" },
          time: { type: "string" },
          description: { type: "string" },
          tag: { type: "string", enum: ["work", "personal", "urgent"] },
        },
      },
      PaginatedEventsResponse: {
        type: "object",
        properties: {
          events: {
            type: "array",
            items: { $ref: "#/components/schemas/Event" },
          },
          pagination: {
            type: "object",
            properties: {
              page: { type: "integer" },
              limit: { type: "integer" },
              total: { type: "integer" },
              totalPages: { type: "integer" },
            },
          },
        },
      },
    },
  },
};
