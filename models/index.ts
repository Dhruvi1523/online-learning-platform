import { sequelize } from "@/lib/sequelize";

import { Category } from "./category";
import { SubCategory } from "./subcategory";
import { Level } from "./level";
import { Course } from "./course";
import { Section } from "./section";
import { MuxData } from "./muxData";
import { Resource } from "./resource";
import { Progress } from "./progress";
import { Purchase } from "./purchase";

// ---- Associations ----
let associationsInitialized = false;

function initAssociations() {
  if (associationsInitialized) {
    return;
  }
  associationsInitialized = true;

  // Category 1--* SubCategory
  Category.hasMany(SubCategory, { foreignKey: "categoryId", as: "subCategories" });
  SubCategory.belongsTo(Category, { foreignKey: "categoryId", as: "category" });

  // Category 1--* Course
  Category.hasMany(Course, { foreignKey: "categoryId", as: "courses" });
  Course.belongsTo(Category, { foreignKey: "categoryId", as: "category" });

  // SubCategory 1--* Course
  SubCategory.hasMany(Course, { foreignKey: "subCategoryId", as: "courses" });
  Course.belongsTo(SubCategory, { foreignKey: "subCategoryId", as: "subCategory" });

  // Level 1--* Course
  Level.hasMany(Course, { foreignKey: "levelId", as: "courses" });
  Course.belongsTo(Level, { foreignKey: "levelId", as: "level" });

  // Course 1--* Section
  Course.hasMany(Section, { foreignKey: "courseId", as: "sections", onDelete: "CASCADE", hooks: true });
  Section.belongsTo(Course, { foreignKey: "courseId", as: "course" });

  // Section 1--1 MuxData
  Section.hasOne(MuxData, { foreignKey: "sectionId", as: "muxData", onDelete: "CASCADE", hooks: true });
  MuxData.belongsTo(Section, { foreignKey: "sectionId", as: "section" });

  // Section 1--* Resource
  Section.hasMany(Resource, { foreignKey: "sectionId", as: "resources", onDelete: "CASCADE", hooks: true });
  Resource.belongsTo(Section, { foreignKey: "sectionId", as: "section" });

  // Section 1--* Progress
  Section.hasMany(Progress, { foreignKey: "sectionId", as: "progress", onDelete: "CASCADE", hooks: true });
  Progress.belongsTo(Section, { foreignKey: "sectionId", as: "section" });

  // Course 1--* Purchase
  Course.hasMany(Purchase, { foreignKey: "courseId", as: "purchases", onDelete: "CASCADE", hooks: true });
  Purchase.belongsTo(Course, { foreignKey: "courseId", as: "course" });
}

initAssociations();

export {
  sequelize,
  Category,
  SubCategory,
  Level,
  Course,
  Section,
  MuxData,
  Resource,
  Progress,
  Purchase,
};

export const db = {
  sequelize,
  Category,
  SubCategory,
  Level,
  Course,
  Section,
  MuxData,
  Resource,
  Progress,
  Purchase,
    category : Category ,
    subCategory : SubCategory,
    level : Level,
    course : Course,
    section : Section,
    muxData : MuxData,
    resource : Resource,
    progress : Progress,
    purchase : Purchase
};

export default db;
