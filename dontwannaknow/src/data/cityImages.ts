export type CityImage = {
  id: string;
  city: string;
  decade: number;
  yearApprox: string;
  dateCertainty: "year" | "decade";
  file: string;
  alt: string;
  caption: string;
  licence: string;
  licenceUrl: string;
  attribution: string;
  sourceUrl: string;
  width: number;
  height: number;
};

export type CityImageLoader = () => Promise<CityImage[]>;
export type CityImageLoaders = Record<string, CityImageLoader | undefined>;

const jsonLoader = (loader: () => Promise<{ default: unknown }>): CityImageLoader =>
  () => loader().then((module) => module.default as CityImage[]);

const CITY_IMAGE_LOADERS: CityImageLoaders = {
  prague: jsonLoader(() => import("./public/cityImages/prague.json")),
  brno: jsonLoader(() => import("./public/cityImages/brno.json")),
  ostrava: jsonLoader(() => import("./public/cityImages/ostrava.json")),
  plzen: jsonLoader(() => import("./public/cityImages/plzen.json")),
  liberec: jsonLoader(() => import("./public/cityImages/liberec.json")),
  olomouc: jsonLoader(() => import("./public/cityImages/olomouc.json")),
  "ceske-budejovice": jsonLoader(() => import("./public/cityImages/ceske-budejovice.json")),
  "hradec-kralove": jsonLoader(() => import("./public/cityImages/hradec-kralove.json")),
  pardubice: jsonLoader(() => import("./public/cityImages/pardubice.json")),
  "usti-nad-labem": jsonLoader(() => import("./public/cityImages/usti-nad-labem.json")),
  kyiv: jsonLoader(() => import("./public/cityImages/kyiv.json")),
  kharkiv: jsonLoader(() => import("./public/cityImages/kharkiv.json")),
  odesa: jsonLoader(() => import("./public/cityImages/odesa.json")),
  dnipro: jsonLoader(() => import("./public/cityImages/dnipro.json")),
  donetsk: jsonLoader(() => import("./public/cityImages/donetsk.json")),
  zaporizhzhia: jsonLoader(() => import("./public/cityImages/zaporizhzhia.json")),
  lviv: jsonLoader(() => import("./public/cityImages/lviv.json")),
  "kryvyi-rih": jsonLoader(() => import("./public/cityImages/kryvyi-rih.json")),
  mykolaiv: jsonLoader(() => import("./public/cityImages/mykolaiv.json")),
  mariupol: jsonLoader(() => import("./public/cityImages/mariupol.json")),
};

export function decadeForYear(year: number): number {
  return Math.floor(year / 10) * 10;
}

export function cityImagesForBirthYear(items: CityImage[], birthYear: number): CityImage[] {
  const decade = decadeForYear(birthYear);
  return items.filter((item) => item.decade === decade).slice(0, 3);
}

export async function loadCityImages(
  citySlug: string,
  birthYear: number,
  loaders: CityImageLoaders = CITY_IMAGE_LOADERS,
): Promise<CityImage[]> {
  const loader = loaders[citySlug];
  if (!loader) return [];
  return cityImagesForBirthYear(await loader(), birthYear);
}
