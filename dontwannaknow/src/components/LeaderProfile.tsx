import type { Leader, LeaderNote } from "../data/leaders";

// „Malá vizitka“ lídra: úřad, doložené výsledky, kontroverze a datované
// dobové vnímání. Vše pochází z citovaných záznamů — žádné vlastní verdikty.

function NoteList({ heading, notes }: { heading: string; notes: LeaderNote[] }) {
  if (!notes.length) return null;
  return (
    <section className="leader-section">
      <h4>{heading}</h4>
      <ul>
        {notes.map((note) => (
          <li key={`${note.period}-${note.text.slice(0, 24)}`}>
            <strong>{note.period}:</strong> {note.text}
            {note.source?.url && (
              <>
                {" "}
                <a
                  className="leader-source-link"
                  href={note.source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  zdroj: {note.source.title}
                </a>
              </>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

function PlainList({ heading, items }: { heading: string; items: string[] }) {
  if (!items.length) return null;
  return (
    <section className="leader-section">
      <h4>{heading}</h4>
      <ul>
        {items.map((item) => (
          <li key={item.slice(0, 40)}>{item}</li>
        ))}
      </ul>
    </section>
  );
}

export default function LeaderProfile({ leader }: { leader: Leader }) {
  const term = `${leader.termStart}–${leader.termEnd ?? "dosud"}`;
  return (
    <article className="leader-profile">
      <header className="leader-head">
        <h3>{leader.name}</h3>
        <p className="leader-office">
          {leader.office} · {term}
        </p>
      </header>
      {leader.cameToPower && (
        <p className="leader-path">
          <strong>Cesta k moci:</strong> {leader.cameToPower}
        </p>
      )}
      <PlainList heading="Doložené výsledky" items={leader.achievements ?? []} />
      <PlainList heading="Doložené kontroverze" items={leader.controversies ?? []} />
      <NoteList heading="Dobové vnímání" notes={leader.reception ?? []} />
      <NoteList heading="Pozdější hodnocení" notes={leader.reassessment ?? []} />
      {leader.contested && (
        <p className="leader-contested">
          Hodnocení této osobnosti se v historiografii rozchází; uvádíme doložené polohy, ne verdikt.
        </p>
      )}
    </article>
  );
}
