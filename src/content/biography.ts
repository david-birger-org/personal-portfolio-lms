import { readdir } from "node:fs/promises";
import path from "node:path";

export type BiographyImageGroup = [string] | [string, string];
export type BiographyImageSelection = BiographyImageGroup | [];

const BIOGRAPHY_IMAGE_PATTERN = /^(.*?)-(1|2)\.(jpe?g|png|webp|avif)$/i;
const BIOGRAPHY_SECTION_IMAGE_ALIASES: Record<string, string> = {
  childhood: "childhood",
  adolescence: "adolescence",
  "beginning in the gym": "beginning-in-the-gym",
  "interest in bodybuilding and first competitions":
    "interest-in-bodybuilding-and-first-competitions",
  "development of natural bodybuilding in ukraine":
    "development-of-natural-bodybuilding-in-ukraine",
  "earning wnbf pro status and the first international tournament":
    "earning-wnbf-pro-status-and-the-first-international-tournament",
  "path of neptune": "path-of-neptune",
  "memorable 2025 competitive season": "memorable-2025-competitive-season",
  дитинство: "childhood",
  "підлітковий вік": "adolescence",
  "початок занять у залі": "beginning-in-the-gym",
  "зацікавлення бодібілдингом та перші змагання":
    "interest-in-bodybuilding-and-first-competitions",
  "розвиток натурального бодібілдингу в україні":
    "development-of-natural-bodybuilding-in-ukraine",
  "здобуття статусу wnbf pro та перший міжнародний турнір":
    "earning-wnbf-pro-status-and-the-first-international-tournament",
  "шлях нептуна": "path-of-neptune",
  "памятний змагальний сезон 2025": "memorable-2025-competitive-season",
};

function normalizeToken(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFC")
    .replace(/[’']/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeSectionHeading(value: string) {
  return normalizeToken(value).replace(/-/g, " ");
}

export async function discoverBiographyImagesBySeries(): Promise<
  Record<string, BiographyImageGroup>
> {
  const imagesDirectory = path.join(process.cwd(), "public", "images");
  const files = await readdir(imagesDirectory, { withFileTypes: true });

  const groupedFiles = new Map<string, { first?: string; second?: string }>();

  for (const file of files) {
    if (!file.isFile()) {
      continue;
    }

    const match = file.name.match(BIOGRAPHY_IMAGE_PATTERN);
    if (!match) {
      continue;
    }

    const series = normalizeToken(match[1]);
    const slot = match[2];
    const current = groupedFiles.get(series) ?? {};

    if (slot === "1") {
      current.first = file.name;
    }

    if (slot === "2") {
      current.second = file.name;
    }

    groupedFiles.set(series, current);
  }

  const imagesBySeries: Record<string, BiographyImageGroup> = {};

  for (const [series, group] of [...groupedFiles.entries()].sort(([a], [b]) =>
    a.localeCompare(b),
  )) {
    if (group.first && group.second) {
      imagesBySeries[series] = [
        `/images/${group.first}`,
        `/images/${group.second}`,
      ];
      continue;
    }

    if (group.first) {
      imagesBySeries[series] = [`/images/${group.first}`];
      continue;
    }

    if (group.second) {
      imagesBySeries[series] = [`/images/${group.second}`];
    }
  }

  return imagesBySeries;
}

export function resolveBiographyImageGroup(
  sectionTitle: string,
  imagesBySeries: Record<string, BiographyImageGroup>,
): BiographyImageSelection {
  const normalizedHeading = normalizeSectionHeading(sectionTitle);
  const mappedSeries = BIOGRAPHY_SECTION_IMAGE_ALIASES[normalizedHeading];

  if (mappedSeries && imagesBySeries[mappedSeries]) {
    return imagesBySeries[mappedSeries];
  }

  const fallbackSeries = normalizeToken(sectionTitle);
  return imagesBySeries[fallbackSeries] ?? [];
}
