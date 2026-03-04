import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { db } from "@/models";
import { DataTable } from "@/components/custom/DataTable";
import { columns } from "@/components/courses/Columns";
import { Course } from "@/lib/types";

const toPlain = <T,>(value: unknown): T => {
  if (value && typeof value === "object" && "toJSON" in (value as Record<string, unknown>)) {
    const modelLike = value as { toJSON: () => T };
    return modelLike.toJSON();
  }
  return value as T;
};

const CoursesPage = async () => {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/sign-in");
  }

  const courses = await db.course.findAll({
    where: {
      instructorId: userId,
    },
    order: [["createdAt", "DESC"]],
  });
  const plainCourses = courses.map((course) => toPlain<Course>(course));

  return (
    <div className="px-6 py-4">
      <Link href="/instructor/create-course">
        <Button>Create New Course</Button>
      </Link>

      <div className="mt-5">
        <DataTable columns={columns} data={plainCourses} />
      </div>
    </div>
  );
};

export default CoursesPage;
