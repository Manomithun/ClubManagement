import prisma from "../config/prisma.js";
const createEventRegisteration=async(data)=>{
   
    const EventReg=await prisma.eventRegisteration.create({
        data:data
    });
    return EventReg;
}
const checkUserRegisteration=async(eventId,userId)=>{
     const EventReg=await prisma.eventRegisteration.findUnique({
        where:{
     userId_eventId: {
      userId:userId,
      eventId:eventId,
    },
        }
    });
    return EventReg;
}
const getRegisterationForEvent=async(id)=>{
    const EventReg=await prisma.eventRegisteration.findMany({
        where:{
            eventId:id
        }
    });
    return EventReg;
}
const deleteRegister=async(id)=>{
    const deletedEventReg=await prisma.eventRegisteration.delete({
        where:{
            id
        }
    });
    return deletedEventReg;
}
const getEventReg=async(id)=>{
    const reg=await prisma.eventRegisteration.findUnique({
        where:{
            id:id
        }
    });
    return reg;
}
const userCanRegister=async(eventId)=>{
    const getmember=await prisma.event.findUnique({
        where:{
            id:eventId
        },
        select:{
            maxParticipants:true
        }
    });
    const getmemberLimit=getmember.maxParticipants;
     const registrations = await prisma.eventRegisteration.findMany({
  where: {
    eventId: eventId,
  },
   });
const registeredCount = registrations.length;
    return (getmemberLimit>registeredCount);
}

const getMyRegistrations = async (userId) => {
    return await prisma.eventRegisteration.findMany({
        where: { userId },
        include: {
            event: {
                include: { club: true }
            }
        },
        orderBy: { event: { date: 'asc' } }
    });
};

export default{
    deleteRegister,
    getRegisterationForEvent,
    createEventRegisteration,
    checkUserRegisteration,
    userCanRegister,
    getEventReg,
    getMyRegistrations
}