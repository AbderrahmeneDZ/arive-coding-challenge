import { createServer, Server } from "http";
import { Express } from "express";
import request from "supertest";
import mongoose from "mongoose";
import userModel from "../src/models/user.model";
import appInit from "../src/app";

const path: string = "/api/v1/users";
let app: Express;
let server: Server;

beforeEach(async () => {
  app = await appInit();
  server = createServer(app);
});

afterEach(async () => {
  await userModel.model.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
  server.close();
});

describe(path, () => {
  describe("GET", () => {
    it("Should return 200 status & object with data property", async () => {
      const response = await request(server).get(path);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("data");
    });
  });

  describe("GET /:id", () => {
    it("Should return 400 status if id is invalid", async () => {
      const response = await request(server).get(`${path}/1`);
      expect(response.status).toBe(400);
    });

    it("Should return 404 status if no document in database with the given id", async () => {
      const response = await request(server).get(
        `${path}/${new mongoose.Types.ObjectId().toString()}`
      );
      expect(response.status).toBe(404);
    });

    it("Should return 200 status & object with data property", async () => {
      const document = await userModel.model.create({
        _id: new mongoose.Types.ObjectId(),
        name: "John Doe",
        hobbies: [new mongoose.Types.ObjectId()],
      });

      const response = await request(server).get(`${path}/${document._id}`);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("data");
    });
  });

  describe("POST", () => {
    it("Should return 400 status if name length is less than 3 characters", async () => {
      const response = await request(server)
        .post(path)
        .send({
          data: {
            name: "Jo",
          },
        });
      expect(response.status).toBe(400);
    });

    it("Should return 400 status if name length is greater than 50 characters", async () => {
      const response = await request(server)
        .post(path)
        .send({
          data: {
            name: "a".repeat(51),
          },
        });
      expect(response.status).toBe(400);
    });

    it("Should return 400 status if hobbies item is no a valid object id", async () => {
      const response = await request(server)
        .post(path)
        .send({
          data: {
            name: "John Doe",
            hobbies: ["1"],
          },
        });
      expect(response.status).toBe(400);
    });

    it("Should return 201 status & object with data property", async () => {
      const response = await request(server)
        .post(path)
        .send({
          data: {
            name: "John Doe",
            hobbies: [new mongoose.Types.ObjectId().toString()],
          },
        });
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("data");
    });
  });

  describe("PUT", () => {
    it("Should return 400 status if id is invalid", async () => {
      const response = await request(server)
        .put(`${path}/1`)
        .send({ data: {} });
      expect(response.status).toBe(400);
    });

    it("Should return 404 status if no document in database with the given id", async () => {
      const response = await request(server)
        .put(`${path}/${new mongoose.Types.ObjectId().toString()}`)
        .send({
          data: {
            name: "John Doe",
            hobbies: [new mongoose.Types.ObjectId().toString()],
          },
        });
      expect(response.status).toBe(404);
    });

    it("Should return 400 status if name length is less than 3 characters", async () => {
      const document = await userModel.model.create({
        _id: new mongoose.Types.ObjectId(),
        name: "John Doe",
        hobbies: [new mongoose.Types.ObjectId()],
      });

      const response = await request(server)
        .put(`${path}/${document._id}`)
        .send({
          data: {
            name: "Jo",
          },
        });

      expect(response.status).toBe(400);
    });

    it("Should return 400 status if name length is greater than 50 characters", async () => {
      const document = await userModel.model.create({
        _id: new mongoose.Types.ObjectId(),
        name: "John Doe",
        hobbies: [new mongoose.Types.ObjectId()],
      });

      const response = await request(server)
        .put(`${path}/${document._id.toString()}`)
        .send({
          data: {
            name: "a".repeat(51),
          },
        });
      expect(response.status).toBe(400);
    });

    it("Should return 400 status if hobbies item is no a valid object id", async () => {
      const response = await request(server)
        .post(path)
        .send({
          data: {
            name: "John Doe",
            hobbies: ["1"],
          },
        });
      expect(response.status).toBe(400);
    });

    it("Should return 200 status if id and body is valid", async () => {
      const document = await userModel.model.create({
        _id: new mongoose.Types.ObjectId(),
        name: "John Doe",
        hobbies: [new mongoose.Types.ObjectId()],
      });

      const updatedDocument = {
        name: "John Newman",
        hobbies: document.hobbies.map((hobby) => hobby.toString()),
      };

      const response = await request(server)
        .put(`${path}/${document._id.toString()}`)
        .send({
          data: updatedDocument,
        });

      expect(response.status).toBe(200);

      expect(response.body["data"]["name"]).toBe(updatedDocument.name);
      expect(response.body["data"]["hobbies"]).toEqual(updatedDocument.hobbies);
    });
  });

  describe("DELETE", () => {
    it("Should return 400 status if id is invalid", async () => {
      const response = await request(server).delete(`${path}/1`);
      expect(response.status).toBe(400);
    });

    it("Should return 404 status if no document in database with the given id", async () => {
      const response = await request(server).delete(
        `${path}/${new mongoose.Types.ObjectId().toString()}`
      );
      expect(response.status).toBe(404);
    });

    it("Should return 200 status and data if id exist", async () => {
      const document = await userModel.model.create({
        _id: new mongoose.Types.ObjectId(),
        name: "John Doe",
        hobbies: [new mongoose.Types.ObjectId()],
      });

      const response = await request(server).delete(
        `${path}/${document._id.toString()}`
      );

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("data");
    });
  });
});
