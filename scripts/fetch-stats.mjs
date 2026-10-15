// Snapshots pub.dev + VS Code Marketplace stats into src/data/stats.json at
// build time. The page refreshes these live on load; this file is the
// fallback when the APIs are slow or unreachable. A failed fetch keeps the
// previous snapshot instead of failing the build.
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const PUB_PUBLISHER = 'jneela.dev';
const VSCODE_PUBLISHER = 'JashwanthNeela';
const out = fileURLToPath(new URL('../src/data/stats.json', import.meta.url));

const getJson = async (url, init) => {
  const res = await fetch(url, { ...init, signal: AbortSignal.timeout(15000) });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.json();
};

async function pubDev() {
  const search = await getJson(`https://pub.dev/api/search?q=publisher:${PUB_PUBLISHER}`);
  const entries = await Promise.all(
    search.packages.map(async ({ package: name }) => {
      const [score, info] = await Promise.all([
        getJson(`https://pub.dev/api/packages/${name}/score`),
        getJson(`https://pub.dev/api/packages/${name}`),
      ]);
      return [
        name,
        {
          version: info.latest.version,
          points: score.grantedPoints,
          maxPoints: score.maxPoints,
          likes: score.likeCount,
          downloads30d: score.downloadCount30Days,
        },
      ];
    }),
  );
  return Object.fromEntries(entries);
}

async function marketplace() {
  const data = await getJson('https://marketplace.visualstudio.com/_apis/public/gallery/extensionquery', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json;api-version=7.2-preview.1',
    },
    // filterType 18 = publisher name; flags 914 = include versions + statistics
    body: JSON.stringify({
      filters: [{ criteria: [{ filterType: 18, value: VSCODE_PUBLISHER }], pageSize: 100 }],
      flags: 914,
    }),
  });
  const entries = data.results[0].extensions.map((ext) => {
    const stat = (name) => ext.statistics?.find((s) => s.statisticName === name)?.value;
    return [
      `${ext.publisher.publisherName}.${ext.extensionName}`,
      {
        version: ext.versions?.[0]?.version,
        installs: Math.round(stat('install') ?? 0),
        rating: stat('averagerating') ?? null,
        ratingCount: stat('ratingcount') ?? 0,
      },
    ];
  });
  return Object.fromEntries(entries);
}

const previous = JSON.parse(await readFile(out, 'utf8').catch(() => '{"pub":{},"vscode":{}}'));
const [pub, vscode] = await Promise.allSettled([pubDev(), marketplace()]);

for (const [label, r] of [['pub.dev', pub], ['marketplace', vscode]]) {
  if (r.status === 'rejected') console.warn(`[stats] ${label} failed, keeping previous snapshot:`, r.reason.message);
}

const next = {
  fetchedAt: pub.status === 'fulfilled' || vscode.status === 'fulfilled' ? new Date().toISOString() : previous.fetchedAt,
  pub: pub.status === 'fulfilled' ? pub.value : previous.pub,
  vscode: vscode.status === 'fulfilled' ? vscode.value : previous.vscode,
};

await writeFile(out, JSON.stringify(next, null, 2) + '\n');
console.log(`[stats] ${Object.keys(next.pub).length} packages, ${Object.keys(next.vscode).length} extensions → src/data/stats.json`);
