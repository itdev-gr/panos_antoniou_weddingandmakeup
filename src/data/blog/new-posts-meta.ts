export const NEW_POST_ORDER = [
  'bridalBoudoirLounge',
  'santoriniWeddingVenue',
  'marriageProposalSantorini',
  'sameSexWeddingsSantorini',
  'elopingSantorini2026',
  'santoriniWeddingMakeup',
] as const;

export type NewPostKey = (typeof NEW_POST_ORDER)[number];

export const NEW_POST_SLUGS: Record<NewPostKey, string> = {
  bridalBoudoirLounge: 'bridal-boudoir-getting-ready-lounge',
  santoriniWeddingVenue: 'choose-santorini-wedding-venue',
  marriageProposalSantorini: 'marriage-proposal-santorini',
  sameSexWeddingsSantorini: 'same-sex-weddings-santorini',
  elopingSantorini2026: 'eloping-santorini-guide-2026',
  santoriniWeddingMakeup: 'wedding-makeup-santorini-heat-wind',
};
