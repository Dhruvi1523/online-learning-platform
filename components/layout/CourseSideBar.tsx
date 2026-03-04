import db from "@/models";
import { Course, Section } from "@/lib/types";
import Link from "next/link";
import { Progress } from "../ui/progress";
  import { Op } from "sequelize";


interface CourseSideBarProps {
  course: Course & { sections: Section[] };
  studentId: string;
}

const CourseSideBar = async ({ course, studentId }: CourseSideBarProps) => {
  const publishedSections = await db.section.findAll({
    where: {
      courseId: course.id,
      isPublished: true,
    },
    order: [["position", "ASC"]],
  });

  // Sequelize returns model instances; cast to our `Section` shape for TS
  const publishedSectionsTyped = publishedSections as unknown as Section[];
  const publishedSectionIds = publishedSectionsTyped.map((section: Section) => section.id);

  const purchase = await db.purchase.findOne({
    where: {
      customerId: studentId,
      courseId: course.id,
    },
  });


const completedSections = await db.progress.findAll({
  where: {
    studentId: studentId,
    sectionId: {
      [Op.in]: publishedSectionIds
    }
  }
});

  const progressPercentage = publishedSectionIds.length > 0 
    ? (completedSections.length / publishedSectionIds.length) * 100 
    : 0;

  return (
    <div className="hidden md:flex flex-col w-64 border-r shadow-md px-3 my-4 text-sm font-medium">
      <h1 className="text-lg font-bold text-center mb-4">{course.title}</h1>
      {purchase && (
        <div>
          <Progress value={progressPercentage} className="h-2" />
          <p className="text-xs">{Math.round(progressPercentage)}% completed</p>
        </div>
      )}
      <Link
        href={`/courses/${course.id}/overview`}
        className={`p-3 rounded-lg hover:bg-[#FFF8EB] mt-4`}
      >
        Overview
      </Link>
      {publishedSectionsTyped.map((section: Section) => (
        <Link
          key={section.id}
          href={`/courses/${course.id}/sections/${section.id}`}
          className="p-3 rounded-lg hover:bg-[#FFF8EB] mt-4"
        >
          {section.title}
        </Link>
      ))}
    </div>
  );
};

export default CourseSideBar;

