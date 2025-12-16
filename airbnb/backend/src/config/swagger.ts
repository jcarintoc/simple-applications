export const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Airbnb clone backend API",
    version: "1.0.0",
    description: "Airbnb clone backend API with authentication and CSRF protection",
  },
  servers: [
    {
      url: "/api",
      description: "API Server",
    },
  ],
  tags: [
    { name: "Auth", description: "Authentication endpoints" },
    { name: "Properties", description: "Property listing endpoints" },
    { name: "Bookings", description: "Booking endpoints" },
    { name: "Reviews", description: "Review endpoints" },
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
    "/properties": {
      get: {
        tags: ["Properties"],
        summary: "Get all properties",
        description: "Public endpoint to get all properties with optional filters",
        parameters: [
          { name: "location", in: "query", schema: { type: "string" }, description: "Filter by location" },
          { name: "minPrice", in: "query", schema: { type: "number" }, description: "Minimum price per night" },
          { name: "maxPrice", in: "query", schema: { type: "number" }, description: "Maximum price per night" },
          { name: "maxGuests", in: "query", schema: { type: "integer" }, description: "Minimum guest capacity" },
        ],
        responses: {
          200: {
            description: "List of properties",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    properties: {
                      type: "array",
                      items: { $ref: "#/components/schemas/PropertyWithOwner" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Properties"],
        summary: "Create a new property",
        description: "Create a new property listing. Requires authentication and CSRF token.",
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreatePropertyRequest" },
            },
          },
        },
        responses: {
          201: {
            description: "Property created successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    property: { $ref: "#/components/schemas/PropertyWithOwner" },
                  },
                },
              },
            },
          },
          400: {
            description: "Missing required fields",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
    "/properties/{id}": {
      get: {
        tags: ["Properties"],
        summary: "Get property by ID",
        description: "Public endpoint to get a specific property by ID",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" } },
        ],
        responses: {
          200: {
            description: "Property details",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    property: { $ref: "#/components/schemas/PropertyWithOwner" },
                  },
                },
              },
            },
          },
          404: {
            description: "Property not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
      put: {
        tags: ["Properties"],
        summary: "Update property",
        description: "Update a property. Requires authentication, ownership, and CSRF token.",
        security: [{ cookieAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" } },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdatePropertyRequest" },
            },
          },
        },
        responses: {
          200: {
            description: "Property updated successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    property: { $ref: "#/components/schemas/PropertyWithOwner" },
                  },
                },
              },
            },
          },
          404: {
            description: "Property not found or unauthorized",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
      delete: {
        tags: ["Properties"],
        summary: "Delete property",
        description: "Delete a property. Requires authentication, ownership, and CSRF token.",
        security: [{ cookieAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" } },
        ],
        responses: {
          200: {
            description: "Property deleted successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string" },
                  },
                },
              },
            },
          },
          404: {
            description: "Property not found or unauthorized",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
    "/properties/owner/my-properties": {
      get: {
        tags: ["Properties"],
        summary: "Get my properties",
        description: "Get all properties owned by the authenticated user",
        security: [{ cookieAuth: [] }],
        responses: {
          200: {
            description: "List of user's properties",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    properties: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Property" },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/properties/{propertyId}/reviews": {
      get: {
        tags: ["Reviews"],
        summary: "Get reviews for a property",
        description: "Public endpoint to get all reviews for a property",
        parameters: [
          { name: "propertyId", in: "path", required: true, schema: { type: "integer" } },
        ],
        responses: {
          200: {
            description: "List of reviews",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    reviews: {
                      type: "array",
                      items: { $ref: "#/components/schemas/ReviewWithUser" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Reviews"],
        summary: "Create a review",
        description: "Create a review for a property. Requires authentication and CSRF token. One review per user per property.",
        security: [{ cookieAuth: [] }],
        parameters: [
          { name: "propertyId", in: "path", required: true, schema: { type: "integer" } },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateReviewRequest" },
            },
          },
        },
        responses: {
          201: {
            description: "Review created successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    review: { $ref: "#/components/schemas/Review" },
                  },
                },
              },
            },
          },
          400: {
            description: "Already reviewed or invalid rating",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
    "/properties/{propertyId}/reviews/{reviewId}": {
      delete: {
        tags: ["Reviews"],
        summary: "Delete a review",
        description: "Delete your own review. Requires authentication and CSRF token.",
        security: [{ cookieAuth: [] }],
        parameters: [
          { name: "propertyId", in: "path", required: true, schema: { type: "integer" } },
          { name: "reviewId", in: "path", required: true, schema: { type: "integer" } },
        ],
        responses: {
          200: {
            description: "Review deleted successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string" },
                  },
                },
              },
            },
          },
          404: {
            description: "Review not found or unauthorized",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
    "/bookings": {
      get: {
        tags: ["Bookings"],
        summary: "Get my bookings",
        description: "Get all bookings for the authenticated user",
        security: [{ cookieAuth: [] }],
        responses: {
          200: {
            description: "List of user's bookings",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    bookings: {
                      type: "array",
                      items: { $ref: "#/components/schemas/BookingWithProperty" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Bookings"],
        summary: "Create a booking",
        description: "Create a booking for a property. Requires authentication and CSRF token.",
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateBookingRequest" },
            },
          },
        },
        responses: {
          201: {
            description: "Booking created successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    booking: { $ref: "#/components/schemas/Booking" },
                  },
                },
              },
            },
          },
          400: {
            description: "Invalid dates, unavailable, or exceeds guest capacity",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
    "/bookings/{id}/cancel": {
      patch: {
        tags: ["Bookings"],
        summary: "Cancel a booking",
        description: "Cancel a booking. Can be cancelled by guest or property owner. Requires authentication and CSRF token.",
        security: [{ cookieAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" } },
        ],
        responses: {
          200: {
            description: "Booking cancelled successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string" },
                  },
                },
              },
            },
          },
          404: {
            description: "Booking not found or unauthorized",
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
      Property: {
        type: "object",
        properties: {
          id: { type: "integer" },
          owner_id: { type: "integer" },
          title: { type: "string" },
          description: { type: "string" },
          location: { type: "string" },
          price_per_night: { type: "number" },
          max_guests: { type: "integer" },
          bedrooms: { type: "integer" },
          bathrooms: { type: "integer" },
          amenities: { type: "string", nullable: true },
          image_url: { type: "string", nullable: true },
          created_at: { type: "string" },
        },
      },
      PropertyWithOwner: {
        type: "object",
        allOf: [
          { $ref: "#/components/schemas/Property" },
          {
            type: "object",
            properties: {
              owner_name: { type: "string" },
              owner_email: { type: "string" },
            },
          },
        ],
      },
      CreatePropertyRequest: {
        type: "object",
        required: ["title", "description", "location", "price_per_night", "max_guests", "bedrooms", "bathrooms"],
        properties: {
          title: { type: "string" },
          description: { type: "string" },
          location: { type: "string" },
          price_per_night: { type: "number" },
          max_guests: { type: "integer" },
          bedrooms: { type: "integer" },
          bathrooms: { type: "integer" },
          amenities: { type: "array", items: { type: "string" } },
          image_url: { type: "string" },
        },
      },
      UpdatePropertyRequest: {
        type: "object",
        properties: {
          title: { type: "string" },
          description: { type: "string" },
          location: { type: "string" },
          price_per_night: { type: "number" },
          max_guests: { type: "integer" },
          bedrooms: { type: "integer" },
          bathrooms: { type: "integer" },
          amenities: { type: "array", items: { type: "string" } },
          image_url: { type: "string" },
        },
      },
      Booking: {
        type: "object",
        properties: {
          id: { type: "integer" },
          property_id: { type: "integer" },
          guest_id: { type: "integer" },
          check_in: { type: "string", format: "date" },
          check_out: { type: "string", format: "date" },
          total_price: { type: "number" },
          status: { type: "string", enum: ["pending", "confirmed", "cancelled"] },
          created_at: { type: "string" },
        },
      },
      BookingWithProperty: {
        type: "object",
        allOf: [
          { $ref: "#/components/schemas/Booking" },
          {
            type: "object",
            properties: {
              property_title: { type: "string" },
              property_location: { type: "string" },
              property_image_url: { type: "string", nullable: true },
            },
          },
        ],
      },
      CreateBookingRequest: {
        type: "object",
        required: ["property_id", "check_in", "check_out", "guests"],
        properties: {
          property_id: { type: "integer" },
          check_in: { type: "string", format: "date" },
          check_out: { type: "string", format: "date" },
          guests: { type: "integer" },
        },
      },
      Review: {
        type: "object",
        properties: {
          id: { type: "integer" },
          property_id: { type: "integer" },
          user_id: { type: "integer" },
          rating: { type: "integer", minimum: 1, maximum: 5 },
          comment: { type: "string" },
          created_at: { type: "string" },
        },
      },
      ReviewWithUser: {
        type: "object",
        allOf: [
          { $ref: "#/components/schemas/Review" },
          {
            type: "object",
            properties: {
              user_name: { type: "string" },
              user_email: { type: "string" },
            },
          },
        ],
      },
      CreateReviewRequest: {
        type: "object",
        required: ["rating", "comment"],
        properties: {
          rating: { type: "integer", minimum: 1, maximum: 5 },
          comment: { type: "string" },
        },
      },
    },
    securitySchemes: {
      cookieAuth: {
        type: "apiKey",
        in: "cookie",
        name: "access_token",
      },
    },
  },
};
