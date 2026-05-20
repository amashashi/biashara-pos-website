const GRAPH_API_URL = 'https://graph.facebook.com/v19.0';

export interface WhatsAppWebhookBody {
  object: string;
  entry: Array<{
    id: string;
    changes: Array<{
      value: {
        messaging_product?: string;
        messages?: Array<{
          from: string;
          id: string;
          type: string;
          text?: { body: string };
          timestamp: string;
        }>;
        statuses?: unknown[];
      };
      field: string;
    }>;
  }>;
}

export interface IncomingMessage {
  from: string;
  text: string;
  messageId: string;
}

export function extractTextMessage(body: WhatsAppWebhookBody): IncomingMessage | null {
  const message = body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
  if (!message || message.type !== 'text' || !message.text?.body) return null;
  return { from: message.from, text: message.text.body, messageId: message.id };
}

export async function sendMessage(
  phoneNumberId: string,
  accessToken: string,
  to: string,
  text: string,
): Promise<void> {
  const res = await fetch(`${GRAPH_API_URL}/${phoneNumberId}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to,
      type: 'text',
      text: { body: text },
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`WhatsApp API ${res.status}: ${JSON.stringify(err)}`);
  }
}

export async function markAsRead(
  phoneNumberId: string,
  accessToken: string,
  messageId: string,
): Promise<void> {
  await fetch(`${GRAPH_API_URL}/${phoneNumberId}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      status: 'read',
      message_id: messageId,
    }),
  }).catch(() => {}); // non-critical — ignore failures
}
