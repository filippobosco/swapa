import type { APIRoute } from 'astro';

export const prerender = false;

// Endpoint server-side: riceve il lead dal form e lo invia, IN PARALLELO, a due
// destinazioni indipendenti (vedi §6 del brief + flusso definito col cliente):
//   1. Relatia CRM   → LEAD_WEBHOOK_URL  (CRM principale; poi routing rule → New Lead → n8n)
//   2. Google Sheet  → SHEET_WEBHOOK_URL (foglio di controllo, via Apps Script Web App)
// Entrambe sono importanti ma NESSUNA deve bloccare l'utente: si risponde sempre {ok:true}
// se la validazione passa; gli esiti dei due invii vengono loggati e riepilogati.
// Gli URL vivono SOLO sul server (mai esposti al client).

interface LeadBody {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  provincia?: string;
  message?: string;
  consent?: boolean;
  // tracking (letto dall'URL della landing)
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  fbclid?: string;
  gclid?: string;
}

type Outcome = 'sent' | 'failed' | 'skipped';

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

const PLACEHOLDER = 'PLACEHOLDER_da_fornire';
const TIMEOUT_MS = 8000;

// POST difensivo a un webhook: timeout via AbortController, mai lancia, ritorna l'esito.
async function postWebhook(label: string, url: string | undefined, payload: unknown): Promise<Outcome> {
  if (!url || url === PLACEHOLDER) {
    console.warn(`[lead] ${label} non configurato — invio saltato.`);
    return 'skipped';
  }
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: ctrl.signal,
      // NON seguire il redirect: Google Apps Script risponde 302 SUBITO DOPO aver
      // scritto la riga; seguendo il redirect si finisce su googleusercontent.com che
      // dà 405. Quindi consideriamo successo sia 2xx sia 3xx (302 = scrittura avvenuta).
      redirect: 'manual',
    });
    // status 0 = risposta "opaqueredirect" (redirect non seguito): è un successo.
    const ok = res.ok || res.status === 0 || (res.status >= 300 && res.status < 400);
    if (!ok) {
      console.error(`[lead] ${label} ha risposto ${res.status}`);
      return 'failed';
    }
    return 'sent';
  } catch (err) {
    console.error(`[lead] invio a ${label} fallito`, err);
    return 'failed';
  } finally {
    clearTimeout(timer);
  }
}

export const POST: APIRoute = async ({ request }) => {
  let body: LeadBody;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: 'invalid_json' }, 400);
  }

  const first_name = (body.first_name ?? '').trim();
  const last_name = (body.last_name ?? '').trim();
  const email = (body.email ?? '').trim();
  const phone = (body.phone ?? '').trim();
  const provincia = (body.provincia ?? '').trim();
  const message = (body.message ?? '').trim();

  // Validazione server-side (oltre a quella nativa nel browser)
  if (!first_name || !last_name || !phone || !provincia || !isEmail(email)) {
    return json({ ok: false, error: 'validation_failed' }, 422);
  }
  if (body.consent !== true) {
    return json({ ok: false, error: 'consent_required' }, 422);
  }

  // Tracking (già trimmato lato client, ri-normalizziamo per sicurezza)
  const t = (v?: string) => (v ?? '').trim();
  const tracking = {
    utm_source: t(body.utm_source),
    utm_medium: t(body.utm_medium),
    utm_campaign: t(body.utm_campaign),
    fbclid: t(body.fbclid),
    gclid: t(body.gclid),
  };

  // ── Payload per n8n (LEAD_WEBHOOK_URL) ────────────────────────────────────
  // Payload "grezzo" coi NOSTRI nomi di campo: è n8n a mappare sulle key esatte
  // di Relatia (city, messaggio, source, ...) nel nodo HTTP Request. Così se le
  // key Relatia cambiano si aggiorna solo n8n, senza toccare il sito.
  const n8nPayload = {
    first_name,
    last_name,
    email,
    phone,
    provincia,
    message,
    ...tracking,
    page: 'landing-testdrive-milano',
  };

  // ── Payload SHEET ("Meta Ads") ────────────────────────────────────────────
  // L'Apps Script fa appendRow nell'ordine ESATTO delle colonne A→K del foglio:
  // Nome | Cognome | Telefono | Mail | Provincia | Messaggio | Source | Medium | Campaign | gclid | fbclid
  const sheetPayload = {
    sheet_name: 'Meta Ads',
    row: [
      first_name,            // A  Nome
      last_name,             // B  Cognome
      phone,                 // C  Telefono
      email,                 // D  Mail
      provincia,             // E  Provincia
      message,               // F  Messaggio
      tracking.utm_source,   // G  Source
      tracking.utm_medium,   // H  Medium
      tracking.utm_campaign, // I  Campaign
      tracking.gclid,        // J  gclid
      tracking.fbclid,       // K  fbclid
    ],
  };

  // ── Doppio invio in parallelo, non bloccante ──────────────────────────────
  // 1) n8n (che mappa e crea il contatto su Relatia)  2) Google Sheet di controllo.
  const [n8n, sheet] = await Promise.all([
    postWebhook('n8n (LEAD_WEBHOOK_URL)', import.meta.env.LEAD_WEBHOOK_URL, n8nPayload),
    postWebhook('Google Sheet (SHEET_WEBHOOK_URL)', import.meta.env.SHEET_WEBHOOK_URL, sheetPayload),
  ]);

  // Risposta sempre OK se la validazione è passata: l'utente non viene mai bloccato.
  // Il riepilogo (sent/failed/skipped) serve per diagnosi lato log/monitoraggio.
  return json({ ok: true, n8n, sheet });
};
