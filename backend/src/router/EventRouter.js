import express from "express";
import eventController from "../controller/eventController.js"
const eventRouter =express.router();
eventRouter.post("/",eventController.createEvent);
eventRouter.get("/",eventController.getAllEvent);
eventRouter.get("/:id",eventController.getEventById);
eventRouter.put("/:id",eventController.updateEvent);
eventRouter.patch("/:id/status",eventController.updateEventStatus);
eventRouter.delete("/:id",eventController.deleteEvent);
eventRouter.get("/:id/club",eventController.getEventByVlubId);
export default eventRouter;