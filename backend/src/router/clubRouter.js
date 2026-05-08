import express from "express";
import clubController from "../controller/clubController.js";
import {clubSchema} from "../valadators/clubValidations";
import validate from "../middleware/validationMiddleWare.js";
const clubRouter=express.Router();

clubRouter.post("/",validate(clubSchema),clubController.createClub);
clubRouter.get("/",clubController.getAllClubs);
clubRouter.get("/:id",clubController.getClubById);
clubRouter.put("/:id",clubController.updateClub);
clubRouter.delete("/:id",clubController.deleteClub);
clubRouter.patch("/:id/admin",clubController.updateClubAdmin);

export default clubRouter;