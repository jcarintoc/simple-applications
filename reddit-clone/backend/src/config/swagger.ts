export const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Reddit clone backend API",
    version: "1.0.0",
    description: "Reddit clone backend API with authentication and CSRF protection",
  },
  servers: [
    {
      url: "/api",
      description: "API Server",
    },
  ],
  tags: [
    { name: "Auth", description: "Authentication endpoints" },
    { name: "Health", description: "Health check" },
    { name: "Subreddits", description: "Subreddit management endpoints" },
    { name: "Posts", description: "Post management endpoints" },
    { name: "Comments", description: "Comment management endpoints" },
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
    "/subreddits": {
      get: {
        tags: ["Subreddits"],
        summary: "Get all subreddits",
        description: "Returns all subreddits with creator information. Public endpoint.",
        responses: {
          200: {
            description: "List of subreddits",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    subreddits: {
                      type: "array",
                      items: { $ref: "#/components/schemas/SubredditWithCreator" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Subreddits"],
        summary: "Create a subreddit",
        description: "Create a new subreddit. Requires authentication and CSRF token.",
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateSubredditRequest" },
              example: {
                name: "programming",
                description: "Discussion about programming languages and software development",
              },
            },
          },
        },
        responses: {
          201: {
            description: "Subreddit created successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    subreddit: { $ref: "#/components/schemas/SubredditWithCreator" },
                  },
                },
              },
            },
          },
          400: {
            description: "Validation error or subreddit name already exists",
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
    "/subreddits/{id}": {
      get: {
        tags: ["Subreddits"],
        summary: "Get subreddit by ID",
        description: "Returns a subreddit by its ID. Public endpoint.",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
            description: "Subreddit ID",
          },
        ],
        responses: {
          200: {
            description: "Subreddit details",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    subreddit: { $ref: "#/components/schemas/SubredditWithCreator" },
                  },
                },
              },
            },
          },
          404: {
            description: "Subreddit not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
      put: {
        tags: ["Subreddits"],
        summary: "Update a subreddit",
        description: "Update a subreddit. Requires authentication, ownership, and CSRF token.",
        security: [{ cookieAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
            description: "Subreddit ID",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateSubredditRequest" },
            },
          },
        },
        responses: {
          200: {
            description: "Subreddit updated successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    subreddit: { $ref: "#/components/schemas/SubredditWithCreator" },
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
            description: "CSRF token missing or invalid",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          404: {
            description: "Subreddit not found or unauthorized",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
      delete: {
        tags: ["Subreddits"],
        summary: "Delete a subreddit",
        description: "Delete a subreddit. Requires authentication, ownership, and CSRF token.",
        security: [{ cookieAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
            description: "Subreddit ID",
          },
        ],
        responses: {
          200: {
            description: "Subreddit deleted successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Subreddit deleted successfully" },
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
            description: "CSRF token missing or invalid",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          404: {
            description: "Subreddit not found or unauthorized",
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
        description: "Returns all posts. Can be filtered by subreddit_id query parameter. Public endpoint.",
        parameters: [
          {
            name: "subreddit_id",
            in: "query",
            required: false,
            schema: { type: "integer" },
            description: "Filter posts by subreddit ID",
          },
        ],
        responses: {
          200: {
            description: "List of posts",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    posts: {
                      type: "array",
                      items: { $ref: "#/components/schemas/PostWithAuthor" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Posts"],
        summary: "Create a post",
        description: "Create a new post. Requires authentication and CSRF token.",
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreatePostRequest" },
              example: {
                subreddit_id: 1,
                title: "My first post",
                content: "This is the content of my post",
              },
            },
          },
        },
        responses: {
          201: {
            description: "Post created successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    post: { $ref: "#/components/schemas/PostWithAuthor" },
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
    "/posts/{id}": {
      get: {
        tags: ["Posts"],
        summary: "Get post by ID",
        description: "Returns a post by its ID. Public endpoint.",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
            description: "Post ID",
          },
        ],
        responses: {
          200: {
            description: "Post details",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    post: { $ref: "#/components/schemas/PostWithAuthor" },
                  },
                },
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
        description: "Update a post. Requires authentication, ownership, and CSRF token.",
        security: [{ cookieAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
            description: "Post ID",
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
                schema: {
                  type: "object",
                  properties: {
                    post: { $ref: "#/components/schemas/PostWithAuthor" },
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
            description: "CSRF token missing or invalid",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          404: {
            description: "Post not found or unauthorized",
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
        description: "Delete a post. Requires authentication, ownership, and CSRF token.",
        security: [{ cookieAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
            description: "Post ID",
          },
        ],
        responses: {
          200: {
            description: "Post deleted successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Post deleted successfully" },
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
            description: "CSRF token missing or invalid",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          404: {
            description: "Post not found or unauthorized",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
    "/posts/{id}/upvote": {
      post: {
        tags: ["Posts"],
        summary: "Toggle upvote on a post",
        description: "Toggle upvote on a post. If already upvoted, removes the upvote. Requires authentication and CSRF token.",
        security: [{ cookieAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
            description: "Post ID",
          },
        ],
        responses: {
          200: {
            description: "Upvote toggled successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    hasVoted: { type: "boolean", description: "Whether the user has voted after toggle" },
                    upvotes: { type: "integer", description: "Updated upvote count" },
                  },
                },
              },
            },
          },
          400: {
            description: "Post not found",
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
    "/posts/{postId}/comments": {
      get: {
        tags: ["Comments"],
        summary: "Get comments for a post",
        description: "Returns all comments for a post as a flat list with parent_id. Public endpoint.",
        parameters: [
          {
            name: "postId",
            in: "path",
            required: true,
            schema: { type: "integer" },
            description: "Post ID",
          },
        ],
        responses: {
          200: {
            description: "List of comments",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    comments: {
                      type: "array",
                      items: { $ref: "#/components/schemas/CommentWithAuthor" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Comments"],
        summary: "Create a comment",
        description: "Create a new comment on a post. Can be a top-level comment or reply to another comment. Requires authentication and CSRF token.",
        security: [{ cookieAuth: [] }],
        parameters: [
          {
            name: "postId",
            in: "path",
            required: true,
            schema: { type: "integer" },
            description: "Post ID",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateCommentRequest" },
              example: {
                content: "This is a great post!",
                parent_id: null,
              },
            },
          },
        },
        responses: {
          201: {
            description: "Comment created successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    comment: { $ref: "#/components/schemas/CommentWithAuthor" },
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
    "/comments/{id}": {
      get: {
        tags: ["Comments"],
        summary: "Get comment by ID",
        description: "Returns a comment by its ID. Public endpoint.",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
            description: "Comment ID",
          },
        ],
        responses: {
          200: {
            description: "Comment details",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    comment: { $ref: "#/components/schemas/CommentWithAuthor" },
                  },
                },
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
      put: {
        tags: ["Comments"],
        summary: "Update a comment",
        description: "Update a comment. Requires authentication, ownership, and CSRF token.",
        security: [{ cookieAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
            description: "Comment ID",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateCommentRequest" },
            },
          },
        },
        responses: {
          200: {
            description: "Comment updated successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    comment: { $ref: "#/components/schemas/CommentWithAuthor" },
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
            description: "CSRF token missing or invalid",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          404: {
            description: "Comment not found or unauthorized",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
      delete: {
        tags: ["Comments"],
        summary: "Delete a comment",
        description: "Delete a comment. Requires authentication, ownership, and CSRF token.",
        security: [{ cookieAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
            description: "Comment ID",
          },
        ],
        responses: {
          200: {
            description: "Comment deleted successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Comment deleted successfully" },
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
            description: "CSRF token missing or invalid",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          404: {
            description: "Comment not found or unauthorized",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
    "/comments/{id}/upvote": {
      post: {
        tags: ["Comments"],
        summary: "Toggle upvote on a comment",
        description: "Toggle upvote on a comment. If already upvoted, removes the upvote. Requires authentication and CSRF token.",
        security: [{ cookieAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
            description: "Comment ID",
          },
        ],
        responses: {
          200: {
            description: "Upvote toggled successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    hasVoted: { type: "boolean", description: "Whether the user has voted after toggle" },
                    upvotes: { type: "integer", description: "Updated upvote count" },
                  },
                },
              },
            },
          },
          400: {
            description: "Comment not found",
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
      Subreddit: {
        type: "object",
        properties: {
          id: { type: "integer" },
          name: { type: "string" },
          description: { type: "string" },
          creator_id: { type: "integer" },
          created_at: { type: "string", format: "date-time" },
        },
      },
      SubredditWithCreator: {
        type: "object",
        properties: {
          id: { type: "integer" },
          name: { type: "string" },
          description: { type: "string" },
          creator_id: { type: "integer" },
          creator_name: { type: "string" },
          created_at: { type: "string", format: "date-time" },
        },
      },
      CreateSubredditRequest: {
        type: "object",
        required: ["name", "description"],
        properties: {
          name: { type: "string", minLength: 3, description: "Alphanumeric with underscores, min 3 chars" },
          description: { type: "string" },
        },
      },
      UpdateSubredditRequest: {
        type: "object",
        properties: {
          name: { type: "string", minLength: 3 },
          description: { type: "string" },
        },
      },
      Post: {
        type: "object",
        properties: {
          id: { type: "integer" },
          subreddit_id: { type: "integer" },
          user_id: { type: "integer" },
          title: { type: "string" },
          content: { type: "string" },
          upvotes: { type: "integer" },
          created_at: { type: "string", format: "date-time" },
          updated_at: { type: "string", format: "date-time" },
        },
      },
      PostWithAuthor: {
        type: "object",
        properties: {
          id: { type: "integer" },
          subreddit_id: { type: "integer" },
          user_id: { type: "integer" },
          title: { type: "string" },
          content: { type: "string" },
          upvotes: { type: "integer" },
          author_name: { type: "string" },
          subreddit_name: { type: "string" },
          created_at: { type: "string", format: "date-time" },
          updated_at: { type: "string", format: "date-time" },
        },
      },
      CreatePostRequest: {
        type: "object",
        required: ["subreddit_id", "title", "content"],
        properties: {
          subreddit_id: { type: "integer" },
          title: { type: "string", maxLength: 300 },
          content: { type: "string", maxLength: 10000 },
        },
      },
      UpdatePostRequest: {
        type: "object",
        properties: {
          title: { type: "string", maxLength: 300 },
          content: { type: "string", maxLength: 10000 },
        },
      },
      Comment: {
        type: "object",
        properties: {
          id: { type: "integer" },
          post_id: { type: "integer" },
          user_id: { type: "integer" },
          parent_id: { type: ["integer", "null"] },
          content: { type: "string" },
          upvotes: { type: "integer" },
          created_at: { type: "string", format: "date-time" },
          updated_at: { type: "string", format: "date-time" },
        },
      },
      CommentWithAuthor: {
        type: "object",
        properties: {
          id: { type: "integer" },
          post_id: { type: "integer" },
          user_id: { type: "integer" },
          parent_id: { type: ["integer", "null"] },
          content: { type: "string" },
          upvotes: { type: "integer" },
          author_name: { type: "string" },
          created_at: { type: "string", format: "date-time" },
          updated_at: { type: "string", format: "date-time" },
        },
      },
      CreateCommentRequest: {
        type: "object",
        required: ["content"],
        properties: {
          content: { type: "string", maxLength: 10000 },
          parent_id: { type: ["integer", "null"], description: "ID of parent comment for nested replies" },
        },
      },
      UpdateCommentRequest: {
        type: "object",
        properties: {
          content: { type: "string", maxLength: 10000 },
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
