import cityCoordsJson from "./public/cityCoords.json";

/** Coordinates for launch cities only. The broader source remains archived. */
export const CITY_COORDS = cityCoordsJson as unknown as Record<string, [number, number]>;
