import exp from "constants";
import express from "express";
import {
  getUserBoards,
  postAddNewBoard,
  postAddNewTicketByBoardID,
  updateCardByIdAndBoardId,
  deleteBoard,
  deleteCard,
  updateBoardPermittedUsers,
} from "./boardsCtrl";

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
  .get("/", getUserBoards)
  .post("/add", postAddNewBoard)
  .post("/addCard/:boardID", postAddNewTicketByBoardID)
  .post("/updateBoardPermittedUsers/:boardId", updateBoardPermittedUsers)
  .patch("/:boardID/:cardId", updateCardByIdAndBoardId)
  .delete("/:id", deleteBoard)
  .delete("/:boardID/:cardId", deleteCard);

export default router;
