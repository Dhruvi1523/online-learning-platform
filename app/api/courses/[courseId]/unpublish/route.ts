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
      return new Response("Unauthorized", { status: 401 });
    }

    const course = await db.course.findOne({
      where: { id: courseId, instructorId: userId },
    });

    if (!course) {
      return new Response("Course not found", { status: 404 });
    }

    const unpusblishedCourse = await db.course.update(
      { isPublished: false },
      { where: { id: courseId, instructorId: userId } }
    );

    return NextResponse.json(unpusblishedCourse, { status: 200 });
  } catch (err) {
    console.log("[courseId_unpublish_POST]", err);
    return new Response("Internal Server Error", { status: 500 });
  }
};