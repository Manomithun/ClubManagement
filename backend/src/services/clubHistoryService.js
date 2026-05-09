import clubHistoryRepo from "../repositories/clubHistoryRepo.js";
import clubRepo from "../repositories/clubRepo.js";
import userRepo from "../repositories/usersRepo.js"
import customError from "../utils/customError.js";
const getUserClubHistory=async(userId)=>{
    // check user exist
    const user=await userRepo.getUserById(userId);
    if(!user){
        throw new customError("User id not found",404);
    }
    return await clubHistoryRepo.getUserHistory(userId);
}
const getClubMemberHistory=async(clubId)=>{
    // check club exist
    const club=await clubRepo.getCLubById(clubId);
    if(!club){
        throw new customError("Club id not found",404);
    }
    return await clubHistoryRepo.getClubMemberHistory;
}
export default{
    getClubMemberHistory,
    getUserClubHistory
}