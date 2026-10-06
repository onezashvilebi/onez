import type { Lang } from "~/site/pages";
import type { LandingPage } from "./types";

// Лендинг под интент «участок на склоне: можно ли строить и сколько стоит
// нулевой цикл». Услуга — /podpornye-steny.
const ru: LandingPage = {
  metaTitle: "Участок на склоне в Тбилиси",
  metaDescription: "Участок на склоне в Тбилиси: расчёт подпорных стен, дренажа и фундамента до покупки. Считаем нулевой цикл заранее, строим по всей Грузии.",
  crumb: "Участок на склоне",
  heroEyebrow: "Владельцам участков на склонах",
  heroTitle: "Участок на склоне:<br><em>сначала считаем, потом копаем</em>",
  heroLead: "Склоны Ваке, Багеби, Цавкиси, Коджори и Окроканы дают вид и тишину, но добавляют к смете подпорные стены, дренаж и другой тип фундамента. ONEZA Construction считает нулевой цикл до сделки: геология, перепад высот, устойчивость откоса, подъезд техники и реальная площадь застройки по коэффициентам — письменным заключением за 3 рабочих дня.",
  heroMore: "Ошибка на склоне стоит дороже, чем на ровном участке: подпорная стена без расчёта и дренажа трескается и сползает через две-три зимы, а переделка обходится дороже самой стены. Поэтому стену проектируют конструктор и геолог, а не бригада по месту. Гарантия на конструктив — 10 лет.",
  ctaPrimary: "Проверить участок",
  ctaSecondary: "Как устроена фиксированная цена",
  serviceLink: "podpornye-steny",
  advantages: {
    eyebrow: "Что это даёт",
    title: "Что получает владелец<br><em>участка на склоне?</em>",
    intro: "Склон — это не приговор, а набор инженерных решений с понятной ценой. Задача в том, чтобы узнать её до покупки участка, а не после первого дождя.",
    items: [
      ["layers", "Стоимость нулевого цикла заранее", "Подпорные стены, дренаж, срезка и фундамент считаются до сделки. Вы понимаете полную цену участка, а не только цену в объявлении."],
      ["drop", "Стена по расчёту, а не по образцу", "Высота, армирование, пята и угол опрокидывания считаются под конкретный грунт и нагрузку от здания выше."],
      ["blueprint", "Вода уходит от дома", "Дренаж, гидроизоляция и организованный сток проектируются вместе со стеной: большинство разрушений на склоне — это вода, а не грунт."],
      ["shield", "Один подрядчик на нулевой цикл и дом", "Стена, фундамент и коробка идут по одному договору и одному графику — без спора, чья осадка и чья трещина."],
    ],
  },
  barriers: {
    eyebrow: "Что обычно мешает",
    title: "Чего опасаются<br><em>на склоне</em>",
    intro: "Четыре страха, из-за которых хорошие участки на склонах продаются дешевле. Каждый снимается расчётом, а не уговорами.",
    items: [
      ["«Дом поедет вместе со склоном»", "Устойчивость откоса проверяется геологией и расчётом до проекта. Если участок признан непригодным, мы говорим об этом прямо и не берём работу."],
      ["«Нулевой цикл съест весь бюджет»", "Он действительно дороже: на склонах подпорные стены, сваи и дренаж добавляют к смете заметную часть. Мы показываем сумму до покупки, чтобы вы торговались за участок с цифрой на руках."],
      ["«Техника не заедет, всё будут носить руками»", "Подъезд, ширину улицы и место под складирование проверяем на выезде. Если нужна малая техника или перегрузка вручную — это попадает в смету заранее, а не в виде доплаты."],
      ["«Соседи сверху зальют участок»", "Организованный сток и перехватывающий дренаж закладываются в проект — вместе с отметками, которые учитывают, что происходит выше по склону."],
    ],
  },
  spec: {
    eyebrow: "Параметры",
    title: "Что делаем<br><em>на склоне?</em>",
    head: ["Параметр", "Значение"],
    rows: [
      ["Подпорные стены", "Монолитные железобетонные, с расчётом и дренажом"],
      ["Фундаменты", "Плита, лента, свайно-ростверковый — по геологии"],
      ["Изыскания", "Геология, перепад высот, устойчивость откоса"],
      ["Проверка участка", "15 пунктов, заключение за 3 рабочих дня"],
      ["География", "Тбилиси и пригороды, Мцхета, по всей Грузии"],
      ["Гарантия", "10 лет на конструктив"],
    ],
  },
  faq: {
    eyebrow: "Вопросы владельца",
    title: "Что спрашивают<br><em>о склонах?</em>",
    items: [
      ["Можно ли строить дом на склоне в Тбилиси?", "В большинстве случаев да: вопрос в стоимости нулевого цикла и в устойчивости откоса. Это определяется геологией, перепадом высот и тем, что происходит выше по склону, — всё проверяется до сделки."],
      ["Сколько стоит подпорная стена?", "Цена зависит от высоты, грунта и нагрузки сверху и считается по расчёту, а не по погонному метру «на глаз». Расчёт с ценой вы получаете вместе с заключением по участку."],
      ["Нужно ли разрешение на подпорную стену?", "Часто да — это зависит от высоты, положения относительно границ и зоны. Проверяем это вместе с градостроительными условиями и ведём подачу сами."],
      ["Можно заказать только стену и фундамент?", "Да, монолитные работы продаются отдельным этапом. Дальше вы вправе строить дом с любым подрядчиком."],
    ],
  },
  contact: {
    eyebrow: "Следующий шаг",
    title: "Проверим<br><em>ваш склон</em>",
    text: "Пришлите кадастровый номер — ответим в течение рабочего часа и скажем, что на этом участке реально можно построить и во что обойдётся нулевой цикл.",
    objtype: "Подпорная стена",
  },
  serviceName: "Подпорные стены и укрепление склонов",
};

