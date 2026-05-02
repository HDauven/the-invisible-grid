import { ArrowDown, BookOpen, Cable, CircleGauge, SunMedium } from "lucide-react";
import { ChapterMenu, type ChapterMenuItem } from "@/components/layout/ChapterMenu";
import { ExplainerSection } from "@/components/layout/ExplainerSection";
import { SourceFootnotes } from "@/components/layout/SourceFootnotes";
import { CongestionBatteryInteractive } from "@/components/interactives/CongestionBatteryInteractive";
import { FrequencyNeedle } from "@/components/interactives/FrequencyNeedle";
import { NuclearFinancingInteractive } from "@/components/interactives/NuclearFinancingInteractive";
import { PlantJobsInteractive } from "@/components/interactives/PlantJobsInteractive";
import { SolarDuckInteractive } from "@/components/interactives/SolarDuckInteractive";
import { chapterSources } from "@/content/chapterSources";
import { glossary } from "@/content/glossary";
import { myths } from "@/content/myths";
import { sources } from "@/content/sources";

export default function Home() {
  const menuItems: ChapterMenuItem[] = [
    { label: "Shapes", mobileLabel: "Framing · Shapes", id: "shapes" },
    { label: "50 Hz", mobileLabel: "Chapter 1 · 50 Hz", id: "frequency" },
    { label: "Solar", mobileLabel: "Chapter 2 · Solar", id: "solar" },
    { label: "Congestion", mobileLabel: "Chapter 3 · Congestion", id: "congestion" },
    { label: "Nuclear", mobileLabel: "Chapter 4 · Nuclear", id: "nuclear-finance" },
    { label: "Technologies", mobileLabel: "Chapter 5 · Technologies", id: "plant-jobs" },
    { label: "Myths", mobileLabel: "Reference · Myths", id: "myths" },
    { label: "Glossary", mobileLabel: "Reference · Glossary", id: "glossary" }
  ];

  return (
    <main>
      <ChapterMenu items={menuItems} />

      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow">Interactive explainer</p>
          <h1 id="hero-title">The Invisible Grid</h1>
          <p className="hero-lede">
            Everyone talks about electricity as if the only question is how much we
            generate.
          </p>
          <p>
            But the grid has to solve a harder problem: delivering the right amount of
            power, at the right time, in the right place, while staying stable.
          </p>
          <a className="hero-link" href="#frequency">
            <ArrowDown aria-hidden="true" size={18} />
            Show me the grid
          </a>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <div className="pulse-grid">
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
          <svg viewBox="0 0 620 420">
            <path className="hero-demand" d="M30 275 C105 244 128 192 191 207 C255 222 260 276 324 252 C387 228 408 123 480 142 C536 156 563 217 590 196" />
            <path className="hero-solar" d="M30 315 C142 314 148 102 309 101 C471 102 475 314 590 315" />
            <path className="hero-wire" d="M55 85 L205 165 L330 112 L476 235 L574 164" />
            <circle cx="55" cy="85" r="10" />
            <circle cx="205" cy="165" r="10" />
            <circle cx="330" cy="112" r="10" />
            <circle cx="476" cy="235" r="10" />
            <circle cx="574" cy="164" r="10" />
            <text x="304" y="370">time, place, flexibility, stability, cost</text>
          </svg>
        </div>
      </section>

      <section className="thesis-band">
        <p>
          A good electricity system is not built from the cheapest source alone. It is
          built from technologies whose shapes fit together.
        </p>
      </section>

      <section className="shapes-section" id="shapes" aria-labelledby="shapes-title">
        <div>
          <p className="kicker">The spine of the story</p>
          <h2 id="shapes-title">Five Shapes Have to Fit</h2>
        </div>
        <div className="shape-body">
          <div className="shape-grid">
            {[
              ["Time shape", "Time", "when power is produced or needed"],
              ["Location shape", "Location", "where power is produced or needed"],
              ["Flexibility shape", "Flexibility", "how fast something can respond"],
              ["Stability shape", "Stability", "how it affects frequency and resilience"],
              ["Cost/risk shape", "Cost/risk", "what hidden costs or risks it creates"]
            ].map(([title, mobileTitle, copy], index) => (
              <article className="shape-card" key={title}>
                <span>{index + 1}</span>
                <h3>
                  <span className="shape-title-full">{title}</span>
                  <span className="shape-title-short">{mobileTitle}</span>
                </h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
          <SourceFootnotes sources={chapterSources.shapes} />
        </div>
      </section>

      <ExplainerSection
        id="frequency"
        kicker="Chapter 1"
        title="Electricity Is Live"
        misconception="Electricity is produced somewhere, stored somewhere, and then used later."
        takeaway="The grid does not run on averages."
        figure={<FrequencyNeedle />}
        sources={chapterSources.frequency}
      >
        <p>
          The electricity grid is a live balancing system. At every moment, supply and
          demand have to match closely.
        </p>
        <p>
          When demand rises faster than supply, frequency falls. When supply exceeds
          demand, frequency rises. Operators need controllable response right now, not
          only enough energy over the whole day.
        </p>
      </ExplainerSection>

      <ExplainerSection
        id="solar"
        kicker="Chapter 2"
        title="Solar Changes the Shape of the Problem"
        misconception="Solar is cheap, so adding more solar simply makes electricity cheaper."
        takeaway="Solar solves part of the day. The rest of the system has to solve the rest."
        figure={<SolarDuckInteractive />}
        sources={chapterSources.solar}
      >
        <p>
          Solar is powerful because it can produce large amounts of cheap electricity
          during the day.
        </p>
        <p>
          But solar also has a shape. It rises after sunrise, peaks around midday, and
          falls before the evening peak. As more solar is added, the middle of the day
          can become saturated while the evening still needs storage, flexible demand,
          imports, or dispatchable plants.
        </p>
      </ExplainerSection>

      <ExplainerSection
        id="congestion"
        kicker="Chapter 3"
        title="Enough Energy, Wrong Place"
        misconception="If the country produces enough electricity, everyone can use it."
        takeaway="Enough energy nationally does not mean enough capacity locally."
        figure={<CongestionBatteryInteractive />}
        sources={chapterSources.congestion}
      >
        <p>
          Electricity has to move through specific lines, transformers, and substations.
          If one part of the network is full, extra generation in the wrong place may
          not help demand somewhere else.
        </p>
        <p>
          Batteries can shift energy, respond quickly, and reduce stress on the grid.
          But a battery placed near a bottleneck can relieve congestion in a way that a
          battery elsewhere may not.
        </p>
      </ExplainerSection>

      <ExplainerSection
        id="nuclear-finance"
        kicker="Chapter 4"
        title="Why Nuclear Cost Changes So Much"
        misconception="Nuclear is expensive, full stop."
        takeaway="Nuclear cost is about time and risk, not just construction materials."
        figure={<NuclearFinancingInteractive />}
        sources={chapterSources.nuclear}
      >
        <p>
          Nuclear power plants are capital-heavy. Much of the cost is paid before the
          plant produces any electricity.
        </p>
        <p>
          Nuclear economics are dominated by capital cost, build time, financing, and
          delay risk. Once operating, a plant can provide firm low-carbon output for
          decades, but the path to operation matters enormously.
        </p>
      </ExplainerSection>

      <ExplainerSection
        id="plant-jobs"
        kicker="Chapter 5"
        title="Power Sources Have Different Jobs"
        misconception="A power plant is a power plant."
        takeaway="Technologies are not interchangeable. They have different behaviors."
        figure={<PlantJobsInteractive />}
        sources={chapterSources.plants}
      >
        <p>
          Different technologies solve different grid problems. Some are good at firm
          output, some at fast response, some at daytime energy, and some at moving
          electricity through a bottleneck.
        </p>
        <p>
          The point is not to crown one technology. It is to see what each shape helps
          with, and what it leaves for the rest of the system to solve.
        </p>
      </ExplainerSection>

      <section className="myths-section" id="myths" aria-labelledby="myths-title">
        <div className="section-heading">
          <p className="kicker">Common shortcuts</p>
          <h2 id="myths-title">Things People Say About Electricity</h2>
        </div>
        <div className="myth-grid">
          {myths.map((item) => (
            <article className="myth-card" key={item.myth}>
              <h3>{item.myth}</h3>
              <p>{item.better}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="glossary-section" id="glossary" aria-labelledby="glossary-title">
        <div className="section-heading">
          <p className="kicker">Reference</p>
          <h2 id="glossary-title">Glossary</h2>
        </div>
        <dl className="glossary-list">
          {glossary.map((item) => (
            <div key={item.term}>
              <dt>{item.term}</dt>
              <dd>{item.definition}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="methodology" aria-labelledby="methodology-title">
        <div className="method-card">
          <div className="method-icon">
            <BookOpen aria-hidden="true" size={24} />
          </div>
          <div>
            <p className="kicker">Methodology</p>
            <h2 id="methodology-title">About These Visuals</h2>
            <p>
              This site uses simplified illustrative models to explain electricity grid
              concepts. The charts are designed to show relationships and trade-offs,
              not to forecast real electricity prices, simulate real power flows, or
              replace professional grid studies.
            </p>
            <p>
              Real grids include voltage constraints, reactive power, protection
              systems, market rules, ancillary services, maintenance outages, weather
              forecasting, cross-border flows, and many other factors.
            </p>
            <ul className="source-list" aria-label="Sources">
              {sources.map((source) => (
                <li key={source.href}>
                  <a href={source.href} rel="noreferrer" target="_blank">
                    {source.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <footer>
        <CircleGauge aria-hidden="true" size={18} />
        <span>The Invisible Grid</span>
        <Cable aria-hidden="true" size={18} />
        <span>Illustrative MVP</span>
        <SunMedium aria-hidden="true" size={18} />
      </footer>
    </main>
  );
}
