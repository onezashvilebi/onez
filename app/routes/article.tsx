import { useLocation, type MetaFunction } from "react-router";
import { PageHero, UpdatedNote } from "~/components/blocks/PageHero";
import { FaqSection, RelatedArticles } from "~/components/blocks/sections";
import { ARTICLE_BODIES } from "~/content/article-bodies";
import { ARTICLES, ARTICLE_SERVICE } from "~/content/articles-meta";
import { seo } from "~/lib/meta";
import { otherArticleSlugs } from "~/logic/articles";
import { bySlugOr404, crumbs } from "~/logic/routing";

function articleFor(pathname: string) {
  const meta = bySlugOr404(ARTICLES, pathname);
  const body = ARTICLE_BODIES[meta.slug];
  if (!body) throw new Response(null, { status: 404 });
  return { meta, body };
}

export const meta: MetaFunction = (args) => {
  const { meta: a, body } = articleFor(args.location.pathname);
  return seo(args, `${a.name} — статьи ONEZA Construction`, a.text, {
    image: a.hero,
    crumbs: crumbs(["stati", "Статьи"], a.name),
    faq: body.faq,
    article: { published: a.published, modified: a.modified },
  });
};

export default function Article() {
  const { meta: a, body } = articleFor(useLocation().pathname);
  return (
    <>
      <PageHero eyebrow={`Статья · ${a.tag}`} title={a.title} lead={body.lead} crumbs={crumbs(["stati", "Статьи"], a.name)} image={a.hero} titleSize="long">
        <UpdatedNote slug={a.slug} published={a.published} />
      </PageHero>
      {body.sections}
      <FaqSection items={body.faq} />
      <RelatedArticles slugs={otherArticleSlugs(a.slug)} title="Читать<br><em>дальше</em>" services={ARTICLE_SERVICE[a.slug]} />
      {body.contact}
    </>
  );
}
