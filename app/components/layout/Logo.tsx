import { Link } from "react-router";
import { useI18n } from "~/i18n/context";

export function Logo() {
  const { t, href } = useI18n();
  return (
    <Link to={href("")} aria-label={t("ONEZA Construction, на главную")} className="inline-flex flex-none items-center gap-[11px] font-display text-[15px] leading-none font-bold tracking-[-.07em] sm:text-[17px]">
      <span className="logo-mark" aria-hidden="true"><i /><i /><i /></span>
      {/* На телефонах в шапке рядом языки и три иконки связи: подпись прячется до 480 px,
          слово целиком — уже 375 px (остаётся знак, название — в aria-label ссылки). */}
      {/* Подпись растягивается ровно по ширине слова ONEZA: text-align-last: justify
          у строки в блоке, ширину которого задаёт крупное ONEZA над ней. */}
      <span className="inline-flex flex-col items-stretch max-[374px]:hidden">
        <span className="block">ONEZA</span>
        <small className="mt-1 block w-full text-justify font-body text-[7px] leading-none font-semibold tracking-[.06em] text-muted uppercase [text-align-last:justify] max-[479px]:hidden">construction</small>
      </span>
    </Link>
  );
}
