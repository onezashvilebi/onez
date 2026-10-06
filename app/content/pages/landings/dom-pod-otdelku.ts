import type { Lang } from "~/site/pages";
import type { LandingPage } from "./types";

// Лендинг под интент «дом под отделку / чёрный и белый каркас»: частный
// заказчик, который строит коробку и отделывает сам. Услуга — /chastnye-doma.
const ru: LandingPage = {
  metaTitle: "Дом под отделку в Тбилиси",
  metaDescription: "Монолитный дом от 160 м² под отделку в Тбилиси: каркас от $140 / м², коробка с фасадом и окнами от $250, с инженерными сетями от $300. Цена в договоре.",
  crumb: "Дом под отделку",
  heroEyebrow: "Частным заказчикам",
  heroTitle: "Дом под отделку:<br><em>прочная часть — на нас</em>",
  heroLead: "ONEZA Construction строит в Тбилиси монолитные частные дома от 160 м² в 1–3 этажа за 8–14 месяцев и сдаёт их под отделку. Ориентир 2026 года: монолитный каркас — от $140 / м², коробка с фасадом и окнами — от $250 / м², под отделку с инженерными сетями — от $300 / м². Отделку мы не делаем — и это честнее, чем обещать всё сразу.",
  heroMore: "Вы получаете то, что потом невозможно переделать: фундамент под ваш грунт, каркас с расчётом на сейсмику, кровлю, фасад, окна и разведённые сети. Дальше отделкой занимаетесь вы сами или ваш дизайнер — в своём темпе и в своём бюджете, не переплачивая генподрядчику за чужую плитку. Гарантия на конструктив — 10 лет.",
  ctaPrimary: "Получить расчёт",
  ctaSecondary: "Как устроена фиксированная цена",
  serviceLink: "chastnye-doma",
  advantages: {
    eyebrow: "Что это даёт",
    title: "Почему выгодно<br><em>сдавать дом под отделку?</em>",
    intro: "Конструктив и отделка живут по разным законам: первое делается один раз и навсегда, второе меняется вместе со вкусом и бюджетом. Мы отвечаем за первое.",
    items: [
      ["blueprint", "Деньги в прочность, а не в декор", "Бюджет уходит в фундамент, арматуру, бетон и гидроизоляцию — в то, что определяет, простоит ли дом и не пойдут ли трещины."],
      ["money", "Ясная граница ответственности", "Мы сдаём измеримый результат: каркас, кровля, фасад, окна, сети. Ни одна претензия не растворяется между подрядчиками."],
      ["shield", "Отделка в своём темпе", "Можно заехать в готовую коробку и отделывать этажи по очереди, растянув расходы, вместо одного большого платежа."],
      ["photo", "Сейсмика и грунт посчитаны", "Расчёт на 8 баллов и тип фундамента под ваш участок: плита, лента или сваи — по геологии, а не по привычке бригады."],
    ],
  },
  barriers: {
    eyebrow: "Что обычно мешает",
    title: "Чего боятся<br><em>частные заказчики</em>",
    intro: "Четыре причины, по которым частная стройка в Грузии заканчивается дороже и дольше плана. Мы снимаем их до подписания договора.",
    items: [
      ["«Смета вырастет, как у всех знакомых»", "Смета считается по рабочему проекту и становится приложением к договору. Она не пересматривается из-за курса и подорожания материалов — только если вы сами меняете задание."],
      ["«Участок на склоне — это дорого и опасно»", "Склон считается отдельно: подпорные стены, дренаж и тип фундамента проектируются до стройки. Вы видите стоимость нулевого цикла до покупки участка, а не в середине работ."],
      ["«Без меня будут лить бетон как попало»", "Скрытые работы принимаются актами с фотофиксацией, бетон и армирование проверяет независимый технадзор. Вы можете привести своего инженера в любой момент."],
      ["«Разрешение сделаю сам — и застряну»", "Градостроительные условия, коэффициенты застройки и подачу в мэрию берём на себя. Легализация постфактум обходится в разы дороже, поэтому разрешение получаем до работ."],
    ],
  },
  spec: {
    eyebrow: "Параметры",
    title: "Какой дом<br><em>строим?</em>",
    head: ["Параметр", "Значение"],
    rows: [
      ["Формат", "Дома, резиденции, гостевые дома, бассейны"],
      ["Площадь", "от 160 м²"],
      ["Этажность", "1–3 этажа, цоколь"],
      ["Конструктив", "Монолитный каркас, кирпич или блок"],
      ["Готовность", "Под отделку: коробка, кровля, окна, фасад, сети"],
      ["Срок", "8–14 месяцев"],
    ],
  },
  faq: {
    eyebrow: "Вопросы заказчика",
    title: "Что спрашивают<br><em>перед стройкой дома?</em>",
    items: [
      ["Что входит в готовность «под отделку»?", "Фундамент и монолитный каркас, стены, кровля, фасад, окна и разведённые инженерные сети — электрика, вода, канализация, отопление. Дальше идут штукатурка, стяжка, плитка и мебель: это отделка, её мы не выполняем."],
      ["Сколько стоит дом 200 м² под отделку?", "По ориентиру 2026 года — от $300 / м² с инженерными сетями, то есть от $60 000 за 200 м² при простом рельефе и стандартных решениях. Точная сумма считается по проекту: склон, тип фундамента и площадь остекления меняют её заметно."],
      ["Почему вы не делаете отделку?", "Потому что это другой бизнес с другим темпом и другой ответственностью. Мы держим свои бригады на монолите и конструктиве — там, где ошибка стоит дороже всего и не исправляется потом."],
      ["Можно ли заказать только каркас?", "Да, монолитные работы продаются отдельным этапом: фундамент, каркас, перекрытия, лестницы. Дальше вы вправе строить с кем угодно."],
    ],
  },
  contact: {
    eyebrow: "Следующий шаг",
    title: "Посчитаем<br><em>ваш дом</em>",
    text: "Пришлите площадь и кадастровый номер участка — ответим в течение рабочего часа ориентиром по цене и сроку.",
    objtype: "Частный дом",
  },
  serviceName: "Строительство частных домов в Тбилиси",
};

