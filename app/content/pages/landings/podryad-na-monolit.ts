import type { Lang } from "~/site/pages";
import type { LandingPage } from "./types";

// Лендинг B2B: монолитные работы подрядом для застройщиков и генподрядчиков.
// Услуга — /fundamenty.
const ru: LandingPage = {
  metaTitle: "Подряд на монолитные работы в Тбилиси",
  metaDescription: "Монолитные работы подрядом для застройщиков: фундаменты, каркасы, перекрытия. Акты скрытых работ и контроль бетона.",
  crumb: "Подряд на монолит",
  heroEyebrow: "Застройщикам и генподрядчикам",
  heroTitle: "Монолитные работы<br><em>отдельным подрядом</em>",
  heroLead: "ONEZA Construction выполняет монолит на чужих объектах: фундаменты всех типов, колонны, стены цоколя, перекрытия, лестницы и каркасы целиком — от $140 / м². Своя опалубка на 6 000 м² перекрытий одновременно, свои бригады монолитчиков и арматурщиков, свой парк техники. Сроки этапов и объёмы фиксируются в договоре.",
  heroMore: "Мы выходим на объект со своим инженерно-техническим персоналом и исполнительной документацией: акты скрытых работ, приёмка армирования, контроль класса бетона и прочности в проектном возрасте. Если у вас есть свой технадзор или технадзор заказчика — работаем с ним напрямую, это наш обычный режим.",
  ctaPrimary: "Получить расчёт",
  ctaSecondary: "Как устроена фиксированная цена",
  serviceLink: "fundamenty",
  advantages: {
    eyebrow: "Что это даёт",
    title: "Чем полезен<br><em>отдельный подрядчик по монолиту?</em>",
    intro: "Монолит задаёт график всей стройки: пока не закрыт каркас, не начинаются ни фасад, ни инженерия. Поэтому его отдают тем, у кого есть ресурс держать темп.",
    items: [
      ["formwork", "Опалубка не в аренду", "Собственный парк на 6 000 м² перекрытий одновременно: цикл не зависит от того, освободился ли комплект у арендодателя."],
      ["team", "Свои бригады, не сборные", "Монолитчики и арматурщики в штате — 120 человек. Состав звена на объекте не меняется от недели к неделе."],
      ["document", "Исполнительная документация", "Акты скрытых работ, схемы армирования, журналы бетонирования и протоколы прочности — в том виде, в котором их примет технадзор."],
      ["clock", "Цикл, который можно ставить в график", "Темп перекрытий считается заранее и фиксируется этапами: вы планируете фасад и инженерию от реальной даты, а не от обещания."],
    ],
  },
  barriers: {
    eyebrow: "Что обычно мешает",
    title: "Почему меняют<br><em>подрядчика по монолиту</em>",
    intro: "Четыре типичные причины разрыва с предыдущим подрядчиком. Мы устраняем их организацией работ, а не обещаниями.",
    items: [
      ["«Геометрия ушла, дальше не встают окна и фасад»", "Оси и отметки выносятся инструментально и проверяются до бетонирования, опалубка выставляется по нивелиру. Отклонения фиксируются актом, а не обнаруживаются на этапе фасада."],
      ["«Бетон непонятного класса»", "Бетон принимается по документам завода с отбором проб; протоколы прочности в проектном возрасте передаются заказчику вместе с актами."],
      ["«Бригада исчезла в сезон»", "Люди и техника в штате и на балансе. Объект не останавливается из-за того, что бригада ушла на более выгодный заказ."],
      ["«Нет документов — технадзор не принимает этап»", "Исполнительная документация ведётся по ходу работ, а не собирается задним числом перед приёмкой."],
    ],
  },
  spec: {
    eyebrow: "Параметры",
    title: "Какие работы<br><em>берём подрядом?</em>",
    head: ["Параметр", "Значение"],
    rows: [
      ["Фундаменты", "Монолитная плита, ленточный, свайно-ростверковый"],
      ["Конструктив", "Колонны, стены цоколя, перекрытия, лестницы, каркас целиком"],
      ["Объекты", "Жилые корпуса, производственные здания, частные дома"],
      ["Ресурсы", "Своя техника и опалубка на 6 000 м² перекрытий одновременно"],
      ["Контроль", "Акты скрытых работ, приёмка армирования, контроль бетона"],
      ["Результат", "Конструктив с исполнительной документацией"],
    ],
  },
  faq: {
    eyebrow: "Вопросы подрядчика",
    title: "Что спрашивают<br><em>застройщики?</em>",
    items: [
      ["Сколько стоят монолитные работы?", "Ориентир 2026 года — от $140 / м² за монолитный каркас. Точная цена зависит от сложности узлов, насыщенности армирования, высоты и стеснённости площадки и считается по вашим чертежам."],
      ["Работаете ли вы по чужому проекту?", "Да, это основной формат подряда. Перед началом наш конструктор проверяет чертежи на исполнимость и сообщает о расхождениях до того, как они станут проблемой на площадке."],
      ["Кто отвечает за приёмку скрытых работ?", "Приёмку ведёт технадзор — ваш, заказчика или независимый. Мы готовим акты, схемы и протоколы и не закрываем работы без подписи."],
      ["Берёте ли вы объекты за пределами Тбилиси?", "Да, работаем по всей Грузии. Логистика опалубки и техники считается в смете отдельной строкой, чтобы стоимость выезда была видна заранее."],
    ],
  },
  contact: {
    eyebrow: "Следующий шаг",
    title: "Посчитаем<br><em>ваш монолит</em>",
    text: "Пришлите чертежи или объёмы по этапам — ответим в течение рабочего часа ценой за м² и сроком цикла.",
    objtype: "Фундамент или монолитные работы",
  },
  serviceName: "Фундаменты и монолитные работы",
};

