// The FAQ page's topics, in order, with the questions each one shows (keys
// of faqPage.items in lib/i18n/faq.ts). Shared by the page itself and its
// schema.org FAQPage markup (lib/structured-data.ts), so the markup always
// lists exactly the questions the page shows - Google requires that.

export type FaqTopicKey = "location" | "international" | "treatment" | "costs";

export type FaqTopicDefinition = {
  key: FaqTopicKey;
  // Anchor of the topic's section - the same in every language, so a link
  // like /hu/kerdesek#megkozelites can point at a topic.
  anchor: string;
  questions: readonly string[];
};

// Getting here comes first: it's what most visitors from the area (and from
// across the Austrian border) want to know.
export const FAQ_TOPICS: readonly FaqTopicDefinition[] = [
  { key: "location", anchor: "megkozelites", questions: ["q16", "q17", "q18"] },
  { key: "international", anchor: "kulfoldi-pacienseknek", questions: ["q1", "q15", "q9", "q7"] },
  { key: "treatment", anchor: "kezeles", questions: ["q3", "q13", "q14", "q10", "q8"] },
  { key: "costs", anchor: "koltsegek", questions: ["q2", "q4", "q5", "q6"] },
];

export const FAQ_QUESTIONS: readonly string[] = FAQ_TOPICS.flatMap((topic) => topic.questions);
