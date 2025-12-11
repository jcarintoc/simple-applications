export const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Password Generator API",
    version: "1.0.0",
    description: "Password generator API with saved history",
  },
  servers: [
    {
      url: "/api",
      description: "API Server",
    },
  ],
  tags: [
    { name: "Auth", description: "Authentication endpoints" },
    { name: "Passwords", description: "Password generation and storage" },
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
    "/passwords/generate": {
      post: {
        tags: ["Passwords"],
        summary: "Generate a random password",
        description: "Generates a random password based on specified options. No authentication required.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/GeneratePasswordRequest" },
              example: {
                length: 16,
                hasUppercase: true,
                hasLowercase: true,
                hasNumbers: true,
                hasSymbols: true,
              },
            },
          },
        },
        responses: {
          200: {
            description: "Password generated successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    password: { type: "string", example: "Kj#9mL$2pQr@5nX!" },
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
        },
      },
    },
    "/passwords": {
      get: {
        tags: ["Passwords"],
        summary: "Get saved passwords",
        description: "Retrieves all saved passwords for the authenticated user.",
        responses: {
          200: {
            description: "List of saved passwords",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    passwords: {
                      type: "array",
                      items: { $ref: "#/components/schemas/SavedPassword" },
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
        tags: ["Passwords"],
        summary: "Save a password",
        description: "Saves a generated password for the authenticated user.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/SavePasswordRequest" },
              example: {
                password: "Kj#9mL$2pQr@5nX!",
                label: "Gmail Account",
                length: 16,
                hasUppercase: true,
                hasLowercase: true,
                hasNumbers: true,
                hasSymbols: true,
              },
            },
          },
        },
        responses: {
          201: {
            description: "Password saved successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    password: { $ref: "#/components/schemas/SavedPassword" },
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
      delete: {
        tags: ["Passwords"],
        summary: "Delete all saved passwords",
        description: "Deletes all saved passwords for the authenticated user. Requires CSRF token.",
        parameters: [
          {
            name: "x-csrf-token",
            in: "header",
            required: true,
            schema: { type: "string" },
            description: "CSRF token obtained from /passwords/csrf-token",
          },
        ],
        responses: {
          200: {
            description: "All passwords deleted successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Deleted 5 password(s) successfully" },
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
    "/passwords/csrf-token": {
      get: {
        tags: ["Passwords"],
        summary: "Get CSRF token",
        description: "Gets a CSRF token required for delete operations.",
        responses: {
          200: {
            description: "CSRF token retrieved successfully",
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
    "/passwords/{id}": {
      delete: {
        tags: ["Passwords"],
        summary: "Delete a saved password",
        description: "Deletes a specific saved password. Requires CSRF token.",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
            description: "Password ID",
          },
          {
            name: "x-csrf-token",
            in: "header",
            required: true,
            schema: { type: "string" },
            description: "CSRF token obtained from /passwords/csrf-token",
          },
        ],
        responses: {
          200: {
            description: "Password deleted successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Password deleted successfully" },
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
            description: "Invalid CSRF token",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          404: {
            description: "Password not found",
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
      GeneratePasswordRequest: {
        type: "object",
        required: ["length", "hasUppercase", "hasLowercase", "hasNumbers", "hasSymbols"],
        properties: {
          length: { type: "integer", minimum: 4, maximum: 128 },
          hasUppercase: { type: "boolean" },
          hasLowercase: { type: "boolean" },
          hasNumbers: { type: "boolean" },
          hasSymbols: { type: "boolean" },
        },
      },
      SavePasswordRequest: {
        type: "object",
        required: ["password", "length", "hasUppercase", "hasLowercase", "hasNumbers", "hasSymbols"],
        properties: {
          password: { type: "string", minLength: 1 },
          label: { type: "string", maxLength: 100 },
          length: { type: "integer", minimum: 4, maximum: 128 },
          hasUppercase: { type: "boolean" },
          hasLowercase: { type: "boolean" },
          hasNumbers: { type: "boolean" },
          hasSymbols: { type: "boolean" },
        },
      },
      SavedPassword: {
        type: "object",
        properties: {
          id: { type: "integer" },
          password: { type: "string" },
          label: { type: "string", nullable: true },
          length: { type: "integer" },
          hasUppercase: { type: "boolean" },
          hasLowercase: { type: "boolean" },
          hasNumbers: { type: "boolean" },
          hasSymbols: { type: "boolean" },
          createdAt: { type: "string", format: "date-time" },
        },
      },
    },
  },
};
