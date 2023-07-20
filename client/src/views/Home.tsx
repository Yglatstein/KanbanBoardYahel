import React, { useEffect, useState } from "react";
import Board from "../components/Board/Board";
import "./home.scss";
import { useNavigate } from "react-router-dom";

import { ICard, IBoard } from "../Interfaces/Kanban";
import {
  BoardAPI,
  fetchBoardList,
  updateLocalStorageBoards,
} from "../Helper/APILayers";
import CustomInput from "../components/CustomInput/CustomInput";

const Home = () => {
  const navigate = useNavigate();

  const [boards, setBoards] = useState<IBoard[]>([]);
  useEffect(() => {
    if (!localStorage.getItem("isLoggedIn")) navigate("/login");
    fetchData();
  }, []);

  async function fetchData() {
    const boards: IBoard[] = await fetchBoardList();
    setBoards(boards);
  }
  const [targetCard, setTargetCard] = useState({
    boardId: "0",
    cardId: "0",
  });

  const addboardHandler = async (name: string) => {
    const tempBoardsList = [...boards];
    const board = await BoardAPI.addBoard(name);
    tempBoardsList.push(board);
    setBoards(tempBoardsList);
  };

  const removeBoard = async (boardId: string) => {
    const boardIndex = boards.findIndex((item: IBoard) => item.id === boardId);
    if (boardIndex < 0) return;

    const tempBoardsList = [...boards];
    tempBoardsList.splice(boardIndex, 1);

    await BoardAPI.deleteBoard(boardId);

    setBoards(tempBoardsList);
  };

  const addCardHandler = async (boardId: string, title: string) => {
    const boardIndex = boards.findIndex((item: IBoard) => item.id === boardId);
    if (boardIndex < 0) return;

    const tempBoardsList = [...boards];
    const newCard = await BoardAPI.addCardToBoard(boardId, title);

    tempBoardsList[boardIndex].cards.push(newCard);
    setBoards(tempBoardsList);
  };

  const removeCard = (boardId: string, cardId: string) => {
    const boardIndex = boards.findIndex((item: IBoard) => item.id === boardId);
    if (boardIndex < 0) return;

    const tempBoardsList = [...boards];
    const cards = tempBoardsList[boardIndex].cards;

    const cardIndex = cards.findIndex((item) => item.id === cardId);
    if (cardIndex < 0) return;

    cards.splice(cardIndex, 1);
    setBoards(tempBoardsList);
  };

  const updateCard = async (boardId: string, cardId: string, card: ICard) => {
    const boardIndex = boards.findIndex((item) => item.id === boardId);
    if (boardIndex < 0) return;

    const tempBoardsList = [...boards];
    const cards = tempBoardsList[boardIndex].cards;

    const cardIndex = cards.findIndex((item) => item.id === cardId);
    if (cardIndex < 0) return;

    tempBoardsList[boardIndex].cards[cardIndex] = card;

    await BoardAPI.updateCard(boardId, cardId, card);

    setBoards(tempBoardsList);
  };

  const updateBoardUsers = async (boardId: string, userIds: string[]) => {
    const sourceBoardIndex = boards.findIndex(
      (item: IBoard) => item.id === boardId
    );
    console.log("boards: ", boards);
    console.log("boardID: ", boardId);
    console.log("userIds: ", userIds);

    const tempBoardsList = [...boards];
    tempBoardsList[sourceBoardIndex].permittedUsers = userIds;
    setBoards(tempBoardsList);
  };

  useEffect(() => {
    updateLocalStorageBoards(boards);
  }, [boards]);
  return (
    <div className="app">
      <div className="app-boards-container">
        <div className="app-boards">
          {boards.map((item) => (
            <Board
              key={item.id}
              board={item}
              addCard={addCardHandler}
              removeBoard={() => removeBoard(item.id)}
              updateBoardUsers={updateBoardUsers}
              removeCard={removeCard}
              updateCard={updateCard}
            />
          ))}
          <div className="app-boards-last">
            <CustomInput
              displayClass="app-boards-add-board"
              editClass="app-boards-add-board-edit"
              placeholder="Enter Board Name"
              text="Add Board"
              buttonText="Add Board"
              onSubmit={addboardHandler}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
