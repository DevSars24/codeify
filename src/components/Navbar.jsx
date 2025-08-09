import React from "react";
import { BrainCircuit, Sun } from "lucide-react";

const Navbar = ({ darkMode, toggleDarkMode }) => {
  return (
    <nav
      className="nav flex items-center justify-between h-[90px] bg-zinc-900 px-[2rem] md:px-[6rem]"
      role="navigation"
      aria-label="Main Navigation"
    >
      <div className="logo flex items-center gap-[10px]">
        <BrainCircuit size={30} color="#9333ea" />
        <span className="text-2xl font-bold text-white ml-2">Codeify</span>
      </div>
      <button
        onClick={toggleDarkMode}
        className="icons flex items-center gap-[20px] cursor-pointer transition-all hover:text-[#9333ea]"
        title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        aria-label={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        type="button"
      >
        <Sun />
      </button>
    </nav>
  );
};

export default Navbar;

