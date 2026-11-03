# NORRUT!

Spelbart webbspelsutkast i TypeScript och Phaser 3. Starta på Östbergs parkering i Avesta och flyg norrut, samla skrotmynt och uppgradera farkosten.

## Spela och utveckla

Installera Node.js 24 med npm. Kör `npm ci` och `npm run dev`. För produktion: `npm run build`. `dist/` kan publiceras hos en statisk webbvärd. `npm test` kör 28 tester för fysik, ekonomi, sparformat och tangentinställningar.

Pilar eller WASD styr: vänster/A sänker nosen, höger/D höjer nosen, upp/W driver motorn och ned/S eller mellanslag ger boost. Öppna Tangentinställningar för att ändra tangenter. Mobilen har hållknappar.

## Funktioner

- Enkel flygfysik med gravitation, luftmotstånd, lyft, bränsle och boostreserv.
- Landning/krasch, skrotmynt, tolv komponentuppgraderingar och fem engångsboosters.
- Versionsmärkt lokal sparning, parallax och schematiska Avesta-landmärken.
- Förberedd Supabase-klient för användarnamn, e-post/lösenord, återställning och kontobunden molnsparning med revisionskontroll.

**Supabase är inte aktiverat i denna leverans.** `public/account-config.json` saknar projektvärden. Gästläget fungerar med lokal sparning; kontodialogen visar tydligt att konton ännu inte är aktiverade. Databasreglerna och de riktiga auth-flödena behöver verifieras mot det valda projektet innan aktivering. Lösenord hanteras av Supabase och lagras aldrig i spelets sparfiler.

## Publicera

Se [GITHUB.md](GITHUB.md). Arbetsflödet `.github/workflows/pages.yml` bygger och publicerar från `main` när GitHub Pages är aktiverat med GitHub Actions som källa. Publicering via ett repo kräver inte en egen spelserver; Supabase står för konton och molnsparning när det är konfigurerat.

## Struktur

`src/model.ts` innehåller fysik och ekonomi, `main.ts` spelgränssnitt, `journey.ts` Phaser-scen, `animation.ts` rörelser och `shell.ts` skärm- och menysystem, `hotkeys.ts` tangentinställningar, `storage.ts` lokal lagring och `accounts.ts` den förberedda kontoklienten. `supabase/001_accounts.sql` är ett ännu inte tillämpat schemaförslag. `contracts.ts` beskriver framtida gränssnitt för progression, rundverifiering och sociala funktioner.

Landmärkenas ordning och avstånd är spelplatshållare, inte verklig nordlig geografi. Version 0.3 använder målade bildlager och separata animerade delar utifrån användarens uppladdade referensbild. Se ART-DIRECTION.md för ursprung och prompter. Spelet fyller skärmen och menyer öppnas inne i spelet. Alla tolv sabotageeffekter och lokala kompisprofiler är spelbara. Vänner mellan enheter, forskning, prestige, chatt, rum, globala topplistor och adminvy är inte implementerade. Se CHANGELOG.md för regler, ekonomi och begränsningar. Klientens ekonomi är inte fuskresistent.



## Version 0.4 – produkter och forskning

Butik, Skrotupplag, Verkstad, Montering och Forskningslabbet ligger i spelmenyn.
Katalogen har 105 produkter: 15 steg i motorer, vingar, tankar, tillfälliga boosters, flygkroppar, stjärtfenor och fronter. Butiken säljer Bra. En del kan köpas högst ett steg över monterad del i samma kategori. Köp monterar delen direkt; befintliga delar sparas i hangaren.

Butiksdelar har 10 betalda uppgraderingar efter grundnivån. Steg 1–10 kostar 10–100 % av produktens inköpspris. Summan är 550 %. Första motorn kostar 100 och nästa 750; senare steg följer en avtagande priskurva. Senare uppgraderingsbudget begränsas till 90 % av prisgapet till nästa produkt, och en fullt uppgraderad Bra är strax under nästa omodifierade Bra. Tidigare uppgraderingar flyttas till kompatibla ägda delar utan att mynt eller rekord nollställs.

Skrot använder Supabase och kräver konto. Lagret skapas per serverbestämd halvtimme med en unik instans av varje produkt. Skick och modifiering slumpas en gång för hela lagret. Köp låser både sparfil och lagerpost i en transaktion. Andra öppna skrotmenyer uppdateras var femte sekund. Lagret byts vid hel och halv timme. Inga köp sker automatiskt.

Sökning kostar 5 + 1,8 % av motsvarande motorstegs pris (avrundat). 35 % inget, 35 % småpengar (30–85 % av avgiften), 20 % en del i kategorin och 10 % en bättre variant. Högst ett steg över monterad del. Trasig har 70 % chans; sannolikheten minskar geometriskt med faktorn 0,3 för varje bättre skick. Legendarisk inkluderar återstående svans. Hobbymodifiering minskar vikt med 10 % och styrhastighet med 20 % per monterad del. Övertrimmade delar har 20 % högre prestanda och ökar bränsleförbrukningen med 20 %. V8 är särskilt tung och bränsletörstig.

