import type { ReactNode } from "react";
import { SourceFootnotes, type SourceLink } from "./SourceFootnotes";

type ExplainerSectionProps = {
  kicker: string;
  title: string;
  misconception: string;
  children: ReactNode;
  figure: ReactNode;
  takeaway: string;
  id?: string;
  sources?: SourceLink[];
};

export function ExplainerSection({
  kicker,
  title,
  misconception,
  children,
  figure,
  takeaway,
  id,
  sources = []
}: ExplainerSectionProps) {
  return (
    <section className="chapter" id={id}>
      <div className="chapter-copy">
        <p className="kicker">{kicker}</p>
        <h2>{title}</h2>
        <div className="misconception">
          <span>Common shortcut</span>
          <p>{misconception}</p>
        </div>
        <div className="prose">{children}</div>
        <p className="takeaway">{takeaway}</p>
        <SourceFootnotes sources={sources} />
      </div>
      <div className="chapter-figure">{figure}</div>
    </section>
  );
}
