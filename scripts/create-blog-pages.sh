#!/bin/bash
# Generate Astro blog page files for new posts

POSTS=(
  "bridal-boudoir-getting-ready-lounge:bridalBoudoirLounge"
  "choose-santorini-wedding-venue:santoriniWeddingVenue"
  "marriage-proposal-santorini:marriageProposalSantorini"
  "same-sex-weddings-santorini:sameSexWeddingsSantorini"
  "eloping-santorini-guide-2026:elopingSantorini2026"
  "wedding-makeup-santorini-heat-wind:santoriniWeddingMakeup"
)

ROOT="/Users/mario/Desktop/panos_antoniou_weddingandmakeup"

for entry in "${POSTS[@]}"; do
  slug="${entry%%:*}"
  key="${entry##*:}"

  cat > "$ROOT/src/pages/blog/${slug}.astro" << EOF
---
import BlogLayout from '../../layouts/BlogLayout.astro';
import BlogPostPage from '../../components/pages/BlogPostPage.astro';
import enDict from '../../i18n/en/blog';
import elDict from '../../i18n/el/blog';
import { isLocale, useTranslations, type Locale } from '../../i18n/utils';

const postKey = '${key}';
const lang: Locale = isLocale(Astro.currentLocale) ? Astro.currentLocale : 'en';
const t = useTranslations({ en: enDict, el: elDict }, lang);
---

<BlogLayout
  title={t(\`\${postKey}.meta.title\`)}
  description={t(\`\${postKey}.meta.description\`)}
  date={t(\`\${postKey}.date\`)}
  category={t(\`\${postKey}.category\`)}
  image={t(\`\${postKey}.image\`)}
>
  <BlogPostPage postKey={postKey} />
</BlogLayout>
EOF

  cat > "$ROOT/src/pages/el/blog/${slug}.astro" << EOF
---
import BlogLayout from '../../../layouts/BlogLayout.astro';
import BlogPostPage from '../../../components/pages/BlogPostPage.astro';
import enDict from '../../../i18n/en/blog';
import elDict from '../../../i18n/el/blog';
import { isLocale, useTranslations, type Locale } from '../../../i18n/utils';

const postKey = '${key}';
const lang: Locale = isLocale(Astro.currentLocale) ? Astro.currentLocale : 'en';
const t = useTranslations({ en: enDict, el: elDict }, lang);
---

<BlogLayout
  title={t(\`\${postKey}.meta.title\`)}
  description={t(\`\${postKey}.meta.description\`)}
  date={t(\`\${postKey}.date\`)}
  category={t(\`\${postKey}.category\`)}
  image={t(\`\${postKey}.image\`)}
>
  <BlogPostPage postKey={postKey} />
</BlogLayout>
EOF

  echo "Created pages for ${slug}"
done
