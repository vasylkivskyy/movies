import { Model, DataTypes } from "sequelize";
import sequelize from "../database.js";

export class Movie extends Model {}

Movie.init(
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    format: {
      type: DataTypes.ENUM("DVD", "Blu-ray", "VHS"),
    },
  },
  {
    sequelize,
    modelName: "Movie",
  }
);
