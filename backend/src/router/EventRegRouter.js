import eventRegController from "../controller/eventRegController.js";
import express from "express";
import validate from "../middleware/validationMiddleware.js";
import {eventRegSchema} from "../validators/eventRegValidation.js";
import {protect,authorizeRole} from "../middleware/authMiddleware.js";
const EventRegRouter=express.Router();
EventRegRouter.use(protect);
EventRegRouter.get("/:id",eventRegController.getAllEventRegisterations);
EventRegRouter.post("/",validate(eventRegSchema),authorizeRole("SYSTEM_ADMIN","CLUB_ADMIN","STUDENT"),eventRegController.registerEvent);
EventRegRouter.delete("/:id",authorizeRole("SYSTEM_AMDIN","CLUB_AMDIN"),eventRegController.deleteRegister);

export default EventRegRouter;