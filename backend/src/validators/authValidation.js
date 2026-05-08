import {z} from "zod";
export const registerSchema=z.object({
    name:z.
    string()
    .min(3,"Name must be at least 3 characters"),
    email:z.
    string().email("Invalid email"),
    password:z.
    string().min(6,"password must be at leat 6 character"),
    deptId: z.coerce.number()

});

export const loginSchema=z.object({
    email:z.string().email("Invalid email"),
    password:z.string().min(6,"password must be at leat 6 character")
});