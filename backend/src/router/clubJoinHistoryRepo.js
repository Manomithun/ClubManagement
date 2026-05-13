import clubHistoryController from "../controller/clubHistoryService.js";
import express from "express";
import {protect,authorizeRole} from "../middleware/authMiddleware.js";
const clubHistoryRouter=express.Router();

clubHistoryRouter.use(protect);
clubHistoryRouter.get("/club/:clubId",authorizeRole("SYSTEM_AMDIN","CLUB_ADMIN"),clubHistoryController.getClubMemberHistory);
clubHistoryRouter.get("/user/history",authorizeRole("SYSTEM_AMDIN","CLUB_ADMIN"),clubHistoryController.getUserClubHistory);
export default clubHistoryRouter;
