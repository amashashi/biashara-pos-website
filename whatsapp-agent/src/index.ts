import express, { Request, Response } from 'express';
import { extractTextMessage, markAsRead, sendMessage, WhatsAppWebhookBody } from './whatsapp.js';
import { handleMessage, streamMessage } from './agent.js';

const {
  WHATSAPP_VERIFY_TOKEN,
  WHATSAPP_ACCESS_TOKEN,
  WHATSAPP_PHONE_NUMBER_ID,
  PORT = '3000',
} = process.env;

const app = express();
app.use(express.json());

// CORS — allow the website and local dev to call the chat endpoint
app.use((req, res, next) => {
  const allowed = ['https://amashashi.github.io', 'http://localhost:4321', 'http://localhost:3000'];
  const origin = req.headers.origin ?? '';
  if (allowed.includes(origin)) res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  if (req.method === 'OPTIONS') { res.sendStatus(204); return; }
  next();
});

// ── Web Chat ──────────────────────────────────────────────────────────────────

// Streaming SSE endpoint consumed by the chat widget on the website
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

// ── WhatsApp Webhook ──────────────────────────────────────────────────────────

app.get('/webhook', (req: Request, res: Response) => {
  if (!WHATSAPP_VERIFY_TOKEN) { res.sendStatus(503); return; }
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];
  if (mode === 'subscribe' && token === WHATSAPP_VERIFY_TOKEN) {
    console.log('Webhook verified by Meta');
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

app.post('/webhook', (req: Request, res: Response) => {
  const body = req.body as WhatsAppWebhookBody;
  if (body.object !== 'whatsapp_business_account') { res.sendStatus(404); return; }

  res.sendStatus(200);

  const incoming = extractTextMessage(body);
  if (!incoming || !WHATSAPP_ACCESS_TOKEN || !WHATSAPP_PHONE_NUMBER_ID) return;

  void markAsRead(WHATSAPP_PHONE_NUMBER_ID, WHATSAPP_ACCESS_TOKEN, incoming.messageId);

  void (async () => {
    try {
      console.log(`[WA ${incoming.from}] ${incoming.text}`);
      const reply = await handleMessage(incoming.from, incoming.text);
      await sendMessage(WHATSAPP_PHONE_NUMBER_ID, WHATSAPP_ACCESS_TOKEN, incoming.from, reply);
    } catch (err) {
      console.error('WhatsApp handler error:', err);
      await sendMessage(
        WHATSAPP_PHONE_NUMBER_ID!,
        WHATSAPP_ACCESS_TOKEN!,
        incoming.from,
        'Sorry, I ran into an issue. Please try again or email hello@biasharapos.com',
      ).catch(() => {});
    }
  })();
});

// ── Health ────────────────────────────────────────────────────────────────────

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.listen(parseInt(PORT), () => {
  console.log(`Biashara POS agent listening on port ${PORT}`);
  if (!WHATSAPP_VERIFY_TOKEN) console.log('  ⚠  WhatsApp vars not set — webhook disabled');
});
