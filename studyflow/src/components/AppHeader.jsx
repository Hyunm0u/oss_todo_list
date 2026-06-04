import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Icon from "./Icon.jsx";

export default function AppHeader({ title, showProfile = false, back = false, action, className = "" }) {
  const navigate = useNavigate();

  return (
    <header className={`w-full top-0 sticky z-40 bg-background flex justify-between items-center px-margin-mobile py-base ${className}`}>
      <div className="flex items-center gap-gutter min-w-0">
        {back ? (
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors active:scale-95"
            aria-label="뒤로 가기"
          >
            <Icon className="text-on-surface-variant">arrow_back</Icon>
          </button>
        ) : null}
        {showProfile ? (
          <div className="w-10 h-10 rounded-full overflow-hidden bg-surface-container-high border border-outline-variant">
            <img
              alt="프로필"
              className="w-full h-full object-cover"
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80"
            />
          </div>
        ) : null}
        <h1 className="text-headline-lg-mobile font-headline-lg-mobile font-bold text-primary truncate">{title}</h1>
      </div>
      {action ?? (
        <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors active:scale-95" aria-label="알림">
          <Icon className="text-primary">notifications</Icon>
        </button>
      )}
    </header>
  );
}

export function TextHeader({ title, leftLabel, rightLabel, rightTo = "/" }) {
  return (
    <header className="bg-surface sticky top-0 z-40 flex justify-between items-center w-full px-margin-mobile h-16 transition-colors border-b border-outline-variant/10">
      <Link to="/" className="text-on-surface-variant hover:bg-surface-container-low p-2 rounded-lg transition-all active:scale-95">
        <span className="font-title-md text-title-md">{leftLabel}</span>
      </Link>
      <h1 className="font-headline-lg-mobile text-headline-lg-mobile font-bold text-primary">{title}</h1>
      <Link to={rightTo} className="text-primary font-bold hover:bg-primary-container/10 p-2 px-4 rounded-lg transition-all active:scale-95">
        <span className="font-title-md text-title-md">{rightLabel}</span>
      </Link>
    </header>
  );
}
