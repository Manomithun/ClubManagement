import userService from "../services/userServices.js";
import asyncHandler from "express-async-handler";
const getUserByID=asyncHandler(async(req,res)=>{
    const id=Number(req.params.id);
    const user=await userService.getUserById(id);
    res.json(user);
});
const getMyAccount=asyncHandler(async(req,res)=>{
    const id=req.user.id;
    const me=await userService.getUserById(id);
    res.json(me);
})
const getAllUser=asyncHandler(async(req,res)=>{
    const page=Number(req.query.page)||1;
    const limit=Number(req.query.limit)||10;
    const search=req.query.search||"";
    const users=await userService.getAllUser({page:page,limit:limit,serach:search});
    res.json(users);
});

const updateUser=asyncHandler(async(req,res)=>{
    const id=Number(req.user.id);
    const updatedUser=await updateUser(id,req.body);
    res.json(updatedUser);
})

const deleteUser = asyncHandler(async(req,res)=>{

    const id = Number(req.user.id);

    const deletedUser =
        await userService.deleteUser(id);

    res.json({
        message:"User account deactivated successfully",
        user:deletedUser
    });

});

const getPastClub=asyncHandler(async(req,res)=>{
   const id=Number(req.params.id);
    const club=await getPastClub(id);
    res.json(club);
})

export default{
   deleteUser,
    getPastClub,
    getAllUser,
    updateUser,
    getUserByID,
    getMyAccount
}