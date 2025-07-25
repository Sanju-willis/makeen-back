// src/tools/orderStatusTool.ts
import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";

/**
 * Accepts context from memory (e.g., orderId injected via updateMemoryContext)
 */
export const orderStatusTool = (context: Record<string, any>) =>
  new DynamicStructuredTool({
    name: "orderStatusTool",
    description: "Check order status by order ID.",
    schema: z.object({
      orderId: z.string().optional(),
    }),
    func: async ({ orderId }) => {
      const id = orderId || context?.orderId;

      if (!id) return "❌ Order ID is missing.";
      return `📦 Order ${id} is currently being processed.`;
    },
  });
