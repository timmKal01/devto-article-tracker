const BASE_URL = 'https://dev.to/api/articles';

const TRANSIENT_STATUSES = new Set([429, 500, 502, 503, 504]);
const MAX_ATTEMPTS = 4;
const REQUEST_TIMEOUT_MS = 15_000;

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWithRetry(url) {
    let lastError;
    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
        let res;
        try {
            res = await fetch(url, { headers: { Connection: 'close' }, signal: controller.signal });
        } catch (err) {
            lastError = err.name === 'AbortError' ? new Error(`Request timed out after ${REQUEST_TIMEOUT_MS}ms: ${url}`) : err;
            if (attempt < MAX_ATTEMPTS) {
                await sleep(1000 * 2 ** (attempt - 1));
                continue;
            }
            throw lastError;
        } finally {
            clearTimeout(timeoutId);
        }
        if (res.ok) return res;
        if (!TRANSIENT_STATUSES.has(res.status)) {
            throw new Error(`dev.to API request failed: ${res.status} ${res.statusText}`);
        }
        lastError = new Error(`dev.to API request failed: ${res.status} ${res.statusText}`);
        if (attempt < MAX_ATTEMPTS) await sleep(1000 * 2 ** (attempt - 1));
    }
    throw lastError;
}

export async function fetchArticles({ tag, minReactions, startDate, maxResults }) {
    const url = new URL(BASE_URL);
    if (tag) url.searchParams.set('tag', tag);
    // Articles come back newest-first; fetch extra to absorb the client-side date/reaction filtering below.
    url.searchParams.set('per_page', String(Math.min(maxResults * 3, 100)));

    const res = await fetchWithRetry(url);
    const articles = await res.json();

    return articles
        .filter((a) => new Date(a.published_timestamp) >= startDate)
        .filter((a) => a.public_reactions_count >= minReactions)
        .slice(0, maxResults)
        .map((a) => ({
            id: a.id,
            title: a.title,
            description: a.description,
            tags: a.tag_list,
            author: a.user?.username ?? null,
            organization: a.organization?.name ?? null,
            publicReactionsCount: a.public_reactions_count,
            commentsCount: a.comments_count,
            readingTimeMinutes: a.reading_time_minutes,
            publishedAt: a.published_timestamp,
            url: a.url,
        }));
}
