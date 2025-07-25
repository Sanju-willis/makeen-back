import { config } from "dotenv";
config(); // ✅ ensures env is loaded in standalone script

import { getVectorStore } from "../src/services/rag/vectorStore";

const content = [
  "The Colombo branch is open Monday to Saturday, 9am to 7pm.",
  "Returns are accepted within 30 days if you have a receipt.",
  "We accept Visa, Mastercard, and Cash on Delivery.",
];

const metadata = [
  { source: "location" },
  { source: "returns" },
  { source: "payments" },
];

const run = async () => {
  const vectorStore = await getVectorStore();
  await vectorStore.addDocuments(
    content.map((text, i) => ({
      pageContent: text,
      metadata: metadata[i],
    }))
  );
  console.log("📚 KB seeded");
};

run();
