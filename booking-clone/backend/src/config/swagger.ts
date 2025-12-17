export const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Booking Clone API",
    version: "1.0.0",
    description: "Hotel booking API with authentication, reservations, reviews, and saved properties",
  },
  servers: [
    {
      url: "/api",
      description: "API Server",
    },
  ],
  tags: [
    { name: "Auth", description: "Authentication endpoints" },
    { name: "Hotels", description: "Hotel search and details" },
    { name: "Bookings", description: "Reservation management" },
    { name: "Reviews", description: "Hotel reviews" },
    { name: "Saved", description: "Saved properties (wishlist)" },
    { name: "CSRF", description: "CSRF token management" },
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
          200: {
            description: "Tokens refreshed",
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
          401: {
            description: "Invalid refresh token",
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
        responses: {
          200: {
            description: "Logged out successfully",
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
        },
      },
    },
    "/hotels": {
      get: {
        tags: ["Hotels"],
        summary: "Search hotels",
        parameters: [
          { name: "city", in: "query", schema: { type: "string" }, description: "Filter by city" },
          { name: "country", in: "query", schema: { type: "string" }, description: "Filter by country" },
          { name: "minPrice", in: "query", schema: { type: "number" }, description: "Minimum price per night" },
          { name: "maxPrice", in: "query", schema: { type: "number" }, description: "Maximum price per night" },
          { name: "minRating", in: "query", schema: { type: "number" }, description: "Minimum rating" },
          { name: "page", in: "query", schema: { type: "integer", default: 1 }, description: "Page number" },
          { name: "limit", in: "query", schema: { type: "integer", default: 10 }, description: "Items per page" },
        ],
        responses: {
          200: {
            description: "Search results",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    hotels: { type: "array", items: { $ref: "#/components/schemas/Hotel" } },
                    total: { type: "integer" },
                    page: { type: "integer" },
                    limit: { type: "integer" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/hotels/featured": {
      get: {
        tags: ["Hotels"],
        summary: "Get featured hotels",
        responses: {
          200: {
            description: "Featured hotels",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    hotels: { type: "array", items: { $ref: "#/components/schemas/Hotel" } },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/hotels/{id}": {
      get: {
        tags: ["Hotels"],
        summary: "Get hotel by ID",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" } },
        ],
        responses: {
          200: {
            description: "Hotel details",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    hotel: { $ref: "#/components/schemas/Hotel" },
                  },
                },
              },
            },
          },
          404: {
            description: "Hotel not found",
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
        summary: "Get user's bookings",
        responses: {
          200: {
            description: "User's bookings",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    bookings: { type: "array", items: { $ref: "#/components/schemas/Booking" } },
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
        tags: ["Bookings"],
        summary: "Create a booking",
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
            description: "Booking created",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string" },
                    booking: { $ref: "#/components/schemas/Booking" },
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
        },
      },
    },
    "/bookings/{id}": {
      delete: {
        tags: ["Bookings"],
        summary: "Cancel a booking",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" } },
        ],
        responses: {
          200: {
            description: "Booking cancelled",
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
          400: {
            description: "Cannot cancel booking",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          403: {
            description: "Not authorized",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
    "/reviews/hotel/{hotelId}": {
      get: {
        tags: ["Reviews"],
        summary: "Get hotel reviews",
        parameters: [
          { name: "hotelId", in: "path", required: true, schema: { type: "integer" } },
        ],
        responses: {
          200: {
            description: "Hotel reviews",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    reviews: { type: "array", items: { $ref: "#/components/schemas/Review" } },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/reviews": {
      post: {
        tags: ["Reviews"],
        summary: "Create a review",
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
            description: "Review created",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string" },
                    review: { $ref: "#/components/schemas/Review" },
                  },
                },
              },
            },
          },
          400: {
            description: "Validation error or cannot review",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
    "/reviews/{id}": {
      delete: {
        tags: ["Reviews"],
        summary: "Delete a review",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" } },
        ],
        responses: {
          200: {
            description: "Review deleted",
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
          403: {
            description: "Not authorized",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
    "/saved": {
      get: {
        tags: ["Saved"],
        summary: "Get user's saved properties",
        responses: {
          200: {
            description: "Saved properties",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    saved: { type: "array", items: { $ref: "#/components/schemas/SavedProperty" } },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/saved/toggle": {
      post: {
        tags: ["Saved"],
        summary: "Toggle saved property",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["hotelId"],
                properties: {
                  hotelId: { type: "integer" },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Toggle result",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    saved: { type: "boolean" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/saved/check/{hotelId}": {
      get: {
        tags: ["Saved"],
        summary: "Check if hotel is saved",
        parameters: [
          { name: "hotelId", in: "path", required: true, schema: { type: "integer" } },
        ],
        responses: {
          200: {
            description: "Saved status",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    saved: { type: "boolean" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/csrf/token": {
      get: {
        tags: ["CSRF"],
        summary: "Get CSRF token",
        description: "Get a CSRF token for booking submissions. Token expires in 30 minutes and is single-use.",
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
      Hotel: {
        type: "object",
        properties: {
          id: { type: "integer" },
          name: { type: "string" },
          description: { type: "string" },
          location: { type: "string" },
          city: { type: "string" },
          country: { type: "string" },
          address: { type: "string" },
          pricePerNight: { type: "number" },
          rating: { type: "number" },
          reviewCount: { type: "integer" },
          amenities: { type: "array", items: { type: "string" } },
          images: { type: "array", items: { type: "string" } },
          roomsAvailable: { type: "integer" },
        },
      },
      Booking: {
        type: "object",
        properties: {
          id: { type: "integer" },
          hotelId: { type: "integer" },
          hotel: { $ref: "#/components/schemas/Hotel" },
          checkInDate: { type: "string", format: "date" },
          checkOutDate: { type: "string", format: "date" },
          guests: { type: "integer" },
          rooms: { type: "integer" },
          totalPrice: { type: "number" },
          status: { type: "string", enum: ["confirmed", "cancelled", "completed"] },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      CreateBookingRequest: {
        type: "object",
        required: ["hotelId", "checkInDate", "checkOutDate", "csrfToken"],
        properties: {
          hotelId: { type: "integer" },
          checkInDate: { type: "string", format: "date" },
          checkOutDate: { type: "string", format: "date" },
          guests: { type: "integer", default: 1 },
          rooms: { type: "integer", default: 1 },
          csrfToken: { type: "string" },
        },
      },
      Review: {
        type: "object",
        properties: {
          id: { type: "integer" },
          userId: { type: "integer" },
          userName: { type: "string" },
          hotelId: { type: "integer" },
          bookingId: { type: "integer" },
          rating: { type: "integer", minimum: 1, maximum: 5 },
          title: { type: "string" },
          comment: { type: "string" },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      CreateReviewRequest: {
        type: "object",
        required: ["hotelId", "bookingId", "rating", "title", "comment"],
        properties: {
          hotelId: { type: "integer" },
          bookingId: { type: "integer" },
          rating: { type: "integer", minimum: 1, maximum: 5 },
          title: { type: "string" },
          comment: { type: "string" },
        },
      },
      SavedProperty: {
        type: "object",
        properties: {
          id: { type: "integer" },
          hotel: { $ref: "#/components/schemas/Hotel" },
          savedAt: { type: "string", format: "date-time" },
        },
      },
      Error: {
        type: "object",
        properties: {
          error: { type: "string" },
        },
      },
    },
  },
};
