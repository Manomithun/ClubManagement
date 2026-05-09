import usersRepo from "../repositories/usersRepo.js";
import customError from "../utils/customError.js";
const getUserByID=async(id)=>{
    const user=await usersRepo.getUserById(id);
    if(!user){
        throw new customError("Invalid id",401);

    }
    return user;
}

const updateUser=async(id,data)=>{
    const user=await getUserById(id);
   const updatedUser=await usersRepo.updateUser(id,data);
   return updatedUser;

}
const getAllUser=async(filter)=>{
    return await usersRepo.getAllUser(filter);
}

const getPastClub=async(id)=>{
  await getUserById(id);
  return await usersRepo.getPastClub(id);
}

const deleteUser = async(userId)=>{

   const user = await userRepo.getUserById(userId);

   if(!user){
      throw new customError("User not found",404);
   }

   return await userRepo.softDeleteUser(userId);

}

export default{
    deleteUser,
    getPastClub,
    getAllUser,
    updateUser,
    getUserByID
}
