"use client";
// https://www.youtube.com/watch?v=ebOgXUPG3_k
import {
  createContext,
  Suspense,
  useContext,
  useEffect,
  useState,
} from "react";
import { getUser } from "@/partials/auth";
import axios from "axios";

// type userIdSchema = string;

const Context = createContext();

export const UserProvider = ({ children }) => {
  const [triggerRecheck, setTriggerRecheck] = useState(true);
  const [currentUsersId, setCurrentUsersId] = useState("guest");
  const [currentUsersInfo, setCurrentUsersInfo] = useState({
    user_name: "guest",
  });

  const getUserId = async () => {
    // console.log(`this is triggerRecheck in getUserId ${triggerRecheck}`);
    let user = await getUser();
    // console.log(`this is user in getUserId ${JSON.stringify(user)}`);
    let usersId = user ? user.$id : "guest";
    // console.log(`this is users in getUserId ${JSON.stringify(usersId)}`);
    setCurrentUsersId(usersId);

    getUsersInfo(usersId);
  };

  const getUsersInfo = async (usersId) => {
    console.log(`get Users Info Ran ${usersId}`);

    if (usersId !== "guest") {
      // console.log(`in if loop of getUsersInfo ${usersId}`);
      const usersData = await axios.post("/api/users/getspecificuser", {
        usersId,
      });
      // console.log(`getcurrentUsersData early ${JSON.stringify(usersData)}`);
      const user = usersData.data.trimmedUserObject;
      setCurrentUsersInfo(user);
      console.log(`user after it was trimmed ${JSON.stringify(user)}`);
    } else {
      setCurrentUsersInfo({
        user_name: "guest",
      });
      // console.log("user is a guest");
      // console.log(
      //   `this is currentUsersInfo ${JSON.stringify(currentUsersInfo)}`,
      // );
    }
  };
  useEffect(() => {
    //had to wrap the call in an async function due to the warning "useEffect must not return anything besides a function, which is used for clean-up" Because the callback getUserId() is returning a promise which is incompatible with useEffect, so it has to be wrapped in an async function
    if (triggerRecheck) {
      const loadData = async () => {
        await getUserId();
        setTriggerRecheck(false);
      };
      loadData();
    } else {
      console.log(`trigger recheck is false ${triggerRecheck}`);
    }
  }, [triggerRecheck]);

  let test = "test";
  return (
    <Suspense>
      <Context.Provider
        value={{ currentUsersInfo, setTriggerRecheck, triggerRecheck }}
      >
        {children}
      </Context.Provider>
    </Suspense>
  );
};
export const useUser = () => useContext(Context);
