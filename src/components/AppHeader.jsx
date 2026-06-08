import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppData } from "../context/AppContext.jsx";
import Icon from "./Icon.jsx";

export default function AppHeader({ title, showProfile = false, back = false, action, className = "" }) {
  const navigate = useNavigate();
  const { settings } = useAppData();
  const profile = settings?.profile ?? {};
  const displayTitle = showProfile ? (profile.name || title) : title;

  return (
    <header className={`sticky top-0 z-40 flex w-full items-center justify-between bg-background/95 px-margin-mobile py-base backdrop-blur ${className}`}>
      <div className="flex min-w-0 items-center gap-gutter">
        {back ? (
          <button type="button" onClick={() => navigate(-1)} className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-surface-container-high active:scale-95" aria-label="뒤로 가기">
            <Icon className="text-on-surface-variant">arrow_back</Icon>
          </button>
        ) : null}
        {showProfile ? (
          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-outline-variant bg-primary-fixed text-on-primary-fixed">
            {profile.photo ? <img src={profile.photo} alt="프로필" className="h-full w-full object-cover" /> : <Icon fill>school</Icon>}
          </div>
        ) : null}
        <h1 className="truncate text-headline-lg-mobile font-headline-lg-mobile font-bold text-primary">{displayTitle}</h1>
      </div>
      {action ?? (
        <Link to="/settings" className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-surface-container-high active:scale-95" aria-label="설정 열기">
          <Icon className="text-primary">settings</Icon>
        </Link>
      )}
    </header>
  );
}

export function TextHeader({ title, leftLabel = "취소", rightLabel, onRight, rightDisabled = false }) {
  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-outline-variant/40 bg-surface px-margin-mobile">
      <Link to="/" className="rounded-lg p-2 text-on-surface-variant hover:bg-surface-container-low active:scale-95">
        <span className="text-title-md font-title-md">{leftLabel}</span>
      </Link>
      <h1 className="text-headline-lg-mobile font-headline-lg-mobile font-bold text-primary">{title}</h1>
      <button type="button" onClick={onRight} disabled={rightDisabled} className="rounded-lg px-4 py-2 text-title-md font-title-md font-bold text-primary hover:bg-primary-container/10 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40">
        {rightLabel}
      </button>
    </header>
  );
}
