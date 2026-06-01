import clubHistoryService from "../services/clubHistoryService.js";
import asyncHandler from "express-async-handler";
const getClubMemberHistory=asyncHandler(async(req,res)=>{
    const clubId=Number(req.params.clubId);
    const history=await clubHistoryService.getClubMemberHistory(clubId);
    res.json(history);
})
const getUserClubHistory=asyncHandler(async(req,res)=>{
    const userId=Number(req.user.id);
    const history=await clubHistoryService.getUserClubHistory(userId);
    res.json(history);
});

export default{
    getClubMemberHistory,
    getUserClubHistory
}
