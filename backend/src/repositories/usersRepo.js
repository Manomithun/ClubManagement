import prisma from '../config/prisma.js';

const getDepartmentByID=async(id)=>{
    const dept=await prisma.department.findUnique({
        where:{id}
    });
    
    return dept;
}

const getUserByEmail=async(email)=>{
    const user=await prisma.user.findUnique({
        where:{email}
    });
    return user;

}
const getUserById = async (id) => {
    return await prisma.user.findUnique({
        where: {
            id: id
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            department: true
        }
    });
};
const updateUser=async(id,data)=>{
    const user=await prisma.user.update({
        where:{id},
        data:data
    })
    return user;
}
const getAllUser=async({page,limit,search})=>{
    const p = parseInt(page)  || 1;
    const l = parseInt(limit) || 10;
    const users=await prisma.user.findMany({
        where:{
            ...(search && {
                name:{
                    contains:search,
                    mode:"insensitive"
                }
            })
        },
        skip:(p-1)*l,
        take:l
    });
    return users;
}

const getPastClub=async(id)=>{
    const pastClubs=await prisma.clubJoinHistory.findMany({
        where:{
            userId:id,
            leftAt:{
                not:null
            }
        },
        include:{
            club:true
        }
    });
    return pastClubs;
}
const getUserRegisteredEvent=async(id)=>{
    const RegisteredEvent=await prisma.eventRegisteration.findMany({
        where:{
           userId:id 
        },
        include:{
          event:true
        }
    });
    return RegisteredEvent;
}

const softDeleteUser = async(userId)=>{

   return await prisma.user.update({
      where:{
         id:userId
      },
      data:{
         isDeleted:true,
         deletedAt:new Date()
      }
   });

}


export default{
   getDepartmentByID,
    getUserByEmail,
    getUserById,
    softDeleteUser,
    getUserRegisteredEvent,
    getPastClub,
    getAllUser,
    updateUser
}