import type { IconName } from "@/lib/icons";

/*
 * A sample edition of the Monday briefing, written to show the format and the standard.
 * It describes patterns, not specific cases, agencies or firms. Replace it with a live
 * edition once one can be published openly.
 *
 * The shapes below are the contract a CMS entry has to fill: an edition is a list of
 * asset cards, each with a short headline and one visual. Visuals are a closed set of
 * types so an editor picks one and fills its fields; the site owns how each is drawn.
 * Figures in the sample visuals are placeholders, not findings.
 */

/** one visual per card, picked by `type` */
export type AssetVisual =
  /** a message path with the stages where it breaks */
  | { type: "flow"; steps: string[]; breaks: number[] }
  /** a few labelled categories, each with an icon */
  | { type: "types"; items: { icon: IconName; label: string }[] }
  /** the roles a story lands on */
  | { type: "roles"; items: string[] }
  /** a short to-do, the first `done` items ticked */
  | { type: "checklist"; items: string[]; done: number }
  /** a small bar series; `highlight` marks one bar */
  | { type: "bars"; values: number[]; highlight?: number }
  /** a hub with spokes, for routes and networks */
  | { type: "network"; nodes: number }
  /** two sides and the gap between them */
  | { type: "gap"; left: string; right: string };

/**
 * The motif composition behind a card's visual, from the site's own marks: a monogram piece
 * (arc = A, gate = B, hook = C, bowl = D), the section rings, the seal, or the cream ellipse
 * round the whole mark. Optional: left out, one is picked from the card's id.
 */
export const ASSET_MOTIFS = ["arc", "gate", "hook", "bowl", "rings", "seal", "ellipse"] as const;
export type AssetMotif = (typeof ASSET_MOTIFS)[number];

/** the card's own motif, or a stable pick from its id so a CMS entry without one still varies */
export function motifFor(asset: Pick<BriefingAsset, "id" | "motif">): AssetMotif {
  if (asset.motif) return asset.motif;
  let h = 0;
  for (const ch of asset.id) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return ASSET_MOTIFS[h % ASSET_MOTIFS.length];
}

export type BriefingAsset = {
  id: string;
  /** the editorial desk: Regulation, Enforcement, Sanctions… */
  theme: string;
  /** what kind of piece it is, shown as the card's kicker */
  kind: string;
  /** one line; the card is the visual, not the copy */
  title: string;
  visual: AssetVisual;
  /** the composition behind the visual */
  motif?: AssetMotif;
  /** locked assets are shown out of focus with the invitation over them */
  locked?: boolean;
};

export type BriefingEdition = {
  /** the lead story, open to everyone */
  lead: BriefingAsset & { dek: string };
  /** cards that unpack the lead */
  support: BriefingAsset[];
  /** the rest of the edition */
  more: BriefingAsset[];
};

export const EDITION: BriefingEdition = {
  lead: {
    id: "travel-rule-exceptions",
    motif: "arc",
    theme: "Regulation",
    kind: "Lead",
    title: "Travel Rule supervision now asks one thing: show us your exceptions.",
    dek: "The questions have moved from vendor choice to the messages that fail.",
    visual: {
      type: "flow",
      steps: ["Originator", "Message sent", "Counterparty VASP", "Data match", "Release"],
      breaks: [2, 3],
    },
  },
  support: [
    {
      id: "where-it-fails",
    motif: "hook",
      theme: "Regulation",
      kind: "Where it fails",
      title: "Three exception types draw the questions.",
      visual: {
        type: "types",
        items: [
          { icon: "personOff", label: "Unhosted wallets" },
          { icon: "xCircle", label: "Counterparty can’t receive" },
          { icon: "eyeOff", label: "Released before a match" },
        ],
      },
    },
    {
      id: "who-it-lands-on",
    motif: "seal",
      theme: "Regulation",
      kind: "Who it lands on",
      title: "Three owners, one queue.",
      visual: { type: "roles", items: ["MLRO", "Travel Rule ops", "VASP due diligence"] },
    },
    {
      id: "this-week",
    motif: "gate",
      theme: "Regulation",
      kind: "This week",
      title: "Audit last quarter’s exceptions.",
      visual: { type: "checklist", items: ["Pull the queue", "A decision on each", "A named owner"], done: 1 },
    },
  ],
  more: [
    {
      id: "aml-thresholds",
    motif: "rings",
      theme: "Enforcement",
      kind: "Analysis",
      title: "What a “reasonable” monitoring threshold now looks like.",
      visual: { type: "bars", values: [38, 52, 44, 70, 61, 88], highlight: 5 },
      locked: true,
    },
    {
      id: "scam-stablecoin-pairs",
    motif: "ellipse",
      theme: "Financial crime",
      kind: "Typology",
      title: "Scam proceeds through new stablecoin pairs.",
      visual: { type: "network", nodes: 6 },
      locked: true,
    },
    {
      id: "bridge-gap",
    motif: "bowl",
      theme: "Sanctions",
      kind: "Control gap",
      title: "The cross-chain bridge gap in screening.",
      visual: { type: "gap", left: "Chain A", right: "Chain B" },
      locked: true,
    },
    {
      id: "board-report",
    motif: "gate",
      theme: "Action",
      kind: "Checklist",
      title: "Three questions before your board report.",
      visual: { type: "checklist", items: ["Coverage", "Tuning", "Ownership"], done: 0 },
      locked: true,
    },
  ],
};
