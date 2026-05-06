import type { BabySex } from "../models/types";

export type Language = "en" | "he";

export const SUPPORTED_LANGUAGES: Language[] = ["en", "he"];

export const RTL_LANGUAGES: Language[] = ["he"];

export interface Messages {
  app: {
    name: string;
    subtitle: string;
  };
  nav: {
    analyze: string;
    myBaby: string;
    about: string;
  };
  landing: {
    eyebrow: string;
    titleLine1: string;
    titleLine2: string;
    body: string;
    ctaStart: string;
    ctaContinue: string;
    ctaDemo: string;
    feature1Title: string;
    feature1Body: string;
    feature2Title: string;
    feature2Body: string;
    feature3Title: string;
    feature3Body: string;
    pillsImmediate: string;
    pillsNoTracking: string;
    pillsOptionalContext: string;
    pillsIntuition: string;
  };
  setup: {
    back: string;
    eyebrow: string;
    title: string;
    subtitle: string;
    nameLabel: string;
    namePlaceholder: string;
    birthDateLabel: string;
    sexLabel: string;
    sexOptions: Array<{ label: string; value: BabySex }>;
    aiSectionTitle: string;
    aiCardTitle: string;
    aiCardBody: string;
    optionalTitle: string;
    feedingLabel: string;
    wakeLabel: string;
    wakeOptions: Array<{ label: string; value: number }>;
    notesLabel: string;
    notesPlaceholder: string;
    save: string;
  };
  analyze: {
    eyebrowFor: (name: string) => string;
    eyebrowDefault: string;
    titlePrepare: string;
    titleResult: string;
    subtitlePrepare: string;
    subtitleResult: string;
    new: string;
    setUp: string;
    demoCardTitle: string;
    demoCardSubtitle: string;
    orShare: string;
    previewLabel: string;
    sourceLabel: (kind: string) => string;
    watchingTitle: string;
    watchingSubtitle: string;
    analyzeNow: string;
    primary: string;
    breakdown: string;
    signals: string;
    suggestions: string;
    seePatterns: string;
    whyChanged: string;
  };
  upload: {
    videoLabel: string;
    videoHint: string;
    audioLabel: string;
    audioHint: string;
    imageLabel: string;
    imageHint: string;
  };
  refine: {
    title: string;
    subtitle: string;
    lastFeedLabel: string;
    awakeLabel: string;
    freeTextLabel: string;
    freeTextPlaceholder: string;
    submit: string;
    submitting: string;
  };
  feedback: {
    title: string;
    subtitle: string;
    yes: string;
    partly: string;
    no: string;
    actualState: string;
    noteLabel: string;
    notePlaceholder: string;
    save: string;
    savedYes: string;
    savedOther: string;
  };
  dashboard: {
    eyebrow: string;
    edit: string;
    statAnalyses: string;
    statConfirmed: string;
    statPatterns: string;
    distributionTitle: string;
    distributionTotal: (n: number) => string;
    barTitle: string;
    insightsTitle: string;
    adviceTitle: string;
    historyTitle: string;
    clear: string;
    confirmClear: string;
    noHistoryYet: string;
    runFirst: string;
    resetProfile: string;
    confirmReset: string;
    profileEmptyTitle: string;
    profileEmptySubtitle: string;
    profileEmptyCardTitle: string;
    profileEmptyCardSubtitle: string;
    quickSetup: string;
    youConfirmed: string;
    actually: (state: string) => string;
    refinedByYou: string;
  };
  about: {
    eyebrow: string;
    title: string;
    subtitle: string;
    s1Title: string;
    s1Body: string;
    s2Title: string;
    s2Body: string;
    s3Title: string;
    s3Body: string;
    s4Title: string;
    s4Body: string;
    whyTitle: string;
    why1: string;
    why2: string;
    why3: string;
    privacyTitle: string;
    privacyBody: string;
    footer: string;
  };
  states: {
    tired: string;
    overstimulated: string;
    hungry: string;
    discomfort: string;
    content: string;
    playful: string;
    other: string;
  };
  age: {
    days: (n: number, sex?: BabySex) => string;
    weeks: (n: number, sex?: BabySex) => string;
    months: (n: number, sex?: BabySex) => string;
  };
  demo: {
    primaryLabel: string;
    explanation: string;
    suggestions: string[];
    signals: string[];
    likelyPrefix: (state: string) => string;
  };
  signals: {
    reducedEyeEngagement: string;
    restlessLimbMovement: string;
    turningAway: string;
    repetitiveCryPattern: string;
    mildBodyTension: string;
  };
  demoVideo: {
    demo: string;
    aiAnalysis: string;
    demoLoaded: string;
    dropHint: string;
    mute: string;
    unmute: string;
  };
  overlay: {
    title: string;
    realAIBadge: string;
    stagesVideo: string[];
    stagesAudio: string[];
    stagesImage: string[];
    stagesDemo: string[];
  };
  ai: {
    mockShort: string;
    geminiShort: string;
    mockLong: string;
    geminiLong: string;
    mockOnly: string;
    realBadge: string;
    fallbackBadge: string;
    mockBadge: string;
    titleSwitchOn: string;
    titleSwitchOff: string;
    titleNoKey: string;
  };
  disclaimer: string;
  language: {
    label: string;
    en: string;
    he: string;
  };
  common: {
    pageTitle: string;
  };
}

