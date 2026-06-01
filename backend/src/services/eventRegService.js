import customError from "../utils/customError.js";
import eventRepo from "../repositories/eventRepo.js";
import eventRegRepo from "../repositories/eventRegisterationRepo.js";
import userRepo from "../repositories/usersRepo.js"
const eventRegisteration=async({userId,eventId})=>{
    const existEvent=await eventRepo.getEventById(eventId);
    if(!existEvent){
        throw new customError("Event Id not found",404);
    }
     const checkLimit=await eventRegRepo.userCanRegister(eventId);
    if(!checkLimit){
     throw new customError("Event Registeration Exist member Limit",401);
    }
    const existUser=await userRepo.getUserById(userId);
    if(!existUser){
        throw new customError("User Id not found",401);
    }
    const checkIfUserAlreadyRegistered=await eventRegRepo.checkUserRegisteration(eventId,userId);
    if(checkIfUserAlreadyRegistered){
        throw new customError("U Already Registered the Event",401);
    }
    return await eventRegRepo.createEventRegisteration({userId:userId,eventId:eventId});

    
}
const getAllEventRegisterations=async(id)=>{
    const check=await eventRepo.getEventById(id);
    if(!check){
        throw new customError("event Id not found",404);
    }
    const eventRegisterations=await eventRegRepo.getRegisterationForEvent(id);
    return eventRegisterations;
}
const deleteRegister=async(id)=>{
    const exist=await eventRegRepo.getEventReg(id);
    if(!exist){
        throw new customError("Invalid registration id",404);
    }
    const deletedEventReg=await eventRegRepo.deleteRegister(id);
    return deletedEventReg;
};
const getMyRegistrations = async (userId) => {
    return await eventRegRepo.getMyRegistrations(userId);
};

export default{
    deleteRegister,
    getAllEventRegisterations,
    eventRegisteration,
    getMyRegistrations,
}
