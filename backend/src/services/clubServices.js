import clubRepo from "../repositories/clubRepo.js";
import usersRepo from "../repositories/usersRepo.js";
import customError from "../utils/customError.js"
const createClub=async({name,deptId,adminId,memberLimit,description})=>{
  const existClub=await clubRepo.getClubByName(name);
  if(existClub){
    throw new customError("club name Already exists..",400);
  }
  const existAdmin=await usersRepo.getUserById(adminId);
  if(!existAdmin){
    throw new customError("admin not found",404);
  }

  const existDept=await usersRepo.getDepartmentByID(deptId);
  if(!existDept){
    throw new customError("department not found",404);
  }
  const club=await clubRepo.createClub({
    name,
    deptId,
    adminId,
    memberLimit,
    description
} )
return club;
  

}

const getAllClubs=async(filters)=>{
  const clubs=await clubRepo.getAllClubs(filters);
  return clubs;
}

const getClubByName=async(name)=>{
  
  const club=await clubRepo.getClubByName(name);
    
  return club;
}

const getClubById=async(id)=>{
  const club=await clubRepo.getClubById(id);
  if(!club){
    throw new customError("Club Id not found",404);
  }
  return club;
}

const updateClub=async(id,data)=>{
  
  const existClub=await clubRepo.getClubById(id);
  if(!existClub){
    throw new CustomError("club not found", 404);
  }
  const club=await clubRepo.updateClub(id,data);
  
  return club;

}

const deleteClub=async(id)=>{
  
  const existClub=await clubRepo.getClubById(id);
  if(!existClub){
    throw new CustomError("club not found", 404);
  }
  const deletedClub=await clubRepo.deleteClub(id);
  return deletedClub;
}

const updateAdmin=async(id,adminId)=>{
  const club=await clubRepo.getClubById(id);
  if(!club){
    throw new customError("Club id not found",404);

  }

  const admin=await usersRepo.getUserById(adminId);
  if(!admin){
    throw new customError("Admin id not found",404);
  }
  const updatedClub=await clubRepo.updateClub(id,{adminId:adminId});
  return updatedClub;

}

export default{
  createClub,
  getAllClubs,
  getClubById,
  updateClub,
  deleteClub,
  updateAdmin
}