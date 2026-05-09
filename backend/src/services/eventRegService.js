import prisma from "../config/prisma.js";
import customError from "../utils/customError.js";
import eventRepo from "../repositories/eventRepo.js";
import eventRegRepo from "../repositories/eventRegisterationRepo.js"
const eventRegisteration=async({userId,eventId})=>{
     const checkLimit=await eventRegRepo.userCanRegister(eventId);
    if(!check){
     throw new customError("Event Registeration Exist member Limit",401);
    }
    const checkIfUserAlreadyRegistered=await eventRegRepo.checkUserRegistration(eventId,userId);
    if(checkIfUserAlreadyRegistered){
        throw new customError("U Already Registered the Event",401);
    }
    return await eventRegRepo.createEventRegisteration({userId:userId,eventId:eventId});

    
}
const getAllEventRegisterations=async(id)=>{
    const check=await eventRepo.getEventById(id);
    if(!check){
        throw new customError("event Id not found",401);
    }
    const eventRegisterations=await eventRegRepo.getRegisterationForEvent(id);
    return eventRegisterations;
}
const deleteRegister=async(id)=>{
    const exist=await prisma.eventRegisteration.getEventReg(id);
    if(!exist){
        throw new customError("Invalid id",401);
    }
    const deletedEventReg=await prisma.EventRegRepo.deleteRegister(id);
    return deletedEventReg;
};
export default{
    deleteRegister,
    getAllEventRegisterations,
    eventRegisteration,
}
