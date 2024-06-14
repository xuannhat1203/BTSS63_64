import React, { createContext, useState } from "react";
import Body from "../Body/Body";
import Header from "../Header/Header";

export const MainContext = createContext<any>({});

export default function Layout() {
  const [listPost, setListPost] = useState<string>("");
  return (
    <div>
      <MainContext.Provider value={{ listPost, setListPost }}>
        <Header />
        <Body />
      </MainContext.Provider>
    </div>
  );
}
