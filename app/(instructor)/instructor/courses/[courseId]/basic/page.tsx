import EditCourseForm from "@/components/courses/EditCourseForm";
import AlertBanner from "@/components/custom/AlertBanner";
import { db } from "@/models";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const CourseBasics = async ({ params }: { params: { courseId: string } }) => {
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
  });

  if (!courseInstance) {
    redirect("/instructor/courses");
  }

  const course = courseInstance.get({ plain: true });

  const categoriesInstances = await db.category.findAll({
    order: [["name", "ASC"]],
    include: [{ model: db.SubCategory, as: "subCategories" }],
  });

  const categories = categoriesInstances.map((c: any) => c.get({ plain: true }));

  const levelsInstances = await db.level.findAll();
  const levels = levelsInstances.map((l: any) => l.get({ plain: true }));

  const requiredFields = [
    course.title,
    course.description,
    course.categoryId,
    course.subCategoryId,
    course.levelId,
    course.imageUrl,
    course.price,
    course.sections?.some((section: any) => section.isPublished),
  ];

  const requiredFieldsCount = requiredFields.length;
  const missingFieldsCount = requiredFields.filter((f: any) => !Boolean(f)).length;
  const isCompleted = requiredFields.every(Boolean);

  return (
    <div className="px-10">
      <AlertBanner
        isCompleted={isCompleted}
        missingFieldsCount={missingFieldsCount}
        requiredFieldsCount={requiredFieldsCount}
      />

      <EditCourseForm
        course={course}
        categories={categories.map((category: any) => ({
          label: category.name,
          value: category.id,
          subCategories: (category.subCategories ?? []).map((sub: any) => ({
            label: sub.name,
            value: sub.id,
          })),
        }))}
        levels={levels.map((level: any) => ({
          label: level.name,
          value: level.id,
        }))}
        isCompleted={isCompleted}
      />
    </div>
  );
};

export default CourseBasics;