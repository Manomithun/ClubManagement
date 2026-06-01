
import jsonwebtoken from 'jsonwebtoken';
import "dotenv/config";
import asyncHandler from 'express-async-handler'
import * as authServices from "../services/auth.Services.js"
import CustomError from "../utils/CustomError.js"
export const signUp=asyncHandler(async(req,res)=>{
   
      const user=await authServices.register(req.body);
     res.status(201).json({message:"User Created Successfully..",
        user:{
       id:user.id,
       name:user.name,
       email:user.email,
       role:user.role,
       deptId:user.deptId
    }
        }
    )

});

export const signIn=asyncHandler(async(req,res)=>{
   
   const {user,token}=await authServices.login(req.body);
    res.status(200).json({
        message:"Login Successfull",
        token,
        user:user
    })
})
