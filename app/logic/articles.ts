import { ARTICLES } from "~/content/articles-meta";

/** Карточки статей по списку slug; без списка — все. */
export const articlesBySlugs = (slugs?: string[]) => ARTICLES.filter((a) => !slugs || slugs.includes(a.slug));

/** Все статьи, кроме текущей, — блок «Читать дальше». */
export const otherArticleSlugs = (slug: string) => ARTICLES.filter((a) => a.slug !== slug).map((a) => a.slug);
