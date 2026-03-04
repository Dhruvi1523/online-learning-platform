import { db } from "@/models";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string; sectionId: string }> }
) => {
  try {
    const { userId } = await auth();
    const { isCompleted } = await req.json();
    const { courseId, sectionId } = await params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const course = await db.course.findOne({
      where: {
        id: courseId,
      },
    });

    if (!course) {
      return new NextResponse("Course Not Found", { status: 404 });
    }

    const section = await db.section.findOne({
      where: {
        id: sectionId,
        courseId,
      },
    });

    if (!section) {
      return new NextResponse("Section Not Found", { status: 404 });
    }

    const [progress] = await db.progress.upsert({
      studentId: userId,
      sectionId,
      isCompleted,
    });

    return NextResponse.json(progress, { status: 200 });
  } catch (err) {
    console.log("[sectionId_progress_POST]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
