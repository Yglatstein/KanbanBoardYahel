import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IBoard, ICard } from "../Interfaces/Kanban";
import {
  BoardAPI,
  fetchAdminBoardList,
  updateLocalStorageBoards,
} from "../Helper/APILayers";
import CustomInput from "../components/CustomInput/CustomInput";
import Board from "../components/Board/Board";

export const Admin = () => {
  const navigate = useNavigate();

  const [boards, setBoards] = useState<IBoard[]>([]);
  useEffect(() => {
    if (!localStorage.getItem("isLoggedIn")) navigate("/login");
    fetchData();
  }, []);

  async function fetchData() {
    const boards: IBoard[] = await fetchAdminBoardList();
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
    // setEmailList((prev) => [...prev, "email@email.com"])
    // const filteredArr = emailList.filter((item) => id != id)
    console.log("userIds: ", userIds, boardId);
    const tempBoardsList = [...boards];
    tempBoardsList[sourceBoardIndex].permittedUsers = userIds;
    setBoards(tempBoardsList);
  };

  const onDragEnd = (boardId: string, cardId: string) => {
    const sourceBoardIndex = boards.findIndex(
      (item: IBoard) => item.id === boardId
    );
    if (sourceBoardIndex < 0) return;

    const sourceCardIndex = boards[sourceBoardIndex]?.cards?.findIndex(
      (item) => item.id === cardId
    );
    if (sourceCardIndex < 0) return;

    const targetBoardIndex = boards.findIndex(
      (item: IBoard) => item.id === targetCard.boardId
    );
    if (targetBoardIndex < 0) return;

    const targetCardIndex = boards[targetBoardIndex]?.cards?.findIndex(
      (item) => item.id === targetCard.cardId
    );
    if (targetCardIndex < 0) return;

    const tempBoardsList = [...boards];
    const sourceCard = tempBoardsList[sourceBoardIndex].cards[sourceCardIndex];
    tempBoardsList[sourceBoardIndex].cards.splice(sourceCardIndex, 1);
    tempBoardsList[targetBoardIndex].cards.splice(
      targetCardIndex,
      0,
      sourceCard
    );
    setBoards(tempBoardsList);

    setTargetCard({
      boardId: "0",
      cardId: "0",
    });
  };

  const onDragEnter = (boardId: string, cardId: string) => {
    if (targetCard.cardId === cardId) return;
    setTargetCard({
      boardId: boardId,
      cardId: cardId,
    });
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

export default Admin;
