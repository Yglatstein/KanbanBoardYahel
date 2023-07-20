import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";


const app = express();
dotenv.config()
const PORT = process.env.PORT;

app.use(express.json());
app.use(express.static("public"));
app.use(cookieParser());

mongoose.set('strictQuery', true)


mongoose.connect(process.env.mongo_uri).then(res => {
    console.log("connected to DB")
}).catch((err) => {
    console.log("at mongoos.connect: ");
    console.log(err);
})


import usersRouts from "./API/users/usersRoutes";
app.use("/api/user", usersRouts);

import boardsRouts from "./API/boards/boardsRouts"
app.use("/api/board", boardsRouts);

import adminRouts from "./API/admin/adminRoutes"
app.use("/api/admin", adminRouts);

app.listen(PORT, () => {
  console.log(`server is active on port : ${PORT}`);
});

