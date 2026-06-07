// Škola, práce a studium podle země a desetiletí.
// Čísla jsou doložené historické odhady ze standardních referenčních
// zdrojů (statistické ročenky UNESCO, historické řady OECD,
// archivy národních ministerstev, tabulky dosaženého vzdělání US Census,
// sovětský Goskomstat, historické řady španělského INE o vzdělávání,
// československé statistické ročenky, StatCan, INEGI Mexiko).
// Berte je spíše jako řádové odhady než jako přesná čísla.

import type { Country } from "./countryDecades";

export type EducationSnapshot = {
  country: Exclude<Country, "INTL">;
  decadeStart: number;
  compulsoryEnd: number;            // Věk, kdy končila povinná školní docházka
  avgYearsSchooling: number;        // Průměrný počet dokončených let vzdělání u dospělých
  highSchoolGradPct: number;        // Podíl ročníku, který dokončil vyšší střední vzdělání
  universityPct: number;            // Podíl dospělých s vysokoškolským titulem
  literacyPct: number;              // Míra gramotnosti dospělých
  commonJobs: string[];             // 3-5 nejčastějších povolání
  subjects: string[];               // Typické školní předměty
  classroom: string;                // Jednovětá atmosféra školního života
  workNote?: string;                // Jednovětá atmosféra pracovního života
};

