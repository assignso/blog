import rss from "@astrojs/rss";
import { HOME } from "@consts";
import { getPublishedPosts } from "@lib/posts";

type Context = {
  site: string
}

export async function GET(context: Context) {
  const items = await getPublishedPosts();

  return rss({
    title: HOME.TITLE,
    description: HOME.DESCRIPTION,
    site: context.site,
    items: items.map((item) => ({
      title: item.data.title,
      description: item.data.description,
      pubDate: item.data.date,
      link: `/blog/${item.data.slug}/`,
    })),
  });
}
