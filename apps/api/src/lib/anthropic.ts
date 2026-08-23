import Anthropic from "@anthropic-ai/sdk";

let client: Anthropic | null | undefined;

// The SDK's default timeout is measured in minutes, and defaults to 2
// retries with backoff on top — fine for a batch job, not for a request a
// browser is waiting on. A single 15s attempt, no retries, stays well
// under App Platform's gateway timeout so a slow/hung call fails as our
// own clean error response instead of a 504 from the platform's proxy.
const REQUEST_TIMEOUT_MS = 15_000;

/** Lazily constructed — returns null (not thrown) when no key is configured,
 * so match explanations degrade to "not available" instead of crashing the
 * asset detail page for everyone. */
export function getAnthropicClient(): Anthropic | null {
  if (client !== undefined) return client;
  const apiKey = process.env.ANTHROPIC_API_KEY;
  client = apiKey ? new Anthropic({ apiKey, timeout: REQUEST_TIMEOUT_MS, maxRetries: 0 }) : null;
  return client;
}
