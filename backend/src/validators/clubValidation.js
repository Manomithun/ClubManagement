import {z} from "zod";

export const clubSchema=z.object({
    name:z.string().min(5,"name must be atleat 5 character"),
    deptId:z.coerce.number("Invalid department Id"),
    adminId:z.coerce.number("Invalid admin Id"),
    memberLimit:z.number().min(1,"atlest member Limit must be 1"),
    description:z.string().optional()

})
export const updateClubAdminSchema=z.object({
    adminId:z.coerce.number("Invalid admin Id")
})