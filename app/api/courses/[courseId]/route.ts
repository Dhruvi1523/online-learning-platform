import { db } from "@/models";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import Mux from "@mux/mux-node";

let video: any = null;

if (process.env.MUX_TOKEN_ID && process.env.MUX_TOKEN_SECRET) {
  video = new Mux({
    tokenId: process.env.MUX_TOKEN_ID,
    tokenSecret: process.env.MUX_TOKEN_SECRET,
  }).video;
}

export const PATCH = async (
  req: NextRequest,
  { params }: { params: { courseId: string } }
) => {
  try {
    const { userId } = await auth();
    const { courseId } = await params;
    const values = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!courseId) {
      return new NextResponse("Missing courseId", { status: 400 });
    }

    // ✅ Sequelize update: (values, options)
    const [updatedCount] = await db.course.update(values, {
      where: { id: courseId, instructorId: userId },
    });

    if (!updatedCount) {
      return new NextResponse("Course not found", { status: 404 });
    }

    // Fetch updated row and return plain JSON
    const updatedCourse = await db.course.findOne({
      where: { id: courseId, instructorId: userId },
    });

    return NextResponse.json(updatedCourse?.get({ plain: true }), { status: 200 });
  } catch (err) {
    console.error("[courseId_PATCH]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const DELETE = async (
  _req: NextRequest,
  { params }: { params: { courseId: string } }
) => {
  try {
    const { userId } = await auth();
    const { courseId } = await params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!courseId) {
      return new NextResponse("Missing courseId", { status: 400 });
    }

    const course = await db.course.findOne({
      where: { id: courseId, instructorId: userId },
      include: [
        {
          model: db.Section,
          as: "sections",
          include: [{ model: db.MuxData, as: "muxData" }],
        },
      ],
    });

    if (!course) {
      return new NextResponse("Course not found", { status: 404 });
    }

    // Delete Mux assets if configured
    if (video) {
      const sections = (course as any).sections ?? [];
      for (const section of sections) {
        const assetId = section?.muxData?.assetId;
        if (assetId) {
          await video.assets.delete(assetId);
        }
      }
    }

    await db.course.destroy({
      where: { id: courseId, instructorId: userId },
    });

    return new NextResponse("Course Deleted", { status: 200 });
  } catch (err) {
    console.error("[courseId_DELETE]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};