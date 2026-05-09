import eventRegController from "../controller/eventRegController.js";
import express from "express";
const EventRegRouter=express.Router();
EventRegRouter.get("/:id",eventRegController.getAllEventRegisterations);
EventRegRouter.post("/",eventRegController.registerEvent);
EventRegRouter.delete("/:id",eventRegController.deleteRegister);

export default EventRegRouter;