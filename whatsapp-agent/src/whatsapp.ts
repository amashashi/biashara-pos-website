import crypto from 'crypto';

// ── Twilio types ──────────────────────────────────────────────────────────────

export interface TwilioWebhookBody {
  Body?: string;
  From?: string;   // e.g. "whatsapp:+255754711960"
  To?: string;     // e.g. "whatsapp:+14155238886"
  MessageSid?: string;
  NumMedia?: string;
}

export interface IncomingMessage {
  from: string;   // full "whatsapp:+..." — used as conversation key
  text: string;
}

// ── Incoming message extraction ───────────────────────────────────────────────

export function extractTwilioMessage(body: TwilioWebhookBody): IncomingMessage | null {
  const text = body.Body?.trim();
  const from = body.From;
  if (!text || !from) return null;
  return { from, text };
}

// ── Send a WhatsApp message via Twilio REST API ───────────────────────────────

export async function sendTwilioMessage(
  accountSid: string,
  authToken: string,
  from: string,  // "whatsapp:+14155238886"
  to: string,    // "whatsapp:+255754711960"
  body: string,
): Promise<void> {
  const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
  const params = new URLSearchParams({ From: from, To: to, Body: body });

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`Twilio API ${res.status}: ${JSON.stringify(err)}`);
  }
}

// ── Webhook signature validation ──────────────────────────────────────────────

export function validateTwilioSignature(
  authToken: string,
  url: string,
  params: Record<string, string>,
  signature: string,
): boolean {
  const data = url + Object.keys(params).sort().map((k) => k + params[k]).join('');
  const expected = crypto.createHmac('sha1', authToken).update(data).digest('base64');
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}
