import eventRegController from "../controller/eventRegController.js";
import express from "express";
import validate from "../middleware/validationMiddleWare.js";
import {eventRegSchema} from "../validators/eventRegValidation.js";
import {protect,authorizeRole} from "../middleware/authMiddleWare.js";
const EventRegRouter=express.Router();
EventRegRouter.use(protect);
EventRegRouter.get("/my",eventRegController.getMyRegistrations);
EventRegRouter.get("/:id",eventRegController.getAllEventRegisterations);
EventRegRouter.post("/",validate(eventRegSchema),eventRegController.registerEvent);
EventRegRouter.delete("/:id",eventRegController.deleteRegister);

export default EventRegRouter;