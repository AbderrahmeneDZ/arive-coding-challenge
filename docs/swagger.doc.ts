import config from "config";

export default {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "ARIVE Express Challenge",
      description: "A backend application that manages users and their hobbies",
      version: "0.0.1",
      contact: {
        name: "Abderrahmene Bouidia",
        email: "abderrahmene_bouidia@hotmail.com",
        url: "https://www.linkedin.com/in/abderrahmene-bouidia/",
      },
    },
    servers: [
      {
        url: "/",
        description: "Local Dev",
      },
    ],
    swaggerOptions: {
      authAction: {
        JWT: {
          name: "JWT",
          schema: {
            type: "apiKey",
            in: "header",
            name: "Authorization",
            description: "",
          },
          value: "Bearer <JWT>",
        },
      },
    },
    components: {
      schemas: {
        _id: {
          type: "string",
          description: "mongo object id",
          example: "61672bfe6d894524bfd1caed",
        },
        userId: {
          name: "userId",
          in: "path",
          required: true,
          description: "user mongo object id",
          type: "string",
          example: "61672bfe6d894524bfd1caed",
        },
        hobbyId: {
          name: "hobbyId",
          in: "path",
          required: true,
          description: "hobby mongo object id",
          type: "string",
          example: "61672bfe6d894524bfd1caed",
        },
        User: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "mongo object id",
              example: "61672bfe6d894524bfd1caed",
            },
            name: {
              type: "string",
              description: "user full name",
              example: "John Doe",
            },
            hobbies: {
              type: "array",
              description: "hobbies id",
              items: {
                $ref: "#/components/schemas/_id",
              },
            },
          },
        },
        UserInput: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description: "user full name",
              example: "John Doe",
            },
            hobbies: {
              type: "array",
              description: "hobbies id",
              items: {
                $ref: "#/components/schemas/_id",
              },
            },
          },
        },
        Hobby: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "mongo object id",
              example: "61672bfe6d894524bfd1caed",
            },
            name: {
              type: "string",
              description: "hobby name",
              example: "swimming",
            },
            passionLevel: {
              type: "string",
              description: "level of passion",
              enum: [...config.get("HOBBIES.PASSION-LEVEL")],
            },
            year: {
              type: "number",
              description: "Hobby starting year",
              example: 2015,
            },
          },
        },
        HobbyInput: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description: "hobby name",
              example: "swimming",
            },
            passionLevel: {
              type: "string",
              description: "level of passion",
              enum: [...config.get("HOBBIES.PASSION-LEVEL")],
            },
            year: {
              type: "number",
              description: "Hobby starting year",
              example: 2015,
            },
          },
        },
        Error: {
          type: "object",
          properties: {
            message: {
              type: "string",
              description: "Error message",
              example: "Not found",
            },
            error: {
              type: "boolean",
              example: true,
            },
          },
        },
      },
    },
    explorer: true,
    consumes: ["application/json"],
    produces: ["application/json"],
    tags: [
      {
        name: "Users",
        description: "API for users management",
      },
      {
        name: "Hobbies",
        description: "API for hobbies management",
      },
    ],
    paths: {
      "/api/v1/users": {
        get: {
          tags: ["Users"],
          summary: "Get all users",
          responses: {
            200: {
              description: "data received",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      data: {
                        type: "array",
                        items: {
                          $ref: "#/components/schemas/User",
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        post: {
          tags: ["Users"],
          summary: "Create new user",
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    data: {
                      $ref: "#/components/schemas/UserInput",
                    },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: "User created",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      data: {
                        $ref: "#/components/schemas/User",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/api/v1/users/{userId}": {
        parameters: [
          {
            $ref: "#/components/schemas/hobbyId",
          },
        ],
        get: {
          tags: ["Users"],
          summary: "Get get single user by id",
          responses: {
            200: {
              description: "data received",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      data: {
                        $ref: "#/components/schemas/User",
                      },
                    },
                  },
                },
              },
            },
            404: {
              description: "data not found",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      data: {
                        $ref: "#/components/schemas/Error",
                      },
                    },
                  },
                },
              },
            },
          },
        },
        put: {
          tags: ["Users"],
          summary: "Update an existing user by id",
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    data: {
                      $ref: "#/components/schemas/UserInput",
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "User updated",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      data: {
                        $ref: "#/components/schemas/User",
                      },
                    },
                  },
                },
              },
            },
            404: {
              description: "data not found",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      data: {
                        $ref: "#/components/schemas/Error",
                      },
                    },
                  },
                },
              },
            },
          },
        },
        delete: {
          tags: ["Users"],
          summary: "Remove an existing user by id",
          responses: {
            200: {
              description: "data received",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      data: {
                        $ref: "#/components/schemas/User",
                      },
                    },
                  },
                },
              },
            },
            404: {
              description: "data not found",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      data: {
                        $ref: "#/components/schemas/Error",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/api/v1/hobbies": {
        get: {
          tags: ["Hobbies"],
          summary: "Get all hobbies",
          responses: {
            200: {
              description: "data received",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      data: {
                        type: "array",
                        items: {
                          $ref: "#/components/schemas/Hobby",
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        post: {
          tags: ["Hobbies"],
          summary: "Create new hobby",
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    data: {
                      $ref: "#/components/schemas/HobbyInput",
                    },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: "Hobby created",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      data: {
                        $ref: "#/components/schemas/Hobby",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/api/v1/hobbies/{hobbyId}": {
        parameters: [
          {
            $ref: "#/components/schemas/hobbyId",
          },
        ],
        get: {
          tags: ["Hobbies"],
          summary: "Get get single hobby by id",
          responses: {
            200: {
              description: "data received",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      data: {
                        $ref: "#/components/schemas/Hobby",
                      },
                    },
                  },
                },
              },
            },
          },
        },
        put: {
          tags: ["Hobbies"],
          summary: "Update an existing hobby by id",
          responses: {
            200: {
              description: "data received",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      data: {
                        $ref: "#/components/schemas/Hobby",
                      },
                    },
                  },
                },
              },
            },
            404: {
              description: "data not found",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      data: {
                        $ref: "#/components/schemas/Error",
                      },
                    },
                  },
                },
              },
            },
          },
        },
        delete: {
          tags: ["Hobbies"],
          summary: "Remove an existing hobby by id",
          responses: {
            200: {
              description: "data received",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      data: {
                        $ref: "#/components/schemas/Hobby",
                      },
                    },
                  },
                },
              },
            },
            404: {
              description: "data not found",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      data: {
                        $ref: "#/components/schemas/Error",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: ["../src/routes*.route.ts"],
};
