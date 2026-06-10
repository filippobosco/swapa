# BRIEF — Landing Page Test Drive SWAPA ZIP

Documento di lavoro per Claude Code. Obiettivo: costruire **una** landing page per campagne Meta/Google Ads, focalizzata su **un'unica conversione — la prenotazione di un test drive a Milano (Pero)**.

> Questo brief è la fonte di verità. Dove un valore è marcato `DA CONFERMARE` o `PLACEHOLDER`, va verificato/sostituito prima del go-live (vedi §11). Non esporre mai credenziali nel codice client-side (vedi §6).

---

## 1. Obiettivo e flusso

Landing conversion-focused, senza menu di navigazione né link esterni di distrazione. Una sola azione possibile: lasciare il contatto per il test drive.

Flusso:
1. L'utente arriva da un annuncio (Meta o Google) con parametri UTM nell'URL.
2. Compila il form (nome, cognome, email, telefono, messaggio opzionale).
3. Il form invia i dati a una **API route server-side**, che li inoltra al **webhook n8n** (che smista a Relatia CRM, Brevo, Spoki, ecc.).
4. L'utente viene portato alla **thank you page** (o sezione thank-you inline).
5. Nella thank you compare il **widget Calendly inline** per prenotare subito lo slot del test drive.
6. Il lead entra nel workflow n8n di nurturing già attivo (email di benvenuto + WhatsApp + sequenza NR1/NR2).

---

## 2. Target, posizionamento e voce

**Target** (più ampio della sola fascia giovane): professionista/imprenditore urbano che si muove in città la mattina **e** giovane di stile che vive Milano (aperitivo, shopping, spostamenti brevi). Accomunati da **città + estetica + praticità**, non da un'età precisa. Milano e hinterland.

**Posizionamento:** urban luxury. Micro auto elettrica fashion e premium, **non** entry-level, **non** "quadriciclo di plastica". SWAPA "gioca in un altro campionato".

**Voce:** esclusiva e aspirazionale, diretta, asciutta. Tono "per chi sa cosa vuole". Premium, mai da volantino.

**Vincoli (dal brief creativo delle campagne):**
- **Mai parlare di prezzo.**
- **Mai confronti diretti** con altri veicoli (Citroën Ami, Microlino, Topolino, Panda…).
- Il "gratuito" del test drive è una **rassicurazione**, non un grido: niente "GRATIS" urlato in hero (abbassa il percepito premium).

**Leve comunicative** (usarne sempre almeno una per sezione):
- Design iconico, super fashion, riconoscibile
- Full optional di serie (clima, display, finiture curate) → "Zero compromessi"
- Compattezza urbana + funzione brevettata **Touch-Parking™** (parcheggi nello spazio di uno scooter)
- Telaio **Monocoque™** in acciaio e alluminio → sicura come un'auto vera (leva razionale, utile anche per il target più adulto/genitori)
- 100% elettrica → accesso libero ad Area B/C di Milano

---

## 3. Design system

> **Mood dalle creatività, colori dal brand.** Il *linguaggio visivo* (fotografia lifestyle milanese cinematografica, overlay scuri, taglio editoriale) si ispira alle creatività della campagna allegate nel repo. La *palette*, invece, è quella **ufficiale del brand** (sotto), non i colori di dettaglio delle foto.

**Palette (ufficiale brand)**
- **Accent: verde acqua / teal** — `#4ECBA8` (fonte: email di conferma brand). Nel sorgente del sito compare la variante vicina `#34D4A8`: la famiglia è confermata. È il colore-firma per CTA, dettagli, hover. (Il lime delle creatività è solo il dettaglio dei freni del prodotto, **non** il colore di sistema: non usarlo come accent.)
- Verde scuro (testo su accent): `#0A3D2E`
- Base scura: `#0A0A0A` (nero profondo) — sfondo principale
- Base chiara: `#FFFFFF`
- Background grigio chiaro: `#F0F0F0`
- Grigio testo secondario: `#888888`

