# heyjab-video-bot

One-click app URL (platform-generated, no custom DNS/TLS dependency):

- **https://video-bot-jab.netlify.app**
- GitHub Pages fallback URL: **https://superadszing-prog.github.io/heyjab-video-bot/**

## Deployment architecture

- **Frontend:** static app deployed with Netlify from this repository.
- **Backend API:** Railway service (`https://heyjab-video-bot-api-production.up.railway.app`).
- **Frontend URL:** Netlify site (`https://video-bot-jab.netlify.app`)
- **Custom domain (`https://api.heyjab.com`)** is treated as optional and non-blocking.

## API base URL behavior

The frontend tries API endpoints in this order and uses the first healthy one:

1. `window.HEYJAB_API_BASE_URL` (optional runtime override)
2. `https://heyjab-video-bot-api-production.up.railway.app` (reliable default/fallback)
3. `window.HEYJAB_CUSTOM_DOMAIN_API_BASE_URL` (optional custom-domain candidate, tried only if higher-priority endpoints fail)

This guarantees a working production path even if custom-domain TLS/DNS is not ready.
Duplicate values are de-duplicated, so the same URL is not retried multiple times.

Runtime overrides can be injected before loading `app.js`, for example:

```html
<script>
  window.HEYJAB_API_BASE_URL = "https://api.heyjab.com";
  window.HEYJAB_CUSTOM_DOMAIN_API_BASE_URL = "https://api.heyjab.com";
</script>
```

## Minimal deploy notes

1. Push to `main` (or run workflow manually).
2. Netlify deploy preview/production publish serves the static site from repository root.
3. Open the URL above.
4. SPA routing is handled via `_redirects` (`/* /index.html 200`).

## Optional domain polish (not required for first success path)

- Point a custom frontend domain to Netlify only after DNS/TLS is healthy.
- Keep Railway URL as the stable backend fallback in frontend runtime config.
