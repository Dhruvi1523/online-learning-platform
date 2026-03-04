import AlertBanner from "@/components/custom/AlertBanner";
import EditSectionForm from "@/components/sections/EditSectionForm";
import { db } from "@/models";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const SectionDetailsPage = async ({
  params,
}: {
  params: { courseId: string; sectionId: string };
}) => {
  const { userId } = await auth();
  const { courseId, sectionId } = await params;

  if (!userId) {
    redirect("/sign-in");
  }

  // guard against undefined/empty route params
  if (!courseId || !sectionId) {
    redirect("/instructor/courses");
  }

  const course = await db.course.findOne({
    where: {
      id: courseId,
      instructorId: userId,
    },
  });

  if (!course) {
    redirect("/instructor/courses");
  }

  const sectionInstance = await db.section.findOne({
    where: {
      id: sectionId,
      courseId,
    },
    include: [
      { model: db.MuxData, as: "muxData" },
      { model: db.Resource, as: "resources" },
    ],
  });

  if (!sectionInstance) {
    redirect(`/instructor/courses/${courseId}/sections`);
  }

  // ✅ Sequelize instance -> plain object (safe for client components)
  const section = sectionInstance.get({ plain: true });

  const requiredFields = [section.title, section.description, section.videoUrl];
  const requiredFieldsCount = requiredFields.length;
  const missingFieldsCount = requiredFields.filter((f: any) => !Boolean(f)).length;
  const isCompleted = requiredFields.every(Boolean);

  return (
    <div className="px-10">
      <AlertBanner
        isCompleted={isCompleted}
        requiredFieldsCount={requiredFieldsCount}
        missingFieldsCount={missingFieldsCount}
      />

      <EditSectionForm section={section} courseId={courseId} isCompleted={isCompleted} />
    </div>
  );
};

export default SectionDetailsPage;