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
  demand: [
    {
      label: "U.S. EIA - Electricity explained: use of electricity",
      href: "https://www.eia.gov/energyexplained/electricity/use-of-electricity.php"
    },
    {
      label: "IEA - Demand response",
      href: "https://www.iea.org/energy-system/energy-efficiency-and-demand/demand-response"
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
  weather: [
    {
      label: "IEA - Integrating Solar and Wind",
      href: "https://www.iea.org/reports/integrating-solar-and-wind"
    },
    {
      label: "ENTSO-E - System operations reports",
      href: "https://www.entsoe.eu/publications/system-operations-reports/"
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
  ],
  systemValue: [
    {
      label: "OECD NEA - The Costs of Decarbonisation",
      href: "https://www.oecd-nea.org/jcms/pl_15000/the-costs-of-decarbonisation-system-costs-with-high-shares-of-nuclear-and-renewables"
    },
    {
      label: "IEA - Electricity Grids and Secure Energy Transitions",
      href: "https://www.iea.org/reports/electricity-grids-and-secure-energy-transitions"
    }
  ]
} satisfies Record<string, SourceLink[]>;
