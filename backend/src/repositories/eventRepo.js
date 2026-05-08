import prisma from "../config/prisma.js";

const createEvent=async(eventData)=>{
    const event=await prisma.event.create({
        data:eventData
    });
    return event;
}

const getAllEvents=async ({page,limit,search,status})=>{
    const events=await prisma.event.findMany({
        where:{
          ...(search && {
            title:{
                contains:search,
                mode:"insensitive"
            }
          }),
          ...(status &&{
            status:status
          })
        },
        skip:(page-1)*limit,
        take:limit
    });
    return events;


}

const getEventById=async(id)=>{
    const event=await prisma.event.findUnique({
        where:{id}
    });
    return event;
}

const updateEvent=async(id,data)=>{
    const event=await prisma.event.update({
        where:{id},
        data
    });
  
    return event;
        
    

    
}
const deleteEvent=async(id)=>{
    const event=await prisma.event.delete({
        where:{id}
    });
    return event;
}

 const getEventByClubId=async(id)=>{
    const events=await prisma.event.findMany({
        where:{clubId:id}
    });
    return events;
}
export default{
    createEvent,
    getAllEvents,
    getEventById,
    updateEvent,
    deleteEvent,
    getEventByClubId
}