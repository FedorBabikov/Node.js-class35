import { app } from "../app.js";
import supertest from "supertest";

const request = supertest(app);

describe("Testing: method `POST`, route `/weather`", () => {
  it("valid req: should respond with code (200)", async () => {
    const response = await request.post("/weather").send({
      cityName: "Amsterdam",
    });
    expect(response.status).toBe(200);
  });

  it("valid req: should contain the temperature", async () => {
    const response = await request.post("/weather").send({
      cityName: "Utrecht",
    });
    expect(response.text).toMatch(
      /Current temperature in Utrecht is \d+.\d+ degrees celsius./
    );
  });

  it("no `cityName` prop: should respond with code (400)", async () => {
    const response = await request
      .post("/weather")
      .send({ cityNam: "Amsterdam" });
    expect(response.status).toBe(400);
  });

  it("`cityName` prop is empty: should respond with code (400)", async () => {
    const response = await request.post("/weather").send({ cityName: "" });
    expect(response.status).toBe(400);
  });

  it("cityName is gibberish: should respond with code (500)", async () => {
    const response = await request.post("/weather").send({
      cityName: "Amstrecht",
    });
    expect(response.status).toBe(500);
  });
});
