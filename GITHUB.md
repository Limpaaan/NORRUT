# Publicering med GitHub Pages + Supabase

GitHub-repo: önskat namn `NORRUT!` (GitHub normaliserar normalt otillåtna tecken; välj `NORRUT` som tekniskt namn). Spelets titel är fortfarande **NORRUT!**.

1. Skapa ett tomt repo och ge GitHub-anslutningen åtkomst. Publicera källfilerna i projektroten; ta inte med `node_modules`, lokal `.git`, `.openai` eller lokala utdataarkiv.
2. I repots Settings → Pages, välj **GitHub Actions** som byggkälla.
3. `.github/workflows/pages.yml` testar, bygger och publicerar vid push till `main`. `vite.config.ts` använder relativa resurssökvägar så att spelet fungerar under en repokatalog.
4. Kontrollera att bygg- och publiceringsjobben lyckas innan URL:en lämnas som live.

## Supabase

Det här är ännu inte konfigurerat eller verifierat i ett verkligt projekt. Följ stegen i STATUS.md. Viktigt för GitHub Pages: tillåt exakt webbplatsens returadress inklusive repokatalog och avslutande snedstreck, exempelvis `https://limpaaan.github.io/NORRUT/` om repots verkliga namn blir NORRUT. Återställningsflödet och konfigurationsfilen använder sidans katalog, inte domänroten.

Stäng av **Confirm Email** och behåll e-post/lösenord aktiverat. SMTP krävs för återställning till vanliga spelares adresser. Det publika projektvärdet i `public/account-config.json` ska vara projektets URL och publishable key, aldrig en serverhemlighet. Databasens åtkomstregler skyddar varje spelares sparning. Spelets klientekonomi är ännu inte fuskresistent och ska inte användas för betrodda topplistor.

## Kontroll före lansering

- Ny användare kan registrera unikt användarnamn/e-post/lösenord och loggas in direkt.
- Samma konto ser sin sparning på en annan enhet.
- Ett annat konto kan inte läsa eller ändra sparningen.
- Samtidiga enheter skriver inte över varandras progression utan konfliktmeddelande.
- Utloggning återgår till separat gästprogression.
- Glömt lösenord skickar fungerande återställningslänk till rätt publicerad adress.

Officiella instruktioner: https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages och https://v6.vite.dev/guide/static-deploy .
