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

export default{
    getClubByName,
    createClub,
    getAllClubs,
    getClubById,
    updateClub,
    deleteClub
}