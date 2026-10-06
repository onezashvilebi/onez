import { PROJECTS, type Category, type Project } from "~/content/projects";
import { pad2 } from "~/lib/format";

export type CategoryFilter = Category | "all";

export const filterByCategory = (items: Project[], category: CategoryFilter) => (category === "all" ? items : items.filter((p) => p.cat === category));

/** Номер объекта в каталоге: «01» … */
export const projectNumber = (p: Project) => pad2(PROJECTS.indexOf(p) + 1);

/** Следующий объект по кругу — для ссылки «Следующий». */
export const nextProject = (p: Project) => PROJECTS[(PROJECTS.indexOf(p) + 1) % PROJECTS.length]!;

/** Объекты той же категории; если их нет — любые другие. */
export function similarProjects(p: Project, limit = 3): Project[] {
  const same = PROJECTS.filter((q) => q.cat === p.cat && q !== p).slice(0, limit);
  return same.length ? same : PROJECTS.filter((q) => q !== p).slice(0, limit);
}

/** Три числа героя страницы объекта: площадь, срок, год. */
export function projectStats(p: Project): { value: string; label: string }[] {
  const [termValue, ...termUnit] = p.term.split(" ");
  return [
    { value: p.area.split(" м²")[0]!, label: "м²<br>площадь" },
    { value: termValue!, label: `${termUnit.join(" ")}<br>строительства` },
    { value: p.year, label: "год<br>сдачи" },
  ];
}

export function projectSpec(p: Project): [string, string][] {
  return [["Тип", p.type], ["Площадь", p.area], ["Расположение", p.place], ["Этажность", p.floors], ["Срок строительства", p.term], ["Год сдачи", p.year], ["Готовность", "Под отделку"], ["Цена по договору", "Не изменилась"]];
}
