import type { Lang } from "~/site/pages";
import type { LandingPage } from "./types";

// Лендинг под интент «перенести производство или склад в Грузию».
// Аудитория — владелец бизнеса. Страница услуги — /proizvodstvo-i-sklady.
const ru: LandingPage = {
  metaTitle: "Строительство склада и цеха в Грузии",
  metaDescription: "Склады, цеха и логистические центры от 1 000 м² в Грузии: поэтапный ввод, фиксированная цена в договоре, подключение к сетям и документы на баланс.",
  crumb: "Бизнесу",
  heroEyebrow: "Владельцам бизнеса",
  heroTitle: "Производственная площадка,<br><em>которая начнёт работать раньше</em>",
  heroLead: "ONEZA Construction строит в Грузии цеха, склады классов А и B и логистические центры от 1 000 м² и высотой до 14 м за 6–12 месяцев. Монолитный каркас — от $140 / м², готовность под отделку с инженерными сетями — от $300 / м². Срок каждого этапа зафиксирован в договоре, оплата — 100% материалов и 15% работ авансом, остальное по актам приёмки.",
  heroMore: "Для производства простой дороже стройки, поэтому мы проектируем очереди так, чтобы первый корпус запускался, пока достраивается второй. Полы под нагрузку, высота под стеллажи и технику, рампы, крановые пути и энергоблок считаются под ваш технологический процесс, а не по типовому проекту. Гарантия на конструктив — 10 лет.",
  ctaPrimary: "Получить расчёт",
  ctaSecondary: "Как устроена фиксированная цена",
  serviceLink: "proizvodstvo-i-sklady",
  advantages: {
    eyebrow: "Что это даёт",
    title: "Что получает бизнес,<br><em>который строит с ONEZA?</em>",
    intro: "Мы берём на себя весь цикл: участок, проект, разрешение, стройку и подключение к сетям. У вас одна точка ответственности и один договор вместо шести подрядчиков.",
    items: [
      ["clock", "Поэтапный запуск", "Первая очередь принимает оборудование, пока идёт вторая. Выручка стартует раньше, чем закрывается стройка целиком."],
      ["money", "Здание под процесс", "Нагрузки на пол, высота в свету, шаг колонн, ворота и рампы считаются под вашу технику и логистику, а не под усреднённый склад."],
      ["check", "Сети под мощность", "Электричество, вода, газ и канализация — с расчётом мощности под оборудование и договорами на подключение, которые ведём мы."],
      ["warehouse", "Документы на баланс", "Исполнительная документация и акт ввода: здание можно поставить на баланс, застраховать, заложить или сдавать в аренду."],
    ],
  },
  barriers: {
    eyebrow: "Что обычно мешает",
    title: "Что останавливает<br><em>перенос производства</em>",
    intro: "Четыре возражения, которые мы слышим чаще всего от собственников, и наш ответ на каждое — до договора, а не после.",
    items: [
      ["«Стройка встанет, а оборудование уже куплено»", "График строительства привязывается к дате поставки оборудования: фундаменты под станки и энергоблок делаются в первую очередь, а этапы принимаются актами, по которым видно отставание в тот же месяц."],
      ["«Не хватит мощности по электричеству»", "Мощность и точки подключения проверяются до покупки участка — вместе с категорией земли и подъездом для фур. Если мощности нет, вы узнаёте это до сделки, а не после фундамента."],
      ["«Разрешение и пожарные нормы затянут проект»", "Проектируем под грузинские нормы, включая сейсмику, и сами ведём подачу в мэрию. Замечания отрабатываем мы, а не вы по переписке из другой страны."],
      ["«Подрядчик сделает коробку и уйдёт»", "Мы сдаём площадку под оборудование: полы, сети, рампы, ворота. Оплата идёт по принятым этапам, гарантия на конструктив — 10 лет."],
    ],
  },
  spec: {
    eyebrow: "Параметры",
    title: "Какие объекты<br><em>строим?</em>",
    head: ["Параметр", "Значение"],
    rows: [
      ["Формат", "Цеха, склады класса А и B, логистические центры, энергоблоки"],
      ["Площадь", "от 1 000 м²"],
      ["Высота", "до 14 м, крановые пути"],
      ["Конструктив", "Монолитный или сборно-монолитный каркас"],
      ["Готовность", "Под оборудование: полы, сети, рампы"],
      ["Срок", "6–12 месяцев, поэтапный ввод"],
    ],
  },
  faq: {
    eyebrow: "Вопросы собственника",
    title: "Что спрашивают<br><em>перед стройкой?</em>",
    items: [
      ["Сколько стоит построить склад в Грузии?", "Ориентир 2026 года: монолитный каркас — от $140 / м², готовность под отделку с инженерными сетями — от $300 / м². Точная сумма зависит от нагрузок на пол, высоты, числа ворот и мощности сетей и фиксируется в договоре по рабочему проекту."],
      ["Можно ли запустить первую очередь раньше?", "Да, это наш обычный сценарий для производства. Очереди разводятся по этапам так, чтобы первый корпус принимал оборудование, пока строится второй."],
      ["Вы работаете в свободных индустриальных зонах?", "Да. Зона даёт освобождения по прибыли, имуществу и НДС для подходящих производств, но сужает круг арендаторов, если объект строится под сдачу. Считаем оба сценария до выбора участка."],
      ["Строите ли вы за пределами Тбилиси?", "Да, по всей Грузии — Рустави, Кутаиси, Поти, Батуми и дальше. Участок проверяем по 15 пунктам в любой точке страны."],
    ],
  },
  contact: {
    eyebrow: "Следующий шаг",
    title: "Посчитаем<br><em>вашу площадку</em>",
    text: "Пришлите площадь, высоту и тип производства — ответим в течение рабочего часа предварительным расчётом и сроком по этапам.",
    objtype: "Производство или склад",
  },
  serviceName: "Строительство производственных и складских площадок",
};

