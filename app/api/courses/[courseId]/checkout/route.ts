import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

import { db } from "@/models";
import { razorpay } from "@/lib/razorpay";

export const POST = async (
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) => {
  try {
    const user = await currentUser();

    if (!user || !user.id || !user.emailAddresses?.[0]?.emailAddress) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { courseId } = await params;

    const course = await db.course.findOne({
      where: { id: courseId, isPublished: true },
    });

    if (!course) {
      return new NextResponse("Course Not Found", { status: 404 });
    }

    const purchase = await db.purchase.findOne({
      where: {
        customerId: user.id,
        courseId: course.id,
      },
    });

    if (purchase) {
      return new NextResponse("Course Already Purchased", { status: 400 });
    }
     const shortCourse = String(courseId).replace(/-/g, "").slice(0, 8);
    const shortUser = String(user.id).replace(/[^a-zA-Z0-9]/g, "").slice(0, 10);
    const receipt = `rcp_${shortCourse}_${shortUser}`; // <= 40
    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: Math.round(course.price! * 100), // Amount in paise
      currency: "INR",
      receipt,
      notes: {
        courseId: course.id,
        customerId: user.id,
        courseTitle: course.title,
      },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      courseId: course.id,
      customerId: user.id,
      customerEmail: user.emailAddresses[0].emailAddress,
      customerName: user.firstName && user.lastName 
        ? `${user.firstName} ${user.lastName}`
        : user.emailAddresses[0].emailAddress,
    });
  } catch (err) {
    console.log("[courseId_checkout_POST]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
