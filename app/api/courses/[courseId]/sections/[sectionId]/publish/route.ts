import { db } from "@/models";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (
  req: NextRequest,
  { params }: { params: { courseId: string; sectionId: string } }
) => {
  try {
    const { userId } = await auth();
    const { courseId, sectionId } = await params; // params is a plain object, no await

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!courseId || !sectionId) {
      return new NextResponse("Missing params", { status: 400 });
    }

    const course = await db.course.findOne({
      where: {
        id: courseId,
        instructorId: userId,
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
      raw: true,
    });

    const muxData = await db.muxData.findOne({
      where: {
        sectionId,
      },
      raw: true,
    });

    if (!section || !muxData || !section.title || !section.description || !section.videoUrl) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    await db.section.update(
      { isPublished: true },
      { where: { id: sectionId, courseId } }
    );

    // fetch updated section
    const publishedSection = await db.section.findOne({
      where: { id: sectionId, courseId },
      raw: true,
    });

    return NextResponse.json(publishedSection, { status: 200 });
  } catch (err) {
    console.log("[section_publish_POST]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};