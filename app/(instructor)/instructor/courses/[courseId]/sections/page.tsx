import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import CreateSectionForm from "@/components/sections/CreateSectionForm";
import { db } from "@/models";

const CourseCurriculumPage = async ({
  params,
}: {
  params: { courseId: string };
}) => {
  const { userId } = await auth();
  const { courseId } = await params;

  if (!userId) {
    redirect("/sign-in");
  }

  const courseInstance = await db.course.findOne({
    where: {
      id: courseId,
      instructorId: userId,
    },
    include: [{ model: db.Section, as: "sections" }],
    order: [[{ model: db.Section, as: "sections" }, "position", "ASC"]],
  });

  if (!courseInstance) {
    redirect("/instructor/courses");
  }

  // ✅ Sequelize instance -> plain object (safe for client components)
  const course = courseInstance.get({ plain: true });

  return <CreateSectionForm course={course} />;
};

export default CourseCurriculumPage;