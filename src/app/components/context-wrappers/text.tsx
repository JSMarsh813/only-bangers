"use client";
// https://www.youtube.com/watch?v=ebOgXUPG3_k
import { createContext, useContext, useEffect, useState } from "react";
import { getUser } from "@/partials/auth";



export const TestProvider = ({ children }: { children: React.ReactNode }) => {
  type userIdSchema = string;   
  const [currentUsersId, setCurrentUsersId]=useState<userIdSchema>("")
  const defaultTest: userIdSchema = currentUsersId
  
  const TestContext = createContext<userIdSchema>(defaultTest);

  
  useEffect(()=> {
   const userFromAuthFunction = async () =>{
   let userFromAuth = await getUser()
   let usersId=userFromAuth ? userFromAuth.$id : ""
   setCurrentUsersId(usersId )
 }
   userFromAuthFunction()  
},[])

  return (
    <TestContext.Provider value={defaultTest}>{children}</TestContext.Provider>
  );
}
export const useTest = () => useContext(TestContext);
