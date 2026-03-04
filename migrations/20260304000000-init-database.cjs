'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    const createdAt = {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    };

    const updatedAt = {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"),
    };

    try {

      // 1️⃣ Categories
      await queryInterface.createTable("categories", {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
        },
        createdAt,
        updatedAt,
      }, { transaction });


      // 2️⃣ Levels
      await queryInterface.createTable("levels", {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
        },
        createdAt,
        updatedAt,
      }, { transaction });


      // 3️⃣ SubCategories
      await queryInterface.createTable("sub_categories", {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        categoryId: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: "categories",
            key: "id",
          },
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
        },
        createdAt,
        updatedAt,
      }, { transaction });


      // 4️⃣ Courses
      await queryInterface.createTable("courses", {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        instructorId: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        title: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        subtitle: Sequelize.TEXT,
        description: Sequelize.TEXT,
        imageUrl: Sequelize.TEXT,
        price: Sequelize.FLOAT,
        isPublished: {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
        },

        categoryId: {
          type: Sequelize.UUID,
          allowNull: false,
          references: { model: "categories", key: "id" },
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
        },

        subCategoryId: {
          type: Sequelize.UUID,
          allowNull: false,
          references: { model: "sub_categories", key: "id" },
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
        },

        levelId: {
          type: Sequelize.UUID,
          allowNull: true,
          references: { model: "levels", key: "id" },
          onDelete: "SET NULL",
          onUpdate: "CASCADE",
        },

        createdAt,
        updatedAt,
      }, { transaction });


      // 5️⃣ Sections
      await queryInterface.createTable("sections", {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        title: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        description: Sequelize.TEXT,
        videoUrl: Sequelize.TEXT,
        position: Sequelize.INTEGER,
        isPublished: {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
        },
        isFree: {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
        },

        courseId: {
          type: Sequelize.UUID,
          allowNull: false,
          references: { model: "courses", key: "id" },
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
        },

        createdAt,
        updatedAt,
      }, { transaction });


      // 6️⃣ MuxData
      await queryInterface.createTable("mux_data", {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        assetId: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        playbackId: Sequelize.STRING,

        sectionId: {
          type: Sequelize.UUID,
          unique: true,
          references: { model: "sections", key: "id" },
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
        },

        createdAt,
        updatedAt,
      }, { transaction });


      // 7️⃣ Resources
      await queryInterface.createTable("resources", {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        name: Sequelize.STRING,
        fileUrl: Sequelize.STRING,

        sectionId: {
          type: Sequelize.UUID,
          references: { model: "sections", key: "id" },
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
        },

        createdAt,
        updatedAt,
      }, { transaction });


      // 8️⃣ Progress
      await queryInterface.createTable("progress", {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        studentId: Sequelize.STRING,

        sectionId: {
          type: Sequelize.UUID,
          references: { model: "sections", key: "id" },
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
        },

        isCompleted: {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
        },

        createdAt,
        updatedAt,
      }, { transaction });


      // 9️⃣ Purchases
      await queryInterface.createTable("purchases", {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
          allowNull: false,
        },

        customerId: Sequelize.STRING,

        courseId: {
          type: Sequelize.UUID,
          references: { model: "courses", key: "id" },
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
        },

        createdAt,
        updatedAt,
      }, { transaction });


      await transaction.commit();

    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  async down(queryInterface) {
    await queryInterface.dropTable("purchases");
    await queryInterface.dropTable("progress");
    await queryInterface.dropTable("resources");
    await queryInterface.dropTable("mux_data");
    await queryInterface.dropTable("sections");
    await queryInterface.dropTable("courses");
    await queryInterface.dropTable("sub_categories");
    await queryInterface.dropTable("levels");
    await queryInterface.dropTable("categories");
  },
};