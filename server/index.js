import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import teacherController from "./controller/teacherController.js";
import teacherPositionController from "./controller/teacherPositionController.js";

import teacherRoute from "./routers/teachersRoute.js";
import teacherPositionRoute from "./routers/teacherPositionRoute.js";
import routerUser from "./routers/userRoute.js";


const app = express();
const PORT = process.env.PORT || 8080;

const db_url = process.env.MONGODB_URL ;

function mylog(req, res, next) {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
}
app.use(mylog);

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Teacher Management API Server", status: "running" });
});

app.use("/teachers", teacherRoute);
app.use("/teacher-positions", teacherPositionRoute);
app.use("/users", routerUser)

const connectDB = async () => {
    try {
        await mongoose.connect(db_url);
        console.log("Connected to MongoDB");
       
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.log("Failed to connect to MongoDB");
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
}


connectDB();