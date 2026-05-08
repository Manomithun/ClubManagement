import eventService from "../services/eventServices.js";
import asyncHandler from "express-async-handler";
const createEvent=asyncHandler(async(req,res)=>{
    const event=await eventService.createEvent(req.body);
    res.status(201).json(event);
})
const getAllEvents=asyncHandler(async(req,res)=>{
    const page=req.query.page||1;
    const limit=req.query.limit||10;
    const search=req.query.search||"";
    const status=req.query.status||"";
    const events=await eventService.getAllEvents({page,limit,search,status});
    res.json(events);
});
const getEventById=asyncHandler(async(req,res)=>{
    const id=Number(req.params.id);
    const event=await eventServie.getEventById(id);
    res.json(event);
})

const updateEvent=asyncHandler(async(req,res)=>{
    const id=Number(req.params.id);
    const event=await eventService.updateEvent(id,req.body);
    res.json(event);
})

const updateEventStatus=asyncHandler(async(req,res)=>{
    const id=Number(req.params.id);
    const updatedEvent=await updateEventStatus({id,...req.body});
    res.json(updatedEvent);
})

const deleteEvent=asyncHandler(async(req,res)=>{
    const id=Number(req.params.id);
    const event=await eventService.deleteEvent(id);
    res.json({message:"deleted",event:event});
})

const getEventByClubId=asyncHandler(async(req,res)=>{
    const id=Number(req.params.id);
    const event=await eventService.getEventByClubId(id);
    res.json(event);
})
export default{
    getEventByClubId,
    delteEvent,
    updateEventStatus,
    updateEvent,
    createEvent,
    getEventById,
    getAllEvents
}