import {z} from "zod";

export const eventValidator=z.object({
    title:z.string().min(3),
    description:z.string().optional(),
    status:z.enum(["PENDING","APPROVED","REJECTED","COMPLETED","ONGOING"]),
    createdBy:z.string().uuid(),
    date:z.date(),
    maxParticipants:z.number().min(10),
    clubId:z.string().uuid()
})

export const updateEventStatus=z.object({
    status:z.enum(["PENDING","APPROVED","REJECTED","COMPLETED","ONGOING"])
})