22 forskningsprojekt: tre steg per delkategori samt gemensam systemintegration. Sista grenstegen kräver också föregående steg i en annan gren. Ett aktivt projekt åt gången, och endast nya meter efter projektstart räknas. Provflygning ger ingen forskningsprogression. Monterade delar ger ändrad form, storlek, färg eller komponenter på farkosten; propeller byts mot kon vid jetmotor.

Tillfälliga monterade boosters förbrukas vid start och finns kvar i flygningens låsta utrustning. De äldre fem engångsboosters och sabotagen finns kvar. Molnsparningar skyddas mot oavsiktlig överskrivning från annan enhet genom revisionsnummer. Spelet är fortfarande en prototyp: flygresultat och delar i sparfilen är klientberäknade, inte ett serververifierat tävlingssystem. Premiumvalutan kan hittas men har ännu ingen butik. Ingen betalningsfunktion finns.

### Databas

`supabase/001_accounts.sql` och `002_scrap.sql` motsvarar grundschemat, applicerat i anslutet Supabase-projekt via migrationsverktyget. Publika klienten använder bara projekt-URL och publicerbar nyckel i `public/account-config.json`. Ingen servernyckel ska läggas där. All direkt skrivning till spelartabeller och skrotlager är spärrad; avgränsade funktioner sköter sparning och skrotköp. RLS skyddar personliga sparfiler. E-post finns endast i Supabase Auth; lösenord lagras av Auth som hash.

Supabase-kontrollpanelen behöver ha Confirm email avstängt för direkt inloggning, Site URL satt till https://limpaaan.github.io/NORRUT/ och samma adress godkänd som återställningsadress. Återställningsmail beror på Supabase e-posttjänsts leverans och begränsningar.

## Version 0.5 – dykning, instrument och färd mot nästa stad

Detta avsnitt ersätter äldre uppgifter om antal kategorier och flygtid. Nu finns 120 produkter i åtta kategorier, 25 forskningsnoder och högst tio minuters flygtid.

- Snabbare fall och starttempo, större nosvinkelområde (cirka ±85°), snabbare styrning, tydligare negativt lyft i dykning och mindre onödig fartförlust. Mjuk upptagning kan bevara dykfarten medan höjd förbrukas. Kraftig eller fel tajmad upptagning kan fortfarande ge stall.
- Instrumentpanel kostar från 35 skrotmynt. Första köpet visar analoga fart- och höjdmätare. Varannan verkstadsuppgradering låser ytterligare instrumentsteg. Fler steg visar stig/sjunk, nosvinkel, anfallsvinkel/stall, vindpåverkan och luftmotstånd. Vid effektivt instrumentsteg 7 blir panelen digital; senare följer tid, energi, glidtal och fler mätvärden. Innan panelen köps visas sträcka och rutt, men inga kostnadsfria fart-/höjdmätare. Vanliga butiksuppgraderingar och nya instrumentprodukter använder samma ekonomi som övriga delar.
- Startplatsen, Verket, Dalahästen, Hedemora, Säter, Borlänge och Falun har separata miljöer. Mellan dem ligger skog och odlingslandskap. Stadsmiljöer korsfadas en gång och loopas inte som ett upprepat Avesta. Atlasens rutor och prompt finns i ROUTE-ART.md. Bilden är skapad med inbyggd bildgenerering.
- Sträckstapeln högst upp visar flugna meter, nästa större milstolpe och återstående avstånd. Hedemora 24 km, Säter 45 km, Borlänge 72 km, Falun 96 km. Det är spelvärldens ungefärliga ruttavstånd. Ett kontrollerat steg-9-prov når cirka 21 km utan bränslebooster och 24 km med den; tidig utrustning når inte automatiskt alla städer.
- Topplistan visar registrerade konton och anslutna gäster globalt. Vänner visar själv och accepterade vänner. Vänförfrågningar skickas till användarnamn och kan accepteras, avböjas eller återkallas. E-post och lösenord visas aldrig publikt. Gästprogression sparas lokalt men anonymt ID och rekord registreras online. Den är fortfarande en prototyptopplista med klientberäknade flygresultat, inte ett system med verifierade repriser.

Databaskatalogen finns i 003_catalog.sql och topplistan i 004_leaderboard.sql. Dessa och uppdaterade skrotfunktioner är applicerade i det anslutna projektet. Alla 40 tester passerar, inklusive dyk/upptagning, milstolpestapel, skilda stadsmiljöer, instrumentsteg och bränsleplanering mot Hedemora. Se HANDOFF.md för fortsättning på en annan dator.


## Version 0.6
Se CHANGELOG.md, COMPONENT-ART.md, ENVIRONMENT-ART.md och PRODUCT-CATALOG.md. Separata flikar för inloggning och registrering; gästknapp alltid tillgänglig. Nya kontolösenord minst sex tecken. Google-inloggning uppskjuten. Administration serverkontrollerad, gäständringar köas till återanslutning. Befintliga saldon nollställs aldrig automatiskt vid ekonomibalansering.
