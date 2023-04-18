import { Movie, Actor } from "../db/models/index.js";
import { code, status, film } from "../constants/constants.js";
import { Op } from "sequelize";
import { getErrorResponse } from "../helpers/errorResponse.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import { upload } from "../helpers/multerUpload.js";
import sequelize from "../db/database.js";

export const createMoviesController = async (req, res) => {
  const { title, year, format, actors } = req.body;
  if (year < film.minYear) {
    res.status(400).json({
      message: `Year cannot be older than ${film.minYear}`,
    });
  }
  if (year > film.maxYear) {
    return res.status(400).json({ message: `Year cannot be in the future.` });
  }

  const existingMovie = await Movie.findOne({
    where: { title, year },
  });
  if (existingMovie) {
    const errorResponse = getErrorResponse(
      status.FAILURE,
      { title: code.notUnique },
      code.existingMovie
    );
    return res.json(errorResponse);
  }
  const movie = await Movie.create({ title, year, format });

  const actorInstances = await Promise.all(
    actors.map((actorName) =>
      Actor.findOrCreate({
        where: { name: actorName },
      })
    )
  );

  await movie.addActors(
    actorInstances.map((actor) => {
      console.log(`actor0: `, actor[0]);
      return actor[0];
    })
  );

  const savedMovie = await Movie.findOne({
    where: { id: movie.id },
    include: [{ model: Actor, through: { attributes: [] } }],
  });
  res.json({ data: savedMovie });
};

export const getMoviesController = async (req, res) => {
  const { title, actor, sort, order, limit, offset } = req.query;

  const validSortColumns = ["title", "year", "id"];
  const validOrders = ["ASC", "DESC"];
  const sanitizedSort = validSortColumns.includes(sort) ? sort : "id";
  const sanitizedOrder = validOrders.includes(order) ? order : "ASC";
  const orderClause =
    sanitizedSort === "title" ? "LOWER(title)" : sanitizedSort;
  const sanitizedLimit = parseInt(limit) || 20;
  const sanitizedOffset = parseInt(offset) || 0;

  const whereClause = {};
  if (actor) {
    whereClause["$actors.name$"] = actor;
  }
  if (title) {
    whereClause.title = { [Op.like]: `%${title}%` };
  }

  const { rows: movies, count } = await Movie.findAndCountAll({
    where: whereClause,
    include: {
      model: Actor,
      attributes: [],
    },
    distinct: true,
    order: [[sequelize.literal(orderClause), sanitizedOrder]],
    limit: sanitizedLimit,
    offset: sanitizedOffset,
  });

  res.status(200).json({
    data: movies,
    meta: { total: movies.length },
    status: status.SUCCESS,
  });
};

export const getMovieByIdController = async (req, res) => {
  const id = req.params.id;
  const movie = await Movie.findOne({
    where: { id },
    include: [
      {
        model: Actor,
        through: { attributes: [] },
      },
    ],
  });
  if (!movie) {
    const errorResponse = getErrorResponse(
      status.FAILURE,
      { id },
      code.notFoundMovie
    );
    return res.json(errorResponse);
  }
  res.json({ data: movie });
};

export const deleteMovieByIdController = async (req, res) => {
  const { id } = req.params;

  const movie = await Movie.findByPk(id);

  if (!movie) {
    const errorResponse = getErrorResponse(
      status.FAILURE,
      { id },
      code.notFoundMovie
    );
    return res.json(errorResponse);
  }

  await movie.destroy();

  res.json({ status: status.SUCCESS });
};

export const updateMovieByIdController = async (req, res) => {
  const movieId = req.params.id;
  const { title, year, format, actors } = req.body;

  const movie = await Movie.findByPk(movieId);

  if (!movie) {
    return res.json({
      status: status.FAILURE,
      error: {
        fields: {
          id: movieId,
        },
        code: code.notFoundMovie,
      },
    });
  }

  movie.title = title || movie.title;
  movie.year = year || movie.year;
  movie.format = format || movie.format;
  await movie.save();

  if (actors && actors.length > 0) {
    const actorInstances = await Promise.all(
      actors.map((actorName) =>
        Actor.findOrCreate({
          where: { name: actorName },
        })
      )
    );
    await movie.setActors(actorInstances.map((actor) => actor[0]));
  }

  const updatedMovie = await Movie.findOne({
    where: { id: movieId },
    include: [
      {
        model: Actor,
        through: { attributes: [] },
      },
    ],
  });

  res.json({ data: updatedMovie, status: status.SUCCESS });
};

export const importMoviesController = async (req, res) => {
  upload(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: err.message });
    } else if (err) {
      return res.status(400).json({ error: err.message });
    }
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const filePath = path.join(__dirname, "..", req.file.path);
    const fileContents = fs.readFileSync(filePath, "utf-8");
    const movies = [];

    const movieRegex =
      /Title: (.+)\nRelease Year: (\d{4})\nFormat: (.+)\nStars: (.+)\n/g;
    let match;

    while ((match = movieRegex.exec(fileContents)) !== null) {
      const movie = {
        title: match[1],
        "Release Year": match[2],
        Format: match[3],
        Stars: match[4],
      };
      movies.push(movie);
    }
    const savedMovies = [];
    for (const movie of movies) {
      const [savedMovie, created] = await Movie.findOrCreate({
        where: {
          title: movie.title,
          year: movie["Release Year"],
        },
        defaults: {
          title: movie.title,
          year: movie["Release Year"],
          format: movie.Format,
        },
      });
      if (!created) {
        savedMovie.format = movie.Format;
        await savedMovie.save();
      }
      savedMovies.push(savedMovie);
    }
    await fs.promises.unlink(filePath);

    res.json({
      data: savedMovies,
      meta: {
        imported: savedMovies.length,
        total: savedMovies.length,
      },
      status: status.SUCCESS,
    });
  });
};
