import User from "../db/models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { code, status } from "../constants/constants.js";
import { getErrorResponse } from "../helpers/errorResponse.js";

export const userController = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  const user = await User.findOne({ where: { email: email } });

  if (!user) {
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
