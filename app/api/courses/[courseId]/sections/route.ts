import { db } from "@/models";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) => {
  try {
    const { userId } = await auth();
    const { courseId } = await params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const course = await db.course.findOne({
      where: { id: courseId, instructorId: userId },
    });

    if (!course) {
      return new NextResponse("Course Not Found", { status: 404 });
    }

    const lastSectionInstance = await db.section.findOne({
      where: { courseId },
      order: [["position", "DESC"]],
    });

    const lastSection = lastSectionInstance?.get({ plain: true });

    const newPosition = lastSection ? lastSection.position + 1 : 0;

    const { title } = await req.json();

    const newSection = await db.section.create({
      title,
      courseId,
      position: newPosition,
    });

    return NextResponse.json(newSection, { status: 200 });
  } catch (err) {
    console.log("[sections_POST]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