const en: LandingPage = {
  metaTitle: "A house ready for fit-out in Tbilisi",
  metaDescription: "A monolithic house from 160 m² ready for fit-out in Tbilisi: frame from $140 / m², with utilities from $300, fixed in the contract.",
  crumb: "Ready for fit-out",
  heroEyebrow: "For private clients",
  heroTitle: "A house ready for fit-out:<br><em>the permanent part is ours</em>",
  heroLead: "ONEZA Construction builds monolithic private houses in Tbilisi from 160 m², 1–3 floors, in 8–14 months and hands them over ready for fit-out. 2026 guide: monolithic frame from $140 / m², shell with facade and windows from $250 / m², ready for fit-out with utilities from $300 / m². We do not do finishing works — which is more honest than promising everything at once.",
  heroMore: "You get the part that cannot be redone later: a foundation designed for your soil, a frame calculated for seismic loads, the roof, the facade, the windows and the utilities run through the house. Finishing is then yours or your designer's, at your pace and your budget, without paying a general contractor a margin on someone else's tiles. The structure carries a 10-year warranty.",
  ctaPrimary: "Request an assessment",
  ctaSecondary: "How the fixed price works",
  serviceLink: "chastnye-doma",
  advantages: {
    eyebrow: "What you get",
    title: "Why take a house<br><em>ready for fit-out?</em>",
    intro: "Structure and finishes follow different rules: the first is done once and for good, the second changes with taste and budget. We are responsible for the first.",
    items: [
      ["blueprint", "Money into strength, not decor", "The budget goes into the foundation, reinforcement, concrete and waterproofing — what decides whether the house stands and stays crack-free."],
      ["money", "A clear line of responsibility", "We hand over a measurable result: frame, roof, facade, windows, utilities. No claim gets lost between contractors."],
      ["shield", "Finish at your own pace", "You can take the finished shell and fit out floor by floor, spreading the cost instead of one large payment."],
      ["photo", "Soil and seismics calculated", "An 8-point seismic design and the foundation type your plot actually needs — raft, strip or piles, chosen from the geology, not from habit."],
    ],
  },
  barriers: {
    eyebrow: "What usually goes wrong",
    title: "What private clients<br><em>are afraid of</em>",
    intro: "Four reasons private builds in Georgia end up costlier and slower than planned. We remove them before the contract is signed.",
    items: [
      ["“The estimate will grow like everyone else's”", "The estimate is calculated from the working design and becomes an annex to the contract. It is not revised for the exchange rate or material prices — only if you change the brief yourself."],
      ["“A plot on a slope is expensive and risky”", "The slope is priced separately: retaining walls, drainage and the foundation type are designed before construction. You see the cost of the groundworks before buying the plot, not halfway through."],
      ["“Without me they will pour concrete carelessly”", "Hidden works are accepted by act with photo evidence, and concrete and reinforcement are checked by an independent supervisor. You may bring your own engineer at any time."],
      ["“I will handle the permit myself and get stuck”", "We take on the zoning conditions, the build coefficients and the City Hall filing. Legalising after the fact costs several times more, so the permit comes before the works."],
    ],
  },
  spec: {
    eyebrow: "Parameters",
    title: "Which houses<br><em>do we build?</em>",
    head: ["Parameter", "Value"],
    rows: [
      ["Format", "Houses, residences, guest houses, pools"],
      ["Area", "from 160 m²"],
      ["Height", "1–3 floors, basement"],
      ["Structure", "Monolithic frame, brick or block"],
      ["Handover state", "Ready for fit-out: shell, roof, windows, facade, utilities"],
      ["Duration", "8–14 months"],
    ],
  },
  faq: {
    eyebrow: "Client questions",
    title: "What do clients ask<br><em>before building?</em>",
    items: [
      ["What does “ready for fit-out” include?", "Foundation and monolithic frame, walls, roof, facade, windows and the utilities run through the house — electrics, water, drainage, heating. Plaster, screed, tiling and furniture come next: that is finishing, and we do not do it."],
      ["What does a 200 m² house ready for fit-out cost?", "On the 2026 guide, from $300 / m² with utilities — about $60,000 for 200 m² on simple terrain with standard solutions. The exact sum comes from the design: a slope, the foundation type and the glazed area move it noticeably."],
      ["Why do you not do finishing works?", "Because it is a different business with a different tempo and a different kind of liability. We keep our crews on concrete and structure, where a mistake costs the most and cannot be corrected later."],
      ["Can I order the frame only?", "Yes, monolithic works are sold as a separate stage: foundation, frame, slabs, stairs. After that you are free to build with anyone."],
    ],
  },
  contact: {
    eyebrow: "Next step",
    title: "Let us price<br><em>your house</em>",
    text: "Send the area and the cadastral number of the plot — we reply within one working hour with a cost and duration guide.",
    objtype: "Private house",
  },
  serviceName: "Private house construction in Tbilisi",
};

