// src\agents\executorRouter.ts
import { getBookInquiryAgent } from "./bookInquiryAgent";
import { getOrderStatusAgent } from "./orderStatusAgent";
import { getComplaintAgent } from "./complaintAgent";
import { getGeneralHelpAgent } from "./generalHelpAgent";

export async function getExecutorForIntent(
  intent: string,
  sessionId: string,
 
) {
  switch (intent) {
    case "book_inquiry":
      console.log("📚 Routing to Book Inquiry Agent");
      return await getBookInquiryAgent(sessionId);

    case "order_status":
      console.log("📦 Routing to Order Status Agent");
      return await getOrderStatusAgent(sessionId);

    case "complaint":
      console.log("🛠️ Routing to Complaint Agent");
      return await getComplaintAgent(sessionId);

    case "general_help":
      console.log("🧠 Routing to General Help Agent");
      return await getGeneralHelpAgent(sessionId);

    case "unknown":
    default:
      console.log("❓ Routing to Default (General Help) Agent");
      return await getGeneralHelpAgent(sessionId);
  }
}
