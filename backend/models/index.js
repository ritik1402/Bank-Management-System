import path from "path";
import Sequelize from "sequelize";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import UserModel from "./user.js"; 

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const sequelize = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
  }
);


const User = UserModel(sequelize); 


export { sequelize, User };
