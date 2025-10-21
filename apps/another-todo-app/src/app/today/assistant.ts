"use server";

// Server action to interpret natural language input for Today page.
// If AI SDKs are available, this can call a model with tool-calling
// and return structured actions. For now, it gracefully falls back
// to a simple heuristic that treats the input as a new todo.

export type TodayAction =
  | { type: 'add'; text: string }
  | { type: 'toggle'; id: string }
  | { type: 'noop' };

export async function processTodayInput(input: string): Promise<TodayAction[]> {
  const text = (input || '').trim();
  if (!text) return [{ type: 'noop' }];

  // Try AI path if available (optional at runtime)
  try {
    // Dynamically require to avoid build-time dependency if SDKs are absent
    /* eslint-disable @typescript-eslint/no-var-requires */
    const { generateText } = require('ai');
    const { createOpenAI } = require('@ai-sdk/openai');

    const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const model = openai('gpt-4o-mini');

    const res = await generateText({
      model,
      system:
        'You are a todo assistant. Extract a single user intent as JSON. Allowed intents: add(text), noop.',
      prompt: `User input: "${text}". Respond with a compact JSON like {"intent":"add","text":"..."} or {"intent":"noop"}.`,
    });

    try {
      const parsed = JSON.parse(res.text || '{}');
      if (parsed.intent === 'add' && typeof parsed.text === 'string' && parsed.text.trim()) {
        return [{ type: 'add', text: parsed.text.trim() }];
      }
      return [{ type: 'noop' }];
    } catch(e) {
      // fallthrough to heuristic
      console.log(e)
    }
  } catch(e) {
    // SDKs not available or disabled; fall through to heuristic
    console.log(e)
  }

  // Heuristic fallback: treat the whole text as a todo
  return [{ type: 'add', text }];
}

