export const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Survey Creator API",
    version: "1.0.0",
    description: "Survey Creator API with cookie-based sessions",
  },
  servers: [
    {
      url: "/api",
      description: "API Server",
    },
  ],
  tags: [
    { name: "Auth", description: "Authentication endpoints" },
    { name: "Surveys", description: "Survey management endpoints" },
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
    "/surveys": {
      get: {
        tags: ["Surveys"],
        summary: "Get all surveys",
        description: "Returns all surveys. Public endpoint.",
        responses: {
          200: {
            description: "List of surveys",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    surveys: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Survey" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Surveys"],
        summary: "Create a survey",
        description: "Creates a new survey. Requires authentication and CSRF token.",
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateSurveyRequest" },
              example: {
                question: "What is your favorite color?",
                options: ["Red", "Blue", "Green", "Yellow"],
              },
            },
          },
        },
        responses: {
          201: {
            description: "Survey created",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    survey: { $ref: "#/components/schemas/Survey" },
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
    "/surveys/user/my-surveys": {
      get: {
        tags: ["Surveys"],
        summary: "Get my surveys",
        description: "Returns surveys created by the authenticated user.",
        security: [{ cookieAuth: [] }],
        responses: {
          200: {
            description: "List of user's surveys",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    surveys: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Survey" },
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
    "/surveys/{id}": {
      get: {
        tags: ["Surveys"],
        summary: "Get a survey",
        description: "Returns a single survey by ID. Public endpoint.",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
            description: "Survey ID",
          },
        ],
        responses: {
          200: {
            description: "Survey details",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    survey: { $ref: "#/components/schemas/Survey" },
                  },
                },
              },
            },
          },
          404: {
            description: "Survey not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
      delete: {
        tags: ["Surveys"],
        summary: "Delete a survey",
        description: "Deletes a survey. Requires authentication and CSRF token.",
        security: [{ cookieAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
            description: "Survey ID",
          },
        ],
        responses: {
          200: {
            description: "Survey deleted",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Survey deleted successfully" },
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
            description: "Survey not found or access denied",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
    "/surveys/{id}/respond": {
      post: {
        tags: ["Surveys"],
        summary: "Submit a response",
        description: "Submit a response to a survey. Requires authentication and CSRF token.",
        security: [{ cookieAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
            description: "Survey ID",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/SubmitResponseRequest" },
              example: {
                selected_option: 0,
              },
            },
          },
        },
        responses: {
          200: {
            description: "Response submitted",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Response submitted successfully" },
                  },
                },
              },
            },
          },
          400: {
            description: "Invalid option or already responded",
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
            description: "Survey not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
    "/surveys/{id}/results": {
      get: {
        tags: ["Surveys"],
        summary: "Get survey results",
        description: "Returns survey results with percentages. Public endpoint.",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
            description: "Survey ID",
          },
        ],
        responses: {
          200: {
            description: "Survey results",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    survey: { $ref: "#/components/schemas/SurveyWithResults" },
                  },
                },
              },
            },
          },
          404: {
            description: "Survey not found",
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
      Survey: {
        type: "object",
        properties: {
          id: { type: "integer" },
          question: { type: "string" },
          options: { type: "array", items: { type: "string" } },
          created_at: { type: "string", format: "date-time" },
          author_name: { type: "string" },
          response_count: { type: "integer" },
        },
      },
      SurveyWithResults: {
        allOf: [
          { $ref: "#/components/schemas/Survey" },
          {
            type: "object",
            properties: {
              results: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    option: { type: "string" },
                    count: { type: "integer" },
                    percentage: { type: "integer" },
                  },
                },
              },
            },
          },
        ],
      },
      CreateSurveyRequest: {
        type: "object",
        required: ["question", "options"],
        properties: {
          question: { type: "string", minLength: 1 },
          options: {
            type: "array",
            items: { type: "string" },
            minItems: 2,
            maxItems: 6,
          },
        },
      },
      SubmitResponseRequest: {
        type: "object",
        required: ["selected_option"],
        properties: {
          selected_option: { type: "integer", minimum: 0 },
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
