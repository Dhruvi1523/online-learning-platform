import { DataTypes, Model } from "sequelize";
import {sequelize} from "../lib/sequelize";

export class SubCategory extends Model {}

SubCategory.init(
{
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },

  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  categoryId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
},
{
  sequelize,
  modelName: "SubCategory",
  tableName: "sub_categories",
  timestamps: false,
});