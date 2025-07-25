import { queryKnowledgeBase } from "../src/services/rag/queryKB";

(async () => {
  const result = await queryKnowledgeBase("Who is the owner or CEO of the shop?");
  console.log("🤖 Answer:", result.text);

  console.log("\n📚 Sources:");
  result.sourceDocuments.forEach((doc, i) => {
    console.log(`- ${i + 1}:`, doc.pageContent);
  });
})();
