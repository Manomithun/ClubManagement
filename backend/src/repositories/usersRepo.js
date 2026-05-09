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
    const user=await prisma.User.update({
        where:{id},
        data:data
    })
    return user;
}
const getAllUser=async({page,limit,search})=>{
    const users=await prisma.User.findMany({
        where:{
            ...(search && {
                name:{
                    contains:search,
                    mode:"insensitive"
                }
            })
        },
        skip:(page-1)*limit,
        take:limit
    });
    return users;
}

const getPastClub=async(id)=>{
    const pastClubs=await prisma.ClubJoinHistory.findMany({
        where:{
            userId:id,
            leftAt:{
                not:null
            }
        },
        include:{
            club:true
        }
    })
}
const getUserRegisteredEvent=async(id)=>{
    const RegisteredEvent=await prisma.EventRegisteration.findMany({
        where:{
           userId:id 
        },
        include:{
          event:true
        }
    });

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