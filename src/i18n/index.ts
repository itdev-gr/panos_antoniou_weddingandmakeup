import enCommon from './en/common';
import elCommon from './el/common';

export const common = { en: enCommon, el: elCommon };

// Phase 1 agents append their namespace exports below. Each task owns one
// namespace and adds a single line. Keep this file as the single import
// surface for page sections.
