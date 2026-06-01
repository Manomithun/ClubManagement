import eventService from "../services/eventServices.js";
import asyncHandler from "express-async-handler";
const createEvent=asyncHandler(async(req,res)=>{
    const createdBy=Number(req.user.id);
    req.body.createdBy=createdBy;
    const event=await eventService.createEvent(req.body);
    res.status(201).json(event);
})
const getAllEvents=asyncHandler(async(req,res)=>{
    const page=Number(req.query.page)||1;
    const limit=Number(req.query.limit)||10;
    const search=req.query.search||"";
    const status=req.query.status||"";
    const events=await eventService.getAllEvents({page,limit,search,status});
    res.json(events);
});
const getEventById=asyncHandler(async(req,res)=>{
    const id=Number(req.params.id);
    const event=await eventService.getEventById(id);
    res.json(event);
})

const updateEvent=asyncHandler(async(req,res)=>{
    const id=Number(req.params.id);
    const event=await eventService.updateEvent(id,req.body);
    res.json(event);
})

const updateEventStatus=asyncHandler(async(req,res)=>{
    const id=Number(req.params.id);
    const user=req.user;
    const newStatus=req.body.status;
    const updatedEvent=await eventService.updateEventStatus({id,user,newStatus});
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
    deleteEvent,
    updateEventStatus,
    updateEvent,
    createEvent,
    getEventById,
    getAllEvents
}