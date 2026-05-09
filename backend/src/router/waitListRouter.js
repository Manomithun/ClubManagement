import waitListController from "../controller/waitingListController.js";
import express from "express";
const waitListRouter=express.Router();
waitListRouter.get("/club/:clubId",waitListController.getWaitingListForClub);
waitListRouter.get("/club/:clubId/user",waitListController.getUserWaitingListEntry);
export default waitListRouter;
