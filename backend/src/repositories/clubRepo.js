import prisma from "../config/prisma.js";

const getClubByName=async(name)=>{
    const club=await prisma.Club.findUnique({
        where:{name}
    });
    return club;
};

const createClub=async(clubData)=>{
    const club=await prisma.Club.create({
        data:clubData
    });
    return club;
}

const getAllClubs=async({page,limit,search,department})=>{
    const clubs=await prisma.Club.findMany({
        where:{
            ...(search && {
                name:{
                    contains:search,
                    mode:"insensitive"
                }
            }),
            ...(department && {
                department:{
                   name:{
                    contains:department,
                    mode:"insensitive"
                   }
                
                }
            })
        },
        skip:(page-1)*limit,
        take:limit
    });
    return clubs;
}

const getClubById=async(id)=>{
    const club=await prisma.Club.findUnique({
        where:{id}
    });
    return club;
}

const updateClub=async(id,data)=>{
    const club=await prisma.Club.update({
        where:{id},
        data:data
    })
    
    return club;

}
const deleteClub=async(id)=>{
    const deletedClub=await prisma.Club.delete({
        where:{id}
    })
    return deletedClub;
}

const hasVacancy=async(id)=>{
   const club=await prisma.club.findFirst({
    where:{
        id
    }
   });
   const clubMember=await prisma.clubMember.findMany({
    where:{
        clubId:id
    }
   });
   
   return club.memberLimit>clubMember.length;

};

const getFullClubHistory = async(clubId)=>{

   return await prisma.club.findUnique({
      where:{
         id:clubId
      },

      include:{

         // membership history
         clubJoinHistory:{
            include:{
               user:true
            },
            orderBy:{
               joinedAt:"desc"
            }
         },

         // events
         events:{
            include:{
               registrations:true
            }
         },

         // current members
         members:{
            include:{
               user:true
            }
         },

         // waiting list
         waitingList:{
            include:{
               user:true
            }
         }

      }
   });

}

export default{
    getClubByName,
    createClub,
    getAllClubs,
    getClubById,
    updateClub,
    deleteClub,
    hasVacancy,
    getClubMember,
    getFullClubHistory

}