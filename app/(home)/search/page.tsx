import CourseCard from "@/components/courses/CourseCard";
import { db } from "@/models"
import { Op } from "sequelize";

const SearchPage = async ({ searchParams }: { searchParams: { query: string }}) => {
  const queryText = searchParams.query || ''
  const courses = await db.course.findAll({
    where: {
      isPublished: true,
      [Op.or]: [
        { title: { [Op.iLike]: `%${queryText}%` } },
        { '$category.name$': { [Op.iLike]: `%${queryText}%` } },
        { '$subCategory.name$': { [Op.iLike]: `%${queryText}%` } },
      ],
    },
    include: [
      { association: "category" },
      { association: "subCategory" },
      { association: "level" },
      {
        association: "sections",
        where: {
          isPublished: true,
        },
        required: false,
      },
    ],
    order: [["createdAt", "DESC"]],
  });

  return (
    <div className="px-4 py-6 md:px-10 xl:px-16">
      <p className="text-lg md:text-2xl font-semibold mb-10">Recommended courses for {queryText}</p>
      <div className="flex gap-4 flex-wrap">
        {courses.map((course: typeof courses[0]) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  )
}

export default SearchPage