**Tipografia** — verificata sul sito: il font dominante è **Poppins** (con Work Sans come secondario). Usare:
- `Poppins` 700/800/900 per headline, titoli, CTA (bold/black, uppercase dove serve)
- `Poppins` 300/400/500 per body, label, testo
- Import: `https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;700;800;900&display=swap`
- (Il documento precedente indicava Barlow: era un'ipotesi non verificata. Il sito usa Poppins.)

**Stile:** minimal, editoriale, niente elementi ridondanti. Headline grandi uppercase, body light. Molto spazio negativo. Fotografia lifestyle a tutta larghezza con overlay scuro per la leggibilità del testo. Mobile-first.

---

## 4. Struttura della pagina

Ordine delle sezioni (mobile-first; il form deve essere raggiungibile rapidamente, idealmente con CTA above the fold che ci scrolla):

1. **Header minimale** — logo SWAPA a sinistra su `#0A0A0A`, a destra micro-tagline "Urban Electric Mobility" (uppercase, letterspacing). Nessun link di navigazione. CTA "Prenota il test drive" che scrolla al form.
2. **Hero** — immagine/video lifestyle milanese con overlay scuro. Headline premium (vedi §5), sub con l'offerta (1 ora gratis, a Pero), bottone CTA in accent verde acqua → scrolla al form.
3. **Leve / "Perché SWAPA"** — 3-4 blocchi visivi ancorati alle leve (design / full optional / Touch-Parking / Monocoque). Label uppercase + 1 riga body. Niente schede tecniche affollate.
4. **Com'è il test drive** — sezione che abbassa la barriera: 1 ora al volante, a Pero (Milano), patente AM sufficiente, nessuna pressione di vendita. Rassicurazione, non logistica fredda.
5. **Form** (sezione principale, vedi §6).
6. **FAQ** — 3-4 domande secche (vedi §5).
7. **Footer minimale** (vedi §5).
8. **Thank you** — pagina `/thank-you` o sezione inline, con Calendly embed (vedi §7).

---

## 5. Copy di riferimento

Voce premium/esclusiva. I copy qui sono il punto di partenza; mantenere registro e vincoli (§2).

**Headline hero — opzioni (NON usare "GRATIS" urlato):**
- "L'icona elettrica di Milano. Vieni a guidarla."
- "La micro auto che Milano ha scelto. Provala."
- "Compatta fuori. Completa dentro. Provala a Milano."

**Sub hero:**
> Un'ora al volante, senza impegno e senza pressione. Ti aspettiamo a Pero, a due passi da Milano.

**CTA (bottone):** `Prenota il tuo test drive`

**Leve (label + riga):**
- DESIGN ICONICO — "Non somiglia a nient'altro in strada. E si vede."
- ZERO COMPROMESSI — "Clima, display, finiture curate: dentro c'è tutto."
- TOUCH-PARKING™ — "Entri dove un'auto non entra, parcheggi dove sta uno scooter."
- SICUREZZA MONOCOQUE™ — "Telaio in acciaio e alluminio, fabbricato come un'auto vera."

**Com'è il test drive (micro-rassicurazioni):**
- "Un'ora al volante, per le tue strade di sempre."
- "Ti basta il patentino AM."
- "Nessun venditore addosso. Solo tu e SWAPA."

**FAQ** (`DA CONFERMARE` con la pagina ufficiale https://swapa.com/pages/faq):
- *Serve la patente?* — È un quadriciclo leggero L6e: si guida col patentino AM (dai 14 anni, secondo normativa). [verificare formulazione esatta]
- *Posso entrare in Area B e Area C a Milano?* — Sì, è 100% elettrica: accesso libero alle ZTL ambientali.
- *Quanto dura il test drive e quanto costa?* — Un'ora, in presenza a Pero (Milano). È gratuito e senza impegno.
- *Dove si fa il test drive?* — Via Isaac Newton 9, 20016 Pero (Milano).

**Thank you:**
- Titolo: "Perfetto. Ora scegli quando venire."
- Sub: "Prenota il tuo slot: ti aspettiamo a Pero, Via Isaac Newton 9."

**Urgenza:** "onesta" — le agende dei test drive si riempiono davvero, quindi è ammesso un richiamo soft tipo "scegli lo slot finché ci sono date libere". **Non** inventare numeri di posti limitati.

---

## 6. Form → webhook n8n (con nota di sicurezza)

**Campi:** Nome*, Cognome*, Email*, Telefono*, Messaggio (opzionale), + checkbox consenso privacy GDPR (obbligatoria, reg. 679/2016, link a privacy policy).

**Architettura (importante):**
- Il form **non** chiama direttamente alcun CRM dal browser.
- Submit → **endpoint server-side Astro** (es. `src/pages/api/lead.ts`) → `POST` al **webhook n8n**.
- n8n esegue la mappatura verso Relatia CRM (e Brevo/Spoki). **Token e credenziali del CRM vivono in n8n, mai nel repo della landing.** (Il token Relatia presente nel documento precedente, se usato lato browser, sarebbe stato pubblicamente visibile: da non fare.)

**Env var:**
```
N8N_WEBHOOK_URL = PLACEHOLDER_da_fornire
```

**Payload inviato a n8n** (JSON pulito; n8n lo rimappa sul formato Relatia):
```json
{
  "first_name": "<nome>",
  "last_name": "<cognome>",
  "email": "<email>",
  "phone": "<telefono>",
  "message": "<messaggio>",
  "utm_source": "<utm_source dalla URL>",
  "utm_medium": "<utm_medium dalla URL>",
  "utm_campaign": "<utm_campaign dalla URL>",
  "page": "landing-testdrive-milano"
}
```

**UTM tracking:** leggere `utm_source`, `utm_medium`, `utm_campaign` dalla query string e includerli nel payload (persisterli in sessione nel caso l'utente navighi prima di convertire).

Dopo submit OK → redirect a `/thank-you` (passando email/nome per il prefill Calendly).

---

## 7. Thank you page + Calendly

- Messaggio di conferma breve (§5).
- **Calendly inline** (non popup), con prefill di nome/email via query param per non far reinserire i dati.

```html
<div class="calendly-inline-widget"
     data-url="https://calendly.com/swapa-info/swapa?name=NOME&email=EMAIL"
     style="min-width:320px;height:700px;"></div>
<script src="https://assets.calendly.com/assets/external/widget.js" async></script>
```

URL Calendly test drive: `https://calendly.com/swapa-info/swapa`

---

## 8. Tracciamento e consenso

- **Meta Pixel + GA4 + Google Ads tag** installati prima del go-live.
- Eventi: `PageView`, scroll 50%, `ViewForm`/click CTA, `Lead` al submit del form, `BookingCompleted` quando lo slot Calendly è confermato (meglio gestito via webhook Calendly → n8n/GTM, non solo client-side).
- **Banner consenso cookie GDPR** (es. Iubenda/Cookiebot) che blocca i pixel finché non c'è consenso. Scelta di default più privacy-preserving.
- Mai dati personali nei parametri URL verso terzi.

---

## 9. Asset

**Regola:** le immagini di prodotto provengono dagli asset già online di SWAPA — **Shopify CDN** (swapa.com) e **Wix** (swapa.it). Claude Code deve **scaricare le immagini dagli URL qui sotto e salvarle in `/public/images/`**, referenziandole localmente. **Non hotlinkare gli URL esterni in produzione**: gli URL Wix in particolare cambiano e lascerebbero immagini rotte; servire dal repo dà anche performance e ottimizzazione migliori (Quality Score). Evitare del tutto gli URL Imgur del documento precedente.

Le **creatività della campagna** (cartella `/public/creativity-ref/`) servono **solo come riferimento di stile** (mood, palette in uso, taglio fotografico), **non** come immagini della pagina: hanno il testo già sopra.

| Asset | URL da scaricare nel repo |
|-------|---------------------------|
| Logo SWAPA | preferire **SVG** se disponibile; fallback `https://swapa.com/cdn/shop/files/Asset_2.png` |
| Foto esterni prodotto | `https://swapa.com/cdn/shop/files/Shots010.210.11.png` |
| Interni / colori | `https://swapa.com/cdn/shop/files/NEW_WHEELS_COLORS_UI.19.png` |
| Immagine share / hero | `https://swapa.com/cdn/shop/files/SWAPA_SHARE.png` |
| Video hero (opzionale) | `https://cdn.shopify.com/videos/c/o/v/e3084f73081a44a2bd58bdd329c9ff0a.mp4` |
| 4 colorazioni (Jumana Silver, Aygul Pink, Emerald Green, Concrete Grey) | asset wixstatic da swapa.it |
| Privacy Policy | `https://www.swapa.it/privacy-policy` |
| Tech specs / brochure ufficiali | `https://swapa.com/pages/tech-specs-1` · `https://swapa.com/pages/zip_brochure` |

Nota mood: le foto del sito sono più product/studio che lifestyle. Per l'hero, se serve il taglio urbano delle creatività, usare uno scatto in contesto o un fermo immagine del video coerente con quel mood.

---

## 10. Stack e deploy

- **Framework: Astro + Tailwind CSS.** Scelto perché è pensato per landing/siti di contenuto: genera HTML quasi senza JS → caricamento velocissimo (pesa sul Quality Score di Google Ads e sul bounce da traffico paid). Con un adapter (Vercel/Netlify) gestisce l'endpoint server-side per il form. Next.js sarebbe sovradimensionato per una pagina singola.
- **Deploy:** Vercel o Netlify (adapter Astro SSR per l'endpoint del form).
- **Form:** endpoint server-side Astro → webhook n8n (§6), così il webhook non è esposto al client.
- **Struttura file suggerita:**
  ```
  src/
    pages/
      index.astro          ← landing + form
      thank-you.astro      ← thank you + Calendly embed
      api/lead.ts          ← inoltra il payload a N8N_WEBHOOK_URL
    components/            ← hero, leve, test-drive, form, faq, footer (riusabili)
    layouts/
  public/
    images/               ← foto prodotto scaricate dal sito (§9)
    creativity-ref/       ← le 7 creatività (riferimento stile, non in pagina)
  ```

**Dati legali footer:** FILANTE Motors srl — Via Isaac Newton 9, 20016 Pero (MI) · info@swapa.it · P.IVA 11173950962 · © 2026. IG @swapa_italia.

---

## 11. Checklist pre go-live

- [ ] `N8N_WEBHOOK_URL` reale impostato come env su Vercel
- [ ] Accent verde acqua applicato (`#4ECBA8`; variante sito `#34D4A8`)
- [ ] Font Poppins caricato (Work Sans secondario se serve)
- [ ] Logo in SVG nel repo
- [ ] Pixel Meta + GA4 + Google Ads + banner consenso attivi
- [ ] Test end-to-end: submit → lead in n8n/Relatia → thank you → Calendly → workflow nurturing
- [ ] Performance mobile (Core Web Vitals) e form above the fold su mobile
- [ ] Nessuna credenziale nel codice client-side
- [ ] FAQ verificate con la pagina ufficiale

---

## 12. Prompt iniziale per Claude Code

> Costruisci una landing page di conversione (Astro + Tailwind, deploy Vercel/Netlify) per la prenotazione di un test drive SWAPA a Milano, seguendo integralmente il file `SWAPA_landing-testdrive_BRIEF.md` in questo repo. Una sola pagina + thank-you page con Calendly inline. Il form invia un JSON tramite un endpoint server-side (`src/pages/api/lead.ts`) al webhook n8n in `import.meta.env.N8N_WEBHOOK_URL` — nessuna credenziale nel client. Scarica le immagini di prodotto dagli URL in §9 dentro `/public/images/` (non hotlinkare). Rispetta voce, vincoli (no prezzo, no confronti diretti) e design system del brief. Usa le creatività in `/public/creativity-ref/` solo come riferimento di stile. Dove il brief indica `DA CONFERMARE`/`PLACEHOLDER`, lascia il fallback indicato e segnalamelo a fine lavoro. Parti mostrandomi la struttura dei file e la sola hero prima di completare il resto.
