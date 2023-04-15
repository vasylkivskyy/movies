import { Router } from "express";
const router = Router();
import {
  getMoviesController,
  getMovieByIdController,
  createMoviesController,
  deleteMovieByIdController,
  updateMovieByIdController,
  importMoviesController,
} from "../controllers/movies.controller.js";
import { authenticateJWT } from "../middlewares/authenticateJWT.js";
import { asyncWrapper } from "../helpers/async-wrapper.js";

router.get(
  "/",
  asyncWrapper(authenticateJWT),
  asyncWrapper(getMoviesController)
);

router.get(
  "/:id",
  asyncWrapper(authenticateJWT),
  asyncWrapper(getMovieByIdController)
);

router.post(
  "/",
  asyncWrapper(authenticateJWT),
  asyncWrapper(createMoviesController)
);

router.delete(
  "/:id",
  asyncWrapper(authenticateJWT),
  asyncWrapper(deleteMovieByIdController)
);

router.patch(
  "/:id",
  asyncWrapper(authenticateJWT),
  asyncWrapper(updateMovieByIdController)
);

router.post(
  "/import",
  //asyncWrapper(authenticateJWT),
  asyncWrapper(importMoviesController)
);

export { router as moviesRouter };
