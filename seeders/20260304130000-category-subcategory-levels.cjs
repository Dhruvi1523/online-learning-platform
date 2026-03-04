"use strict";

const { randomUUID } = require("crypto");

module.exports = {
  async up(queryInterface) {
    const now = new Date();

    // -------------------
    // Categories
    // -------------------

    const categories = [
      { id: randomUUID(), name: "IT & Software" },
      { id: randomUUID(), name: "Business" },
      { id: randomUUID(), name: "Design" },
      { id: randomUUID(), name: "Health & Fitness" },
    ].map((c) => ({
      ...c,
      createdAt: now,
      updatedAt: now,
    }));

    await queryInterface.bulkInsert("categories", categories);

    const categoryMap = {};
    categories.forEach((c) => {
      categoryMap[c.name] = c.id;
    });

    // -------------------
    // Sub Categories
    // -------------------

    const subCategories = [
      // IT
      { name: "Web Development", category: "IT & Software" },
      { name: "Data Science", category: "IT & Software" },
      { name: "Cyber Security", category: "IT & Software" },
      { name: "Cloud Computing", category: "IT & Software" },

      // Business
      { name: "Entrepreneurship", category: "Business" },
      { name: "Finance", category: "Business" },
      { name: "Digital Marketing", category: "Business" },

      // Design
      { name: "Graphic Design", category: "Design" },
      { name: "UI / UX Design", category: "Design" },
      { name: "3D Animation", category: "Design" },

      // Health
      { name: "Fitness", category: "Health & Fitness" },
      { name: "Yoga", category: "Health & Fitness" },
      { name: "Nutrition", category: "Health & Fitness" },
    ].map((sc) => ({
      id: randomUUID(),
      name: sc.name,
      categoryId: categoryMap[sc.category],
      createdAt: now,
      updatedAt: now,
    }));

    await queryInterface.bulkInsert("sub_categories", subCategories);

    // -------------------
    // Levels
    // -------------------

    const levels = [
      { id: randomUUID(), name: "Beginner" },
      { id: randomUUID(), name: "Intermediate" },
      { id: randomUUID(), name: "Advanced" },
      { id: randomUUID(), name: "All Levels" },
    ].map((l) => ({
      ...l,
      createdAt: now,
      updatedAt: now,
    }));

    await queryInterface.bulkInsert("levels", levels);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("levels", null, {});
    await queryInterface.bulkDelete("sub_categories", null, {});
    await queryInterface.bulkDelete("categories", null, {});
  },
};