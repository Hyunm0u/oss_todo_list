import React from "react";
import { Link } from "react-router-dom";
import Icon from "./Icon.jsx";

export default function Fab({ to = "/add", icon = "add" }) {
  return (
    <Link
      to={to}
      className="fixed bottom-24 bg-primary text-on-primary shadow-lg flex items-center justify-center active:scale-90 transition-all duration-200 z-40 rounded-full w-16 h-16 right-6"
      aria-label="추가"
    >
      <Icon className="text-[32px]">{icon}</Icon>
    </Link>
  );
}
