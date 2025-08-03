// src\services\aiService.ts
import { ChatOpenAI } from "@langchain/openai";

const model = new ChatOpenAI({
  modelName: "gpt-4o",
  temperature: 0.7,
  streaming: false,
});

export async function createOpenAIReply(message: string): Promise<string> {
  try {
  //  console.log("🟡 [AI Input]", message); // log what you received

    const res = await model.invoke(message);

    const reply = typeof res === "string" ? res : res?.content?.toString();

 //   console.log("🟢 [AI Reply]", reply); // log what you got back

    return reply || "🤖 Sorry, I didn't understand that.";
  } catch (err) {
    console.error("❌ OpenAI error:", err);
    return "🤖 I'm having trouble thinking right now.";
  }
}
