// src/agents/tools/orderStatusTool.ts
import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/db"; // adjust this import to your actual db path
import { orders } from "@/db/schema/orders";

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

      const result = await db
        .select()
        .from(orders)
        .where(eq(orders.orderId, id))
        .limit(1);

      const order = result[0];

      if (!order) return `❌ No order found for ID: ${id}`;

      return `📦 Order "${order.orderId}" for "${order.bookTitle}" is currently: ${order.status}`;
    },
  });
