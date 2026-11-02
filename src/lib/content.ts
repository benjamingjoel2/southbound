import { getCollection } from 'astro:content';

type WithPublishing = { data: { status: 'draft' | 'reviewed'; sources: unknown[]; order: number } };

/** Publishing rule: reviewed + sourced, nothing else. */
export function isPublishable(e: WithPublishing) {
  return e.data.status === 'reviewed' && e.data.sources.length > 0;
}

export async function guidePages() {
  return (await getCollection('guide')).filter(isPublishable).sort((a, b) => a.data.order - b.data.order);
}

export async function questionPages() {
  return (await getCollection('questions')).filter(isPublishable).sort((a, b) => a.data.order - b.data.order);
}