const en: LandingPage = {
  metaTitle: "Building on a slope in Tbilisi",
  metaDescription: "A plot on a slope in Tbilisi: retaining walls, drainage and foundation priced before you buy. Groundworks calculated in advance, construction across Georgia.",
  crumb: "Plot on a slope",
  heroEyebrow: "For owners of sloping plots",
  heroTitle: "A plot on a slope:<br><em>calculate first, dig later</em>",
  heroLead: "The slopes of Vake, Bagebi, Tskhneti, Kojori and Okrokana give you the view and the quiet, but they add retaining walls, drainage and a different foundation to the budget. ONEZA Construction prices the groundworks before the deal: geology, level difference, slope stability, machine access and the floor area the coefficients really allow — in a written report within 3 business days.",
  heroMore: "A mistake on a slope costs more than on flat ground: a retaining wall built without calculation and drainage cracks and slides within two or three winters, and rebuilding it costs more than the wall did. That is why the wall is designed by a structural engineer and a geologist, not improvised by a crew on site. The structure carries a 10-year warranty.",
  ctaPrimary: "Check the plot",
  ctaSecondary: "How the fixed price works",
  serviceLink: "podpornye-steny",
  advantages: {
    eyebrow: "What you get",
    title: "What does an owner<br><em>of a sloping plot get?</em>",
    intro: "A slope is not a verdict but a set of engineering decisions with a price you can know. The point is to know it before buying the plot, not after the first heavy rain.",
    items: [
      ["layers", "Groundworks priced in advance", "Retaining walls, drainage, excavation and the foundation are priced before the deal. You see the full cost of the plot, not just the asking price."],
      ["drop", "A wall by calculation, not by pattern", "Height, reinforcement, footing and overturning are calculated for the actual soil and the load from the building above."],
      ["blueprint", "Water led away from the house", "Drainage, waterproofing and controlled run-off are designed together with the wall: most slope failures are water, not soil."],
      ["shield", "One contractor for groundworks and house", "Wall, foundation and shell run under one contract and one schedule — no argument about whose settlement caused whose crack."],
    ],
  },
  barriers: {
    eyebrow: "What usually goes wrong",
    title: "What people fear<br><em>on a slope</em>",
    intro: "Four fears that make good sloping plots sell cheaper. Each of them is answered by calculation, not persuasion.",
    items: [
      ["“The house will slide with the slope”", "Slope stability is verified by geology and calculation before the design. If the plot is not suitable, we say so plainly and decline the work."],
      ["“Groundworks will eat the whole budget”", "They are genuinely more expensive: on slopes, retaining walls, piles and drainage add a noticeable share to the estimate. We give you the figure before the purchase so you negotiate with a number in hand."],
      ["“Machinery cannot reach the site”", "We check access, street width and space for materials on site. If small machinery or manual handling is needed, it goes into the estimate upfront, not as an extra later."],
      ["“The neighbours above will flood the plot”", "Controlled run-off and an intercepting drain are part of the design, together with levels that account for what happens further up the slope."],
    ],
  },
  spec: {
    eyebrow: "Parameters",
    title: "What we do<br><em>on a slope</em>",
    head: ["Parameter", "Value"],
    rows: [
      ["Retaining walls", "Monolithic reinforced concrete, calculated, with drainage"],
      ["Foundations", "Raft, strip or piled — according to the geology"],
      ["Surveys", "Geology, level difference, slope stability"],
      ["Plot check", "15 points, written report in 3 business days"],
      ["Coverage", "Tbilisi and its suburbs, Mtskheta, all of Georgia"],
      ["Warranty", "10 years on the structure"],
    ],
  },
  faq: {
    eyebrow: "Owner questions",
    title: "What do people ask<br><em>about slopes?</em>",
    items: [
      ["Can you build a house on a slope in Tbilisi?", "In most cases yes: the question is the cost of the groundworks and the stability of the slope. That is decided by geology, the level difference and what happens above — all checked before the deal."],
      ["What does a retaining wall cost?", "The price depends on height, soil and the load above, and comes from a calculation rather than a guessed rate per metre. You receive the calculation with the price together with the plot report."],
      ["Does a retaining wall need a permit?", "Often yes — it depends on the height, the position relative to boundaries and the zone. We check that together with the zoning conditions and file the application ourselves."],
      ["Can I order only the wall and the foundation?", "Yes, monolithic works are sold as a separate stage. After that you are free to build the house with any contractor."],
    ],
  },
  contact: {
    eyebrow: "Next step",
    title: "Let us check<br><em>your slope</em>",
    text: "Send the cadastral number — we reply within one working hour with what can realistically be built there and what the groundworks will cost.",
    objtype: "Retaining wall",
  },
  serviceName: "Retaining walls and slope stabilisation",
};

