import express, { Request, Response } from 'express';
import { extractTextMessage, markAsRead, sendMessage, WhatsAppWebhookBody } from './whatsapp.js';
import { handleMessage } from './agent.js';

const {
  WHATSAPP_VERIFY_TOKEN,
  WHATSAPP_ACCESS_TOKEN,
  WHATSAPP_PHONE_NUMBER_ID,
  PORT = '3000',
} = process.env;

if (!WHATSAPP_VERIFY_TOKEN || !WHATSAPP_ACCESS_TOKEN || !WHATSAPP_PHONE_NUMBER_ID) {
  console.error('Missing required env vars: WHATSAPP_VERIFY_TOKEN, WHATSAPP_ACCESS_TOKEN, WHATSAPP_PHONE_NUMBER_ID');
  process.exit(1);
}

const app = express();
app.use(express.json());

// Meta webhook verification handshake
app.get('/webhook', (req: Request, res: Response) => {
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

// Incoming WhatsApp messages
app.post('/webhook', (req: Request, res: Response) => {
  const body = req.body as WhatsAppWebhookBody;

  if (body.object !== 'whatsapp_business_account') {
    res.sendStatus(404);
    return;
  }

  // Respond to Meta within 5 s — process asynchronously
  res.sendStatus(200);

  const incoming = extractTextMessage(body);
  if (!incoming) return;

  // Mark message read and process in background
  void markAsRead(WHATSAPP_PHONE_NUMBER_ID!, WHATSAPP_ACCESS_TOKEN!, incoming.messageId);

  void (async () => {
    try {
      console.log(`[${incoming.from}] ${incoming.text}`);
      const reply = await handleMessage(incoming.from, incoming.text);
      console.log(`[bot → ${incoming.from}] ${reply.slice(0, 80)}…`);
      await sendMessage(WHATSAPP_PHONE_NUMBER_ID!, WHATSAPP_ACCESS_TOKEN!, incoming.from, reply);
    } catch (err) {
      console.error('Error processing message:', err);
      // Send a graceful fallback so the user isn't left hanging
      await sendMessage(
        WHATSAPP_PHONE_NUMBER_ID!,
        WHATSAPP_ACCESS_TOKEN!,
        incoming.from,
        'Sorry, I ran into an issue. Please try again or email hello@biasharapos.com for help.',
      ).catch(() => {});
    }
  })();
});

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.listen(parseInt(PORT), () => {
  console.log(`Biashara POS WhatsApp agent listening on port ${PORT}`);
});
