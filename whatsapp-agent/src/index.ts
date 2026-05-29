import express, { Request, Response } from 'express';
import { extractTwilioMessage, sendTwilioMessage, TwilioWebhookBody, validateTwilioSignature } from './whatsapp.js';
import { handleMessage, streamMessage } from './agent.js';

const {
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_WHATSAPP_NUMBER,  // e.g. "whatsapp:+14155238886"
  PORT = '3000',
} = process.env;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false })); // Twilio sends form-encoded bodies

// CORS — allow the website and local dev to call the chat endpoint
app.use((req, res, next) => {
  const allowed = [
    'https://biashara-pos.com',
    'https://www.biashara-pos.com',
    'https://amashashi.github.io',
    'http://localhost:4321',
    'http://localhost:4322',
    'http://localhost:3000',
  ];
  const origin = req.headers.origin ?? '';
  if (allowed.includes(origin)) res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  if (req.method === 'OPTIONS') { res.sendStatus(204); return; }
  next();
});

// ── Web Chat ──────────────────────────────────────────────────────────────────

app.post('/chat/stream', async (req: Request, res: Response) => {
  const { sessionId, message } = req.body as { sessionId?: string; message?: string };

  if (!sessionId || !message?.trim()) {
    res.status(400).json({ error: 'sessionId and message are required' });
    return;
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  try {
    for await (const chunk of streamMessage(sessionId, message.trim())) {
      res.write(`data: ${JSON.stringify({ text: chunk })}\n\n`);
    }
    res.write('data: [DONE]\n\n');
  } catch (err) {
    console.error('Chat stream error:', err);
    res.write(`data: ${JSON.stringify({ error: 'Something went wrong' })}\n\n`);
  } finally {
    res.end();
  }
});

// ── Twilio WhatsApp Webhook ───────────────────────────────────────────────────

app.post('/webhook/twilio', (req: Request, res: Response) => {
  // Validate Twilio signature if auth token is configured
  if (TWILIO_AUTH_TOKEN) {
    const signature = req.headers['x-twilio-signature'] as string ?? '';
    const url = `https://${req.headers.host}${req.originalUrl}`;
    const valid = validateTwilioSignature(TWILIO_AUTH_TOKEN, url, req.body, signature);
    if (!valid) {
      console.warn('Invalid Twilio signature — request rejected');
      res.sendStatus(403);
      return;
    }
  }

  // Respond to Twilio immediately with empty TwiML (avoids 15-second timeout)
  res.set('Content-Type', 'text/xml');
  res.send('<Response></Response>');

  const incoming = extractTwilioMessage(req.body as TwilioWebhookBody);
  if (!incoming || !TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_WHATSAPP_NUMBER) return;

  void (async () => {
    try {
      console.log(`[WA ${incoming.from}] ${incoming.text}`);
      const reply = await handleMessage(incoming.from, incoming.text);
      console.log(`[bot → ${incoming.from}] ${reply.slice(0, 80)}…`);
      await sendTwilioMessage(
        TWILIO_ACCOUNT_SID!,
        TWILIO_AUTH_TOKEN!,
        TWILIO_WHATSAPP_NUMBER!,
        incoming.from,
        reply,
      );
    } catch (err) {
      console.error('Twilio handler error:', err);
    }
  })();
});

// ── Health ────────────────────────────────────────────────────────────────────

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.listen(parseInt(PORT), () => {
  console.log(`Biashara POS agent listening on port ${PORT}`);
  if (!TWILIO_ACCOUNT_SID) console.log('  ⚠  Twilio vars not set — WhatsApp webhook disabled');
});
