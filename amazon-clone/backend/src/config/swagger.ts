export const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Amazon clone backend API",
    version: "1.0.0",
    description: "Amazon clone backend API with authentication and CSRF protection",
  },
  servers: [
    {
      url: "/api",
      description: "API Server",
    },
  ],
  tags: [
    { name: "Auth", description: "Authentication endpoints" },
    { name: "Products", description: "Product listing and details" },
    { name: "Cart", description: "Shopping cart operations (CSRF protected)" },
    { name: "Orders", description: "Order management (auth required, CSRF protected)" },
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
    "/products": {
      get: {
        tags: ["Products"],
        summary: "List products",
        description: "Get all products with optional filtering by category and search",
        parameters: [
          {
            name: "category",
            in: "query",
            schema: { type: "string" },
            description: "Filter by category",
          },
          {
            name: "search",
            in: "query",
            schema: { type: "string" },
            description: "Search in name and description",
          },
        ],
        responses: {
          200: {
            description: "List of products",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    products: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Product" },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/products/categories": {
      get: {
        tags: ["Products"],
        summary: "Get all categories",
        responses: {
          200: {
            description: "List of categories",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    categories: {
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
    "/products/{id}": {
      get: {
        tags: ["Products"],
        summary: "Get product by ID",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
            description: "Product ID",
          },
        ],
        responses: {
          200: {
            description: "Product details with reviews",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    product: { $ref: "#/components/schemas/ProductDetail" },
                  },
                },
              },
            },
          },
          404: {
            description: "Product not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
    "/cart": {
      get: {
        tags: ["Cart"],
        summary: "Get cart items",
        description: "Returns cart items for the current session or authenticated user",
        responses: {
          200: {
            description: "Cart items",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    items: {
                      type: "array",
                      items: { $ref: "#/components/schemas/CartItem" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Cart"],
        summary: "Add item to cart",
        description: "Requires CSRF token in X-XSRF-TOKEN header",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/AddToCartRequest" },
            },
          },
        },
        responses: {
          201: {
            description: "Item added to cart",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    item: { $ref: "#/components/schemas/CartItem" },
                  },
                },
              },
            },
          },
          400: {
            description: "Invalid request or insufficient stock",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          403: {
            description: "CSRF token missing or invalid",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          404: {
            description: "Product not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
      delete: {
        tags: ["Cart"],
        summary: "Clear cart",
        description: "Requires CSRF token in X-XSRF-TOKEN header",
        responses: {
          200: {
            description: "Cart cleared",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Cart cleared" },
                  },
                },
              },
            },
          },
          403: {
            description: "CSRF token missing or invalid",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
    "/cart/{id}": {
      put: {
        tags: ["Cart"],
        summary: "Update cart item quantity",
        description: "Requires CSRF token in X-XSRF-TOKEN header",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
            description: "Cart item ID",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateCartItemRequest" },
            },
          },
        },
        responses: {
          200: {
            description: "Cart item updated",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    item: { $ref: "#/components/schemas/CartItem" },
                  },
                },
              },
            },
          },
          400: {
            description: "Invalid request or insufficient stock",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          403: {
            description: "CSRF token missing or invalid",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          404: {
            description: "Cart item not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
      delete: {
        tags: ["Cart"],
        summary: "Remove item from cart",
        description: "Requires CSRF token in X-XSRF-TOKEN header",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
            description: "Cart item ID",
          },
        ],
        responses: {
          200: {
            description: "Item removed from cart",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Cart item removed" },
                  },
                },
              },
            },
          },
          403: {
            description: "CSRF token missing or invalid",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          404: {
            description: "Cart item not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
    "/orders/checkout": {
      post: {
        tags: ["Orders"],
        summary: "Place order",
        description: "Creates an order from cart items. Requires authentication and CSRF token.",
        responses: {
          201: {
            description: "Order created",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    order: { $ref: "#/components/schemas/Order" },
                  },
                },
              },
            },
          },
          400: {
            description: "Cart is empty or insufficient stock",
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
            description: "CSRF token missing or invalid",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
    "/orders": {
      get: {
        tags: ["Orders"],
        summary: "Get user orders",
        description: "Returns all orders for the authenticated user",
        responses: {
          200: {
            description: "List of orders",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    orders: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Order" },
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
    "/orders/{id}": {
      get: {
        tags: ["Orders"],
        summary: "Get order by ID",
        description: "Returns order details for the authenticated user",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
            description: "Order ID",
          },
        ],
        responses: {
          200: {
            description: "Order details",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    order: { $ref: "#/components/schemas/Order" },
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
          404: {
            description: "Order not found",
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
      Product: {
        type: "object",
        properties: {
          id: { type: "integer" },
          name: { type: "string" },
          description: { type: "string", nullable: true },
          price: { type: "number", format: "double" },
          image_url: { type: "string" },
          category: { type: "string" },
          stock: { type: "integer" },
          created_at: { type: "string", format: "date-time" },
          average_rating: { type: "number", format: "float", nullable: true },
          review_count: { type: "integer", nullable: true },
        },
      },
      Review: {
        type: "object",
        properties: {
          id: { type: "integer" },
          product_id: { type: "integer" },
          reviewer_name: { type: "string" },
          rating: { type: "integer", minimum: 1, maximum: 5 },
          comment: { type: "string", nullable: true },
          created_at: { type: "string", format: "date-time" },
        },
      },
      ProductDetail: {
        allOf: [
          { $ref: "#/components/schemas/Product" },
          {
            type: "object",
            properties: {
              reviews: {
                type: "array",
                items: { $ref: "#/components/schemas/Review" },
              },
            },
          },
        ],
      },
      CartItem: {
        type: "object",
        properties: {
          id: { type: "integer" },
          session_id: { type: "string", nullable: true },
          user_id: { type: "integer", nullable: true },
          product_id: { type: "integer" },
          quantity: { type: "integer", minimum: 1 },
          created_at: { type: "string", format: "date-time" },
          updated_at: { type: "string", format: "date-time" },
          product: { $ref: "#/components/schemas/Product" },
        },
      },
      AddToCartRequest: {
        type: "object",
        required: ["product_id", "quantity"],
        properties: {
          product_id: { type: "integer" },
          quantity: { type: "integer", minimum: 1 },
        },
      },
      UpdateCartItemRequest: {
        type: "object",
        required: ["quantity"],
        properties: {
          quantity: { type: "integer", minimum: 1 },
        },
      },
      OrderItem: {
        type: "object",
        properties: {
          id: { type: "integer" },
          order_id: { type: "integer" },
          product_id: { type: "integer" },
          quantity: { type: "integer" },
          price: { type: "number", format: "double" },
          product: { $ref: "#/components/schemas/Product" },
        },
      },
      Order: {
        type: "object",
        properties: {
          id: { type: "integer" },
          user_id: { type: "integer" },
          total: { type: "number", format: "double" },
          status: {
            type: "string",
            enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
          },
          created_at: { type: "string", format: "date-time" },
          items: {
            type: "array",
            items: { $ref: "#/components/schemas/OrderItem" },
          },
        },
      },
    },
  },
};
