// Sestaví životní esej ze všech dat, která o člověku máme — události
// z města, ze země, ze světa, dobový kolorit dekády. Výstupem je pole
// odstavců, každý s nadpisem a jedním souvislým blokem textu.

import { g, type Person, type Gender } from "./facts";
import { findCity, cityFactsFor } from "../data/cities";
import { eventsForCountry } from "../data/countryEvents";
import { decadeFactsFor, COUNTRY_LABELS } from "../data/countryDecades";
import { famousFor } from "../data/famousPeople";
import { EVENTS } from "../data/events";
import { goneCountriesAlive } from "../data/countries";
import { INVENTIONS } from "../data/inventions";
import { statsForYear } from "../data/stats";
import { cultureForDecade } from "../data/culture";
import { birthsAround } from "../data/famousBirths";
import { zodiacFor } from "../data/zodiac";
import { namesFor } from "../data/babyNames";
import { cosmicEventsIn } from "../data/cosmicEvents";
import { deathsAround, deathsInRange } from "../data/notableDeaths";
import { speciesAliveAtBirth } from "../data/extinctions";
import { slangFor } from "../data/slang";
import { educationFor } from "../data/education";
import { worksAround, worksInRange } from "../data/culturalWorks";
import { eventsInMonth, eventsInMonthLifetime, eventsAroundMonth } from "../data/monthlyEvents";

export type EssayParagraph = {
  heading: string;
  text: string;
};

const CURRENT_YEAR = new Date().getFullYear();

type Event = { year: number; text: string; scope: "city" | "country" | "world" };

