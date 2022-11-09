const express = require("express");
const bodyParser = require("body-parser");
const config = require("config");
const request = require("request");
const axios = require("axios");
const utils = require("./utils");
var fs = require("fs");

const app = express();

app.use(bodyParser.json({ limit: "10mb" }));

app.get("/investments/:id", (req, res) => {
  console.log(config.investmentsServiceUrl);
  const { id } = req.params;
  request.get(
    `${config.investmentsServiceUrl}/investments/${id}`,
    (e, r, investments) => {
      if (e) {
        console.error(e);
        res.send(500);
      } else {
        res.send(investments);
      }
    }
  );
});

app.post("/investments/export/csv", async (req, res) => {
  try {
    const investments = await utils.getInvestments();
    const companies = await utils.getCompanies();
    const investmentsCsv = await utils.getInvestmentsInCsv(
      investments,
      companies
    );
    fs.writeFileSync("out.csv", investmentsCsv.join("\n"));

    let fileCsv = fs.readFileSync("out.csv", "utf-8");

    //send csv file
    await utils.postInvestmentsCsv(fileCsv);
    res.sendStatus(200);
  } catch (e) {
    console.error(e);
    res.sendStatus(404);
  }
});

module.exports = app;
