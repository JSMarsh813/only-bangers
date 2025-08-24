"use client";
// https://www.youtube.com/watch?v=ebOgXUPG3_k
import { ReactNode } from "react";

import {
  createContext,
  Suspense,
  useContext,
  useEffect,
  useState,
} from "react";

import axios from "axios";

type UserContextObjectType = {
  user_name: string;
  $id?: string;
  profile_image?: string;
  $permission?: string[];
  $sequence?: string;
  $updatedAt?: string;
};

type ContextProviderType = {
  currentUsersInfo: UserContextObjectType;

  setTriggerRecheck: React.Dispatch<React.SetStateAction<boolean>>;

  triggerRecheck: boolean;
};

const Context = createContext<ContextProviderType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [triggerRecheck, setTriggerRecheck] = useState(true);
  const [currentUsersId, setCurrentUsersId] = useState("guest");
  const [currentUsersInfo, setCurrentUsersInfo] =
    useState<UserContextObjectType>({
      user_name: "guest",
    });

  const getUserId = async () => {
    // this is a client component so we can't use this directly
    // const user = await getSignedInUser();
    // instead we use fetch, since it uses a server only api to look at the cookies
    const res = await fetch("/api/get-signed-in-user");
    const data = await res.json();
    const user = data.user;
    console.log("getUserId() returned:", user);

    const usersId = user ? user.$id : "guest";
    setCurrentUsersId(usersId);

    return usersId;
  };

  const getUsersInfo = async (usersId: string) => {
    console.log(`get Users Info Ran ${usersId}`);

    if (usersId !== "guest") {
      const usersData = await axios.post("/api/users/getspecificuser", {
        usersId,
      });

      const user = usersData.data.trimmedUserObject;
      return user;
    } else {
      const user = null;
      return user;
    }
  };

  const updateContextWithUserInfo = async (user: UserContextObjectType) => {
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
      console.error(`trigger recheck is false ${triggerRecheck}`);
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
export const useUser = () => {
  const context = useContext(Context);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;

  //However, when trying to destructure the context later
  // const { currentUsersInfo, ...other } = useUser();

  //we got this typescript error:
  // the error given is Property 'currentUsersInfo' does not exist on type 'ContextProviderType | undefined'

  //Why? useUser() hook returns ContextProviderType | undefined, so TypeScript thinks the result could be undefined.

  //You can't destructure currentUsersInfo directly unless you guarantee the context is defined.

  //by making the hook throw if the context is missing, it satisfys typescript since it now knows it will never be undefined
};

//To use:
// import { useUser } from "../components/context-wrappers/UserInfo";

// const { currentUsersInfo, ...other } = useUser();
// let currentUsersId = currentUsersInfo ? currentUsersInfo.$id : "guest";
