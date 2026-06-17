// Significant world events, keyed by year.
// `mood`: "beautiful" (uplifting, hopeful), "bizarre" (strange, surprising),
// "heavy" (somber, historical weight). Most are neutral milestones.

import eventsJson from "./events.json";

export type EventMood = "beautiful" | "bizarre" | "heavy" | "milestone";

export type WorldEvent = {
  year: number;
  text: string;
  mood: EventMood;
};

export const EVENTS: WorldEvent[] = eventsJson as WorldEvent[];
