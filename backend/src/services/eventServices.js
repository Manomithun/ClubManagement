import customError from "../utils/customError.js";
import allowedTransitions from "../utils/eventStatusTransitions.js";
import  eventRepo from "../repositories/eventRepo.js";
import clubRepo from "../repositories/clubRepo.js";
const createEvent=async(data)=>{
    const {clubId, description, date, maxParticipants, status}=data;
    const club=await clubRepo.getClubById(clubId);
    if(!club){
        throw new customError("Invalid Club Id",404);
    }
    const event=await eventRepo.createEvent({
        title:       data.title,
        date:        new Date(date),
        maxParticipants: Number(maxParticipants),
        clubId:      Number(clubId),
        description: description ?? null,
        status:      status ?? 'PENDING',
    });
    return event;
}
const getAllEvents=async(filters)=>{
    const events=await eventRepo.getAllEvents(filters);
    return events;
}
const getEventById= async(id)=>{
    const event=await  eventRepo.getEventById(id);
    return event;
}
const updateEvent=async(id,data)=>{
    const existEvent=await eventRepo.getEventById(id);
    if(!existEvent){
        throw new customError("Invalid Event Id",404);
    }
    const event=await eventRepo.updateEvent(id,data);
    return event;
}
const updateEventStatus=async({id,newStatus,user})=>{
    const event=await eventRepo.getEventById(id);
    if(!event){
        throw new  customError("Invalid Event Id",404);
    }
    const currentStatus=event.status;
    const currentRules=allowedTransitions[currentStatus];
    const allowedRoles=currentRules?.[newStatus];
    if(!allowedRoles){
        throw new customError("Invalid Status Transition",400);
    }
    if(!allowedRoles.includes(user.role)){
        throw new customError("UnAuthorized", 403);
    }
    await eventRepo.updateEvent(id,{ status:newStatus});
    event.status=newStatus;
    return event;
        
    

    
}

const deleteEvent=async(id)=>{
    const event=await eventRepo.getEventById(id);
    if(!event){
        throw new customError("Invalid Event Id", 404);
    }
    await eventRepo.deleteEvent(id);
    return event;
}

const getEventByClubId=async(id)=>{
    const club=await clubRepo.getClubById(id);
    if(!club){
        throw new customError("club id not found",404);
    } 
    const events=await eventRepo.getEventByClubId(id);
    return events;
}



export default {
    createEvent,
    getAllEvents,
    getEventById,
    updateEvent,
    deleteEvent,
    updateEventStatus,
    getEventByClubId
}   
