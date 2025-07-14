import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();


const sequelize = new Sequelize(process.env.DB_URL, {
  dialect: "postgres",
  logging: false, 
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected");
  } catch (err) {
    console.error(" Failed to connect to DB:", err.message);
  }
};

export { sequelize, connectDB };