export const EDUCATION: EducationSnapshot[] = [
  // ─────────────────────── Czechoslovakia ───────────────────────
  {
    country: "CZ", decadeStart: 1920,
    compulsoryEnd: 14, avgYearsSchooling: 5.5, highSchoolGradPct: 7,
    universityPct: 1, literacyPct: 96,
    commonJobs: ["zemědělec", "tovární dělník", "horník", "prodavač", "služka v domácnosti"],
    subjects: ["český (nebo německý) jazyk", "matematika", "náboženství", "krasopis", "zeměpis", "dějepis", "přírodopis", "zpěv"],
    classroom: "Jednotřídní vesnické školy držely děti od 6 do 14 let na stejných dřevěných lavicích; na učitelově katedru ležela rákoska.",
    workNote: "Asi 40 % Čechoslováků stále obdělávalo půdu; novou ambicí byla „továrová města“ v baťovském stylu.",
  },
  {
    country: "CZ", decadeStart: 1930,
    compulsoryEnd: 14, avgYearsSchooling: 6.5, highSchoolGradPct: 9,
    universityPct: 1.5, literacyPct: 97,
    commonJobs: ["zemědělec", "průmyslový dělník", "horník", "úředník", "švec"],
    subjects: ["čeština", "občanská nauka", "matematika", "náboženství", "dějepis", "zeměpis", "přírodní vědy", "tělesná výchova"],
    classroom: "Do osnov byla zařazena občanská nauka, aby vyučovala hodnoty první republiky; některé sudetoněmecké školy odmítaly používat československé učebnice.",
  },
  {
    country: "CZ", decadeStart: 1940,
    compulsoryEnd: 14, avgYearsSchooling: 6, highSchoolGradPct: 8,
    universityPct: 1.5, literacyPct: 96,
    commonJobs: ["zemědělec", "tovární dělník", "horník", "voják", "úředník"],
    subjects: ["němčina (povinně)", "čeština", "dějiny říše", "rasová nauka", "matematika", "náboženství"],
    classroom: "Vysoké školy nacisté zavřeli 17. listopadu 1939 a zůstaly zavřené šest let; mnoho učitelů bylo posláno do koncentračních táborů.",
    workNote: "Za protektorátu nahradila desítkám tisíc lidí běžné zaměstnání nucená práce.",
  },
  {
    country: "CZ", decadeStart: 1950,
    compulsoryEnd: 14, avgYearsSchooling: 7.5, highSchoolGradPct: 22,
    universityPct: 3, literacyPct: 98,
    commonJobs: ["průmyslový dělník", "družstevní zemědělec (JZD)", "horník", "stavební dělník", "učitel"],
    subjects: ["čeština", "ruština (povinná od roku 1948)", "matematika", "marxismus-leninismus", "dějepis (sovětská verze)", "biologie", "fyzika", "tělesná výchova"],
    classroom: "Ruština nahradila němčinu jako povinný druhý jazyk; ve třídách visely až do roku 1956 vedle sebe portréty Stalina a Gottwalda.",
    workNote: "Násilná kolektivizace přesunula stovky tisíc rolníků do státních zemědělských družstev.",
  },
  {
    country: "CZ", decadeStart: 1960,
    compulsoryEnd: 15, avgYearsSchooling: 9, highSchoolGradPct: 35,
    universityPct: 6, literacyPct: 99,
    commonJobs: ["tovární dělník", "inženýr", "učitel", "kancelářský úředník", "zemědělský dělník"],
    subjects: ["čeština", "ruština", "jeden západní jazyk", "matematika", "fyzika", "chemie", "biologie", "občanská výchova"],
    classroom: "Reforma z roku 1960 zavedla „základní devítiletou školu“ — devítiletou povinnou docházku — a nahradila tak staré rozdělení čtyři plus pět.",
    workNote: "Za socialismu přesáhla zaměstnanost žen 80 %; jesle a školky zajišťoval stát.",
  },
  {
    country: "CZ", decadeStart: 1970,
    compulsoryEnd: 16, avgYearsSchooling: 10.5, highSchoolGradPct: 55,
    universityPct: 10, literacyPct: 99,
    commonJobs: ["průmyslový dělník", "inženýr", "učitel", "zdravotní sestra", "státní úředník"],
    subjects: ["čeština", "ruština", "angličtina nebo němčina", "matematika", "fyzika", "chemie", "polytechnická výchova", "občanská nauka"],
    classroom: "Červené pionýrské šátky byly na základních školách téměř všudypřítomné; gymnaziální větev vedla na vysokou školu, učňák k řemeslu.",
    workNote: "Na konci desetiletí tvořila průmyslová práce asi 45 % československých pracovních míst.",
  },

  // ─────────────────────────── Spain ────────────────────────────
  {
    country: "ES", decadeStart: 1920,
    compulsoryEnd: 12, avgYearsSchooling: 3, highSchoolGradPct: 3,
    universityPct: 1, literacyPct: 55,
    commonJobs: ["zemědělec / zemědělský dělník", "služka v domácnosti", "nádeník (jornalero)", "rybář", "horník"],
    subjects: ["katolická nauka", "kastilské čtení a psaní", "počty", "zeměpis", "dějepis", "hygiena"],
    classroom: "Chlapci a dívky se učili v oddělených třídách; mnoho venkovských vesnic nemělo školu vůbec a farář učil, co dovedl.",
    workNote: "Asi 60 % aktivního obyvatelstva stále obdělávalo půdu; latifundia na jihu udržovala velkou jeho část bez půdy.",
  },
  {
    country: "ES", decadeStart: 1930,
    compulsoryEnd: 14, avgYearsSchooling: 4, highSchoolGradPct: 5,
    universityPct: 1.5, literacyPct: 67,
    commonJobs: ["zemědělec", "služka v domácnosti", "tovární dělník", "drobný obchodník", "horník"],
    subjects: ["kastilština", "počty", "zeměpis", "dějepis", "hygiena", "kreslení (a nově: občanská výchova)"],
    classroom: "Druhá republika zahájila „pedagogickou misi“, která za pět let otevřela 7 000 škol a vyškolila tisíce nových učitelů — mnozí z nich zahynuli v občanské válce.",
  },
  {
    country: "ES", decadeStart: 1940,
    compulsoryEnd: 14, avgYearsSchooling: 4, highSchoolGradPct: 6,
    universityPct: 2, literacyPct: 75,
    commonJobs: ["zemědělec", "služka v domácnosti", "tovární dělník", "stavební dělník", "státní úředník"],
    subjects: ["katolická nauka (povinná)", "Formación del Espíritu Nacional", "kastilština", "počty", "španělské dějiny (nacionalistická verze)", "latina (chlapci)", "nauka o domácnosti (dívky)"],
    classroom: "Republikánští učitelé byli vyhnáni z úřadů; katolická církev znovu získala kontrolu nad velkou částí základního školství; školní den začínal písní „Cara al Sol“.",
    workNote: "„Léta hladu“ udržovala většinu Španělů v existenční dřině; potravinové lístky platily až do roku 1952.",
  },
  {
    country: "ES", decadeStart: 1950,
    compulsoryEnd: 14, avgYearsSchooling: 5, highSchoolGradPct: 9,
    universityPct: 3, literacyPct: 85,
    commonJobs: ["zemědělec", "průmyslový dělník", "služka v domácnosti", "stavební dělník", "státní úředník"],
    subjects: ["katolická nauka", "FEN", "kastilština", "matematika", "dějepis", "latina", "nauka o domácnosti (dívky)"],
    classroom: "Školy byly rozděleny podle pohlaví; každodenní „patio“ zahrnovalo pozdrav nacionalistické vlajce a zpěv hymny Falangy.",
    workNote: "Mohutná migrace z venkova do měst — Madrid a Barcelona pohltily miliony lidí z Andalusie a Extremadury.",
  },
  {
    country: "ES", decadeStart: 1960,
    compulsoryEnd: 14, avgYearsSchooling: 6.5, highSchoolGradPct: 18,
    universityPct: 5, literacyPct: 93,
    commonJobs: ["průmyslový dělník", "pracovník ve službách", "stavební dělník", "zemědělec", "kancelářský úředník"],
    subjects: ["katolická nauka", "kastilština", "matematika", "přírodní vědy", "dějepis", "tělesná výchova", "nauka o domácnosti (dívky)"],
    classroom: "Turistika přinesla do soukromých a církevních škol vlnu hodin angličtiny; mnoho španělských dělníků se učilo německy kvůli odchodu za prací na sever.",
    workNote: "Španělský „hospodářský zázrak“ vytvořil miliony průmyslových míst a míst ve službách; zaměstnanost žen pomalu rostla.",
  },
  {
    country: "ES", decadeStart: 1970,
    compulsoryEnd: 14, avgYearsSchooling: 7.5, highSchoolGradPct: 30,
    universityPct: 7, literacyPct: 95,
    commonJobs: ["průmyslový dělník", "pracovník ve službách", "státní úředník", "prodavač", "stavební dělník"],
    subjects: ["kastilština (a od poloviny 70. let regionální jazyky)", "matematika", "přírodní vědy", "společenské vědy", "jazyky", "náboženství (od roku 1978 nepovinné)"],
    classroom: "Zákon Ley General de Educación z roku 1970 nahradil starou změť osmiletým základním stupněm EGB a poté středním stupněm BUP/COU — moderní španělský systém.",
    workNote: "Práce ve službách kolem roku 1972 poprvé předstihla zemědělství.",
  },

  // ─────────────────────── United States ────────────────────────
  {
    country: "US", decadeStart: 1920,
    compulsoryEnd: 16, avgYearsSchooling: 8.5, highSchoolGradPct: 17,
    universityPct: 4, literacyPct: 94,
    commonJobs: ["zemědělec", "tovární dělník", "prodejce", "služka v domácnosti", "úředník"],
    subjects: ["angličtina", "počty", "dějepis", "zeměpis", "občanská nauka", "nauka o domácnosti (dívky)", "dílny / zemědělství (chlapci)", "tělesná výchova"],
    classroom: "Jednotřídní školy byly mimo města stále běžné; na segregovaném Jihu byly oddělené školy pro černošské a bělošské děti zároveň legální i nerovné.",
    workNote: "Asi třetina Američanů stále pracovala na farmách; montážní linka se právě začínala šířit za hranice Detroitu.",
  },
  {
    country: "US", decadeStart: 1930,
    compulsoryEnd: 16, avgYearsSchooling: 9, highSchoolGradPct: 30,
    universityPct: 5, literacyPct: 96,
    commonJobs: ["tovární dělník", "zemědělec", "služka v domácnosti", "úředník", "prodejce"],
    subjects: ["angličtina", "počty", "dějepis", "občanská nauka", "základy přírodních věd", "tělesná výchova", "nauka o domácnosti / dílny"],
    classroom: "Z peněz WPA byly postaveny tisíce nových středních škol; velká hospodářská krize udržela teenagery ve škole, protože nebyla práce.",
    workNote: "Nezaměstnanost vyvrcholila v roce 1933 nad 24 %; CCC a WPA daly milionům mladých mužů jejich první placenou práci.",
  },
  {
    country: "US", decadeStart: 1940,
    compulsoryEnd: 16, avgYearsSchooling: 10, highSchoolGradPct: 51,
    universityPct: 7, literacyPct: 97,
    commonJobs: ["tovární dělník", "voják (počátek 40. let)", "úředník", "prodejce", "zemědělec"],
    subjects: ["angličtina", "matematika", "americké dějiny", "občanská nauka", "základy přírodních věd", "tělesná výchova", "nauka o domácnosti / dílny"],
    classroom: "Koncem 40. let zákon GI Bill umožnil studium na vysoké škole 2,2 milionu veteránů 2. světové války — největší jednorázové rozšíření vzdělání v dějinách USA.",
    workNote: "Za 2. světové války se do práce zapojilo šest milionů žen; mnoho z nich přišlo o místa kvůli vracejícím se veteránům, ale na trhu práce zůstaly.",
  },
  {
    country: "US", decadeStart: 1950,
    compulsoryEnd: 16, avgYearsSchooling: 10.5, highSchoolGradPct: 60,
    universityPct: 10, literacyPct: 98,
    commonJobs: ["tovární dělník", "úředník", "prodejce", "učitel", "pracovník ve službách"],
    subjects: ["angličtina", "matematika", "dějepis", "občanská nauka", "základy přírodních věd", "tělesná výchova", "nauka o domácnosti / dílny", "hudební výchova"],
    classroom: "Rozsudek Brown v. Board (1954) postavil školní segregaci mimo zákon; mnoho jižanských okresů proti němu bojovalo dvě desetiletí.",
    workNote: "Středostavovská rodina 50. let s jediným živitelem — matka doma, otec v kanceláři — byla pro mnohé realitou, ale pro stejně tolik lidí mýtem.",
  },
  {
    country: "US", decadeStart: 1960,
    compulsoryEnd: 16, avgYearsSchooling: 11, highSchoolGradPct: 73,
    universityPct: 15, literacyPct: 99,
    commonJobs: ["tovární dělník", "kancelářský pracovník", "prodejce", "učitel", "pracovník ve službách"],
    subjects: ["angličtina", "matematika („New Math“ od roku 1965)", "americké dějiny", "občanská nauka", "biologie", "chemie", "fyzika", "cizí jazyk", "tělesná výchova"],
    classroom: "Sputnik (1957) odstartoval tlak na přírodní vědy a matematiku; zákon Title VI (1964) konečně navázal federální prostředky na desegregaci.",
    workNote: "Kancelářská práce do konce desetiletí předstihla průmyslovou výrobu jako nejčastější kategorii zaměstnání.",
  },
  {
    country: "US", decadeStart: 1970,
    compulsoryEnd: 16, avgYearsSchooling: 12, highSchoolGradPct: 80,
    universityPct: 22, literacyPct: 99,
    commonJobs: ["kancelářský pracovník", "pracovník ve službách", "učitel", "zdravotní sestra", "tovární dělník"],
    subjects: ["angličtina", "matematika", "americké dějiny", "občanská nauka", "biologie", "vědy o Zemi", "cizí jazyk", "tělesná výchova", "výpočetní technika (konec 70. let)", "sexuální výchova"],
    classroom: "Svozy žáků autobusy kvůli desegregaci ovládaly školní zpravodajství 70. let; zákon Title IX (1972) otevřel školní sport dívkám.",
    workNote: "Recese po ropném šoku z roku 1973 ukončila dlouhý průmyslový rozmach; převahu převzala pracovní místa ve službách.",
  },

  // ────────────────── Ukrainian SSR / Ukraine ──────────────────
  {
    country: "UA", decadeStart: 1920,
    compulsoryEnd: 12, avgYearsSchooling: 3, highSchoolGradPct: 4,
    universityPct: 1, literacyPct: 70,
    commonJobs: ["rolník", "horník", "tovární dělník", "železničář", "vesnický učitel"],
    subjects: ["ukrajinský jazyk (v rámci korenizace)", "počty", "přírodopis", "marxismus-leninismus", "dějiny dělnického hnutí"],
    classroom: "Kampaň „likbez“ vysílala mladé dělníky učit ve vesnicích číst; gramotnost vzrostla z ~30 % v roce 1920 na ~85 % do roku 1939.",
    workNote: "NEP rolníkům na čas dovolil prodávat obilí na volném trhu — mnozí se stali drobnými obchodníky, než to kolektivizace smetla.",
  },
  {
    country: "UA", decadeStart: 1930,
    compulsoryEnd: 14, avgYearsSchooling: 4.5, highSchoolGradPct: 8,
    universityPct: 2, literacyPct: 85,
    commonJobs: ["dělník v kolchozu (kolchozník)", "horník", "tovární dělník", "železničář", "učitel"],
    subjects: ["ruština (stále více)", "ukrajinština (stále méně)", "marxismus-leninismus", "dějiny KSSS", "matematika", "biologie"],
    classroom: "Korenizace skončila kolem roku 1933; všude se prosazovala ruština a mnoho škol s ukrajinštinou bylo zavřeno.",
    workNote: "Násilná kolektivizace a hladomor (holodomor) vylidnily celé vesnice; přeživší se stali kolchozníky připoutanými k půdě.",
  },
  {
    country: "UA", decadeStart: 1940,
    compulsoryEnd: 14, avgYearsSchooling: 4, highSchoolGradPct: 6,
    universityPct: 2, literacyPct: 82,
    commonJobs: ["voják", "kolchozník", "horník", "tovární dělník", "stavební dělník na obnově"],
    subjects: ["ruština", "ukrajinština", "marxismus-leninismus", "matematika", "fyzika", "dějepis"],
    classroom: "Většina ukrajinských škol byla za 2. světové války zničena; v roce 1944 se děti učily ve sklepích, stodolách a pod širým nebem.",
    workNote: "Poválečnou obnovu poháněla nucená práce, včetně německých válečných zajatců.",
  },
  {
    country: "UA", decadeStart: 1950,
    compulsoryEnd: 16, avgYearsSchooling: 7, highSchoolGradPct: 30,
    universityPct: 5, literacyPct: 96,
    commonJobs: ["kolchozník", "tovární dělník", "horník", "inženýr", "učitel"],
    subjects: ["ruština (převažující)", "ukrajinština", "marxismus-leninismus", "dějiny KSSS", "matematika", "fyzika", "chemie", "tělesná příprava"],
    classroom: "Sovětská „desetiletá škola“ nahradila sedmiletou; politická výchova prostupovala každým předmětem.",
    workNote: "Donbas se stal jedním z největších průmyslových regionů SSSR; nejlépe placení byli horníci z uhelných dolů.",
  },
  {
    country: "UA", decadeStart: 1960,
    compulsoryEnd: 17, avgYearsSchooling: 9, highSchoolGradPct: 55,
    universityPct: 9, literacyPct: 98,
    commonJobs: ["tovární dělník", "inženýr", "kolchozník", "učitel", "horník"],
    subjects: ["ruština", "ukrajinština (na ústupu)", "matematika", "fyzika", "chemie", "biologie", "politická výchova", "tělesná příprava"],
    classroom: "Chruščovova reforma „polytechnické výchovy“ vyžadovala, aby všichni žáci vykonávali praktickou práci v továrnách nebo na polích.",
    workNote: "Brežněvova podoba „rozvinutého socialismu“ znamenala zaručenou práci na celý život — ale reálné mzdy přestaly koncem 60. let růst.",
  },
  {
    country: "UA", decadeStart: 1970,
    compulsoryEnd: 17, avgYearsSchooling: 10, highSchoolGradPct: 70,
    universityPct: 13, literacyPct: 99,
    commonJobs: ["tovární dělník", "inženýr", "kancelářský úředník", "učitel", "zdravotní sestra"],
    subjects: ["ruština (povinná)", "ukrajinština (pro některé nepovinná)", "matematika", "fyzika", "chemie", "biologie", "politická výchova", "civilní obrana"],
    classroom: "Rusifikace se prohloubila; většina městských škol s ukrajinštinou přešla na ruštinu, zatímco vesnice udržovaly jazyk při životě.",
    workNote: "Sovětská „druhá ekonomika“ (blat, melouchy, neoficiální výměny) byla v životě většiny dělníků stejně důležitá jako mzda.",
  },

  // ───────────────────────── Canada ────────────────────────────
  {
    country: "CA", decadeStart: 1920,
    compulsoryEnd: 14, avgYearsSchooling: 7, highSchoolGradPct: 10,
    universityPct: 2, literacyPct: 93,
    commonJobs: ["zemědělec", "nádeník", "služka v domácnosti", "dřevorubec / horník", "tovární dělník"],
    subjects: ["angličtina (nebo francouzština)", "počty", "zeměpis", "dějepis", "náboženství", "zemědělství", "nauka o domácnosti"],
    classroom: "Domorodé děti byly nuceně umisťovány do internátních škol — systému, který fungoval od 80. let 19. století až do 90. let 20. století.",
  },
  {
    country: "CA", decadeStart: 1930,
    compulsoryEnd: 14, avgYearsSchooling: 8, highSchoolGradPct: 25,
    universityPct: 3, literacyPct: 95,
    commonJobs: ["zemědělec", "nádeník", "služka v domácnosti", "tovární dělník", "úředník"],
    subjects: ["angličtina/francouzština", "počty", "zeměpis", "kanadské dějiny", "náboženství", "občanská nauka", "nauka o domácnosti"],
    classroom: "Vesnice v Saskatchewanu a Manitobě stavěly jednotřídní prériové školy; učitelkami byly často nově příchozí Britky nebo Skotky.",
  },
  {
    country: "CA", decadeStart: 1940,
    compulsoryEnd: 15, avgYearsSchooling: 9, highSchoolGradPct: 40,
    universityPct: 5, literacyPct: 96,
    commonJobs: ["voják", "tovární dělník", "kancelářský pracovník", "zemědělec", "dřevorubec"],
    subjects: ["angličtina/francouzština", "matematika", "dějepis", "zeměpis", "občanská nauka", "tělesná výchova", "náboženství (v mnoha provinciích)"],
    classroom: "Válka přivedla do školství tisíce žen; mnohé zůstaly i po jejím skončení.",
    workNote: "Zaměstnanost kanadských žen za války dosáhla do roku 1944 jedné ze tří.",
  },
  {
    country: "CA", decadeStart: 1950,
    compulsoryEnd: 16, avgYearsSchooling: 10, highSchoolGradPct: 55,
    universityPct: 7, literacyPct: 97,
    commonJobs: ["kancelářský pracovník", "tovární dělník", "zemědělec", "prodejce", "učitel"],
    subjects: ["angličtina/francouzština", "matematika", "dějepis", "zeměpis", "základy přírodních věd", "občanská nauka", "tělesná výchova"],
    classroom: "Kanadský poválečný baby boom dal vzniknout tisícům nových škol na předměstích; v mnoha okresech bylo ve třídách 35 až 40 žáků.",
  },
  {
    country: "CA", decadeStart: 1960,
    compulsoryEnd: 16, avgYearsSchooling: 11, highSchoolGradPct: 70,
    universityPct: 12, literacyPct: 98,
    commonJobs: ["kancelářský pracovník", "pracovník ve službách", "tovární dělník", "učitel", "prodejce"],
    subjects: ["angličtina (nebo francouzština)", "matematika", "kanadské dějiny", "občanská nauka", "přírodní vědy", "druhý jazyk", "tělesná výchova"],
    classroom: "Tichá revoluce v Québecu (1960–66) zesvětštila školský systém a učinila z něj odpovědnost provincie.",
  },
  {
    country: "CA", decadeStart: 1970,
    compulsoryEnd: 16, avgYearsSchooling: 12, highSchoolGradPct: 80,
    universityPct: 18, literacyPct: 99,
    commonJobs: ["kancelářský pracovník", "pracovník ve službách", "učitel", "zdravotní sestra", "tovární dělník"],
    subjects: ["angličtina / francouzská imerze", "matematika", "dějepis", "občanská nauka", "přírodní vědy", "druhý jazyk", "tělesná výchova", "informatika (konec 70. let)"],
    classroom: "Programy francouzské imerze se od roku 1965 šířily napříč anglicky mluvící Kanadou.",
    workNote: "Québecká Charta francouzského jazyka z roku 1976 přetvořila pracovní život v celé provincii.",
  },

  // ─────────────────────────── Mexico ──────────────────────────
  {
    country: "MX", decadeStart: 1920,
    compulsoryEnd: 12, avgYearsSchooling: 1.5, highSchoolGradPct: 2,
    universityPct: 0.5, literacyPct: 30,
    commonJobs: ["rolník (campesino)", "horník", "služka v domácnosti", "nádeník", "prodavač"],
    subjects: ["španělština", "počty", "zemědělství", "hygiena", "občanská nauka"],
    classroom: "Vasconcelosovo SEP (1921) vysílalo misijní učitele do vesnic, kde nebylo nic — jediná tabule, žádné učebnice, často ani školní budova.",
    workNote: "Asi 70 % Mexičanů stále obdělávalo půdu; revoluce právě skončila.",
  },
  {
    country: "MX", decadeStart: 1930,
    compulsoryEnd: 14, avgYearsSchooling: 2, highSchoolGradPct: 3,
    universityPct: 0.8, literacyPct: 40,
    commonJobs: ["campesino", "člen ejida", "horník", "tovární dělník", "služka v domácnosti"],
    subjects: ["španělština", "počty", "občanská nauka", "mexické dějiny", "zemědělství", "tělesná výchova"],
    classroom: "Cárdenasova reforma socialistické výchovy (1934) výslovně vyloučila náboženství a zdůrazňovala třídní boj a domorodou identitu.",
  },
  {
    country: "MX", decadeStart: 1940,
    compulsoryEnd: 14, avgYearsSchooling: 2.5, highSchoolGradPct: 4,
    universityPct: 1, literacyPct: 50,
    commonJobs: ["campesino", "tovární dělník", "stavební dělník", "služka v domácnosti", "prodavač"],
    subjects: ["španělština", "počty", "dějepis", "občanská nauka", "zeměpis", "náboženství (po roce 1946 znovu povolené)"],
    classroom: "Reformy Ávily Camacha obnovily náboženskou výuku a zmírnily „socialistické“ osnovy z 30. let.",
    workNote: "Válečné zakázky za 2. světové války odstartovaly „mexický zázrak“ — tři desetiletí průmyslového růstu.",
  },
  {
    country: "MX", decadeStart: 1950,
    compulsoryEnd: 14, avgYearsSchooling: 3.5, highSchoolGradPct: 8,
    universityPct: 2, literacyPct: 60,
    commonJobs: ["campesino", "tovární dělník", "stavební dělník", "pracovník ve službách", "státní úředník"],
    subjects: ["španělština", "matematika", "dějepis", "občanská nauka", "zeměpis", "přírodní vědy", "tělesná výchova"],
    classroom: "Mohutná výstavba základních škol dosáhla do konce desetiletí do většiny větších měst.",
  },
  {
    country: "MX", decadeStart: 1960,
    compulsoryEnd: 15, avgYearsSchooling: 4.5, highSchoolGradPct: 14,
    universityPct: 3.5, literacyPct: 70,
    commonJobs: ["tovární dělník", "campesino", "pracovník ve službách", "stavební dělník", "státní úředník"],
    subjects: ["španělština", "matematika", "mexické dějiny", "občanská nauka", "zeměpis", "přírodní vědy", "tělesná výchova", "domorodá studia (některé regiony)"],
    classroom: "Bezplatné jednotné učebnice (Libros de Texto Gratuitos) se v roce 1960 staly na základních školách všeobecnými.",
    workNote: "Migrace do měst vysávala venkov; Mexico City překročilo do roku 1960 5 milionů obyvatel.",
  },
  {
    country: "MX", decadeStart: 1970,
    compulsoryEnd: 15, avgYearsSchooling: 6, highSchoolGradPct: 25,
    universityPct: 6, literacyPct: 80,
    commonJobs: ["tovární dělník", "pracovník ve službách", "stavební dělník", "campesino", "kancelářský úředník"],
    subjects: ["španělština", "matematika", "mexické dějiny", "občanská nauka", "zeměpis", "přírodní vědy", "druhý jazyk", "tělesná výchova"],
    classroom: "CONACYT prezidenta Echeverríi (1970) a rozšíření vysokých škol poprvé přinesly vyšší vzdělání rodinám z dělnické třídy.",
    workNote: "Ropný rozmach po roce 1973 z Mexika nakrátko učinil rozvíjející se ekonomiku; dluhová krize z roku 1982 mnohé z toho zvrátila.",
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
