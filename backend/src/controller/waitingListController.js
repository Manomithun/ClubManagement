import waitingList from "../services/waitingListService.js";
import asyncHandler from "express-async-handler";
const getWaitingListForClub=asyncHandler(async(req,res)=>{
    const clubId=Number(req.params.clubId);

    const waitingListForClub=await waitingList.getWaitingListForClub(clubId);
    res.json(waitingListForClub);
});
const getUserWaitingListEntry=asyncHandler(async(req,res)=>{
    const clubId=Number(req.params.clubId);
    const userId=req.user.id;
    const userEntry=await waitingList.getUserWaitingListEntry(clubId,userId);
    res.json(userEntry);
})
export default{
    getWaitingListForClub,
    getUserWaitingListEntry
}