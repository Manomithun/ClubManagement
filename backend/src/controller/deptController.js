import deptService from "../service/deptService.js";
import asyncHandler from "express-async-handler";
const getDepartment=asyncHandler(async(req,res)=>{
    const id=Number(req.params.id);
    const dept=await deptService.getDepartmentById(id);
    res.json(dept);
});

const createDepartment=asyncHandler(async(req,res)=>{
    const data=req.body;
    const dept=await deptService.createDepartment(data);
    res.json(dept);
})

const updateDepartment=asyncHandler(async(req,res)=>{
    const data=req.body;
    const id=Number(req.params.id);
    const updatedDept=await deptService.updateDepartment(id,data);
    res.json(updatedDept);
})
const deleteDepartment=asyncHandler(async(req,res)=>{
    const id=Number(req.params.id);
    const deletedDepartment=await deptService.delteDepartment(id);
    res.json({
        message:"department Deleted",
        dept:deletedDepartment
    });
});

export default{
    deleteDepartment,
    updateDepartment,
    createDepartment,
    getDepartment
}