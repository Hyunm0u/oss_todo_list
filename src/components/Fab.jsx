import React, { useState } from "react";
import { Link } from "react-router-dom";
import Icon from "./Icon.jsx";

export default function Fab() {
  const [open, setOpen] = useState(false);
  return (
    <>
      {open ? (
        <div className="fixed inset-0 z-40 bg-black/30 px-margin-mobile" onClick={() => setOpen(false)}>
          <div className="absolute bottom-44 right-6 w-[min(320px,calc(100vw-48px))] rounded-xl bg-surface-container-lowest p-stack-md shadow-lg" onClick={(event) => event.stopPropagation()}>
            <p className="mb-stack-md text-title-md font-title-md text-on-surface">무엇을 추가하시겠습니까?</p>
            <div className="grid gap-stack-sm">
              <Link to="/add?type=task" className="flex items-center gap-gutter rounded-xl bg-surface-container-low p-stack-md text-on-surface hover:bg-surface-container-high"><Icon className="text-primary">task_alt</Icon>작업 추가</Link>
              <Link to="/add?type=event" className="flex items-center gap-gutter rounded-xl bg-surface-container-low p-stack-md text-on-surface hover:bg-surface-container-high"><Icon className="text-primary">event</Icon>일정 추가</Link>
            </div>
          </div>
        </div>
      ) : null}
      <button type="button" onClick={() => setOpen(true)} className="fixed bottom-24 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-on-primary shadow-lg transition-all duration-200 active:scale-90" aria-label="추가">
        <Icon className="text-[32px]">add</Icon>
      </button>
    </>
  );
}
