# Dev.to Article Tracker — New Posts by Tag

Track new dev.to articles by tag. Get the title, description, author,
reaction/comment counts, and link the moment a new post goes live.

Built for content marketing and DevRel teams researching what's being
published on a topic, and for anyone curating a digest of a tag without
refreshing dev.to by hand.

## Input

```json
{
  "tag": "rust",
  "minReactions": 0,
  "daysBack": 7,
  "maxResults": 25
}
```

| Field | Type | Description |
|---|---|---|
| `tag` | string (optional) | dev.to tag to filter by, e.g. `"rust"`, `"webdev"`, `"javascript"`, `"ai"`. Leave blank for all recent articles. |
| `minReactions` | number | Only return articles with at least this many public reactions. Default `0`. |
| `daysBack` | number | How many days back from today to search, by publish date. Default `7`, max `90`. |
| `maxResults` | number | Max articles to return, most recently published first. Default `25`, max `100`. |

## Output

One record per article:

```json
{
  "id": 4399163,
  "title": "Serving Gemma4 with Rust on vLLM",
  "description": "Step-by-step: getting vLLM's Rust frontend built and running on an aarch64 EC2 G5g box.",
  "tags": ["rust", "vllm", "aws", "cuda"],
  "author": "xbill",
  "organization": "Google Developer Experts",
  "publicReactionsCount": 0,
  "commentsCount": 0,
  "readingTimeMinutes": 10,
  "publishedAt": "2026-08-14T20:43:34Z",
  "url": "https://dev.to/gde/serving-gemma4-with-rust-for-vllm-372l"
}
```

A search with no matching articles returns no items but is still billed
once for the search.

## How it works

Direct calls to the official [dev.to (Forem)
API](https://developers.forem.com/api) (`dev.to/api`) — no proxy, no
key, no scraping. Free and open, no registration required.

## Pricing note

Billed per **search**, not per article returned — one charge whether
the search returns 0 articles or 100.

## Related products

- [Stack Overflow Question Tracker](https://github.com/timmKal01/stackoverflow-question-tracker) — the Q&A/support-signal counterpart to this actor's article/content-marketing signal
