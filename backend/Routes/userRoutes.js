import express from "express";
import {
  createUser,
  loginUser,
  requestDelete,
  getAllUsers,
  getDeleteRequests,
  approveDelete,
} from "../controller/userController.js";

import { auth, isUser, isManager } from "../middleware/auth.js";

const router = express.Router();

router.post("/user/register", createUser);
router.post("/user/login", loginUser);

 
router.post("/user/request-delete", auth, isUser, requestDelete);


router.get("/manager/all-users", auth, isManager, getAllUsers);
router.get("/manager/delete-requests", auth, isManager, getDeleteRequests);
router.delete("/manager/approve-delete/:id", auth, isManager, approveDelete);

export default router;
