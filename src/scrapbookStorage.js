export const FORMAT_VERSION = 2;

export const DEFAULT_ITEMS = [
  {
    id: 1,
    type: "image",
    src: "https://konvajs.org/assets/yoda.jpg",
    x: 120,
    y: 120,
    scaleX: 0.5,
    scaleY: 0.5,
    rotation: 0,
  },
];

/** One page = array of layer items */
export const DEFAULT_PAGES = [DEFAULT_ITEMS];

function isValidItem(item) {
  if (!item || typeof item.id !== "number" || typeof item.type !== "string") return false;
  if (item.type === "text") return typeof item.text === "string";
  if (item.type === "image" || item.type === "sticker") return typeof item.src === "string";
  return false;
}

function clampPageIndex(index, pageCount) {
  if (pageCount <= 0) return 0;
  return Math.max(0, Math.min(index, pageCount - 1));
}

/**
 * Validates exported / saved JSON (same shape as downloadScrapbookFile output).
 * Returns { pages, pageIndex } or null.
 */
export function parseScrapbookPayload(data) {
  if (!data || typeof data !== "object") return null;

  if (data.version === FORMAT_VERSION && Array.isArray(data.pages)) {
    const pages = data.pages.map((pg) => (Array.isArray(pg) ? pg.filter(isValidItem) : []));
    if (pages.length === 0) return null;
    const pageIndex = clampPageIndex(
      typeof data.pageIndex === "number" ? data.pageIndex : 0,
      pages.length
    );
    return { pages, pageIndex };
  }

  if (Array.isArray(data.items)) {
    const items = data.items.filter(isValidItem);
    if (items.length === 0) return null;
    return { pages: [items], pageIndex: 0 };
  }

  return null;
}

/** Fresh session when not loading a file — clones defaults so state is not shared by reference. */
export function getDefaultAppState() {
  return {
    pages: DEFAULT_PAGES.map((page) => page.map((item) => ({ ...item }))),
    pageIndex: 0,
  };
}

export function serializeScrapbook({ pages, pageIndex }) {
  return JSON.stringify({ version: FORMAT_VERSION, pages, pageIndex }, null, 2);
}

export function downloadScrapbookFile({ pages, pageIndex }) {
  const json = serializeScrapbook({ pages, pageIndex });
  const blob = new Blob([json], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  const stamp = new Date().toISOString().slice(0, 19).replace(/T/, "_").replace(/:/g, "-");
  a.download = `scrapbook-${stamp}.json`;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
