import { db } from "@/models";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string; sectionId: string }> }
) {
  try {
    const { userId } = await auth();
    const { courseId, sectionId } = await params;

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

    if (
      !section ||
      !muxData ||
      !section.title ||
      !section.description ||
      !section.videoUrl
    ) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    await db.section.update(
      { isPublished: true },
      { where: { id: sectionId, courseId } }
    );

    const publishedSection = await db.section.findOne({
      where: { id: sectionId, courseId },
      raw: true,
    });

    return NextResponse.json(publishedSection, { status: 200 });
  } catch (err) {
    console.error("[section_publish_POST]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}