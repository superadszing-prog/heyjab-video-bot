# heyjab-video-bot

One-click app URL (platform-generated, no custom DNS/TLS dependency):

- **https://superadszing-prog.github.io/heyjab-video-bot/**

## Deployment architecture

- **Frontend:** static app deployed with GitHub Pages from this repository.
- **Backend API:** Railway service (`https://heyjab-video-bot-api-production.up.railway.app`).
- **Custom domain (`https://api.heyjab.com`)** is treated as optional and non-blocking.

## API base URL behavior

The frontend tries API endpoints in this order and uses the first healthy one:

1. `window.HEYJAB_API_BASE_URL` (optional runtime override)
2. `https://heyjab-video-bot-api-production.up.railway.app` (reliable default/fallback)
3. `window.HEYJAB_CUSTOM_DOMAIN_API_BASE_URL` (optional custom-domain candidate, tried only if higher-priority endpoints fail)

This guarantees a working production path even if custom-domain TLS/DNS is not ready.

## Minimal deploy notes

1. Push to `main` (or run workflow manually).
2. GitHub Actions workflow **Deploy frontend to GitHub Pages** publishes the site.
3. Open the URL above.

## Optional domain polish (not required for first success path)

- Point a custom frontend domain to GitHub Pages only after DNS/TLS is healthy.
- Keep Railway URL as fallback in frontend runtime config.
