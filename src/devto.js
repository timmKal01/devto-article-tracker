const BASE_URL = 'https://dev.to/api/articles';

export async function fetchArticles({ tag, minReactions, startDate, maxResults }) {
    const url = new URL(BASE_URL);
    if (tag) url.searchParams.set('tag', tag);
    // Articles come back newest-first; fetch extra to absorb the client-side date/reaction filtering below.
    url.searchParams.set('per_page', String(Math.min(maxResults * 3, 100)));

    const res = await fetch(url, { headers: { Connection: 'close' } });
    if (!res.ok) {
        throw new Error(`dev.to API request failed: ${res.status} ${res.statusText}`);
    }
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
