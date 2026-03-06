import { db } from "@/models";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export const PUT = async (
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) => {
  try {
    const { userId } =await auth();
    const { courseId } = await params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { list } = await req.json();

    const course = await db.course.findOne({
      where: {
        id: courseId,
        instructorId: userId,
      },
    });

    if (!course) {
      return new NextResponse("Course not found", { status: 404 });
    }

    for (let item of list) {
      await db.section.update(
        { position: item.position },
        { where: { id: item.id } }
      );
    }

    return new NextResponse("Reorder sections successfully", { status: 200 });
  } catch (err) {
    console.log("[reorder_PUT]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
