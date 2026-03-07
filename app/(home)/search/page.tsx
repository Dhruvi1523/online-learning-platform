import CourseCard from "@/components/courses/CourseCard";
import { db } from "@/models";
import { Op, where, col } from "sequelize";

const SearchPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) => {
  const params = await searchParams;
  const queryText = (params.query || "").trim();

  const whereClause: any = {
    isPublished: true,
  };

  if (queryText) {
    whereClause[Op.or] = [
      { title: { [Op.like]: `%${queryText}%` } },
      where(col("category.name"), { [Op.like]: `%${queryText}%` }),
      where(col("subCategory.name"), { [Op.like]: `%${queryText}%` }),
    ];
  }

  const courses = await db.course.findAll({
    where: whereClause,
    include: [
      { association: "category", required: false },
      { association: "subCategory", required: false },
      { association: "level", required: false },
      {
        association: "sections",
        where: { isPublished: true },
        required: false,
      },
    ],
    order: [["createdAt", "DESC"]],
    distinct: true,
    subQuery: false,
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