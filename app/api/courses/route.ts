import { db } from "@/models";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const { userId } =await auth(); 


    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { title, categoryId, subCategoryId } = body ?? {};

    if (!title || !categoryId || !subCategoryId) {
      return new NextResponse("Missing fields", { status: 400 });
    }

    const newCourse = await db.course.create({
      id: crypto.randomUUID(),          // your schema expects uuid PK
      title,
      categoryId,
      subCategoryId,
      instructorId: userId,
      isPublished: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // ✅ return plain object
    return NextResponse.json(newCourse.get({ plain: true }), { status: 200 });
  } catch (err) {
    console.log("[courses_POST]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};