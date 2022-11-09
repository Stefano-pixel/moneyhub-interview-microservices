const axios = require("axios");
const config = require("../config/default.json");

async function getInvestments() {
  const resInvestments = await axios.get(
    `${config.investmentsServiceUrl}/investments`
  );
  return resInvestments;
}

async function getCompanyById(id) {
  const resCompany = await axios.get(
    `${config.companiesServiceUrl}/companies/${id}`
  );
  return resCompany.data;
}

async function mainFun() {
  const resInvestments = await getCompanyById(1);
  console.log(resInvestments);
}

mainFun();
