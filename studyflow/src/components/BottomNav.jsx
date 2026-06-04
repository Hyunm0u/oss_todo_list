import React from "react";
import { NavLink } from "react-router-dom";
import { navItems } from "../data/navigation.js";
import Icon from "./Icon.jsx";

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-container-padding pb-safe pt-stack-md bg-surface-container-lowest shadow-[0px_-4px_12px_rgba(0,0,0,0.04)] rounded-t-xl">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `flex flex-1 flex-col items-center justify-center mx-1 py-stack-sm rounded-xl transition-all active:scale-90 ${
              isActive ? "bg-primary-container text-on-primary-container" : "text-on-surface-variant hover:bg-surface-container-high"
            }`
          }
        >
          <Icon fill className="text-[24px]">{item.icon}</Icon>
          <span className="text-label-md font-label-md mt-1">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
