import { getCollection, type CollectionEntry } from "astro:content";

export async function getPublishedPosts(): Promise<CollectionEntry<"posts">[]> {
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
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}