const en: LandingPage = {
  metaTitle: "Concrete frame subcontracting in Tbilisi",
  metaDescription: "Monolithic works as a subcontract: foundations, frames and slabs, hidden-work acts and concrete control.",
  crumb: "Concrete subcontract",
  heroEyebrow: "For developers and main contractors",
  heroTitle: "Monolithic works<br><em>as a separate subcontract</em>",
  heroLead: "ONEZA Construction carries out concrete works on other parties' projects: foundations of every type, columns, basement walls, slabs, stairs and complete frames — from $140 / m². Our own formwork covers 6,000 m² of slabs at once, with in-house concrete and rebar crews and our own machinery. Stage dates and quantities are fixed in the contract.",
  heroMore: "We come on site with our own engineering staff and documentation: hidden-work acts, rebar acceptance, concrete class control and strength testing at design age. If you or your client already have a technical supervisor, we work with them directly — that is our normal mode.",
  ctaPrimary: "Request an assessment",
  ctaSecondary: "How the fixed price works",
  serviceLink: "fundamenty",
  advantages: {
    eyebrow: "What you get",
    title: "Why take a dedicated<br><em>concrete subcontractor?</em>",
    intro: "The frame sets the schedule of the whole project: until it is closed, neither the facade nor the services can start. That is why it goes to those who have the resources to hold the pace.",
    items: [
      ["formwork", "Formwork we own", "Enough sets for 6,000 m² of slabs at once: the cycle does not depend on a rental company freeing up a kit."],
      ["team", "In-house crews, not casual labour", "Concrete and rebar crews on staff — 120 people. The team on your site does not change from week to week."],
      ["document", "Documentation as built", "Hidden-work acts, rebar layouts, concreting logs and strength reports, in the form your supervisor will accept."],
      ["clock", "A cycle you can schedule", "The slab cycle is calculated in advance and fixed by stages, so you plan the facade and the services from a real date, not a promise."],
    ],
  },
  barriers: {
    eyebrow: "What usually goes wrong",
    title: "Why developers replace<br><em>their concrete subcontractor</em>",
    intro: "Four typical reasons a previous subcontractor is dismissed. We remove them by how the work is organised, not by promises.",
    items: [
      ["“The geometry drifted and the windows no longer fit”", "Axes and levels are set out instrumentally and checked before every pour, with the formwork levelled by instrument. Deviations are recorded by act, not discovered at facade stage."],
      ["“Concrete of unclear class”", "Concrete is accepted against plant documents with samples taken; strength reports at design age are handed to the client together with the acts."],
      ["“The crew vanished in high season”", "People and machinery are on our own payroll and balance sheet. The site does not stop because a crew left for a better-paying job."],
      ["“No paperwork, so the supervisor will not sign off”", "Documentation is kept as the work proceeds, not assembled retroactively before acceptance."],
    ],
  },
  spec: {
    eyebrow: "Parameters",
    title: "Which works<br><em>do we take on?</em>",
    head: ["Parameter", "Value"],
    rows: [
      ["Foundations", "Raft, strip, piled with pile caps"],
      ["Structure", "Columns, basement walls, slabs, stairs, complete frames"],
      ["Projects", "Residential buildings, industrial buildings, private houses"],
      ["Resources", "Own machinery and formwork for 6,000 m² of slabs at once"],
      ["Control", "Hidden-work acts, rebar acceptance, concrete control"],
      ["Result", "A structure delivered with as-built documentation"],
    ],
  },
  faq: {
    eyebrow: "Contractor questions",
    title: "What do developers<br><em>ask us?</em>",
    items: [
      ["What do monolithic works cost?", "2026 guide: from $140 / m² for the frame. The exact price depends on the complexity of the joints, the density of reinforcement, the height and how tight the site is, and is calculated from your drawings."],
      ["Do you work to someone else's design?", "Yes, that is the main format for a subcontract. Before starting, our structural engineer checks the drawings for buildability and reports discrepancies before they become a site problem."],
      ["Who accepts the hidden works?", "Acceptance is done by the technical supervisor — yours, the client's or an independent one. We prepare the acts, layouts and reports and never close works without a signature."],
      ["Do you take projects outside Tbilisi?", "Yes, we work across Georgia. Formwork and machinery logistics are a separate line in the estimate so the mobilisation cost is visible in advance."],
    ],
  },
  contact: {
    eyebrow: "Next step",
    title: "Let us price<br><em>your frame</em>",
    text: "Send the drawings or the quantities by stage — we reply within one working hour with a price per m² and a cycle time.",
    objtype: "Foundation or concrete works",
  },
  serviceName: "Foundations and monolithic works",
};

