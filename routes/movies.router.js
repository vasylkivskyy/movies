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
import multer from "multer";

const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 10 * 1024 },
});

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
  upload.single("file"),
  asyncWrapper(importMoviesController)
);

export { router as moviesRouter };