const en: LandingPage = {
  metaTitle: "Warehouse and factory construction",
  metaDescription: "Warehouses and workshops from 1,000 m² in Georgia: phased commissioning, a fixed contract price and utility connections.",
  crumb: "For business",
  heroEyebrow: "For business owners",
  heroTitle: "A production site<br><em>that starts working sooner</em>",
  heroLead: "ONEZA Construction builds workshops, class A and B warehouses and logistics centres in Georgia from 1,000 m² and up to 14 m clear height in 6–12 months. The monolithic frame starts at $140 / m², ready for fit-out with utilities at $300 / m². Every stage has a date in the contract, and you pay 100% of the materials and 15% of the work up front, the rest against acceptance acts.",
  heroMore: "For a production business downtime costs more than construction, so we plan the phases so the first hall starts up while the second is still being built. Floor loads, clear height for racking and machinery, docks, crane runways and the power unit are calculated for your process, not copied from a standard design. The structural warranty is 10 years.",
  ctaPrimary: "Request an assessment",
  ctaSecondary: "How the fixed price works",
  serviceLink: "proizvodstvo-i-sklady",
  advantages: {
    eyebrow: "What you get",
    title: "What does a business get<br><em>building with ONEZA?</em>",
    intro: "We take the whole cycle: plot, design, permit, construction and utility connections. You get one point of responsibility and one contract instead of six subcontractors.",
    items: [
      ["clock", "Phased start-up", "The first phase receives equipment while the second is still going up. Revenue starts before the whole site is finished."],
      ["money", "A building built around the process", "Floor loads, clear height, column grid, gates and docks are calculated for your machinery and logistics, not for an average warehouse."],
      ["check", "Utilities sized for your load", "Power, water, gas and drainage designed for the equipment, with connection contracts handled by us."],
      ["warehouse", "Documents for your books", "As-built documentation and the commissioning act: the building can be capitalised, insured, pledged or let."],
    ],
  },
  barriers: {
    eyebrow: "What usually stops it",
    title: "What holds up<br><em>relocating production</em>",
    intro: "The four objections we hear most often from owners, and our answer to each — before the contract, not after.",
    items: [
      ["“The build will stall and the equipment is already bought”", "The construction schedule is tied to the equipment delivery date: foundations for the machines and the power unit come first, and stages are signed off by acts that reveal slippage the same month."],
      ["“There will not be enough electrical capacity”", "Capacity and connection points are verified before you buy the plot, along with the land category and truck access. If the capacity is not there, you learn it before the deal, not after the foundation."],
      ["“Permits and fire regulations will drag on”", "We design to Georgian codes, seismic requirements included, and file with the City Hall ourselves. We handle the review comments, not you by email from another country."],
      ["“The contractor will build a shell and walk away”", "We hand over a site ready for equipment: floors, utilities, docks, gates. Payment follows accepted stages and the structure carries a 10-year warranty."],
    ],
  },
  spec: {
    eyebrow: "Parameters",
    title: "Which buildings<br><em>do we build?</em>",
    head: ["Parameter", "Value"],
    rows: [
      ["Format", "Workshops, class A and B warehouses, logistics centres, power units"],
      ["Area", "from 1,000 m²"],
      ["Height", "up to 14 m, crane runways"],
      ["Structure", "Monolithic or precast-monolithic frame"],
      ["Handover state", "Ready for equipment: floors, utilities, docks"],
      ["Duration", "6–12 months, phased commissioning"],
    ],
  },
  faq: {
    eyebrow: "Owner questions",
    title: "What do owners ask<br><em>before building?</em>",
    items: [
      ["How much does a warehouse in Georgia cost?", "2026 guide: monolithic frame from $140 / m², ready for fit-out with utilities from $300 / m². The exact sum depends on floor loads, height, the number of gates and the utility capacity, and is fixed in the contract from the working design."],
      ["Can the first phase open earlier?", "Yes, that is our normal scenario for production. Phases are split so the first hall receives equipment while the second is under construction."],
      ["Do you work in Free Industrial Zones?", "Yes. A zone grants exemptions on profit, property and VAT for qualifying production, but narrows the tenant pool if the building is for rent. We model both scenarios before the plot is chosen."],
      ["Do you build outside Tbilisi?", "Yes, across Georgia — Rustavi, Kutaisi, Poti, Batumi and beyond. We run the 15-point plot check anywhere in the country."],
    ],
  },
  contact: {
    eyebrow: "Next step",
    title: "Let us price<br><em>your site</em>",
    text: "Send the area, the clear height and the type of production — we reply within one working hour with a preliminary cost and a stage schedule.",
    objtype: "Production or warehouse",
  },
  serviceName: "Production and warehouse construction",
};

