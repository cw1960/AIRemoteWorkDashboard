/** Text helpers shared by adapters. */

/** Collapses whitespace and trims; returns null for empty input. */
export function cleanText(text: string | null | undefined): string | null {
  const cleaned = (text ?? "").replace(/\s+/g, " ").trim();
  return cleaned === "" ? null : cleaned;
}

/** Headings, lines that are all bold ("**About the role**"), and short
 * "Label: value" lines ("Location: Remote") are not summary material. */
function isLabelLine(line: string): boolean {
  const trimmed = line.trim();
  return (
    /^#{1,6}\s/.test(trimmed) ||
    /^\*\*[^*]+\*\*:?$/.test(trimmed) ||
    (trimmed.length < 60 && /^[\p{L} /&-]{1,30}:(\s|$)/u.test(trimmed))
  );
}

function plain(markdown: string): string | null {
  return cleanText(
    markdown
      .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
      .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
      .replace(/^\s{0,3}(>|[-*+]|\d+\.)\s+/gm, "")
      .replace(/[*_`~#]+/g, ""),
  );
}

/** Paragraphs shorter than this are headings or fragments, not a summary. */
const MIN_SUMMARY_LENGTH = 40;

/**
 * A short plain-text summary from a (markdown) description: the first
 * sentence-length paragraph without formatting, cut at a sentence end or
 * word boundary. We store a summary only, never the full description.
 */
export function summarize(
  markdown: string | null | undefined,
  maxLength = 280,
): string | null {
  const paragraphs = (markdown ?? "")
    .split(/\n\s*\n/)
    .map((block) =>
      plain(
        block
          .split("\n")
          .filter((line) => !isLabelLine(line))
          .join("\n"),
      ),
    )
    .filter((block): block is string => block !== null);
  const firstParagraph =
    paragraphs.find((block) => block.length >= MIN_SUMMARY_LENGTH) ??
    paragraphs[0];
  if (!firstParagraph) return null;
  if (firstParagraph.length <= maxLength) return firstParagraph;

  const cut = firstParagraph.slice(0, maxLength);
  const sentenceEnd = cut.lastIndexOf(". ");
  if (sentenceEnd >= maxLength / 2) return cut.slice(0, sentenceEnd + 1);
  const wordEnd = cut.lastIndexOf(" ");
  return `${cut.slice(0, wordEnd > 0 ? wordEnd : maxLength - 1).trimEnd()}…`;
}

/**
 * Parses a source timestamp. Sources send UTC without an offset
 * ("2026-09-28T23:46:06" or "2026-09-28 19:40:05"); we read those as UTC.
 */
export function toIsoUtc(value: string | null | undefined): string | null {
  if (!value) return null;
  const normalized = value.trim().replace(" ", "T");
  const withZone = /(?:[zZ]|[+-]\d{2}:?\d{2})$/.test(normalized)
    ? normalized
    : `${normalized}Z`;
  const time = Date.parse(withZone);
  return Number.isNaN(time) ? null : new Date(time).toISOString();
}
