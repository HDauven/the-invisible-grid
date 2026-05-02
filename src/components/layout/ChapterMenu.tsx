"use client";

import { useEffect, useRef, useState } from "react";

export type ChapterMenuItem = {
  id: string;
  label: string;
  mobileLabel?: string;
};

type ChapterMenuProps = {
  items: ChapterMenuItem[];
};

export function ChapterMenu({ items }: ChapterMenuProps) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");
  const linkRefs = useRef(new Map<string, HTMLAnchorElement>());
  const mobileDetailsRef = useRef<HTMLDetailsElement>(null);
  const activeItem = items.find((item) => item.id === activeId) ?? items[0];

  useEffect(() => {
    const sections = items
      .map((item) => document.getElementById(item.id))
      .filter((section): section is HTMLElement => Boolean(section));

    if (sections.length === 0) {
      return;
    }

    let frame = 0;

    const updateActive = () => {
      const anchorLine = window.innerHeight * 0.38;
      const current =
        [...sections]
          .reverse()
          .find((section) => section.getBoundingClientRect().top <= anchorLine) ??
        sections[0];

      setActiveId(current.id);
    };

    const onScroll = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(updateActive);
    };

    updateActive();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [items]);

  useEffect(() => {
    const activeLink = linkRefs.current.get(activeId);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    activeLink?.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
      block: "nearest",
      inline: "center"
    });
  }, [activeId]);

  return (
    <>
      <nav className="chapter-menu chapter-menu-desktop" aria-label="Chapter menu">
        {items.map((item) => (
          <a
            href={`#${item.id}`}
            key={item.id}
            ref={(node) => {
              if (node) {
                linkRefs.current.set(item.id, node);
              } else {
                linkRefs.current.delete(item.id);
              }
            }}
            aria-current={activeId === item.id ? "location" : undefined}
            data-active={activeId === item.id}
          >
            {item.label}
          </a>
        ))}
      </nav>

      <details className="chapter-menu-mobile" ref={mobileDetailsRef}>
        <summary aria-label={`Current section: ${activeItem?.mobileLabel ?? activeItem?.label}`}>
          <span>{activeItem?.mobileLabel ?? activeItem?.label}</span>
        </summary>
        <nav aria-label="Mobile chapter menu">
          {items.map((item) => (
            <a
              href={`#${item.id}`}
              key={item.id}
              aria-current={activeId === item.id ? "location" : undefined}
              data-active={activeId === item.id}
              onClick={() => {
                if (mobileDetailsRef.current) {
                  mobileDetailsRef.current.open = false;
                }
              }}
            >
              {item.mobileLabel ?? item.label}
            </a>
          ))}
        </nav>
      </details>
    </>
  );
}
