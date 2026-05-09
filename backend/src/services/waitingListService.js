import waitingList from "../repositories/waitingList.js";
import clubRepo from "../repositories/clubRepo.js";
import customError from "../utils/customError.js";
import userRepo from "../repositories/usersRepo.js";
const getWaitingListForClub=async(clubId)=>{
    // check club exist
    const club=await clubRepo.getCLubById(clubId);
    if(!club){
        throw new customError("Club id not found",404);
    }
    return await waitingList.getWaitingListForCub(clubId);
}
const getUserWaitingListEntry=async(clubId,userId)=>{
    // check club exist
    const club=await clubRepo.getCLubById(clubId);
    if(!club){
        throw new customError("Club id not found",404);
    }
    //check user exist
    const user=await userRepo.getUserById(userId);
    if(!user){
        throw new customError("User id not found",404);
    }
    return await waitingList.getUserWaitingListEntry(userId,clubId);

}
export default{
    getWaitingListForClub,
    getUserWaitingListEntry
}
