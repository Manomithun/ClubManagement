import {z} from "zod";

export const eventValidator=z.object({
    title:z.string().min(3),
    description:z.string().optional(),
    date:z.string().datetime(),
    maxParticipants:z.number().min(10),
    clubId:z.coerce.number()
})

export const updateEventStatus=z.object({
    status:z.enum(["PENDING","APPROVED","REJECTED","COMPLETED","ONGOING"])
})