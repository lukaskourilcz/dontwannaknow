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
    popularMovies: ["Jih proti Severu", "Čaroděj ze země Oz", "Sněhurka a sedm trpaslíků"],
    popularBooks: ["The Grapes of Wrath", "Murder on the Orient Express"],
    fashion: "kalhoty s vysokým pasem, šaty střižené do šikma, klobouky fedora na každém kroku",
    whatTeensDid: "tančili Lindy Hop a chodili do kina za pár drobných",
  },
  {
    decadeStart: 1940,
    topSongs: ["“White Christmas” — Bing Crosby", "“In the Mood” — Glenn Miller"],
    popularMovies: ["Casablanca", "Občan Kane", "Život je krásný"],
    popularBooks: ["Animal Farm", "The Diary of Anne Frank"],
    fashion: "uniformy, úsporné válečné šaty, vlasy stočené do victory rolls",
    whatTeensDid: "schovávali staniol na podporu válečného úsilí a poslouchali rozhlasové hry",
  },
  {
    decadeStart: 1950,
    topSongs: ["“Rock Around the Clock” — Bill Haley", "“Heartbreak Hotel” — Elvis Presley"],
    popularMovies: ["Zpívání v dešti", "Okno do dvora", "Někdo to rád horké"],
    popularBooks: ["The Catcher in the Rye", "Lord of the Flies", "On the Road"],
    fashion: "kolové sukně, kožené bundy, dozadu sčesané vlasy",
    whatTeensDid: "vysedávali u mléčných barů a jezdili do autokin",
  },
  {
    decadeStart: 1960,
    topSongs: ["“Hey Jude” — The Beatles", "“(I Can't Get No) Satisfaction” — The Rolling Stones"],
    popularMovies: ["Za zvuků hudby", "Psycho", "2001: Vesmírná odysea"],
    popularBooks: ["To Kill a Mockingbird", "One Hundred Years of Solitude"],
    fashion: "minisukně, zvonové kalhoty, batikované vzory, Mary Quant",
    whatTeensDid: "naladili si britskou invazi a sledovali přistání na Měsíci",
  },
  {
    decadeStart: 1970,
    topSongs: ["“Bohemian Rhapsody” — Queen", "“Stayin' Alive” — Bee Gees", "“Hotel California” — Eagles"],
    popularMovies: ["Hvězdné války", "Kmotr", "Čelisti", "Rocky"],
    popularBooks: ["The Bell Jar", "Carrie", "The Shining"],
    fashion: "rozšířené džíny, boty na platformě, diskotékové třpytky, džínovina na všem",
    whatTeensDid: "bruslili na roller diskotékách, koukali na sobotní ranní kreslené seriály a telefonovali z kuchyňského telefonu",
  },
  {
    decadeStart: 1980,
    topSongs: ["“Thriller” — Michael Jackson", "“Like a Virgin” — Madonna", "“Sweet Child o' Mine” — Guns N' Roses"],
    popularMovies: ["E.T. - Mimozemšťan", "Návrat do budoucnosti", "Snídaňový klub", "Hříšný tanec"],
    popularBooks: ["The Color Purple", "It (Stephen King)"],
    fashion: "vycpávky v ramenou, neonové barvy, naondulované vlasy, návleky na nohy",
    whatTeensDid: "půjčovali si VHS kazety, namíchávali si vlastní mixy na kazety a hráli Pac-Man v herně",
  },
  {
    decadeStart: 1990,
    topSongs: ["“Smells Like Teen Spirit” — Nirvana", "“…Baby One More Time” — Britney Spears", "“Wonderwall” — Oasis"],
    popularMovies: ["Titanic", "Jurský park", "Matrix", "Pulp Fiction: Historky z podsvětí"],
    popularBooks: ["Harry Potter and the Philosopher's Stone", "Fight Club"],
    fashion: "flanelové košile, volné džíny, motýlkové sponky, boty Doc Martens",
    whatTeensDid: "vypalovali si CD, přihlašovali se na AIM a čekali, až se připojí vytáčené připojení",
  },
  {
    decadeStart: 2000,
    topSongs: ["“Hey Ya!” — OutKast", "“Crazy in Love” — Beyoncé", "“Mr. Brightside” — The Killers"],
    popularMovies: ["Pán prstenů", "Shrek", "Temný rytíř"],
    popularBooks: ["The Da Vinci Code", "Twilight", "The Hunger Games"],
    fashion: "džíny s nízkým pasem, kšiltovky trucker, velurové tepláky, odbarvené konečky vlasů",
    whatTeensDid: "sestavovali si top 8 na MySpace, stahovali MP3 přes Limewire a nelezli z MSN Messengeru",
  },
  {
    decadeStart: 2010,
    topSongs: ["“Rolling in the Deep” — Adele", "“Uptown Funk” — Bruno Mars", "“Old Town Road” — Lil Nas X"],
    popularMovies: ["Avengers", "Ledové království", "Parazit"],
    popularBooks: ["Gone Girl", "Sapiens", "The Fault in Our Stars"],
    fashion: "úzké džíny, plnovousy, sportovní ležérní styl athleisure, normcore",
    whatTeensDid: "scrollovali Tumblr, posílali Snapchaty a natáčeli Vine videa",
  },
  {
    decadeStart: 2020,
    topSongs: ["“Blinding Lights” — The Weeknd", "“drivers license” — Olivia Rodrigo", "“Flowers” — Miley Cyrus"],
    popularMovies: ["Všechno, všude, najednou", "Oppenheimer", "Barbie"],
    popularBooks: ["The Midnight Library", "Tomorrow, and Tomorrow, and Tomorrow"],
    fashion: "návrat stylu Y2K, comeback volných džín, cottagecore, tichý luxus",
    whatTeensDid: "koukali na TikToky, hráli Roblox a sestavovali si playlisty na Spotify",
  },
];

export function cultureForDecade(year: number): CultureSnapshot {
  const start = Math.floor(year / 10) * 10;
  return (
    CULTURE.find((c) => c.decadeStart === start) ??
    CULTURE[Math.max(0, Math.min(CULTURE.length - 1, Math.floor((start - 1930) / 10)))]
  );
}