const en: Messages = {
  app: {
    name: "ComuniCare",
    subtitle: "Understanding your baby's non-verbal communication",
  },
  nav: { analyze: "Analyze", myBaby: "My Baby", about: "About" },
  landing: {
    eyebrow: "From crying to communication",
    titleLine1: "Your baby is communicating.",
    titleLine2: "ComuniCare helps you understand.",
    body: "An AI companion that reads non-verbal cues — facial expression, body movement, sound — and gently translates them into what your baby might be communicating.",
    ctaStart: "Start understanding",
    ctaContinue: "Continue",
    ctaDemo: "Try demo with baby video",
    feature1Title: "Analyze the moment",
    feature1Body:
      "Upload a clip and get a calm, structured interpretation in seconds.",
    feature2Title: "Learn patterns",
    feature2Body:
      "See trends across the day so you anticipate cues before they escalate.",
    feature3Title: "Build confidence",
    feature3Body: "Supports your intuition. Gets more personal over time.",
    pillsImmediate: "Works immediately",
    pillsNoTracking: "No heavy tracking",
    pillsOptionalContext: "Optional context only",
    pillsIntuition: "Supports your intuition",
  },
  setup: {
    back: "Back",
    eyebrow: "Quick setup",
    title: "Tell us about your baby",
    subtitle:
      "Two fields are enough. Anything else helps personalize results.",
    nameLabel: "Baby's name",
    namePlaceholder: "e.g. Maya",
    birthDateLabel: "Date of birth",
    sexLabel: "Sex",
    sexOptions: [
      { label: "Boy", value: "male" },
      { label: "Girl", value: "female" },
    ],
    aiSectionTitle: "AI engine",
    aiCardTitle: "Use real AI (Gemini)",
    aiCardBody:
      "Sends uploaded clips to Google Gemini for live analysis. Mock stays the default for instant, offline demos.",
    optionalTitle: "Optional · improves accuracy",
    feedingLabel: "Feeding every (h)",
    wakeLabel: "How long does your baby usually stay awake?",
    wakeOptions: [
      { label: "Less than 1 hour", value: 45 },
      { label: "1-2 hours", value: 90 },
      { label: "2-3 hours", value: 150 },
      { label: "3-4 hours", value: 210 },
      { label: "4-6 hours", value: 300 },
      { label: "More than 6 hours", value: 390 },
    ],
    notesLabel: "Notes",
    notesPlaceholder: "e.g. starting to teethe; reflux in the morning",
    save: "Save & continue",
  },
  analyze: {
    eyebrowFor: (name) => `For ${name}`,
    eyebrowDefault: "Analyze",
    titlePrepare: "Analyze a moment",
    titleResult: "Interpretation",
    subtitlePrepare: "Upload a clip — or run the live demo.",
    subtitleResult: "Calm, structured, and refinable.",
    new: "New",
    setUp: "Set up",
    demoCardTitle: "Try demo with baby video",
    demoCardSubtitle: "Instant analysis · no upload needed",
    orShare: "Or share a real moment",
    previewLabel: "Preview",
    sourceLabel: (kind) => `Source · ${kind}`,
    watchingTitle: "Watching the baby…",
    watchingSubtitle: "AI will interpret in a moment.",
    analyzeNow: "Analyze now",
    primary: "Primary interpretation",
    breakdown: "Probability breakdown",
    signals: "Observed cues",
    suggestions: "Worth trying",
    seePatterns: "See patterns in My Baby",
    whyChanged: "Why it changed:",
  },
  upload: {
    videoLabel: "Upload video",
    videoHint: "Movement, posture & engagement",
    audioLabel: "Upload audio",
    audioHint: "Cry rhythm & intensity",
    imageLabel: "Upload image",
    imageHint: "Facial expression",
  },
  refine: {
    title: "Want to improve accuracy?",
    subtitle: "Two quick taps. Optional free text helps too.",
    lastFeedLabel: "Last feed (h ago)",
    awakeLabel: "Awake for (min)",
    freeTextLabel: "Anything else? (optional)",
    freeTextPlaceholder: "e.g. lots of guests today, started teething",
    submit: "Refine result",
    submitting: "Refining…",
  },
  feedback: {
    title: "Was this accurate?",
    subtitle: "Your feedback teaches ComuniCare about your baby.",
    yes: "Yes",
    partly: "Partly",
    no: "No",
    actualState: "Actual state",
    noteLabel: "Note (optional)",
    notePlaceholder: "e.g. she was actually hungry",
    save: "Save feedback",
    savedYes: "Saved · thanks",
    savedOther: "Feedback saved",
  },
  dashboard: {
    eyebrow: "My Baby",
    edit: "Edit",
    statAnalyses: "Analyses",
    statConfirmed: "Confirmed",
    statPatterns: "Patterns",
    distributionTitle: "State distribution",
    distributionTotal: (n) => `${n} total`,
    barTitle: "By frequency",
    insightsTitle: "Insights",
    adviceTitle: "Personal advice",
    historyTitle: "History",
    clear: "Clear",
    confirmClear: "Clear all analyses?",
    noHistoryYet: "No analyses yet.",
    runFirst: "Run your first analysis",
    resetProfile: "Reset profile",
    confirmReset: "Reset baby profile? This won't delete history.",
    profileEmptyTitle: "Set up your baby",
    profileEmptySubtitle: "A name and age is enough to get started.",
    profileEmptyCardTitle: "Add your baby's profile",
    profileEmptyCardSubtitle:
      "Insights and advice will personalize over time.",
    quickSetup: "Quick setup",
    youConfirmed: "You confirmed",
    actually: (state) => `Actually ${state.toLowerCase()}`,
    refinedByYou: "Refined by you",
  },
  about: {
    eyebrow: "About",
    title: "Small moments, big meaning",
    subtitle: "From crying to communication.",
    s1Title: "Babies are always communicating",
    s1Body:
      "Long before words, babies express their needs through facial expression, body movement, posture, sound, and engagement. ComuniCare reads those non-verbal cues and gently puts them into language.",
    s2Title: "How the AI reasons",
    s2Body:
      "The model looks at multiple cues together — for example, soft eye contact + relaxed shoulders + rhythmic breathing — and weighs them against likely states. The breakdown you see is a probability distribution, not a verdict.",
    s3Title: "Designed to support, not replace, you",
    s3Body:
      "You know your baby best. ComuniCare supports your intuition and reduces uncertainty in hard moments. It gets more personal over time as you confirm or correct results.",
    s4Title: "What it isn't",
    s4Body:
      "ComuniCare is not a medical device and doesn't diagnose. We use careful language like \"may indicate\" and \"could suggest\" because babies are individuals, not formulas. If something feels off, trust your instinct and contact your pediatrician.",
    whyTitle: "Why this matters",
    why1: "Reduces uncertainty in tired, emotional moments",
    why2: "Helps parents respond, not just react",
    why3: "Builds confidence with every confirmed interpretation",
    privacyTitle: "Privacy by design",
    privacyBody:
      "Everything in this demo lives on your device. No accounts, no upload to a server. Optional context only.",
    footer: "ComuniCare · v0.1 · Made with care",
  },
  states: {
    tired: "Tired",
    overstimulated: "Overstimulated",
    hungry: "Hungry",
    discomfort: "Discomfort",
    content: "Content",
    playful: "Playful",
    other: "Other",
  },
  age: {
    days: (n) => `${n} day${n === 1 ? "" : "s"} old`,
    weeks: (n) => `${n} week${n === 1 ? "" : "s"} old`,
    months: (n) => `${n} month${n === 1 ? "" : "s"} old`,
  },
  demo: {
    primaryLabel: "Likely tired and slightly overstimulated",
    explanation:
      "The baby may be communicating fatigue combined with difficulty settling due to stimulation. Eye contact is fading and small body movements suggest a need to wind down.",
    suggestions: [
      "Reduce light — try a dim, calm room",
      "Reduce noise and background activity",
      "Begin a calming routine (rocking, soft humming)",
      "Hold gently with steady, predictable movement",
    ],
    signals: [
      "reduced eye engagement",
      "restless limb movement",
      "turning away from stimulus",
      "repetitive cry pattern",
      "mild body tension",
    ],
    likelyPrefix: (state) => `Likely ${state.toLowerCase()}`,
  },
  signals: {
    reducedEyeEngagement: "reduced eye engagement",
    restlessLimbMovement: "restless limb movement",
    turningAway: "turning away from stimulus",
    repetitiveCryPattern: "repetitive cry pattern",
    mildBodyTension: "mild body tension",
  },
  demoVideo: {
    demo: "Demo video",
    aiAnalysis: "AI video analysis",
    demoLoaded: "Demo baby video loaded",
    dropHint: "(drop a clip at /public/demo-baby-video.mp4 to replace)",
    mute: "Mute",
    unmute: "Unmute",
  },
  overlay: {
    title: "Composing interpretation…",
    realAIBadge: "Real AI · Gemini",
    stagesVideo: [
      "Sampling key frames…",
      "Reading body movement…",
      "Reading facial cues…",
      "Estimating engagement…",
      "Composing interpretation…",
    ],
    stagesAudio: [
      "Listening to rhythm…",
      "Measuring intensity…",
      "Detecting cry patterns…",
      "Composing interpretation…",
    ],
    stagesImage: [
      "Reading facial cues…",
      "Estimating tension…",
      "Composing interpretation…",
    ],
    stagesDemo: [
      "Sampling key frames…",
      "Reading body movement…",
      "Reading facial cues…",
      "Composing interpretation…",
    ],
  },
  ai: {
    mockShort: "Mock",
    geminiShort: "Real",
    mockLong: "AI: Mock",
    geminiLong: "AI: Gemini",
    mockOnly: "Mock AI",
    realBadge: "Real AI · Gemini",
    fallbackBadge: "Mock fallback",
    mockBadge: "Mock",
    titleSwitchOn: "Real AI on (Gemini). Tap to switch to mock.",
    titleSwitchOff: "Mock AI on. Tap to use real Gemini analysis.",
    titleNoKey: "Add VITE_GEMINI_API_KEY in .env to enable real AI",
  },
  disclaimer:
    "ComuniCare is a support tool, not a medical diagnosis. If you're worried, trust your instincts and contact your pediatrician.",
  language: {
    label: "Language",
    en: "English",
    he: "עברית",
  },
  common: {
    pageTitle: "ComuniCare — Understanding your baby",
  },
};

