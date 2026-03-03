import { createContext, useContext } from "react";

export const MyContext = createContext({});
export const useChat = () => useContext(MyContext);