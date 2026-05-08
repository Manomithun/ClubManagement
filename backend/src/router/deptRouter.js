import express from "express";
import deptController from "../controller/deptController.js";

const deptRouter=express.Router();
deptRouter.get("/:id",deptController.getDepartment);
deptRouter.post("/",deptController.createDepartment);
deptRouter.put("/:id",deptController.updateDepartment);
deptRouter.delete("/:id",deptController.deleteDepartment);
export default deptRouter;