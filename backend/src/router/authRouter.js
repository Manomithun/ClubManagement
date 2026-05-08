import {signIn,signUp} from '../controller/authController.js';
import {registerSchema,loginSchema} from "../validators/authValidation.js";
import validate from "../middleware/validationMiddleWare.js";
import express from 'express';
const authRouter=express.Router();
authRouter.post("/signup",validate(registerSchema),signUp);
authRouter.post("/signin",validate(loginSchema),signIn);

export default authRouter;