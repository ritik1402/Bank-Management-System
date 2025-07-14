import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB, sequelize } from "./config/db.js";
import userRoutes from "./Routes/userRoutes.js";
import "./association.js"; 

dotenv.config(); 

const app = express();
const PORT = process.env.PORT || 8000;


app.use(cors());
app.use(express.json());


app.use("/api", userRoutes);


// app.use("*", (req, res) => {
//   res.status(404).json({ error: "Route not found" });
// });


const startServer = async () => {
  try {

      app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    await connectDB();
    await sequelize.sync();
    console.log("Database synced successfully.");

  
  } catch (err) {
    console.error(" Failed to start server:", err);
  }
};

startServer();
