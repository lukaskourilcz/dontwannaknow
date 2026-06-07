import { useEffect, useRef, useState } from "react";
import {
  LazyMotion,
  domAnimation,
  m,
  AnimatePresence,
  useReducedMotion,
} from "motion/react";
import Form from "./components/Form";
import { buildStory, placeName, CURRENT_YEAR, type Chapter } from "./lib/story";
import type { FormValues } from "./lib/schema";

const EASE = [0.22, 1, 0.36, 1] as const;
const STORAGE_KEY = "dwk:person";

function loadPerson(): FormValues | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw) as FormValues;
    if (p && typeof p.personName === "string" && typeof p.personAge === "number") {
      return p;
    }
    return null;
  } catch {
    return null;
  }
}

function ChapterCard({ chapter, index }: { chapter: Chapter; index: number }) {
  const reduced = useReducedMotion();
  return (
    <m.div
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: EASE }}
    >
      <div className="font-ui text-[0.8125rem] uppercase tracking-[0.08em] text-muted">
        {chapter.place}
      </div>
      <div
        className="font-display text-[3.5rem] leading-none tabular-nums text-text sm:text-[5rem]"
        style={{ fontVariationSettings: "'opsz' 144", fontWeight: 360 }}
      >
        {chapter.year}
      </div>
      <m.div
        aria-hidden
        className="mt-3 h-0.5 w-12 origin-left bg-accent/50"
        initial={reduced ? false : { scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.6, delay: index * 0.08 + 0.1, ease: EASE }}
      />
      <p className="mt-4 font-body text-[1.125rem] leading-snug text-text sm:text-[1.25rem]">
        {chapter.intro}
      </p>
      <ul className="mt-3 flex flex-col gap-2">
        {chapter.facts.map((f, i) => (
          <li
            key={i}
            className="font-body text-[1.0625rem] leading-relaxed text-muted sm:text-[1.125rem]"
          >
            {f}
          </li>
        ))}
      </ul>
    </m.div>
  );
}

export default function App() {
  const [person, setPerson] = useState<FormValues | null>(loadPerson);
  const [chapters, setChapters] = useState<Chapter[]>(() =>
    person ? buildStory(person) : [],
  );
  const [seed, setSeed] = useState(0);
  const headingRef = useRef<HTMLParagraphElement>(null);
  const firstRender = useRef(true);

  const handleSubmit = (values: FormValues) => {
    setPerson(values);
    setChapters(buildStory(values));
    setSeed((s) => s + 1);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
    } catch {
      /* ignore storage failures */
    }
  };

  const reroll = () => {
    if (!person) return;
    setChapters(buildStory(person));
    setSeed((s) => s + 1);
  };

  const startOver = () => {
    setPerson(null);
    setChapters([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  };

  // Move focus to the result on submit, but not on initial (hydrated) load.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (person) headingRef.current?.focus();
  }, [person]);

  return (
    <LazyMotion features={domAnimation} strict>
      <main
        className="flex min-h-[100dvh] flex-col items-center bg-bg px-6 sm:px-8"
        style={{ paddingBlock: "clamp(2.5rem, 8vh, 6rem)" }}
      >
        <div className="w-full max-w-[34rem]">
          <m.header
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <h1
              className="font-display text-[2.25rem] leading-[1.05] text-text sm:text-[3.5rem]"
              style={{ fontVariationSettings: "'opsz' 144", fontWeight: 380, letterSpacing: "-0.02em" }}
            >
              The world that made them.
            </h1>
            <p className="mt-5 font-body text-[1.0625rem] leading-relaxed text-muted sm:text-[1.1875rem]">
              Tell us who they are. We'll show you what was happening where they
              lived — across their whole life. Refresh any time for different
              memories.
            </p>
          </m.header>

          <div className="mt-10 min-h-[26rem]">
            <AnimatePresence mode="wait">
              {!person ? (
                <m.div key="form" exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}>
                  <Form onSubmit={handleSubmit} />
                </m.div>
              ) : (
                <m.section
                  key="result"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: EASE }}
                  aria-live="polite"
                >
                  <p
                    ref={headingRef}
                    tabIndex={-1}
                    className="font-body text-[1.0625rem] text-muted italic outline-none sm:text-[1.1875rem]"
                  >
                    Moments from {placeName(person.location, CURRENT_YEAR)} across
                    your {person.relationship}'s life.
                  </p>

                  <div className="mt-8 flex flex-col gap-8">
                    {chapters.map((c, i) => (
                      <div key={`${seed}-${c.key}`} className={i > 0 ? "border-t border-border pt-8" : ""}>
                        <ChapterCard chapter={c} index={i} />
                      </div>
                    ))}
                  </div>

                  <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-3">
                    <button
                      onClick={reroll}
                      className="rounded-full border border-border px-5 py-2.5 font-ui text-sm text-text transition-colors hover:border-accent hover:text-accent"
                    >
                      Show different memories
                    </button>
                    <button
                      onClick={startOver}
                      className="font-ui text-sm text-muted underline-offset-4 transition-colors hover:text-text hover:underline"
                    >
                      Start over
                    </button>
                  </div>
                </m.section>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </LazyMotion>
  );
}
