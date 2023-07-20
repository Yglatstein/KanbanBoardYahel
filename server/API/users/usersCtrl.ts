import exp from "constants";
import mongoose from "mongoose";
import UserModel from "./userModel";
import jwt from "jwt-simple";
import bcrypt from "bcrypt";
const saltRounds = 10;

export async function getAllUsers(req, res) {
  try {
    const usersDB = await UserModel.find();
    if (!usersDB) throw new Error("no errors found on FUNCTION getAllUsers IN FILE userCtrl");

    res.send({ usersDB });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

export async function getUserByCookie(req, res) {
  try {
    const secret = process.env.SECRET;
    const { userID } = req.cookies;
    const jwtUserId = jwt.decode(userID, secret);
    console.log("decoded pass: ", jwtUserId);
    const { userId } = jwtUserId;
    console.log("user id: ", userId);
    const userDB = await UserModel.findOne({ _id: userId });
    console.log("recived from db: ", userDB);
    if (!userDB) throw new Error("No user found");
    console.log(userID);
    res.send({ userName: userDB.email });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

export async function getUserByID(req, res) {
  try {
    const userDB = await UserModel.findById(req.params.id);
    if (!userDB) throw new Error("No User Found");

    res.send({ userDB });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

export async function postUserLogin(req, res) {
  try {
    const { email, password } = req.body;
    console.log(req.body);

    const userDB = await UserModel.findOne({ email });
    if (!userDB) {
      console.log("no user found");
      throw new Error("No user found");
    }

    const isMatch = await bcrypt.compare(password, userDB.password);
    console.log("ismatch: ", isMatch);
    if (!isMatch) {
      console.log("bad pass");
      throw new Error("wrong password, try again!");
    }

    const secret = process.env.SECRET;
    if (!secret) throw new Error("Couldn't load secret from .env");
    const cookie = { userId: userDB._id };
    const JWTCookie = jwt.encode(cookie, secret);
    console.log("Generated cookie ", JWTCookie);
    res.cookie("userID", JWTCookie);
    res.send({ success: true, user: { userDB } });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

export async function postUserRegister(req, res) {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) throw new Error("email or passwork missing");
    const checkUserDB = await UserModel.findOne({ email });
    if (checkUserDB) throw new Error("email already in use");

    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);
    const userDB = new UserModel({ email, password: hash, name });
    await userDB.save();

    const secret = process.env.SECRET;
    if (!secret) throw new Error("secret value is missing");
    const cookie = { userId: userDB._id };
    const JWTCookie = jwt.encode(cookie, secret);
    res.cookie("userID", JWTCookie);
    res.send({ success: true, user: userDB });

    console.log(req.body);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

export async function getUserLogout(req, res) {
  try {
    res.clearCookie("userID");
    res.send({ success: true });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

export async function usersIdsToEmails(req, res) {
  try {
    const userIds = req.query.userIds.split(",");
    const users = await UserModel.find({ _id: { $in: userIds } });
    res.send({ success: true, usersEmails: users.map((u) => ({ email: u.email, id: u._id })) });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

export async function emailToUserId(req, res) {
  try {
    const user = await UserModel.findOne({ email: req.query.email });
    res.send({ success: true, userId: user._id });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}
