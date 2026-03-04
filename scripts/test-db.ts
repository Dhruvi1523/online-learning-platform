import { sequelize } from "../lib/sequelize";

async function test() {
  try {
    await sequelize.authenticate();
    console.log("Database connected");
  } catch (error) {
    console.error("Connection error:", error);
  }
}

test();