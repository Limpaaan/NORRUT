# NORRUT!

Spelbart webbspelsutkast i TypeScript och Phaser 3. Starta på Östbergs parkering i Avesta och flyg norrut, samla skrotmynt och uppgradera farkosten.

## Spela och utveckla

Installera Node.js 24 med npm. Kör `npm ci` och `npm run dev`. För produktion: `npm run build`. `dist/` kan publiceras hos en statisk webbvärd. `npm test` kör 19 tester för fysik, ekonomi, sparformat och tangentinställningar.

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

`src/model.ts` innehåller fysik och ekonomi, `main.ts` spelgränssnitt, `journey.ts` Phaser-scen, `art.ts` originalgrafik, `hotkeys.ts` tangentinställningar, `storage.ts` lokal lagring och `accounts.ts` den förberedda kontoklienten. `supabase/001_accounts.sql` är ett ännu inte tillämpat schemaförslag. `contracts.ts` beskriver framtida gränssnitt för progression, rundverifiering och sociala funktioner.

Landmärkenas ordning och avstånd är spelplatshållare, inte verklig nordlig geografi. Grafiken följer textbeskrivningen av nordisk indiestil; originalbilderna saknades. Alla tolv sabotageeffekter och lokala kompisprofiler är spelbara. Vänner mellan enheter, forskning, prestige, chatt, rum, globala topplistor och adminvy är inte implementerade. Se CHANGELOG.md för regler, ekonomi och begränsningar. Klientens ekonomi är inte fuskresistent.

