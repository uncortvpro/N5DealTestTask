import Anthropic from "@anthropic-ai/sdk";

let client: Anthropic | null | undefined;

/** Lazily constructed — returns null (not thrown) when no key is configured,
 * so match explanations degrade to "not available" instead of crashing the
 * asset detail page for everyone. */
export function getAnthropicClient(): Anthropic | null {
  if (client !== undefined) return client;
  const apiKey = process.env.ANTHROPIC_API_KEY;
  client = apiKey ? new Anthropic({ apiKey }) : null;
  return client;
}
