import { DataTypes, Model } from "sequelize";
import {sequelize} from "../lib/sequelize";

export class Course extends Model {}

Course.init(
{
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },

  instructorId: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  title: {
    type: DataTypes.TEXT,
    allowNull: false,
  },

  subtitle: {
    type: DataTypes.TEXT,
  },

  description: {
    type: DataTypes.TEXT,
  },

  imageUrl: {
    type: DataTypes.TEXT,
  },

  price: {
    type: DataTypes.FLOAT,
  },

  isPublished: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },

  categoryId: {
    type: DataTypes.UUID,
    allowNull: false,
  },

  subCategoryId: {
    type: DataTypes.UUID,
    allowNull: false,
  },

  levelId: {
    type: DataTypes.UUID,
  },
},
{
  sequelize,
  modelName: "Course",
  tableName: "courses",
  timestamps: true,
});