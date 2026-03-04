import { DataTypes, Model } from "sequelize";
import {sequelize} from "../lib/sequelize";

export class MuxData extends Model {}

MuxData.init(
{
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },

  assetId: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  playbackId: {
    type: DataTypes.STRING,
  },

  sectionId: {
    type: DataTypes.UUID,
    unique: true,
  },
},
{
  sequelize,
  modelName: "MuxData",
  tableName: "mux_data",
  timestamps: false,
});