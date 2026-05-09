import clubService from "../services/clubServices.js";
import asyncHandler from "express-async-handler"
const createClub=asyncHandler(async (req,res)=>{
const club=await clubService.createClub(req.body);
res.status(201).json(club);

})

const getAllClubs=asyncHandler(async(req,res)=>{
    const page=Number(req.query.page)||1;
    const limit=Number(req.query.limit)||10;
    const search=req.query.search|| "";
    const department=req.query.department|| "";
    const clubs=await clubService.getAllClubs({page,limit,search,department});
    res.json(clubs);
});

const getClubById=asyncHandler(async(req,res)=>{
    const id=Number(req.params.id);
    const club=await clubService.getClubById(id);
    res.json(club);
})

const updateClub=asyncHandler(async(req,res)=>{
    const id=Number(req.params.id);
    const updatedClub=await clubService.updateClub(id,req.body);
    res.json(updatedClub);
})

const deleteClub=asyncHandler(async(req,res)=>{
      const id=Number(req.params.id);
    const deletedClub=await clubService.deleteClub(id);
    res.json(deletedClub);
})

const updateClubAdmin=asyncHandler(async(req,res)=>{
    const {adminId}=req.body;
    const id=Number(req.params.id);
   const club=await clubService.updateAdmin(id,adminId);
   res.json(club);
});
const getFullClubHistory=asyncHandler(async(req, res)=>{
    const id=Number(req.params.id);
    const club=await clubService.getClubById(id);
    if(!club){
        res.status(404).json({message:"Club not found"});
        return;
    }
    const history=await clubService.getFullClubHistory(id);
    res.json(history);
})

export default{
    updateClubAdmin,
    deleteClub,
    updateClub,
    getClubById,
    getAllClubs,
    createClub,
    getFullClubHistory
}