const he: Messages = {
  app: {
    name: "ComuniCare",
    subtitle: "מבינים את התקשורת הלא-מילולית של התינוק",
  },
  nav: { analyze: "ניתוח", myBaby: "התינוק שלי", about: "אודות" },
  landing: {
    eyebrow: "מבכי לתקשורת",
    titleLine1: "התינוק שלך מתקשר.",
    titleLine2: "ComuniCare עוזרת לך להבין.",
    body: "מלווה AI שמזהה רמזים לא-מילוליים — הבעות פנים, תנועת גוף, צלילים — ומתרגמת בעדינות מה התינוק עשוי לתקשר.",
    ctaStart: "התחילו להבין",
    ctaContinue: "המשך",
    ctaDemo: "נסו דמו עם סרטון תינוק",
    feature1Title: "ניתוח של רגע",
    feature1Body: "העלו קליפ קצר וקבלו פרשנות שקטה ומובנית בשניות.",
    feature2Title: "זיהוי דפוסים",
    feature2Body: "ראו מגמות לאורך היום כדי לזהות צורך מתפתח לפני שהוא מסלים.",
    feature3Title: "לבנות בטחון",
    feature3Body: "מחזק את האינטואיציה שלכם. מתאים את עצמו עם הזמן.",
    pillsImmediate: "עובד מיידית",
    pillsNoTracking: "ללא מעקב מורכב",
    pillsOptionalContext: "הקשר רק לפי בחירה",
    pillsIntuition: "תומך באינטואיציה שלך",
  },
  setup: {
    back: "חזרה",
    eyebrow: "הגדרה מהירה",
    title: "ספרו לנו על התינוק",
    subtitle: "שני שדות מספיקים. כל שדה נוסף מסייע להתאים אישית.",
    nameLabel: "שם התינוק/ת",
    namePlaceholder: "למשל מאיה",
    birthDateLabel: "תאריך לידה",
    sexLabel: "מין התינוק/ת",
    sexOptions: [
      { label: "בן", value: "male" },
      { label: "בת", value: "female" },
    ],
    aiSectionTitle: "מנוע AI",
    aiCardTitle: "השתמשו ב-AI אמיתי (Gemini)",
    aiCardBody:
      "שולח את הקליפים ל-Google Gemini לניתוח חי. מצב מדומה נשאר ברירת המחדל לדמו מיידי וללא חיבור.",
    optionalTitle: "אופציונלי · משפר דיוק",
    feedingLabel: "האכלה כל (שעות)",
    wakeLabel: "כמה זמן התינוק/ת בדרך כלל נשאר/ת ער/ה?",
    wakeOptions: [
      { label: "פחות משעה", value: 45 },
      { label: "1-2 שעות", value: 90 },
      { label: "2-3 שעות", value: 150 },
      { label: "3-4 שעות", value: 210 },
      { label: "4-6 שעות", value: 300 },
      { label: "יותר מ-6 שעות", value: 390 },
    ],
    notesLabel: "הערות",
    notesPlaceholder: "למשל: התחילה לבקוע שן, ריפלוקס בבוקר",
    save: "שמירה והמשך",
  },
  analyze: {
    eyebrowFor: (name) => `עבור ${name}`,
    eyebrowDefault: "ניתוח",
    titlePrepare: "ניתוח של רגע",
    titleResult: "פרשנות",
    subtitlePrepare: "העלו קליפ — או הריצו את הדמו החי.",
    subtitleResult: "שקטה, מובנית וניתנת לחידוד.",
    new: "חדש",
    setUp: "הגדרה",
    demoCardTitle: "נסו דמו עם סרטון תינוק",
    demoCardSubtitle: "ניתוח מיידי · ללא העלאה",
    orShare: "או שתפו רגע אמיתי",
    previewLabel: "תצוגה מקדימה",
    sourceLabel: (kind) => `מקור · ${kind}`,
    watchingTitle: "צופים בתינוק…",
    watchingSubtitle: "ה-AI יפרש בעוד רגע.",
    analyzeNow: "נתחו עכשיו",
    primary: "פרשנות עיקרית",
    breakdown: "פילוח הסתברויות",
    signals: "סימנים שנצפו",
    suggestions: "כדאי לנסות",
    seePatterns: "ראו דפוסים ב\u201cהתינוק שלי\u201d",
    whyChanged: "מה השתנה:",
  },
  upload: {
    videoLabel: "העלאת וידאו",
    videoHint: "תנועה, יציבה ומעורבות",
    audioLabel: "העלאת אודיו",
    audioHint: "קצב ועוצמה של בכי",
    imageLabel: "העלאת תמונה",
    imageHint: "הבעת פנים",
  },
  refine: {
    title: "רוצים לשפר את הדיוק?",
    subtitle: "שתי הקלקות. גם טקסט חופשי עוזר.",
    lastFeedLabel: "ארוחה אחרונה (שעות)",
    awakeLabel: "ערות עד עכשיו (דקות)",
    freeTextLabel: "עוד משהו? (אופציונלי)",
    freeTextPlaceholder: "למשל: הרבה אורחים היום, התחילה לבקוע שן",
    submit: "חידוד התוצאה",
    submitting: "מחדדים…",
  },
  feedback: {
    title: "האם הניתוח היה מדויק?",
    subtitle: "המשוב שלך מלמד את ComuniCare על התינוק שלך.",
    yes: "כן",
    partly: "חלקית",
    no: "לא",
    actualState: "המצב בפועל",
    noteLabel: "הערה (אופציונלי)",
    notePlaceholder: "למשל: היא הייתה בעצם רעבה",
    save: "שמירת משוב",
    savedYes: "נשמר · תודה",
    savedOther: "המשוב נשמר",
  },
  dashboard: {
    eyebrow: "התינוק שלי",
    edit: "עריכה",
    statAnalyses: "ניתוחים",
    statConfirmed: "אושרו",
    statPatterns: "דפוסים",
    distributionTitle: "פילוח מצבים",
    distributionTotal: (n) => `${n} בסך הכל`,
    barTitle: "לפי שכיחות",
    insightsTitle: "תובנות",
    adviceTitle: "עצות אישיות",
    historyTitle: "היסטוריה",
    clear: "ניקוי",
    confirmClear: "למחוק את כל הניתוחים?",
    noHistoryYet: "אין עדיין ניתוחים.",
    runFirst: "הריצו את הניתוח הראשון",
    resetProfile: "איפוס פרופיל",
    confirmReset: "לאפס את פרופיל התינוק? ההיסטוריה לא תימחק.",
    profileEmptyTitle: "הגדרת התינוק",
    profileEmptySubtitle: "שם וגיל מספיקים כדי להתחיל.",
    profileEmptyCardTitle: "הוסיפו את פרופיל התינוק",
    profileEmptyCardSubtitle: "תובנות ועצות יותאמו אישית עם הזמן.",
    quickSetup: "הגדרה מהירה",
    youConfirmed: "אישרת",
    actually: (state) => `בעצם ${state}`,
    refinedByYou: "חודד על ידך",
  },
  about: {
    eyebrow: "אודות",
    title: "רגעים קטנים, משמעות גדולה",
    subtitle: "מבכי לתקשורת.",
    s1Title: "תינוקות מתקשרים תמיד",
    s1Body:
      "הרבה לפני המילים, תינוקות מבטאים את הצרכים שלהם דרך הבעות פנים, תנועת גוף, יציבה, צלילים ומעורבות. ComuniCare מזהה את הרמזים האלה ומנסחת אותם בעדינות.",
    s2Title: "איך ה-AI חושב",
    s2Body:
      "המודל מסתכל על כמה רמזים ביחד — למשל קשר עין רך + כתפיים רפויות + נשימה קצובה — ומשקלל אותם מול מצבים אפשריים. מה שאתם רואים זו התפלגות הסתברויות, לא פסיקה.",
    s3Title: "תוכננה לתמוך בכם, לא להחליף",
    s3Body:
      "אתם מכירים את התינוק שלכם הכי טוב. ComuniCare תומכת באינטואיציה שלכם ומפחיתה אי-ודאות ברגעים קשים. היא הופכת אישית יותר עם הזמן ככל שאתם מאשרים או מתקנים תוצאות.",
    s4Title: "מה זה לא",
    s4Body:
      "ComuniCare אינה מכשיר רפואי ואינה מאבחנת. אנו משתמשים בשפה זהירה כמו \u201cעשוי להעיד על\u201d ו\u201cייתכן שמצביע על\u201d מפני שתינוקות הם פרטים, לא נוסחאות. אם משהו לא מרגיש בסדר, סמכו על האינטואיציה ופנו לרופא ילדים.",
    whyTitle: "למה זה משנה",
    why1: "מפחית אי-ודאות ברגעים עייפים ורגשיים",
    why2: "עוזר להורים להגיב, לא רק להגיב מיד",
    why3: "בונה ביטחון עם כל פרשנות שמאושרת",
    privacyTitle: "פרטיות מובנית",
    privacyBody:
      "כל מה שבדמו הזה נשאר במכשיר שלך. ללא חשבונות, ללא העלאה לשרת. הקשר רק אם תבחרו.",
    footer: "ComuniCare · גרסה 0.1 · נעשה באהבה",
  },
  states: {
    tired: "עייף/ה",
    overstimulated: "מוצף/ת",
    hungry: "רעב/ה",
    discomfort: "אי-נוחות",
    content: "רגוע/ה",
    playful: "משחקי/ת",
    other: "אחר",
  },
  age: {
    days: (n, sex) => {
      const prefix = sex === "female" ? "בת" : sex === "male" ? "בן" : "בן/בת";
      return n === 1 ? `${prefix} יום` : `${prefix} ${n} ימים`;
    },
    weeks: (n, sex) => {
      const prefix = sex === "female" ? "בת" : sex === "male" ? "בן" : "בן/בת";
      return n === 1 ? `${prefix} שבוע` : `${prefix} ${n} שבועות`;
    },
    months: (n, sex) => {
      const prefix = sex === "female" ? "בת" : sex === "male" ? "בן" : "בן/בת";
      return n === 1 ? `${prefix} חודש` : `${prefix} ${n} חודשים`;
    },
  },
  demo: {
    primaryLabel: "ככל הנראה עייף/ה ומעט מוצף/ת",
    explanation:
      "ייתכן שהתינוק/ת מתקשר/ת עייפות בשילוב עם קושי להירגע בגלל גירוי. קשר העין מתפוגג ותנועות גוף קטנות מצביעות על צורך להירגע.",
    suggestions: [
      "הפחיתו תאורה — נסו חדר עמום ושקט",
      "הפחיתו רעש ופעילות ברקע",
      "התחילו שגרת הרגעה (נדנוד, זמזום שקט)",
      "החזיקו בעדינות בתנועה יציבה וצפויה",
    ],
    signals: [
      "ירידה במגע עין",
      "תנועות גפיים אי-שקטות",
      "פנייה הצידה מהגירוי",
      "דפוס בכי חוזר",
      "מתח גוף קל",
    ],
    likelyPrefix: (state) => `ככל הנראה ${state}`,
  },
  signals: {
    reducedEyeEngagement: "ירידה במגע עין",
    restlessLimbMovement: "תנועות גפיים אי-שקטות",
    turningAway: "פנייה הצידה מהגירוי",
    repetitiveCryPattern: "דפוס בכי חוזר",
    mildBodyTension: "מתח גוף קל",
  },
  demoVideo: {
    demo: "סרטון דמו",
    aiAnalysis: "ניתוח וידאו ב-AI",
    demoLoaded: "סרטון הדמו נטען",
    dropHint: "(הניחו קליפ ב-/public/demo-baby-video.mp4 כדי להחליף)",
    mute: "השתקה",
    unmute: "ביטול השתקה",
  },
  overlay: {
    title: "מנסח פרשנות…",
    realAIBadge: "AI אמיתי · Gemini",
    stagesVideo: [
      "דוגם פריימים מרכזיים…",
      "קורא תנועת גוף…",
      "קורא הבעות פנים…",
      "מעריך מעורבות…",
      "מנסח פרשנות…",
    ],
    stagesAudio: [
      "מקשיב לקצב…",
      "מודד עוצמה…",
      "מזהה דפוסי בכי…",
      "מנסח פרשנות…",
    ],
    stagesImage: [
      "קורא הבעות פנים…",
      "מעריך מתח…",
      "מנסח פרשנות…",
    ],
    stagesDemo: [
      "דוגם פריימים מרכזיים…",
      "קורא תנועת גוף…",
      "קורא הבעות פנים…",
      "מנסח פרשנות…",
    ],
  },
  ai: {
    mockShort: "מדומה",
    geminiShort: "אמיתי",
    mockLong: "AI: מדומה",
    geminiLong: "AI: Gemini",
    mockOnly: "AI מדומה",
    realBadge: "AI אמיתי · Gemini",
    fallbackBadge: "חזרה ל-AI מדומה",
    mockBadge: "מדומה",
    titleSwitchOn: "AI אמיתי דלוק (Gemini). הקליקו כדי לעבור למדומה.",
    titleSwitchOff: "AI מדומה דלוק. הקליקו כדי להשתמש ב-Gemini אמיתי.",
    titleNoKey: "הוסיפו VITE_GEMINI_API_KEY בקובץ .env כדי לאפשר AI אמיתי",
  },
  disclaimer:
    "ComuniCare היא כלי תמיכה ולא אבחון רפואי. אם משהו מדאיג אתכם, סמכו על האינטואיציה ופנו לרופא הילדים.",
  language: {
    label: "שפה",
    en: "English",
    he: "עברית",
  },
  common: {
    pageTitle: "ComuniCare — להבין את התינוק",
  },
};

export const messages: Record<Language, Messages> = { en, he };

export function isLanguage(value: string | null | undefined): value is Language {
  return value === "en" || value === "he";
}
