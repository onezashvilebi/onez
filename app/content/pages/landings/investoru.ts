import type { Lang } from "~/site/pages";
import type { LandingPage } from "./types";

// Лендинг под интент «инвестиции в строительство в Тбилиси»: аудитория —
// инвестор и девелопер жилого корпуса. Страница услуги — /zhilye-korpusa.
const ru: LandingPage = {
  metaTitle: "Инвестиции в строительство в Тбилиси",
  metaDescription: "Генподрядчик для инвестиционного проекта в Тбилиси: жилой корпус от 1 000 м², фиксированная цена и дата сдачи в договоре, оплата по принятым этапам.",
  crumb: "Инвестору",
  heroEyebrow: "Инвесторам и девелоперам",
  heroTitle: "Инвестиционный проект,<br><em>который не сорвёт срок</em>",
  heroLead: "ONEZA Construction строит в Тбилиси монолитные жилые корпуса и апарт-комплексы от 1 000 м² и до 20 этажей за 12–20 месяцев. Цена — от $140 / м² за монолитный каркас и от $300 / м² под отделку с инженерными сетями — фиксируется в договоре вместе с датой сдачи и неустойкой за нашу просрочку. Авансом оплачиваются 100% материалов и 15% работ, остальное — по актам приёмки этапов.",
  heroMore: "Инвестору нужна не самая низкая цена в предложении, а цифра, которая доживёт до конца стройки. Поэтому смета собирается по рабочему проекту до выхода техники на площадку, а любое изменение оформляется допсоглашением на разницу — с вашим письменным согласием. Гарантия на конструктив — 10 лет.",
  ctaPrimary: "Получить расчёт",
  ctaSecondary: "Как устроена фиксированная цена",
  serviceLink: "zhilye-korpusa",
  advantages: {
    eyebrow: "Что это даёт",
    title: "Что инвестор получает<br><em>от работы с ONEZA?</em>",
    intro: "Мы генподрядчик с собственной техникой, опалубкой и бригадами. Это значит, что срок и себестоимость мы контролируем сами, а не пересказываем обещания субподрядчиков.",
    items: [
      ["calendar", "Дата сдачи в финмодели", "Срок стоит в договоре с ответственностью за просрочку, а не в презентации. Под него подписывается график этапов, по которому идут платежи."],
      ["money", "Цена, которая не плывёт", "Смета фиксируется до старта и не пересматривается из-за курса, подорожания материалов или наших ошибок в расчёте."],
      ["check", "Материалы вперёд, работы по актам", "Аванс — 100% материалов и 15% работ: закупка на весь объект фиксирует цену материалов. Оставшиеся 85% работ оплачиваются по актам приёмки этапов."],
      ["layers", "Поэтапный ввод", "Очереди проектируются так, чтобы первая начала приносить доход, пока достраивается вторая. Если это важно для модели — закладываем сразу."],
    ],
  },
  barriers: {
    eyebrow: "Что обычно мешает",
    title: "Чего инвестор боится<br><em>и что с этим делаем</em>",
    intro: "Четыре причины, по которым инвестиционные стройки в Грузии заканчиваются хуже плана. Мы закрываем каждую до подписания договора, а не по ходу работ.",
    items: [
      ["«Смета вырастет на 30% к середине стройки»", "Смета собирается постатейно по рабочему проекту и становится приложением к договору. Меняется она только если вы меняете задание: считаем разницу, подписываем допсоглашение, работаем дальше."],
      ["«Подрядчик исчезнет с авансом»", "Аванс идёт на материалы и мобилизацию, а не на весь объём работ: 85% работ оплачиваются по подписанным актам, скрытые работы принимает независимый технадзор с фотофиксацией."],
      ["«Разрешение затянется на год»", "Проверяем коэффициенты застройки и градостроительные условия до покупки участка, ведём подачу в мэрию сами и заранее показываем, какая площадь реально разрешена на этом участке."],
      ["«Я не в Грузии и не увижу, что происходит»", "Еженедельные фото и видео с площадки, онлайн-кабинет с графиком и бюджетом, акты этапов и право в любой момент привести собственного инженера для проверки."],
    ],
  },
  spec: {
    eyebrow: "Параметры",
    title: "Какой объект<br><em>берём в работу?</em>",
    head: ["Параметр", "Значение"],
    rows: [
      ["Формат", "Жилые корпуса, апарт-комплексы, ЖК из нескольких очередей"],
      ["Площадь", "от 1 000 м²"],
      ["Этажность", "до 20 этажей"],
      ["Готовность", "Под отделку, с инженерными сетями и фасадом"],
      ["Срок", "12–20 месяцев в зависимости от объёма"],
      ["Оплата и гарантия", "100% материалов и 15% работ авансом, остальное по актам; 10 лет на конструктив"],
    ],
  },
  faq: {
    eyebrow: "Вопросы инвестора",
    title: "Что спрашивают<br><em>перед договором?</em>",
    items: [
      ["Сколько стоит построить жилой корпус в Тбилиси?", "Ориентир 2026 года: монолитный каркас — от $140 / м², коробка с фасадом и окнами — от $250 / м², под отделку с инженерными сетями — от $300 / м². Точная сумма считается по рабочему проекту и фиксируется в договоре до выхода техники на площадку."],
      ["Что будет, если вы сорвёте срок?", "В договоре стоит неустойка за просрочку по нашей вине. Срок привязан к графику этапов, по которому идут платежи, — отставание видно не в конце, а на ближайшем акте."],
      ["Можно ли зайти в проект, который уже начат другим подрядчиком?", "Да. Сначала технический аудит: что сделано, что придётся переделать, какова реальная стоимость завершения. Если конструктив не принимаем — говорим об этом прямо и не берёмся."],
      ["Вы даёте доходность?", "Нет. Доходность зависит от рынка, а не от подрядчика, и обещать её было бы нечестно. Мы отвечаем за цену, срок и качество — то есть за расходную часть вашей модели."],
    ],
  },
  contact: {
    eyebrow: "Следующий шаг",
    title: "Посчитаем<br><em>ваш проект</em>",
    text: "Пришлите кадастровый номер участка или параметры объекта — ответим в течение рабочего часа предварительным расчётом и сроком.",
    objtype: "Жилой корпус",
  },
  serviceName: "Строительство жилых корпусов в Тбилиси",
};

