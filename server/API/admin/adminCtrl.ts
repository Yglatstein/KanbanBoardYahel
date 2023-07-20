import mongoose from "mongoose";
import UserModel from "../users/userModel";
import BoardModel from "../boards/boardsModel";
import jwt from "jwt-simple";
const saltRounds = 10;

export async function isAdmin(req, res) {
  try {
    console.log("here")
    const userId = req.userId;
    const userDB = await UserModel.findOne({ _id: userId }); 
    if (!userDB.permissionsType || userDB.permissionsType != 'admin'){
        res.status(500).send({ error: "permission denied" });
    }
    const boardsDB = await BoardModel.find();
    res.send({ success: true, boards: boardsDB });

  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}
