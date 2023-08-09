const express = require("express");
const dotenv = require("dotenv").config();
const dbConfig = require("./src/config/db_Config");
const mainConfig = require("./src/config/main_Config");
const mainRouter = require("./src/routes/router");

const app = express();

const port = process.env.PORT || 5001;

dbConfig();
mainConfig(app);
mainRouter(app);

app.listen(port, () => {
  console.log(`server is running on ${port}`);
});
