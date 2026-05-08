import express from "express"
import cors from "cors"
import authRoutes from "./router/authRouter.js";
import errorHandler from "./middleware/ErrorHandleMiddleWare.js";
import clubRoutes from "./router/clubRouter.js";
import eventRoutes from "./router/EventRouter.js";
const app=express();
app.use(cors());
app.use(express.json());
app.use("/api/auth/",authRoutes);
app.use("/api/club/",clubRoutes);
app.use("/api/events/",eventRoutes);
app.use(errorHandler);
export default app;