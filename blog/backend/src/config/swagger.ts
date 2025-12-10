export const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Blog/CMS API",
    version: "1.0.0",
    description: "Blog/CMS API with authentication, posts, comments, and CSRF protection",
  },
  servers: [
    {
      url: "/api",
      description: "API Server",
    },
  ],
  tags: [
    { name: "Auth", description: "Authentication endpoints" },
    { name: "CSRF", description: "CSRF token endpoints" },
    { name: "Posts", description: "Blog post management" },
    { name: "Comments", description: "Comment management" },
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
    "/csrf/token": {
      get: {
        tags: ["CSRF"],
        summary: "Get CSRF token",
        description: "Get a CSRF token for protected operations. Requires authentication.",
        responses: {
          200: {
            description: "CSRF token generated",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    token: { type: "string" },
                  },
                },
              },
            },
          },
          401: {
            description: "Unauthorized",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
    "/posts": {
      get: {
        tags: ["Posts"],
        summary: "Get all posts",
        description: "Get all posts. Returns only published posts for unauthenticated users.",
        responses: {
          200: {
            description: "List of posts",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/PostWithAuthor" },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Posts"],
        summary: "Create a new post",
        description: "Create a new blog post. Requires authentication and CSRF token.",
        parameters: [
          {
            in: "header",
            name: "x-csrf-token",
            required: true,
            schema: { type: "string" },
            description: "CSRF token",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreatePostRequest" },
            },
          },
        },
        responses: {
          201: {
            description: "Post created successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Post" },
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
            description: "Unauthorized",
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
    "/posts/my-posts": {
      get: {
        tags: ["Posts"],
        summary: "Get current user's posts",
        description: "Get all posts created by the authenticated user.",
        responses: {
          200: {
            description: "List of user's posts",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/PostWithAuthor" },
                },
              },
            },
          },
          401: {
            description: "Unauthorized",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
    "/posts/{id}": {
      get: {
        tags: ["Posts"],
        summary: "Get post by ID",
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
            description: "Post details",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/PostWithAuthor" },
              },
            },
          },
          404: {
            description: "Post not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
      put: {
        tags: ["Posts"],
        summary: "Update a post",
        description: "Update a post. Requires authentication, CSRF token, and post ownership.",
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "integer" },
          },
          {
            in: "header",
            name: "x-csrf-token",
            required: true,
            schema: { type: "string" },
            description: "CSRF token",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdatePostRequest" },
            },
          },
        },
        responses: {
          200: {
            description: "Post updated successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Post" },
              },
            },
          },
          401: {
            description: "Unauthorized",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          403: {
            description: "Forbidden - not the post owner or invalid CSRF token",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          404: {
            description: "Post not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
      delete: {
        tags: ["Posts"],
        summary: "Delete a post",
        description: "Delete a post. Requires authentication, CSRF token, and post ownership.",
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "integer" },
          },
          {
            in: "header",
            name: "x-csrf-token",
            required: true,
            schema: { type: "string" },
            description: "CSRF token",
          },
        ],
        responses: {
          204: {
            description: "Post deleted successfully",
          },
          401: {
            description: "Unauthorized",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          403: {
            description: "Forbidden - not the post owner or invalid CSRF token",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          404: {
            description: "Post not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
    "/posts/slug/{slug}": {
      get: {
        tags: ["Posts"],
        summary: "Get post by slug",
        parameters: [
          {
            in: "path",
            name: "slug",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: {
            description: "Post details",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/PostWithAuthor" },
              },
            },
          },
          404: {
            description: "Post not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
    "/comments/post/{postId}": {
      get: {
        tags: ["Comments"],
        summary: "Get comments for a post",
        parameters: [
          {
            in: "path",
            name: "postId",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          200: {
            description: "List of comments",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/CommentWithAuthor" },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Comments"],
        summary: "Create a comment",
        description: "Create a comment on a post. Requires authentication and CSRF token.",
        parameters: [
          {
            in: "path",
            name: "postId",
            required: true,
            schema: { type: "integer" },
          },
          {
            in: "header",
            name: "x-csrf-token",
            required: true,
            schema: { type: "string" },
            description: "CSRF token",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateCommentRequest" },
            },
          },
        },
        responses: {
          201: {
            description: "Comment created successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Comment" },
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
            description: "Unauthorized",
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
            description: "Post not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
    "/comments/{id}": {
      delete: {
        tags: ["Comments"],
        summary: "Delete a comment",
        description: "Delete a comment. Requires authentication, CSRF token, and comment ownership.",
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "integer" },
          },
          {
            in: "header",
            name: "x-csrf-token",
            required: true,
            schema: { type: "string" },
            description: "CSRF token",
          },
        ],
        responses: {
          204: {
            description: "Comment deleted successfully",
          },
          401: {
            description: "Unauthorized",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          403: {
            description: "Forbidden - not the comment owner or invalid CSRF token",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          404: {
            description: "Comment not found",
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
      Post: {
        type: "object",
        properties: {
          id: { type: "integer" },
          title: { type: "string" },
          content: { type: "string" },
          slug: { type: "string" },
          author_id: { type: "integer" },
          published: { type: "boolean" },
          created_at: { type: "string", format: "date-time" },
          updated_at: { type: "string", format: "date-time" },
        },
      },
      PostWithAuthor: {
        allOf: [
          { $ref: "#/components/schemas/Post" },
          {
            type: "object",
            properties: {
              author_name: { type: "string" },
              author_email: { type: "string" },
            },
          },
        ],
      },
      CreatePostRequest: {
        type: "object",
        required: ["title", "content"],
        properties: {
          title: { type: "string", minLength: 1 },
          content: { type: "string", minLength: 1 },
          published: { type: "boolean", default: false },
        },
      },
      UpdatePostRequest: {
        type: "object",
        properties: {
          title: { type: "string", minLength: 1 },
          content: { type: "string", minLength: 1 },
          published: { type: "boolean" },
        },
      },
      Comment: {
        type: "object",
        properties: {
          id: { type: "integer" },
          post_id: { type: "integer" },
          author_id: { type: "integer" },
          content: { type: "string" },
          created_at: { type: "string", format: "date-time" },
        },
      },
      CommentWithAuthor: {
        allOf: [
          { $ref: "#/components/schemas/Comment" },
          {
            type: "object",
            properties: {
              author_name: { type: "string" },
              author_email: { type: "string" },
            },
          },
        ],
      },
      CreateCommentRequest: {
        type: "object",
        required: ["content"],
        properties: {
          content: { type: "string", minLength: 1 },
        },
      },
    },
  },
};
