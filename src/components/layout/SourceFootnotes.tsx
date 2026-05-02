export type SourceLink = {
  label: string;
  href: string;
};

type SourceFootnotesProps = {
  sources: SourceLink[];
};

export function SourceFootnotes({ sources }: SourceFootnotesProps) {
  if (sources.length === 0) {
    return null;
  }

  return (
    <details className="section-sources">
      <summary>Sources for this section</summary>
      <ul>
        {sources.map((source) => (
          <li key={source.href}>
            <a href={source.href} rel="noreferrer" target="_blank">
              {source.label}
            </a>
          </li>
        ))}
      </ul>
    </details>
  );
}
