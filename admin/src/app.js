const express = require("express");
const bodyParser = require("body-parser");
const config = require("config");
const request = require("request");
const axios = require("axios");
var fs = require("fs");

const app = express();

app.use(bodyParser.json({ limit: "10mb" }));

app.get("/investments/:id", (req, res) => {
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
    const resInvestments = await axios.get(
      `${config.investmentsServiceUrl}/investments`
    );
    let investments = [];
    for (const x of resInvestments.data) {
      let resCompany = await axios.get(
        `${config.companiesServiceUrl}/companies/${x.userId}`
      );
      let userId = x.userId;
      let hold = x.holdings.find((h) => {
        return h.id == userId;
      });

      let valueHold = 0;
      if (hold) valueHold = hold.investmentPercentage * x.investmentTotal;

      let nameCompany = resCompany.data.name;
      let line =
        "|" +
        x.userId +
        "|" +
        x.firstName +
        "|" +
        x.lastName +
        "|" +
        x.date +
        "|" +
        nameCompany +
        "|" +
        valueHold +
        "|";
      investments.push(line);
    }
    fs.writeFileSync("out.csv", investments.join("\n"));

    let fileCsv = fs.readFileSync("out.csv", "utf-8");

    //send csv file
    await axios.post(`${config.investmentsServiceUrl}/investments/export`, {
      file: fileCsv,
    });

    res.sendStatus(200);
  } catch (e) {
    console.error(e);
    res.sendStatus(404);
  }
});

module.exports = app;
