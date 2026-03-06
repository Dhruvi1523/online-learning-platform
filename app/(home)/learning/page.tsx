import CourseCard from "@/components/courses/CourseCard";
import { db } from "@/models";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

type PurchasedCourse = Awaited<ReturnType<typeof db.purchase.findAll>>[number] & {
  course: {
    id: string;
    [key: string]: unknown;
  };
};

const LearningPage = async () => {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const purchasedCourses = (await db.purchase.findAll({
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
  })) as PurchasedCourse[];

  return (
    <div className="px-4 py-6 md:mt-5 md:px-10 xl:px-16">
      <h1 className="text-2xl font-bold">Your courses</h1>

      <div className="mt-7 flex flex-wrap gap-7">
        {purchasedCourses.map((purchase) => (
          <CourseCard key={purchase.course.id} course={purchase.course} />
        ))}
      </div>
    </div>
  );
};

export default LearningPage;