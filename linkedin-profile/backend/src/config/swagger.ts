export const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "LinkedIn Profile API",
    version: "1.0.0",
    description: "LinkedIn Profile API with cookie-based sessions",
  },
  servers: [
    {
      url: "/api",
      description: "API Server",
    },
  ],
  tags: [
    { name: "Auth", description: "Authentication endpoints" },
    { name: "CSRF", description: "CSRF token endpoint" },
    { name: "Profiles", description: "User profile endpoints" },
    { name: "Connections", description: "Connection management endpoints" },
    { name: "Jobs", description: "Job listing and application endpoints" },
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
        description: "Sets XSRF-TOKEN cookie for CSRF protection on mutations",
        responses: {
          200: {
            description: "CSRF token set",
            headers: {
              "Set-Cookie": {
                schema: { type: "string" },
                description: "XSRF-TOKEN cookie (httpOnly: false)",
              },
            },
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "CSRF token set" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/profiles/me": {
      get: {
        tags: ["Profiles"],
        summary: "Get current user's profile",
        description: "Requires authentication",
        responses: {
          200: { description: "Profile retrieved" },
          401: { description: "Not authenticated" },
        },
      },
      put: {
        tags: ["Profiles"],
        summary: "Update current user's profile",
        description: "Requires authentication and CSRF token (X-XSRF-TOKEN header)",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  headline: { type: "string" },
                  summary: { type: "string" },
                  location: { type: "string" },
                  industry: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Profile updated" },
          401: { description: "Not authenticated" },
          403: { description: "CSRF token missing or invalid" },
        },
      },
    },
    "/profiles/suggested": {
      get: {
        tags: ["Profiles"],
        summary: "Get suggested users to connect with",
        description: "Returns users that the current user is not already connected with. Requires authentication.",
        parameters: [
          {
            name: "limit",
            in: "query",
            schema: { type: "integer", default: 5 },
            description: "Maximum number of suggestions to return",
          },
        ],
        responses: {
          200: {
            description: "Suggested users retrieved",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    users: {
                      type: "array",
                      items: { $ref: "#/components/schemas/SuggestedUser" },
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
    "/connections": {
      get: {
        tags: ["Connections"],
        summary: "Get accepted connections",
        description: "Requires authentication",
        responses: {
          200: { description: "Connections retrieved" },
          401: { description: "Not authenticated" },
        },
      },
    },
    "/connections/request": {
      post: {
        tags: ["Connections"],
        summary: "Send connection request",
        description: "Requires authentication and CSRF token",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["recipient_id"],
                properties: {
                  recipient_id: { type: "integer" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Request sent" },
          400: { description: "Invalid request" },
          401: { description: "Not authenticated" },
          403: { description: "CSRF token missing or invalid" },
        },
      },
    },
    "/jobs": {
      get: {
        tags: ["Jobs"],
        summary: "Get job listings",
        description: "Requires authentication. Supports pagination",
        parameters: [
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", default: 20 } },
        ],
        responses: {
          200: { description: "Jobs retrieved with pagination" },
          401: { description: "Not authenticated" },
        },
      },
    },
    "/jobs/{id}/apply": {
      post: {
        tags: ["Jobs"],
        summary: "Apply to a job",
        description: "Requires authentication and CSRF token",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" } },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  cover_letter: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Application submitted" },
          400: { description: "Already applied or invalid data" },
          401: { description: "Not authenticated" },
          403: { description: "CSRF token missing or invalid" },
          404: { description: "Job not found" },
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
      SuggestedUser: {
        type: "object",
        properties: {
          id: { type: "integer" },
          name: { type: "string" },
          headline: { type: "string", nullable: true },
          profile_image_url: { type: "string", nullable: true },
        },
      },
    },
  },
};
