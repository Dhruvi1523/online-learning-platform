import { DataTypes, Model } from "sequelize";
import {sequelize} from "../lib/sequelize";

export class Resource extends Model {}

Resource.init(
{
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },

  name: {
    type: DataTypes.STRING,
  },

  fileUrl: {
    type: DataTypes.STRING,
  },

  sectionId: {
    type: DataTypes.UUID,
  },
},
{
  sequelize,
  modelName: "Resource",
  tableName: "resources",
  timestamps: true,
});