export const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Instagram Clone API",
    version: "1.0.0",
    description: "Instagram Clone API with authentication and CSRF protection",
  },
  servers: [
    {
      url: "/api",
      description: "API Server",
    },
  ],
  tags: [
    { name: "Auth", description: "Authentication endpoints" },
    { name: "Users", description: "User search endpoints" },
    { name: "Posts", description: "Post management endpoints" },
    { name: "Comments", description: "Comment management endpoints" },
    { name: "Follows", description: "Follow/unfollow endpoints" },
    { name: "Stories", description: "Story viewing endpoints" },
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
    "/posts/feed": {
      get: {
        tags: ["Posts"],
        summary: "Get feed",
        description: "Get posts from users you follow. Requires authentication.",
        security: [{ cookieAuth: [] }],
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
    "/posts": {
      get: {
        tags: ["Posts"],
        summary: "Get all posts",
        description: "Get all posts, optionally filtered by user_id query parameter. Public endpoint.",
        parameters: [
          {
            name: "user_id",
            in: "query",
            required: false,
            schema: { type: "integer" },
            description: "Filter posts by user ID",
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
                image_url: "https://picsum.photos/400/400",
                caption: "Beautiful sunset!",
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
            description: "CSRF token missing or invalid, or unauthorized",
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
            description: "CSRF token missing or invalid, or unauthorized",
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
    "/posts/{id}/like": {
      post: {
        tags: ["Posts"],
        summary: "Toggle like on a post",
        description: "Toggle like on a post. If already liked, removes the like. Requires authentication and CSRF token.",
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
            description: "Like toggled successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    hasLiked: { type: "boolean", description: "Whether the user has liked after toggle" },
                    likes_count: { type: "integer", description: "Updated likes count" },
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
        description: "Returns all comments for a post. Public endpoint.",
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
        description: "Create a new comment on a post. Requires authentication and CSRF token.",
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
                content: "Great post!",
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
            description: "CSRF token missing or invalid, or unauthorized",
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
            description: "CSRF token missing or invalid, or unauthorized",
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
    "/users/search": {
      get: {
        tags: ["Users"],
        summary: "Search users",
        description: "Search for users by name or email. Public endpoint.",
        parameters: [
          {
            name: "q",
            in: "query",
            required: true,
            schema: { type: "string" },
            description: "Search query (name or email)",
          },
          {
            name: "limit",
            in: "query",
            required: false,
            schema: { type: "integer", default: 20 },
            description: "Maximum number of results",
          },
        ],
        responses: {
          200: {
            description: "List of matching users",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    users: {
                      type: "array",
                      items: { $ref: "#/components/schemas/User" },
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Invalid search query",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
    "/users/{userId}/posts": {
      get: {
        tags: ["Posts"],
        summary: "Get posts by user",
        description: "Returns all posts by a specific user. Public endpoint.",
        parameters: [
          {
            name: "userId",
            in: "path",
            required: true,
            schema: { type: "integer" },
            description: "User ID",
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
    },
    "/users/{userId}/follow": {
      post: {
        tags: ["Follows"],
        summary: "Follow a user",
        description: "Follow a user. Requires authentication and CSRF token.",
        security: [{ cookieAuth: [] }],
        parameters: [
          {
            name: "userId",
            in: "path",
            required: true,
            schema: { type: "integer" },
            description: "User ID to follow",
          },
        ],
        responses: {
          200: {
            description: "User followed successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    message: { type: "string" },
                  },
                },
              },
            },
          },
          400: {
            description: "Validation error (e.g., cannot follow yourself)",
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
      delete: {
        tags: ["Follows"],
        summary: "Unfollow a user",
        description: "Unfollow a user. Requires authentication and CSRF token.",
        security: [{ cookieAuth: [] }],
        parameters: [
          {
            name: "userId",
            in: "path",
            required: true,
            schema: { type: "integer" },
            description: "User ID to unfollow",
          },
        ],
        responses: {
          200: {
            description: "User unfollowed successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    message: { type: "string" },
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
        },
      },
    },
    "/users/{userId}/following": {
      get: {
        tags: ["Follows"],
        summary: "Get users that a user follows",
        description: "Returns list of users that the specified user follows. Public endpoint.",
        parameters: [
          {
            name: "userId",
            in: "path",
            required: true,
            schema: { type: "integer" },
            description: "User ID",
          },
        ],
        responses: {
          200: {
            description: "List of users",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    following: {
                      type: "array",
                      items: { $ref: "#/components/schemas/UserBasic" },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/users/{userId}/followers": {
      get: {
        tags: ["Follows"],
        summary: "Get users following a user",
        description: "Returns list of users following the specified user. Public endpoint.",
        parameters: [
          {
            name: "userId",
            in: "path",
            required: true,
            schema: { type: "integer" },
            description: "User ID",
          },
        ],
        responses: {
          200: {
            description: "List of users",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    followers: {
                      type: "array",
                      items: { $ref: "#/components/schemas/UserBasic" },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/users/{userId}/following/check": {
      get: {
        tags: ["Follows"],
        summary: "Check if current user follows a user",
        description: "Check if the authenticated user follows the specified user. Requires authentication.",
        security: [{ cookieAuth: [] }],
        parameters: [
          {
            name: "userId",
            in: "path",
            required: true,
            schema: { type: "integer" },
            description: "User ID to check",
          },
        ],
        responses: {
          200: {
            description: "Follow status",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    isFollowing: { type: "boolean" },
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
    "/users/{userId}/stories": {
      get: {
        tags: ["Stories"],
        summary: "Get active stories by user",
        description: "Returns active stories for a specific user. Requires authentication.",
        security: [{ cookieAuth: [] }],
        parameters: [
          {
            name: "userId",
            in: "path",
            required: true,
            schema: { type: "integer" },
            description: "User ID",
          },
        ],
        responses: {
          200: {
            description: "List of active stories",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    stories: {
                      type: "array",
                      items: { $ref: "#/components/schemas/StoryWithAuthor" },
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
    "/stories": {
      get: {
        tags: ["Stories"],
        summary: "Get active stories",
        description: "Returns all stories. Requires authentication.",
        security: [{ cookieAuth: [] }],
        responses: {
          200: {
            description: "List of active stories",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    stories: {
                      type: "array",
                      items: { $ref: "#/components/schemas/StoryWithAuthor" },
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
          user_id: { type: "integer" },
          image_url: { type: "string" },
          caption: { type: ["string", "null"] },
          likes_count: { type: "integer" },
          created_at: { type: "string", format: "date-time" },
        },
      },
      PostWithAuthor: {
        type: "object",
        properties: {
          id: { type: "integer" },
          user_id: { type: "integer" },
          image_url: { type: "string" },
          caption: { type: ["string", "null"] },
          likes_count: { type: "integer" },
          author_name: { type: "string" },
          author_email: { type: "string" },
          created_at: { type: "string", format: "date-time" },
        },
      },
      CreatePostRequest: {
        type: "object",
        required: ["image_url"],
        properties: {
          image_url: { type: "string", format: "uri" },
          caption: { type: ["string", "null"], maxLength: 2000 },
        },
      },
      UpdatePostRequest: {
        type: "object",
        properties: {
          caption: { type: ["string", "null"], maxLength: 2000 },
        },
      },
      Comment: {
        type: "object",
        properties: {
          id: { type: "integer" },
          post_id: { type: "integer" },
          user_id: { type: "integer" },
          content: { type: "string" },
          created_at: { type: "string", format: "date-time" },
        },
      },
      CommentWithAuthor: {
        type: "object",
        properties: {
          id: { type: "integer" },
          post_id: { type: "integer" },
          user_id: { type: "integer" },
          content: { type: "string" },
          author_name: { type: "string" },
          created_at: { type: "string", format: "date-time" },
        },
      },
      CreateCommentRequest: {
        type: "object",
        required: ["content"],
        properties: {
          content: { type: "string", minLength: 1, maxLength: 1000 },
        },
      },
      UpdateCommentRequest: {
        type: "object",
        properties: {
          content: { type: "string", minLength: 1, maxLength: 1000 },
        },
      },
      UserBasic: {
        type: "object",
        properties: {
          id: { type: "integer" },
          name: { type: "string" },
          email: { type: "string" },
        },
      },
      Story: {
        type: "object",
        properties: {
          id: { type: "integer" },
          user_id: { type: "integer" },
          image_url: { type: "string" },
          expires_at: { type: "string", format: "date-time" },
          created_at: { type: "string", format: "date-time" },
        },
      },
      StoryWithAuthor: {
        type: "object",
        properties: {
          id: { type: "integer" },
          user_id: { type: "integer" },
          image_url: { type: "string" },
          expires_at: { type: "string", format: "date-time" },
          author_name: { type: "string" },
          created_at: { type: "string", format: "date-time" },
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
