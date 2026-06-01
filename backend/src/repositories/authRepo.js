import prisma from "../config/prisma.js";

const createUser=async(data)=>{
    const user=await prisma.user.create({
        data:data
    });
    return user;
}
export default{
   
    createUser
}