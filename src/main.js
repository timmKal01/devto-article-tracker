import { Actor, log } from 'apify';
import { fetchArticles } from './devto.js';

await Actor.init();

const input = (await Actor.getInput()) ?? {};
const { tag, minReactions = 0, daysBack = 7, maxResults = 25 } = input;

/** Must match the event name configured in this Actor's pay-per-event pricing on Apify. */
const ARTICLE_SEARCH_EVENT = 'article-search';

const startDate = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000);

const articles = await fetchArticles({
    tag,
    minReactions,
    startDate,
    maxResults: Math.min(maxResults, 100),
});

for (const article of articles) {
    await Actor.pushData(article);
}

await Actor.charge({ eventName: ARTICLE_SEARCH_EVENT });

log.info(`Pushed ${articles.length} article(s)`);

await Actor.exit();
