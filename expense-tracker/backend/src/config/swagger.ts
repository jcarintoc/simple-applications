export const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Expense Tracker API",
    version: "1.0.0",
    description: "Expense Tracker API with authentication and CSRF protection",
  },
  servers: [
    {
      url: "/api",
      description: "API Server",
    },
  ],
  tags: [
    { name: "Auth", description: "Authentication endpoints" },
    { name: "Expenses", description: "Expense management endpoints" },
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
    "/expenses/csrf-token": {
      get: {
        tags: ["Expenses"],
        summary: "Get CSRF token",
        description: "Returns a fresh CSRF token for mutations",
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
          401: { description: "Not authenticated" },
        },
      },
    },
    "/expenses": {
      get: {
        tags: ["Expenses"],
        summary: "Get all expenses",
        description: "Returns all expenses for the authenticated user with a CSRF token",
        responses: {
          200: {
            description: "List of expenses",
            headers: {
              "X-CSRF-Token": {
                schema: { type: "string" },
                description: "CSRF token for mutations",
              },
            },
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    expenses: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Expense" },
                    },
                    csrfToken: { type: "string" },
                  },
                },
              },
            },
          },
          401: { description: "Not authenticated" },
        },
      },
      post: {
        tags: ["Expenses"],
        summary: "Create a new expense",
        description: "Creates a new expense. Requires CSRF token in X-CSRF-Token header",
        parameters: [
          {
            in: "header",
            name: "X-CSRF-Token",
            required: true,
            schema: { type: "string" },
            description: "CSRF token from GET /expenses",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateExpenseRequest" },
              example: {
                title: "Groceries",
                amount: 45.99,
                category: "Food",
                date: "2025-12-11",
                description: "Weekly groceries",
              },
            },
          },
        },
        responses: {
          201: {
            description: "Expense created",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    expense: { $ref: "#/components/schemas/Expense" },
                    csrfToken: { type: "string" },
                  },
                },
              },
            },
          },
          400: { description: "Validation error" },
          401: { description: "Not authenticated" },
          403: { description: "Invalid or missing CSRF token" },
        },
      },
    },
    "/expenses/export": {
      get: {
        tags: ["Expenses"],
        summary: "Export expenses as CSV",
        description: "Downloads all expenses as a CSV file",
        responses: {
          200: {
            description: "CSV file",
            content: {
              "text/csv": {
                schema: { type: "string" },
              },
            },
          },
          401: { description: "Not authenticated" },
        },
      },
    },
    "/expenses/{id}": {
      get: {
        tags: ["Expenses"],
        summary: "Get expense by ID",
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          200: {
            description: "Expense details",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    expense: { $ref: "#/components/schemas/Expense" },
                  },
                },
              },
            },
          },
          401: { description: "Not authenticated" },
          404: { description: "Expense not found" },
        },
      },
      put: {
        tags: ["Expenses"],
        summary: "Update an expense",
        description: "Updates an expense. Requires CSRF token in X-CSRF-Token header",
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "integer" },
          },
          {
            in: "header",
            name: "X-CSRF-Token",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateExpenseRequest" },
            },
          },
        },
        responses: {
          200: {
            description: "Expense updated",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    expense: { $ref: "#/components/schemas/Expense" },
                    csrfToken: { type: "string" },
                  },
                },
              },
            },
          },
          400: { description: "Validation error" },
          401: { description: "Not authenticated" },
          403: { description: "Invalid or missing CSRF token" },
          404: { description: "Expense not found" },
        },
      },
      delete: {
        tags: ["Expenses"],
        summary: "Delete an expense",
        description: "Deletes an expense. Requires CSRF token in X-CSRF-Token header",
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "integer" },
          },
          {
            in: "header",
            name: "X-CSRF-Token",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: {
            description: "Expense deleted",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string" },
                    csrfToken: { type: "string" },
                  },
                },
              },
            },
          },
          401: { description: "Not authenticated" },
          403: { description: "Invalid or missing CSRF token" },
          404: { description: "Expense not found" },
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
      Expense: {
        type: "object",
        properties: {
          id: { type: "integer" },
          user_id: { type: "integer" },
          title: { type: "string" },
          amount: { type: "number", format: "float" },
          category: { type: "string" },
          date: { type: "string", format: "date" },
          description: { type: "string", nullable: true },
          created_at: { type: "string", format: "date-time" },
          updated_at: { type: "string", format: "date-time" },
        },
      },
      CreateExpenseRequest: {
        type: "object",
        required: ["title", "amount", "category", "date"],
        properties: {
          title: { type: "string" },
          amount: { type: "number", format: "float", minimum: 0.01 },
          category: { type: "string" },
          date: { type: "string", format: "date", pattern: "^\\d{4}-\\d{2}-\\d{2}$" },
          description: { type: "string" },
        },
      },
      UpdateExpenseRequest: {
        type: "object",
        properties: {
          title: { type: "string" },
          amount: { type: "number", format: "float", minimum: 0.01 },
          category: { type: "string" },
          date: { type: "string", format: "date", pattern: "^\\d{4}-\\d{2}-\\d{2}$" },
          description: { type: "string" },
        },
      },
    },
  },
};
