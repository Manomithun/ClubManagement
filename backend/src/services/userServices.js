import usersRepo from "../repositories/usersRepo.js";
import customError from "../utils/CustomError.js";
const getUserByID=async(id)=>{
    const user=await usersRepo.getUserById(id);
    if(!user){
        throw new customError("Invalid id",401);

    }
    return user;
}

const updateUser=async(id,data)=>{
    const user=await usersRepo.getUserById(id);
    if(!user){
        throw new customError("User not found",404);
    }
   const updatedUser=await usersRepo.updateUser(id,data);
   return updatedUser;

}
const getAllUser=async(filter)=>{
    return await usersRepo.getAllUser(filter);
}

const getPastClub=async(id)=>{
  const user=await usersRepo.getUserById(id);
  if(!user){
      throw new customError("User not found",404);
  }
  return await usersRepo.getPastClub(id);
}

const deleteUser = async(userId)=>{

   const user = await usersRepo.getUserById(userId);

   if(!user){
      throw new customError("User not found",404);
   }

   return await usersRepo.softDeleteUser(userId);

}

export default{
    deleteUser,
    getPastClub,
    getAllUser,
    updateUser,
    getUserByID
}
