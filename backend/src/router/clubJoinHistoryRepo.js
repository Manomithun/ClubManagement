import clubHistoryController from "../controller/clubHistoryService.js";
import express from "express";
const clubHistoryRouter=express.Router();
clubHistoryRouter.get("/club/:clubId",clubHistoryController.getClubMemberHistory);
clubHistoryRouter.get("/user/history",clubHistoryController.getUserClubHistory);
export default clubHistoryRouter;
