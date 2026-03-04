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
      include: [
        {
          association: "sections",
          include: [{ association: "muxData" }],
        },
      ],
    });

    if (!course) {
      return new Response("Course not found", { status: 404 });
    }

    const isPublishedSections = course.sections.some(
      (section: typeof course.sections[0]) => section.isPublished
    );

    if (
      !course.title ||
      !course.description ||
      !course.categoryId ||
      !course.subCategoryId ||
      !course.levelId ||
      !course.imageUrl ||
      !course.price ||
      !isPublishedSections
    ) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const pusblishedCourse = await db.course.update(
      { isPublished: true },
      { where: { id: courseId, instructorId: userId } }
    );

    return NextResponse.json(pusblishedCourse, { status: 200 });
  } catch (err) {
    console.log("[courseId_publish_POST]", err);
    return new Response("Internal Server Error", { status: 500 });
  }
};
