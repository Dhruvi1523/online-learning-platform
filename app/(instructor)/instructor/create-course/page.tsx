import CreateCourseForm from "@/components/courses/CreateCourseForm";
import { db } from "@/models";

const CreateCoursePage = async () => {
  const categories = await db.category.findAll({
    order: [["name", "ASC"]],
    include: [{ model: db.SubCategory, as: "subCategories" }],
  });

  // ✅ convert to plain JSON before passing to client component
  const plain = categories.map((c: any) => c.get({ plain: true }));

  return (
    <div>
      <CreateCourseForm
        categories={plain.map((category: any) => ({
          label: category.name,
          value: String(category.id),
          subCategories: (category.subCategories ?? []).map((sub: any) => ({
            label: sub.name,
            value: String(sub.id),
          })),
        }))}
      />
    </div>
  );
};

export default CreateCoursePage;