# NORRUT! · 0.7

Spelbart TypeScript/Phaser-spel: https://limpaaan.github.io/NORRUT/ · kod: https://github.com/Limpaaan/NORRUT

## Utveckla och publicera

Node.js 24. Kör `npm ci`, `npm run dev`, `npm test` och `npm run build`. GitHub Actions bygger, testar och publicerar main till GitHub Pages. Supabase är anslutet via den publika projektkonfigurationen i public/account-config.json. Inga administrativa hemligheter eller lösenord finns i klientkoden. SQL-migrationerna i supabase/ dokumenterar den anslutna databasens schema; applicera inte gamla migrationer på nytt.

## Spela

Pilar/WASD: vänster/A sänker nosen, höger/D höjer den, upp/W motor, ned/S/mellanslag boost. Tangenter går att ändra i Inställningar. Mobilen spelas i liggande läge med hållknappar. Dykning ger fart till kostnad av höjd; glidflykt och upptagning kräver rätt vinkel.

Till staden öppnar en klickbar Avesta-karta. Välj butik, verkstad, hangar, skrot, labb, ramp, pilotklubb eller torget. Nästan heltäckande menyer använder kategorier och sidknappar. Butiken säljer nästa produktsteg; Verkstaden uppgraderar köpta och monterade delar till nivå 10. Hangaren visar ägda delar för montering. Katalogen har 8 kategorier × 15 steg. Se PRODUCT-CATALOG.md.

## Delar och balans

Alla produkter har samma grundstandard oavsett källa. Skick- och specialmodifieringar är avstängda även för gamla delar; föremål, nivåer och mynt behålls. Butiksdelar kan uppgraderas i Verkstaden. Skrotfynd monteras i Hangaren.

Delstatistiken visar monterad del, vald del och nästa nivå. Nivåvyn visar 0–10 med kostnad och totalsumma. Uppgifterna kommer från samma funktioner som fysiken. Motor ger dragkraft, vingar lyft/glidförmåga, tank motortid, booster tillfällig kraft, kropp lägre vikt, fena nosstyrning och front mindre motstånd/propellereffektivitet. Instrument ger mätdata och upplösning; fler sensorer kräver högre produktsteg. Delvikt ingår i farkostens totalvikt.

Ekonomin ger måttlig grundbelöning för distans och rekordförbättring. Prestationer betalas en gång. Tidigare mynt nollställs aldrig automatiskt. Första motorn kostar 100, nivå 1–10 kostar 10–100 (550 totalt), nästa motor kostar 750. Senare uppgraderingsbudget anpassas till nästa produkts prisgap.

Skrotlagret delas av inloggade spelare och byts varje halvtimme. Varje erbjudande kan köpas en gång. Standarddelar kostar 55 % av butikspriset. Sökning: 35 % inget, 35 % småpengar, 20 % del, 10 % del på högsta tillåtna steg. Högst ett steg över monterat per kategori. Avgiften är 5 + 1,8 % av relevant motorstegs pris. Inga riktiga betalningar finns.

## Konton, vänner och admin

Separata flikar Logga in/Skapa konto, alltid synligt gästval. Nya lösenord minst sex tecken. Google-inloggning är uppskjuten. E-postverifiering är avstängd. Konto sparas i Supabase och följer med mellan enheter; gästens fulla progression sparas lokalt. Anonyma gäst-ID:n och rekord registreras när nät finns. Adminändringar för gäster köas och appliceras en gång vid återanslutning.

Alla-topplistan visar registrerade spelare; Vänner visar själv och accepterade vänner. Vänförfrågningar kan skickas, accepteras, avböjas och tas bort. E-post exponeras bara i serverkontrollerad administration. Adminmenyn har sökning, konto/gästfilter, statistik, mynttilldelning och nollställning med namnkontroll. Behörighet ligger i privat servertabell, aldrig i användarredigerbar metadata.

## Struktur och begränsningar

city.ts och city-ui.css: stad och layout. progression.ts: platsmenyer. part-stats.ts: fysiska delvärden. part-stats-ui.ts: jämförelser. model.ts: simulering. equipment.ts: katalog/montering/forskning. admin-ui.ts: administration. accounts.ts: Auth och molnsparning. journey.ts: animerad farkost och kontinuerliga miljölager.

54 automatiska tester täcker fysik, delvärden, ekonomi, progression, lagring och kontokontrakt. Geografin är schematisk. Resultat beräknas i klienten; topplistan är ännu inte fuskresistent med verifierade repriser. Privata rum, global chatt, prestige och forskning bortom nuvarande träd är framtida arbete. Sabotage är spelbara i lokalt kompisläge. Sena byggen behöver fortsatt provspelning.

Se CITY-ART.md, COMPONENT-ART.md, ENVIRONMENT-ART.md och ROUTE-ART.md för bildfiler och prompter.
