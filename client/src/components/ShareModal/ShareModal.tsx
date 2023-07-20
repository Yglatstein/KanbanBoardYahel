import React, { useEffect, useState } from "react";
import Modal from "../Modal/Modal";

import "./ShareModal.css";
import { BoardAPI, UsersAPI } from "../../Helper/APILayers";
import { Trash } from "react-feather";
import CustomInput from "../CustomInput/CustomInput";

function ShareModal(props: any) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const userIds = props.ids;

    UsersAPI.userIdsToEmails(userIds).then((r) => {
      setUsers(r);
    });
  }, []);

  const onAddEmail = async (email: string) => {
    try {
      const userId = await UsersAPI.idByEmail(email);
      const newusers = [...users, { email, id: userId }];
      setUsers(newusers);

      console.log("nreusers in sharemodal", newusers);
      await BoardAPI.updateBoardPermittedUsers(
        props.boardId,
        newusers.map((z) => z.id)
      );

      props.updateLocalUserIds(
        props.boardId,
        newusers.map((z) => z.id)
      );
    } catch (error) {
      alert("no user found for that email");
    }
  };

  const onUserRemove = async (userId: string) => {
    const newUserIds = users.filter((z) => z.id != userId);
    setUsers(newUserIds);
    console.log("new users on remove: ", newUserIds);

    console.log("board id in sharemodal: ", props.boardId);
    await BoardAPI.updateBoardPermittedUsers(
      props.boardId,
      newUserIds.map((z) => z.id)
    );

    props.updateLocalUserIds(
      props.boardId,
      newUserIds.map((z) => z.id)
    );
  };

  return (
    <Modal onClose={props.onClose}>
      <div className="shareboard">
        <h3>Share Board</h3>
        <div className="cardinfo-box-task-list">
          {users?.map((item) => (
            <div key={item.id} className="cardinfo-box-task-checkbox">
              <p className={item.completed ? "completed" : ""}>{item.email}</p>
              <Trash onClick={() => onUserRemove(item.id)} />
            </div>
          ))}
        </div>
        <div className="">
          <CustomInput
            text={"Add a User"}
            placeholder="Enter User Email"
            onSubmit={onAddEmail}
          />
          <button onClick={() => props.close()} className="done-btn">
            Done
          </button>{" "}
        </div>
      </div>
    </Modal>
  );
}

export default ShareModal;
