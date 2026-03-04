import { sequelize, Category, SubCategory, Level } from "../models/index.cjs";

async function main() {
  try {
    const categories = [
      {
        name: "IT & Software",
        subCategories: [
          { name: "Web Development" },
          { name: "Data Science" },
          { name: "Cybersecurity" },
          { name: "Others" },
        ],
      },
      {
        name: "Business",
        subCategories: [
          { name: "E-Commerce" },
          { name: "Marketing" },
          { name: "Finance" },
          { name: "Others" },
        ],
      },
      {
        name: "Design",
        subCategories: [
          { name: "Graphic Design" },
          { name: "3D & Animation" },
          { name: "Interior Design" },
          { name: "Others" },
        ],
      },
      {
        name: "Health",
        subCategories: [
          { name: "Fitness" },
          { name: "Yoga" },
          { name: "Nutrition" },
          { name: "Others" },
        ],
      },
    ];

    // Sequentially create each category with its subcategories
    for (const categoryData of categories) {
      const category = await Category.create({
        name: categoryData.name,
      });

      for (const subCategoryData of categoryData.subCategories) {
        // category may be a Sequelize instance, so we cast to any to access id
        const categoryId = (category as any).id;
        await SubCategory.create({
          name: subCategoryData.name,
          categoryId,
        });
      }
    }

    // Create levels
    await Level.bulkCreate([
      { name: "Beginner" },
      { name: "Intermediate" },
      { name: "Expert" },
      { name: "All levels" },
    ]);

    console.log("Seeding successfully");
  } catch (error) {
    console.log("Seeding failed", error);
  } finally {
    await sequelize.close();
  }
}

main();
