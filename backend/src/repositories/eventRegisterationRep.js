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

export default{
    deleteRegister,
    getRegisterationForEvent,
    createEventRegisteration,
    checkUserRegisteration
}