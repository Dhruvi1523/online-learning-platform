import { DataTypes, Model } from "sequelize";
import {sequelize} from "../lib/sequelize";

export class Category extends Model {}

Category.init(
{
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },

  name: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
},
{
  sequelize,
  modelName: "Category",
  tableName: "categories",
  timestamps: false,
});