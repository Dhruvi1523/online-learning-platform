import { DataTypes, Model } from "sequelize";
import {sequelize} from "../lib/sequelize";

export class Progress extends Model {}

Progress.init(
{
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },

  studentId: {
    type: DataTypes.STRING,
  },

  sectionId: {
    type: DataTypes.UUID,
  },

  isCompleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
},
{
  sequelize,
  modelName: "Progress",
  tableName: "progress",
  timestamps: true,
});