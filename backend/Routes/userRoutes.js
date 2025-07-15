import express from "express";
import {
  createUser,
  loginUser,
  requestDelete,
  getAllUsers,
  getDeleteRequests,
  approveDelete,
   checkBalance,
   withdraw,
   credit,
   transfer,
   seeBalance
} from "../controller/userController.js";

import { auth, isUser, isManager } from "../middleware/auth.js";

const router = express.Router();

router.post("/user/register", createUser);
router.post("/user/login", loginUser);
router.get("/user/check-balance", auth, isUser, checkBalance);
router.put("/user/withdraw",auth,isUser,withdraw)
router.put("/user/credit",auth,isUser,credit); 
router.post("/user/request-delete", auth, isUser, requestDelete);
router.post("/user/transfer",auth,isUser,transfer);
router.get("/manager/all-users", auth, isManager, getAllUsers);
router.get("/manager/delete-requests", auth, isManager, getDeleteRequests);
router.delete("/manager/approve-delete/:id", auth, isManager, approveDelete);
router.get("/manager/see-balance/:accNumber", auth, isManager, seeBalance);

export default router;
