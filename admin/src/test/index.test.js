const request = require("supertest");
const tap = require("tap");
const app = require("../app");

tap.test("Find investments by id", async (t) => {
  const server = await app.listen();
  tap.teardown(() => {
    server.close();
  });
  const response = await request(app).get("/investments/1").expect(200);
});

tap.test("Export csv", async (t) => {
  const server = await app.listen();
  tap.teardown(() => {
    server.close();
  });
  await request(app).post("/investments/export/csv").expect(200);
});
