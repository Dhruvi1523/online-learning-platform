import { DataTypes, Model } from "sequelize";
import {sequelize} from "../lib/sequelize";

export class Section extends Model {}

Section.init(
{
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },

  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  description: {
    type: DataTypes.TEXT,
  },

  videoUrl: {
    type: DataTypes.TEXT,
  },

  position: {
    type: DataTypes.INTEGER,
  },

  isPublished: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },

  isFree: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },

  courseId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
},
{
  sequelize,
  modelName: "Section",
  tableName: "sections",
  timestamps: true,
});