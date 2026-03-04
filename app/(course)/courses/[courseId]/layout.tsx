import CourseSideBar from "@/components/layout/CourseSideBar";
import Topbar from "@/components/layout/Topbar";
import { Course, Section } from "@/lib/types";
import { db } from "@/models";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const toPlain = <T,>(value: unknown): T => {
  if (value && typeof value === "object" && "toJSON" in (value as Record<string, unknown>)) {
    const modelLike = value as { toJSON: () => T };
    return modelLike.toJSON();
  }
  return value as T;
};

const CourseDetailsLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ courseId: string }>;
}) => {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/sign-in");
  }

  const { courseId } = await params;

  const course = await db.course.findOne({
    where: {
      id: courseId,
    },
    include: [
      {
        association: "sections",
        where: {
          isPublished: true,
        },
        order: [["position", "ASC"]],
        required: false,
      },
    ],
  });

  if (!course) {
    return redirect("/");
  }

  const plainCourse = toPlain<Course & { sections: Section[] }>(course);

  return (
    <div className="h-full flex flex-col">
      <Topbar />
      <div className="flex-1 flex">
        <CourseSideBar course={plainCourse} studentId={userId} />
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
};

export default CourseDetailsLayout;
