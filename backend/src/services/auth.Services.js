import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';
import "dotenv/config";
import asyncHandler from 'express-async-handler';
import CustomError from "../utils/CustomError.js"
import authRepo from "../repositories/authRepo.js";
import usersRepo from "../repositories/usersRepo.js";
export const register=async(data)=>{
    const{name,email,password,deptId}=data
    const existUser= await usersRepo.getUserByEmail(email);

    if(existUser && !existUser.isDeleted){
       throw new CustomError("User already exists with this email!",400);      
    }
    
    if(existUser && existUser.isDeleted){

  return await prisma.user.update({
      where:{
         email
      },
      data:{
         isDeleted:false,
         deletedAt:null
      }
   });

}

    const existDept=await usersRepo.getDepartmentByID(deptId);
    if(!existDept){
        throw new CustomError("department not found", 404);
    }

    const hashedPassword=await bcrypt.hash(password,10);
    data.password=hashedPassword;
    const user=await authRepo.createUser(data)
   
    return user;

};

export const login=async({email,password})=>{
   
    const user=await usersRepo.getUserByEmail(email);
    if(!user){      
        throw new CustomError(" Invalid credentials",401);
    }
    if(user.isDeleted){
   throw new customError(
      "Account deactivated",
      403
   );
}
    
    const valid=await bcrypt.compare(password,user.password);
    if(!valid){      
        throw new CustomError("In valid Crediential",401);
    }

    const token=jsonwebtoken.sign({id:user.id,role:user.role,department:user.deptId},process.env.JWT_SECRET,{expiresIn:"1d"});
   return {user,token};
}