const ka: LandingPage = {
  metaTitle: "საწყობისა და საამქროს მშენებლობა",
  metaDescription: "საწყობები და საამქროები 1 000 მ²-დან: ეტაპობრივი ამოქმედება, ფიქსირებული ფასი ხელშეკრულებაში, ქსელებთან მიერთება.",
  crumb: "ბიზნესს",
  heroEyebrow: "ბიზნესის მფლობელებს",
  heroTitle: "საწარმოო მოედანი,<br><em>რომელიც ადრე ამოქმედდება</em>",
  heroLead: "ONEZA Construction საქართველოში აშენებს საამქროებს, A და B კლასის საწყობებსა და ლოგისტიკურ ცენტრებს 1 000 მ²-დან და 14 მ სიმაღლემდე 6–12 თვეში. მონოლითური კარკასი — $140 / მ²-დან, მზადყოფნა მოსაპირკეთებლად საინჟინრო ქსელებით — $300 / მ²-დან. თითოეული ეტაპის ვადა ხელშეკრულებაშია, გადახდა — მასალების 100% და სამუშაოების 15% წინასწარ, დანარჩენი მიღება-ჩაბარების აქტებით.",
  heroMore: "წარმოებისთვის მოცდენა მშენებლობაზე ძვირი ჯდება, ამიტომ რიგებს ისე ვაპროექტებთ, რომ პირველი კორპუსი ამოქმედდეს, სანამ მეორე შენდება. იატაკი დატვირთვაზე, სიმაღლე სტელაჟებსა და ტექნიკაზე, რამპები, ამწის ლიანდაგები და ენერგობლოკი ითვლება თქვენს ტექნოლოგიურ პროცესზე და არა ტიპურ პროექტზე. გარანტია კონსტრუქციაზე — 10 წელი.",
  ctaPrimary: "გამოთვლის მიღება",
  ctaSecondary: "როგორ მუშაობს ფიქსირებული ფასი",
  serviceLink: "proizvodstvo-i-sklady",
  advantages: {
    eyebrow: "რას იძლევა ეს",
    title: "რას იღებს ბიზნესი,<br><em>რომელიც ONEZA-თან აშენებს?</em>",
    intro: "ვიღებთ მთელ ციკლს: ნაკვეთი, პროექტი, ნებართვა, მშენებლობა და ქსელებთან მიერთება. თქვენ გაქვთ ერთი პასუხისმგებლობის წერტილი და ერთი ხელშეკრულება ექვსი ქვეკონტრაქტორის ნაცვლად.",
    items: [
      ["clock", "ეტაპობრივი ამოქმედება", "პირველი რიგი იღებს მოწყობილობას, სანამ მეორე მიმდინარეობს. შემოსავალი იწყება მანამ, სანამ მთელი მშენებლობა დასრულდება."],
      ["money", "შენობა პროცესზე მორგებული", "იატაკის დატვირთვა, სუფთა სიმაღლე, სვეტების ბიჯი, კარიბჭეები და რამპები ითვლება თქვენს ტექნიკასა და ლოგისტიკაზე და არა საშუალო საწყობზე."],
      ["check", "ქსელები სიმძლავრეზე", "ელექტროენერგია, წყალი, გაზი და კანალიზაცია — მოწყობილობაზე გათვლილი სიმძლავრით და მიერთების ხელშეკრულებებით, რომლებსაც ჩვენ ვაწარმოებთ."],
      ["warehouse", "დოკუმენტები ბალანსზე", "შემსრულებლის დოკუმენტაცია და ექსპლუატაციაში მიღების აქტი: შენობა შეიძლება ბალანსზე დადგეს, დაზღვეულ იქნას, დაგირავდეს ან გაქირავდეს."],
    ],
  },
  barriers: {
    eyebrow: "რა უშლის ხელს ჩვეულებრივ",
    title: "რა აჩერებს<br><em>წარმოების გადმოტანას</em>",
    intro: "ოთხი შენიშვნა, რომელსაც მფლობელებისგან ყველაზე ხშირად გვესმის, და ჩვენი პასუხი თითოეულზე — ხელშეკრულებამდე და არა შემდეგ.",
    items: [
      ["„მშენებლობა გაჩერდება, მოწყობილობა კი უკვე ნაყიდია“", "მშენებლობის გრაფიკი ებმება მოწყობილობის მიწოდების თარიღს: საძირკვლები დანადგარებისა და ენერგობლოკისთვის პირველ რიგში კეთდება, ეტაპები კი აქტებით მიიღება, რომლებზეც ჩამორჩენა იმავე თვეში ჩანს."],
      ["„ელექტროენერგიის სიმძლავრე არ გვეყოფა“", "სიმძლავრე და მიერთების წერტილები ნაკვეთის შეძენამდე მოწმდება — მიწის კატეგორიასა და ფურგონების მისასვლელთან ერთად. თუ სიმძლავრე არ არის, ამას გარიგებამდე გაიგებთ და არა საძირკვლის შემდეგ."],
      ["„ნებართვა და ხანძარსაწინააღმდეგო ნორმები გაწელავს პროექტს“", "ვაპროექტებთ ქართული ნორმებით, სეისმიკის ჩათვლით, და მერიაში განცხადებას თავად ვაწარმოებთ. შენიშვნებს ჩვენ ვამუშავებთ და არა თქვენ სხვა ქვეყნიდან მიმოწერით."],
      ["„კონტრაქტორი კოლოფს ააშენებს და წავა“", "ჩვენ მოედანს მოწყობილობისთვის ვაბარებთ: იატაკი, ქსელები, რამპები, კარიბჭეები. გადახდა მიღებული ეტაპებით მიდის, გარანტია კონსტრუქციაზე — 10 წელი."],
    ],
  },
  spec: {
    eyebrow: "პარამეტრები",
    title: "რომელ ობიექტებს<br><em>ვაშენებთ?</em>",
    head: ["პარამეტრი", "მნიშვნელობა"],
    rows: [
      ["ფორმატი", "საამქროები, A და B კლასის საწყობები, ლოგისტიკური ცენტრები, ენერგობლოკები"],
      ["ფართობი", "1 000 მ²-დან"],
      ["სიმაღლე", "14 მ-მდე, ამწის ლიანდაგები"],
      ["კონსტრუქცია", "მონოლითური ან ნაკრებ-მონოლითური კარკასი"],
      ["მზადყოფნა", "მოწყობილობისთვის: იატაკი, ქსელები, რამპები"],
      ["ვადა", "6–12 თვე, ეტაპობრივი ამოქმედება"],
    ],
  },
  faq: {
    eyebrow: "მფლობელის კითხვები",
    title: "რას კითხულობენ<br><em>მშენებლობამდე?</em>",
    items: [
      ["რა ღირს საწყობის აშენება საქართველოში?", "2026 წლის ორიენტირი: მონოლითური კარკასი — $140 / მ²-დან, მზადყოფნა მოსაპირკეთებლად საინჟინრო ქსელებით — $300 / მ²-დან. ზუსტი თანხა დამოკიდებულია იატაკის დატვირთვაზე, სიმაღლეზე, კარიბჭეების რაოდენობასა და ქსელების სიმძლავრეზე და ხელშეკრულებაში სამუშაო პროექტით ფიქსირდება."],
      ["შეიძლება თუ არა პირველი რიგის ადრე ამოქმედება?", "დიახ, ეს ჩვენი ჩვეული სცენარია წარმოებისთვის. რიგები ეტაპებად იყოფა ისე, რომ პირველმა კორპუსმა მოწყობილობა მიიღოს, სანამ მეორე შენდება."],
      ["მუშაობთ თუ არა თავისუფალ ინდუსტრიულ ზონებში?", "დიახ. ზონა იძლევა შეღავათებს მოგებაზე, ქონებასა და დღგ-ზე შესაბამისი წარმოებისთვის, მაგრამ ავიწროებს მოიჯარეების წრეს, თუ ობიექტი გასაქირავებლად შენდება. ორივე სცენარს ვითვლით ნაკვეთის არჩევამდე."],
      ["აშენებთ თუ არა თბილისის გარეთ?", "დიახ, მთელ საქართველოში — რუსთავი, ქუთაისი, ფოთი, ბათუმი და უფრო შორს. ნაკვეთს 15 პუნქტით ვამოწმებთ ქვეყნის ნებისმიერ წერტილში."],
    ],
  },
  contact: {
    eyebrow: "შემდეგი ნაბიჯი",
    title: "გამოვთვალოთ<br><em>თქვენი მოედანი</em>",
    text: "გამოგვიგზავნეთ ფართობი, სიმაღლე და წარმოების ტიპი — ერთ სამუშაო საათში გიპასუხებთ წინასწარი გაანგარიშებითა და ეტაპების ვადებით.",
    objtype: "წარმოება ან საწყობი",
  },
  serviceName: "საწარმოო და სასაწყობე მოედნების მშენებლობა",
};

export const BIZNESU: Record<Lang, LandingPage> = { ka, ru, en };
