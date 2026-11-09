# MMD 307 Pixel Quest

موقع مذاكرة لمادة **Multimedia Programming (MMD 307)**، بستايل pixel art:
شرح محاضرات 2 لـ 6 بالعربي والمصطلحات إنجليزي، كويز تدريبي على كل محاضرة، كويز شامل، وامتحان ميد تجريبي محلول ومشروح.

Made by [Ahmed Salman](https://dev.uniskills.pro/).

## Structure

| Path | What it is |
|------|------------|
| `src/index.html` | The whole app in one file (content, quizzes, character, styles). Edit this. |
| `tools/build.js` | Builds the SEO-ready static site from `src/index.html`. |
| `site/` | Built output, ready to deploy (15 pages, sitemap, robots, OG image, icons). |

## Build

```bash
npm install
npx playwright install chromium
npm run build -- https://your-domain.com
```

The domain argument is used for canonical URLs, Open Graph tags and the sitemap (default: `https://mmd307.uniskills.pro`).

## Deploy

Deploy the `site/` folder to any static host (Vercel, Netlify, Cloudflare Pages, GitHub Pages).
Set the output / publish directory to `site` with no build command, since the built files are committed.

After deploying, add the domain to Google Search Console and submit `/sitemap.xml`.
