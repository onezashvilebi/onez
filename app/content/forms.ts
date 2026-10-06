// Единственное место, где описаны формы заявки (закон 9). Полей — минимум:
// что строим (для проверки участка — кадастровый номер) и как связаться;
// остальное менеджер уточнит в разговоре. Меняешь состав — проверь все три
// сценария. Строки — русский пивот, кроме foreign (англоязычный лендинг, raw).

export type Field = {
  name: string;
  label: string;
  /** У input — подсказка; у select — пустой первый пункт. */
  placeholder?: string;
  options?: string[];
  /** Текст ошибки; есть — значит поле обязательное. */
  required?: string;
  inputMode?: "numeric";
  autoComplete?: string;
};

export type FormConfig = {
  fields: Field[];
  submit: string;
  privacy: string;
  /** Заявка принята: заголовок и текст экрана, шаги после заявки. */
  sent: [string, string];
  next: string[];
  /** Бот не принял заявку: заголовок, текст, кнопка WhatsApp с готовым сообщением. */
  fallback: [string, string, string];
};

// Значения options — те же строки, что objtype страниц услуг и посадочных
// (services.ts, content/pages/landings): совпадения нет — тип объекта на
// странице не подставится в форму и посетитель выбирает его заново.
const TYPE_FIELD: Field = { name: "type", label: "Что строим", placeholder: "Выберите тип объекта", options: ["Жилой корпус", "Производство или склад", "Частный дом", "Фундамент или монолитные работы", "Подпорная стена"], required: "Выберите тип объекта" };
// required — не только «не пусто»: значение проверяется isValidContact() (телефон или @ник).
const CONTACT_FIELD: Field = { name: "phone", label: "Телефон, WhatsApp или Telegram", placeholder: "+995 или @username", required: "Укажите телефон (например, +995 599 00 00 00) или ник через @", autoComplete: "tel" };
const PRIVACY_RU = 'Нажимая кнопку, вы соглашаетесь с <a href="politika.html">политикой конфиденциальности</a>.';
const SENT_RU: FormConfig["sent"] = ["Заявка отправлена", "Менеджер свяжется с вами в течение рабочего часа — по телефону или в мессенджере, который вы указали."];
const FALLBACK_RU: FormConfig["fallback"] = ["Заявка готова", "Автоматически отправить не получилось. Текст уже собран — отправьте его нам в WhatsApp одним нажатием.", "Отправить в WhatsApp"];

export const FORMS = {
  estimate: {
    fields: [TYPE_FIELD, CONTACT_FIELD],
    submit: "Получить предварительный расчёт",
    privacy: PRIVACY_RU,
    sent: SENT_RU,
    next: ["Уточним задачу, участок и сроки", "Подготовим предварительный расчёт", "Договоримся о встрече на площадке"],
    fallback: FALLBACK_RU,
  },
  cadastral: {
    fields: [{ name: "cadastral", label: "Кадастровый номер", placeholder: "01.14.03.021.045", required: "Укажите кадастровый номер" }, CONTACT_FIELD],
    submit: "Проверить участок",
    privacy: PRIVACY_RU,
    sent: SENT_RU,
    next: ["Запросим выписку из реестра", "Проверим зонирование, сети и обременения", "Пришлём заключение с картой рисков"],
    fallback: FALLBACK_RU,
  },
  foreign: {
    fields: [
      { name: "type", label: "Project type", placeholder: "Choose", options: ["Rental residential building", "Warehouse or production facility", "Private house or villa", "Not sure yet"], required: "Choose a project type" },
      { name: "phone", label: "Phone, WhatsApp or Telegram", placeholder: "+ country code or @username", required: "Enter a phone number (e.g. +1 555 000 0000) or a @handle", autoComplete: "tel" },
    ],
    submit: "Request an assessment",
    privacy: 'By submitting you agree to our <a href="politika.html">privacy policy</a>.',
    sent: ["Request sent", "Our manager will contact you within one working hour via the phone or messenger you provided."],
    next: ["We clarify the task, the plot and timing", "We prepare a preliminary assessment", "We schedule a video call or a site visit"],
    fallback: ["Request ready", "We couldn't send it automatically. The message is ready — send it to us on WhatsApp in one tap.", "Send via WhatsApp"],
  },
} satisfies Record<string, FormConfig>;

export type FormVariant = keyof typeof FORMS;
