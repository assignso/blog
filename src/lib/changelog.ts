import { getCollection, type CollectionEntry } from "astro:content";

export async function getPublishedProductUpdates(): Promise<CollectionEntry<"changelog">[]> {
  const updates = await getCollection("changelog");

  return updates
    .filter((update) => !update.data.draft)
    .sort((a, b) => {
      const dateOrder = b.data.date.valueOf() - a.data.date.valueOf();
      return dateOrder || b.id.localeCompare(a.id);
    });
}
