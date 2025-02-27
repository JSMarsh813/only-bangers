"use client";
// https://www.youtube.com/watch?v=ebOgXUPG3_k
import { createContext, useContext, useEffect, useState } from "react";
import { getUser } from "@/partials/auth";
import axios from "axios";

// type userIdSchema = string;

const Context = createContext();

export const UserProvider = ({ children }) => {
  const [triggerRecheck, setTriggerRecheck] = useState(false);
  const [currentUsersId, setCurrentUsersId] = useState("guest");
  const [currentUsersInfo, setCurrentUsersInfo] = useState({
    user_name: "guest",
  });

  const getUserId = async () => {
    let user = await getUser();

    let usersId = user ? user.$id : "guest";

    setCurrentUsersId(usersId);

    getUsersInfo(usersId);
  };

  const getUsersInfo = async (usersId) => {
    console.log(`get Users Info Ran ${currentUsersId}`);

    if (usersId !== "guest") {
      console.log(`in if loop of getUsersInfo ${usersId}`);
      const usersData = await axios.post("/api/users/getspecificuser", {
        usersId,
      });
      console.log(`getcurrentUsersData early ${JSON.stringify(usersData)}`);
      const user = usersData.data.trimmedUserObject;
      setCurrentUsersInfo(user);
      console.log(`getcurrentUsersData ${JSON.stringify(user)}`);
    }
  };
  useEffect(() => getUserId(), []);

  return (
    <Context.Provider value={[currentUsersInfo, setTriggerRecheck]}>
      {children}
    </Context.Provider>
  );
};
export const useUser = () => useContext(Context);
