import Anthropic from '@anthropic-ai/sdk';
import { SYSTEM_PROMPT } from './knowledge.js';

const client = new Anthropic();

// Per-user conversation history keyed by WhatsApp phone number
const conversations = new Map<string, Anthropic.MessageParam[]>();
const MAX_HISTORY = 20; // keep last 20 turns to bound token usage

export async function handleMessage(phoneNumber: string, userText: string): Promise<string> {
  if (!conversations.has(phoneNumber)) {
    conversations.set(phoneNumber, []);
  }
  const history = conversations.get(phoneNumber)!;

  history.push({ role: 'user', content: userText });

  // Trim oldest turns when limit is exceeded (keep context bounded)
  if (history.length > MAX_HISTORY) {
    history.splice(0, history.length - MAX_HISTORY);
  }

  const response = await client.messages.create({
    model: 'claude-opus-4-7',
    max_tokens: 1024,
    // Stable system prompt is cached — saves tokens on every repeated call
    system: [
      {
        type: 'text',
        text: SYSTEM_PROMPT,
        cache_control: { type: 'ephemeral' },
      },
    ],
    messages: history,
  });

  const reply = response.content
    .filter((b): b is Anthropic.TextBlock => b.type === 'text')
    .map((b) => b.text)
    .join('');

  history.push({ role: 'assistant', content: reply });

  return reply;
}

// Clear conversation history for a user (e.g., after inactivity)
export function clearHistory(phoneNumber: string): void {
  conversations.delete(phoneNumber);
}
