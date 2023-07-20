import React, { useRef, useState } from "react";
import { MoreHorizontal } from "react-feather";

import Card from "../Card/Card";
import Dropdown from "../Dropdown/Dropdown";
import CustomInput from "../CustomInput/CustomInput";

import "./Board.css";
import { IBoard, ICard } from "../../Interfaces/Kanban";
import ShareModal from "../ShareModal/ShareModal";

interface BoardProps {
  board: IBoard;
  addCard: (boardId: string, title: string) => void;
  removeBoard: (boardId: string) => void;
  updateBoardUsers: (boardId: string, userIds: string[]) => void;
  removeCard: (boardId: string, cardId: string) => void;
  updateCard: (boardId: string, cardId: string, card: ICard) => void;
}

function Board(props: BoardProps) {
  const {
    board,
    addCard,
    removeBoard,
    removeCard,
    updateCard,
    updateBoardUsers,
  } = props;
  const [showDropdown, setShowDropdown] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const dropdownRef = useRef();

  return (
    <div className="board">
      <div className="board-inner" key={board?.id}>
        <div className="board-header">
          <p className="board-header-title">
            {board?.title}
            <span>{board?.cards?.length || 0}</span>
          </p>
          <div
            ref={dropdownRef}
            className="board-header-title-more"
            onClick={() => setShowDropdown(true)}
          >
            <MoreHorizontal />

            {showDropdown && (
              <Dropdown
                class="board-dropdown"
                passRef={dropdownRef}
                onClose={() => setShowDropdown(false)}
              >
                <p onClick={() => removeBoard(board?.id)}>Delete Board</p>
              </Dropdown>
            )}
          </div>
        </div>
        <div className="board-cards custom-scroll">
          {board?.cards?.map((item) => (
            <Card
              key={item.id}
              card={item}
              boardId={board.id}
              removeCard={removeCard}
              updateCard={updateCard}
            />
          ))}
          <CustomInput
            text="+ Add Card"
            placeholder="Enter Card Title"
            displayClass="board-add-card"
            editClass="board-add-card-edit"
            onSubmit={(value: string) => addCard(board?.id, value)}
          />

          <div className="share-section">
            <h4>Shared with {board.permittedUsers.length} pepole</h4>
            <button onClick={() => setShowShareModal(true)}>Edit</button>
          </div>

          {showShareModal && (
            <ShareModal
              ids={board.permittedUsers}
              boardId={board.id}
              updateLocalUserIds={updateBoardUsers}
              close={() => setShowShareModal(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Board;
