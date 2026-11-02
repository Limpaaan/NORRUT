# 0.3 — Bildreferensen, animationer och flygskicklighet

Spelet fyller nu webbläsarfönstret utan sidskrollning. Verkstad, utrustning, inställningar och paus öppnas som egna menyer inne i spelet. Knappen Starta försöker aktivera webbläsarens helskärm; där API:t inte stöds används hela flikens yta. En särskild helskärmsknapp finns också.

Mobil kräver liggande läge. Stående telefoner får en blockerande Vänd telefonen-skärm som inte kan stängas utan att skärmen blir liggande. Flygningen pausar under tiden. I helskärm försöker spelet dessutom låsa orienteringen till landskap när webbläsaren stöder det.

Ny målad miljöbild och separata frilagda farkostdelar har skapats utifrån användarens faktiska bild 2. Se ART-DIRECTION.md för bildfiler och slutprompter. Delarna animeras oberoende: pilot, halsduk, propeller, hjul, vinge, motorrök, boost och landningsfjädring. Vingseglet monteras visuellt först efter köp av glidvingen. Lövverk och vattenreflexer rör sig. Minskad dekorativ rörelse kan väljas i inställningarna.

Fysiken använder nu fart relativt nosvinkel, lyft vinkelrätt mot rörelsen, motstånd och stall. Pitchändring utan motor kan inte tillföra fri energi. Grundfordonet saknar motordrift, glidvinge och raket. Första köpet av respektive komponent låser upp dess funktion direkt. Simulerade exempel med samma rampstart: grundfordon cirka 40 m; första glidvingen cirka 119 m med en låg vinkel men cirka 21 m med kraftigt uppdragen nos. Resultaten beror på styrning, boosters och sabotage och är inte garanterade räckvidder.

Provflygning lånar nivå 1 av motor, glidvinge och raket så att alla sabotage kan testas utan att ändra sparade uppgraderingar. Menyer och förlorat fönsterfokus pausar flygningen. Lokala sparningar behålls.

Verifiering: 28 tester samt produktionsbygge. Supabase och spel mellan enheter är fortfarande inte aktiverade.

# 0.2 — Verkstaden i Avesta

## Grafik och flygning

Ny originalgrafik i nordisk indiestil: varmt morgonljus, disiga åsar, varierade barrskogslager, träpaneler, fönsterdetaljer, vattenreflexer och ett detaljerat skrotflyg med propeller och rökslinga. Samtliga lager ritas lokalt en gång och används som texturer. Inga genererade referensbilder eller externa bildfiler krävs. Stil 6 följs utifrån tillgänglig text; originalreferensbilden saknades.

## Uppgraderingar och boosters

Tolv uppgraderingar: motor, tank, vingar, chassi, ramp, raketpaket, insprutning, styrkalibrering, reservmotor, lastkontroll, verkstadslås och returpaket. De påverkar fysik, resursförbrukning eller försvar. Vissa kräver tidigare komponentnivåer. Fem engångsboosters: extra bränsle, turbo, termikvingar, raketskjuts och lätt last. Högst tre väljs per runda.

## Sabotage

Alla tolv effekter från den tillgängliga specifikationen är spelbara: omvända spakar, tappad raket, bly i lasten, läckande tank, dalahäst som fripassagerare, trasig kompass, magnetisk otur, motorhosta, fikapaus, motvind från Mora, för tidig fallskärm och Krylbo-specialen.

Det lokala kompisläget har separata piloter i samma webbläsare. Bus kräver ett föremål och en biljett, kan skickas anonymt för 50 skrotmynt, väntar högst sju dagar och avslöjas under nedräkningen efter att boosters förbrukats. Högst ett bus väntar per pilot och högst två aktiveras per sjudagarsperiod. Ensampilot är fri från bus och har separat rekord. Provflygning låter spelaren testa alla effekter utan kostnad, rekord eller belöningar.

Verkstadslådor fås var femte ordinarie runda. Varje låda ger en booster och har 8 % chans att ge ett viktat busfynd. Högst fem busföremål sparas. En busbiljett fås var tionde runda, upp till tre. Dessa är speltestvärden, inte en tidigare godkänd fullständig ekonomibalans.

## Sparningar och begränsningar

En flygrunda varar högst tre minuter; en farkost som ännu flyger bärgas utan landningsbonus. Sparfil version 1 migreras till version 2 utan att mynt, rekord eller befintliga komponentnivåer förloras. Sparfilens ursprungliga lagringsnyckel behålls. Nya lokala piloter har separata förråd och framsteg.

Lokalt kompisläge är inte kontobaserat nätverksspel. Riktiga vänner, anonyma serverlagrade bus och synkning mellan enheter kräver fortfarande en konfigurerad backend. Lokala sparfiler och hemligheter kan granskas i webbläsaren och är inte fuskresistenta. Supabase är fortfarande avstängt. Forskningssystem, prestige, globala topplistor, rum och chatt ingår inte i 0.2.

Verifiering: produktionsbygge och 20 automatiska tester för ekonomi, flygfysik, sabotage, migration och rundlåsning.


## 0.4.0
- 105 namngivna produkter, sju kategorier och sju skick.
- Separat butik, verkstad, montering, gemensamt skrot och förgrenad forskning.
- Transaktionella Supabase-köp, serverbestämt lager och sökning.
- Produktbaserade flygegenskaper, monterade visuella komponenter och engångsbooster.
- Bevarad sparning och 32 automatiska tester.

## 0.5.0
- Tydligare dykning, snabbare fall och energibevarande upptagning.
- Köpbar analog/digital instrumentpanel med successiva sensorer.
- 120 produkter och elektronik på skrotupplaget.
- Egna stadsmiljöer och fyllnadslandskap, ingen loopande Avesta-stad.
- Sträckstapel mot större milstolpar och publik konto-topplista.
- 40 tester, inklusive en bränsleplanerad flygning till Hedemora.
- HANDOFF.md för att fortsätta från en annan dator.
