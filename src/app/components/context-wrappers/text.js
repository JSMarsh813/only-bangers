"use client";
// https://www.youtube.com/watch?v=ebOgXUPG3_k
import { createContext, useContext, useEffect, useState } from "react";
import { getUser } from "@/partials/auth";

// type userIdSchema = string;

const Context = createContext();

export const TestProvider = ({ children }) => {
  const [currentUsersId, setCurrentUsersId] = useState("guest");

  const getData = async () => {
    let user = await getUser();
    console.log(`get data ran ${JSON.stringify(user.$id)}`);
    let parsedUser = user.$id;
    let usersId = parsedUser ? parsedUser : "emptyUser";
    console.log(`get usersId ${JSON.stringify(usersId)}`);
    setCurrentUsersId(usersId);
    console.log(`get currentUsersId ${JSON.stringify(currentUsersId)}`);
  };
  useEffect(() => getData(), []);

  return <Context.Provider value={currentUsersId}>{children}</Context.Provider>;
};
export const useTest = () => useContext(Context, "null");
