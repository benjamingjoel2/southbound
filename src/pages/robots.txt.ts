import type { APIRoute } from 'astro';
import { site } from '../../site.config.mjs';

// Search engines and AI crawlers are explicitly welcome: being citable is the point.
const agents = ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-SearchBot', 'Claude-User', 'anthropic-ai', 'PerplexityBot', 'Perplexity-User', 'Google-Extended', 'Googlebot', 'Bingbot', 'Applebot', 'Applebot-Extended', 'CCBot'];

export const GET: APIRoute = () => {
  const body = [
    ...agents.flatMap((a) => [`User-agent: ${a}`, 'Allow: /', '']),
    'User-agent: *',
    'Allow: /',
    '',
    `Sitemap: ${site.url}/sitemap-index.xml`,
    '',
  ].join('\n');
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