const ka: LandingPage = {
  metaTitle: "სახლი მოსაპირკეთებლად თბილისში",
  metaDescription: "მონოლითური სახლი 160 მ²-დან მოსაპირკეთებლად თბილისში: კარკასი $140 / მ²-დან, კოლოფი ფასადითა და ფანჯრებით $250-დან, ქსელებით $300-დან. ფასი ხელშეკრულებაში.",
  crumb: "სახლი მოსაპირკეთებლად",
  heroEyebrow: "კერძო დამკვეთებს",
  heroTitle: "სახლი მოსაპირკეთებლად:<br><em>მტკიცე ნაწილი ჩვენზეა</em>",
  heroLead: "ONEZA Construction თბილისში აშენებს მონოლითურ კერძო სახლებს 160 მ²-დან, 1–3 სართულს, 8–14 თვეში და აბარებს მოსაპირკეთებლად. 2026 წლის ორიენტირი: მონოლითური კარკასი — $140 / მ²-დან, კოლოფი ფასადითა და ფანჯრებით — $250 / მ²-დან, მოსაპირკეთებლად საინჟინრო ქსელებით — $300 / მ²-დან. მოპირკეთებას არ ვაკეთებთ — და ეს უფრო პატიოსანია, ვიდრე ყველაფრის ერთად დაპირება.",
  heroMore: "იღებთ იმას, რისი გადაკეთებაც შემდეგ შეუძლებელია: საძირკველი თქვენს გრუნტზე, კარკასი სეისმიკაზე გათვლით, სახურავი, ფასადი, ფანჯრები და გაყვანილი ქსელები. შემდეგ მოპირკეთებას თავად ან თქვენი დიზაინერი აკეთებს — თქვენი ტემპითა და ბიუჯეტით, გენერალური კონტრაქტორისთვის სხვისი კაფელის ზედნადების გადახდის გარეშე. გარანტია კონსტრუქციაზე — 10 წელი.",
  ctaPrimary: "გამოთვლის მიღება",
  ctaSecondary: "როგორ მუშაობს ფიქსირებული ფასი",
  serviceLink: "chastnye-doma",
  advantages: {
    eyebrow: "რას იძლევა ეს",
    title: "რატომ არის ხელსაყრელი<br><em>სახლის მოსაპირკეთებლად ჩაბარება?</em>",
    intro: "კონსტრუქცია და მოპირკეთება სხვადასხვა წესით ცხოვრობს: პირველი ერთხელ და სამუდამოდ კეთდება, მეორე გემოვნებასა და ბიუჯეტთან ერთად იცვლება. ჩვენ პირველზე ვაგებთ პასუხს.",
    items: [
      ["blueprint", "ფული სიმტკიცეში და არა დეკორში", "ბიუჯეტი მიდის საძირკველში, არმატურაში, ბეტონსა და ჰიდროიზოლაციაში — იმაში, რაც წყვეტს, გაუძლებს თუ არა სახლი და გაივლის თუ არა ბზარები."],
      ["money", "პასუხისმგებლობის ნათელი საზღვარი", "ვაბარებთ გაზომვად შედეგს: კარკასი, სახურავი, ფასადი, ფანჯრები, ქსელები. არცერთი პრეტენზია არ იკარგება კონტრაქტორებს შორის."],
      ["shield", "მოპირკეთება თქვენი ტემპით", "შეგიძლიათ მიიღოთ მზა კოლოფი და სართულები რიგრიგობით მოაპირკეთოთ, ხარჯი გაანაწილოთ ერთი დიდი გადახდის ნაცვლად."],
      ["photo", "სეისმიკა და გრუნტი გათვლილია", "გაანგარიშება 8 ბალზე და საძირკვლის ტიპი თქვენს ნაკვეთზე: ფილა, ლენტური თუ ხიმინჯები — გეოლოგიით და არა ბრიგადის ჩვევით."],
    ],
  },
  barriers: {
    eyebrow: "რა უშლის ხელს ჩვეულებრივ",
    title: "რისი ეშინიათ<br><em>კერძო დამკვეთებს</em>",
    intro: "ოთხი მიზეზი, რის გამოც კერძო მშენებლობა საქართველოში გეგმაზე ძვირი და ხანგრძლივი გამოდის. ხელშეკრულების ხელმოწერამდე ვხსნით მათ.",
    items: [
      ["„ხარჯთაღრიცხვა გაიზრდება, როგორც ყველა ნაცნობს“", "ხარჯთაღრიცხვა სამუშაო პროექტით ითვლება და ხელშეკრულების დანართი ხდება. ის არ გადაიხედება კურსისა და მასალების გაძვირების გამო — მხოლოდ მაშინ, თუ თქვენ თავად შეცვლით დავალებას."],
      ["„ნაკვეთი ფერდობზე ძვირი და საშიშია“", "ფერდობი ცალკე ითვლება: საყრდენი კედლები, დრენაჟი და საძირკვლის ტიპი მშენებლობამდე იპროექტება. ნულოვანი ციკლის ღირებულებას ნაკვეთის შეძენამდე ხედავთ და არა სამუშაოების შუაში."],
      ["„ჩემ გარეშე ბეტონს როგორმე დაასხამენ“", "ფარული სამუშაოები მიიღება აქტებით ფოტოფიქსაციით, ბეტონსა და არმირებას ამოწმებს დამოუკიდებელი ტექზედამხედველი. ნებისმიერ დროს შეგიძლიათ მოიყვანოთ თქვენი ინჟინერი."],
      ["„ნებართვას თავად გავაკეთებ — და გავიჭედები“", "ქალაქთმშენებლობით პირობებს, განაშენიანების კოეფიციენტებსა და მერიაში განცხადებას ჩვენ ვიღებთ. შემდგომი ლეგალიზაცია რამდენჯერმე ძვირი ჯდება, ამიტომ ნებართვას სამუშაოებამდე ვიღებთ."],
    ],
  },
  spec: {
    eyebrow: "პარამეტრები",
    title: "როგორ სახლს<br><em>ვაშენებთ?</em>",
    head: ["პარამეტრი", "მნიშვნელობა"],
    rows: [
      ["ფორმატი", "სახლები, რეზიდენციები, სასტუმრო სახლები, აუზები"],
      ["ფართობი", "160 მ²-დან"],
      ["სართულიანობა", "1–3 სართული, ცოკოლი"],
      ["კონსტრუქცია", "მონოლითური კარკასი, აგური ან ბლოკი"],
      ["მზადყოფნა", "მოსაპირკეთებლად: კოლოფი, სახურავი, ფანჯრები, ფასადი, ქსელები"],
      ["ვადა", "8–14 თვე"],
    ],
  },
  faq: {
    eyebrow: "დამკვეთის კითხვები",
    title: "რას კითხულობენ<br><em>სახლის მშენებლობამდე?</em>",
    items: [
      ["რა შედის მზადყოფნაში „მოსაპირკეთებლად“?", "საძირკველი და მონოლითური კარკასი, კედლები, სახურავი, ფასადი, ფანჯრები და გაყვანილი საინჟინრო ქსელები — ელექტროობა, წყალი, კანალიზაცია, გათბობა. შემდეგ მოდის ბათქაში, მოჭიმვა, კაფელი და ავეჯი: ეს მოპირკეთებაა, მას არ ვასრულებთ."],
      ["რა ღირს 200 მ² სახლი მოსაპირკეთებლად?", "2026 წლის ორიენტირით — $300 / მ²-დან საინჟინრო ქსელებით, ანუ $60 000-დან 200 მ²-ზე მარტივ რელიეფსა და სტანდარტულ გადაწყვეტებზე. ზუსტი თანხა პროექტით ითვლება: ფერდობი, საძირკვლის ტიპი და მინაპაკეტების ფართობი მას შესამჩნევად ცვლის."],
      ["რატომ არ აკეთებთ მოპირკეთებას?", "იმიტომ, რომ ეს სხვა ბიზნესია სხვა ტემპითა და სხვა პასუხისმგებლობით. ჩვენს ბრიგადებს მონოლითსა და კონსტრუქციაზე ვამუშავებთ — იქ, სადაც შეცდომა ყველაზე ძვირი ჯდება და შემდეგ აღარ სწორდება."],
      ["შეიძლება მხოლოდ კარკასის შეკვეთა?", "დიახ, მონოლითური სამუშაოები ცალკე ეტაპად იყიდება: საძირკველი, კარკასი, გადახურვები, კიბეები. შემდეგ უფლება გაქვთ ააშენოთ ვისთანაც გსურთ."],
    ],
  },
  contact: {
    eyebrow: "შემდეგი ნაბიჯი",
    title: "გამოვთვალოთ<br><em>თქვენი სახლი</em>",
    text: "გამოგვიგზავნეთ ფართობი და ნაკვეთის საკადასტრო კოდი — ერთ სამუშაო საათში გიპასუხებთ ფასისა და ვადის ორიენტირით.",
    objtype: "კერძო სახლი",
  },
  serviceName: "კერძო სახლების მშენებლობა თბილისში",
};

export const DOM_POD_OTDELKU: Record<Lang, LandingPage> = { ka, ru, en };
