import prisma from "../config/prisma.js";
const createDepartment=async(data)=>{
    const dept=await prisma.department.create({
        data:data
    })
    return dept;
}
const getDepartmentByName=async(name)=>{
    const deptName=await prisma.department.findFirst({
        where:{
            name:{
                equals:name,
                mode:"insensitive"
            }
        }
    });
    return deptName;
}


const getDepartmentById=async(id)=>{
    const dept=await prisma.department.findUnique({
        where:{id}
    });
    
    return dept;
}
const updateDepartmentById=async(id,data)=>{
    const dept=await prisma.department.update({
        where:{
            id
        },
        data
    });
    return dept;
}

const deleteDepartment=async(id)=>{
    const dept=await prisma.department.delete({
        where:{id}
    })
    return dept;
}


export default{
    deleteDepartment,
    updateDepartmentById,
    getDepartmentById,
    createDepartment,
    getDepartmentByName
}