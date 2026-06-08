import React from "react";
import { Link } from "react-router-dom";
import Icon from "./Icon.jsx";

export default function Fab({ to = "/add?type=task", icon = "add" }) {
  return (
    <Link
      to={to}
      className="fixed bottom-24 right-6 z-40 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-on-primary shadow-lg transition-all duration-200 active:scale-90"
      aria-label="작업 추가"
    >
      <Icon className="text-[32px]">{icon}</Icon>
    </Link>
  );
}
