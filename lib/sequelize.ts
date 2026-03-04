import { Sequelize } from "sequelize";
import configObj from "../config/config.cjs";

const env = process.env.NODE_ENV || "development";
const config = (configObj as any)[env];

const connectionString =
  (config.use_env_variable && process.env[config.use_env_variable]) ||
  process.env.DATABASE_URL;

if (!connectionString && !(config.database && config.username)) {
  throw new Error("Missing DATABASE_URL or DB credentials");
}

declare global {
  // eslint-disable-next-line no-var
  var __sequelize: Sequelize | undefined;
}

const isProd = process.env.NODE_ENV === "production";

// ✅ do NOT force SSL in dev (also removes that warning locally)
const sequelizeOptions: any = {
  ...config,
  logging: config.logging ?? false,
  dialectOptions: isProd
    ? { ssl: { require: true, rejectUnauthorized: false } }
    : {},
};

export const sequelize =
  globalThis.__sequelize ||
  (connectionString
    ? new Sequelize(connectionString, sequelizeOptions)
    : new Sequelize(config.database, config.username, config.password, sequelizeOptions));

if (!isProd) globalThis.__sequelize = sequelize;

export default sequelize;