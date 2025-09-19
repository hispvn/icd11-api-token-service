const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
const PORT = 8080;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.text());

app.route("/").post(
  async (req,res) => {
    const scope = 'icdapi_access';
    const getIcd11ApiToken = await fetch('https://icdaccessmanagement.who.int/connect/token', {
      method: "POST",
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
      },
      body: `grant_type=client_credentials&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&scope=${scope}`
    }).then((result) => result.json());
    
    res.json({token: getIcd11ApiToken.access_token});
  }
);

app.route("/").get(
  async (req,res) => {
    res.json({
      ...require("./metadata/attributes.json"),
      ...require("./metadata/dataElements.json"),
      ...require("./metadata/indicators.json"),
      ...require("./metadata/indicatorTypes.json"),
      ...require("./metadata/legendSets.json"),
      ...require("./metadata/legendSets.json"),
      ...require("./metadata/optionGroups.json"),
      ...require("./metadata/optionGroupSets.json"),
      ...require("./metadata/options.json"),
      ...require("./metadata/optionSets.json"),
      ...require("./metadata/programIndicators.json"),
      ...require("./metadata/programs.json"),
      ...require("./metadata/programStages.json"),
      ...require("./metadata/programStageSections.json"),
      ...require("./metadata/sqlViews.json"),
      ...require("./metadata/trackedEntityAttributes.json"),
      ...require("./metadata/trackedEntityTypes.json"),
      mapping: require("./metadata/mapping.json"),
      iso3_code: require("./metadata/iso3_code.json"),
      icd11_options: require("./metadata/icd11_options.json").options
    })
  }
);

app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`);
});