
import express from "express";
import {
  getUsers,
  createUser,
  loginUser,
  deleteUser,
} from "../controller/userController.js";

const router = express.Router();

router.get("/user/users", getUsers); 
router.post("/user/register", createUser);  
router.post("/user/login", loginUser);     
router.delete("/user/del/:id", deleteUser);     

export default router;



