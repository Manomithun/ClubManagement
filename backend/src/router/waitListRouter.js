import waitListController from "../controller/waitingListController.js";
import express from "express";
import {protect,authorizeRole} from "../middleware/authMiddleWare.js";
const waitListRouter=express.Router();
waitListRouter.use(protect);
waitListRouter.get("/club/:clubId",authorizeRole("SYSTEM_ADMIN","CLUB_ADMIN"),waitListController.getWaitingListForClub);
waitListRouter.get("/club/:clubId/user",waitListController.getUserWaitingListEntry);
export default waitListRouter;
