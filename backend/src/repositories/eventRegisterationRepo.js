import prisma from "../config/prisma.js";
const createEventRegisteration=async(data)=>{
   
    const EventReg=await prisma.EventRegisteration.create({
        data:data
    });
    return EventReg;
}
const checkUserRegisteration=async(eventId,userId)=>{
     const EventReg=await prisma.EventRegisteration.find({
        where:{
            eventId,
            userId
        }
    });
    return EventReg;
}
const getRegisterationForEvent=async(id)=>{
    const EventReg=await prisma.EventRegisteration.findMany({
        where:{
            eventId:id
        }
    });
    return EventReg;
}
const deleteRegister=async(id)=>{
    const deletedEventReg=await prisma.EventRegisteration.delete({
        where:{
            id
        }
    });
    return deletedEventReg;
}
const getEventReg=async(id)=>{
    const reg=await prisma.EventRegisteration.find({
        where:{
            id:id
        }
    });
    return reg;
}
const userCanRegister=async(eventId)=>{
    const getmemberLimit=await prisma.Event.find({
        where:{
            id:eventId
        },
        select:{
            maxParticipants:true
        }
    });
    const registeredCount=await prisma.EventRegisteration.findMany({
        where:{
            eventId:eventId
        }
    }).length();
    return (getmemberLimit>registeredCount);
}

export default{
    deleteRegister,
    getRegisterationForEvent,
    createEventRegisteration,
    checkUserRegisteration,
    userCanRegister,
    getEventReg
}