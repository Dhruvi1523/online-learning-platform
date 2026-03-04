import { db } from "@/models";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string; sectionId: string }> }
) => {
  try {
    const { userId } = auth();
    const { courseId, sectionId } = await params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
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

    const unpublishedSection = await db.section.update(
      { isPublished: false },
      { where: { id: sectionId, courseId } }
    );

    const publishedSectionsInCourse = await db.section.findAll({
      where: {
        courseId,
        isPublished: true,
      },
    });

    if (publishedSectionsInCourse.length === 0) {
      await db.course.update(
        { isPublished: false },
        { where: { id: courseId, instructorId: userId } }
      );
    }

    return NextResponse.json(unpublishedSection, { status: 200 });
  } catch (err) {
    console.log("[sectionId_unpublish_POST]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}