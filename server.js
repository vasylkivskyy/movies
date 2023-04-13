import express from "express";
import sequelize from "./db/database.js";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
dotenv.config();

sequelize.sync({ force: true }).then(() => console.log("db is ready"));
import { usersRouter } from "./routes/users.router.js";
import { sessionsRouter } from "./routes/sessions.router.js";
import { moviesRouter } from "./routes/movies.router.js";

const app = express();

const APP_PORT = 8050;

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/api/v1/send/file", (req, res) => {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  res.sendFile(path.join(__dirname, "index.html"));
});

app.use("/api/v1/users", usersRouter);
app.use("/api/v1/sessions", sessionsRouter);
app.use("/api/v1/movies", moviesRouter);

app.use(function (err, req, res, next) {
  console.log("Error: ", err);
  res.status(500).send({ message: "Something went wrong" });
});

app.listen(APP_PORT, () => {
  console.log(`NodeJS app is listening on port ${APP_PORT}!`);
});