const en: LandingPage = {
  metaTitle: "Investing in construction in Tbilisi",
  metaDescription: "A general contractor for an investment project in Tbilisi: residential buildings from 1,000 m², a fixed price and date in the contract.",
  crumb: "For investors",
  heroEyebrow: "For investors and developers",
  heroTitle: "An investment project<br><em>that keeps its date</em>",
  heroLead: "ONEZA Construction builds monolithic residential buildings and apart-complexes in Tbilisi from 1,000 m² and up to 20 floors in 12–20 months. The price — from $140 / m² for the monolithic frame and from $300 / m² ready for fit-out with utilities — is fixed in the contract together with the completion date and the penalty for our delay. You pay 100% of the materials and 15% of the work up front, the rest against stage acceptance acts.",
  heroMore: "An investor does not need the lowest number in the tender; they need a number that survives to the end of the build. So the estimate is prepared from the working design before machinery reaches the site, and any change is signed as an addendum for the difference only, with your written approval. The structural warranty is 10 years.",
  ctaPrimary: "Request an assessment",
  ctaSecondary: "How the fixed price works",
  serviceLink: "zhilye-korpusa",
  advantages: {
    eyebrow: "What you get",
    title: "What does an investor<br><em>get from ONEZA?</em>",
    intro: "We are a general contractor with our own machinery, formwork and crews. That means we control the schedule and the cost ourselves instead of relaying promises from subcontractors.",
    items: [
      ["calendar", "A date your model can use", "The completion date sits in the contract with liability for delay, not in a slide. The stage schedule that drives the payments is signed against it."],
      ["money", "A price that does not drift", "The estimate is fixed before the start and is not revised for the exchange rate, material prices or our own errors in the calculation."],
      ["check", "Materials up front, work against acts", "The advance covers 100% of the materials and 15% of the work: buying for the whole building fixes the material price. The remaining 85% of the work is paid against stage acceptance acts."],
      ["layers", "Phased commissioning", "Sections are designed so the first one starts earning while the second is still being built. If that matters to your model, we plan for it from the start."],
    ],
  },
  barriers: {
    eyebrow: "What usually goes wrong",
    title: "What investors fear<br><em>and how we answer it</em>",
    intro: "Four reasons investment builds in Georgia end up worse than planned. We close each of them before the contract is signed, not while the work is running.",
    items: [
      ["“The estimate will grow 30% mid-build”", "The estimate is itemised from the working design and becomes an annex to the contract. It changes only when you change the brief: we price the difference, sign an addendum and carry on."],
      ["“The contractor will vanish with the advance”", "The advance goes to materials and mobilisation, not to the whole scope of work: 85% of the work is paid against signed acts, and hidden works are accepted by an independent supervisor with photo evidence."],
      ["“The permit will take a year”", "We check the build coefficients and the zoning conditions before you buy the plot, file with the City Hall ourselves and show you upfront how much floor area the plot really allows."],
      ["“I am not in Georgia and will not see what happens”", "Weekly photo and video from the site, an online dashboard with the schedule and the budget, stage acceptance acts, and your right to send your own engineer at any time."],
    ],
  },
  spec: {
    eyebrow: "Parameters",
    title: "Which projects<br><em>do we take on?</em>",
    head: ["Parameter", "Value"],
    rows: [
      ["Format", "Residential buildings, apart-complexes, schemes built in several phases"],
      ["Area", "from 1,000 m²"],
      ["Height", "up to 20 floors"],
      ["Handover state", "Ready for fit-out, with utilities and facade"],
      ["Duration", "12–20 months depending on volume"],
      ["Payment and warranty", "100% of materials and 15% of work up front, rest against acts; 10 years on the structure"],
    ],
  },
  faq: {
    eyebrow: "Investor questions",
    title: "What do investors ask<br><em>before the contract?</em>",
    items: [
      ["How much does a residential building in Tbilisi cost?", "2026 guide: monolithic frame from $140 / m², shell with facade and windows from $250 / m², ready for fit-out with utilities from $300 / m². The exact sum is calculated from the working design and fixed in the contract before machinery reaches the site."],
      ["What happens if you miss the deadline?", "The contract carries a penalty for delay caused by us. The date is tied to the stage schedule that drives the payments, so a slippage shows up at the next act, not at the end."],
      ["Can you take over a project another contractor started?", "Yes, after a technical audit: what is done, what has to be redone and what completion really costs. If we cannot accept the existing structure we say so and decline."],
      ["Do you guarantee a yield?", "No. Yield depends on the market, not on the contractor, and promising it would be dishonest. We are responsible for price, schedule and quality — the cost side of your model."],
    ],
  },
  contact: {
    eyebrow: "Next step",
    title: "Let us price<br><em>your project</em>",
    text: "Send the cadastral number of the plot or the parameters of the building — we reply within one working hour with a preliminary cost and duration.",
    objtype: "Residential building",
  },
  serviceName: "Residential building construction in Tbilisi",
};

