// Month-anchored historical events since January 1938. Designed to
// surface "the month you were born" facts when a user enters a full date
// or month+year. Sourced from standard 20th- and 21st-century reference
// timelines. Each entry is one concise sentence in English.

export type MonthlyEvent = {
  year: number;
  month: number; // 1-12
  text: string;
};

export const MONTHLY_EVENTS: MonthlyEvent[] = [
  // ── 1938 ──────────────────────────────────────────────
  { year: 1938, month: 3, text: "Hitler's Wehrmacht marched into Austria in the Anschluss" },
  { year: 1938, month: 9, text: "the Munich Agreement signed away the Sudetenland to Germany" },
  { year: 1938, month: 10, text: "German troops occupied the Sudetenland" },
  { year: 1938, month: 11, text: "Kristallnacht — synagogues burned across Germany and Austria" },

  // ── 1939 ──────────────────────────────────────────────
  { year: 1939, month: 3, text: "Germany occupied the rest of Bohemia and Moravia" },
  { year: 1939, month: 4, text: "Italy invaded Albania" },
  { year: 1939, month: 8, text: "the Molotov–Ribbentrop Pact split Eastern Europe between Hitler and Stalin" },
  { year: 1939, month: 9, text: "Germany invaded Poland; Britain and France declared war — the Second World War began" },
  { year: 1939, month: 11, text: "the Winter War began as the USSR invaded Finland" },

  // ── 1940 ──────────────────────────────────────────────
  { year: 1940, month: 4, text: "Germany invaded Denmark and Norway" },
  { year: 1940, month: 5, text: "Germany invaded France, Belgium and the Netherlands; the Dunkirk evacuation began" },
  { year: 1940, month: 6, text: "France signed an armistice with Germany; Churchill warned of the 'Battle of Britain'" },
  { year: 1940, month: 7, text: "the Battle of Britain began in the skies" },
  { year: 1940, month: 9, text: "the London Blitz began — bombs would fall nightly for 57 days" },
  { year: 1940, month: 10, text: "the Tripartite Pact bound Germany, Italy and Japan as the Axis" },

  // ── 1941 ──────────────────────────────────────────────
  { year: 1941, month: 5, text: "Rudolf Hess flew solo to Scotland on a fool's peace mission" },
  { year: 1941, month: 6, text: "Operation Barbarossa — Germany invaded the Soviet Union" },
  { year: 1941, month: 9, text: "Babyn Yar — 33,771 Jews shot in two days outside Kyiv; the Siege of Leningrad began" },
  { year: 1941, month: 12, text: "Pearl Harbor attacked; the US entered the war" },

  // ── 1942 ──────────────────────────────────────────────
  { year: 1942, month: 1, text: "the Wannsee Conference planned the Final Solution" },
  { year: 1942, month: 4, text: "the Doolittle Raid bombed Tokyo for the first time" },
  { year: 1942, month: 5, text: "SS chief Reinhard Heydrich was attacked in Prague and would die days later" },
  { year: 1942, month: 6, text: "the Battle of Midway turned the Pacific war; Lidice was razed in reprisal for Heydrich" },
  { year: 1942, month: 8, text: "the Battle of Stalingrad began" },
  { year: 1942, month: 11, text: "Operation Torch landed Allies in North Africa" },

  // ── 1943 ──────────────────────────────────────────────
  { year: 1943, month: 1, text: "the Casablanca Conference set 'unconditional surrender' as Allied policy" },
  { year: 1943, month: 2, text: "the German Sixth Army surrendered at Stalingrad" },
  { year: 1943, month: 4, text: "the Warsaw Ghetto Uprising began" },
  { year: 1943, month: 7, text: "Allied forces invaded Sicily; Mussolini was overthrown" },
  { year: 1943, month: 9, text: "Italy surrendered" },
  { year: 1943, month: 11, text: "the Red Army retook Kyiv" },

  // ── 1944 ──────────────────────────────────────────────
  { year: 1944, month: 1, text: "the Siege of Leningrad ended after 872 days" },
  { year: 1944, month: 6, text: "D-Day landings in Normandy on the 6th" },
  { year: 1944, month: 7, text: "the July 20 plot to assassinate Hitler failed" },
  { year: 1944, month: 8, text: "Paris was liberated; the Slovak National Uprising began" },
  { year: 1944, month: 9, text: "Operation Market Garden failed at Arnhem" },
  { year: 1944, month: 12, text: "the Battle of the Bulge began Germany's last offensive" },

  // ── 1945 ──────────────────────────────────────────────
  { year: 1945, month: 1, text: "Auschwitz was liberated by the Red Army on the 27th" },
  { year: 1945, month: 2, text: "the Yalta Conference divided post-war Europe; Dresden was firebombed" },
  { year: 1945, month: 4, text: "FDR died; Hitler killed himself in the Berlin bunker" },
  { year: 1945, month: 5, text: "Germany surrendered on the 8th; the Prague Uprising ran 5–9 May" },
  { year: 1945, month: 7, text: "the Potsdam Conference set German occupation zones" },
  { year: 1945, month: 8, text: "atomic bombs were dropped on Hiroshima (6th) and Nagasaki (9th); Japan surrendered" },
  { year: 1945, month: 10, text: "the United Nations was founded" },
  { year: 1945, month: 11, text: "the Nuremberg Trials of Nazi leadership began" },

  // ── 1946 ──────────────────────────────────────────────
  { year: 1946, month: 3, text: "Churchill warned of an 'iron curtain' descending across Europe in Fulton, Missouri" },
  { year: 1946, month: 5, text: "Czechoslovak elections gave the Communists their biggest single bloc" },
  { year: 1946, month: 10, text: "the Nuremberg verdicts hanged twelve Nazi leaders" },

  // ── 1947 ──────────────────────────────────────────────
  { year: 1947, month: 3, text: "President Truman announced the Truman Doctrine of communist containment" },
  { year: 1947, month: 6, text: "Secretary Marshall outlined the European Recovery Plan at Harvard" },
  { year: 1947, month: 8, text: "India and Pakistan won independence; partition uprooted 15 million people" },
  { year: 1947, month: 10, text: "Chuck Yeager broke the sound barrier in the Bell X-1" },
  { year: 1947, month: 11, text: "the UN voted to partition Palestine" },

  // ── 1948 ──────────────────────────────────────────────
  { year: 1948, month: 1, text: "Gandhi was assassinated in New Delhi" },
  { year: 1948, month: 2, text: "the Communist coup in Czechoslovakia took power; Jan Masaryk was found dead under his window" },
  { year: 1948, month: 5, text: "the State of Israel was declared on the 14th" },
  { year: 1948, month: 6, text: "the Berlin Airlift began as the Soviets blockaded West Berlin" },
  { year: 1948, month: 12, text: "the Universal Declaration of Human Rights was adopted" },

  // ── 1949 ──────────────────────────────────────────────
  { year: 1949, month: 4, text: "NATO was founded by twelve member states" },
  { year: 1949, month: 5, text: "the Berlin Airlift ended; the Federal Republic of Germany was founded" },
  { year: 1949, month: 8, text: "the Soviet Union tested its first atomic bomb" },
  { year: 1949, month: 10, text: "Mao Zedong proclaimed the People's Republic of China; the GDR was founded" },

  // ── 1950 ──────────────────────────────────────────────
  { year: 1950, month: 6, text: "North Korea invaded the South — the Korean War began" },
  { year: 1950, month: 9, text: "MacArthur landed at Inchon" },
  { year: 1950, month: 11, text: "Chinese troops crossed the Yalu into Korea" },

  // ── 1951 ──────────────────────────────────────────────
  { year: 1951, month: 9, text: "the Treaty of San Francisco formally ended war with Japan" },
  { year: 1951, month: 11, text: "the Slánský trial began in Prague — Stalinism's biggest Czech show trial" },

  // ── 1952 ──────────────────────────────────────────────
  { year: 1952, month: 2, text: "George VI died; Elizabeth II became Queen at 25" },
  { year: 1952, month: 7, text: "the Egyptian Revolution overthrew King Farouk" },
  { year: 1952, month: 11, text: "the first hydrogen bomb (Ivy Mike) was tested; Eisenhower won the US election" },

  // ── 1953 ──────────────────────────────────────────────
  { year: 1953, month: 1, text: "Eisenhower was inaugurated; Hank Williams died in his Cadillac on New Year's Day" },
  { year: 1953, month: 3, text: "Stalin died in his dacha; Klement Gottwald died nine days later after attending the funeral" },
  { year: 1953, month: 5, text: "Edmund Hillary and Tenzing Norgay reached the summit of Everest" },
  { year: 1953, month: 6, text: "Czechoslovak currency reform sparked the Plzeň uprising; the Rosenbergs were executed" },
  { year: 1953, month: 7, text: "the Korean Armistice paused the war along the 38th parallel" },

  // ── 1954 ──────────────────────────────────────────────
  { year: 1954, month: 5, text: "Brown v. Board of Education outlawed segregated US schools; Dien Bien Phu fell to the Viet Minh" },
  { year: 1954, month: 9, text: "Crimea was transferred from the Russian SFSR to the Ukrainian SSR" },

  // ── 1955 ──────────────────────────────────────────────
  { year: 1955, month: 4, text: "Albert Einstein died at 76 in Princeton" },
  { year: 1955, month: 5, text: "the Warsaw Pact was signed in Warsaw" },
  { year: 1955, month: 7, text: "Disneyland opened in Anaheim" },
  { year: 1955, month: 12, text: "Rosa Parks refused to give up her seat on a Montgomery bus" },

  // ── 1956 ──────────────────────────────────────────────
  { year: 1956, month: 2, text: "Khrushchev's 'Secret Speech' denounced Stalin" },
  { year: 1956, month: 6, text: "the Poznań uprising broke out in Poland" },
  { year: 1956, month: 10, text: "the Hungarian Revolution began; the Suez Crisis erupted" },
  { year: 1956, month: 11, text: "Soviet tanks crushed the Hungarian Revolution" },

  // ── 1957 ──────────────────────────────────────────────
  { year: 1957, month: 3, text: "the Treaty of Rome founded the European Economic Community" },
  { year: 1957, month: 10, text: "Sputnik 1 became the first artificial satellite to orbit Earth" },
  { year: 1957, month: 11, text: "Laika became the first animal to orbit Earth, in Sputnik 2" },

  // ── 1958 ──────────────────────────────────────────────
  { year: 1958, month: 1, text: "Explorer 1 became the first US satellite in orbit" },
  { year: 1958, month: 4, text: "Expo 58 opened in Brussels; Czechoslovak Laterna Magika debuted" },
  { year: 1958, month: 10, text: "Pope Pius XII died" },

  // ── 1959 ──────────────────────────────────────────────
  { year: 1959, month: 1, text: "the Cuban Revolution swept Castro into Havana on the 1st" },
  { year: 1959, month: 2, text: "the 'Day the Music Died' — Buddy Holly, Ritchie Valens, and the Big Bopper killed in an Iowa plane crash" },
  { year: 1959, month: 8, text: "Hawaii became the 50th US state" },
  { year: 1959, month: 10, text: "Luna 3 photographed the far side of the Moon for the first time" },

  // ── 1960 ──────────────────────────────────────────────
  { year: 1960, month: 5, text: "the U-2 incident — Gary Powers's spy plane was shot down over the Urals" },
  { year: 1960, month: 9, text: "the first televised Kennedy–Nixon debate aired" },

  // ── 1961 ──────────────────────────────────────────────
  { year: 1961, month: 1, text: "JFK was inaugurated and gave his 'ask not what your country can do for you' speech" },
  { year: 1961, month: 4, text: "Yuri Gagarin became the first human in space; the Bay of Pigs invasion failed" },
  { year: 1961, month: 5, text: "Alan Shepard became the first American in space" },
  { year: 1961, month: 8, text: "the Berlin Wall went up in a single night" },
  { year: 1961, month: 10, text: "the Soviet Tsar Bomba test produced the largest explosion in history" },

  // ── 1962 ──────────────────────────────────────────────
  { year: 1962, month: 2, text: "John Glenn became the first American to orbit Earth" },
  { year: 1962, month: 8, text: "Marilyn Monroe was found dead in Brentwood at 36" },
  { year: 1962, month: 10, text: "the Cuban Missile Crisis brought the world 13 days from nuclear war" },

  // ── 1963 ──────────────────────────────────────────────
  { year: 1963, month: 6, text: "Buddhist monk Thích Quảng Đức set himself alight in Saigon" },
  { year: 1963, month: 8, text: "Martin Luther King Jr. delivered 'I Have a Dream' at the March on Washington" },
  { year: 1963, month: 11, text: "JFK was assassinated in Dallas; C.S. Lewis and Aldous Huxley died the same day" },

  // ── 1964 ──────────────────────────────────────────────
  { year: 1964, month: 2, text: "the Beatles appeared on the Ed Sullivan Show" },
  { year: 1964, month: 7, text: "the Civil Rights Act was signed by President Johnson" },
  { year: 1964, month: 8, text: "the Gulf of Tonkin Resolution expanded US involvement in Vietnam" },
  { year: 1964, month: 10, text: "Khrushchev was ousted by the Politburo; Sidney Poitier won an Oscar for Lilies of the Field" },

  // ── 1965 ──────────────────────────────────────────────
  { year: 1965, month: 2, text: "Malcolm X was assassinated in Harlem" },
  { year: 1965, month: 3, text: "Bloody Sunday in Selma, Alabama" },
  { year: 1965, month: 8, text: "the Watts Riots erupted in Los Angeles" },

  // ── 1966 ──────────────────────────────────────────────
  { year: 1966, month: 5, text: "the Cultural Revolution began in China" },
  { year: 1966, month: 9, text: "Star Trek premiered on NBC" },
  { year: 1966, month: 10, text: "the Aberfan colliery-tip collapse in Wales killed 144 people, mostly children" },

  // ── 1967 ──────────────────────────────────────────────
  { year: 1967, month: 1, text: "the Apollo 1 fire killed Grissom, White and Chaffee on the launch pad" },
  { year: 1967, month: 6, text: "the Six-Day War redrew the Middle East; Sgt. Pepper's Lonely Hearts Club Band was released" },
  { year: 1967, month: 7, text: "Detroit was rocked by five days of riots" },
  { year: 1967, month: 10, text: "Che Guevara was executed in Bolivia" },

  // ── 1968 ──────────────────────────────────────────────
  { year: 1968, month: 1, text: "the Prague Spring began as Dubček took over in Czechoslovakia; the Tet Offensive shocked America" },
  { year: 1968, month: 3, text: "the My Lai massacre took place in Vietnam" },
  { year: 1968, month: 4, text: "Martin Luther King Jr. was assassinated in Memphis; American cities burned" },
  { year: 1968, month: 5, text: "Paris students and workers brought France to a halt" },
  { year: 1968, month: 6, text: "Robert F. Kennedy was assassinated in Los Angeles" },
  { year: 1968, month: 8, text: "Warsaw Pact tanks crushed the Prague Spring; the Chicago DNC erupted in riots" },
  { year: 1968, month: 10, text: "Smith and Carlos raised black-gloved fists at the Mexico City Olympics; Věra Čáslavská won gold and turned away during the Soviet anthem" },
  { year: 1968, month: 12, text: "Apollo 8 orbited the Moon and broadcast 'Earthrise' on Christmas Eve" },

  // ── 1969 ──────────────────────────────────────────────
  { year: 1969, month: 1, text: "Jan Palach burned himself to death on Wenceslas Square in protest" },
  { year: 1969, month: 6, text: "the Stonewall riots launched modern gay rights in Greenwich Village" },
  { year: 1969, month: 7, text: "Apollo 11 landed on the Moon on the 20th" },
  { year: 1969, month: 8, text: "Woodstock drew 400,000 to a New York dairy farm; the Manson Family killings shocked LA" },
  { year: 1969, month: 11, text: "Sesame Street debuted on US public television" },

  // ── 1970 ──────────────────────────────────────────────
  { year: 1970, month: 4, text: "the first Earth Day was celebrated in the US" },
  { year: 1970, month: 5, text: "Ohio National Guard troops killed four students at Kent State" },
  { year: 1970, month: 9, text: "Jimi Hendrix was found dead in a London flat" },
  { year: 1970, month: 10, text: "Janis Joplin was found dead in a Hollywood hotel" },

  // ── 1971 ──────────────────────────────────────────────
  { year: 1971, month: 6, text: "the New York Times began publishing the Pentagon Papers" },
  { year: 1971, month: 7, text: "Jim Morrison was found dead in a Paris bathtub" },
  { year: 1971, month: 10, text: "Walt Disney World opened in Florida" },

  // ── 1972 ──────────────────────────────────────────────
  { year: 1972, month: 1, text: "Bloody Sunday in Derry, Northern Ireland" },
  { year: 1972, month: 2, text: "Nixon visited China — the first US president to do so" },
  { year: 1972, month: 6, text: "the Watergate burglars were arrested at the DNC offices in DC" },
  { year: 1972, month: 9, text: "Black September took Israeli athletes hostage at the Munich Olympics" },

  // ── 1973 ──────────────────────────────────────────────
  { year: 1973, month: 1, text: "Roe v. Wade legalised abortion in the US; the Paris Peace Accords ended US Vietnam involvement" },
  { year: 1973, month: 9, text: "Pinochet's coup overthrew Allende in Chile" },
  { year: 1973, month: 10, text: "the Yom Kippur War began; OPEC announced the oil embargo" },
  { year: 1973, month: 12, text: "ETA killed Spanish PM Carrero Blanco with a car bomb in Madrid" },

  // ── 1974 ──────────────────────────────────────────────
  { year: 1974, month: 4, text: "the Carnation Revolution in Portugal ended four decades of dictatorship; Hank Aaron broke Babe Ruth's home-run record" },
  { year: 1974, month: 8, text: "Nixon resigned over Watergate" },
  { year: 1974, month: 9, text: "President Ford pardoned Nixon" },

  // ── 1975 ──────────────────────────────────────────────
  { year: 1975, month: 4, text: "Saigon fell to North Vietnamese forces" },
  { year: 1975, month: 11, text: "Franco died in Madrid; King Juan Carlos was sworn in" },

  // ── 1976 ──────────────────────────────────────────────
  { year: 1976, month: 7, text: "Israeli commandos rescued hostages from Entebbe; the US celebrated its bicentennial" },
  { year: 1976, month: 9, text: "Mao Zedong died, ending an era" },

  // ── 1977 ──────────────────────────────────────────────
  { year: 1977, month: 1, text: "Charter 77 was published in Prague by Václav Havel and 240 other dissidents" },
  { year: 1977, month: 5, text: "Star Wars premiered on the 25th" },
  { year: 1977, month: 8, text: "Elvis Presley died at Graceland" },

  // ── 1978 ──────────────────────────────────────────────
  { year: 1978, month: 7, text: "the first IVF baby Louise Brown was born in England" },
  { year: 1978, month: 9, text: "the Camp David Accords brought Egypt and Israel to peace; Pope John Paul I died after 33 days" },
  { year: 1978, month: 10, text: "Karol Wojtyła was elected as Pope John Paul II — the first non-Italian pope in 455 years" },
  { year: 1978, month: 11, text: "the Jonestown mass suicide killed 909 people in Guyana" },

  // ── 1979 ──────────────────────────────────────────────
  { year: 1979, month: 1, text: "the Shah fled Iran; Khomeini returned the next month" },
  { year: 1979, month: 3, text: "the Three Mile Island nuclear plant suffered a partial meltdown" },
  { year: 1979, month: 5, text: "Margaret Thatcher became Britain's first female prime minister" },
  { year: 1979, month: 8, text: "Lord Mountbatten was assassinated by an IRA bomb in Ireland" },
  { year: 1979, month: 11, text: "the Iran hostage crisis began at the US embassy in Tehran" },
  { year: 1979, month: 12, text: "the Soviet Union invaded Afghanistan" },

  // ── 1980 ──────────────────────────────────────────────
  { year: 1980, month: 5, text: "Mount St. Helens erupted in Washington State; Tito died in Yugoslavia" },
  { year: 1980, month: 8, text: "Solidarity-led strikes in Gdańsk shipyard kicked off Poland's slow revolution" },
  { year: 1980, month: 9, text: "the Iran–Iraq War began" },
  { year: 1980, month: 12, text: "John Lennon was shot outside the Dakota in New York" },

  // ── 1981 ──────────────────────────────────────────────
  { year: 1981, month: 1, text: "Reagan was inaugurated and Iran released the 52 American hostages within minutes" },
  { year: 1981, month: 3, text: "Reagan was shot by John Hinckley Jr. outside a DC hotel" },
  { year: 1981, month: 5, text: "Pope John Paul II was shot in St. Peter's Square; Bob Marley died of cancer" },
  { year: 1981, month: 7, text: "Charles and Diana married at St Paul's Cathedral, watched by 750 million" },
  { year: 1981, month: 8, text: "MTV launched in the US; IBM unveiled the first Personal Computer" },
  { year: 1981, month: 12, text: "Martial law was declared in Poland to crush Solidarity" },

  // ── 1982 ──────────────────────────────────────────────
  { year: 1982, month: 4, text: "Argentina invaded the Falklands; Britain sent a task force" },
  { year: 1982, month: 6, text: "Israel invaded Lebanon" },
  { year: 1982, month: 9, text: "Grace Kelly died in a car crash above Monaco" },
  { year: 1982, month: 11, text: "Brezhnev died; Andropov took over the Soviet Union" },

  // ── 1983 ──────────────────────────────────────────────
  { year: 1983, month: 3, text: "Reagan called the USSR an 'evil empire' and unveiled the Strategic Defense Initiative" },
  { year: 1983, month: 9, text: "Soviet jets shot down Korean Air Lines Flight 007 over the Sea of Japan" },
  { year: 1983, month: 10, text: "Marines barracks bombing in Beirut killed 241 US service members; the US invaded Grenada" },

  // ── 1984 ──────────────────────────────────────────────
  { year: 1984, month: 1, text: "Apple launched the Macintosh with the '1984' Super Bowl ad" },
  { year: 1984, month: 7, text: "the Los Angeles Olympics opened (boycotted by the Soviet bloc)" },
  { year: 1984, month: 10, text: "Indira Gandhi was assassinated by her own bodyguards" },
  { year: 1984, month: 12, text: "the Bhopal disaster killed thousands in central India" },

  // ── 1985 ──────────────────────────────────────────────
  { year: 1985, month: 3, text: "Mikhail Gorbachev became Soviet leader" },
  { year: 1985, month: 7, text: "Live Aid concerts in London and Philadelphia raised funds for Ethiopia" },
  { year: 1985, month: 9, text: "an earthquake killed 10,000+ in Mexico City; Rock Hudson became the first major celebrity to die of AIDS" },
  { year: 1985, month: 11, text: "Reagan and Gorbachev met for the first time in Geneva" },

  // ── 1986 ──────────────────────────────────────────────
  { year: 1986, month: 1, text: "the Challenger space shuttle exploded 73 seconds after liftoff" },
  { year: 1986, month: 2, text: "Olof Palme was shot dead on a Stockholm street; the People Power Revolution toppled Marcos in the Philippines" },
  { year: 1986, month: 4, text: "the Chernobyl nuclear reactor exploded on the 26th" },

  // ── 1987 ──────────────────────────────────────────────
  { year: 1987, month: 6, text: "Reagan demanded 'Mr Gorbachev, tear down this wall' at the Brandenburg Gate" },
  { year: 1987, month: 10, text: "Black Monday — the largest one-day stock-market crash in percentage terms" },
  { year: 1987, month: 12, text: "Reagan and Gorbachev signed the INF Treaty in Washington" },

  // ── 1988 ──────────────────────────────────────────────
  { year: 1988, month: 7, text: "the USS Vincennes shot down Iran Air Flight 655" },
  { year: 1988, month: 12, text: "Pan Am 103 was blown up over Lockerbie, Scotland" },

  // ── 1989 ──────────────────────────────────────────────
  { year: 1989, month: 3, text: "the Exxon Valdez ran aground in Alaska" },
  { year: 1989, month: 4, text: "the Hillsborough disaster killed 97 Liverpool fans" },
  { year: 1989, month: 6, text: "the Tiananmen Square massacre crushed China's pro-democracy movement; Solidarity won Poland's elections" },
  { year: 1989, month: 11, text: "the Berlin Wall fell on the 9th; the Velvet Revolution began in Prague on the 17th" },
  { year: 1989, month: 12, text: "Ceaușescu was executed in Romania; Havel was elected president of Czechoslovakia" },

  // ── 1990 ──────────────────────────────────────────────
  { year: 1990, month: 2, text: "Nelson Mandela walked free from prison after 27 years" },
  { year: 1990, month: 8, text: "Iraq invaded Kuwait — the road to the Gulf War began" },
  { year: 1990, month: 10, text: "Germany was reunified at midnight on the 3rd" },

  // ── 1991 ──────────────────────────────────────────────
  { year: 1991, month: 1, text: "the Gulf War began with Operation Desert Storm" },
  { year: 1991, month: 4, text: "the Warsaw Pact formally dissolved" },
  { year: 1991, month: 6, text: "Slovenia and Croatia declared independence from Yugoslavia" },
  { year: 1991, month: 8, text: "a hardline coup against Gorbachev failed in Moscow" },
  { year: 1991, month: 12, text: "the Soviet Union dissolved on Christmas Day" },

  // ── 1992 ──────────────────────────────────────────────
  { year: 1992, month: 4, text: "the Bosnian War began with the siege of Sarajevo; LA riots erupted after the Rodney King verdict" },

  // ── 1993 ──────────────────────────────────────────────
  { year: 1993, month: 1, text: "Czechoslovakia split into the Czech Republic and Slovakia — the Velvet Divorce" },
  { year: 1993, month: 2, text: "the first World Trade Center bombing killed six in New York" },
  { year: 1993, month: 4, text: "the Waco siege ended with 76 dead at the Branch Davidian compound" },
  { year: 1993, month: 9, text: "the Oslo Accords were signed on the White House lawn" },

  // ── 1994 ──────────────────────────────────────────────
  { year: 1994, month: 4, text: "the Rwandan genocide began — 800,000 killed in 100 days" },
  { year: 1994, month: 5, text: "Mandela was inaugurated as South African president; the Channel Tunnel opened" },
  { year: 1994, month: 6, text: "O.J. Simpson led police on a slow-speed Bronco chase" },

  // ── 1995 ──────────────────────────────────────────────
  { year: 1995, month: 1, text: "the Kobe earthquake killed 6,400 in Japan" },
  { year: 1995, month: 3, text: "Aum Shinrikyo released sarin gas on the Tokyo subway" },
  { year: 1995, month: 4, text: "the Oklahoma City bombing killed 168" },
  { year: 1995, month: 7, text: "Srebrenica massacre killed over 8,000 Bosniak men and boys" },
  { year: 1995, month: 8, text: "Windows 95 launched with The Rolling Stones' 'Start Me Up'" },
  { year: 1995, month: 11, text: "Yitzhak Rabin was assassinated in Tel Aviv" },

  // ── 1996 ──────────────────────────────────────────────
  { year: 1996, month: 4, text: "the Unabomber Ted Kaczynski was arrested in his Montana cabin" },
  { year: 1996, month: 7, text: "Dolly the sheep was cloned (announced 1997)" },

  // ── 1997 ──────────────────────────────────────────────
  { year: 1997, month: 7, text: "Britain handed Hong Kong back to China" },
  { year: 1997, month: 8, text: "Princess Diana was killed in a Paris car crash; Mother Teresa died days later" },

  // ── 1998 ──────────────────────────────────────────────
  { year: 1998, month: 8, text: "US embassies in Kenya and Tanzania were bombed by al-Qaeda" },
  { year: 1998, month: 12, text: "President Clinton was impeached by the US House" },

  // ── 1999 ──────────────────────────────────────────────
  { year: 1999, month: 1, text: "the euro was introduced for non-cash transactions" },
  { year: 1999, month: 3, text: "NATO began bombing Yugoslavia over Kosovo" },
  { year: 1999, month: 4, text: "the Columbine High School shooting in Colorado killed 13" },
  { year: 1999, month: 8, text: "a total solar eclipse darkened Europe for the last time of the 20th century" },

  // ── 2000 ──────────────────────────────────────────────
  { year: 2000, month: 11, text: "the US presidential election came down to Florida; the Supreme Court eventually settled it for Bush" },

  // ── 2001 ──────────────────────────────────────────────
  { year: 2001, month: 1, text: "Wikipedia was launched" },
  { year: 2001, month: 9, text: "al-Qaeda hijackers attacked the World Trade Center and Pentagon on the 11th" },
  { year: 2001, month: 10, text: "the US-led invasion of Afghanistan began" },
  { year: 2001, month: 11, text: "Apple released the first iPod" },

  // ── 2002 ──────────────────────────────────────────────
  { year: 2002, month: 1, text: "euro coins and notes entered everyday circulation across 12 countries" },

  // ── 2003 ──────────────────────────────────────────────
  { year: 2003, month: 2, text: "the Space Shuttle Columbia disintegrated on re-entry" },
  { year: 2003, month: 3, text: "the US-led invasion of Iraq began" },

  // ── 2004 ──────────────────────────────────────────────
  { year: 2004, month: 2, text: "Facebook was launched out of a Harvard dorm" },
  { year: 2004, month: 3, text: "the Madrid train bombings killed 193" },
  { year: 2004, month: 5, text: "ten new states joined the EU, including the Czech Republic" },
  { year: 2004, month: 12, text: "the Indian Ocean tsunami killed 230,000+ across 14 countries" },

  // ── 2005 ──────────────────────────────────────────────
  { year: 2005, month: 4, text: "Pope John Paul II died; Benedict XVI was elected" },
  { year: 2005, month: 7, text: "the London transport bombings killed 52" },
  { year: 2005, month: 8, text: "Hurricane Katrina drowned New Orleans" },

  // ── 2006 ──────────────────────────────────────────────
  { year: 2006, month: 3, text: "Twitter was launched" },

  // ── 2007 ──────────────────────────────────────────────
  { year: 2007, month: 1, text: "Steve Jobs unveiled the iPhone" },
  { year: 2007, month: 4, text: "the Virginia Tech shooting killed 32" },

  // ── 2008 ──────────────────────────────────────────────
  { year: 2008, month: 8, text: "the Beijing Olympics opened on 08/08/08" },
  { year: 2008, month: 9, text: "Lehman Brothers collapsed and the global financial crisis exploded" },
  { year: 2008, month: 11, text: "Barack Obama was elected the first Black US president" },

  // ── 2009 ──────────────────────────────────────────────
  { year: 2009, month: 6, text: "Michael Jackson died of a propofol overdose in Los Angeles" },

  // ── 2010 ──────────────────────────────────────────────
  { year: 2010, month: 1, text: "the Haiti earthquake killed an estimated 220,000+" },
  { year: 2010, month: 4, text: "the Deepwater Horizon oil rig exploded in the Gulf of Mexico" },
  { year: 2010, month: 10, text: "33 Chilean miners were rescued from 700m underground after 69 days" },
  { year: 2010, month: 12, text: "a Tunisian street vendor's self-immolation ignited the Arab Spring" },

  // ── 2011 ──────────────────────────────────────────────
  { year: 2011, month: 1, text: "Egypt's Tahrir Square uprising overthrew Mubarak" },
  { year: 2011, month: 3, text: "an earthquake and tsunami caused the Fukushima nuclear meltdown" },
  { year: 2011, month: 5, text: "US Navy SEALs killed Osama bin Laden in Pakistan" },
  { year: 2011, month: 7, text: "Anders Breivik killed 77 in Norway, mostly teenagers on Utøya island" },
  { year: 2011, month: 10, text: "Steve Jobs died of pancreatic cancer in Palo Alto" },

  // ── 2012 ──────────────────────────────────────────────
  { year: 2012, month: 7, text: "the London Olympics opened" },
  { year: 2012, month: 10, text: "Hurricane Sandy flooded New York and New Jersey" },
  { year: 2012, month: 12, text: "the Sandy Hook school shooting killed 26, mostly first-graders" },

  // ── 2013 ──────────────────────────────────────────────
  { year: 2013, month: 3, text: "Jorge Bergoglio became Pope Francis — the first Jesuit and the first from the Americas" },
  { year: 2013, month: 4, text: "the Boston Marathon was bombed" },
  { year: 2013, month: 6, text: "Edward Snowden began releasing NSA surveillance documents from Hong Kong" },
  { year: 2013, month: 12, text: "Nelson Mandela died at 95" },

  // ── 2014 ──────────────────────────────────────────────
  { year: 2014, month: 2, text: "Kyiv's Maidan Revolution toppled the Ukrainian government" },
  { year: 2014, month: 3, text: "Russia annexed Crimea; Malaysia Airlines MH370 vanished over the Indian Ocean" },
  { year: 2014, month: 7, text: "Malaysia Airlines MH17 was shot down over eastern Ukraine" },
  { year: 2014, month: 8, text: "Robin Williams died by suicide; ALS Ice Bucket Challenge went viral" },

  // ── 2015 ──────────────────────────────────────────────
  { year: 2015, month: 1, text: "Charlie Hebdo's Paris offices were attacked, killing 12" },
  { year: 2015, month: 4, text: "an earthquake in Nepal killed nearly 9,000" },
  { year: 2015, month: 11, text: "coordinated attacks in Paris killed 130, including 90 at the Bataclan" },
  { year: 2015, month: 12, text: "the Paris Agreement on climate change was signed" },

  // ── 2016 ──────────────────────────────────────────────
  { year: 2016, month: 1, text: "David Bowie died two days after releasing Blackstar" },
  { year: 2016, month: 4, text: "Prince was found dead at Paisley Park" },
  { year: 2016, month: 6, text: "Britain voted narrowly to leave the European Union" },
  { year: 2016, month: 11, text: "Donald Trump won the US presidency" },

  // ── 2017 ──────────────────────────────────────────────
  { year: 2017, month: 5, text: "the WannaCry ransomware shut down hospitals and factories across the world" },
  { year: 2017, month: 8, text: "the Great American Eclipse crossed the continental US" },
  { year: 2017, month: 10, text: "Harvey Weinstein's exposure launched the #MeToo movement" },

  // ── 2018 ──────────────────────────────────────────────
  { year: 2018, month: 3, text: "Stephen Hawking died on Pi Day at 76" },
  { year: 2018, month: 5, text: "Prince Harry married Meghan Markle at Windsor" },

  // ── 2019 ──────────────────────────────────────────────
  { year: 2019, month: 4, text: "the spire of Notre-Dame de Paris collapsed in a fire" },
  { year: 2019, month: 4, text: "the first photograph of a black hole was published" },
  { year: 2019, month: 12, text: "a cluster of pneumonia cases in Wuhan, China was reported to the WHO" },

  // ── 2020 ──────────────────────────────────────────────
  { year: 2020, month: 1, text: "Kobe Bryant died in a California helicopter crash with his daughter" },
  { year: 2020, month: 3, text: "the WHO declared COVID-19 a pandemic; the world locked down" },
  { year: 2020, month: 5, text: "George Floyd was killed by a Minneapolis police officer; global protests followed" },
  { year: 2020, month: 11, text: "Joe Biden defeated Donald Trump in the US presidential election" },
  { year: 2020, month: 12, text: "the great conjunction brought Jupiter and Saturn within 0.1° of each other" },

  // ── 2021 ──────────────────────────────────────────────
  { year: 2021, month: 1, text: "a mob stormed the US Capitol on January 6 trying to overturn the election" },
  { year: 2021, month: 8, text: "the Taliban retook Kabul as the US ended its 20-year war in Afghanistan" },

  // ── 2022 ──────────────────────────────────────────────
  { year: 2022, month: 2, text: "Russia launched a full-scale invasion of Ukraine on the 24th" },
  { year: 2022, month: 9, text: "Queen Elizabeth II died at Balmoral after 70 years on the throne" },
  { year: 2022, month: 11, text: "OpenAI released ChatGPT to the public" },

  // ── 2023 ──────────────────────────────────────────────
  { year: 2023, month: 2, text: "a magnitude-7.8 earthquake killed 60,000+ across Turkey and Syria" },
  { year: 2023, month: 10, text: "Hamas attacked Israel, killing 1,200 and taking 250 hostages" },

  // ── 2024 ──────────────────────────────────────────────
  { year: 2024, month: 4, text: "a total solar eclipse swept across Mexico, the US and eastern Canada" },
];

// ── Selectors ────────────────────────────────────────────────────

export function eventsInMonth(year: number, month: number): MonthlyEvent[] {
  return MONTHLY_EVENTS.filter((e) => e.year === year && e.month === month);
}

export function eventsInMonthLifetime(
  birthYear: number,
  birthMonth: number,
  currentYear: number,
): MonthlyEvent[] {
  // Pick events that occurred in the same calendar month as their birth.
  return MONTHLY_EVENTS.filter(
    (e) => e.month === birthMonth && e.year >= birthYear && e.year <= currentYear,
  );
}

export function eventsAroundMonth(
  year: number,
  month: number,
  monthSpan = 2,
): MonthlyEvent[] {
  // Events within ±monthSpan months of the given (year, month).
  return MONTHLY_EVENTS.filter((e) => {
    const dm = (e.year - year) * 12 + (e.month - month);
    return Math.abs(dm) <= monthSpan;
  });
}
