import prisma from "../config/prisma.js";

const createClubMember=async(data)=>{
    const clubMember=await prisma.ClubMember.create({
        data:data
    })
    return clubMember;
}
const updateClubMember=async(data)=>{
    const updatedClubMember=await prisma.ClubMember.update({
        data:data
    })
};

const userCurrentClubDetails=async(id)=>{
    const clubs=await prisma.ClubMember.findMany({
        where:{
            userId:id
        },
        include:{
            club:true
        }
    });
    return clubs;
}

const getClubMembers=async(id)=>{
    const clubMember=await prisma.ClubMember.findMany({
        where:{
            clubId:id
        },
        include:{
            user:true
        }
    });
    return clubMember;
}

const removeClubMember=async(userId,clubId)=>{
    const removedMember=await prisma.ClubMember.delete({
        where:{
            clubId:clubId,
            userId:userId
        }
        
    });
    return removedMember;
}
export default{
    createClubMember,
    updateClubMember,
    userCurrentClubDetails,
    getClubMembers,
    removeClubMember
}