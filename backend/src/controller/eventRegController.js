import eventRegService from "../services/eventRegService.js";
import asyncHandler from "express-async-handler";
const registerEvent=asyncHandler(async(req,res)=>{
    const register=await eventRegService.eventRegisteration(req.body);
    res.json(register);
})

const getAllEventRegisterations=asyncHandler(async(req,res)=>{
    const id=Number(req.params.id);
    const registeration=await eventRegService.getAllEventRegisterations(id);
    res.json(registeration);
})

const deleteRegister=asyncHandler(async(req,res)=>{
    const id=Number(req.params.id);
    const deleted=await eventRegService.deleteRegister(id);
     res.json(deleted);
})

const getMyRegistrations = asyncHandler(async (req, res) => {
    const userId = Number(req.user.id);
    const registrations = await eventRegService.getMyRegistrations(userId);
    res.json(registrations);
});

export default{
    deleteRegister,
    getAllEventRegisterations,
    registerEvent,
    getMyRegistrations
}