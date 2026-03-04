import { DataTypes, Model } from "sequelize";
import {sequelize} from "../lib/sequelize";

export class Purchase extends Model {}

Purchase.init(
{
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },

  customerId: {
    type: DataTypes.STRING,
  },

  courseId: {
    type: DataTypes.UUID,
  },
},
{
  sequelize,
  modelName: "Purchase",
  tableName: "purchases",
  timestamps: true,
});