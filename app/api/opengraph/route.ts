import { lookup } from "node:dns/promises";
import { isIP } from "node:net";

const MAX_HTML_BYTES = 2_000_000;
const MAX_REDIRECTS = 3;

type OpenGraphData = {
  title: string;
  description: string;
  thumbnail: string | null;
  url: string;
};

function isPrivateAddress(address: string) {
  const normalized = address.toLowerCase();

  if (normalized === "::" || normalized === "::1" || normalized.startsWith("fc") || normalized.startsWith("fd")) return true;
  if (/^fe[89ab]/.test(normalized)) return true;
  if (normalized.startsWith("::ffff:")) return isPrivateAddress(normalized.slice(7));
  if (isIP(normalized) !== 4) return false;

  const [a, b] = normalized.split(".").map(Number);
  return (
    a === 0 ||
    a === 10 ||
    a === 127 ||
    a >= 224 ||
    (a === 100 && b >= 64 && b <= 127) ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    (a === 198 && (b === 18 || b === 19))
  );
}

async function assertPublicUrl(value: string) {
  const url = new URL(value);

  if (!['http:', 'https:'].includes(url.protocol)) throw new Error("HTTP 또는 HTTPS 주소만 사용할 수 있습니다.");
  if (url.username || url.password) throw new Error("인증 정보가 포함된 주소는 사용할 수 없습니다.");
  if (url.hostname === "localhost" || url.hostname.endsWith(".localhost")) throw new Error("내부 주소는 사용할 수 없습니다.");

  const addresses = isIP(url.hostname)
    ? [{ address: url.hostname }]
    : await lookup(url.hostname, { all: true, verbatim: true });

  if (!addresses.length || addresses.some(({ address }) => isPrivateAddress(address))) {
    throw new Error("내부 주소는 사용할 수 없습니다.");
  }

  return url;
}

async function fetchHtml(input: string) {
  let currentUrl = await assertPublicUrl(input);

  for (let redirectCount = 0; redirectCount <= MAX_REDIRECTS; redirectCount += 1) {
    const response = await fetch(currentUrl, {
      redirect: "manual",
      signal: AbortSignal.timeout(8_000),
      headers: {
        accept: "text/html,application/xhtml+xml",
        "user-agent": "OneBiteLinkBot/1.0",
      },
    });

    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location");
      if (!location || redirectCount === MAX_REDIRECTS) throw new Error("리디렉션이 너무 많습니다.");
      currentUrl = await assertPublicUrl(new URL(location, currentUrl).toString());
      continue;
    }

    if (!response.ok) throw new Error(`페이지를 불러오지 못했습니다. (${response.status})`);

    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.includes("text/html") && !contentType.includes("application/xhtml+xml")) {
      throw new Error("HTML 페이지 주소를 입력해주세요.");
    }

    const contentLength = Number(response.headers.get("content-length") ?? 0);
    if (contentLength > MAX_HTML_BYTES) throw new Error("페이지 크기가 너무 큽니다.");

    const reader = response.body?.getReader();
    if (!reader) throw new Error("페이지 내용을 읽을 수 없습니다.");

    const chunks: Uint8Array[] = [];
    let received = 0;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      received += value.byteLength;
      if (received > MAX_HTML_BYTES) {
        await reader.cancel();
        throw new Error("페이지 크기가 너무 큽니다.");
      }
      chunks.push(value);
    }

    const bytes = new Uint8Array(received);
    let offset = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.byteLength;
    }

    return { html: new TextDecoder().decode(bytes), finalUrl: currentUrl.toString() };
  }

  throw new Error("페이지를 불러오지 못했습니다.");
}

function decodeEntities(value: string) {
  const entities: Record<string, string> = { amp: "&", quot: '"', apos: "'", lt: "<", gt: ">", nbsp: " " };
  return value.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (match, entity: string) => {
    if (entity.startsWith("#")) {
      const hex = entity[1]?.toLowerCase() === "x";
      const codePoint = Number.parseInt(entity.slice(hex ? 2 : 1), hex ? 16 : 10);
      return Number.isFinite(codePoint) ? String.fromCodePoint(codePoint) : match;
    }
    return entities[entity.toLowerCase()] ?? match;
  }).trim();
}

function getMeta(html: string, keys: string[]) {
  for (const tag of html.match(/<meta\b[^>]*>/gi) ?? []) {
    const attributes = new Map<string, string>();
    for (const match of tag.matchAll(/([\w:-]+)\s*=\s*(["'])(.*?)\2/gi)) {
      attributes.set(match[1].toLowerCase(), match[3]);
    }

    const key = (attributes.get("property") ?? attributes.get("name") ?? "").toLowerCase();
    if (keys.includes(key) && attributes.get("content")) return decodeEntities(attributes.get("content")!);
  }
  return "";
}

function extractOpenGraph(html: string, finalUrl: string): OpenGraphData {
  const url = new URL(finalUrl);
  const titleTag = html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "";
  const title = getMeta(html, ["og:title", "twitter:title"]) || decodeEntities(titleTag) || url.hostname;
  const description = getMeta(html, ["og:description", "twitter:description", "description"]);
  const image = getMeta(html, ["og:image", "og:image:url", "twitter:image", "twitter:image:src"]);

  let thumbnail: string | null = null;
  if (image) {
    try {
      const resolved = new URL(image, url);
      if (["http:", "https:"].includes(resolved.protocol)) thumbnail = resolved.toString();
    } catch {
      thumbnail = null;
    }
  }

  return { title, description, thumbnail, url: finalUrl };
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as { url?: unknown };
    if (typeof body.url !== "string" || !body.url.trim() || body.url.length > 2_048) {
      return Response.json({ error: "올바른 URL을 입력해주세요." }, { status: 400 });
    }

    const input = /^https?:\/\//i.test(body.url.trim()) ? body.url.trim() : `https://${body.url.trim()}`;
    const { html, finalUrl } = await fetchHtml(input);
    return Response.json(extractOpenGraph(html, finalUrl));
  } catch (error) {
    const message = error instanceof Error ? error.message : "오픈 그래프 정보를 가져오지 못했습니다.";
    return Response.json({ error: message }, { status: 400 });
  }
}
