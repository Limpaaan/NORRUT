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

Butiksdelar har 10 betalda uppgraderingar efter grundnivån. Steg 1–10 kostar 10–100 % av produktens inköpspris. Summan är 550 %. Nästa produkt kostar 7 gånger tidigare pris, och en fullt uppgraderad Bra är strax under nästa omodifierade Bra. Tidigare uppgraderingar flyttas till kompatibla ägda delar utan att mynt eller rekord nollställs.

Skrot använder Supabase och kräver konto. Lagret skapas per serverbestämd halvtimme med en unik instans av varje produkt. Skick och modifiering slumpas en gång för hela lagret. Köp låser både sparfil och lagerpost i en transaktion. Andra öppna skrotmenyer uppdateras var femte sekund. Lagret byts vid hel och halv timme. Inga köp sker automatiskt.

Sökning kostar 10 skrotmynt i början och skalas med faktorn 7 per monterat steg efter det första. 75 % grundchans inget; 19 % mynt motsvarande 20–80 % av sökavgiften; 1 % en premiumvaluta; högst 5 % en del. Delchansen delas med högsta monterade steg inom kategorin plus ett. Resten ger inget. Trasig har 70 % chans; sannolikheten minskar geometriskt med faktorn 0,3 för varje bättre skick. Legendarisk inkluderar återstående svans. Hobbymodifiering minskar vikt med 10 % och styrhastighet med 20 % per monterad del. Övertrimmade delar har 20 % högre prestanda och ökar bränsleförbrukningen med 20 %. V8 är särskilt tung och bränsletörstig.

22 forskningsprojekt: tre steg per delkategori samt gemensam systemintegration. Sista grenstegen kräver också föregående steg i en annan gren. Ett aktivt projekt åt gången, och endast nya meter efter projektstart räknas. Provflygning ger ingen forskningsprogression. Monterade delar ger ändrad form, storlek, färg eller komponenter på farkosten; propeller byts mot kon vid jetmotor.

Tillfälliga monterade boosters förbrukas vid start och finns kvar i flygningens låsta utrustning. De äldre fem engångsboosters och sabotagen finns kvar. Molnsparningar skyddas mot oavsiktlig överskrivning från annan enhet genom revisionsnummer. Spelet är fortfarande en prototyp: flygresultat och delar i sparfilen är klientberäknade, inte ett serververifierat tävlingssystem. Premiumvalutan kan hittas men har ännu ingen butik. Ingen betalningsfunktion finns.

### Databas

`supabase/001_accounts.sql` och `002_scrap.sql` motsvarar grundschemat, applicerat i anslutet Supabase-projekt via migrationsverktyget. Publika klienten använder bara projekt-URL och publicerbar nyckel i `public/account-config.json`. Ingen servernyckel ska läggas där. All direkt skrivning till spelartabeller och skrotlager är spärrad; avgränsade funktioner sköter sparning och skrotköp. RLS skyddar personliga sparfiler. E-post finns endast i Supabase Auth; lösenord lagras av Auth som hash.

Supabase-kontrollpanelen behöver ha Confirm email avstängt för direkt inloggning, Site URL satt till https://limpaaan.github.io/NORRUT/ och samma adress godkänd som återställningsadress. Återställningsmail beror på Supabase e-posttjänsts leverans och begränsningar.
