import { useEffect, useState, type RefObject } from 'react';
import snapshot from '../data/stats.json';
import type { OpenSourceItem } from '../content';

export type PubStats = { version?: string; points: number; maxPoints: number; likes: number; downloads30d: number };
export type VsStats = { version?: string; installs: number; rating: number | null; ratingCount: number };
export type Stats = { fetchedAt?: string; pub: Record<string, PubStats>; vscode: Record<string, VsStats> };
export type StatsState = { stats: Stats; live: boolean };

const fetchJson = async (url: string, init?: RequestInit) => {
  const res = await fetch(url, { ...init, signal: AbortSignal.timeout(8000) });
  if (!res.ok) throw new Error(String(res.status));
  return res.json();
};

async function fetchPub(name: string): Promise<[string, PubStats]> {
  const s = await fetchJson(`https://pub.dev/api/packages/${name}/score`);
  return [name, { points: s.grantedPoints, maxPoints: s.maxPoints, likes: s.likeCount, downloads30d: s.downloadCount30Days }];
}

async function fetchVs(ids: string[]): Promise<Record<string, VsStats>> {
  const data = await fetchJson('https://marketplace.visualstudio.com/_apis/public/gallery/extensionquery', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json;api-version=7.2-preview.1' },
    // filterType 7 = extension name (publisher.name); flags 256 = include statistics
    body: JSON.stringify({ filters: [{ criteria: ids.map((value) => ({ filterType: 7, value })) }], flags: 256 }),
  });
  type Ext = { publisher: { publisherName: string }; extensionName: string; statistics?: { statisticName: string; value: number }[] };
  const out: Record<string, VsStats> = {};
  for (const ext of data.results[0].extensions as Ext[]) {
    const stat = (n: string) => ext.statistics?.find((s) => s.statisticName === n)?.value;
    out[`${ext.publisher.publisherName}.${ext.extensionName}`] = {
      installs: Math.round(stat('install') ?? 0),
      rating: stat('averagerating') ?? null,
      ratingCount: stat('ratingcount') ?? 0,
    };
  }
  return out;
}

/**
 * Starts from the build-time snapshot (so prerendered HTML has real numbers),
 * then refreshes from the public APIs once the section nears the viewport.
 * Any failure silently keeps the snapshot.
 */
export function useLiveStats(items: OpenSourceItem[], watch: RefObject<HTMLElement | null>): StatsState {
  const [state, setState] = useState<StatsState>({ stats: snapshot as Stats, live: false });

  useEffect(() => {
    const el = watch.current;
    if (!el) return;
    let done = false;
    const load = async () => {
      const pubIds = items.filter((i) => i.registry === 'pub.dev').map((i) => i.id);
      const vsIds = items.filter((i) => i.registry === 'VS Code').map((i) => i.id);
      const [pub, vs] = await Promise.allSettled([Promise.all(pubIds.map(fetchPub)), fetchVs(vsIds)]);
      if (done || (pub.status === 'rejected' && vs.status === 'rejected')) return;
      setState(({ stats }) => ({
        live: pub.status === 'fulfilled' && vs.status === 'fulfilled',
        stats: {
          fetchedAt: new Date().toISOString(),
          pub: { ...stats.pub, ...(pub.status === 'fulfilled' ? Object.fromEntries(pub.value) : {}) },
          vscode: { ...stats.vscode, ...(vs.status === 'fulfilled' ? vs.value : {}) },
        },
      }));
    };
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        load().catch(() => {});
      },
      { rootMargin: '600px 0px' },
    );
    io.observe(el);
    return () => {
      done = true;
      io.disconnect();
    };
  }, [items, watch]);

  return state;
}

const compact = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 });
export const formatCount = (n: number) => compact.format(n);
