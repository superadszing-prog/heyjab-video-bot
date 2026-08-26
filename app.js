const API_TIMEOUT_MS = 8000;
const RAILWAY_API_BASE_URL = "https://heyjab-video-bot-api-production.up.railway.app";

function normalizeBaseUrl(url) {
  return typeof url === "string" ? url.trim().replace(/\/+$/, "") : "";
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

async function checkHealth(baseUrl) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

  try {
    const response = await fetch(`${baseUrl}/health`, {
      method: "GET",
      signal: controller.signal,
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return true;
  } finally {
    clearTimeout(timeout);
  }
}

async function resolveApiBaseUrl() {
  const runtimeOverride = normalizeBaseUrl(window.HEYJAB_API_BASE_URL);
  const optionalCustomDomainOverride = normalizeBaseUrl(
    window.HEYJAB_CUSTOM_DOMAIN_API_BASE_URL
  );
  const candidates = unique([
    runtimeOverride,
    RAILWAY_API_BASE_URL,
    optionalCustomDomainOverride,
  ]);

  for (const candidate of candidates) {
    try {
      await checkHealth(candidate);
      return candidate;
    } catch (_) {
      // Try next candidate.
    }
  }

  throw new Error("No healthy API endpoint found.");
}

async function boot() {
  const statusElement = document.getElementById("status");
  if (!statusElement) return;

  try {
    const apiBaseUrl = await resolveApiBaseUrl();
    statusElement.textContent = "✅ App is reachable. API base URL: ";
    const codeElement = document.createElement("code");
    codeElement.textContent = apiBaseUrl;
    statusElement.appendChild(codeElement);
  } catch (error) {
    statusElement.textContent =
      "❌ Frontend loaded, but no healthy API endpoint is reachable right now.";
  }
}

void boot();
