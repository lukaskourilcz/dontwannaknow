// Cultural snapshots by decade — songs, shows, books, fashions, prices people quote.

export type CultureSnapshot = {
  decadeStart: number;
  topSongs: string[];
  popularMovies: string[];
  popularBooks: string[];
  fashion: string;
  whatTeensDid: string;
};

export const CULTURE: CultureSnapshot[] = [
  {
    decadeStart: 1930,
    topSongs: ["“Pennies from Heaven” — Bing Crosby", "“Cheek to Cheek” — Fred Astaire"],
    popularMovies: ["Gone with the Wind", "The Wizard of Oz", "Snow White and the Seven Dwarfs"],
    popularBooks: ["The Grapes of Wrath", "Murder on the Orient Express"],
    fashion: "high-waisted trousers, bias-cut dresses, fedoras everywhere",
    whatTeensDid: "danced the Lindy Hop and went to the cinema for a dime",
  },
  {
    decadeStart: 1940,
    topSongs: ["“White Christmas” — Bing Crosby", "“In the Mood” — Glenn Miller"],
    popularMovies: ["Casablanca", "Citizen Kane", "It's a Wonderful Life"],
    popularBooks: ["Animal Farm", "The Diary of Anne Frank"],
    fashion: "uniforms, utility dresses, victory rolls in the hair",
    whatTeensDid: "saved tin foil for the war effort and listened to radio dramas",
  },
  {
    decadeStart: 1950,
    topSongs: ["“Rock Around the Clock” — Bill Haley", "“Heartbreak Hotel” — Elvis Presley"],
    popularMovies: ["Singin' in the Rain", "Rear Window", "Some Like It Hot"],
    popularBooks: ["The Catcher in the Rye", "Lord of the Flies", "On the Road"],
    fashion: "poodle skirts, leather jackets, slicked-back hair",
    whatTeensDid: "hung out at malt shops and went to drive-in movies",
  },
  {
    decadeStart: 1960,
    topSongs: ["“Hey Jude” — The Beatles", "“(I Can't Get No) Satisfaction” — The Rolling Stones"],
    popularMovies: ["The Sound of Music", "Psycho", "2001: A Space Odyssey"],
    popularBooks: ["To Kill a Mockingbird", "One Hundred Years of Solitude"],
    fashion: "miniskirts, bell-bottoms, tie-dye, Mary Quant",
    whatTeensDid: "tuned in to the British Invasion and watched the moon landing",
  },
  {
    decadeStart: 1970,
    topSongs: ["“Bohemian Rhapsody” — Queen", "“Stayin' Alive” — Bee Gees", "“Hotel California” — Eagles"],
    popularMovies: ["Star Wars", "The Godfather", "Jaws", "Rocky"],
    popularBooks: ["The Bell Jar", "Carrie", "The Shining"],
    fashion: "flared jeans, platform shoes, disco glitter, denim everything",
    whatTeensDid: "rolled to roller discos, watched Saturday morning cartoons, and called from the kitchen phone",
  },
  {
    decadeStart: 1980,
    topSongs: ["“Thriller” — Michael Jackson", "“Like a Virgin” — Madonna", "“Sweet Child o' Mine” — Guns N' Roses"],
    popularMovies: ["E.T.", "Back to the Future", "The Breakfast Club", "Dirty Dancing"],
    popularBooks: ["The Color Purple", "It (Stephen King)"],
    fashion: "shoulder pads, neon, big hair, leg warmers",
    whatTeensDid: "rented VHS tapes, mixed cassette tapes, and played Pac-Man at the arcade",
  },
  {
    decadeStart: 1990,
    topSongs: ["“Smells Like Teen Spirit” — Nirvana", "“…Baby One More Time” — Britney Spears", "“Wonderwall” — Oasis"],
    popularMovies: ["Titanic", "Jurassic Park", "The Matrix", "Pulp Fiction"],
    popularBooks: ["Harry Potter and the Philosopher's Stone", "Fight Club"],
    fashion: "flannel, baggy jeans, butterfly clips, Doc Martens",
    whatTeensDid: "burned CDs, signed onto AIM, and waited for the dial-up to connect",
  },
  {
    decadeStart: 2000,
    topSongs: ["“Hey Ya!” — OutKast", "“Crazy in Love” — Beyoncé", "“Mr. Brightside” — The Killers"],
    popularMovies: ["The Lord of the Rings", "Shrek", "The Dark Knight"],
    popularBooks: ["The Da Vinci Code", "Twilight", "The Hunger Games"],
    fashion: "low-rise jeans, trucker hats, velour tracksuits, frosted tips",
    whatTeensDid: "made MySpace top 8s, downloaded MP3s on Limewire, and lived on MSN Messenger",
  },
  {
    decadeStart: 2010,
    topSongs: ["“Rolling in the Deep” — Adele", "“Uptown Funk” — Bruno Mars", "“Old Town Road” — Lil Nas X"],
    popularMovies: ["The Avengers", "Frozen", "Parasite"],
    popularBooks: ["Gone Girl", "Sapiens", "The Fault in Our Stars"],
    fashion: "skinny jeans, beards, athleisure, normcore",
    whatTeensDid: "scrolled Tumblr, sent Snapchats, and made Vines",
  },
  {
    decadeStart: 2020,
    topSongs: ["“Blinding Lights” — The Weeknd", "“drivers license” — Olivia Rodrigo", "“Flowers” — Miley Cyrus"],
    popularMovies: ["Everything Everywhere All at Once", "Oppenheimer", "Barbie"],
    popularBooks: ["The Midnight Library", "Tomorrow, and Tomorrow, and Tomorrow"],
    fashion: "Y2K revival, baggy jeans returning, cottagecore, quiet luxury",
    whatTeensDid: "watched TikToks, played Roblox, and made playlists on Spotify",
  },
];

export function cultureForDecade(year: number): CultureSnapshot {
  const start = Math.floor(year / 10) * 10;
  return (
    CULTURE.find((c) => c.decadeStart === start) ??
    CULTURE[Math.max(0, Math.min(CULTURE.length - 1, Math.floor((start - 1930) / 10)))]
  );
}
