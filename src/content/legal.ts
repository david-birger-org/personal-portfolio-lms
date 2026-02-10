import type { Locale } from "@/i18n/config";

export type LegalDocId = "privacy" | "terms" | "cookies";

export type LegalSection = {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
};

export type LegalDoc = {
  title: string;
  lastUpdated: string;
  intro: string[];
  sections: LegalSection[];
};

export type LegalUiStrings = {
  backToHome: string;
  lastUpdatedLabel: string;
};

type LegalContent = {
  ui: LegalUiStrings;
  docs: Record<LegalDocId, LegalDoc>;
};

export const legalContent: Record<Locale, LegalContent> = {
  en: {
    ui: {
      backToHome: "Back to home",
      lastUpdatedLabel: "Last updated",
    },
    docs: {
      privacy: {
        title: "Privacy Policy",
        lastUpdated: "February 10, 2026",
        intro: [
          'This Privacy Policy explains how this website (the "Site") collects, uses, and shares information when you visit the Site or contact us.',
          "If you have questions about privacy, you can contact us using the contact form on the Site.",
        ],
        sections: [
          {
            heading: "Information we collect",
            paragraphs: ["We collect information in a few ways:"],
            bullets: [
              "Information you provide: name, email, phone number, social handle, country, and message when you contact us.",
              "Newsletter information: email address if you subscribe (if available).",
              "Usage information: approximate location, device/browser information, pages viewed, and interactions for analytics and performance monitoring.",
              "Cookies and similar technologies: see the Cookie Policy for details.",
            ],
          },
          {
            heading: "How we use your information",
            bullets: [
              "To respond to your inquiries and communicate with you.",
              "To provide and improve coaching services and website content.",
              "To maintain the security and performance of the Site.",
              "To understand how the Site is used (analytics).",
            ],
          },
          {
            heading: "How we share information",
            paragraphs: [
              "We do not sell your personal information. We may share information in limited cases:",
            ],
            bullets: [
              "Service providers: hosting, analytics, and infrastructure providers that help operate the Site.",
              "Legal obligations: if required to comply with law or to protect our rights and safety.",
            ],
          },
          {
            heading: "Data retention",
            paragraphs: [
              "We keep personal information only as long as needed to respond to you, provide services, and meet legal, accounting, or security obligations.",
            ],
          },
          {
            heading: "Security",
            paragraphs: [
              "We use reasonable administrative and technical safeguards. However, no method of transmission or storage is 100% secure.",
            ],
          },
          {
            heading: "Your choices and rights",
            bullets: [
              "You can request access, correction, or deletion of your personal information.",
              "You can opt out of non-essential cookies through your browser settings.",
              "You can withdraw consent where processing is based on consent.",
            ],
          },
          {
            heading: "Children's privacy",
            paragraphs: [
              "The Site is not intended for children under 13. If you believe a child has provided personal information, contact us and we will take appropriate steps.",
            ],
          },
          {
            heading: "Changes to this policy",
            paragraphs: [
              'We may update this Privacy Policy from time to time. We will post the updated version on this page with a new "Last updated" date.',
            ],
          },
        ],
      },
      terms: {
        title: "Terms of Service",
        lastUpdated: "February 10, 2026",
        intro: [
          'These Terms of Service ("Terms") govern your use of the Site and any services or content provided through it.',
          "By using the Site, you agree to these Terms.",
        ],
        sections: [
          {
            heading: "Use of the Site",
            bullets: [
              "You may use the Site for lawful purposes only.",
              "You agree not to misuse the Site, attempt unauthorized access, or interfere with its operation.",
            ],
          },
          {
            heading: "Coaching and informational content",
            paragraphs: [
              "Any fitness, nutrition, and training information on the Site is for general informational purposes and does not constitute medical advice.",
            ],
            bullets: [
              "Always consult a qualified healthcare professional before starting a new exercise or nutrition program.",
              "You are responsible for your own decisions, actions, and results.",
            ],
          },
          {
            heading: "Bookings, payments, and refunds",
            paragraphs: [
              "If you purchase coaching services, the specific scope, pricing, payment schedule, and refund rules will be provided separately and will control in case of conflict.",
            ],
          },
          {
            heading: "Intellectual property",
            bullets: [
              "The Site content (text, graphics, logos, and materials) is owned by or licensed to us and is protected by applicable laws.",
              "You may not copy, reproduce, or distribute Site content without permission, except for personal, non-commercial use.",
            ],
          },
          {
            heading: "Third-party links",
            paragraphs: [
              "The Site may include links to third-party websites or services. We are not responsible for their content, policies, or practices.",
            ],
          },
          {
            heading: "Disclaimers",
            paragraphs: [
              'The Site is provided on an "as is" and "as available" basis. We do not guarantee that the Site will be uninterrupted, error-free, or free of harmful components.',
            ],
          },
          {
            heading: "Limitation of liability",
            paragraphs: [
              "To the maximum extent permitted by law, we will not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Site.",
            ],
          },
          {
            heading: "Changes to these Terms",
            paragraphs: [
              "We may update these Terms from time to time. Continued use of the Site after changes means you accept the updated Terms.",
            ],
          },
        ],
      },
      cookies: {
        title: "Cookie Policy",
        lastUpdated: "February 10, 2026",
        intro: [
          "This Cookie Policy explains how we use cookies and similar technologies on the Site.",
          "Cookies are small text files stored on your device that help websites function and remember preferences.",
        ],
        sections: [
          {
            heading: "How we use cookies",
            bullets: [
              "Essential cookies: required for core functionality (for example, remembering your language preference).",
              "Preference cookies: remember choices and settings to improve your experience.",
              "Analytics/performance: help us understand traffic and improve performance.",
            ],
          },
          {
            heading: "Examples of cookies we may set",
            bullets: [
              "NEXT_LOCALE: stores your language preference.",
              "sidebar_state: remembers UI preference in parts of the interface (if used).",
            ],
          },
          {
            heading: "Third-party services",
            paragraphs: [
              "We may use third-party services for analytics and performance monitoring. Depending on configuration and your browser, these services may use cookies or similar technologies.",
            ],
          },
          {
            heading: "Managing cookies",
            bullets: [
              "You can control cookies through your browser settings (block, delete, or limit cookies).",
              "If you disable essential cookies, some parts of the Site may not work correctly.",
            ],
          },
          {
            heading: "Changes to this policy",
            paragraphs: [
              'We may update this Cookie Policy from time to time. We will post the updated version on this page with a new "Last updated" date.',
            ],
          },
        ],
      },
    },
  },
  ua: {
    ui: {
      backToHome: "Назад на головну",
      lastUpdatedLabel: "Останнє оновлення",
    },
    docs: {
      privacy: {
        title: "Політика конфіденційності",
        lastUpdated: "10 лютого 2026",
        intro: [
          'Ця Політика конфіденційності пояснює, як цей вебсайт (далі - "Сайт") збирає, використовує та передає інформацію, коли ви відвідуєте Сайт або звертаєтесь до нас.',
          "Якщо у вас є питання щодо приватності, ви можете зв'язатися з нами через форму на Сайті.",
        ],
        sections: [
          {
            heading: "Яку інформацію ми збираємо",
            paragraphs: ["Ми можемо збирати інформацію кількома способами:"],
            bullets: [
              "Інформація, яку ви надаєте: ім'я, email, номер телефону, нік у соцмережах, країна та повідомлення, коли ви звертаєтесь до нас.",
              "Інформація для розсилки: email-адреса, якщо ви підписуєтесь (за наявності такої функції).",
              "Технічна/поведінкова інформація: приблизне місцезнаходження, дані про пристрій/браузер, переглянуті сторінки та взаємодії для аналітики та моніторингу продуктивності.",
              "Cookies та подібні технології: подробиці - у Політиці cookies.",
            ],
          },
          {
            heading: "Як ми використовуємо вашу інформацію",
            bullets: [
              "Щоб відповідати на ваші запити та спілкуватися з вами.",
              "Щоб надавати та покращувати коучингові послуги й контент Сайту.",
              "Щоб підтримувати безпеку та продуктивність Сайту.",
              "Щоб розуміти, як використовується Сайт (аналітика).",
            ],
          },
          {
            heading: "Як ми передаємо інформацію",
            paragraphs: [
              "Ми не продаємо ваші персональні дані. Ми можемо передавати інформацію лише в обмежених випадках:",
            ],
            bullets: [
              "Постачальникам послуг: хостинг, аналітика та інфраструктурні сервіси, які допомагають підтримувати роботу Сайту.",
              "Виконання вимог закону: якщо це потрібно для дотримання законодавства або захисту наших прав та безпеки.",
            ],
          },
          {
            heading: "Зберігання даних",
            paragraphs: [
              "Ми зберігаємо персональні дані лише стільки, скільки потрібно для відповіді на ваш запит, надання послуг та виконання правових, бухгалтерських або безпекових вимог.",
            ],
          },
          {
            heading: "Безпека",
            paragraphs: [
              "Ми застосовуємо розумні адміністративні та технічні заходи захисту. Водночас жоден спосіб передавання або зберігання не є на 100% безпечним.",
            ],
          },
          {
            heading: "Ваші права та вибір",
            bullets: [
              "Ви можете запросити доступ, виправлення або видалення ваших персональних даних.",
              "Ви можете керувати не обов'язковими cookies через налаштування браузера.",
              "Ви можете відкликати згоду, якщо обробка базується на згоді.",
            ],
          },
          {
            heading: "Конфіденційність дітей",
            paragraphs: [
              "Сайт не призначений для дітей віком до 13 років. Якщо ви вважаєте, що дитина надала персональні дані, зв'яжіться з нами - ми вживемо відповідних заходів.",
            ],
          },
          {
            heading: "Зміни до цієї політики",
            paragraphs: [
              'Ми можемо час від часу оновлювати цю Політику конфіденційності. Оновлена версія буде опублікована на цій сторінці з новою датою "Останнє оновлення".',
            ],
          },
        ],
      },
      terms: {
        title: "Умови використання",
        lastUpdated: "10 лютого 2026",
        intro: [
          'Ці Умови використання (далі - "Умови") регулюють використання вами Сайту та будь-яких сервісів або контенту, що надаються через нього.',
          "Користуючись Сайтом, ви погоджуєтеся з цими Умовами.",
        ],
        sections: [
          {
            heading: "Користування Сайтом",
            bullets: [
              "Ви можете використовувати Сайт лише в законних цілях.",
              "Ви погоджуєтесь не зловживати Сайтом, не намагатися отримати несанкціонований доступ та не перешкоджати його роботі.",
            ],
          },
          {
            heading: "Коучинг та інформаційні матеріали",
            paragraphs: [
              "Будь-яка інформація про тренування, харчування або фітнес на Сайті надається лише для загального ознайомлення та не є медичною порадою.",
            ],
            bullets: [
              "Перед початком нової програми тренувань або харчування проконсультуйтеся з кваліфікованим медичним фахівцем.",
              "Ви самостійно несете відповідальність за свої рішення, дії та результати.",
            ],
          },
          {
            heading: "Запис, оплата та повернення коштів",
            paragraphs: [
              "Якщо ви купуєте коучингові послуги, конкретний обсяг, ціна, графік оплати та правила повернення будуть надані окремо й матимуть пріоритет у разі суперечностей.",
            ],
          },
          {
            heading: "Інтелектуальна власність",
            bullets: [
              "Контент Сайту (текст, графіка, логотипи та матеріали) належить нам або використовується на підставі ліцензії та захищається чинним законодавством.",
              "Ви не можете копіювати, відтворювати або поширювати контент Сайту без дозволу, окрім особистого некомерційного використання.",
            ],
          },
          {
            heading: "Посилання на сторонні ресурси",
            paragraphs: [
              "Сайт може містити посилання на сторонні вебсайти або сервіси. Ми не несемо відповідальності за їхній контент, політики чи практики.",
            ],
          },
          {
            heading: "Відмова від гарантій",
            paragraphs: [
              'Сайт надається на умовах "як є" та "як доступно". Ми не гарантуємо безперебійну роботу, відсутність помилок або шкідливих компонентів.',
            ],
          },
          {
            heading: "Обмеження відповідальності",
            paragraphs: [
              "У максимально дозволеній законом мірі ми не несемо відповідальності за будь-які непрямі, випадкові, спеціальні, наслідкові або штрафні збитки, що виникають у зв'язку з використанням Сайту.",
            ],
          },
          {
            heading: "Зміни до цих Умов",
            paragraphs: [
              "Ми можемо час від часу оновлювати ці Умови. Подальше використання Сайту після змін означає вашу згоду з оновленою версією.",
            ],
          },
        ],
      },
      cookies: {
        title: "Політика cookies",
        lastUpdated: "10 лютого 2026",
        intro: [
          "Ця Політика cookies пояснює, як ми використовуємо cookies та подібні технології на Сайті.",
          "Cookies - це невеликі текстові файли, які зберігаються на вашому пристрої та допомагають сайтам працювати й запам'ятовувати налаштування.",
        ],
        sections: [
          {
            heading: "Як ми використовуємо cookies",
            bullets: [
              "Обов'язкові cookies: потрібні для базової роботи (наприклад, запам'ятовують мову інтерфейсу).",
              "Cookies налаштувань: запам'ятовують ваші вибори та параметри для кращого досвіду.",
              "Аналітика/продуктивність: допомагають нам розуміти трафік і покращувати швидкодію.",
            ],
          },
          {
            heading: "Приклади cookies, які ми можемо встановлювати",
            bullets: [
              "NEXT_LOCALE: зберігає вашу мовну перевагу.",
              "sidebar_state: запам'ятовує налаштування інтерфейсу в окремих частинах (за наявності).",
            ],
          },
          {
            heading: "Сторонні сервіси",
            paragraphs: [
              "Ми можемо використовувати сторонні сервіси для аналітики та моніторингу продуктивності. Залежно від налаштувань і вашого браузера такі сервіси можуть використовувати cookies або подібні технології.",
            ],
          },
          {
            heading: "Керування cookies",
            bullets: [
              "Ви можете керувати cookies через налаштування браузера (блокувати, видаляти або обмежувати).",
              "Якщо вимкнути обов'язкові cookies, деякі частини Сайту можуть працювати некоректно.",
            ],
          },
          {
            heading: "Зміни до цієї політики",
            paragraphs: [
              'Ми можемо час від часу оновлювати цю Політику cookies. Оновлена версія буде опублікована на цій сторінці з новою датою "Останнє оновлення".',
            ],
          },
        ],
      },
    },
  },
};

export function getLegalDoc(locale: Locale, id: LegalDocId) {
  return legalContent[locale].docs[id];
}
