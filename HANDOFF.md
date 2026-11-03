# NORRUT! · handoff 0.7

Live: https://limpaaan.github.io/NORRUT/ · Repo: https://github.com/Limpaaan/NORRUT

Node24/Phaser3/TypeScript/Vite. `npm ci`, `npm test`, `npm run build`, `npm run dev`. Push main utlöser tester och GitHub Pages. Läs README.md för nuvarande funktioner och begränsningar.

Supabaseprojekt gkfaftfzfhehbgboqyma är anslutet. Migrationer 001–010 och mindre korrigeringar är applicerade. Kör inte om gamla migrationer där. E-postbekräftelse avstängd enligt användarens önskemål. Lösenord hanteras av Auth. Administratörsrättighet finns i privat admin_members, inte metadata. Adminlösenord finns inte i repo. Google-inloggning är uttryckligen uppskjuten.

0.8.0 använder interaktiv stadskarta och större platsmenyer med kategorier/sidknappar. Deljämförelser och simulering delar part-stats.ts. Skick och specialmodifieringar är pausade: gamla värden normaliseras och har ingen prestandaeffekt. Ägda delar, nivåer och mynt behålls. Instrumentnivåer förbättrar upplösning; sensorer låses med produktsteg och forskning.

Vänner/allmänt leaderboard är anslutna serverfunktioner. Adminvyn använder admin_players/admin_adjust/is_admin. Gäst-ID och liten statistikpost lagras på server, full sparning är lokal; guest_commands och adminSeq gör adminändringar idempotenta. Account admin_revision hanterar administrativa ändringar mellan revisioner. Skrotköp är transaktionella. Lokal vanlig butik/fysik är ännu inte fuskresistent.

58 tester, inklusive Hedemora vid 3 km: kontrollerat steg 9 behöver bränsleplanering. Statistikens uppmätta delvärden före forskning och boosters; lyft vid 90km/h och 6° anfallsvinkel. Testa nya menyer på desktop och liggande mobil innan leverans. Behåll PC/mobilkrav, svenska texter och alla tidigare funktionskrav.

Aktuell flygmodell, spelavstånd och landskap dokumenteras i FLIGHT-DESIGN-08.md. Rundor max 60 s, motorn automatisk med på/av-växel. Kamera px får aldrig bero på höjd. Nya panoramat 2172×724 och björkförgrunden 1536×1024 har separata filer (FLIGHT-ART-08.md). Ingen databasändring behövs för 0.8.0. Gamla rekord är bevarade och därför inte direkt jämförbara med den nya fysiken.

0.8.1 ersätter instrumentens textruta med Canvas-ritade paneler i cockpit-art.ts. Alla 15 produktsteg har separat material/färg/layout och faktiska mätvärden. cockpit-gallery.ts ger ett galleri i Inställningar; part-stats-ui.ts visar vald panel före köp. Se INSTRUMENT-DESIGN.md. Ändra inte sensorupplåsning eller verkstadens 0–10 trimnivåer för en grafisk justering.

