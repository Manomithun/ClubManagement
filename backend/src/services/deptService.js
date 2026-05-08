import departmentRepo from "../repositories/departmentRepo.js";
import customError from "../utils/customError.js";
const createDepartment=async(data)=>{
   const {name}=data;
   const existdept=await departmentRepo.getDepartmentByName(name);
   if(existdept){
      throw new customError("Department Name Already exist",400);
   }
   const dept=await departmentRepo.createDepartment(data);
   return dept;
}
const updateDepartment=async(data)=>{
   const{id}=data;
   const existdept=await departmentRepo.getDepartmentById(id);
   if(!existdept){
      throw new customError("Invalid Department Id",401);
   }
   const updatedDept=await departmentRepo.updateDepartmentById(id,data);
   return updatedDept;
}

const getDepartmentById=async(id)=>{
   const existdept=await departmentRepo.getDepartmentbyId(id);
   if(!existdept){
     throw new customError("Invalid Department Id",401);
   }
   return existdept;
}

const deleteDepartment =
async(id)=>{

   const users =
   await prisma.user.findMany({
      where:{ deptId:id }
   });

   if(users.length > 0){

      throw new CustomError(
         "Department contains users",
         400
      );
   }

   const clubs =
   await prisma.club.findMany({
      where:{ deptId:id }
   });

   if(clubs.length > 0){

      throw new CustomError(
         "Department contains clubs",
         400
      );
   }

   return await departmentRepo
   .deleteDepartment(id);
}
export default{
   deleteDepartment,
   getDepartmentById,
   updateDepartment,
   createDepartment
}