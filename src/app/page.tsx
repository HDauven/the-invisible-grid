import { ArrowDown, BookOpen, Cable, CircleGauge, SunMedium } from "lucide-react";
import { ChapterMenu, type ChapterMenuItem } from "@/components/layout/ChapterMenu";
import { ExplainerSection } from "@/components/layout/ExplainerSection";
import { SourceFootnotes } from "@/components/layout/SourceFootnotes";
import { CongestionBatteryInteractive } from "@/components/interactives/CongestionBatteryInteractive";
import { DailyDemandInteractive } from "@/components/interactives/DailyDemandInteractive";
import { FrequencyNeedle } from "@/components/interactives/FrequencyNeedle";
import { NuclearFinancingInteractive } from "@/components/interactives/NuclearFinancingInteractive";
import { PlantJobsInteractive } from "@/components/interactives/PlantJobsInteractive";
import { SolarDuckInteractive } from "@/components/interactives/SolarDuckInteractive";
import { SystemValueInteractive } from "@/components/interactives/SystemValueInteractive";
import { WeatherShapeInteractive } from "@/components/interactives/WeatherShapeInteractive";
import { chapterSources } from "@/content/chapterSources";
import { glossary } from "@/content/glossary";
import { myths } from "@/content/myths";
import { sources } from "@/content/sources";

export default function Home() {
  const menuItems: ChapterMenuItem[] = [
    { label: "Shapes", mobileLabel: "Framing · Shapes", id: "shapes" },
    { label: "50 Hz", mobileLabel: "Chapter 1 · 50 Hz", id: "frequency" },
    { label: "Demand", mobileLabel: "Chapter 2 · Demand", id: "daily-demand" },
    { label: "Solar", mobileLabel: "Chapter 3 · Solar", id: "solar" },
    { label: "Weather", mobileLabel: "Chapter 4 · Weather", id: "weather" },
    { label: "Congestion", mobileLabel: "Chapter 5 · Congestion", id: "congestion" },
    { label: "Nuclear", mobileLabel: "Chapter 6 · Nuclear", id: "nuclear-finance" },
    { label: "Technologies", mobileLabel: "Chapter 7 · Technologies", id: "plant-jobs" },
    { label: "System value", mobileLabel: "Chapter 8 · System value", id: "system-value" },
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
        misconception="Electricity works like a warehouse: produce it, store it, use it later."
        takeaway="The grid does not run on averages."
        figure={<FrequencyNeedle />}
        sources={chapterSources.frequency}
      >
        <p>
          The electricity grid is a live balancing system. At every moment, supply and
          demand have to match closely.
        </p>
        <p>
          Frequency is the grid&apos;s heartbeat. It moves when supply and demand drift
          apart: when demand rises faster than supply, frequency falls. When supply
          exceeds demand, frequency rises.
        </p>
        <p>
          Operators need controllable response right now, not only enough energy over
          the whole day. The grid is not a warehouse. It is a live balance.
        </p>
      </ExplainerSection>

      <ExplainerSection
        id="daily-demand"
        kicker="Chapter 2"
        title="A Day Has a Shape"
        misconception="Electricity demand is basically constant."
        takeaway="Average demand hides the actual job of the grid: following the shape of the day."
        figure={<DailyDemandInteractive />}
        sources={chapterSources.demand}
      >
        <p>
          Demand has a daily rhythm. Homes, offices, factories, heating, cooling, and
          charging do not all ask for power at the same time.
        </p>
        <p>
          A single average number hides the work operators actually do: following night
          lows, morning ramps, daytime activity, evening peaks, and seasonal stress.
        </p>
      </ExplainerSection>

      <ExplainerSection
        id="solar"
        kicker="Chapter 3"
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
        <p>
          Surplus is not usually dumped into the ground. It may be curtailed, stored,
          exported, shifted into demand, or converted into another useful form.
        </p>
      </ExplainerSection>

      <ExplainerSection
        id="weather"
        kicker="Chapter 4"
        title="Weather Changes Which Problem Matters"
        misconception="Renewables are random, therefore useless."
        takeaway="Weather-shaped generation needs flexibility-shaped support."
        figure={<WeatherShapeInteractive />}
        sources={chapterSources.weather}
      >
        <p>
          Wind and solar are weather-shaped. They are not useless, and they are not
          magic. Their value depends on what the rest of the system can do.
        </p>
        <p>
          Different weather creates different grid problems: evening ramps, local
          surplus, low-renewable periods, or the need to move energy across distance
          and time.
        </p>
      </ExplainerSection>

      <ExplainerSection
        id="congestion"
        kicker="Chapter 5"
        title="Enough Energy, Wrong Place"
        misconception="If the country produces enough electricity, everyone can use it."
        takeaway="The national total can look fine while the local grid is full."
        figure={<CongestionBatteryInteractive />}
        sources={chapterSources.congestion}
      >
        <p>The national total can look fine while the local grid is full.</p>
        <p>
          Electricity has to move through specific lines, transformers, and substations.
          If one part of the network is full, extra generation in the wrong place may
          not help demand somewhere else.
        </p>
        <details className="inline-note">
          <summary>What kind of bottleneck?</summary>
          <p>
            It might be a transmission corridor between regions, a local distribution
            cable, or a substation or transformer that cannot safely carry more power.
          </p>
        </details>
        <p>
          Batteries can shift energy, respond quickly, and reduce stress on the grid.
          But a battery placed near a bottleneck can relieve congestion in a way that a
          battery elsewhere may not.
        </p>
      </ExplainerSection>

      <ExplainerSection
        id="nuclear-finance"
        kicker="Chapter 6"
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
        <p>
          The lesson is not that nuclear is always cheap or always too expensive. It is
          that nuclear is capital-heavy before it is energy-producing.
        </p>
      </ExplainerSection>

      <ExplainerSection
        id="plant-jobs"
        kicker="Chapter 7"
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
        <p>
          Startup time and ramp rate are not the same thing. A plant may be slow to
          start from cold, but once online still have some ability to adjust output.
        </p>
      </ExplainerSection>

      <ExplainerSection
        id="system-value"
        kicker="Chapter 8"
        title="Cheap MWh vs Useful MWh"
        misconception="The cheapest generator wins."
        takeaway="The cheapest generator is not always the cheapest reliable system."
        figure={<SystemValueInteractive />}
        sources={chapterSources.systemValue}
      >
        <p>
          Plant cost matters. Construction, fuel, and maintenance are real costs, and
          cheap energy can be extremely valuable.
        </p>
        <p>
          But the cheapest generator is not always the cheapest reliable system. Timing,
          location, flexibility, firm capacity, stability, curtailment, fuel risk, and
          financing risk all change what a megawatt-hour is worth.
        </p>
        <p>
          A unit of electricity has different value depending on when and where it
          appears.
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
