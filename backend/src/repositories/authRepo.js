import prisma from "../config/prisma.js";

const createUser=async(data)=>{
    const user=await prisma.User.create({
        data:data
    });
    return user;
}
export default{
   
    createUser
}