const axios = require("axios");
const config = require("../config/default.json");

async function getInvestments() {
  const resInvestments = await axios.get(
    `${config.investmentsServiceUrl}/investments`
  );
  return resInvestments.data;
}

async function getCompanies() {
  const resCompanies = await axios.get(
    `${config.companiesServiceUrl}/companies`
  );
  return resCompanies.data;
}

async function getCompanyById(id) {
  const resCompany = await axios.get(
    `${config.companiesServiceUrl}/companies/${id}`
  );
  return resCompany.data;
}

async function postInvestmentsCsv(fileCsv) {
  await axios.post(`${config.investmentsServiceUrl}/investments/export`, {
    file: fileCsv,
  });
}

function getInvestmentsInCsv(investments, companies) {
  const investmentsFormatCsv = investments.map(createLineForCsv);
  function createLineForCsv(x) {
    let userId = x.userId;
    let company = companies.find((c) => {
      return c.id == userId;
    });
    let hold = x.holdings.find((h) => {
      return h.id == userId;
    });

    let valueHold = 0;
    if (hold) valueHold = hold.investmentPercentage * x.investmentTotal;

    let nameCompany = company.name;
    let line =
      "|" +
      userId +
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
    return line;
  }
  return investmentsFormatCsv;
}

exports.getInvestments = getInvestments;
exports.getCompanyById = getCompanyById;
exports.getCompanies = getCompanies;
exports.getInvestmentsInCsv = getInvestmentsInCsv;
exports.postInvestmentsCsv = postInvestmentsCsv;
