import type { BabyState } from "../models/types";
import type { Language } from "../i18n/translations";

export interface MockContent {
  explanations: Record<BabyState, string>;
  fallbackTops: Record<BabyState, string>;
  suggestions: Record<BabyState, string[]>;
  refine: {
    longWake: (mins: number) => string;
    shortWake: string;
    recentFeed: (h: number) => string;
    longSinceFeed: (h: number) => string;
    busyEnv: string;
    teething: string;
    temperature: string;
    aligned: string;
  };
  advice: {
    addProfile: { title: string; body: string };
    tryDemo: { title: string; body: string };
    windDown: { title: string; body: string };
    resets: { title: string; body: string };
    catchHunger: { title: string; body: string };
    youKnowBest: { title: string; body: string };
  };
  insights: {
    firstTime: { title: string; detail: string };
    tiredEvening: { title: string; detail: string };
    hungerInterval: (h: number) => { title: string; detail: string };
    confirmed: (n: number) => { title: string; detail: string };
    forming: { title: string; detail: string };
  };
  /** template for "Likely X" primary labels, used outside demo */
  likelyTemplate: (stateLabel: string) => string;
}

const en: MockContent = {
  fallbackTops: {
    tired: "Subtle cues",
    overstimulated: "Body cues",
    hungry: "Mouth and hand cues",
    discomfort: "Sharp sounds",
    content: "Relaxed cues",
    playful: "Bright facial cues",
    other: "Mixed cues",
  },
  explanations: {
    tired:
      "The baby may be communicating fatigue. Subtle cues suggest a need to wind down and rest.",
    overstimulated:
      "The baby could be feeling overwhelmed. Body cues suggest the environment may be too active right now.",
    hungry:
      "These cues may indicate hunger. Mouth and hand cues often appear before strong crying begins.",
    discomfort:
      "The baby could be expressing physical discomfort. Sharp sounds are worth paying attention to.",
    content:
      "The baby seems calm and content. Relaxed cues suggest this is a good moment for gentle interaction.",
    playful:
      "The baby appears engaged and playful. Bright facial cues suggest readiness for connection.",
    other:
      "The signals are mixed. A short observation pause may help clarify.",
  },
  suggestions: {
    tired: [
      "Dim the lights and lower noise",
      "Try a calming routine (rocking, soft humming)",
      "Offer a quiet sleep space",
      "Hold gently with steady movement",
    ],
    overstimulated: [
      "Reduce visual and audio stimulation",
      "Move to a quieter room",
      "Offer skin-to-skin contact",
      "Slow your own pace and voice",
    ],
    hungry: [
      "Offer feeding when you're ready",
      "Watch for early cues to avoid overhunger",
      "Try a calm setting for feeding",
    ],
    discomfort: [
      "Check temperature and clothing",
      "Check diaper",
      "Try gentle tummy massage",
      "If discomfort persists, consider a pediatrician",
    ],
    content: [
      "Enjoy this calm moment",
      "Soft talking or eye contact can deepen bonding",
    ],
    playful: [
      "Engage with gentle play and eye contact",
      "Mirror their sounds",
      "Watch for the moment they look away — a sign of \"enough\"",
    ],
    other: [
      "Pause and observe for another 30–60 seconds",
      "Try a small environment change",
    ],
  },
  refine: {
    longWake: (m) =>
      `Long wake window (${m} min) strengthens tiredness interpretation`,
    shortWake: "Short wake window weakens tiredness interpretation",
    recentFeed: (h) =>
      `Recent feed (${h.toFixed(1)} h ago) lowers hunger probability`,
    longSinceFeed: (h) =>
      `Long since last feed (${h.toFixed(1)} h) raises hunger probability`,
    busyEnv: "Mention of busy environment supports overstimulation",
    teething: "Mention of teething supports discomfort",
    temperature: "Temperature-related note adds discomfort weight",
    aligned:
      "Context aligns with the original interpretation, raising overall confidence.",
  },
  advice: {
    addProfile: {
      title: "Add your baby's profile",
      body: "Even a name and age helps ComuniCare personalize interpretation.",
    },
    tryDemo: {
      title: "Try the demo first",
      body: "It's the fastest way to see how ComuniCare reads non-verbal cues.",
    },
    windDown: {
      title: "Protect the wind-down window",
      body: "Tiredness comes up often. A predictable 10-minute wind-down can prevent overtiredness.",
    },
    resets: {
      title: "Build short reset moments",
      body: "When activity is high, a 2-minute quiet break can reset your baby's nervous system.",
    },
    catchHunger: {
      title: "Catch hunger early",
      body: "Rooting and hand-to-mouth tend to appear before crying. Feeding then is calmer for everyone.",
    },
    youKnowBest: {
      title: "You know your baby best",
      body: "ComuniCare supports your intuition — it doesn't replace it.",
    },
  },
  insights: {
    firstTime: {
      title: "Insights appear after your first analysis",
      detail: "Run a quick demo or upload a clip to start building patterns.",
    },
    tiredEvening: {
      title: "Tired signals cluster in the evening",
      detail:
        "Most tired states appear between 5pm and 9pm. Consider an earlier wind-down.",
    },
    hungerInterval: (h) => ({
      title: `Hunger appears ~${h}h after feeding`,
      detail:
        "A consistent rhythm helps you anticipate cues before they escalate.",
    }),
    confirmed: (n) => ({
      title: `You confirmed ${n} interpretation${n === 1 ? "" : "s"}`,
      detail: "Your feedback fine-tunes future suggestions.",
    }),
    forming: {
      title: "Patterns are still forming",
      detail: "A few more analyses will help ComuniCare see daily rhythms.",
    },
  },
  likelyTemplate: (label) => `Likely ${label.toLowerCase()}`,
};

