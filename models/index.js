'use strict';

const { sequelize } = require('../lib/sequelize');

// Import model classes
const { Category } = require('./category');
const { SubCategory } = require('./subcategory');
const { Level } = require('./level');
const { Course } = require('./course');
const { Section } = require('./section');
const { MuxData } = require('./muxData');
const { Resource } = require('./resource');
const { Progress } = require('./progress');
const { Purchase } = require('./purchase');

// ---- Associations ----

// Category 1--* SubCategory
Category.hasMany(SubCategory, { foreignKey: 'categoryId', as: 'subCategories' });
SubCategory.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

// Category 1--* Course
Category.hasMany(Course, { foreignKey: 'categoryId', as: 'courses' });
Course.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

// SubCategory 1--* Course
SubCategory.hasMany(Course, { foreignKey: 'subCategoryId', as: 'courses' });
Course.belongsTo(SubCategory, { foreignKey: 'subCategoryId', as: 'subCategory' });

// Level 1--* Course (optional)
Level.hasMany(Course, { foreignKey: 'levelId', as: 'courses' });
Course.belongsTo(Level, { foreignKey: 'levelId', as: 'level' });

// Course 1--* Section (CASCADE)
Course.hasMany(Section, {
  foreignKey: 'courseId',
  as: 'sections',
  onDelete: 'CASCADE',
  hooks: true,
});
Section.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });

// Section 1--1 MuxData (CASCADE)
Section.hasOne(MuxData, {
  foreignKey: 'sectionId',
  as: 'muxData',
  onDelete: 'CASCADE',
  hooks: true,
});
MuxData.belongsTo(Section, { foreignKey: 'sectionId', as: 'section' });

// Section 1--* Resource (CASCADE)
Section.hasMany(Resource, {
  foreignKey: 'sectionId',
  as: 'resources',
  onDelete: 'CASCADE',
  hooks: true,
});
Resource.belongsTo(Section, { foreignKey: 'sectionId', as: 'section' });

// Section 1--* Progress (CASCADE)
Section.hasMany(Progress, {
  foreignKey: 'sectionId',
  as: 'progress',
  onDelete: 'CASCADE',
  hooks: true,
});
Progress.belongsTo(Section, { foreignKey: 'sectionId', as: 'section' });

// Course 1--* Purchase (CASCADE)
Course.hasMany(Purchase, {
  foreignKey: 'courseId',
  as: 'purchases',
  onDelete: 'CASCADE',
  hooks: true,
});
Purchase.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });

// Export models
const db = {
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

module.exports = db;
