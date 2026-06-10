# SWAPA — Landing Test Drive (Milano)

Landing page di conversione per la prenotazione di un test drive SWAPA a Pero (Milano).
Stack: **Astro + Tailwind**, SSR via adapter Vercel (per l'endpoint del form).

Fonte di verità: [`SWAPA_landing-testdrive_BRIEF.md`](./SWAPA_landing-testdrive_BRIEF.md).

## Sviluppo

```bash
npm install
cp .env.example .env   # poi compila le variabili
npm run dev            # http://localhost:4321
npm run build          # build di produzione
```

## Struttura

```
src/
  layouts/Base.astro          <head>, Poppins, OG
  components/
    Header.astro              logo + micro-tagline (nessun menu)
    Hero.astro                hero con foto prodotto + overlay
    Levers.astro              "Perché SWAPA" (4 leve)
    TestDrive.astro           "Com'è il test drive" (rassicurazioni)
    LeadForm.astro            form principale + UTM + submit a /api/lead
    Faq.astro                 4 domande
    Footer.astro              dati legali + IG
    ConsentBanner.astro       consenso GDPR + caricamento pixel dietro consenso
  pages/
    index.astro               landing
    thank-you.astro           conferma + Calendly inline (prefill nome/email)
    api/lead.ts               endpoint server-side → webhook n8n
public/
  images/                     foto prodotto + logo (scaricati dal sito, non hotlinkati)
  creativity-ref/             riferimento di stile (vuota: asset non nel repo)
```

## Variabili d'ambiente (vedi `.env.example`)

| Var | Uso |
|-----|-----|
| `LEAD_WEBHOOK_URL` | **Server-side.** Webhook n8n. n8n mappa il payload "grezzo" del sito sulle key Relatia e crea il contatto via HTTP Request. |
| `SHEET_WEBHOOK_URL` | **Server-side.** Web App Google Apps Script che aggiunge una riga sul foglio di controllo. |
| `PUBLIC_CALENDLY_URL` | URL Calendly per la thank-you. Default: `https://calendly.com/swapa-info/swapa`. |
| `PUBLIC_META_PIXEL_ID` / `PUBLIC_GA4_MEASUREMENT_ID` / `PUBLIC_GOOGLE_ADS_ID` | Tracciamento, caricato **solo dopo consenso**. Vuoti = tag non caricati. |

**Flusso lead:** al submit, `/api/lead` invia il contatto **in parallelo** a n8n e al Google
Sheet. Le due destinazioni sono indipendenti e **non bloccano mai l'utente**: se la validazione
passa l'endpoint risponde sempre `{ ok: true, n8n, sheet }` (con esito `sent`/`failed`/`skipped`
di ciascuna), l'utente arriva comunque alla thank-you, e gli eventuali fallimenti vengono loggati.
Finché un URL è `PLACEHOLDER_da_fornire`, quel canale è `skipped` (flusso testabile end-to-end).

```
Form → /api/lead ─┬→ n8n (mappa key + HTTP Request) → Relatia CRM
                  └→ Google Sheet "Meta Ads" (controllo)
```

⚠️ **Nessuna credenziale di CRM nel repo.** Gli URL webhook vivono solo nelle env (server-side).

## Deploy (Vercel)

1. Importa il repo su Vercel (rileva Astro automaticamente).
2. Imposta le env (`LEAD_WEBHOOK_URL` e `SHEET_WEBHOOK_URL` reali).
3. Deploy. L'adapter è già `@astrojs/vercel` (SSR).

Per Netlify: sostituire l'adapter con `@astrojs/netlify` in `astro.config.mjs`.
