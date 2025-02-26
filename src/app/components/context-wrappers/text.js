"use client";
// https://www.youtube.com/watch?v=ebOgXUPG3_k
import { createContext, useContext, useEffect, useState } from "react";
import { getUser } from "@/partials/auth";

// type userIdSchema = string;  


export const TestProvider = ({ children }) => {

  const [currentUsersId, setCurrentUsersId]=useState("test")
  
  useEffect(()=> {
   const userFromAuthFunction = async () =>{
   let userFromAuth = await getUser()
   let usersId=userFromAuth ? userFromAuth.$id : ""
   setCurrentUsersId(usersId )
 }
   userFromAuthFunction()  
},[])

const defaultTest= currentUsersId 
const TestContext = createContext(defaultTest);

  return (
    <TestContext.Provider value={defaultTest}>{children}</TestContext.Provider>
  );
}
export const useTest = () => useContext(TestContext);
