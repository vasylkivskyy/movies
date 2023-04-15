import User from "../db/models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { code, status } from "../constants/constants.js";
import { getErrorResponse } from "../helpers/errorResponse.js";

export const userController = async (req, res) => {
  const user = await User.findOne({ where: { email: req.body.email } });
  if (!user) {
    const { name, email, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash(password, salt);

    await User.create({ name, email, password: hashPass });
    const token = jwt.sign({ email }, process.env.JWT_SECRET);
    return res.json({ token, status: status.SUCCESS });
  }
  const errorResponse = getErrorResponse(
    status.FAILURE,
    { email: code.notUnique },
    code.emailNotUnique
  );
  return res.json(errorResponse);
};
