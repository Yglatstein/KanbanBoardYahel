import mongoose from "mongoose";
import BoardModel from "./boardsModel";
import jwt from "jwt-simple";
const saltRounds = 10;
import UserModel from "../users/userModel";

export async function getUserBoards(req, res) {
  try {
    const userId = req.userId;
    const boards = await BoardModel.find({ permittedUsers: { $elemMatch: { $eq: userId } } });
    res.send({ success: true, boards: boards });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

export async function postAddNewBoard(req, res) {
  try {
    const userId = req["userId"];

    const { title } = req.body;
    const boardDB = new BoardModel({ title, permittedUsers: [userId], cards: [] });
    await boardDB.save();
    res.send({ success: true, board: boardDB });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

export async function postAddNewTicketByBoardID(req, res) {
  try {
    const { boardID } = req.params;
    const { title } = req.body;
    const userId = req.userId;   
    const board = await BoardModel.findById(boardID);

    if (!board) return res.status(404).send("404");

    board.cards.push({
      title,
      labels: [],
      date: null,
      desc: null,
      tasks: [],
    });

    const newData = await board.save();

    const lastCard = board.cards[board.cards.length - 1];

    res.send({ success: true, card: lastCard });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

export async function updateCardByIdAndBoardId(req, res) {
  try {
    const { cardId, boardID } = req.params;
    const updateParams = req.body;
    const userId = req.userId;
    const userDB = await UserModel.findOne({ _id: userId }); 

    const board = await BoardModel.findById(boardID);
    if (!board) res.status(404).send("404");
    if (!board.permittedUsers.includes(req.userId) && userDB.permissionsType != 'admin') return res.status(403);

    for (const card of board.cards) {
      if (card["_id"] == cardId) {
        if (updateParams.title) card.title = updateParams.title;
        if (updateParams.desc) card.desc = updateParams.desc;
        if (updateParams.date) card.date = updateParams.date;
        if (updateParams.tasks) card.tasks = updateParams.tasks;
        if (updateParams.labels) card.labels = updateParams.labels;
      }
    }

    await board.save();

    res.send({ success: true, board });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

export async function deleteBoard(req, res) {
  try {
    const userId = req.userId;
    const userDB = await UserModel.findOne({ _id: userId });
    const board = await BoardModel.findById(req.params.id);
    if (!board.permittedUsers.includes(req.userId) && userDB.permissionsType != 'admin') return res.status(403);

    await BoardModel.deleteOne({ _id: req.params.id });
    res.send({ success: true });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

export async function updateBoardPermittedUsers(req, res) {
  const boardId = req.params.boardId;
  const userIds = req.body.userIds;

  try {
    const board = await BoardModel.findById(boardId);
    const userId = req.userId;
    const userDB = await UserModel.findOne({ _id: userId });
    if (!board.permittedUsers.includes(req.userId) && userDB.permissionsType != 'admin') return res.status(403);
    
    const updatedDB = await BoardModel.updateOne({ _id: boardId }, { $set: { permittedUsers: userIds } });
    console.log("new permissions: ", updatedDB )
    res.send({ success: true });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}
export async function deleteCard(req, res) {
  try {
    const { boardID, cardId } = req.params;
    const userId = req.userId;
    const userDB = await UserModel.findOne({ _id: userId });

    const board = await BoardModel.findById(boardID);
    if (!board.permittedUsers.includes(req.userId) && userDB.permissionsType != 'admin' ) return res.status(403);

    await BoardModel.updateOne(
      {
        _id: boardID,
      },
      {
        $pull: {
          cards: {
            _id: cardId,
          },
        },
      }
    );

    res.send({ success: true });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}
