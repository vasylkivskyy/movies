import User from "../db/models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { status, code } from "../constants/statuses.js";
import { getErrorResponse } from "../helpers/errorResponse.js";

const failedMessage = getErrorResponse(
  status.FAILURE,
  { email: code.failedAuthMessage, password: code.failedAuthMessage },
  code.failedAuthMessage
);

export const sessionsController = async (req, res) => {
  const user = await User.findOne({ where: { email: req.body.email } });
  if (user) {
    const verified = await bcrypt.compare(req.body.password, user.password);
    if (verified) {
      const token = jwt.sign({ email: req.body.email }, process.env.JWT_SECRET);

      return res.json({ token, status: status.SUCCESS });
    } else {
      return res.json(failedMessage);
    }
  } else {
    return res.json(failedMessage);
  }
};
