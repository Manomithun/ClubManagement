import express from "express"
import cors from "cors"
import authRoutes from "./router/authRouter.js";
import errorHandler from "./middleware/ErrorHandleMiddleWare.js";
import clubRoutes from "./router/clubRouter.js";
import eventRoutes from "./router/EventRouter.js";
import deptRoutes from "./router/deptRouter.js";
import eventRegRoutes from "./router/EventRegRouter.js";
import userRoutes from "./router/UserRouter.js";
import clubMemberShipRoutes from "./router/ClubMemberRouter.js";
import waitingListRoutes from "./router/waitListRouter.js";
import clubjoinHistoryRoutes from "./router/clubJoinHistoryRepo.js";
const app=express();
app.use(cors());
app.use(express.json());
app.use("/api/auth/",authRoutes);
app.use("/api/club/",clubRoutes);
app.use("/api/events/",eventRoutes);
app.use("/api/department/",deptRoutes);
app.use("/api/eventRegeteration/",eventRegRoutes);
app.use("/api/user/",userRoutes);
app.use("/api/clubMembership/", clubMemberShipRoutes);
app.use("/api/waitingList/", waitingListRoutes);
app.use("/api/clubHistory/", clubjoinHistoryRoutes);
// ToDo notification via email
app.use(errorHandler);
export default app;