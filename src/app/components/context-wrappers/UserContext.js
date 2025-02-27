// "use client";
// // https://www.youtube.com/watch?v=ebOgXUPG3_k
// import { createContext, useContext, useEffect, useState } from "react";
// import { getUser } from "@/partials/auth";

// // type userIdSchema = string;

// const Context = createContext();

// export const TestProvider = ({ children }) => {
//   const [currentUsersId, setCurrentUsersId] = useState("test2");

//   const getData = async () => {
//     let user = await getUser();
//     console.log(`this is user ${JSON.stringify(user)}`);
//     let parsedUser = await user.json();
//     let usersId = (await parsedUser.$id) ? parsedUser.$id : "emptyUser";
//     setCurrentUsersId(usersId);
//   };

//   useEffect(() => {
//     getData();
//   }, []);
//   return <Context.Provider value={currentUsersId}>{children}</Context.Provider>;
// };
