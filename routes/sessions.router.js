import { Router } from "express";
const router = Router();
import { sessionsController } from "../controllers/sessions.controller.js";
import { asyncWrapper } from "../helpers/async-wrapper.js";

router.post("/", asyncWrapper(sessionsController));

export { router as sessionsRouter };
