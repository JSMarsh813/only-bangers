"use client";
// https://www.youtube.com/watch?v=ebOgXUPG3_k
import { createContext, useContext, useEffect, useState } from "react";
import { getUser } from "@/partials/auth";
import axios from "axios";

// type userIdSchema = string;

const Context = createContext();

export const TestProvider = ({ children }) => {
  const [currentUsersId, setCurrentUsersId] = useState("guest");
  const [currentUsersInfo, setCurrentUsersInfo] = useState("guest");

  const getUserId = async () => {
    let user = await getUser();
    console.log(`get data ran ${JSON.stringify(user.$id)}`);
    let parsedUser = user.$id;
    let usersId = parsedUser ? parsedUser : "emptyUser";
    console.log(`get usersId ${JSON.stringify(usersId)}`);
    setCurrentUsersId(usersId);
    console.log(`get currentUsersId ${JSON.stringify(currentUsersId)}`);
  };

  const getUsersInfo = async () => {
    console.log(`get Users Info Ran ${currentUsersId}`);

    if (currentUsersId !== "guest") {
      console.log(`in if loop of getUsersInfo`);
      const usersData = await axios.post("/api/users/getspecificuser", {
        currentUsersId,
      });
      console.log(`getcurrentUsersData early ${JSON.stringify(usersData)}`);
      const { user } = usersData.data;
      setCurrentUsersInfo(user);
      console.log(`getcurrentUsersData ${JSON.stringify(user)}`);
    }
  };
  useEffect(() => getUserId(), []);

  useEffect(() => getUsersInfo()[currentUsersId]);

  return <Context.Provider value={currentUsersId}>{children}</Context.Provider>;
};
export const useTest = () => useContext(Context, "null");
