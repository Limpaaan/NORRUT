# NORRUT! – fortsätta på en annan dator

Webbspel: https://limpaaan.github.io/NORRUT/
Kod: https://github.com/Limpaaan/NORRUT

Hämta repot på den nya datorn. Installera beroenden med `npm ci`, kontrollera med `npm test` och `npm run build`, starta med `npm run dev`. En push till main kör GitHub Actions och publicerar till GitHub Pages. Supabase-migrationerna 001–004 är redan applicerade på det anslutna projektet; kör dem inte igen där.

## Version 0.5

Phaser/TypeScript/Vite. Fullskärm och liggande mobilvy. Pilar/WASD och konfigurerbara hotkeys. Produktkatalog med åtta kategorier och 15 steg per kategori: motor, vingar, tank, temporär booster, kropp, fena, front och instrumentpanel. Butik, skrotupplag, verkstad, montering, forskning och topplista i egna spelmenyer. Lokala sparningar migreras och behåller mynt/rekord. Konton och molnsparning använder Supabase Auth/REST och revisionskontroll. E-postverifiering är avstängd, och spelets URL är inställd för återställning. Lösenord hanteras av Supabase Auth, inte av spelkoden.

Flygfysiken har starkare gravitation, bredare nosvinkel, tydligare dykning och mjuk upptagning. Tester verifierar fartvinst vid dykning och att fart behålls vid höjdförlust. Flygtid högst tio minuter. Panelens första köp är analogt; parvisa verkstadsnivåer låser fler sensorer, och senare steg blir digitala. Panelen visar bara mätdata och styr inte åt spelaren.

`src/route.ts` väljer miljö och milstolpar. Avesta återanvänds inte som en loopande stad. Verket, Dalahästen, Hedemora, Säter, Borlänge och Falun har egna miljörutor; skog och odlingslandskap fyller avstånden mellan dem. Stadsmiljöerna är konstnärliga tolkningar. Se ROUTE-ART.md för bildprompt och atlasens rutor.

`src/equipment.ts`: produkter, skick, montering, uppgraderingar och forskning. `src/model.ts`: fysik, ekonomi, flygning och sabotage. `src/progression.ts`: spelmenyer. `src/instrument-ui.ts`: analog/digital panel. `src/journey.ts`: miljöer och animerad farkost. `src/accounts.ts`: autentisering och molnsparning. `supabase/002_scrap.sql`: gemensamt lager och transaktionella köp. `supabase/003_catalog.sql`: alla produkter. `supabase/004_leaderboard.sql`: publik topplista med användarnamn och ensampilotrekord, inga e-postadresser.

## Fortsatt balansering

Hedemora ligger vid 24 km, Säter 45 km, Borlänge 72 km och Falun 96 km. Ett kontrollerat steg-9-prov når cirka 21 km utan extra bränsle och 24 km med bränsleboostern. Sena delar och fullt uppgraderade byggen behöver fortsatt mänsklig provspelning. Spelresultat och produktköp i vanliga butiken beräknas i klienten; topplistan är en prototyp utan fullständigt serververifierade flygrepriser. Gemensamma skrotköp och sökningar körs däremot i servertransaktioner. Premiumvaluta har ingen köpbutik eller riktiga betalningar. Konton krävs för skrotmarknaden och för att synas på topplistan; gästrekord sparas bara lokalt. Sabotage mellan spelare är fortfarande lokala profiler, inte ett färdigt globalt vänsystem.

Telefonen kan användas via ChatGPT Remote med datorn ansluten, vaken och online. GitHub innehåller projektfilerna; en vanlig kopia av repot ger inte automatiskt tidigare chattkontext eller åtkomst till andra datorers lokala filer.


0.6: 120 rasterdelar i public/art/components, monteringsramar i part-frame-data.ts. Miljöer i public/art/places. Ny ekonomi i economy.ts. SQL005 ekonomi,006 vänner,007 admin/gäster är applicerade i Supabase. Gästsparning lokal med anonymt statistikregister och adminSeq för idempotenta kommandon. AdminL finns serverlagrat; behörighet i privat admin_members. Inga lösenord i klientkod. Gäster utan nätverk syns först efter anslutning. Admin kan nollställa en spelares hela progression och tilldela mynt. Global topplista visar topp50; vänfilter inkluderar själv och accepterade vänner.

Google OAuth: PKCE-flöde och återkomsthantering är klara. Provider är ännu avstängd: Google Cloud-konsolen blockerar åtkomst tills kontots ägare aktiverat MFA. Client ID/Secret ska endast anges i Supabase Google-provider, aldrig i källkod. Callback https://gkfaftfzfhehbgboqyma.supabase.co/auth/v1/callback, webbursprung https://limpaaan.github.io. Kontoformulär separata login/signup-flikar, alltid gästknapp, nya lösenord minst6tecken. Adminlösenord ändrat server-side enligt senaste önskemål; inte lagrat i repo.
