import jwt from "jsonwebtoken";
import CustomError from "../utils/CustomError.js";
import asyncHandler from "express-async-handler"
import "dotenv/config"
export const protect=asyncHandler((req,res,next)=>{
    const authHeader=req.headers.authorization || req.headers.auth;
    if(authHeader && authHeader.startsWith("Bearer ")){
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

export const authorizeRole=(...allowedRoles)=>{
    return asyncHandler(async(req,res,next)=>{
        if(!allowedRoles.includes(req.user.role)){
            throw new CustomError(`User role ${req.user.role} is not allowed to access this route`, 403);
        }
        next();
    })
}