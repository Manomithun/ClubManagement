import prisma from "../config/prisma.js";

const createClubMember=async(data,tx=prisma)=>{
    const clubMember=await tx.clubMember.create({
        data:data
    })
    return clubMember;
}
const updateClubMember=async(userId,clubId,data)=>{
    const updatedClubMember=await prisma.clubMember.update({
        where:{
            userId_clubId:{ userId, clubId }
        },
        data:data
    })
    return updatedClubMember;
};

const userCurrentClubDetails=async(id)=>{
    const clubs=await prisma.clubMember.findMany({
        where:{
            userId:id
        },
        include:{
            club:true
        }
    });
    return clubs;
}

const getUserSpecificClub=async(userId,clubId)=>{
    const club=await prisma.clubMember.findFirst({
        where:{
            userId:userId,
            clubId:clubId
        },
        include:{
            club:true
        }
    });
    return club;

}

const getClubMembers=async(id)=>{
    const clubMember=await prisma.clubMember.findMany({
        where:{
            clubId:id
        },
        include:{
            user:true
        }
    });
    return clubMember;
}

const removeClubMember=async(userId,clubId,tx=prisma)=>{
    const removedMember=await tx.clubMember.delete({
        where:{
            userId_clubId:{
                clubId:clubId,
                userId:userId
            }
        }
        
    });
    return removedMember;
}
export default{
    createClubMember,
    updateClubMember,
    userCurrentClubDetails,
    getClubMembers,
    removeClubMember,
    getUserSpecificClub
}