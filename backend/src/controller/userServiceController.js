import userService from "../services/userServices.js";
import asyncHandler from "express-async-handler";
const getUserByID=asyncHandler(async(req,res)=>{
    const id=Number(req.params.id);
    const user=await userService.getUserByID(id);
    res.json(user);
});
const getMyAccount=asyncHandler(async(req,res)=>{
    const id=req.user.id;
    const me=await userService.getUserByID(id);
    res.json(me);
})
const getAllUser=asyncHandler(async(req,res)=>{
    const page=Number(req.query.page)||1;
    const limit=Number(req.query.limit)||10;
    const search=req.query.search||"";
    const users=await userService.getAllUser({page:page,limit:limit,search:search});
    res.json(users);
});

const updateUser=asyncHandler(async(req,res)=>{
    const id=Number(req.user.id);
    const updatedUser=await userService.updateUser(id,req.body);
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
    const club=await userService.getPastClub(id);
    res.json(club);
})

const updateUserRole = asyncHandler(async(req, res) => {
    const id   = Number(req.params.id);
    const role = req.body.role;
    const VALID = ['STUDENT', 'CLUB_ADMIN', 'SYSTEM_ADMIN'];
    if (!VALID.includes(role)) {
        return res.status(400).json({ message: `Invalid role. Must be one of: ${VALID.join(', ')}` });
    }
    const updated = await userService.updateUser(id, { role });
    res.json({ message: `Role updated to ${role}`, user: updated });
});

export default{
   deleteUser,
    getPastClub,
    getAllUser,
    updateUser,
    getUserByID,
    getMyAccount,
    updateUserRole
}