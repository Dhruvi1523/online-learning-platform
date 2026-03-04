import { db } from "@/models";
import { razorpay, verifySignature } from "@/lib/razorpay";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export const POST = async (req: NextRequest) => {
  const rawBody = await req.text();
  const headerList = await headers();
  const signature = headerList.get("x-razorpay-signature");

  if (!signature) {
    return new NextResponse("Missing Razorpay signature", { status: 400 });
  }

  try {
    // Verify the webhook signature
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
      .update(rawBody)
      .digest("hex");

    if (signature !== expectedSignature) {
      return new NextResponse("Invalid signature", { status: 400 });
    }

    const event = JSON.parse(rawBody);

    // Handle payment.authorized event (successful payment)
    if (event.event === "payment.authorized" || event.event === "payment.captured") {
      const payment = event.payload.payment.entity;
      const orderId = payment.order_id;

      // Get the order details to retrieve metadata
      const order = await razorpay.orders.fetch(orderId);
      
      const customerId = order.notes?.customerId;
      const courseId = order.notes?.courseId;

      if (!customerId || !courseId) {
        return new NextResponse("Missing metadata in order", { status: 400 });
      }

      // Check if purchase already exists
      const existingPurchase = await db.purchase.findOne({
        where: { customerId, courseId },
      });

      if (!existingPurchase) {
        // Create purchase record
        await db.purchase.create({
          id: crypto.randomUUID(),
          customerId,
          courseId,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    }

    return new NextResponse("Webhook received", { status: 200 });
  } catch (err: any) {
    console.error("Webhook error:", err);
    return new NextResponse(`Webhook error: ${err.message}`, { status: 400 });
  }
};