const ka: LandingPage = {
  metaTitle: "მონოლითური სამუშაოების ქვეკონტრაქტი",
  metaDescription: "მონოლითური სამუშაოები ქვეკონტრაქტით: საძირკვლები, კარკასები, გადახურვები, ფარული აქტები და ბეტონის კონტროლი.",
  crumb: "მონოლითის ქვეკონტრაქტი",
  heroEyebrow: "დეველოპერებსა და გენკონტრაქტორებს",
  heroTitle: "მონოლითური სამუშაოები<br><em>ცალკე ქვეკონტრაქტით</em>",
  heroLead: "ONEZA Construction ასრულებს მონოლითს სხვის ობიექტებზე: ყველა ტიპის საძირკველი, სვეტები, ცოკოლის კედლები, გადახურვები, კიბეები და კარკასი მთლიანად — $140 / მ²-დან. საკუთარი ყალიბები 6 000 მ² გადახურვაზე ერთდროულად, საკუთარი მონოლითჩიკებისა და არმატურჩიკების ბრიგადები, საკუთარი ტექნიკის პარკი. ეტაპების ვადები და მოცულობები ხელშეკრულებაში ფიქსირდება.",
  heroMore: "ობიექტზე გავდივართ საკუთარი საინჟინრო-ტექნიკური პერსონალითა და შემსრულებლის დოკუმენტაციით: ფარული სამუშაოების აქტები, არმირების მიღება, ბეტონის კლასისა და საპროექტო ასაკში სიმტკიცის კონტროლი. თუ გყავთ საკუთარი ან დამკვეთის ტექზედამხედველი — პირდაპირ მასთან ვმუშაობთ, ეს ჩვენი ჩვეული რეჟიმია.",
  ctaPrimary: "გამოთვლის მიღება",
  ctaSecondary: "როგორ მუშაობს ფიქსირებული ფასი",
  serviceLink: "fundamenty",
  advantages: {
    eyebrow: "რას იძლევა ეს",
    title: "რით არის სასარგებლო<br><em>ცალკე კონტრაქტორი მონოლითზე?</em>",
    intro: "მონოლითი მთელი მშენებლობის გრაფიკს განსაზღვრავს: სანამ კარკასი არ დაიხურება, არც ფასადი იწყება და არც ინჟინერია. ამიტომ მას აბარებენ მათ, ვისაც ტემპის შენარჩუნების რესურსი აქვს.",
    items: [
      ["formwork", "ყალიბები არა ქირით", "საკუთარი პარკი 6 000 მ² გადახურვაზე ერთდროულად: ციკლი არ არის დამოკიდებული იმაზე, გათავისუფლდა თუ არა კომპლექტი გამქირავებელთან."],
      ["team", "საკუთარი და არა შემთხვევითი ბრიგადები", "მონოლითჩიკები და არმატურჩიკები შტატში — 120 ადამიანი. ობიექტზე რგოლის შემადგენლობა კვირიდან კვირამდე არ იცვლება."],
      ["document", "შემსრულებლის დოკუმენტაცია", "ფარული სამუშაოების აქტები, არმირების სქემები, ბეტონირების ჟურნალები და სიმტკიცის ოქმები — იმ სახით, როგორსაც ტექზედამხედველი მიიღებს."],
      ["clock", "ციკლი, რომელიც გრაფიკში ჩაჯდება", "გადახურვების ტემპი წინასწარ ითვლება და ეტაპებით ფიქსირდება: ფასადსა და ინჟინერიას რეალური თარიღიდან გეგმავთ და არა დაპირებიდან."],
    ],
  },
  barriers: {
    eyebrow: "რა უშლის ხელს ჩვეულებრივ",
    title: "რატომ ცვლიან<br><em>მონოლითის კონტრაქტორს</em>",
    intro: "ოთხი ტიპური მიზეზი წინა კონტრაქტორთან გაწყვეტისა. ჩვენ მათ სამუშაოს ორგანიზაციით ვხსნით და არა დაპირებებით.",
    items: [
      ["„გეომეტრია წავიდა, შემდეგ ფანჯრები და ფასადი აღარ ჯდება“", "ღერძები და ნიშნულები ინსტრუმენტულად გააქვთ და ბეტონირებამდე მოწმდება, ყალიბი ნიველირით დგება. გადახრები აქტით ფიქსირდება და არა ფასადის ეტაპზე აღმოჩნდება."],
      ["„გაუგებარი კლასის ბეტონი“", "ბეტონი მიიღება ქარხნის დოკუმენტებით ნიმუშების აღებით; სიმტკიცის ოქმები საპროექტო ასაკში დამკვეთს აქტებთან ერთად გადაეცემა."],
      ["„ბრიგადა სეზონზე გაქრა“", "ხალხი და ტექნიკა შტატსა და ბალანსზეა. ობიექტი არ ჩერდება იმის გამო, რომ ბრიგადა უფრო მომგებიან შეკვეთაზე წავიდა."],
      ["„დოკუმენტები არ არის — ტექზედამხედველი ეტაპს არ იღებს“", "შემსრულებლის დოკუმენტაცია სამუშაოს მსვლელობისას იწარმოება და არა მიღებამდე უკუსვლით გროვდება."],
    ],
  },
  spec: {
    eyebrow: "პარამეტრები",
    title: "რომელ სამუშაოებს<br><em>ვიღებთ ქვეკონტრაქტით?</em>",
    head: ["პარამეტრი", "მნიშვნელობა"],
    rows: [
      ["საძირკვლები", "მონოლითური ფილა, ლენტური, ხიმინჯ-როსტვერკული"],
      ["კონსტრუქცია", "სვეტები, ცოკოლის კედლები, გადახურვები, კიბეები, კარკასი მთლიანად"],
      ["ობიექტები", "საცხოვრებელი კორპუსები, საწარმოო შენობები, კერძო სახლები"],
      ["რესურსები", "საკუთარი ტექნიკა და ყალიბები 6 000 მ² გადახურვაზე ერთდროულად"],
      ["კონტროლი", "ფარული სამუშაოების აქტები, არმირების მიღება, ბეტონის კონტროლი"],
      ["შედეგი", "კონსტრუქცია შემსრულებლის დოკუმენტაციით"],
    ],
  },
  faq: {
    eyebrow: "კონტრაქტორის კითხვები",
    title: "რას კითხულობენ<br><em>დეველოპერები?</em>",
    items: [
      ["რა ღირს მონოლითური სამუშაოები?", "2026 წლის ორიენტირი — $140 / მ²-დან მონოლითურ კარკასზე. ზუსტი ფასი დამოკიდებულია კვანძების სირთულეზე, არმირების სიხშირეზე, სიმაღლესა და მოედნის შევიწროებაზე და თქვენი ნახაზებით ითვლება."],
      ["მუშაობთ თუ არა სხვის პროექტზე?", "დიახ, ეს ქვეკონტრაქტის ძირითადი ფორმატია. დაწყებამდე ჩვენი კონსტრუქტორი ამოწმებს ნახაზებს შესრულებადობაზე და განსხვავებებს აცნობებს მანამ, სანამ ისინი მოედანზე პრობლემად იქცევა."],
      ["ვინ აგებს პასუხს ფარული სამუშაოების მიღებაზე?", "მიღებას ატარებს ტექზედამხედველი — თქვენი, დამკვეთის ან დამოუკიდებელი. ჩვენ ვამზადებთ აქტებს, სქემებსა და ოქმებს და ხელმოწერის გარეშე სამუშაოებს არ ვხურავთ."],
      ["იღებთ თუ არა ობიექტებს თბილისის გარეთ?", "დიახ, ვმუშაობთ მთელ საქართველოში. ყალიბებისა და ტექნიკის ლოგისტიკა ხარჯთაღრიცხვაში ცალკე სტრიქონად ითვლება, რომ გასვლის ღირებულება წინასწარ ჩანდეს."],
    ],
  },
  contact: {
    eyebrow: "შემდეგი ნაბიჯი",
    title: "გამოვთვალოთ<br><em>თქვენი მონოლითი</em>",
    text: "გამოგვიგზავნეთ ნახაზები ან მოცულობები ეტაპებად — ერთ სამუშაო საათში გიპასუხებთ ფასით მ²-ზე და ციკლის ვადით.",
    objtype: "საძირკველი ან მონოლითური სამუშაოები",
  },
  serviceName: "საძირკვლები და მონოლითური სამუშაოები",
};

export const PODRYAD_NA_MONOLIT: Record<Lang, LandingPage> = { ka, ru, en };
