import prisma from "../config/prisma.js";
const checkIfTheUserIsPastMemberOfClub=async(userId,clubId)=>{
    const member=await prisma.clubJoinHistory.findFirst({
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
const joinClubHistory=async(data,tx=prisma)=>{
    const club=await tx.clubJoinHistory.create({
        data:data
    });
    return club;
}

const updateClubJoinHistory=async(userId,clubId,LeftTime,leaveReason,tx=prisma)=>{
    const record = await tx.clubJoinHistory.findFirst({
        where:{ userId, clubId, leftAt: null }
    });
    if(!record) return null;
    const club=await tx.clubJoinHistory.update({
        where:{ id: record.id },
        data:{
            leftAt:LeftTime,
            leaveReason:leaveReason
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

const getClubMemberHistory = async (clubId) => {

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
    getClubMemberHistory,
    getUserHistory,
    updateClubJoinHistory,
    joinClubHistory
}