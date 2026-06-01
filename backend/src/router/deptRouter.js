import express from "express";
import deptController from "../controller/deptController.js";
import {protect,authorizeRole} from "../middleware/authMiddleWare.js";
import {createDeptSchema} from "../validators/deptValidation.js";
import validate from "../middleware/validationMiddleWare.js";
const deptRouter=express.Router();
// Public: anyone can list departments (needed for registration form)
deptRouter.get("/",deptController.getAllDepartments);
deptRouter.get("/:id",deptController.getDepartment);
// Protected: only admins can create/update/delete
deptRouter.use(protect);
deptRouter.post("/",validate(createDeptSchema),authorizeRole("SYSTEM_ADMIN"),deptController.createDepartment);
deptRouter.put("/:id",authorizeRole("SYSTEM_ADMIN"),deptController.updateDepartment);
deptRouter.delete("/:id",authorizeRole("SYSTEM_ADMIN"),deptController.deleteDepartment);
export default deptRouter;