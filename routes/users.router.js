import { Router } from "express";
const router = Router();
import { userController } from "../controllers/users.controller.js";
import { asyncWrapper } from "../helpers/async-wrapper.js";

router.post("/", asyncWrapper(userController));

export { router as usersRouter };