const ka: LandingPage = {
  metaTitle: "მშენებლობა ფერდობზე თბილისში",
  metaDescription: "ნაკვეთი ფერდობზე თბილისში: საყრდენი კედლების, დრენაჟისა და საძირკვლის გაანგარიშება შეძენამდე. ნულოვან ციკლს წინასწარ ვითვლით, ვაშენებთ მთელ საქართველოში.",
  crumb: "ნაკვეთი ფერდობზე",
  heroEyebrow: "ფერდობზე ნაკვეთების მფლობელებს",
  heroTitle: "ნაკვეთი ფერდობზე:<br><em>ჯერ ვითვლით, მერე ვთხრით</em>",
  heroLead: "ვაკის, ბაგების, წავკისის, კოჯრისა და ოქროყანის ფერდობები იძლევა ხედსა და სიჩუმეს, მაგრამ ხარჯთაღრიცხვას ამატებს საყრდენ კედლებს, დრენაჟსა და სხვა ტიპის საძირკველს. ONEZA Construction ნულოვან ციკლს გარიგებამდე ითვლის: გეოლოგია, სიმაღლეთა სხვაობა, ფერდობის მდგრადობა, ტექნიკის მისასვლელი და განაშენიანების რეალური ფართობი კოეფიციენტებით — წერილობითი დასკვნით 3 სამუშაო დღეში.",
  heroMore: "შეცდომა ფერდობზე უფრო ძვირი ჯდება, ვიდრე ბრტყელ ნაკვეთზე: გაანგარიშებისა და დრენაჟის გარეშე აშენებული საყრდენი კედელი ორ-სამ ზამთარში სკდება და ცურავს, გადაკეთება კი თავად კედელზე ძვირი ჯდება. ამიტომ კედელს კონსტრუქტორი და გეოლოგი აპროექტებენ და არა ბრიგადა ადგილზე. გარანტია კონსტრუქციაზე — 10 წელი.",
  ctaPrimary: "ნაკვეთის შემოწმება",
  ctaSecondary: "როგორ მუშაობს ფიქსირებული ფასი",
  serviceLink: "podpornye-steny",
  advantages: {
    eyebrow: "რას იძლევა ეს",
    title: "რას იღებს ფერდობზე<br><em>ნაკვეთის მფლობელი?</em>",
    intro: "ფერდობი განაჩენი არ არის, არამედ საინჟინრო გადაწყვეტების ნაკრებია გასაგები ფასით. საქმე იმაშია, რომ ეს ფასი ნაკვეთის შეძენამდე გაიგოთ და არა პირველი წვიმის შემდეგ.",
    items: [
      ["layers", "ნულოვანი ციკლის ღირებულება წინასწარ", "საყრდენი კედლები, დრენაჟი, ჭრა და საძირკველი გარიგებამდე ითვლება. ხედავთ ნაკვეთის სრულ ფასს და არა მხოლოდ განცხადებაში მითითებულს."],
      ["drop", "კედელი გაანგარიშებით და არა ნიმუშით", "სიმაღლე, არმირება, ძირი და გადაბრუნების კუთხე ითვლება კონკრეტულ გრუნტსა და ზემოთ მდებარე შენობის დატვირთვაზე."],
      ["blueprint", "წყალი სახლს შორდება", "დრენაჟი, ჰიდროიზოლაცია და ორგანიზებული ჩამონადენი კედელთან ერთად იპროექტება: ფერდობზე დაზიანებების უმეტესობა წყალია და არა გრუნტი."],
      ["shield", "ერთი კონტრაქტორი ნულოვან ციკლსა და სახლზე", "კედელი, საძირკველი და კოლოფი ერთი ხელშეკრულებითა და ერთი გრაფიკით მიდის — კამათის გარეშე, ვისი ჯდომაა და ვისი ბზარი."],
    ],
  },
  barriers: {
    eyebrow: "რა უშლის ხელს ჩვეულებრივ",
    title: "რისი ეშინიათ<br><em>ფერდობზე</em>",
    intro: "ოთხი შიში, რის გამოც კარგი ნაკვეთები ფერდობებზე იაფად იყიდება. თითოეული იხსნება გაანგარიშებით და არა დარწმუნებით.",
    items: [
      ["„სახლი ფერდობთან ერთად ჩამოცურდება“", "ფერდობის მდგრადობა გეოლოგიითა და გაანგარიშებით პროექტამდე მოწმდება. თუ ნაკვეთი უვარგისად ჩაითვალა, ამას პირდაპირ ვამბობთ და სამუშაოს არ ვიღებთ."],
      ["„ნულოვანი ციკლი მთელ ბიუჯეტს შეჭამს“", "ის მართლაც უფრო ძვირია: ფერდობებზე საყრდენი კედლები, ხიმინჯები და დრენაჟი ხარჯთაღრიცხვას შესამჩნევ ნაწილს ამატებს. თანხას შეძენამდე ვაჩვენებთ, რომ ნაკვეთზე ციფრით ხელში ივაჭროთ."],
      ["„ტექნიკა ვერ შემოვა, ყველაფერს ხელით ზიდავენ“", "მისასვლელს, ქუჩის სიგანესა და მასალის დასაწყობების ადგილს ადგილზე ვამოწმებთ. თუ მცირე ტექნიკა ან ხელით გადატანაა საჭირო — ეს ხარჯთაღრიცხვაში წინასწარ შედის და არა დამატებით გადასახდელად."],
      ["„ზემოთ მცხოვრები მეზობლები ნაკვეთს დაატბორავენ“", "ორგანიზებული ჩამონადენი და გადამჭრელი დრენაჟი პროექტშია ჩადებული — იმ ნიშნულებთან ერთად, რომლებიც ითვალისწინებს, რა ხდება ფერდობზე ზემოთ."],
    ],
  },
  spec: {
    eyebrow: "პარამეტრები",
    title: "რას ვაკეთებთ<br><em>ფერდობზე?</em>",
    head: ["პარამეტრი", "მნიშვნელობა"],
    rows: [
      ["საყრდენი კედლები", "მონოლითური რკინაბეტონის, გაანგარიშებითა და დრენაჟით"],
      ["საძირკვლები", "ფილა, ლენტური, ხიმინჯ-როსტვერკული — გეოლოგიით"],
      ["კვლევები", "გეოლოგია, სიმაღლეთა სხვაობა, ფერდობის მდგრადობა"],
      ["ნაკვეთის შემოწმება", "15 პუნქტი, დასკვნა 3 სამუშაო დღეში"],
      ["გეოგრაფია", "თბილისი და შემოგარენი, მცხეთა, მთელი საქართველო"],
      ["გარანტია", "10 წელი კონსტრუქციაზე"],
    ],
  },
  faq: {
    eyebrow: "მფლობელის კითხვები",
    title: "რას კითხულობენ<br><em>ფერდობებზე?</em>",
    items: [
      ["შეიძლება თუ არა სახლის აშენება ფერდობზე თბილისში?", "უმეტეს შემთხვევაში დიახ: საკითხი ნულოვანი ციკლის ღირებულებასა და ფერდობის მდგრადობაშია. ამას განსაზღვრავს გეოლოგია, სიმაღლეთა სხვაობა და ის, რაც ფერდობზე ზემოთ ხდება — ყველაფერი გარიგებამდე მოწმდება."],
      ["რა ღირს საყრდენი კედელი?", "ფასი დამოკიდებულია სიმაღლეზე, გრუნტსა და ზემოდან დატვირთვაზე და გაანგარიშებით ითვლება და არა „თვალზომით“ გრძივ მეტრზე. გაანგარიშებას ფასთან ერთად ნაკვეთის დასკვნასთან ერთად იღებთ."],
      ["სჭირდება თუ არა საყრდენ კედელს ნებართვა?", "ხშირად დიახ — ეს დამოკიდებულია სიმაღლეზე, საზღვრებთან მდებარეობასა და ზონაზე. ამას ქალაქთმშენებლობით პირობებთან ერთად ვამოწმებთ და განცხადებას თავად ვაწარმოებთ."],
      ["შეიძლება მხოლოდ კედლისა და საძირკვლის შეკვეთა?", "დიახ, მონოლითური სამუშაოები ცალკე ეტაპად იყიდება. შემდეგ უფლება გაქვთ სახლი ნებისმიერ კონტრაქტორთან ააშენოთ."],
    ],
  },
  contact: {
    eyebrow: "შემდეგი ნაბიჯი",
    title: "შევამოწმოთ<br><em>თქვენი ფერდობი</em>",
    text: "გამოგვიგზავნეთ საკადასტრო კოდი — ერთ სამუშაო საათში გიპასუხებთ და გეტყვით, რისი აშენებაა ამ ნაკვეთზე რეალურად შესაძლებელი და რა დაჯდება ნულოვანი ციკლი.",
    objtype: "საყრდენი კედელი",
  },
  serviceName: "საყრდენი კედლები და ფერდობების გამაგრება",
};

export const UCHASTOK_NA_SKLONE: Record<Lang, LandingPage> = { ka, ru, en };
