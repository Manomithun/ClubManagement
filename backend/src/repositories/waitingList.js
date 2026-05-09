import prisma from "../config/prisma.js";
const createWaitingListEntry=async(data)=>{
    const entry=await prisma.WaitingList.create({
        data:data
    });
    return entry;
}
const getWaitingListForCub=async(clubId)=>{
    const waitingList=await prisma.WaitingList.findMany({
        where:{
            clubId:clubId
        },
        include:{
            user:true
        },
         orderBy: {
                    createdAt: "asc"
                }
    });
    return waitingList;
}
const removeFromWaitingList=async(userId,clubId,tx=prisma)=>{
    const removedEntry=await tx.WaitingList.delete({
        where:{
            clubId_userId:{
                clubId:clubId,
                userId:userId
            }
        }
    });
    return removedEntry;
}
const getUserWaitingListEntry=async(userId,clubId)=>{
    const entry=await prisma.WaitingList.findUnique({
        where:{
            clubId_userId:{
                clubId:clubId,
                userId:userId
            }
        }
    });
    return entry;
} 

const getWaitingUser=async(clubId,tx=prisma)=>{
    const waitingUser=await tx.waitingList.findFirst({
                where: {
                    clubId
                },
                orderBy: {
                    createdAt: "asc"
                }
            });
            return waitingUser;
}
export default{
    createWaitingListEntry,
    getWaitingListForCub,
    removeFromWaitingList,
    getUserWaitingListEntry,
    getWaitingUser
};

