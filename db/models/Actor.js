import { Model, DataTypes } from "sequelize";
import sequelize from "../database.js";

export class Actor extends Model {}

Actor.init(
  {
    name: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    modelName: "Actor",
  }
);
