# Uppdatering: styrning, konton och publicering

## Klart lokalt

- Pilar och WASD, inklusive nedpil/S för boost; även mellanslag.
- Tangentinställningar per åtgärd, lokalt sparade, återställning och kontroll av tangentkonflikter.
- Kontodialog och Supabase REST-klient för användarnamn/e-post/lösenord, inloggning, utloggning och återställning via e-post.
- Molnsparningskod med användarisolering, lokal reservkopia per konto och revisionskontroll mot överskrivning från andra enheter. Nya konton börjar med egen progression; gästdata blandas inte automatiskt in.
- SQL-förslag med unika användarnamn och åtkomstkontroll för sparningar. Det har inte körts mot en databas.
- Sju lokala tester samt TypeScript- och produktionsbygge passerar. Autentisering, databasregler och återställning har inte verifierats mot en riktig tjänst.

## Återstår före live

Sites-projektet är registrerat som offentligt, men ingen version är publicerad. Uppladdningen till kodlagret misslyckades med nätverksfel. Begäran att tillåta nätverksåtkomst avvisades automatiskt av den aktuella körmiljön. `.openai/hosting.json` behåller projektets identitet så att det kan återupptas utan att skapa en ny webbplats.

Supabase-pluginet är bekräftat installerat, men dess projekt- och databasverktyg är ännu inte tillgängliga i den här chatten. Ladda om chatten/sessionen så att den nya anslutningen kan bli tillgänglig; installera inte om pluginet i onödan.

När verktygen finns: välj avsett projekt, kontrollera befintligt schema, tillämpa SQL-förslaget och verifiera registrering, inloggning, användarisolering, revisionskonflikter och återställning. Stäng av Confirm Email, aktivera e-post/lösenord, konfigurera webbplatsens faktiska URL som returadress och ställ in SMTP för lösenordsåterställning till vanliga spelare. Sätt endast projektets URL och publika publishable key i `public/account-config.json`. Aldrig service_role eller serverhemligheter där. Fram tills dess visar kontodialogen att konton inte är aktiverade.

## Beslut om konto och admin

Registrering ska inte kräva e-postverifiering. E-post används vid inloggning och lösenordsåterställning. Användarnamn är unikt utan skillnad på stora och små bokstäver och ska vara det sociala namnet för vänner. Lösenord lagras av autentiseringstjänsten som envägshashar; spelets databas har inga lösenordskolumner.

En framtida ägarskyddad adminvy kan visa paginerade listor med användarnamn/e-post och erbjuda återställningslänk. Den ska inte visa lösenord eller hashvärden. Kontolista och adminåtgärder måste köras på servern med verifierad adminbehörighet från skyddad rolltabell eller app_metadata, inte från användarredigerbar metadata. Eventuell service_role-nyckel hör endast hemma i serverns hemligheter. Adminvyn är inte implementerad i den här versionen.

Dokumentation: https://supabase.com/docs/guides/auth/passwords och https://supabase.com/docs/guides/auth/auth-smtp .
