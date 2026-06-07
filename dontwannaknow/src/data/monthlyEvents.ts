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
  { year: 1938, month: 3, text: "Hitlerův wehrmacht vpochodoval do Rakouska v rámci anšlusu" },
  { year: 1938, month: 9, text: "Mnichovská dohoda odevzdala Sudety Německu" },
  { year: 1938, month: 10, text: "německé jednotky obsadily Sudety" },
  { year: 1938, month: 11, text: "Křišťálová noc — po celém Německu a Rakousku hořely synagogy" },

  // ── 1939 ──────────────────────────────────────────────
  { year: 1939, month: 3, text: "Německo obsadilo zbytek Čech a Moravy" },
  { year: 1939, month: 4, text: "Itálie napadla Albánii" },
  { year: 1939, month: 8, text: "pakt Molotov–Ribbentrop rozdělil východní Evropu mezi Hitlera a Stalina" },
  { year: 1939, month: 9, text: "Německo napadlo Polsko; Británie a Francie vyhlásily válku — začala druhá světová válka" },
  { year: 1939, month: 11, text: "vypukla zimní válka, když SSSR napadl Finsko" },

  // ── 1940 ──────────────────────────────────────────────
  { year: 1940, month: 4, text: "Německo napadlo Dánsko a Norsko" },
  { year: 1940, month: 5, text: "Německo napadlo Francii, Belgii a Nizozemsko; začala evakuace u Dunkerque" },
  { year: 1940, month: 6, text: "Francie podepsala příměří s Německem; Churchill varoval před „bitvou o Británii“" },
  { year: 1940, month: 7, text: "na obloze začala bitva o Británii" },
  { year: 1940, month: 9, text: "začal Blitz nad Londýnem — bomby padaly každou noc po 57 dní" },
  { year: 1940, month: 10, text: "Pakt tří spojil Německo, Itálii a Japonsko v ose" },

  // ── 1941 ──────────────────────────────────────────────
  { year: 1941, month: 5, text: "Rudolf Hess sám odletěl do Skotska na pošetilou mírovou misi" },
  { year: 1941, month: 6, text: "operace Barbarossa — Německo napadlo Sovětský svaz" },
  { year: 1941, month: 9, text: "Babí Jar — během dvou dnů zastřeleno 33 771 Židů u Kyjeva; začalo obléhání Leningradu" },
  { year: 1941, month: 12, text: "útok na Pearl Harbor; USA vstoupily do války" },

  // ── 1942 ──────────────────────────────────────────────
  { year: 1942, month: 1, text: "konference ve Wannsee naplánovala konečné řešení" },
  { year: 1942, month: 4, text: "Doolittlův nálet poprvé bombardoval Tokio" },
  { year: 1942, month: 5, text: "na šéfa SS Reinharda Heydricha byl v Praze spáchán atentát a o pár dní později zemřel" },
  { year: 1942, month: 6, text: "bitva u Midway zvrátila válku v Tichomoří; Lidice byly srovnány se zemí jako odveta za Heydricha" },
  { year: 1942, month: 8, text: "začala bitva u Stalingradu" },
  { year: 1942, month: 11, text: "operace Torch vylodila spojence v severní Africe" },

  // ── 1943 ──────────────────────────────────────────────
  { year: 1943, month: 1, text: "konference v Casablance stanovila „bezpodmínečnou kapitulaci“ jako cíl spojenců" },
  { year: 1943, month: 2, text: "německá 6. armáda kapitulovala u Stalingradu" },
  { year: 1943, month: 4, text: "vypuklo povstání ve varšavském ghettu" },
  { year: 1943, month: 7, text: "spojenecké síly se vylodily na Sicílii; Mussolini byl svržen" },
  { year: 1943, month: 9, text: "Itálie kapitulovala" },
  { year: 1943, month: 11, text: "Rudá armáda dobyla zpět Kyjev" },

  // ── 1944 ──────────────────────────────────────────────
  { year: 1944, month: 1, text: "obléhání Leningradu skončilo po 872 dnech" },
  { year: 1944, month: 6, text: "vylodění v Normandii v Den D, šestého" },
  { year: 1944, month: 7, text: "atentát na Hitlera z 20. července selhal" },
  { year: 1944, month: 8, text: "Paříž byla osvobozena; vypuklo Slovenské národní povstání" },
  { year: 1944, month: 9, text: "operace Market Garden u Arnhemu ztroskotala" },
  { year: 1944, month: 12, text: "bitva v Ardenách zahájila poslední německou ofenzivu" },

  // ── 1945 ──────────────────────────────────────────────
  { year: 1945, month: 1, text: "Osvětim byla 27. osvobozena Rudou armádou" },
  { year: 1945, month: 2, text: "Jaltská konference rozdělila poválečnou Evropu; Drážďany byly vybombardovány zápalnými pumami" },
  { year: 1945, month: 4, text: "zemřel F. D. Roosevelt; Hitler spáchal sebevraždu v berlínském bunkru" },
  { year: 1945, month: 5, text: "Německo kapitulovalo osmého; Pražské povstání probíhalo 5.–9. května" },
  { year: 1945, month: 7, text: "Postupimská konference vymezila německé okupační zóny" },
  { year: 1945, month: 8, text: "na Hirošimu (6.) a Nagasaki (9.) byly svrženy atomové bomby; Japonsko kapitulovalo" },
  { year: 1945, month: 10, text: "byla založena Organizace spojených národů" },
  { year: 1945, month: 11, text: "začaly norimberské procesy s nacistickým vedením" },

  // ── 1946 ──────────────────────────────────────────────
  { year: 1946, month: 3, text: "Churchill ve Fultonu v Missouri varoval před „železnou oponou“ spouštějící se napříč Evropou" },
  { year: 1946, month: 5, text: "v československých volbách získali komunisté nejsilnější jednotlivý blok" },
  { year: 1946, month: 10, text: "na základě norimberských rozsudků bylo oběšeno dvanáct nacistických pohlavárů" },

  // ── 1947 ──────────────────────────────────────────────
  { year: 1947, month: 3, text: "prezident Truman vyhlásil Trumanovu doktrínu o zadržování komunismu" },
  { year: 1947, month: 6, text: "ministr Marshall na Harvardu představil plán evropské obnovy" },
  { year: 1947, month: 8, text: "Indie a Pákistán získaly nezávislost; rozdělení vyhnalo z domovů 15 milionů lidí" },
  { year: 1947, month: 10, text: "Chuck Yeager prolomil v letounu Bell X-1 zvukovou bariéru" },
  { year: 1947, month: 11, text: "OSN odhlasovala rozdělení Palestiny" },

  // ── 1948 ──────────────────────────────────────────────
  { year: 1948, month: 1, text: "v Novém Dillí byl zavražděn Gándhí" },
  { year: 1948, month: 2, text: "komunistický převrat v Československu se chopil moci; Jan Masaryk byl nalezen mrtev pod svým oknem" },
  { year: 1948, month: 5, text: "čtrnáctého byl vyhlášen stát Izrael" },
  { year: 1948, month: 6, text: "začal berlínský letecký most poté, co Sověti zablokovali Západní Berlín" },
  { year: 1948, month: 12, text: "byla přijata Všeobecná deklarace lidských práv" },

  // ── 1949 ──────────────────────────────────────────────
  { year: 1949, month: 4, text: "dvanáct členských států založilo NATO" },
  { year: 1949, month: 5, text: "berlínský letecký most skončil; byla založena Spolková republika Německo" },
  { year: 1949, month: 8, text: "Sovětský svaz otestoval svou první atomovou bombu" },
  { year: 1949, month: 10, text: "Mao Ce-tung vyhlásil Čínskou lidovou republiku; byla založena NDR" },

  // ── 1950 ──────────────────────────────────────────────
  { year: 1950, month: 6, text: "Severní Korea napadla Jih — začala korejská válka" },
  { year: 1950, month: 9, text: "MacArthur se vylodil u Inčchonu" },
  { year: 1950, month: 11, text: "čínské jednotky překročily řeku Ja-lu do Koreje" },

  // ── 1951 ──────────────────────────────────────────────
  { year: 1951, month: 9, text: "Sanfranciská mírová smlouva formálně ukončila válku s Japonskem" },
  { year: 1951, month: 11, text: "v Praze začal Slánského proces — největší český vykonstruovaný proces stalinismu" },

  // ── 1952 ──────────────────────────────────────────────
  { year: 1952, month: 2, text: "zemřel Jiří VI.; pětadvacetiletá Alžběta II. se stala královnou" },
  { year: 1952, month: 7, text: "egyptská revoluce svrhla krále Farúka" },
  { year: 1952, month: 11, text: "byla otestována první vodíková bomba (Ivy Mike); Eisenhower vyhrál americké volby" },

  // ── 1953 ──────────────────────────────────────────────
  { year: 1953, month: 1, text: "Eisenhower složil prezidentský slib; Hank Williams zemřel na Nový rok ve svém cadillacu" },
  { year: 1953, month: 3, text: "Stalin zemřel ve své dače; Klement Gottwald zemřel o devět dní později po účasti na pohřbu" },
  { year: 1953, month: 5, text: "Edmund Hillary a Tenzing Norgay dosáhli vrcholu Everestu" },
  { year: 1953, month: 6, text: "československá měnová reforma vyvolala plzeňské povstání; manželé Rosenbergovi byli popraveni" },
  { year: 1953, month: 7, text: "korejské příměří pozastavilo válku podél 38. rovnoběžky" },

  // ── 1954 ──────────────────────────────────────────────
  { year: 1954, month: 5, text: "rozsudek Brown v. Board of Education zakázal segregaci amerických škol; Dien Bien Phu padlo do rukou Viet Minhu" },
  { year: 1954, month: 9, text: "Krym byl převeden z Ruské SFSR do Ukrajinské SSR" },

  // ── 1955 ──────────────────────────────────────────────
  { year: 1955, month: 4, text: "Albert Einstein zemřel v 76 letech v Princetonu" },
  { year: 1955, month: 5, text: "ve Varšavě byla podepsána Varšavská smlouva" },
  { year: 1955, month: 7, text: "v Anaheimu byl otevřen Disneyland" },
  { year: 1955, month: 12, text: "Rosa Parksová odmítla uvolnit místo v autobuse v Montgomery" },

  // ── 1956 ──────────────────────────────────────────────
  { year: 1956, month: 2, text: "Chruščovův „tajný projev“ odsoudil Stalina" },
  { year: 1956, month: 6, text: "v Polsku vypuklo poznaňské povstání" },
  { year: 1956, month: 10, text: "začalo maďarské povstání; vypukla suezská krize" },
  { year: 1956, month: 11, text: "sovětské tanky rozdrtily maďarské povstání" },

  // ── 1957 ──────────────────────────────────────────────
  { year: 1957, month: 3, text: "Římské smlouvy založily Evropské hospodářské společenství" },
  { year: 1957, month: 10, text: "Sputnik 1 se stal první umělou družicí na oběžné dráze Země" },
  { year: 1957, month: 11, text: "Lajka se na palubě Sputniku 2 stala prvním zvířetem na oběžné dráze Země" },

  // ── 1958 ──────────────────────────────────────────────
  { year: 1958, month: 1, text: "Explorer 1 se stal první americkou družicí na oběžné dráze" },
  { year: 1958, month: 4, text: "v Bruselu se otevřela výstava Expo 58; debutovala československá Laterna magika" },
  { year: 1958, month: 10, text: "zemřel papež Pius XII." },

  // ── 1959 ──────────────────────────────────────────────
  { year: 1959, month: 1, text: "kubánská revoluce prvního dovedla Castra do Havany" },
  { year: 1959, month: 2, text: "„den, kdy zemřela hudba“ — Buddy Holly, Ritchie Valens a Big Bopper zahynuli při letecké havárii v Iowě" },
  { year: 1959, month: 8, text: "Havaj se stala 50. státem USA" },
  { year: 1959, month: 10, text: "Luna 3 poprvé vyfotografovala odvrácenou stranu Měsíce" },

  // ── 1960 ──────────────────────────────────────────────
  { year: 1960, month: 5, text: "incident s letounem U-2 — špionážní letadlo Garyho Powerse bylo sestřeleno nad Uralem" },
  { year: 1960, month: 9, text: "odvysílána první televizní debata Kennedyho a Nixona" },

  // ── 1961 ──────────────────────────────────────────────
  { year: 1961, month: 1, text: "J. F. Kennedy složil prezidentský slib a pronesl projev „neptej se, co může tvá země udělat pro tebe“" },
  { year: 1961, month: 4, text: "Jurij Gagarin se stal prvním člověkem ve vesmíru; invaze v Zátoce sviní selhala" },
  { year: 1961, month: 5, text: "Alan Shepard se stal prvním Američanem ve vesmíru" },
  { year: 1961, month: 8, text: "berlínská zeď vyrostla během jediné noci" },
  { year: 1961, month: 10, text: "sovětský test Car-bomby vyvolal největší výbuch v dějinách" },

  // ── 1962 ──────────────────────────────────────────────
  { year: 1962, month: 2, text: "John Glenn se stal prvním Američanem na oběžné dráze Země" },
  { year: 1962, month: 8, text: "Marilyn Monroe byla nalezena mrtvá v Brentwoodu ve věku 36 let" },
  { year: 1962, month: 10, text: "karibská krize přivedla svět na 13 dní na pokraj jaderné války" },

  // ── 1963 ──────────────────────────────────────────────
  { year: 1963, month: 6, text: "buddhistický mnich Thích Quảng Đức se v Saigonu upálil" },
  { year: 1963, month: 8, text: "Martin Luther King ml. pronesl při pochodu na Washington projev „I Have a Dream“" },
  { year: 1963, month: 11, text: "J. F. Kennedy byl zavražděn v Dallasu; téhož dne zemřeli C. S. Lewis a Aldous Huxley" },

  // ── 1964 ──────────────────────────────────────────────
  { year: 1964, month: 2, text: "Beatles vystoupili v pořadu Eda Sullivana" },
  { year: 1964, month: 7, text: "prezident Johnson podepsal zákon o občanských právech" },
  { year: 1964, month: 8, text: "rezoluce o Tonkinském zálivu rozšířila americkou angažovanost ve Vietnamu" },
  { year: 1964, month: 10, text: "politbyro svrhlo Chruščova; Sidney Poitier získal Oscara za film Lilie polní" },

  // ── 1965 ──────────────────────────────────────────────
  { year: 1965, month: 2, text: "Malcolm X byl zavražděn v Harlemu" },
  { year: 1965, month: 3, text: "krvavá neděle v Selmě v Alabamě" },
  { year: 1965, month: 8, text: "v Los Angeles vypukly nepokoje ve čtvrti Watts" },

  // ── 1966 ──────────────────────────────────────────────
  { year: 1966, month: 5, text: "v Číně začala kulturní revoluce" },
  { year: 1966, month: 9, text: "na stanici NBC měl premiéru seriál Star Trek" },
  { year: 1966, month: 10, text: "sesuv hlušiny z dolu v Aberfanu ve Walesu zabil 144 lidí, převážně dětí" },

  // ── 1967 ──────────────────────────────────────────────
  { year: 1967, month: 1, text: "požár Apolla 1 zabil na startovací rampě Grissoma, Whitea a Chaffeeho" },
  { year: 1967, month: 6, text: "šestidenní válka překreslila Blízký východ; vyšlo album Sgt. Pepper's Lonely Hearts Club Band" },
  { year: 1967, month: 7, text: "Detroit otřásalo pět dní nepokojů" },
  { year: 1967, month: 10, text: "Che Guevara byl popraven v Bolívii" },

  // ── 1968 ──────────────────────────────────────────────
  { year: 1968, month: 1, text: "začalo pražské jaro, když se v Československu ujal vlády Dubček; ofenziva Tet šokovala Ameriku" },
  { year: 1968, month: 3, text: "ve Vietnamu se odehrál masakr v My Lai" },
  { year: 1968, month: 4, text: "Martin Luther King ml. byl zavražděn v Memphisu; americká města hořela" },
  { year: 1968, month: 5, text: "pařížští studenti a dělníci ochromili Francii" },
  { year: 1968, month: 6, text: "Robert F. Kennedy byl zavražděn v Los Angeles" },
  { year: 1968, month: 8, text: "tanky Varšavské smlouvy rozdrtily pražské jaro; sjezd Demokratů v Chicagu přerostl v nepokoje" },
  { year: 1968, month: 10, text: "Smith a Carlos zvedli na olympiádě v Mexico City pěsti v černých rukavicích; Věra Čáslavská získala zlato a během sovětské hymny odvrátila hlavu" },
  { year: 1968, month: 12, text: "Apollo 8 obletělo Měsíc a na Štědrý večer vysílalo snímek „Earthrise“" },

  // ── 1969 ──────────────────────────────────────────────
  { year: 1969, month: 1, text: "Jan Palach se na protest upálil na Václavském náměstí" },
  { year: 1969, month: 6, text: "nepokoje u Stonewallu v Greenwich Village odstartovaly moderní hnutí za práva gayů" },
  { year: 1969, month: 7, text: "Apollo 11 přistálo dvacátého na Měsíci" },
  { year: 1969, month: 8, text: "Woodstock přilákal 400 000 lidí na mléčnou farmu v New Yorku; vraždy Mansonovy rodiny šokovaly Los Angeles" },
  { year: 1969, month: 11, text: "v americké veřejnoprávní televizi debutovala Sezame, otevři se" },

  // ── 1970 ──────────────────────────────────────────────
  { year: 1970, month: 4, text: "ve Spojených státech se slavil první Den Země" },
  { year: 1970, month: 5, text: "příslušníci ohijské Národní gardy zastřelili čtyři studenty na Kentské státní univerzitě" },
  { year: 1970, month: 9, text: "Jimi Hendrix byl nalezen mrtev v londýnském bytě" },
  { year: 1970, month: 10, text: "Janis Joplinová byla nalezena mrtvá v hollywoodském hotelu" },

  // ── 1971 ──────────────────────────────────────────────
  { year: 1971, month: 6, text: "deník The New York Times začal zveřejňovat Pentagonské dokumenty" },
  { year: 1971, month: 7, text: "Jim Morrison byl nalezen mrtev v pařížské vaně" },
  { year: 1971, month: 10, text: "na Floridě byl otevřen Walt Disney World" },

  // ── 1972 ──────────────────────────────────────────────
  { year: 1972, month: 1, text: "krvavá neděle v Derry v Severním Irsku" },
  { year: 1972, month: 2, text: "Nixon navštívil Čínu — jako první americký prezident" },
  { year: 1972, month: 6, text: "lupiči z aféry Watergate byli zatčeni v kancelářích Demokratů ve Washingtonu" },
  { year: 1972, month: 9, text: "Černé září vzalo na olympiádě v Mnichově izraelské sportovce jako rukojmí" },

  // ── 1973 ──────────────────────────────────────────────
  { year: 1973, month: 1, text: "rozsudek Roe v. Wade legalizoval potraty v USA; pařížské mírové dohody ukončily americkou účast ve Vietnamu" },
  { year: 1973, month: 9, text: "Pinochetův převrat svrhl v Chile Allendeho" },
  { year: 1973, month: 10, text: "začala jomkipurská válka; OPEC vyhlásil ropné embargo" },
  { year: 1973, month: 12, text: "ETA zabila v Madridu náloží v autě španělského premiéra Carrera Blanca" },

  // ── 1974 ──────────────────────────────────────────────
  { year: 1974, month: 4, text: "karafiátová revoluce v Portugalsku ukončila čtyři desetiletí diktatury; Hank Aaron překonal homerunový rekord Babea Rutha" },
  { year: 1974, month: 8, text: "Nixon kvůli aféře Watergate odstoupil" },
  { year: 1974, month: 9, text: "prezident Ford udělil Nixonovi milost" },

  // ── 1975 ──────────────────────────────────────────────
  { year: 1975, month: 4, text: "Saigon padl do rukou severovietnamských sil" },
  { year: 1975, month: 11, text: "Franco zemřel v Madridu; král Juan Carlos složil přísahu" },

  // ── 1976 ──────────────────────────────────────────────
  { year: 1976, month: 7, text: "izraelští komandos osvobodili rukojmí v Entebbe; USA slavily 200. výročí vzniku" },
  { year: 1976, month: 9, text: "zemřel Mao Ce-tung a skončila tak celá éra" },

  // ── 1977 ──────────────────────────────────────────────
  { year: 1977, month: 1, text: "Václav Havel a 240 dalších disidentů zveřejnili v Praze Chartu 77" },
  { year: 1977, month: 5, text: "pětadvacátého měly premiéru Hvězdné války" },
  { year: 1977, month: 8, text: "Elvis Presley zemřel v sídle Graceland" },

  // ── 1978 ──────────────────────────────────────────────
  { year: 1978, month: 7, text: "v Anglii se narodilo první dítě ze zkumavky, Louise Brownová" },
  { year: 1978, month: 9, text: "dohody z Camp Davidu přinesly mír mezi Egyptem a Izraelem; papež Jan Pavel I. zemřel po 33 dnech" },
  { year: 1978, month: 10, text: "Karol Wojtyła byl zvolen papežem Janem Pavlem II. — prvním neitalským papežem po 455 letech" },
  { year: 1978, month: 11, text: "hromadná sebevražda v Jonestownu si v Guyaně vyžádala 909 obětí" },

  // ── 1979 ──────────────────────────────────────────────
  { year: 1979, month: 1, text: "šáh uprchl z Íránu; následující měsíc se vrátil Chomejní" },
  { year: 1979, month: 3, text: "v jaderné elektrárně Three Mile Island došlo k částečnému roztavení aktivní zóny" },
  { year: 1979, month: 5, text: "Margaret Thatcherová se stala první britskou premiérkou" },
  { year: 1979, month: 8, text: "lord Mountbatten byl v Irsku zabit bombou IRA" },
  { year: 1979, month: 11, text: "na americkém velvyslanectví v Teheránu začala íránská rukojmí krize" },
  { year: 1979, month: 12, text: "Sovětský svaz vpadl do Afghánistánu" },

  // ── 1980 ──────────────────────────────────────────────
  { year: 1980, month: 5, text: "ve státě Washington vybuchla sopka Mount St. Helens; v Jugoslávii zemřel Tito" },
  { year: 1980, month: 8, text: "stávky vedené Solidaritou v gdaňské loděnici odstartovaly pozvolnou polskou revoluci" },
  { year: 1980, month: 9, text: "začala válka mezi Íránem a Irákem" },
  { year: 1980, month: 12, text: "John Lennon byl zastřelen před domem Dakota v New Yorku" },

  // ── 1981 ──────────────────────────────────────────────
  { year: 1981, month: 1, text: "Reagan složil prezidentský slib a Írán během několika minut propustil 52 amerických rukojmích" },
  { year: 1981, month: 3, text: "Reagana postřelil John Hinckley ml. před washingtonským hotelem" },
  { year: 1981, month: 5, text: "papež Jan Pavel II. byl postřelen na Svatopetrském náměstí; Bob Marley zemřel na rakovinu" },
  { year: 1981, month: 7, text: "Charles a Diana se vzali v katedrále svatého Pavla před zraky 750 milionů diváků" },
  { year: 1981, month: 8, text: "ve Spojených státech začala vysílat MTV; IBM představilo první osobní počítač" },
  { year: 1981, month: 12, text: "v Polsku bylo k rozdrcení Solidarity vyhlášeno stanné právo" },

  // ── 1982 ──────────────────────────────────────────────
  { year: 1982, month: 4, text: "Argentina obsadila Falklandy; Británie vyslala námořní svaz" },
  { year: 1982, month: 6, text: "Izrael vpadl do Libanonu" },
  { year: 1982, month: 9, text: "Grace Kelly zahynula při autonehodě nad Monakem" },
  { year: 1982, month: 11, text: "zemřel Brežněv; v čele Sovětského svazu ho vystřídal Andropov" },

  // ── 1983 ──────────────────────────────────────────────
  { year: 1983, month: 3, text: "Reagan označil SSSR za „říši zla“ a představil Strategickou obrannou iniciativu" },
  { year: 1983, month: 9, text: "sovětské stíhačky sestřelily nad Japonským mořem let Korean Air Lines 007" },
  { year: 1983, month: 10, text: "útok na kasárna mariňáků v Bejrútu zabil 241 amerických vojáků; USA vpadly do Grenady" },

  // ── 1984 ──────────────────────────────────────────────
  { year: 1984, month: 1, text: "Apple uvedlo Macintosh reklamou „1984“ vysílanou během Super Bowlu" },
  { year: 1984, month: 7, text: "v Los Angeles byla zahájena olympiáda (bojkotovaná sovětským blokem)" },
  { year: 1984, month: 10, text: "Indiru Gándhíovou zavraždili její vlastní strážci" },
  { year: 1984, month: 12, text: "katastrofa v Bhópálu zabila ve střední Indii tisíce lidí" },

  // ── 1985 ──────────────────────────────────────────────
  { year: 1985, month: 3, text: "Michail Gorbačov se stal sovětským vůdcem" },
  { year: 1985, month: 7, text: "koncerty Live Aid v Londýně a Filadelfii vybraly peníze pro Etiopii" },
  { year: 1985, month: 9, text: "zemětřesení zabilo v Mexico City přes 10 000 lidí; Rock Hudson se stal první významnou celebritou, která zemřela na AIDS" },
  { year: 1985, month: 11, text: "Reagan a Gorbačov se poprvé setkali v Ženevě" },

  // ── 1986 ──────────────────────────────────────────────
  { year: 1986, month: 1, text: "raketoplán Challenger vybuchl 73 sekund po startu" },
  { year: 1986, month: 2, text: "Olof Palme byl zastřelen v ulici ve Stockholmu; revoluce moci lidu svrhla na Filipínách Marcose" },
  { year: 1986, month: 4, text: "šestadvacátého vybuchl jaderný reaktor v Černobylu" },

  // ── 1987 ──────────────────────────────────────────────
  { year: 1987, month: 6, text: "Reagan u Braniborské brány žádal: „Pane Gorbačove, strhněte tu zeď“" },
  { year: 1987, month: 10, text: "černé pondělí — největší jednodenní propad akciových trhů v procentuálním vyjádření" },
  { year: 1987, month: 12, text: "Reagan a Gorbačov podepsali ve Washingtonu smlouvu INF" },

  // ── 1988 ──────────────────────────────────────────────
  { year: 1988, month: 7, text: "USS Vincennes sestřelil let Iran Air 655" },
  { year: 1988, month: 12, text: "let Pan Am 103 byl vyhozen do povětří nad skotským Lockerbie" },

  // ── 1989 ──────────────────────────────────────────────
  { year: 1989, month: 3, text: "tanker Exxon Valdez najel na mělčinu u Aljašky" },
  { year: 1989, month: 4, text: "katastrofa na stadionu Hillsborough zabila 97 fanoušků Liverpoolu" },
  { year: 1989, month: 6, text: "masakr na náměstí Nebeského klidu rozdrtil čínské prodemokratické hnutí; Solidarita vyhrála polské volby" },
  { year: 1989, month: 11, text: "devátého padla berlínská zeď; sedmnáctého začala v Praze sametová revoluce" },
  { year: 1989, month: 12, text: "v Rumunsku byl popraven Ceaușescu; Havel byl zvolen prezidentem Československa" },

  // ── 1990 ──────────────────────────────────────────────
  { year: 1990, month: 2, text: "Nelson Mandela vyšel po 27 letech na svobodu z vězení" },
  { year: 1990, month: 8, text: "Irák napadl Kuvajt — začala cesta k válce v Zálivu" },
  { year: 1990, month: 10, text: "o půlnoci třetího bylo Německo znovusjednoceno" },

  // ── 1991 ──────────────────────────────────────────────
  { year: 1991, month: 1, text: "válka v Zálivu začala operací Pouštní bouře" },
  { year: 1991, month: 4, text: "Varšavská smlouva byla formálně rozpuštěna" },
  { year: 1991, month: 6, text: "Slovinsko a Chorvatsko vyhlásily nezávislost na Jugoslávii" },
  { year: 1991, month: 8, text: "tvrdolinkový převrat proti Gorbačovovi v Moskvě selhal" },
  { year: 1991, month: 12, text: "Sovětský svaz se rozpadl na první svátek vánoční" },

  // ── 1992 ──────────────────────────────────────────────
  { year: 1992, month: 4, text: "válka v Bosně začala obléháním Sarajeva; v Los Angeles vypukly nepokoje po verdiktu v případu Rodneyho Kinga" },

  // ── 1993 ──────────────────────────────────────────────
  { year: 1993, month: 1, text: "Československo se rozdělilo na Českou republiku a Slovensko — sametový rozvod" },
  { year: 1993, month: 2, text: "první bombový útok na Světové obchodní centrum zabil v New Yorku šest lidí" },
  { year: 1993, month: 4, text: "obležení ve Waco skončilo 76 mrtvými v sídle Davidiánské sekty" },
  { year: 1993, month: 9, text: "dohody z Osla byly podepsány na trávníku před Bílým domem" },

  // ── 1994 ──────────────────────────────────────────────
  { year: 1994, month: 4, text: "začala genocida ve Rwandě — 800 000 mrtvých za 100 dní" },
  { year: 1994, month: 5, text: "Mandela složil přísahu jako jihoafrický prezident; otevřel se tunel pod Lamanšským průlivem" },
  { year: 1994, month: 6, text: "O. J. Simpson vedl policii na pomalé honičce ve voze Bronco" },

  // ── 1995 ──────────────────────────────────────────────
  { year: 1995, month: 1, text: "zemětřesení v Kóbe zabilo v Japonsku 6 400 lidí" },
  { year: 1995, month: 3, text: "sekta Óm šinrikjó vypustila v tokijském metru sarin" },
  { year: 1995, month: 4, text: "bombový útok v Oklahoma City zabil 168 lidí" },
  { year: 1995, month: 7, text: "masakr ve Srebrenici zabil přes 8 000 bosňáckých mužů a chlapců" },
  { year: 1995, month: 8, text: "Windows 95 byly uvedeny s písní „Start Me Up“ od The Rolling Stones" },
  { year: 1995, month: 11, text: "Jicchak Rabin byl zavražděn v Tel Avivu" },

  // ── 1996 ──────────────────────────────────────────────
  { year: 1996, month: 4, text: "Unabomber Ted Kaczynski byl zatčen ve své chatě v Montaně" },
  { year: 1996, month: 7, text: "byla naklonována ovce Dolly (oznámeno 1997)" },

  // ── 1997 ──────────────────────────────────────────────
  { year: 1997, month: 7, text: "Británie vrátila Hongkong Číně" },
  { year: 1997, month: 8, text: "princezna Diana zahynula při autonehodě v Paříži; o pár dní později zemřela Matka Tereza" },

  // ── 1998 ──────────────────────────────────────────────
  { year: 1998, month: 8, text: "al-Káida bombami zaútočila na americká velvyslanectví v Keni a Tanzanii" },
  { year: 1998, month: 12, text: "Sněmovna reprezentantů zahájila proti prezidentu Clintonovi ústavní žalobu" },

  // ── 1999 ──────────────────────────────────────────────
  { year: 1999, month: 1, text: "euro bylo zavedeno pro bezhotovostní transakce" },
  { year: 1999, month: 3, text: "NATO začalo kvůli Kosovu bombardovat Jugoslávii" },
  { year: 1999, month: 4, text: "střelba na střední škole Columbine v Coloradu zabila 13 lidí" },
  { year: 1999, month: 8, text: "úplné zatmění Slunce zahalilo Evropu naposledy ve 20. století" },

  // ── 2000 ──────────────────────────────────────────────
  { year: 2000, month: 11, text: "americké prezidentské volby se rozhodly na Floridě; Nejvyšší soud je nakonec rozhodl ve prospěch Bushe" },

  // ── 2001 ──────────────────────────────────────────────
  { year: 2001, month: 1, text: "byla spuštěna Wikipedie" },
  { year: 2001, month: 9, text: "jedenáctého zaútočili únosci z al-Káidy na Světové obchodní centrum a Pentagon" },
  { year: 2001, month: 10, text: "začala invaze do Afghánistánu vedená Spojenými státy" },
  { year: 2001, month: 11, text: "Apple uvedlo první iPod" },

  // ── 2002 ──────────────────────────────────────────────
  { year: 2002, month: 1, text: "eurové mince a bankovky vstoupily do běžného oběhu ve 12 zemích" },

  // ── 2003 ──────────────────────────────────────────────
  { year: 2003, month: 2, text: "raketoplán Columbia se rozpadl při návratu do atmosféry" },
  { year: 2003, month: 3, text: "začala invaze do Iráku vedená Spojenými státy" },

  // ── 2004 ──────────────────────────────────────────────
  { year: 2004, month: 2, text: "Facebook byl spuštěn z harvardské koleje" },
  { year: 2004, month: 3, text: "bombové útoky na vlaky v Madridu zabily 193 lidí" },
  { year: 2004, month: 5, text: "do EU vstoupilo deset nových států včetně České republiky" },
  { year: 2004, month: 12, text: "tsunami v Indickém oceánu zabilo ve 14 zemích přes 230 000 lidí" },

  // ── 2005 ──────────────────────────────────────────────
  { year: 2005, month: 4, text: "zemřel papež Jan Pavel II.; byl zvolen Benedikt XVI." },
  { year: 2005, month: 7, text: "bombové útoky na londýnskou dopravu zabily 52 lidí" },
  { year: 2005, month: 8, text: "hurikán Katrina zatopil New Orleans" },

  // ── 2006 ──────────────────────────────────────────────
  { year: 2006, month: 3, text: "byl spuštěn Twitter" },

  // ── 2007 ──────────────────────────────────────────────
  { year: 2007, month: 1, text: "Steve Jobs představil iPhone" },
  { year: 2007, month: 4, text: "střelba na Virginia Tech zabila 32 lidí" },

  // ── 2008 ──────────────────────────────────────────────
  { year: 2008, month: 8, text: "olympiáda v Pekingu byla zahájena 8. 8. 2008" },
  { year: 2008, month: 9, text: "padla banka Lehman Brothers a propukla globální finanční krize" },
  { year: 2008, month: 11, text: "Barack Obama byl zvolen prvním černošským prezidentem USA" },

  // ── 2009 ──────────────────────────────────────────────
  { year: 2009, month: 6, text: "Michael Jackson zemřel v Los Angeles na předávkování propofolem" },

  // ── 2010 ──────────────────────────────────────────────
  { year: 2010, month: 1, text: "zemětřesení na Haiti zabilo odhadem přes 220 000 lidí" },
  { year: 2010, month: 4, text: "v Mexickém zálivu explodovala ropná plošina Deepwater Horizon" },
  { year: 2010, month: 10, text: "33 chilských horníků bylo po 69 dnech zachráněno z hloubky 700 metrů" },
  { year: 2010, month: 12, text: "sebeupálení tuniského pouličního prodavače rozpoutalo arabské jaro" },

  // ── 2011 ──────────────────────────────────────────────
  { year: 2011, month: 1, text: "povstání na egyptském náměstí Tahrír svrhlo Mubaraka" },
  { year: 2011, month: 3, text: "zemětřesení a tsunami způsobily roztavení jaderného reaktoru ve Fukušimě" },
  { year: 2011, month: 5, text: "příslušníci jednotky Navy SEALs zabili v Pákistánu Usámu bin Ládina" },
  { year: 2011, month: 7, text: "Anders Breivik zabil v Norsku 77 lidí, převážně teenagery na ostrově Utøya" },
  { year: 2011, month: 10, text: "Steve Jobs zemřel v Palo Altu na rakovinu slinivky" },

  // ── 2012 ──────────────────────────────────────────────
  { year: 2012, month: 7, text: "byla zahájena olympiáda v Londýně" },
  { year: 2012, month: 10, text: "hurikán Sandy zaplavil New York a New Jersey" },
  { year: 2012, month: 12, text: "střelba na škole v Sandy Hook zabila 26 lidí, převážně prvňáčků" },

  // ── 2013 ──────────────────────────────────────────────
  { year: 2013, month: 3, text: "Jorge Bergoglio se stal papežem Františkem — prvním jezuitou a prvním papežem z Ameriky" },
  { year: 2013, month: 4, text: "na Bostonský maraton byl spáchán bombový útok" },
  { year: 2013, month: 6, text: "Edward Snowden začal z Hongkongu zveřejňovat dokumenty o sledování NSA" },
  { year: 2013, month: 12, text: "Nelson Mandela zemřel ve věku 95 let" },

  // ── 2014 ──────────────────────────────────────────────
  { year: 2014, month: 2, text: "revoluce na kyjevském Majdanu svrhla ukrajinskou vládu" },
  { year: 2014, month: 3, text: "Rusko anektovalo Krym; let Malaysia Airlines MH370 zmizel nad Indickým oceánem" },
  { year: 2014, month: 7, text: "let Malaysia Airlines MH17 byl sestřelen nad východní Ukrajinou" },
  { year: 2014, month: 8, text: "Robin Williams spáchal sebevraždu; virálně se rozšířila výzva ALS Ice Bucket Challenge" },

  // ── 2015 ──────────────────────────────────────────────
  { year: 2015, month: 1, text: "útok na pařížskou redakci Charlie Hebdo zabil 12 lidí" },
  { year: 2015, month: 4, text: "zemětřesení v Nepálu zabilo téměř 9 000 lidí" },
  { year: 2015, month: 11, text: "koordinované útoky v Paříži zabily 130 lidí, z toho 90 v klubu Bataclan" },
  { year: 2015, month: 12, text: "byla podepsána Pařížská dohoda o změně klimatu" },

  // ── 2016 ──────────────────────────────────────────────
  { year: 2016, month: 1, text: "David Bowie zemřel dva dny po vydání alba Blackstar" },
  { year: 2016, month: 4, text: "Prince byl nalezen mrtev v sídle Paisley Park" },
  { year: 2016, month: 6, text: "Británie těsně odhlasovala vystoupení z Evropské unie" },
  { year: 2016, month: 11, text: "Donald Trump vyhrál americké prezidentské volby" },

  // ── 2017 ──────────────────────────────────────────────
  { year: 2017, month: 5, text: "ransomware WannaCry ochromil nemocnice a továrny po celém světě" },
  { year: 2017, month: 8, text: "velké americké zatmění přešlo přes kontinentální USA" },
  { year: 2017, month: 10, text: "odhalení Harveyho Weinsteina odstartovalo hnutí #MeToo" },

  // ── 2018 ──────────────────────────────────────────────
  { year: 2018, month: 3, text: "Stephen Hawking zemřel ve věku 76 let na Den čísla pí" },
  { year: 2018, month: 5, text: "princ Harry se ve Windsoru oženil s Meghan Markleovou" },

  // ── 2019 ──────────────────────────────────────────────
  { year: 2019, month: 4, text: "věž katedrály Notre-Dame v Paříži se zřítila při požáru" },
  { year: 2019, month: 4, text: "byla zveřejněna první fotografie černé díry" },
  { year: 2019, month: 12, text: "WHO byl nahlášen shluk případů zápalu plic v čínském Wu-chanu" },

  // ── 2020 ──────────────────────────────────────────────
  { year: 2020, month: 1, text: "Kobe Bryant zahynul se svou dcerou při havárii vrtulníku v Kalifornii" },
  { year: 2020, month: 3, text: "WHO prohlásila covid-19 za pandemii; svět se uzavřel" },
  { year: 2020, month: 5, text: "George Floyd byl zabit policistou v Minneapolis; následovaly celosvětové protesty" },
  { year: 2020, month: 11, text: "Joe Biden porazil Donalda Trumpa v amerických prezidentských volbách" },
  { year: 2020, month: 12, text: "při velké konjunkci se Jupiter a Saturn přiblížily na 0,1° od sebe" },

  // ── 2021 ──────────────────────────────────────────────
  { year: 2021, month: 1, text: "6. ledna vtrhl dav do amerického Kapitolu ve snaze zvrátit výsledek voleb" },
  { year: 2021, month: 8, text: "Tálibán znovu dobyl Kábul, když USA ukončily svou dvacetiletou válku v Afghánistánu" },

  // ── 2022 ──────────────────────────────────────────────
  { year: 2022, month: 2, text: "Rusko zahájilo dvacátého čtvrtého plnohodnotnou invazi na Ukrajinu" },
  { year: 2022, month: 9, text: "královna Alžběta II. zemřela v Balmoralu po 70 letech na trůnu" },
  { year: 2022, month: 11, text: "OpenAI zpřístupnilo veřejnosti ChatGPT" },

  // ── 2023 ──────────────────────────────────────────────
  { year: 2023, month: 2, text: "zemětřesení o síle 7,8 zabilo v Turecku a Sýrii přes 60 000 lidí" },
  { year: 2023, month: 10, text: "Hamás zaútočil na Izrael, zabil 1 200 lidí a 250 vzal jako rukojmí" },

  // ── 2024 ──────────────────────────────────────────────
  { year: 2024, month: 4, text: "úplné zatmění Slunce přešlo přes Mexiko, USA a východní Kanadu" },
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
