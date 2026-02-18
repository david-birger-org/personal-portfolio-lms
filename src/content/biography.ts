import {
  BIOGRAPHY_IMAGES_BY_SERIES,
  type BiographyImageGroup,
} from "@/content/biography-images";

export type BiographyImageSelection = BiographyImageGroup | [];

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

export function discoverBiographyImagesBySeries(): Record<
  string,
  BiographyImageGroup
> {
  return BIOGRAPHY_IMAGES_BY_SERIES;
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
