import { getCollection, type CollectionEntry } from "astro:content";

export async function getPublishedPosts(welcomeFirst = false): Promise<CollectionEntry<"posts">[]> {
  const posts = await getCollection("posts");
  const slugs = new Set<string>();

  for (const post of posts) {
    if (slugs.has(post.data.slug)) {
      throw new Error(`Duplicate post slug: ${post.data.slug}`);
    }
    slugs.add(post.data.slug);
  }

  return posts
    .filter((post) => !post.data.draft)
    .sort((a, b) => {
      if (welcomeFirst) {
        const welcome = Number(b.data.slug === "welcome-to-the-assign-blog")
          - Number(a.data.slug === "welcome-to-the-assign-blog");
        if (welcome) return welcome;
      }
      return b.data.date.valueOf() - a.data.date.valueOf()
        || a.data.slug.localeCompare(b.data.slug);
    });
}