const he: MockContent = {
  fallbackTops: {
    tired: "איתותים עדינים",
    overstimulated: "איתותי גוף",
    hungry: "איתותי פה וידיים",
    discomfort: "צלילים חדים",
    content: "איתותים רפויים",
    playful: "הבעות פנים בהירות",
    other: "איתותים מעורבים",
  },
  explanations: {
    tired:
      "ייתכן שהתינוק/ת מתקשר/ת עייפות. איתותים עדינים מצביעים על צורך להירגע ולנוח.",
    overstimulated:
      "ייתכן שהתינוק/ת מרגיש/ה מוצף/ת. איתותי גוף מצביעים שייתכן שהסביבה פעילה מדי כרגע.",
    hungry:
      "האיתותים האלה עשויים להעיד על רעב. איתותי פה וידיים מופיעים לרוב לפני שבכי חזק מתחיל.",
    discomfort:
      "ייתכן שהתינוק/ת מבטא/ת אי-נוחות פיזית. צלילים חדים שווים תשומת לב.",
    content:
      "התינוק/ת נראה/ת רגוע/ה ושבע/ה רצון. איתותים רפויים מצביעים שזה רגע טוב לאינטראקציה עדינה.",
    playful:
      "התינוק/ת נראה/ת מעורב/ת ומשחקי/ת. הבעות פנים בהירות מצביעות על מוכנות לקשר.",
    other: "האיתותים מעורבים. הפסקת התבוננות קצרה עשויה לעזור להבהיר.",
  },
  suggestions: {
    tired: [
      "עמעמו את האור והפחיתו רעש",
      "נסו שגרת הרגעה (נדנוד, זמזום שקט)",
      "הציעו מרחב שינה שקט",
      "החזיקו בעדינות בתנועה יציבה",
    ],
    overstimulated: [
      "הפחיתו גירוי חזותי וקולי",
      "עברו לחדר שקט יותר",
      "הציעו מגע עור-בעור",
      "האטו את הקצב והקול שלכם",
    ],
    hungry: [
      "הציעו האכלה כשאתם מוכנים",
      "שימו לב לאיתותים מוקדמים כדי למנוע רעב מוגבר",
      "נסו סביבה רגועה להאכלה",
    ],
    discomfort: [
      "בדקו טמפרטורה ובגדים",
      "בדקו חיתול",
      "נסו עיסוי בטן עדין",
      "אם אי-הנוחות נמשכת, שקלו פנייה לרופא ילדים",
    ],
    content: [
      "תהנו מהרגע השקט",
      "דיבור רך או קשר עין יכולים להעמיק את הקשר",
    ],
    playful: [
      "השתתפו במשחק עדין ובקשר עין",
      "חקו את הצלילים שלהם",
      "שימו לב לרגע בו הם מסיטים את המבט — סימן ל\u201cמספיק\u201d",
    ],
    other: [
      "עצרו והתבוננו עוד 30–60 שניות",
      "נסו שינוי קטן בסביבה",
    ],
  },
  refine: {
    longWake: (m) => `חלון ערות ארוך (${m} דקות) מחזק את פרשנות העייפות`,
    shortWake: "חלון ערות קצר מחליש את פרשנות העייפות",
    recentFeed: (h) =>
      `האכלה לאחרונה (לפני ${h.toFixed(1)} שעות) מורידה את הסתברות הרעב`,
    longSinceFeed: (h) =>
      `זמן רב מההאכלה האחרונה (${h.toFixed(1)} שעות) מעלה את הסתברות הרעב`,
    busyEnv: "אזכור של סביבה הומה תומך במצב של מוצף/ת",
    teething: "אזכור של בקיעת שיניים תומך באי-נוחות",
    temperature: "הערה הקשורה לטמפרטורה מוסיפה משקל לאי-נוחות",
    aligned: "ההקשר מתיישר עם הפרשנות המקורית, ומעלה את הביטחון הכולל.",
  },
  advice: {
    addProfile: {
      title: "הוסיפו את פרופיל התינוק",
      body: "אפילו שם וגיל עוזרים ל-ComuniCare להתאים את הפרשנות.",
    },
    tryDemo: {
      title: "נסו קודם את הדמו",
      body: "הדרך המהירה ביותר לראות איך ComuniCare קוראת איתותים לא-מילוליים.",
    },
    windDown: {
      title: "שמרו על חלון ההירגעות",
      body: "עייפות חוזרת לעיתים קרובות. הירגעות צפויה של 10 דקות יכולה למנוע עייפות יתר.",
    },
    resets: {
      title: "בנו רגעי איפוס קצרים",
      body: "כשהפעילות גבוהה, הפסקה שקטה של שתי דקות יכולה לאפס את מערכת העצבים של התינוק.",
    },
    catchHunger: {
      title: "תפסו את הרעב מוקדם",
      body: "תנועות שורש ויד-לפה מופיעות לרוב לפני בכי. האכלה אז שקטה יותר לכולם.",
    },
    youKnowBest: {
      title: "אתם מכירים את התינוק שלכם הכי טוב",
      body: "ComuniCare תומכת באינטואיציה שלכם — היא אינה מחליפה אותה.",
    },
  },
  insights: {
    firstTime: {
      title: "תובנות יופיעו לאחר הניתוח הראשון",
      detail: "הריצו דמו מהיר או העלו קליפ כדי להתחיל לבנות דפוסים.",
    },
    tiredEvening: {
      title: "איתותי עייפות מתרכזים בערב",
      detail: "רוב מצבי העייפות מופיעים בין 17:00 ל-21:00. שקלו הירגעות מוקדמת יותר.",
    },
    hungerInterval: (h) => ({
      title: `רעב מופיע כ-${h} שעות לאחר האכלה`,
      detail: "קצב עקבי עוזר לכם לצפות איתותים לפני שהם מסלימים.",
    }),
    confirmed: (n) => ({
      title: `אישרת ${n} פרשנויות`,
      detail: "המשוב שלכם מעדן את ההצעות העתידיות.",
    }),
    forming: {
      title: "הדפוסים עדיין מתגבשים",
      detail: "כמה ניתוחים נוספים יעזרו ל-ComuniCare לראות קצבים יומיים.",
    },
  },
  likelyTemplate: (label) => `ככל הנראה ${label}`,
};

export const mockContent: Record<Language, MockContent> = { en, he };
