import {z} from "zod";
export const eventSchema=z.object({
   title:z
         .string().min(3),
    description:z
         .string().optiona(),
    status:z
          .enum([
            "PENDING",
            "APPROVED",
            "REJECTED",
            "COMPLETED",
            "ONGOING",
            
          ]),
    createdBy:z.
             string.uuid(),
    date:z.
         date(),
    maxParticipants:z.Number().min(10),
    clubId:z.string().uuid()
})
