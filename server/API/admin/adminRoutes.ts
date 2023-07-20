import express from "express";
import {
  isAdmin
} from "./adminCtrl";

import jwt from "jwt-simple";

const router = express.Router();

router.use(
  "/",
  (req, res, next) => {
    const secret = process.env.SECRET;
    const { userID } = req.cookies;
    try {
      const jwtUserId = jwt.decode(userID, secret);
      const { userId } = jwtUserId;
      req["userId"] = userId;
      next();
    } catch (error) {
      res.status(403).send({ status: "403" });
    }
  },
  (req, res, next) => {
    next();
  }
);

router
  .get("/", isAdmin)

export default router;
