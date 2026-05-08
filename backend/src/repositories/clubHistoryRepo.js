import prisma from "../config/prisma.js";
const checkIfTheUserIsPastMemberOfClub=async(userId,clubId)=>{
    const member=await prisma.ClubJoinHistory({
        where:{
            userId:userId,
            clubId:clubId,
            leftAt:{
                not:null
            }
        }
    });
    return !!member;

}
const joinClubHistory=async(data)=>{
    const club=await prisma.ClubJoinHistory.create({
        data:data
    });
    return club;
}

const updateClubJoinHistory=async(userId,clubId,LeftTime)=>{
    const club=await prisma.ClubJoinHistory.update({
        where:{
           userId:userId,
           clubId:clubId
        },
        data:{
        LeftAt:LeftTime
        }
    });
    return club;
}

const getUserHistory = async (userId) => {

    return await prisma.clubJoinHistory.findMany({
        where: {
            userId
        },

        include: {
            club: true
        },

        orderBy: {
            joinedAt: "desc"
        }
    });
};

const getClubHistory = async (clubId) => {

    return await prisma.clubJoinHistory.findMany({
        where: {
            clubId
        },

        include: {
            user: true
        },

        orderBy: {
            joinedAt: "desc"
        }
    });
};
export default{
    checkIfTheUserIsPastMemberOfClub,
    getClubHistory,
    getUserHistory,
    updateClubJoinHistory,
    joinClubHistory
}