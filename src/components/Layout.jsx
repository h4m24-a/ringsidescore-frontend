import { Outlet } from "react-router-dom";
import Masthead from "./Masthead.jsx";
import Footer from "./Footer.jsx";

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="max-w-[920px] w-full mx-auto px-5 pt-7 pb-20 flex-1">
        <Masthead />
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}