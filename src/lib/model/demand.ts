import { HOURS, bump } from "./curve";

export function demandProfile() {
  return HOURS.map((hour) => {
    const base = 48;
    const morning = bump(hour, 8.1, 1.7, 17);
    const daytime = bump(hour, 13.5, 4.5, 18);
    const evening = bump(hour, 19.2, 2.0, 32);
    const late = bump(hour, 22.5, 1.8, 6);
    return base + morning + daytime + evening + late;
  });
}
