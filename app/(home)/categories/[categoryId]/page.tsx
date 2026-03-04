import getCoursesByCategory from "@/app/actions/getCourses";
import getCategories from "@/app/actions/getCategories";
import CourseCard from "@/components/courses/CourseCard";
import Categories from "@/components/custom/Categories";

const CoursesByCategory = async ({
  params,
}: {
  params: Promise<{ categoryId: string }>;
}) => {
  const { categoryId } = await params;
  const categories = await getCategories();

  const courses = await getCoursesByCategory(categoryId);

  return (
    <div className="md:mt-5 md:px-10 xl:px-16 pb-16">
      <Categories categories={categories} selectedCategory={categoryId} />
      <div className="flex flex-wrap gap-7 justify-center">
        {courses.map((course: typeof courses[0]) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
};

export default CoursesByCategory;
