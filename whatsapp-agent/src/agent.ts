import Anthropic from '@anthropic-ai/sdk';
import { SYSTEM_PROMPT } from './knowledge.js';

const client = new Anthropic();

const conversations = new Map<string, Anthropic.MessageParam[]>();
const MAX_HISTORY = 20;

const systemBlock: Anthropic.Messages.TextBlockParam[] = [
  {
    type: 'text',
    text: SYSTEM_PROMPT,
    cache_control: { type: 'ephemeral' }, // cached — saves tokens on every repeated call
  },
];

function getHistory(id: string): Anthropic.MessageParam[] {
  if (!conversations.has(id)) conversations.set(id, []);
  return conversations.get(id)!;
}

function trimHistory(history: Anthropic.MessageParam[]): void {
  if (history.length > MAX_HISTORY) history.splice(0, history.length - MAX_HISTORY);
}

// Used by WhatsApp webhook — returns full reply at once
export async function handleMessage(id: string, userText: string): Promise<string> {
  const history = getHistory(id);
  history.push({ role: 'user', content: userText });
  trimHistory(history);

  const response = await client.messages.create({
    model: 'claude-opus-4-7',
    max_tokens: 1024,
    system: systemBlock,
    messages: history,
  });

  const reply = response.content
    .filter((b): b is Anthropic.TextBlock => b.type === 'text')
    .map((b) => b.text)
    .join('');

  history.push({ role: 'assistant', content: reply });
  return reply;
}

// Used by web chat widget — yields text chunks as they stream
export async function* streamMessage(id: string, userText: string): AsyncGenerator<string> {
  const history = getHistory(id);
  history.push({ role: 'user', content: userText });
  trimHistory(history);

  const stream = client.messages.stream({
    model: 'claude-opus-4-7',
    max_tokens: 1024,
    system: systemBlock,
    messages: history,
  });

  let fullText = '';

  for await (const event of stream) {
    if (
      event.type === 'content_block_delta' &&
      event.delta.type === 'text_delta'
    ) {
      fullText += event.delta.text;
      yield event.delta.text;
    }
  }

  history.push({ role: 'assistant', content: fullText });
}

export function clearHistory(id: string): void {
  conversations.delete(id);
}
