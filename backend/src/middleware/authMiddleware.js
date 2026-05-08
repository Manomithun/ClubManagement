import jwt from "jsowebtoken";
import CustomError from "../utils/CustomError.js";
import asyncHandler from "express-async-handler"
import "dontenv/config"
export const verifyToken=asyncHandler((req,res,next)=>{
    const authHeader=req.headers.Authorization || req.headers.auth;
    if(authHeader && authHeader.startsWith("Bearer")){
        const token=authHeader.split(" ")[1];
        if(!token){
         throw new CustomError("invalid token",401);
        }
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        if(!decoded){
            throw new CustomError("invalid token",401);
        }
        req.user=decoded;
        next();
    }
    else{
        throw new CustomError("Not authorized, no token", 401);
    }
});

export const authorizeRole=asyncHandler((req,res,next)=>{
    if(!req.user || req.user.role!=="admin"){
        throw new CustomError("Not authorized as an admin", 401)
    }
});