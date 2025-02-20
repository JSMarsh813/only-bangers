"use client";
// https://www.youtube.com/watch?v=ebOgXUPG3_k
import { createContext, useContext } from "react";

type Test = {
  colors: {
    primary: string;
    secondary: string;
  };
};
const defaultTest: Test = {
  colors: {
    primary: "#007bff",
    secondary: "#6c757d",
  },
};

const TestContext = createContext<Test>(defaultTest);

export const TestProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <TestContext.Provider value={defaultTest}>{children}</TestContext.Provider>
  );
};
export const useTest = () => useContext(TestContext);
