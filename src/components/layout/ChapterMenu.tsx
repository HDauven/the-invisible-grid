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
  const mobileLinkRefs = useRef(new Map<string, HTMLAnchorElement>());
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
      const viewportTop = window.matchMedia("(max-width: 640px)").matches ? 72 : 64;
      const viewportBottom = window.innerHeight;
      const current =
        sections
          .map((section) => {
            const rect = section.getBoundingClientRect();
            const visibleTop = Math.max(rect.top, viewportTop);
            const visibleBottom = Math.min(rect.bottom, viewportBottom);
            const visibleHeight = Math.max(0, visibleBottom - visibleTop);
            const startsNearTop = rect.top <= viewportTop + 120 ? 140 : 0;
            return {
              id: section.id,
              score: visibleHeight + startsNearTop - Math.max(0, rect.top - viewportTop) * 0.08
            };
          })
          .sort((a, b) => b.score - a.score)[0] ?? { id: sections[0].id };

      setActiveId(current.id);
    };

    const onScroll = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(updateActive);
    };

    updateActive();
    const restoreFrame = window.setTimeout(updateActive, 120);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    window.addEventListener("hashchange", onScroll);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(restoreFrame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("hashchange", onScroll);
    };
  }, [items]);

  useEffect(() => {
    const closeMobileMenu = () => {
      if (mobileDetailsRef.current?.open) {
        mobileDetailsRef.current.open = false;
      }
    };

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (
        mobileDetailsRef.current?.open &&
        target instanceof Node &&
        !mobileDetailsRef.current.contains(target)
      ) {
        closeMobileMenu();
      }
    };

    window.addEventListener("scroll", closeMobileMenu, { passive: true });
    document.addEventListener("pointerdown", onPointerDown);

    return () => {
      window.removeEventListener("scroll", closeMobileMenu);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, []);

  useEffect(() => {
    const activeLink = linkRefs.current.get(activeId);
    const activeMobileLink = mobileLinkRefs.current.get(activeId);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    activeLink?.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
      block: "nearest",
      inline: "center"
    });
    activeMobileLink?.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
      block: "nearest"
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

      <details
        className="chapter-menu-mobile"
        ref={mobileDetailsRef}
        onToggle={(event) => {
          if (event.currentTarget.open) {
            window.requestAnimationFrame(() => {
              mobileLinkRefs.current.get(activeId)?.scrollIntoView({ block: "nearest" });
            });
          }
        }}
      >
        <summary aria-label={`Current section: ${activeItem?.mobileLabel ?? activeItem?.label}`}>
          <span>{activeItem?.mobileLabel ?? activeItem?.label}</span>
        </summary>
        <nav aria-label="Mobile chapter menu">
          {items.map((item) => (
            <a
              href={`#${item.id}`}
              key={item.id}
              ref={(node) => {
                if (node) {
                  mobileLinkRefs.current.set(item.id, node);
                } else {
                  mobileLinkRefs.current.delete(item.id);
                }
              }}
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
