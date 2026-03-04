import CourseCard from "@/components/courses/CourseCard"
import { db } from "@/models"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

const LearningPage = async () => {
  const { userId } = auth()

  if (!userId) {
    return redirect('/sign-in')
  }

  const purchasedCourses = await db.purchase.findAll({
    where: {
      customerId: userId,
    },
    include: [
      {
        association: "course",
        include: [
          { association: "category" },
          { association: "subCategory" },
          {
            association: "sections",
            where: { isPublished: true },
            required: false,
          },
        ],
      },
    ],
  })

  return (
    <div className="px-4 py-6 md:mt-5 md:px-10 xl:px-16">
      <h1 className="text-2xl font-bold">
        Your courses
      </h1>
      <div className="flex flex-wrap gap-7 mt-7">
        {purchasedCourses.map((purchase: typeof purchasedCourses[0]) => (
          <CourseCard key={purchase.course.id} course={purchase.course} />
        ))}
      </div>
    </div>
  )
}

export default LearningPage