import { clerkClient } from "@clerk/nextjs/server";
import Image from "next/image";
import { redirect } from "next/navigation";

import { db } from "@/models";
import ReadText from "@/components/custom/ReadText";
import SectionMenu from "@/components/layout/SectionMenu";
import { Course, Section } from "@/lib/types";
import { formatPrice } from "@/lib/formatPrice";

const toPlain = <T,>(value: unknown): T => {
  if (value && typeof value === "object" && "toJSON" in (value as Record<string, unknown>)) {
    const modelLike = value as { toJSON: () => T };
    return modelLike.toJSON();
  }
  return value as T;
};

const CourseOverview = async ({ params }: { params: Promise<{ courseId: string }> }) => {
  const { courseId } = await params;
  const course = await db.course.findOne({
    where: {
      id: courseId,
      isPublished: true,
    },
    include: [
      {
        association: "sections",
        where: { isPublished: true },
        required: false,
      },
    ],
  });

  if (!course) {
    return redirect("/");
  }

  const plainCourse = toPlain<Course & { sections: Section[] }>(course);
  const client = await clerkClient();
  const instructor = await client.users.getUser(plainCourse.instructorId);

  let levelName: string | undefined;

  if (plainCourse.levelId) {
    const level = await db.level.findOne({
      where: {
        id: plainCourse.levelId,
      },
    });
    levelName = level ? toPlain<{ name: string }>(level).name : undefined;
  }

  return (
    <div className="px-6 py-4 flex flex-col gap-5 text-sm">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">{plainCourse.title}</h1>
        <SectionMenu course={plainCourse} />
      </div>

      <p className="font-medium">{plainCourse.subtitle}</p>

      <div className="flex gap-2 items-center">
        <Image
          src={
            instructor.imageUrl
              ? instructor.imageUrl
              : "/avatar_placeholder.jpg"
          }
          alt={instructor.fullName ? instructor.fullName : "Instructor photo"}
          width={30}
          height={30}
          className="rounded-full"
        />
        <p className="font-bold">Instructor:</p>
        <p>{instructor.fullName}</p>
      </div>

      <div className="flex gap-2">
        <p className="font-bold">Price:</p>
        <p>{plainCourse.price ? formatPrice(plainCourse.price) : "—"}</p>
      </div>

      <div className="flex gap-2">
        <p className="font-bold">Level:</p>
        <p>{levelName}</p>
      </div>

      <div className="flex flex-col gap-2">
        <p className="font-bold">Description:</p>
        <ReadText value={plainCourse.description!} />
      </div>
    </div>
  );
};

export default CourseOverview;
