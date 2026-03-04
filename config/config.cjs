"use strict";

require("dotenv").config();

module.exports = {
  development: {
   use_env_variable: "DATABASE_URL",
    dialect: "mysql",
    logging: false
  },
  test: {
    use_env_variable: "DATABASE_URL",
    dialect: "mysql"
  },
  production: {
    use_env_variable: "DATABASE_URL",
    dialect: "mysql"
  }
};