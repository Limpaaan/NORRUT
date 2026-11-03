# Instrumentpaneler · 0.8.1

Alla 15 produktsteg har nu en ritad instrumentpanel med material, infattningar, skruvar, skalstreck och animerade visare eller elektroniska mätfält. Canvas-vektorgrafik gör panelerna skarpa vid olika upplösningar; dessa är inte genererade rasterbilder.

1. Moped: krominfattad hastighetsmätare, elfenbensfärgad urtavla, mekaniskt höjdräkneverk.
2. Bil: dubbla instrument, svart vinyl, grön belysning och stig/sjunk-mätare.
3. Rally: borstad aluminium, dubbla urtavlor och attitydindikator.
4. Klassiskt flyg: träpanel, flyginstrument och grafisk anfallsvinkel.
5. Expedition: olivgrön panel, flyginstrument och vindmätare.
6. Sportflyg: grafitpanel, sexpack och motståndsmätare.
7. Tidig digital: bärnstensfärgad CRT med konsthorisont.
8. Flygdator I: grön LCD med tidmätare.
9. Flygdator II: färgskärm och energimätare.
10. Navigation: blå kursdisplay, rutnät och glidtal.
11. Energihantering: kopparram och flygbanemätning.
12. Rymdflyg: ljus kapselpanel och bränslemätning.
13. Kvantnavigator: violett optik och boostmätning.
14. Holografisk: cyan ram, rutnät och markfart.
15. Stjärnskepp: guldinfattning, plasmafärgad skärm och lyfttelemetri.

Utseendena följer produktsteget. Verkstadens tio trimnivåer förbättrar upplösningen; de hoppar inte till nästa panelmodell. Befintlig instrumentforskning kan fortfarande låsa upp nästa sensorsteg.

Varje visare, konsthorisont och stapel läser faktiska värden ur flygningen. Skalor kan mättas, men siffervisningen fortsätter visa det uppmätta värdet. Första mopedmätaren har 120 km/h-skala, bilen 240 och flygets analoga 600. Exempelvärden används enbart i tydligt märkta förhandsvisningar.

Mobilen visar en kompakt instrumentpanel med en förstora/minska-knapp; större läge visar alla upplåsta sensorer. Panelens placering lämnar mellanrum till plånboken. Inställningar → Se alla 15 instrumentpaneler ger fem sidor med tre modeller vardera utan att köpa delar eller ändra framsteg. Butikens/verkstadens deljämförelse har fliken Instrumentets utseende.

Verifiering: TypeScript, produktionsbygge, befintliga 58 regressionstester och visuell granskning av de 15 modellerna i webbläsaren.
