import type { ReactNode } from "react";
import { cn } from "~/lib/cn";
import { Eyebrow, T } from "./primitives";

export type SectionBg = "dark" | "panel" | "copper";

const BG: Record<SectionBg, string> = {
  dark: "bg-ink",
  panel: "bg-panel",
  copper: "on-copper bg-copper text-ink-deep",
};

const LAYOUT = {
  /** Заголовок слева, содержимое справа (4 : 7). */
  "two-col": "grid items-start gap-10 lg:grid-cols-[4fr_7fr] lg:gap-[8.333%]",
  /** Боковая навигация и тело текстовой страницы (3 : 8). */
  page: "grid items-start gap-10 lg:grid-cols-[3fr_8fr] lg:gap-[8.333%]",
};

/** Секция с системным фоном. Каждая смысловая секция начинается с SectionHead или SideHead. */
export function Section({ bg = "panel", layout, id, className, containerClassName, children }: { bg?: SectionBg; layout?: keyof typeof LAYOUT; id?: string; className?: string; containerClassName?: string; children: ReactNode }) {
  return (
    <section id={id} className={cn("section-y relative overflow-hidden", BG[bg], className)}>
      <div className={cn("container-site", layout && LAYOUT[layout], containerClassName)}>{children}</div>
    </section>
  );
}

/** Шкала h2 сайта: все размеры заголовков секций — только отсюда. */
const H2_SIZE = {
  /** Первая секция после героя, объекты, этапы. */
  lg: "text-[clamp(32px,9.5vw,44px)] leading-[1.07] sm:text-[clamp(38px,4.2vw,64px)]",
  /** Обычная секция. */
  sm: "text-[clamp(30px,3.2vw,48px)] leading-[1.08] max-sm:[overflow-wrap:anywhere]",
  /** Медная секция заявки. */
  contact: "text-[clamp(32px,9.5vw,44px)] leading-[1.07] sm:text-[clamp(40px,4.2vw,62px)]",
  /** Блок «О компании» рядом с фото. */
  about: "text-[clamp(32px,9.5vw,44px)] leading-[1.08] sm:text-[clamp(38px,3.7vw,56px)]",
  /** Полоса-призыв CtaBand. */
  band: "text-[clamp(30px,3.4vw,52px)] leading-[1.08]",
};

export type H2Size = keyof typeof H2_SIZE;

export function H2({ children, size = "sm", className, id }: { children: string; size?: H2Size; className?: string; id?: string }) {
  return <T as="h2" id={id} className={cn(H2_SIZE[size], className)}>{children}</T>;
}

type HeadProps = { eyebrow: string; title: string; size?: H2Size };

/**
 * Надзаголовок + h2. С intro — пояснение справа (split-head); с aside —
 * свой блок справа (фильтр, счётчик), className тогда задаёт выравнивание.
 */
export function SectionHead({ eyebrow, title, intro, aside, size = "sm", className }: HeadProps & { intro?: string; aside?: ReactNode; className?: string }) {
  const head = (
    <>
      <Eyebrow>{eyebrow}</Eyebrow>
      <H2 size={size}>{title}</H2>
    </>
  );
  if (aside !== undefined) {
    return (
      <div className={cn("reveal flex justify-between", className ?? "items-end gap-6")}>
        <div>{head}</div>
        {aside}
      </div>
    );
  }
  if (!intro) return <div className={cn("reveal", className)}>{head}</div>;
  return (
    <div className={cn("reveal grid items-end gap-6 sm:grid-cols-[2fr_1fr] sm:gap-[72px]", className)}>
      <div>{head}</div>
      <T as="p" className="mb-1 max-w-[390px] leading-[1.75] text-muted sm:ml-auto">{intro}</T>
    </div>
  );
}

export const STAGE_TEXT = "mt-[22px] max-w-[720px] text-[clamp(16px,1.2vw,18px)] leading-[1.65] text-paper-dim";

/** Левая колонка раскладки two-col. */
export function SideHead({ eyebrow, title, text }: { eyebrow: string; title: string; text?: string }) {
  return (
    <div className="reveal">
      <Eyebrow>{eyebrow}</Eyebrow>
      <H2>{title}</H2>
      {text && <T as="p" className={STAGE_TEXT}>{text}</T>}
    </div>
  );
}

type SectionProps = { bg?: SectionBg; id?: string; className?: string; children?: ReactNode };

/** Самая частая секция: SectionHead сверху, содержимое ниже. */
export function TitledSection({ eyebrow, title, intro, size, bg, id, className, children }: HeadProps & SectionProps & { intro?: string }) {
  return (
    <Section bg={bg} id={id} className={className}>
      <SectionHead eyebrow={eyebrow} title={title} intro={intro} size={size} />
      {children}
    </Section>
  );
}

/** Секция two-col: SideHead слева, содержимое справа. */
export function SplitSection({ eyebrow, title, text, bg, id, className, children }: HeadProps & SectionProps & { text?: string }) {
  return (
    <Section bg={bg} id={id} className={className} layout="two-col">
      <SideHead eyebrow={eyebrow} title={title} text={text} />
      {children}
    </Section>
  );
}

/** Текстовый блок: крупный лид, абзацы, затем children (FactNote, действия). Не шире 720 px. */
export function TextBlock({ lead, paragraphs = [], children }: { lead?: string; paragraphs?: string[]; children?: ReactNode }) {
  return (
    <div className="reveal max-w-[820px]">
      {lead && <T as="p" className="mb-[22px] text-[clamp(19px,1.8vw,26px)] leading-[1.5] text-paper">{lead}</T>}
      <div className="space-y-[18px]">
        {paragraphs.map((p) => (
          <T key={p} as="p" className="max-w-[720px] text-[clamp(15px,1.2vw,18px)] leading-[1.75] text-muted">{p}</T>
        ))}
      </div>
      {children}
    </div>
  );
}

/** Готовая текстовая секция: заголовок слева, текст справа. */
export function TextSection({ eyebrow, title, lead, paragraphs, children, bg = "panel", id }: { eyebrow: string; title: string; lead?: string; paragraphs?: string[]; children?: ReactNode; bg?: SectionBg; id?: string }) {
  return (
    <Section bg={bg} id={id} layout="two-col">
      <div>
        <Eyebrow>{eyebrow}</Eyebrow>
        <H2>{title}</H2>
      </div>
      <TextBlock lead={lead} paragraphs={paragraphs}>{children}</TextBlock>
    </Section>
  );
}
