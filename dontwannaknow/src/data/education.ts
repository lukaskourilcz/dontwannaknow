// School, work and study by country and decade.
// Numbers are documented historical estimates from standard reference
// sources (UNESCO Statistical Yearbooks, OECD historical series,
// national-ministry archives, US Census Educational Attainment tables,
// the Soviet Goskomstat, the Spanish INE historical educación series,
// Czechoslovak Statistical Yearbooks, StatCan, INEGI Mexico).
// Treat as orders of magnitude rather than exact figures.

import type { Country } from "./countryDecades";

export type EducationSnapshot = {
  country: Exclude<Country, "INTL">;
  decadeStart: number;
  compulsoryEnd: number;            // Age compulsory schooling ended
  avgYearsSchooling: number;        // Average completed years among adults
  highSchoolGradPct: number;        // Share of cohort completing upper secondary
  universityPct: number;            // Share of adults with a higher-ed degree
  literacyPct: number;              // Adult literacy rate
  commonJobs: string[];             // 3-5 most common occupations
  subjects: string[];               // Typical school subjects
  classroom: string;                // One-sentence texture about classroom life
  workNote?: string;                // One-sentence texture about work life
};

export const EDUCATION: EducationSnapshot[] = [
  // ─────────────────────── Czechoslovakia ───────────────────────
  {
    country: "CZ", decadeStart: 1920,
    compulsoryEnd: 14, avgYearsSchooling: 5.5, highSchoolGradPct: 7,
    universityPct: 1, literacyPct: 96,
    commonJobs: ["farmer", "factory worker", "miner", "shop clerk", "domestic servant"],
    subjects: ["Czech (or German) language", "mathematics", "religion", "calligraphy", "geography", "history", "natural history", "singing"],
    classroom: "Single-room village schools held kids age 6-14 on the same wooden benches; the cane sat on the teacher's desk.",
    workNote: "About 40% of Czechoslovaks still worked the land; Baťa-style 'factory cities' were the new ambition.",
  },
  {
    country: "CZ", decadeStart: 1930,
    compulsoryEnd: 14, avgYearsSchooling: 6.5, highSchoolGradPct: 9,
    universityPct: 1.5, literacyPct: 97,
    commonJobs: ["farmer", "industrial worker", "miner", "clerk", "shoemaker"],
    subjects: ["Czech", "civics", "mathematics", "religion", "history", "geography", "natural science", "physical education"],
    classroom: "Civics was added to the curriculum to teach the values of the First Republic; some Sudeten German schools refused to use Czechoslovak textbooks.",
  },
  {
    country: "CZ", decadeStart: 1940,
    compulsoryEnd: 14, avgYearsSchooling: 6, highSchoolGradPct: 8,
    universityPct: 1.5, literacyPct: 96,
    commonJobs: ["farmer", "factory worker", "miner", "soldier", "clerk"],
    subjects: ["German (forced)", "Czech", "Reich history", "racial science", "mathematics", "religion"],
    classroom: "Universities were closed by the Nazis on 17 November 1939 and stayed shut for six years; many teachers were sent to camps.",
    workNote: "Forced labour replaced ordinary employment for tens of thousands during the Protectorate.",
  },
  {
    country: "CZ", decadeStart: 1950,
    compulsoryEnd: 14, avgYearsSchooling: 7.5, highSchoolGradPct: 22,
    universityPct: 3, literacyPct: 98,
    commonJobs: ["industrial worker", "cooperative farm worker (JZD)", "miner", "construction worker", "teacher"],
    subjects: ["Czech", "Russian (mandatory from 1948)", "mathematics", "Marxism-Leninism", "history (Soviet version)", "biology", "physics", "physical education"],
    classroom: "Russian replaced German as the compulsory second language; classrooms had Stalin and Gottwald portraits side by side until 1956.",
    workNote: "Forced collectivization moved hundreds of thousands of peasants onto state co-operative farms.",
  },
  {
    country: "CZ", decadeStart: 1960,
    compulsoryEnd: 15, avgYearsSchooling: 9, highSchoolGradPct: 35,
    universityPct: 6, literacyPct: 99,
    commonJobs: ["factory worker", "engineer", "teacher", "office clerk", "agricultural worker"],
    subjects: ["Czech", "Russian", "one Western language", "mathematics", "physics", "chemistry", "biology", "civic education"],
    classroom: "The reform of 1960 set the 'základní devítiletá škola' — nine-year compulsory school — replacing the old four-plus-five split.",
    workNote: "Women's labour participation reached over 80% under socialism; daycare was state-provided.",
  },
  {
    country: "CZ", decadeStart: 1970,
    compulsoryEnd: 16, avgYearsSchooling: 10.5, highSchoolGradPct: 55,
    universityPct: 10, literacyPct: 99,
    commonJobs: ["industrial worker", "engineer", "teacher", "nurse", "civil servant"],
    subjects: ["Czech", "Russian", "English or German", "mathematics", "physics", "chemistry", "polytechnic training", "civic studies"],
    classroom: "Pioneer scarves in red were near-universal in primary schools; the gymnasium track led to university, the učňák to a trade.",
    workNote: "Industrial work made up about 45% of Czechoslovak jobs at the end of the decade.",
  },

  // ─────────────────────────── Spain ────────────────────────────
  {
    country: "ES", decadeStart: 1920,
    compulsoryEnd: 12, avgYearsSchooling: 3, highSchoolGradPct: 3,
    universityPct: 1, literacyPct: 55,
    commonJobs: ["farmer / agricultural labourer", "domestic servant", "day labourer (jornalero)", "fisherman", "miner"],
    subjects: ["Catholic doctrine", "Castilian reading and writing", "arithmetic", "geography", "history", "hygiene"],
    classroom: "Boys and girls were taught in separate classrooms; many rural villages had no school at all and the parish priest taught what he could.",
    workNote: "Around 60% of the active population still worked the land; latifundia in the south kept much of it landless.",
  },
  {
    country: "ES", decadeStart: 1930,
    compulsoryEnd: 14, avgYearsSchooling: 4, highSchoolGradPct: 5,
    universityPct: 1.5, literacyPct: 67,
    commonJobs: ["farmer", "domestic servant", "factory worker", "small shopkeeper", "miner"],
    subjects: ["Castilian", "arithmetic", "geography", "history", "hygiene", "drawing (and now: civic education)"],
    classroom: "The Second Republic launched a 'Pedagogical Mission' that opened 7,000 schools in five years and trained thousands of new teachers — many killed in the Civil War.",
  },
  {
    country: "ES", decadeStart: 1940,
    compulsoryEnd: 14, avgYearsSchooling: 4, highSchoolGradPct: 6,
    universityPct: 2, literacyPct: 75,
    commonJobs: ["farmer", "domestic servant", "factory worker", "construction labourer", "civil servant"],
    subjects: ["Catholic doctrine (mandatory)", "Formación del Espíritu Nacional", "Castilian", "arithmetic", "Spanish history (Nationalist version)", "Latin (boys)", "domestic science (girls)"],
    classroom: "Republican teachers were purged; the Catholic Church regained control of much of primary education; the school day opened with 'Cara al Sol'.",
    workNote: "The 'years of hunger' kept most Spaniards in subsistence work; ration cards lasted until 1952.",
  },
  {
    country: "ES", decadeStart: 1950,
    compulsoryEnd: 14, avgYearsSchooling: 5, highSchoolGradPct: 9,
    universityPct: 3, literacyPct: 85,
    commonJobs: ["farmer", "industrial worker", "domestic servant", "construction labourer", "civil servant"],
    subjects: ["Catholic doctrine", "FEN", "Castilian", "mathematics", "history", "Latin", "domestic science (girls)"],
    classroom: "Schools were segregated by sex; the daily 'patio' included a salute to the Nationalist flag and singing of the Falange anthem.",
    workNote: "Massive rural-to-urban migration — Madrid and Barcelona absorbed millions from Andalusia and Extremadura.",
  },
  {
    country: "ES", decadeStart: 1960,
    compulsoryEnd: 14, avgYearsSchooling: 6.5, highSchoolGradPct: 18,
    universityPct: 5, literacyPct: 93,
    commonJobs: ["industrial worker", "service worker", "construction worker", "farmer", "office clerk"],
    subjects: ["Catholic doctrine", "Castilian", "mathematics", "natural science", "history", "physical education", "domestic science (girls)"],
    classroom: "Tourism brought a wave of English-language classes to private and church schools; many Spanish workers learned German for migration north.",
    workNote: "Spain's 'economic miracle' created millions of industrial and service jobs; women's labour participation slowly rose.",
  },
  {
    country: "ES", decadeStart: 1970,
    compulsoryEnd: 14, avgYearsSchooling: 7.5, highSchoolGradPct: 30,
    universityPct: 7, literacyPct: 95,
    commonJobs: ["industrial worker", "service worker", "civil servant", "shop assistant", "construction worker"],
    subjects: ["Castilian (and regional languages by mid-70s)", "mathematics", "natural science", "social science", "languages", "religion (now optional 1978)"],
    classroom: "The 1970 Ley General de Educación replaced the old patchwork with 8-year EGB primary, then BUP/COU secondary — Spain's modern system.",
    workNote: "Service work overtook agriculture for the first time around 1972.",
  },

  // ─────────────────────── United States ────────────────────────
  {
    country: "US", decadeStart: 1920,
    compulsoryEnd: 16, avgYearsSchooling: 8.5, highSchoolGradPct: 17,
    universityPct: 4, literacyPct: 94,
    commonJobs: ["farmer", "manufacturing worker", "salesperson", "domestic servant", "clerk"],
    subjects: ["English", "arithmetic", "history", "geography", "civics", "home economics (girls)", "shop / agriculture (boys)", "physical education"],
    classroom: "One-room schoolhouses were still common outside cities; in the segregated South, separate schools for Black and white children were both legal and unequal.",
    workNote: "About a third of Americans still worked on farms; the assembly line was just spreading beyond Detroit.",
  },
  {
    country: "US", decadeStart: 1930,
    compulsoryEnd: 16, avgYearsSchooling: 9, highSchoolGradPct: 30,
    universityPct: 5, literacyPct: 96,
    commonJobs: ["manufacturing worker", "farmer", "domestic servant", "clerk", "salesperson"],
    subjects: ["English", "arithmetic", "history", "civics", "general science", "physical education", "home ec / shop"],
    classroom: "WPA money built thousands of new high schools; the Depression kept teens in school because there were no jobs.",
    workNote: "Unemployment peaked above 24% in 1933; CCC and WPA gave millions of young men their first paid work.",
  },
  {
    country: "US", decadeStart: 1940,
    compulsoryEnd: 16, avgYearsSchooling: 10, highSchoolGradPct: 51,
    universityPct: 7, literacyPct: 97,
    commonJobs: ["manufacturing worker", "soldier (early 40s)", "clerk", "salesperson", "farmer"],
    subjects: ["English", "mathematics", "American history", "civics", "general science", "PE", "home ec / shop"],
    classroom: "By the late 40s the GI Bill funded 2.2 million WWII veterans through college — the biggest single education expansion in US history.",
    workNote: "Six million women joined the workforce during WWII; many lost jobs to returning vets but stayed in the labour market.",
  },
  {
    country: "US", decadeStart: 1950,
    compulsoryEnd: 16, avgYearsSchooling: 10.5, highSchoolGradPct: 60,
    universityPct: 10, literacyPct: 98,
    commonJobs: ["manufacturing worker", "clerk", "salesperson", "teacher", "service worker"],
    subjects: ["English", "mathematics", "history", "civics", "general science", "PE", "home ec / shop", "music"],
    classroom: "Brown v. Board (1954) outlawed school segregation; many southern districts fought it for two decades.",
    workNote: "The 1950s middle-class single-earner family — Mom at home, Dad at the office — was a reality for many but a myth for as many.",
  },
  {
    country: "US", decadeStart: 1960,
    compulsoryEnd: 16, avgYearsSchooling: 11, highSchoolGradPct: 73,
    universityPct: 15, literacyPct: 99,
    commonJobs: ["manufacturing worker", "office worker", "salesperson", "teacher", "service worker"],
    subjects: ["English", "mathematics ('New Math' from 1965)", "American history", "civics", "biology", "chemistry", "physics", "foreign language", "PE"],
    classroom: "Sputnik (1957) had triggered a science-and-math push; Title VI (1964) finally tied federal funds to desegregation.",
    workNote: "Office work overtook manufacturing as the most common job category by the end of the decade.",
  },
  {
    country: "US", decadeStart: 1970,
    compulsoryEnd: 16, avgYearsSchooling: 12, highSchoolGradPct: 80,
    universityPct: 22, literacyPct: 99,
    commonJobs: ["office worker", "service worker", "teacher", "nurse", "manufacturing worker"],
    subjects: ["English", "mathematics", "American history", "civics", "biology", "earth science", "foreign language", "PE", "computer (late 70s)", "sex education"],
    classroom: "Busing for desegregation dominated 1970s school news; Title IX (1972) opened school sports to girls.",
    workNote: "The post-1973 oil-shock recession ended the long manufacturing boom; service jobs took over.",
  },

  // ────────────────── Ukrainian SSR / Ukraine ──────────────────
  {
    country: "UA", decadeStart: 1920,
    compulsoryEnd: 12, avgYearsSchooling: 3, highSchoolGradPct: 4,
    universityPct: 1, literacyPct: 70,
    commonJobs: ["peasant", "miner", "factory worker", "railwayman", "village teacher"],
    subjects: ["Ukrainian language (under Korenizatsiya)", "arithmetic", "natural history", "Marxism-Leninism", "history of the workers' movement"],
    classroom: "The 'likbez' campaign sent young workers to teach reading in villages; literacy went from ~30% in 1920 to ~85% by 1939.",
    workNote: "The NEP briefly allowed peasants to sell grain on the open market — many became small shopkeepers before collectivization wiped that out.",
  },
  {
    country: "UA", decadeStart: 1930,
    compulsoryEnd: 14, avgYearsSchooling: 4.5, highSchoolGradPct: 8,
    universityPct: 2, literacyPct: 85,
    commonJobs: ["collective farm worker (kolkhoznik)", "miner", "factory worker", "railwayman", "teacher"],
    subjects: ["Russian (more and more)", "Ukrainian (less and less)", "Marxism-Leninism", "history of the CPSU", "mathematics", "biology"],
    classroom: "Korenizatsiya ended around 1933; Russian was promoted everywhere and many Ukrainian-language schools closed.",
    workNote: "Forced collectivization and the Holodomor depopulated whole villages; survivors became kolkhozniks tied to the land.",
  },
  {
    country: "UA", decadeStart: 1940,
    compulsoryEnd: 14, avgYearsSchooling: 4, highSchoolGradPct: 6,
    universityPct: 2, literacyPct: 82,
    commonJobs: ["soldier", "kolkhoznik", "miner", "factory worker", "rebuilder"],
    subjects: ["Russian", "Ukrainian", "Marxism-Leninism", "mathematics", "physics", "history"],
    classroom: "Most of Ukraine's schools were destroyed in WWII; in 1944 children studied in cellars, barns, and the open air.",
    workNote: "Postwar reconstruction was driven by forced labour, including German POWs.",
  },
  {
    country: "UA", decadeStart: 1950,
    compulsoryEnd: 16, avgYearsSchooling: 7, highSchoolGradPct: 30,
    universityPct: 5, literacyPct: 96,
    commonJobs: ["kolkhoznik", "factory worker", "miner", "engineer", "teacher"],
    subjects: ["Russian (dominant)", "Ukrainian", "Marxism-Leninism", "history of the CPSU", "mathematics", "physics", "chemistry", "physical training"],
    classroom: "The Soviet 'ten-year school' replaced the seven-year; political education was woven through every subject.",
    workNote: "The Donbas became one of the USSR's biggest industrial regions; coal miners were paid the most.",
  },
  {
    country: "UA", decadeStart: 1960,
    compulsoryEnd: 17, avgYearsSchooling: 9, highSchoolGradPct: 55,
    universityPct: 9, literacyPct: 98,
    commonJobs: ["factory worker", "engineer", "kolkhoznik", "teacher", "miner"],
    subjects: ["Russian", "Ukrainian (declining)", "mathematics", "physics", "chemistry", "biology", "political education", "physical training"],
    classroom: "Khrushchev's 'polytechnic education' reform required all students to do practical work in factories or fields.",
    workNote: "Brezhnev's brand of 'developed socialism' meant guaranteed work for life — but real wages stopped growing in the late 60s.",
  },
  {
    country: "UA", decadeStart: 1970,
    compulsoryEnd: 17, avgYearsSchooling: 10, highSchoolGradPct: 70,
    universityPct: 13, literacyPct: 99,
    commonJobs: ["factory worker", "engineer", "office clerk", "teacher", "nurse"],
    subjects: ["Russian (mandatory)", "Ukrainian (optional for some)", "mathematics", "physics", "chemistry", "biology", "political education", "civil defence"],
    classroom: "Russification deepened; most Ukrainian-language schools in cities switched to Russian, while villages kept the language alive.",
    workNote: "The Soviet 'second economy' (blat, side hustles, unofficial exchanges) was as important as the wages in most workers' lives.",
  },

  // ───────────────────────── Canada ────────────────────────────
  {
    country: "CA", decadeStart: 1920,
    compulsoryEnd: 14, avgYearsSchooling: 7, highSchoolGradPct: 10,
    universityPct: 2, literacyPct: 93,
    commonJobs: ["farmer", "labourer", "domestic servant", "logger / miner", "factory worker"],
    subjects: ["English (or French)", "arithmetic", "geography", "history", "religion", "agriculture", "domestic science"],
    classroom: "Indigenous children were forced into residential schools — a system that ran from the 1880s into the 1990s.",
  },
  {
    country: "CA", decadeStart: 1930,
    compulsoryEnd: 14, avgYearsSchooling: 8, highSchoolGradPct: 25,
    universityPct: 3, literacyPct: 95,
    commonJobs: ["farmer", "labourer", "domestic servant", "factory worker", "clerk"],
    subjects: ["English/French", "arithmetic", "geography", "Canadian history", "religion", "civics", "home economics"],
    classroom: "Saskatchewan and Manitoba villages built one-room prairie schools; teachers were often newly arrived British or Scottish women.",
  },
  {
    country: "CA", decadeStart: 1940,
    compulsoryEnd: 15, avgYearsSchooling: 9, highSchoolGradPct: 40,
    universityPct: 5, literacyPct: 96,
    commonJobs: ["soldier", "factory worker", "office worker", "farmer", "logger"],
    subjects: ["English/French", "mathematics", "history", "geography", "civics", "PE", "religion in many provinces"],
    classroom: "Wartime brought thousands of women into teaching; many remained after the war.",
    workNote: "Canadian women's wartime workforce participation hit one in three by 1944.",
  },
  {
    country: "CA", decadeStart: 1950,
    compulsoryEnd: 16, avgYearsSchooling: 10, highSchoolGradPct: 55,
    universityPct: 7, literacyPct: 97,
    commonJobs: ["office worker", "factory worker", "farmer", "salesperson", "teacher"],
    subjects: ["English/French", "mathematics", "history", "geography", "general science", "civics", "PE"],
    classroom: "The Canadian baby boom built thousands of new suburban schools; class sizes ran 35-40 in many districts.",
  },
  {
    country: "CA", decadeStart: 1960,
    compulsoryEnd: 16, avgYearsSchooling: 11, highSchoolGradPct: 70,
    universityPct: 12, literacyPct: 98,
    commonJobs: ["office worker", "service worker", "factory worker", "teacher", "salesperson"],
    subjects: ["English (or French)", "mathematics", "Canadian history", "civics", "science", "second language", "PE"],
    classroom: "Quebec's Quiet Revolution (1960-66) secularised the school system and made it a provincial responsibility.",
  },
  {
    country: "CA", decadeStart: 1970,
    compulsoryEnd: 16, avgYearsSchooling: 12, highSchoolGradPct: 80,
    universityPct: 18, literacyPct: 99,
    commonJobs: ["office worker", "service worker", "teacher", "nurse", "factory worker"],
    subjects: ["English/French immersion", "mathematics", "history", "civics", "science", "second language", "PE", "computer science (late 70s)"],
    classroom: "French immersion programmes expanded across English-speaking Canada from 1965 onward.",
    workNote: "The 1976 Quebec Charter of the French Language reshaped working life across the province.",
  },

  // ─────────────────────────── Mexico ──────────────────────────
  {
    country: "MX", decadeStart: 1920,
    compulsoryEnd: 12, avgYearsSchooling: 1.5, highSchoolGradPct: 2,
    universityPct: 0.5, literacyPct: 30,
    commonJobs: ["peasant farmer (campesino)", "miner", "domestic servant", "day labourer", "shop assistant"],
    subjects: ["Spanish", "arithmetic", "agriculture", "hygiene", "civics"],
    classroom: "José Vasconcelos's SEP (1921) sent mission-teachers to villages with nothing — a single chalkboard, no textbooks, often no school building.",
    workNote: "Around 70% of Mexicans still worked the land; the Revolution had just ended.",
  },
  {
    country: "MX", decadeStart: 1930,
    compulsoryEnd: 14, avgYearsSchooling: 2, highSchoolGradPct: 3,
    universityPct: 0.8, literacyPct: 40,
    commonJobs: ["campesino", "ejido member", "miner", "factory worker", "domestic servant"],
    subjects: ["Spanish", "arithmetic", "civics", "Mexican history", "agriculture", "physical education"],
    classroom: "Cárdenas's socialist-education reform (1934) explicitly excluded religion and emphasised class struggle and indigenous identity.",
  },
  {
    country: "MX", decadeStart: 1940,
    compulsoryEnd: 14, avgYearsSchooling: 2.5, highSchoolGradPct: 4,
    universityPct: 1, literacyPct: 50,
    commonJobs: ["campesino", "factory worker", "construction worker", "domestic servant", "shop assistant"],
    subjects: ["Spanish", "arithmetic", "history", "civics", "geography", "religion (re-permitted after 1946)"],
    classroom: "Ávila Camacho's reforms restored religious education and softened the 1930s 'socialist' curriculum.",
    workNote: "WWII war contracts kicked off the 'Mexican Miracle' — three decades of industrial growth.",
  },
  {
    country: "MX", decadeStart: 1950,
    compulsoryEnd: 14, avgYearsSchooling: 3.5, highSchoolGradPct: 8,
    universityPct: 2, literacyPct: 60,
    commonJobs: ["campesino", "factory worker", "construction worker", "service worker", "civil servant"],
    subjects: ["Spanish", "mathematics", "history", "civics", "geography", "natural science", "physical education"],
    classroom: "Massive primary-school construction reached most major towns by the end of the decade.",
  },
  {
    country: "MX", decadeStart: 1960,
    compulsoryEnd: 15, avgYearsSchooling: 4.5, highSchoolGradPct: 14,
    universityPct: 3.5, literacyPct: 70,
    commonJobs: ["factory worker", "campesino", "service worker", "construction worker", "civil servant"],
    subjects: ["Spanish", "mathematics", "Mexican history", "civics", "geography", "natural science", "physical education", "indigenous studies (some regions)"],
    classroom: "Free standardised textbooks (Libros de Texto Gratuitos) became universal in primary schools in 1960.",
    workNote: "Urban migration drained the countryside; Mexico City passed 5 million people by 1960.",
  },
  {
    country: "MX", decadeStart: 1970,
    compulsoryEnd: 15, avgYearsSchooling: 6, highSchoolGradPct: 25,
    universityPct: 6, literacyPct: 80,
    commonJobs: ["factory worker", "service worker", "construction worker", "campesino", "office clerk"],
    subjects: ["Spanish", "mathematics", "Mexican history", "civics", "geography", "natural science", "second language", "physical education"],
    classroom: "President Echeverría's CONACYT (1970) and university expansion brought higher education to working-class families for the first time.",
    workNote: "The post-1973 oil boom briefly made Mexico an emerging economy; the 1982 debt crisis would undo much of it.",
  },
];

export function educationFor(
  country: Country,
  year: number,
): EducationSnapshot | null {
  if (country === "INTL") return null;
  const decade = Math.floor(year / 10) * 10;
  return EDUCATION.find((e) => e.country === country && e.decadeStart === decade) ?? null;
}
