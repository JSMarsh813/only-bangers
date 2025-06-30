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
    console.log("getUser() returned:", user); // <-- Add this

    let usersId = user ? user.$id : "guest";
    // console.log(`this is users in getUserId ${JSON.stringify(usersId)}`);
    setCurrentUsersId(usersId);
    //use that id to now get users info
    //await was necessary here to avoid a race condition, where setTriggerRecheck(false) BEFORE setCurrentUsersInfo(user) is called, causing a race condition where the context value is not updated in time for the NavBar to see it.
    return usersId;
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
      return user;
    } else {
      const user = null;
      return user;

      // console.log("user is a guest");
      // console.log(
      //   `this is currentUsersInfo ${JSON.stringify(currentUsersInfo)}`,
      // );
    }
  };

  const updateContextWithUserInfo = async (user) => {
    if (user !== null) {
      setCurrentUsersInfo(user);
    } else {
      setCurrentUsersInfo({
        user_name: "guest",
      });
    }
  };
  useEffect(() => {
    console.log(
      "UserProvider useEffect running, triggerRecheck:",
      triggerRecheck,
    );

    //had to wrap the call in an async function due to the warning "useEffect must not return anything besides a function, which is used for clean-up" Because the callback getUserId() is returning a promise which is incompatible with useEffect, so it has to be wrapped in an async function
    if (triggerRecheck) {
      const loadData = async () => {
        const usersIdFromGetUserAuthFunc = await getUserId();

        const userInfoFromFunc = await getUsersInfo(usersIdFromGetUserAuthFunc);

        await updateContextWithUserInfo(userInfoFromFunc);
        //reset trigger to false, so we can retrigger it later if needed
        setTriggerRecheck(false);
      };
      loadData();
    } else {
      console.log(`trigger recheck is false ${triggerRecheck}`);
    }
  }, [triggerRecheck]);

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

//To use:
// import { useUser } from "../components/context-wrappers/UserInfo";

// const { currentUsersInfo, ...other } = useUser();
// let currentUsersId = currentUsersInfo ? currentUsersInfo.$id : "guest";
