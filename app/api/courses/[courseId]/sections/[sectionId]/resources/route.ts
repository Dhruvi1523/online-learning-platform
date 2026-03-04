import { db } from "@/models";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string; sectionId: string }> }
) => {
  try {
    const { userId } = await auth();
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

    const section = await db.section.findOne({
      where: {
        id: sectionId,
        courseId,
      },
    });

    if (!section) {
      return new NextResponse("Section Not Found", { status: 404 });
    }

    const { name, fileUrl } = await req.json();

    const resource = await db.resource.create({
        name,
        fileUrl,
        sectionId,
    });

    return NextResponse.json(resource, { status: 200 });
  } catch (err) {
    console.log("[resources_POST", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
