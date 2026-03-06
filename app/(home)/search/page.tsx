import CourseCard from "@/components/courses/CourseCard";
import { db } from "@/models";
import { Op, WhereOptions } from "sequelize";

const SearchPage = async ({
  searchParams,
}: {
  searchParams: { query?: string };
}) => {
  const queryText = (searchParams.query || "").trim();

  const whereClause: WhereOptions = {
    isPublished: true,
  };

  if (queryText) {
    whereClause[Op.or] = [
      { title: { [Op.like]: `%${queryText}%` } },
      { "$category.name$": { [Op.like]: `%${queryText}%` } },
      { "$subCategory.name$": { [Op.like]: `%${queryText}%` } },
    ];
  }

  const courses = await db.course.findAll({
    where: whereClause,
    include: [
      { association: "category" },
      { association: "subCategory" },
      { association: "level" },
      {
        association: "sections",
        where: { isPublished: true },
        required: false,
      },
    ],
    order: [["createdAt", "DESC"]],
  });

  return (
    <div className="px-4 py-6 md:px-10 xl:px-16">
      <p className="mb-10 text-lg font-semibold md:text-2xl">
        Recommended courses for {queryText || "all courses"}
      </p>

      <div className="flex flex-wrap gap-4">
        {courses.map((course: typeof courses[number]) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
};

export default SearchPage;