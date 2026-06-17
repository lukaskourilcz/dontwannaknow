// Naked-eye cosmic events between roughly 1900 and 2025: bright comets,
// great eclipses, supernovae, and a few notable Mars/Jupiter close
// approaches. Indexed by year for easy lookup against a person's lifetime.

import cosmicEventsJson from "./cosmicEvents.json";

export type CosmicEvent = {
  year: number;
  text: string;
};

export const COSMIC_EVENTS: CosmicEvent[] = cosmicEventsJson as CosmicEvent[];

export function cosmicEventsIn(birthYear: number, currentYear: number): CosmicEvent[] {
  return COSMIC_EVENTS.filter(
    (e) => e.year >= birthYear && e.year <= currentYear,
  );
}
