import db from "@/models";
import { Category } from "@/lib/types";

// server helper for fetching categories in alphabetical order
const getCategories = async (): Promise<Category[]> => {
  const categories = await db.category.findAll({
    order: [["name", "ASC"]],
    raw: true
  });

  // Sequelize returns model instances; cast to our Category type shape
  return categories as unknown as Category[];
};

export default getCategories;
