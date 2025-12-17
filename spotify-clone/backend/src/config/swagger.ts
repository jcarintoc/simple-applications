export const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Spotify Clone API",
    version: "1.0.0",
    description: "Spotify Playlist Clone API with authentication, CSRF protection, songs, playlists, and likes",
  },
  servers: [
    {
      url: "/api",
      description: "API Server",
    },
  ],
  tags: [
    { name: "Auth", description: "Authentication endpoints" },
    { name: "Songs", description: "Song browsing and search" },
    { name: "Playlists", description: "Playlist management" },
    { name: "Likes", description: "Song likes management" },
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
    "/songs": {
      get: {
        tags: ["Songs"],
        summary: "Get all songs",
        description: "Returns all songs. If authenticated, includes liked status for each song.",
        responses: {
          200: {
            description: "List of songs",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    songs: {
                      type: "array",
                      items: { $ref: "#/components/schemas/SongWithLiked" },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/songs/search": {
      get: {
        tags: ["Songs"],
        summary: "Search songs",
        parameters: [
          {
            name: "q",
            in: "query",
            required: true,
            schema: { type: "string" },
            description: "Search query (searches title, artist, album)",
          },
        ],
        responses: {
          200: {
            description: "Search results",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    songs: {
                      type: "array",
                      items: { $ref: "#/components/schemas/SongWithLiked" },
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Missing search query",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
    "/songs/{id}": {
      get: {
        tags: ["Songs"],
        summary: "Get song by ID",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          200: {
            description: "Song details",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    song: { $ref: "#/components/schemas/SongWithLiked" },
                  },
                },
              },
            },
          },
          404: {
            description: "Song not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
    "/playlists": {
      get: {
        tags: ["Playlists"],
        summary: "Get user playlists",
        description: "Returns all playlists for the authenticated user",
        responses: {
          200: {
            description: "List of playlists",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    playlists: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Playlist" },
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
        tags: ["Playlists"],
        summary: "Create a playlist",
        description: "Requires CSRF token in x-csrf-token header",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreatePlaylistRequest" },
            },
          },
        },
        responses: {
          201: {
            description: "Playlist created",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string" },
                    playlist: { $ref: "#/components/schemas/Playlist" },
                  },
                },
              },
            },
          },
          400: {
            description: "Invalid request",
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
    "/playlists/{id}": {
      get: {
        tags: ["Playlists"],
        summary: "Get playlist by ID",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          200: {
            description: "Playlist with songs",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    playlist: { $ref: "#/components/schemas/PlaylistWithSongs" },
                  },
                },
              },
            },
          },
          404: {
            description: "Playlist not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
      put: {
        tags: ["Playlists"],
        summary: "Update playlist",
        description: "Requires CSRF token",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdatePlaylistRequest" },
            },
          },
        },
        responses: {
          200: {
            description: "Playlist updated",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string" },
                    playlist: { $ref: "#/components/schemas/Playlist" },
                  },
                },
              },
            },
          },
          404: {
            description: "Playlist not found or not authorized",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
      delete: {
        tags: ["Playlists"],
        summary: "Delete playlist",
        description: "Requires CSRF token",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          200: {
            description: "Playlist deleted",
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
            description: "Playlist not found or not authorized",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
    "/playlists/{id}/songs/{songId}": {
      post: {
        tags: ["Playlists"],
        summary: "Add song to playlist",
        description: "Requires CSRF token",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
            description: "Playlist ID",
          },
          {
            name: "songId",
            in: "path",
            required: true,
            schema: { type: "integer" },
            description: "Song ID",
          },
        ],
        responses: {
          200: {
            description: "Song added",
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
            description: "Song already in playlist or not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
      delete: {
        tags: ["Playlists"],
        summary: "Remove song from playlist",
        description: "Requires CSRF token",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
          {
            name: "songId",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          200: {
            description: "Song removed",
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
            description: "Song not in playlist",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
    "/likes": {
      get: {
        tags: ["Likes"],
        summary: "Get liked songs",
        description: "Returns all songs liked by the authenticated user",
        responses: {
          200: {
            description: "List of liked songs",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    songs: {
                      type: "array",
                      items: { $ref: "#/components/schemas/SongWithLiked" },
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
    "/likes/{songId}": {
      post: {
        tags: ["Likes"],
        summary: "Toggle like on a song",
        description: "Likes or unlikes a song. Requires CSRF token.",
        parameters: [
          {
            name: "songId",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          200: {
            description: "Like toggled",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string" },
                    is_liked: { type: "boolean" },
                  },
                },
              },
            },
          },
          400: {
            description: "Song not found",
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
      Song: {
        type: "object",
        properties: {
          id: { type: "integer" },
          title: { type: "string" },
          artist: { type: "string" },
          album: { type: "string", nullable: true },
          duration_seconds: { type: "integer" },
          cover_url: { type: "string", nullable: true },
          created_at: { type: "string", format: "date-time" },
        },
      },
      SongWithLiked: {
        allOf: [
          { $ref: "#/components/schemas/Song" },
          {
            type: "object",
            properties: {
              is_liked: { type: "boolean" },
            },
          },
        ],
      },
      Playlist: {
        type: "object",
        properties: {
          id: { type: "integer" },
          name: { type: "string" },
          description: { type: "string", nullable: true },
          user_id: { type: "integer" },
          created_at: { type: "string", format: "date-time" },
        },
      },
      PlaylistWithSongs: {
        allOf: [
          { $ref: "#/components/schemas/Playlist" },
          {
            type: "object",
            properties: {
              songs: {
                type: "array",
                items: { $ref: "#/components/schemas/SongWithLiked" },
              },
              song_count: { type: "integer" },
            },
          },
        ],
      },
      CreatePlaylistRequest: {
        type: "object",
        required: ["name"],
        properties: {
          name: { type: "string", minLength: 1 },
          description: { type: "string" },
        },
      },
      UpdatePlaylistRequest: {
        type: "object",
        properties: {
          name: { type: "string" },
          description: { type: "string" },
        },
      },
    },
  },
};