const ka: LandingPage = {
  metaTitle: "ინვესტიციები მშენებლობაში თბილისში",
  metaDescription: "გენერალური კონტრაქტორი თბილისში: საცხოვრებელი კორპუსი 1 000 მ²-დან, ფიქსირებული ფასი და ვადა ხელშეკრულებაში.",
  crumb: "ინვესტორს",
  heroEyebrow: "ინვესტორებსა და დეველოპერებს",
  heroTitle: "საინვესტიციო პროექტი,<br><em>რომელიც ვადას არ დაარღვევს</em>",
  heroLead: "ONEZA Construction თბილისში აშენებს მონოლითურ საცხოვრებელ კორპუსებსა და აპარტ-კომპლექსებს 1 000 მ²-დან და 20 სართულამდე 12–20 თვეში. ფასი — $140 / მ²-დან მონოლითურ კარკასზე და $300 / მ²-დან მოსაპირკეთებლად საინჟინრო ქსელებით — ფიქსირდება ხელშეკრულებაში ჩაბარების თარიღთან და ჩვენი ვადის დარღვევის პირგასამტეხლოსთან ერთად. ავანსად იხდით მასალების 100%-ს და სამუშაოების 15%-ს, დანარჩენს — ეტაპების მიღება-ჩაბარების აქტებით.",
  heroMore: "ინვესტორს არა ყველაზე დაბალი ფასი სჭირდება შეთავაზებაში, არამედ ციფრი, რომელიც მშენებლობის ბოლომდე იცოცხლებს. ამიტომ ხარჯთაღრიცხვა სამუშაო პროექტით დგება ტექნიკის მოედანზე გასვლამდე, ხოლო ნებისმიერი ცვლილება ფორმდება დამატებითი შეთანხმებით მხოლოდ სხვაობაზე — თქვენი წერილობითი თანხმობით. გარანტია კონსტრუქციაზე — 10 წელი.",
  ctaPrimary: "გამოთვლის მიღება",
  ctaSecondary: "როგორ მუშაობს ფიქსირებული ფასი",
  serviceLink: "zhilye-korpusa",
  advantages: {
    eyebrow: "რას იძლევა ეს",
    title: "რას იღებს ინვესტორი<br><em>ONEZA-თან მუშაობით?</em>",
    intro: "ჩვენ გენერალური კონტრაქტორი ვართ საკუთარი ტექნიკით, ყალიბებითა და ბრიგადებით. ეს ნიშნავს, რომ ვადასა და თვითღირებულებას თავად ვაკონტროლებთ და არა ქვეკონტრაქტორების დაპირებებს გადმოგცემთ.",
    items: [
      ["calendar", "ჩაბარების თარიღი ფინმოდელში", "ვადა ხელშეკრულებაშია, დაგვიანებაზე პასუხისმგებლობით, და არა პრეზენტაციაში. მასზეა მიბმული ეტაპების გრაფიკი, რომლითაც გადახდები მიდის."],
      ["money", "ფასი, რომელიც არ ცურავს", "ხარჯთაღრიცხვა ფიქსირდება დაწყებამდე და არ გადაიხედება კურსის, მასალების გაძვირების ან ჩვენივე საანგარიშო შეცდომების გამო."],
      ["check", "მასალა წინასწარ, სამუშაო აქტებით", "ავანსი — მასალების 100% და სამუშაოების 15%: მთელ ობიექტზე შესყიდვა აფიქსირებს მასალის ფასს. დარჩენილი 85% სამუშაოებისა იხდება ეტაპების აქტებით."],
      ["layers", "ეტაპობრივი ამოქმედება", "რიგები ისე იგეგმება, რომ პირველმა შემოსავალი დაიწყოს, სანამ მეორე შენდება. თუ ეს მოდელისთვის მნიშვნელოვანია — თავიდანვე ვთვლით."],
    ],
  },
  barriers: {
    eyebrow: "რა უშლის ხელს ჩვეულებრივ",
    title: "რისი ეშინია ინვესტორს<br><em>და რას ვაკეთებთ ამაზე</em>",
    intro: "ოთხი მიზეზი, რის გამოც საინვესტიციო მშენებლობები საქართველოში გეგმაზე უარესად სრულდება. თითოეულს ხელშეკრულების ხელმოწერამდე ვხურავთ და არა სამუშაოს მსვლელობისას.",
    items: [
      ["„ხარჯთაღრიცხვა შუა მშენებლობაში 30%-ით გაიზრდება“", "ხარჯთაღრიცხვა მუხლობრივად დგება სამუშაო პროექტით და ხელშეკრულების დანართი ხდება. ის იცვლება მხოლოდ მაშინ, თუ თქვენ შეცვლით დავალებას: ვითვლით სხვაობას, ვაფორმებთ დამატებით შეთანხმებას და ვაგრძელებთ."],
      ["„კონტრაქტორი ავანსით გაქრება“", "ავანსი მიდის მასალასა და მობილიზაციაზე და არა სამუშაოს მთელ მოცულობაზე: სამუშაოების 85% იხდება ხელმოწერილი აქტებით, ფარულ სამუშაოებს კი დამოუკიდებელი ტექზედამხედველი იღებს ფოტოფიქსაციით."],
      ["„ნებართვა წელიწადს გაიწელება“", "განაშენიანების კოეფიციენტებსა და ქალაქთმშენებლობით პირობებს ნაკვეთის შეძენამდე ვამოწმებთ, მერიაში განცხადებას თავად ვაწარმოებთ და წინასწარ ვაჩვენებთ, რა ფართობია რეალურად ნებადართული ამ ნაკვეთზე."],
      ["„საქართველოში არ ვარ და ვერ ვნახავ, რა ხდება“", "ყოველკვირეული ფოტო და ვიდეო მოედნიდან, ონლაინ კაბინეტი გრაფიკითა და ბიუჯეტით, ეტაპების აქტები და უფლება ნებისმიერ დროს მოიყვანოთ საკუთარი ინჟინერი შესამოწმებლად."],
    ],
  },
  spec: {
    eyebrow: "პარამეტრები",
    title: "რომელ ობიექტს<br><em>ვიღებთ სამუშაოდ?</em>",
    head: ["პარამეტრი", "მნიშვნელობა"],
    rows: [
      ["ფორმატი", "საცხოვრებელი კორპუსები, აპარტ-კომპლექსები, რამდენიმე რიგად აშენებული კომპლექსები"],
      ["ფართობი", "1 000 მ²-დან"],
      ["სართულიანობა", "20 სართულამდე"],
      ["მზადყოფნა", "მოსაპირკეთებლად, საინჟინრო ქსელებითა და ფასადით"],
      ["ვადა", "12–20 თვე მოცულობის მიხედვით"],
      ["გადახდა და გარანტია", "მასალების 100% და სამუშაოების 15% წინასწარ, დანარჩენი აქტებით; 10 წელი კონსტრუქციაზე"],
    ],
  },
  faq: {
    eyebrow: "ინვესტორის კითხვები",
    title: "რას კითხულობენ<br><em>ხელშეკრულებამდე?</em>",
    items: [
      ["რა ღირს საცხოვრებელი კორპუსის აშენება თბილისში?", "2026 წლის ორიენტირი: მონოლითური კარკასი — $140 / მ²-დან, კოლოფი ფასადითა და ფანჯრებით — $250 / მ²-დან, მოსაპირკეთებლად საინჟინრო ქსელებით — $300 / მ²-დან. ზუსტი თანხა სამუშაო პროექტით ითვლება და ხელშეკრულებაში ფიქსირდება ტექნიკის მოედანზე გასვლამდე."],
      ["რა მოხდება, თუ ვადას დაარღვევთ?", "ხელშეკრულებაში გაწერილია პირგასამტეხლო ჩვენი ბრალით დაგვიანებაზე. ვადა მიბმულია ეტაპების გრაფიკზე, რომლითაც გადახდები მიდის — ჩამორჩენა ჩანს არა ბოლოს, არამედ უახლოეს აქტზე."],
      ["შეიძლება თუ არა სხვა კონტრაქტორის დაწყებულ პროექტში შესვლა?", "დიახ. ჯერ ტექნიკური აუდიტი: რა არის გაკეთებული, რის გადაკეთება მოგვიწევს და რა ღირს რეალურად დასრულება. თუ კონსტრუქციას ვერ ვიღებთ — ამას პირდაპირ ვამბობთ და არ ვკისრულობთ."],
      ["იძლევით უკუგებას?", "არა. უკუგება ბაზარზეა დამოკიდებული და არა კონტრაქტორზე, მისი დაპირება არაკეთილსინდისიერი იქნებოდა. ჩვენ ფასზე, ვადასა და ხარისხზე ვაგებთ პასუხს — ანუ თქვენი მოდელის ხარჯვით ნაწილზე."],
    ],
  },
  contact: {
    eyebrow: "შემდეგი ნაბიჯი",
    title: "გამოვთვალოთ<br><em>თქვენი პროექტი</em>",
    text: "გამოგვიგზავნეთ ნაკვეთის საკადასტრო კოდი ან ობიექტის პარამეტრები — ერთ სამუშაო საათში გიპასუხებთ წინასწარი გაანგარიშებითა და ვადით.",
    objtype: "საცხოვრებელი კორპუსი",
  },
  serviceName: "საცხოვრებელი კორპუსების მშენებლობა თბილისში",
};

export const INVESTORU: Record<Lang, LandingPage> = { ka, ru, en };