function shuffle<T>(arr: T[]): T[] {
  const out = arr.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function pickN<T>(arr: T[], n: number): T[] {
  return shuffle(arr).slice(0, n);
}

function capitalize(s: string): string {
  return s.length === 0 ? s : s[0].toUpperCase() + s.slice(1);
}

function gatherEvents(person: Person): Event[] {
  const events: Event[] = [];
  const city = findCity(person.citySlug);
  if (city) {
    cityFactsFor(city.slug, person.birthYear).forEach((e) =>
      events.push({ year: e.year, text: e.text, scope: "city" }),
    );
  }
  if (person.country !== "INTL") {
    eventsForCountry(
      person.country,
      person.birthYear,
      Math.min(CURRENT_YEAR, person.birthYear + 90),
    ).forEach((e) =>
      events.push({ year: e.year, text: e.text, scope: "country" }),
    );
  }
  EVENTS.filter(
    (e) =>
      e.year >= person.birthYear &&
      e.year <= CURRENT_YEAR &&
      e.year - person.birthYear <= 90,
  ).forEach((e) =>
    events.push({ year: e.year, text: e.text, scope: "world" }),
  );
  return events.sort((a, b) => a.year - b.year);
}

// Spojí seznam událostí do souvislého textu a zachová zmínky o věku.
function stitch(events: Event[], birthYear: number, gender: Gender, max = 8): string {
  if (events.length === 0) return "";
  const picked = pickN(events, max).sort((a, b) => a.year - b.year);
  const parts: string[] = [];
  picked.forEach((e, i) => {
    const age = e.year - birthYear;
    let lead: string;
    if (i === 0) {
      lead = age <= 0
        ? `V roce ${e.year}, v roce příchodu na svět,`
        : `Ve věku ${age} let, v roce ${e.year},`;
    } else {
      const prevAge = picked[i - 1].year - birthYear;
      if (e.year === picked[i - 1].year) {
        lead = "a téhož roku";
      } else if (age - prevAge === 1) {
        lead = "následující rok";
      } else if (age - prevAge <= 3) {
        lead = `než ${g(gender, "dosáhl", "dosáhla")} věku ${age} let,`;
      } else {
        lead = `o léta později, ve věku ${age} let,`;
      }
    }
    parts.push(`${lead} ${e.text}.`);
  });
  // Velké první písmeno každé věty a spojení do textu.
  return parts.map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(" ");
}

function fmtUsd(n: number): string {
  if (n < 1) return `${Math.round(n * 100)}¢`;
  if (n < 100) return `$${n.toFixed(2)}`;
  return `$${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

function joinList(items: string[]): string {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} a ${items[1]}`;
  return `${items.slice(0, -1).join(", ")} a ${items[items.length - 1]}`;
}

function pickOne<T>(arr: T[]): T | undefined {
  return arr.length > 0 ? arr[Math.floor(Math.random() * arr.length)] : undefined;
}

export function buildEssay(person: Person): EssayParagraph[] {
  const { birthYear, label, country, citySlug } = person;
  const city = findCity(citySlug);
  const countryLabel = COUNTRY_LABELS[country];
  const place = city ? `${city.name}, ${countryLabel}` : countryLabel;

  const allEvents = gatherEvents(person);

  // Roztřídí události podle životní fáze.
  const stages: { name: string; from: number; to: number }[] = [
    { name: `Svět, do kterého se ${g(person.gender, "narodil", "narodila")}`, from: birthYear - 1, to: birthYear + 4 },
    { name: "Dětství", from: birthYear + 5, to: birthYear + 11 },
    { name: "Dospívání", from: birthYear + 12, to: birthYear + 19 },
    { name: "Ve dvaceti", from: birthYear + 20, to: birthYear + 29 },
    { name: "Léta zralosti", from: birthYear + 30, to: birthYear + 49 },
    { name: "Pozdější léta života", from: birthYear + 50, to: birthYear + 90 },
  ];

  const out: EssayParagraph[] = [];

  // ── Sun sign (only if exact date provided) ────────────────────────
  if (person.birthMonth && person.birthDay) {
    const sign = zodiacFor(person.birthMonth, person.birthDay);
    if (sign) {
      out.push({
        heading: `${sign.symbol} ${sign.name}`,
        text: `${g(person.gender, "Narozen", "Narozena")} ve znamení ${sign.symbol} ${sign.name} (živel ${sign.element}) — ${sign.blurb}.`,
      });
    }
  }

  // ── Top baby names of their decade ────────────────────────────────
  const names = namesFor(person.country, birthYear);
  if (names) {
    out.push({
      heading: `Jména, která ${g(person.gender, "slýchal", "slýchala")} při třídním apelu`,
      text: `V ${names.decadeStart}. letech patřila v zemi ${COUNTRY_LABELS[person.country]} k nejčastěji dávaným jménům: u chlapců ${joinList(names.boys.slice(0, 5))}; u dívek ${joinList(names.girls.slice(0, 5))}.`,
    });
  }

  // ── School, work, and what you'd study (using teen-decade snapshot)
  const schoolYear = birthYear + 12;
  const edu = educationFor(person.country, schoolYear) ?? educationFor(person.country, birthYear);
  if (edu) {
    const decadeWord = `${edu.decadeStart}. letech`;
    const parts: string[] = [];
    parts.push(
      `Škola ve ${decadeWord} v zemi ${COUNTRY_LABELS[person.country]}: povinná do ${edu.compulsoryEnd} let, přičemž průměrný dospělý absolvoval zhruba ${edu.avgYearsSchooling} let školní docházky. ${edu.literacyPct} % dospělých umělo číst a psát.`,
    );
    parts.push(
      `Zhruba ${edu.highSchoolGradPct} % vrstevníků dokončilo vyšší střední vzdělání; asi ${edu.universityPct} % dospělých kdy získalo vysokoškolský titul.`,
    );
    parts.push(
      `Předměty v rozvrhu: ${joinList(edu.subjects)}. ${edu.classroom}`,
    );
    parts.push(
      `Nejčastější povolání těch let: ${joinList(edu.commonJobs)}.`,
    );
    if (edu.workNote) parts.push(edu.workNote);
    out.push({
      heading: "Škola, práce a co by se tehdy studovalo",
      text: parts.join(" "),
    });
  }

  // ── Opening paragraph ─────────────────────────────────────────────
  const stats = statsForYear(birthYear);
  const gone = goneCountriesAlive(birthYear);
  const beforeStuff = INVENTIONS.filter((i) => i.year > birthYear);
  const bigInventions = beforeStuff
    .filter((i) =>
      ["iPhone", "Google", "World Wide Web", "televize ve většině domácností", "osobní počítač", "krájený chléb", "barevná televize", "domácí mikrovlnná trouba", "Sony Walkman", "Facebook", "ChatGPT"].includes(i.name),
    );
  const inventionPool = bigInventions.length >= 2 ? bigInventions : beforeStuff;
  const inventionPicks = pickN(inventionPool, 3).map((i) => i.detail ?? `${i.name} ještě neexistoval`);
  const openingBits: string[] = [
    `${label} ${g(person.gender, "přišel", "přišla")} na svět v roce ${birthYear}, v místě ${place}.`,
    `Svět tehdy obývalo přibližně ${stats.worldPopulationBillions} miliard lidí — dnes je jich zhruba 8,1 miliardy.`,
    `Bochník chleba stál ${fmtUsd(stats.loafOfBreadUsd)}, galon benzinu ${fmtUsd(stats.gallonOfGasUsd)} a průměrný Američan si ročně vydělal kolem ${fmtUsd(stats.usAverageAnnualWageUsd)}.`,
  ];
  if (gone.length > 0) {
    const goneNames = joinList(gone.slice(0, 3).map((g) => g.name));
    openingBits.push(`Na mapě tehdy ještě existovaly tyto země: ${goneNames}.`);
  }
  if (inventionPicks.length > 0) {
    openingBits.push(`V té době ${joinList(inventionPicks)}.`);
  }
  openingBits.push(`Celosvětová průměrná délka života činila zhruba ${stats.globalLifeExpectancy} let.`);
  out.push({ heading: "Úvodem: rok příchodu na svět", text: openingBits.join(" ") });

  // ── Stage paragraphs ─────────────────────────────────────────────
  for (const stage of stages) {
    if (stage.from > CURRENT_YEAR) break;
    const stageEvents = allEvents.filter(
      (e) => e.year >= stage.from && e.year <= stage.to,
    );
    if (stageEvents.length === 0) continue;
    const prose = stitch(stageEvents, birthYear, person.gender, 10);
    if (prose) out.push({ heading: stage.name, text: prose });
  }

  // ── Texture paragraph (daily life) ────────────────────────────────
  const decadeForBirth = decadeFactsFor(country, birthYear);
  const decadeForYouth = decadeFactsFor(country, birthYear + 15);
  const textureSource = decadeForYouth ?? decadeForBirth;
  if (textureSource) {
    const bits: string[] = [];
    const clothes = pickOne(textureSource.clothes);
    if (clothes) bits.push(clothes);
    const food = pickOne(textureSource.food);
    if (food) bits.push(food);
    const daily = pickOne(textureSource.dailyLife);
    if (daily) bits.push(daily);
    const illness = pickOne(textureSource.illnesses);
    if (illness) bits.push(illness);
    const money = pickOne(textureSource.money);
    if (money) bits.push(money);
    const government = pickOne(textureSource.government);
    if (government) bits.push(government);
    if (bits.length > 0) {
      out.push({
        heading: "Faktura všedního dne",
        text: bits.join(" "),
      });
    }
  }

  // ── Birthday peers ─────────────────────────────────────────────────
  const peers = birthsAround(birthYear, 1).filter(
    (b) => !b.name.toLowerCase().includes(label.toLowerCase()),
  );
  if (peers.length > 0) {
    const sample = pickN(peers, Math.min(5, peers.length));
    const sameYear = sample.filter((p) => p.year === birthYear);
    const others = sample.filter((p) => p.year !== birthYear);
    const lines: string[] = [];
    if (sameYear.length > 0) {
      lines.push(
        `Narozeni téhož roku: ${joinList(sameYear.map((p) => `${p.name} (${p.role})`))}.`,
      );
    }
    if (others.length > 0) {
      lines.push(
        `Narozeni o rok dříve či později: ${joinList(
          others.map((p) => `${p.name} (${p.role}, ${p.year})`),
        )}.`,
      );
    }
    out.push({ heading: "Lidé, kteří přišli na svět ve stejné době", text: lines.join(" ") });
  }

  // ── Famous-people paragraph ──────────────────────────────────────
  const famous = [
    ...famousFor(country, birthYear),
    ...famousFor(country, birthYear + 15),
    ...famousFor(country, birthYear + 30),
  ];
  const uniqueFamous = Array.from(new Map(famous.map((p) => [p.name, p])).values());
  if (uniqueFamous.length > 0) {
    const picked = pickN(uniqueFamous, 6);
    const lines = picked.map((p) => `${p.name} — ${p.role}${p.note ? ` (${p.note})` : ""}`);
    out.push({
      heading: "Jména, která byla ve vzduchu",
      text: `Mezi lidmi, jejichž jména ${label.toLowerCase()} při dospívání ${g(person.gender, "slýchal", "slýchala")}: ${joinList(lines)}.`,
    });
  }

  // ── Closing paragraph: youth culture (songs, films, books) ─────────
  const youthCulture = cultureForDecade(birthYear + 15);
  const cultureBits: string[] = [];
  if (youthCulture.fashion) cultureBits.push(`Při dospívání nejspíš ${g(person.gender, "nosil", "nosila")} ${youthCulture.fashion}.`);
  if (youthCulture.whatTeensDid) cultureBits.push(`Jako ${g(person.gender, "náctiletý", "náctiletá")}: ${youthCulture.whatTeensDid}.`);
  if (youthCulture.topSongs.length >= 2) {
    cultureBits.push(`Rádio neustále hrálo ${youthCulture.topSongs.slice(0, 2).join(" a ")}.`);
  }
  if (youthCulture.popularMovies.length >= 2) {
    cultureBits.push(`V kinech se na plakátech skvěly ${joinList(youthCulture.popularMovies.slice(0, 3))}.`);
  }
  if (youthCulture.popularBooks.length >= 1) {
    cultureBits.push(`Knihkupectví měla na pultech ${joinList(youthCulture.popularBooks.slice(0, 2))}.`);
  }
  if (cultureBits.length > 0) {
    out.push({ heading: `Do čeho ${g(person.gender, "dorůstal", "dorůstala")}`, text: cultureBits.join(" ") });
  }

  // ── Cosmic neighbours (eclipses, comets, supernovae in their lifetime) ─
  const cosmic = cosmicEventsIn(birthYear, CURRENT_YEAR);
  if (cosmic.length > 0) {
    const picks = pickN(cosmic, Math.min(4, cosmic.length)).sort((a, b) => a.year - b.year);
    const lines = picks.map((c) => `V roce ${c.year} ${c.text}`);
    out.push({
      heading: `Co dělalo nebe, dokud tu ${g(person.gender, "byl", "byla")}`,
      text: lines.join(". ") + ".",
    });
  }

  // ── Who died the year they arrived ─────────────────────────────────
  const deathsAtBirth = deathsAround(birthYear, 0);
  if (deathsAtBirth.length > 0) {
    const sample = pickN(deathsAtBirth, Math.min(5, deathsAtBirth.length));
    const lines = sample.map((d) => `${d.name}, ${d.role}${d.note ? ` (${d.note})` : ""}`);
    out.push({
      heading: `Kdo svět opustil v roce, kdy do něj ${g(person.gender, "vstoupil", "vstoupila")}`,
      text: `${joinList(lines)}. ${label} ${g(person.gender, "přišel", "přišla")} na svět právě ve chvíli, kdy tyto životy dohasínaly.`,
    });
  }

  // ── Famous deaths during their lifetime (a wider net) ─────────────
  const livedDeaths = deathsInRange(
    Math.max(birthYear + 1, 1900),
    Math.min(CURRENT_YEAR, birthYear + 90),
  );
  if (livedDeaths.length > 0) {
    const sample = pickN(livedDeaths, Math.min(5, livedDeaths.length)).sort(
      (a, b) => a.year - b.year,
    );
    const lines = sample.map((d) => {
      const age = d.year - birthYear;
      return `${age <= 0 ? `ještě dřív, než si cokoli ${g(person.gender, "pamatoval", "pamatovala")}` : `ve věku ${age} let`}, ${g(person.gender, "byl", "byla")} naživu, když v roce ${d.year} umírá ${d.name} (${d.role})${d.note ? ` — ${d.note}` : ""}`;
    });
    out.push({
      heading: `Životy, které skončily, zatímco ten ${g(person.gender, "jeho", "její")} běžel`,
      text: capitalize(lines.join("; ")) + ".",
    });
  }

  // ── Species still walking the earth when they were born ───────────
  const stillAlive = speciesAliveAtBirth(birthYear, CURRENT_YEAR);
  if (stillAlive.length > 0) {
    const picks = pickN(stillAlive, Math.min(3, stillAlive.length));
    const lines = picks.map((s) => {
      const age = s.declaredExtinctYear - birthYear;
      return `druh ${s.species} byl ještě naživu — oficiálně vyhynul až v roce ${s.declaredExtinctYear}${age > 0 ? ` (ve věku ${age} let)` : ""}, kdy ${s.note}`;
    });
    out.push({
      heading: `Zvířata, která tu pobývala spolu s ${g(person.gender, "ním", "ní")}`,
      text: capitalize(lines.join("; ")) + ".",
    });
  }

  // ── The month they arrived ───────────────────────────────────────
  if (person.birthMonth) {
    const sameMonth = eventsInMonth(birthYear, person.birthMonth);
    const around = eventsAroundMonth(birthYear, person.birthMonth, 2);
    const monthName = [
      "leden", "únor", "březen", "duben", "květen", "červen",
      "červenec", "srpen", "září", "říjen", "listopad", "prosinec",
    ][person.birthMonth - 1];
    const lines: string[] = [];
    if (sameMonth.length > 0) {
      lines.push(
        `Toho roku ${birthYear}, v měsíci příchodu na svět (${monthName}): ${joinList(sameMonth.map((e) => e.text))}.`,
      );
    } else if (around.length > 0) {
      const pick = pickN(around, Math.min(3, around.length)).sort(
        (a, b) => a.year * 12 + a.month - (b.year * 12 + b.month),
      );
      lines.push(
        `Kolem měsíce příchodu na svět: ${joinList(pick.map((e) => `v roce ${e.year} (${monthName}) ${e.text}`))}.`,
      );
    }
    // Stejný měsíc v průběhu celého života — tikot kalendáře.
    const calendarBeats = eventsInMonthLifetime(birthYear, person.birthMonth, CURRENT_YEAR)
      .filter((e) => e.year !== birthYear);
    if (calendarBeats.length > 0) {
      const picks = pickN(calendarBeats, Math.min(4, calendarBeats.length)).sort(
        (a, b) => a.year - b.year,
      );
      lines.push(
        `Také další roky přinesly v měsíci ${monthName} své vlastní titulky: ${joinList(picks.map((e) => `v roce ${e.year} ${e.text}`))}.`,
      );
    }
    if (lines.length > 0) {
      out.push({
        heading: `${capitalize(monthName)} ${birthYear} a měsíce, které nesou stejné jméno`,
        text: lines.join(" "),
      });
    }
  }

  // ── What was being made the year they arrived ────────────────────
  const worksAtBirth = worksAround(birthYear, 1);
  const birthPicks: string[] = [];
  if (worksAtBirth.books.length > 0) {
    const b = pickN(worksAtBirth.books, Math.min(2, worksAtBirth.books.length));
    birthPicks.push(`knihkupectví měla na pultech ${joinList(b.map((w) => `${w.title} (${w.creator})`))}`);
  }
  if (worksAtBirth.songs.length > 0) {
    const s = pickN(worksAtBirth.songs, Math.min(2, worksAtBirth.songs.length));
    birthPicks.push(`rádio hrálo ${joinList(s.map((w) => `„${w.title}“ od ${w.creator}`))}`);
  }
  if (worksAtBirth.paintings.length > 0) {
    const p = pickN(worksAtBirth.paintings, Math.min(1, worksAtBirth.paintings.length));
    birthPicks.push(`malíři dokončovali ${joinList(p.map((w) => `${w.title} (${w.creator})`))}`);
  }
  if (worksAtBirth.plays.length > 0) {
    const pl = pickN(worksAtBirth.plays, Math.min(1, worksAtBirth.plays.length));
    birthPicks.push(`v divadle měla premiéru hra ${joinList(pl.map((w) => `${w.title} (${w.creator})`))}`);
  }
  if (worksAtBirth.sculptures.length > 0) {
    const sc = pickN(worksAtBirth.sculptures, Math.min(1, worksAtBirth.sculptures.length));
    birthPicks.push(`sochaři odhalovali ${joinList(sc.map((w) => `${w.title} (${w.creator})`))}`);
  }
  if (birthPicks.length > 0) {
    out.push({
      heading: "Umění a hudba, jež vznikaly v roce příchodu na svět",
      text: `V roce ${birthYear} ${joinList(birthPicks)}.`,
    });
  }

  // ── Cultural anchors of their teen / young-adult years ───────────
  const teenStart = birthYear + 13;
  const teenEnd = birthYear + 22;
  if (teenStart <= CURRENT_YEAR) {
    const w = worksInRange(teenStart, Math.min(teenEnd, CURRENT_YEAR));
    const teenPicks: string[] = [];
    if (w.songs.length > 0) {
      teenPicks.push(
        `písně, které ${g(person.gender, "ho", "ji")} formovaly — ${joinList(
          pickN(w.songs, Math.min(3, w.songs.length)).map((s) => `„${s.title}“ (${s.creator}, ${s.year})`),
        )}`,
      );
    }
    if (w.books.length > 0) {
      teenPicks.push(
        `knihy, které si všichni půjčovali — ${joinList(
          pickN(w.books, Math.min(3, w.books.length)).map((b) => `${b.title} od ${b.creator} (${b.year})`),
        )}`,
      );
    }
    if (w.plays.length > 0) {
      teenPicks.push(
        `hry uváděné na jevišti — ${joinList(
          pickN(w.plays, Math.min(2, w.plays.length)).map((p) => `${p.title} od ${p.creator} (${p.year})`),
        )}`,
      );
    }
    if (w.paintings.length > 0) {
      teenPicks.push(
        `obrazy, o nichž se mluvilo — ${joinList(
          pickN(w.paintings, Math.min(2, w.paintings.length)).map((p) => `${p.title} od ${p.creator} (${p.year})`),
        )}`,
      );
    }
    if (teenPicks.length > 0) {
      out.push({
        heading: `Co ${g(person.gender, "četl", "četla")}, čemu ${g(person.gender, "naslouchal", "naslouchala")} a na co se ${g(person.gender, "díval", "dívala")}`,
        text: `V průběhu dospívání a dvacátých let: ${teenPicks.join("; ")}.`,
      });
    }
  }

  // ── The slang of their teen years ─────────────────────────────────
  const teenDecade = Math.floor((birthYear + 15) / 10) * 10;
  const slang = slangFor(teenDecade);
  if (slang && slang.expressions.length > 0) {
    const picks = pickN(slang.expressions, Math.min(5, slang.expressions.length));
    const lines = picks.map((s) => `„${s.phrase}“ (${s.meaning})`);
    out.push({
      heading: `Jak náctiletí ve skutečnosti mluvili v ${teenDecade % 100}. letech`,
      text: `Když ${label.toLowerCase()} ${g(person.gender, "vyrážel", "vyrážela")} s kamarády, slang v ${g(person.gender, "jeho", "jejích")} ústech zněl: ${joinList(lines)}.`,
    });
  }

  // ── Time-capsule prompt (closer) ─────────────────────────────────
  const yearsLived = CURRENT_YEAR - birthYear;
  const prompt = yearsLived > 0
    ? `Kdybyste si dnes s ${label.toLowerCase()} sedli, o jaký jediný příběh z doby před vaším narozením byste ${g(person.gender, "ho", "ji")} požádali, aby vám ho ${g(person.gender, "vyprávěl", "vyprávěla")}? Na planetě je už ${yearsLived} ${yearsLived === 1 ? "rok" : yearsLived >= 2 && yearsLived <= 4 ? "roky" : "let"} — dost dlouho na to, aby ${g(person.gender, "viděl", "viděla")}, jak většina světa výše popsaného mění svou podobu.`
    : `${label} je úplně ${g(person.gender, "nový", "nová")}. Svět, do kterého přichází, bude jediný, který kdy pozná — a za sto let bude tento odstavec znít jako milostný dopis.`;
  out.push({ heading: "Otázka, kterou stojí za to položit", text: prompt });

  return out;
}
