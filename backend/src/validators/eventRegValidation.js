import {z} from "zod";

export const eventRegSchema=z.object({
    eventId:z.coerce.number(),
    userId:z.coerce.number()
})