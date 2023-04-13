import Datatypes, { Model } from "sequelize";
import sequelize from "../database.js";

class User extends Model {}

User.init(
  {
    name: {
      type: Datatypes.STRING,
    },
    email: {
      type: Datatypes.STRING,
    },
    password: {
      type: Datatypes.STRING,
    },
  },
  { sequelize, modelName: "user", timestamps: false }
);

export default User;
