import type { SourceLink } from "@/components/layout/SourceFootnotes";

export const chapterSources = {
  shapes: [
    {
      label: "IEA - Electricity Grids and Secure Energy Transitions",
      href: "https://www.iea.org/reports/electricity-grids-and-secure-energy-transitions"
    },
    {
      label: "OECD NEA - The Costs of Decarbonisation: System Costs with High Shares of Nuclear and Renewables",
      href: "https://www.oecd-nea.org/jcms/pl_15000/the-costs-of-decarbonisation-system-costs-with-high-shares-of-nuclear-and-renewables"
    }
  ],
  frequency: [
    {
      label: "ENTSO-E - System operation network codes",
      href: "https://www.entsoe.eu/network_codes/sys-ops/"
    },
    {
      label: "ENTSO-E - Frequency stability evaluation criteria",
      href: "https://www.entsoe.eu/publications/system-operations-reports/"
    }
  ],
  solar: [
    {
      label: "IEA - Integrating Solar and Wind",
      href: "https://www.iea.org/reports/integrating-solar-and-wind"
    },
    {
      label: "IEA - Renewable integration and flexibility",
      href: "https://www.iea.org/reports/integrating-solar-and-wind/executive-summary"
    }
  ],
  congestion: [
    {
      label: "IEA - Grid congestion and energy security",
      href: "https://www.iea.org/commentaries/grid-congestion-is-posing-challenges-for-energy-security-and-transitions"
    },
    {
      label: "RVO - Wat is netcongestie?",
      href: "https://www.rvo.nl/onderwerpen/netcongestie/wat-netcongestie"
    }
  ],
  nuclear: [
    {
      label: "IEA - Nuclear Power and Secure Energy Transitions",
      href: "https://www.iea.org/reports/nuclear-power-and-secure-energy-transitions"
    },
    {
      label: "OECD NEA - Projected Costs of Generating Electricity",
      href: "https://www.oecd-nea.org/jcms/pl_51110/projected-costs-of-generating-electricity-2020-edition"
    }
  ],
  plants: [
    {
      label: "U.S. EIA - Electricity explained",
      href: "https://www.eia.gov/energyexplained/electricity/"
    },
    {
      label: "U.S. EIA - Natural gas-fired electricity conversion technologies",
      href: "https://www.eia.gov/todayinenergy/detail.php?id=15031"
    }
  ]
} satisfies Record<string, SourceLink[]>;
