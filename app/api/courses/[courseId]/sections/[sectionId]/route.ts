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

function cleanValues(values: any) {
  // convert "" -> null to avoid "invalid input syntax for type uuid: """
  return Object.fromEntries(
    Object.entries(values ?? {}).map(([k, v]) => [k, v === "" ? null : v])
  );
}

export const POST = async (
  req: NextRequest,
  { params }: { params: { courseId: string; sectionId: string } }
) => {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const { courseId, sectionId } = await params;
    if (!courseId || !sectionId) {
      return new NextResponse("Missing params", { status: 400 });
    }

    const values = cleanValues(await req.json());

    const course = await db.course.findOne({
      where: { id: courseId, instructorId: userId },
    });

    if (!course) return new NextResponse("Course Not Found", { status: 404 });

    // ✅ update section
    const [updatedCount] = await db.section.update(values, {
      where: { id: sectionId, courseId },
    });

    if (!updatedCount) {
      return new NextResponse("Section Not Found", { status: 404 });
    }

    // ✅ handle mux upload if videoUrl is being set/changed
    if (values.videoUrl) {
      if (!video) {
        return new NextResponse("Mux is not configured", { status: 500 });
      }

      const existingMuxData = await db.muxData.findOne({
        where: { sectionId },
      });

      if (existingMuxData) {
        // delete mux asset
        if (existingMuxData.assetId) {
          await video.assets.destroy(existingMuxData.assetId);
        }
        // ✅ Sequelize delete
        await db.muxData.destroy({ where: { id: existingMuxData.id } });
      }

      const asset = await video.assets.create({
        input: values.videoUrl,
        playback_policy: ["public"],
        test: false,
      });

      await db.muxData.create({
        id: crypto.randomUUID(), // if your mux_data id has no default
        assetId: asset.id,
        playbackId: asset.playback_ids?.[0]?.id ?? null,
        sectionId,
      });
    }

    // return updated section (plain)
    const updatedSection = await db.section.findOne({
      where: { id: sectionId, courseId },
      include: [
        { model: db.MuxData, as: "muxData" },
        { model: db.Resource, as: "resources" },
      ],
    });

    return NextResponse.json(updatedSection?.get({ plain: true }), { status: 200 });
  } catch (err) {
    console.log("[sectionId_POST]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const DELETE = async (
  _req: NextRequest,
  { params }: { params: { courseId: string; sectionId: string } }
) => {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const { courseId, sectionId } = params;
    if (!courseId || !sectionId) {
      return new NextResponse("Missing params", { status: 400 });
    }

    const course = await db.course.findOne({
      where: { id: courseId, instructorId: userId },
    });
    if (!course) return new NextResponse("Course Not Found", { status: 404 });

    const section = await db.section.findOne({
      where: { id: sectionId, courseId },
      include: [{ model: db.MuxData, as: "muxData" }],
    });

    if (!section) return new NextResponse("Section Not Found", { status: 404 });

    // delete mux asset + mux_data row if exists
    const mux = (section as any).muxData;
    if (mux?.assetId) {
      if (!video) return new NextResponse("Mux is not configured", { status: 500 });
      await video.assets.delete(mux.assetId);
      await db.muxData.destroy({ where: { id: mux.id } });
    }

    await db.section.destroy({
      where: { id: sectionId, courseId },
    });

    // if no published sections remain, unpublish course
    const publishedCount = await db.section.count({
      where: { courseId, isPublished: true },
    });

    if (publishedCount === 0) {
      await db.course.update(
        { isPublished: false },
        { where: { id: courseId } }
      );
    }

    return new NextResponse("Section Deleted", { status: 200 });
  } catch (err) {
    console.log("[sectionId_DELETE]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};