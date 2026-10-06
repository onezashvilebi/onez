// Посадочные страницы под направления: преимущества и снятие барьеров.
// Текст пишется сразу на трёх языках (как build-in-georgia, закон 3): у
// лендинга рекламный копирайт, который словарь передаёт хуже авторской версии.
export type LandingPage = {
  metaTitle: string;
  metaDescription: string;
  crumb: string;
  heroEyebrow: string;
  heroTitle: string;
  heroLead: string;
  heroMore: string;
  ctaPrimary: string;
  ctaSecondary: string;
  /** Куда ведёт вторая, текстовая ссылка: slug страницы услуги этого направления. */
  serviceLink: string;
  /** Карточка: [значок из icons.tsx, заголовок, текст] — у каждой свой знак, а не общий ромб. */
  advantages: { eyebrow: string; title: string; intro: string; items: [string, string, string][] };
  barriers: { eyebrow: string; title: string; intro: string; items: [string, string][] };
  spec: { eyebrow: string; title: string; head: [string, string]; rows: [string, string][] };
  faq: { eyebrow: string; title: string; items: [string, string][] };
  contact: { eyebrow: string; title: string; text: string; objtype: string };
  serviceName: string;
};
