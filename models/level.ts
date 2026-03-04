import { DataTypes, Model } from "sequelize";
import { sequelize } from "../lib/sequelize";

export class Level extends Model {}

Level.init(
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
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
  },
  {
    sequelize,
    modelName: "Level",
    tableName: "levels",
    timestamps: true,
  }
);
