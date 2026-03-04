import getCategories from "@/app/actions/getCategories";
import getCoursesByCategory from "../actions/getCourses";
import Categories from "@/components/custom/Categories";
import CourseCard from "@/components/courses/CourseCard";

export default async function Home() {
  const categories = await getCategories();

  const courses = await getCoursesByCategory(null);
  return (
    <div className="md:mt-5 md:px-10 xl:px-16 pb-16">
      <Categories categories={categories} selectedCategory={null} />
      <div className="flex flex-wrap gap-7 justify-center">
        {courses.map((course: typeof courses[0]) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
      
    </div>
  );
}
