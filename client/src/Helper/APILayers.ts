import { IBoard, ICard } from "../Interfaces/Kanban";
import axios from "axios";

const LocalStorageKeyName = "kanban-boards";

export class BoardAPI {
  async fetchAdminBoardList(): Promise<IBoard[]> {
    const { data } = await axios.get("/api/admin");

    return data.boards.map((board) => {
      board.cards = board.cards.map((c) => ({ ...c, id: c._id }));
      board.id = board._id;
      return board;
    });
  }

  async fetchBoardList(): Promise<IBoard[]> {
    const { data } = await axios.get("/api/board");

    return data.boards.map((board) => {
      board.cards = board.cards.map((c) => ({ ...c, id: c._id }));
      board.id = board._id;
      return board;
    });
  }

  static async addCardToBoard(boardId: string, title: string): Promise<ICard> {
    const { data } = await axios.post("/api/board/addCard/" + boardId, { title });

    return { ...data.card, id: data.card._id };
  }

  static async addBoard(title: string): Promise<IBoard> {
    const { data } = await axios.post("/api/board/add", { title });

    return { ...data.board, id: data.board._id };
  }

  static async updateCard(boardId: string, cardId: string, card: ICard): Promise<IBoard> {
    const { data } = await axios.patch(`/api/board/${boardId}/${cardId}`, card);

    return { ...data.board, id: data.board._id };
  }

  static async deleteBoard(boardId: string): Promise<void> {
    const { data } = await axios.delete(`/api/board/${boardId}`);
  }

  static async deleteCard(boardId: string, cardId: string): Promise<void> {
    const { data } = await axios.delete(`/api/board/${boardId}/${cardId}`);
  }

  static async updateBoardPermittedUsers(boardId: string, userIds: string[]): Promise<void> {
    const { data } = await axios.post(`/api/board/updateBoardPermittedUsers/${boardId}`, {
      userIds,
    });
  }
} 

export class UsersAPI {
  static async userIdsToEmails(userIds: string[]): Promise<[{ email: string; id: string }]> {
    const { data } = await axios.get(`/api/user/emails-by-ids`, {
      params: { userIds: userIds.join(",") },
    });
    return data.usersEmails;
  }

  static async idByEmail(email: string): Promise<string[]> {
    const { data } = await axios.get(`/api/user/id-by-email`, {
      params: { email },
    });
    return data.userId;
  }
}

export async function fetchBoardList(): Promise<IBoard[]> {
  const api = new BoardAPI();
  return api.fetchBoardList();
}

export async function fetchAdminBoardList(): Promise<IBoard[]> {
  const api = new BoardAPI();
  return api.fetchAdminBoardList();
}

export function updateLocalStorageBoards(boards: IBoard[]) {
  localStorage.setItem(LocalStorageKeyName, JSON.stringify(boards));
}
