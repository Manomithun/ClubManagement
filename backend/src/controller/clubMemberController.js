import clubMemberService from "../services/clubMemberService.js";
import asyncHandler from "express-async-handler";
const joinClub=asyncHandler(async(req,res)=>{
        const data={
            userId:Number(req.user.id),
            clubId:Number(req.params.clubId)
        }
        const result=await clubMemberService.joinClub(data);
        res.json(result);
});
const leaveClub=asyncHandler(async(req,res)=>{
    const data={
        userId:Number(req.user.id),
        clubId:Number(req.params.clubId),
        leftAt:new Date(),
        leaveReason:"LEFT_VOLUNTARILY"
    }
    const result=await clubMemberService.leaveClub(data);
    res.json(result);

});
const removeMemberFromClub=asyncHandler(async(req,res)=>{
    const data={
        userId:Number(req.params.userId),
        clubId:Number(req.params.clubId),
        LeftAt:new Date(),
        leaveReason:"REMOVED_BY_ADMIN"
    }
    const result=await clubMemberService.leaveClub(data);
    res.json(result);
});
const getClubMembers=asyncHandler(async(req,res)=>{
    const clubMembers=await clubMemberService.getClubMembers(Number(req.params.clubId));
    res.json(clubMembers);
});
const getUserSpecificClub=asyncHandler(async(req,res)=>{
    const club=await clubMemberService.getUserSpecificClub(Number(req.user.id),Number(req.params.clubId));
    res.json(club);
});
const getUserClubs=asyncHandler(async(req, res)=>{
    const userClubs=await clubMemberService.getUserMembership(Number(req.user.id));
    res.json(userClubs);
});

export default{
    joinClub,
    leaveClub,
    removeMemberFromClub,
    getClubMembers,
    getUserSpecificClub,
    getUserClubs
}
