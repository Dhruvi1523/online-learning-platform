import  db  from "@/models"
import { Course } from "@/lib/types"

const getCoursesByCategory = async (categoryId: string | null): Promise<Course[]> => {
  const whereClause: any = {
    ...(categoryId ? { categoryId, isPublished: true } : { isPublished: true }),
  }
  const courses = await db.course.findAll({
    where: whereClause,
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
  })

  // cast the Sequelize model array to our Course type
  return courses as unknown as Course[];
}

export default getCoursesByCategory