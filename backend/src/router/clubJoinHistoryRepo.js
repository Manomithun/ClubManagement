import clubHistoryController from "../controller/clubHistroyController.js";
import express from "express";
import { protect, authorizeRole } from "../middleware/authMiddleWare.js";
const clubHistoryRouter = express.Router();

clubHistoryRouter.use(protect);
clubHistoryRouter.get("/club/:clubId", authorizeRole("SYSTEM_ADMIN", "CLUB_ADMIN"), clubHistoryController.getClubMemberHistory);
clubHistoryRouter.get("/user/history", clubHistoryController.getUserClubHistory);
export default clubHistoryRouter;
