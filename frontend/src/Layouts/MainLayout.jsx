import React from "react";
import { Outlet, useLocation } from "react-router";
import Navbar from "../components/Navbar";

export default function MainLayout() {
  const location = useLocation();
  const isGame = location.pathname === "/games";

  return (
    <>
      {!isGame && (
        <header>
          <Navbar />
        </header>
      )}
      <main>
        <Outlet />
      </main>
      <footer></footer>
    </>
  );
}