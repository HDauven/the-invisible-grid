import type { ReactNode } from "react";

type ExplainerSectionProps = {
  kicker: string;
  title: string;
  misconception: string;
  children: ReactNode;
  figure: ReactNode;
  takeaway: string;
  id?: string;
};

export function ExplainerSection({
  kicker,
  title,
  misconception,
  children,
  figure,
  takeaway,
  id
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
      </div>
      <div className="chapter-figure">{figure}</div>
    </section>
  );
}
