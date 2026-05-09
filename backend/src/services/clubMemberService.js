import prisma from "../config/prisma.js";
import clubMemberRepo from "../repositories/clubMemberRepo.js";
import clubHistoryRepo from "../repositories/clubHistoryRepo.js";
import customError from "../utils/customError.js";
import waitList from "../repositories/waitingList.js";
import clubRepo from "../repositories/clubRepo.js";
const joinClub = async (data) => {

    // check current membership
    const isCurrentMember = await clubMemberRepo.getUserSpecificClub(data.userId,data.clubId);

    if (
       isCurrentMember
    ) {
        throw new customError(
            "You are already a member of this club",
            401
        );
    }
    //check if the user is the past member of club
    const isPastMember=await clubHistoryRepo.checkIfTheUserIsPastMemberOfClub(data.userId,data.clubId);
    if(isPastMember){
        throw new customError(
            "You are a past member of the club, please contact admin",
            401
        );
    }



   // check vacancy for user
   const hasVacancy =
   await clubRepo.hasVacancy(data.clubId);

if(!hasVacancy){
        // check if the user with same user id and club 
        const checkUserIsInWaitingList=await waitList.getUserWaitingListEntry(
            data.userId,data.clubId);
        if(checkUserIsInWaitingList){
            throw new customError(
                "you are already in waiting list of this club",
                401
            );
        }
        await waitList.createWaitingListEntry({userId:data.userId, clubId:data.clubId});
        throw new customError(
            "Club is full, you have been added to the waiting list",
            401
        );
    }


    // transaction
    const result = await prisma.$transaction(async (tx) => {

        await clubHistoryRepo.joinClubHistory({
            
                userId: data.userId,
                clubId: data.clubId,
                joinedAt: new Date(),
                isActive:true
            
        },tx);

        const member = await clubMemberRepo.createClubMember({
            data: {
                userId: data.userId,
                clubId: data.clubId,
                joinedAt: new Date()
            }
        },tx);

        return member;
    });

    return result;
};

const leaveClub = async (userId, clubId,LeftAt,leaveReason) => {
   const clubMemberShip=await clubMemberRepo.getUserSpecificClub(userId,clubId);
   if(!clubMemberShip){
       throw new customError("You are not a member of this club",401);

   }
   const result =await prisma.$transaction(async(tx)=>{
    //update history
    await clubHistoryRepo.updateClubJoinHistory(userId,clubId,LeftAt,leaveReason,tx);
    //remove from club
    const removedMember=await clubMemberRepo.removeClubMember(userId,clubId,tx);

    // get waiting list user
    const waitingUser=await waitList.getWaitingUser(clubId,tx);
    if(waitingUser){
        // add to club
        await clubMemberRepo.createClubMember({
            userId:waitingUser.userId,
            clubId:clubId,
            isActive:true
        },tx);
        //update clubJoin History
        await clubHistoryRepo.joinClubHistory({
            userId:waitingUser.userId,
            clubId:clubId
        },tx);

        // remove from waiting list
        await waitList.removeFromWaitingList(waitingUser.userId,clubId,tx);
       //TODO
       //send email via notification/email
       //you are  added to the club
    }
    return removedMember;


   })
    return result;  
};

const getClubMembers=async(clubId)=>{   
    const club=await clubRepo.getClubById(clubId);
    if(!club){
        throw new customError("Club does not exist", 404);
    }

    const members=await clubMemberRepo.getClubMembers(clubId);
    return members;
}
const getUserMembership = async(userId)=>{

    const userMembership =
        await clubMemberRepo.userCurrentClubDetails(userId);

    return userMembership.map(member => ({
        clubName: member.club.name,
        joinedAt: member.joinedAt,
        clubId: member.clubId
    }));
}
const getUserSpecificClubMemberShip=async(userId,clubId)=>{
    const membership=await clubMemberRepo.getUserSpecificClub(userId,clubId);
    if(!membership){
        throw new customError("You are not a member of this club",404);
    }
    return {
        clubName: membership.club.name,
        joinedAt: membership.joinedAt,
        clubId: membership.clubId
    }
}

export default{
    joinClub,
    leaveClub,
    getUserSpecificClubMemberShip,
    getUserMembership,
    getClubMembers
}