import { createServer, Server } from "http";
import { Express } from "express";
import request from "supertest";
import mongoose from "mongoose";
import hobbyModel from "../src/models/hobby.model";
import appInit from "../src/app";

const path: string = "/api/v1/hobbies";
let app: Express;
let server: Server;

beforeEach(async () => {
  app = await appInit();
  server = createServer(app);
});

afterEach(async () => {
  await hobbyModel.model.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
  server.close();
});

describe(path, () => {
  describe("GET /", () => {
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
      const document = await hobbyModel.model.create({
        _id: new mongoose.Types.ObjectId(),
        name: "surfing",
        passionLevel: "Low",
      });

      const response = await request(server).get(`${path}/${document._id}`);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("data");
    });
  });

  describe("POST /", () => {
    it("Should return 500 status if name already exist", async () => {
      await hobbyModel.model.create({
        _id: new mongoose.Types.ObjectId(),
        name: "swimming",
        passionLevel: "Low",
      });

      const response = await request(server)
        .post(path)
        .send({
          data: {
            name: "swimming",
            passionLevel: "Medium",
          },
        });
      expect(response.status).toBe(500);
    });

    it("Should return 400 status if passionLevel not valid", async () => {
      const response = await request(server)
        .post(path)
        .send({
          data: {
            name: "swimming",
            passionLevel: "Extra-High",
          },
        });
      expect(response.status).toBe(400);
    });

    it("Should return 201 status & object with data property", async () => {
      const response = await request(server)
        .post(path)
        .send({
          data: {
            name: "football",
            passionLevel: "Very-High",
          },
        });
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("data");
    });
  });

  describe("PUT /:id", () => {
    it("Should return 400 status if id is invalid", async () => {
      const response = await request(server).put(`${path}/1`);
      expect(response.status).toBe(400);
    });

    it("Should return 404 status if no document in database with the given id", async () => {
      const response = await request(server)
        .put(`${path}/${new mongoose.Types.ObjectId().toString()}`)
        .send({
          data: {
            name: "swimming",
            passionLevel: "Very-High",
            year: 2019,
          },
        });
      expect(response.status).toBe(404);
    });

    it("Should return 500 status if new name already exist", async () => {
      const hobbies = [
        {
          _id: new mongoose.Types.ObjectId(),
          name: "swimming",
          passionLevel: "Low",
        },
        {
          _id: new mongoose.Types.ObjectId(),
          name: "gaming",
          passionLevel: "High",
        },
      ];
      await hobbyModel.model.insertMany(hobbies);

      const [doc_1, doc_2] = hobbies;

      const response = await request(server)
        .put(`${path}/${doc_1._id.toString()}`)
        .send({
          data: {
            name: doc_2.name,
            passionLevel: "Very-High",
            year: 2019,
          },
        });
      expect(response.status).toBe(500);
    });

    it("Should return 200 status if id and body is valid", async () => {
      const document = await hobbyModel.model.create({
        _id: new mongoose.Types.ObjectId(),
        name: "surfing",
        passionLevel: "Low",
      });

      const updateDocument = {
        name: "surfing",
        passionLevel: "Very-High",
        year: 2018,
      };

      const response = await request(server)
        .put(`${path}/${document._id.toString()}`)
        .send({
          data: updateDocument,
        });
      expect(response.status).toBe(200);

      expect(response.body["data"]["name"]).toBe(updateDocument.name);
      expect(response.body["data"]["passionLevel"]).toBe(
        updateDocument.passionLevel
      );
      expect(response.body["data"]["year"]).toBe(updateDocument.year);
    });
  });

  describe("DELETE /:id", () => {
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
      const document = await hobbyModel.model.create({
        _id: new mongoose.Types.ObjectId(),
        name: "swimming",
        passionLevel: "Low",
      });

      const response = await request(server).delete(
        `${path}/${document._id.toString()}`
      );

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("data");
    });
  });
});
