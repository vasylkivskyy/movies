import Sequilize from "sequelize";

const sequilize = new Sequilize("movies-db", "user", "password", {
  dialect: "sqlite",
  host: "./dev.sqlite",
  transactionType: "IMMEDIATE",
  // pool: {
  //   max: 100,
  //   min: 0,
  //   // @note https://github.com/sequelize/sequelize/issues/8133#issuecomment-359993057
  //   acquire: 100 * 1000,
  // },
});

export default sequilize;
